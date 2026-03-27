import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

import Login           from './pages/Login'
import Register        from './pages/Register'
import Dashboard       from './pages/Dashboard'
import NouvelArticle   from './pages/NouvelArticle'
import DetailArticle   from './pages/DetailArticle'
import ModifierArticle from './pages/ModifierArticle'
import Amis            from './pages/Amis'

function PrivateRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/" />
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                  element={<Login />} />
        <Route path="/register"          element={<Register />} />
        <Route path="/dashboard"         element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/amis"              element={<PrivateRoute><Amis /></PrivateRoute>} />
        <Route path="/articles/new"      element={<PrivateRoute><NouvelArticle /></PrivateRoute>} />
        <Route path="/articles/edit/:id" element={<PrivateRoute><ModifierArticle /></PrivateRoute>} />
        <Route path="/articles/:id"      element={<PrivateRoute><DetailArticle /></PrivateRoute>} />
        <Route path="*"                  element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}