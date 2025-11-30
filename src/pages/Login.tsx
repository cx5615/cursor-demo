import { useState } from 'react'
import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { authService } from '../utils/auth'
import { i18n } from '../utils/i18n'
import './Login.scss'

interface LoginFormValues {
  username: string
  password: string
}

const Login = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const language = i18n.getLanguage()
  const t = i18n.getTranslations(language)

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true)
    try {
      const result = await authService.login(values.username, values.password)
      if (result.success) {
        message.success(result.message || t.loginSuccess)
        navigate('/home')
      } else {
        message.error(result.message || t.loginFailed)
      }
    } catch (error) {
      message.error(t.loginFailed)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <Card className="login-card" title={t.loginTitle}>
        <Form name="login" onFinish={onFinish} autoComplete="off" size="large">
          <Form.Item
            name="username"
            rules={[{ required: true, message: `请输入${t.username}` }]}
          >
            <Input prefix={<UserOutlined />} placeholder={t.username} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: `请输入${t.password}` }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder={t.password} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {t.loginButton}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login

