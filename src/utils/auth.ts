export interface User {
  id: number
  username: string
  name: string
  loginTime?: string
}

interface LoginResponse {
  success: boolean
  data?: {
    id: number
    name: string
    username: string
  }
  message?: string
}

const USER_KEY = 'user'

export const authService = {
  // 登录
  login: async (
    username: string,
    password: string
  ): Promise<{ success: boolean; user?: User; message?: string }> => {
    try {
      // 调用真实登录接口（登录接口不需要 x-chef-id）
      const response = await fetch('/api/chefs/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      // 检查 HTTP 状态码
      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = '登录失败'
        try {
          const errorJson = JSON.parse(errorText)
          errorMessage = errorJson.message || errorMessage
        } catch {
          errorMessage = `请求失败: ${response.status} ${response.statusText}`
        }
        return { success: false, message: errorMessage }
      }

      const result: LoginResponse = await response.json()

      if (result.success && result.data) {
        const user: User = {
          id: result.data.id,
          username: result.data.username,
          name: result.data.name,
          loginTime: new Date().toISOString(),
        }
        sessionStorage.setItem(USER_KEY, JSON.stringify(user))
        return { success: true, user, message: result.message }
      } else {
        return { success: false, message: result.message || '登录失败' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: '网络错误，请稍后重试' }
    }
  },

  // 登出
  logout: (): void => {
    sessionStorage.removeItem(USER_KEY)
  },

  // 获取当前用户
  getCurrentUser: (): User | null => {
    const userStr = sessionStorage.getItem(USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  },

  // 检查是否已登录
  isAuthenticated: (): boolean => {
    return !!sessionStorage.getItem(USER_KEY)
  },
}

