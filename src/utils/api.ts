import { authService } from './auth'

interface RequestOptions extends RequestInit {
  skipAuth?: boolean // 是否跳过添加 x-chef-id header（用于登录接口）
}

/**
 * 封装的 fetch 函数，自动添加 x-chef-id header
 */
export const apiRequest = async (
  url: string,
  options: RequestOptions = {}
): Promise<Response> => {
  const { skipAuth = false, headers = {}, ...restOptions } = options

  // 构建请求头
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  }

  // 如果不需要跳过认证，且用户已登录，添加 x-chef-id
  if (!skipAuth) {
    const user = authService.getCurrentUser()
    if (user) {
      requestHeaders['x-chef-id'] = user.id.toString()
    }
  }

  return fetch(url, {
    ...restOptions,
    headers: requestHeaders,
  })
}

/**
 * GET 请求
 */
export const apiGet = async <T = any>(
  url: string,
  params?: Record<string, any>
): Promise<T> => {
  let finalUrl = url
  if (params) {
    const searchParams = new URLSearchParams()
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        searchParams.append(key, params[key].toString())
      }
    })
    const queryString = searchParams.toString()
    if (queryString) {
      finalUrl += `?${queryString}`
    }
  }

  const response = await apiRequest(finalUrl, { method: 'GET' })
  return handleResponse<T>(response)
}

/**
 * POST 请求
 */
export const apiPost = async <T = any>(url: string, data?: any): Promise<T> => {
  const response = await apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return handleResponse<T>(response)
}

/**
 * PUT 请求
 */
export const apiPut = async <T = any>(url: string, data?: any): Promise<T> => {
  const response = await apiRequest(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return handleResponse<T>(response)
}

/**
 * DELETE 请求
 */
export const apiDelete = async <T = any>(url: string): Promise<T> => {
  const response = await apiRequest(url, { method: 'DELETE' })
  return handleResponse<T>(response)
}

/**
 * 处理响应
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text()
    let errorMessage = '请求失败'
    try {
      const errorJson = JSON.parse(errorText)
      errorMessage = errorJson.message || errorMessage
    } catch {
      errorMessage = `请求失败: ${response.status} ${response.statusText}`
    }
    throw new Error(errorMessage)
  }

  return response.json()
}

