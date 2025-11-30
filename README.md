# React Demo Project

基于 React 19 + Vite 7 + TypeScript 的项目模板

## 技术栈

- React ^19
- React Router DOM ^7
- Vite ^7
- @xyflow/react ^12
- Redux ^5
- Ant Design ^6
- TypeScript ^5

## 功能特性

- 路由和路由访问控制
- 登录认证（sessionStorage）
- 多页面支持（登录、Home、About、React Flow）
- Redux 状态管理
- 多语言切换
- 响应式布局（顶部导航 + 左侧菜单 + 内容区）
- API 代理配置（/api 请求代理到 http://localhost:3000）

## 安装依赖

```bash
npm install
```

## 启动开发服务器

```bash
npm run dev
```

开发服务器将在 http://localhost:3002 启动

## 构建生产版本

```bash
npm run build
```

## API 代理

所有以 `/api` 开头的请求会自动代理到 `http://localhost:3000`

例如：`/api/users` → `http://localhost:3000/users`

