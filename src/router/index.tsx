import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'
import About from '../pages/About'
import Flow from '../pages/Flow'
import Ingredient from '../pages/Ingredient'
import ProtectedRoute from '../components/ProtectedRoute'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'flow',
        element: <Flow />,
      },
      {
        path: 'ingredient',
        element: <Ingredient />,
      },
    ],
  },
])

export default router

