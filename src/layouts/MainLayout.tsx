import { useState } from 'react'
import { Layout, Menu, Input, Dropdown, Avatar, Space, Button, MenuProps } from 'antd'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  ApartmentOutlined,
  SearchOutlined,
  GlobalOutlined,
  UserOutlined,
  LogoutOutlined,
  AppstoreOutlined,
} from '@ant-design/icons'
import { authService } from '../utils/auth'
import { i18n } from '../utils/i18n'
import type { Language } from '../utils/i18n'
import './MainLayout.scss'

const { Header, Sider, Content } = Layout

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [language, setLanguage] = useState<Language>(i18n.getLanguage())
  const navigate = useNavigate()
  const location = useLocation()
  const user = authService.getCurrentUser()
  const t = i18n.getTranslations(language)

  const menuItems = [
    {
      key: '/home',
      icon: <HomeOutlined />,
      label: t.home,
    },
    {
      key: '/ingredient',
      icon: <AppstoreOutlined />,
      label: t.ingredient,
    },
    {
      key: '/flow',
      icon: <ApartmentOutlined />,
      label: t.flow,
    },
    {
      key: '/about',
      icon: <InfoCircleOutlined />,
      label: t.about,
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    i18n.setLanguage(lang)
    window.location.reload() // 简单刷新以更新所有文本
  }

  const languageMenuItems: MenuProps['items'] = [
    {
      key: 'zh',
      label: '中文',
      onClick: () => handleLanguageChange('zh'),
    },
    {
      key: 'en',
      label: 'English',
      onClick: () => handleLanguageChange('en'),
    },
  ]

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'user',
      label: (
        <div>
          <div>
            {t.welcome}, {user?.username}
          </div>
        </div>
      ),
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t.logout,
      onClick: handleLogout,
    },
  ]

  const handleSearch = (value: string) => {
    console.log('搜索:', value)
    // 这里可以实现搜索功能
  }

  return (
    <Layout className="main-layout">
      <Sider trigger={null} collapsible collapsed={collapsed} className="layout-sider">
        <div className="logo">{!collapsed ? 'React Demo' : 'RD'}</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 280, transition: 'margin-left 0.2s' }}>
        <Header className="layout-header">
          <div className="header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="trigger"
            />
            <Input.Search
              placeholder={t.search}
              allowClear
              onSearch={handleSearch}
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
            />
          </div>
          <div className="header-right">
            <Space size="middle">
              <Dropdown menu={{ items: languageMenuItems }} placement="bottomRight">
                <Button icon={<GlobalOutlined />} type="text">
                  {language === 'zh' ? '中文' : 'English'}
                </Button>
              </Dropdown>
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Space style={{ cursor: 'pointer' }}>
                  <Avatar icon={<UserOutlined />} />
                  <span>{user?.username}</span>
                </Space>
              </Dropdown>
            </Space>
          </div>
        </Header>
        <Content className="layout-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout

