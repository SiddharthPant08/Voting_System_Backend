import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FullPageLoader } from './LoadingSpinner'

export default function AdminRoute() {
  const { isAuthenticated, isAdmin, initializing } = useAuth()

  if (initializing) return <FullPageLoader />

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/unauthorized" replace />

  return <Outlet />
}
