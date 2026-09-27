import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import MainLayout from './layouts/MainLayout'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Candidates from './pages/Candidates'
import Results from './pages/Results'
import Profile from './pages/Profile'
import ChangePassword from './pages/ChangePassword'
import Unauthorized from './pages/Unauthorized'
import NotFound from './pages/NotFound'

import AdminDashboard from './pages/admin/AdminDashboard'
import ManageCandidates from './pages/admin/ManageCandidates'
import AddCandidate from './pages/admin/AddCandidate'
import EditCandidate from './pages/admin/EditCandidate'

// NOTE: BrowserRouter and AuthProvider are mounted once in main.jsx and wrap
// this component, so they are not repeated here.

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontSize: '14px',
            borderRadius: '8px',
            border: '1px solid #DDE2EB',
            color: '#10192B',
            padding: '10px 14px',
          },
          success: { iconTheme: { primary: '#2F6B4F', secondary: '#FBFAF6' } },
          error: { iconTheme: { primary: '#A63D2F', secondary: '#FBFAF6' } },
        }}
      />

      <Routes>
        {/* Public + authenticated voter pages share the top-nav MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Authenticated voter routes (admins can also reach these) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/results" element={<Results />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/change-password" element={<ChangePassword />} />
          </Route>
        </Route>

        {/* Admin-only pages use the sidebar DashboardLayout */}
        <Route element={<AdminRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/candidates" element={<ManageCandidates />} />
            <Route path="/admin/candidates/new" element={<AddCandidate />} />
            <Route path="/admin/candidates/:candidateId/edit" element={<EditCandidate />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
