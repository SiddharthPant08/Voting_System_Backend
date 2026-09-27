import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-paper-100">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
