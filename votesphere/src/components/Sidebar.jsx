import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, BarChart3, UserCircle, LogOut, Menu, X } from 'lucide-react'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/candidates', label: 'Candidates', icon: Users },
  { to: '/admin/results', label: 'Results', icon: BarChart3 },
  { to: '/profile', label: 'Profile', icon: UserCircle },
]

export default function Sidebar() {
  const { logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  const content = (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-6 pb-8">
        <Logo variant="light" size="sm" />
        <p className="text-xs text-ink-400 mt-2 tracking-wide">Election Administration</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors ${
                isActive ? 'bg-ink-800 text-white' : 'text-ink-300 hover:bg-ink-800/60 hover:text-white'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium text-ink-300 hover:bg-ink-800/60 hover:text-white transition-colors"
        >
          <LogOut size={17} />
          Log out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between bg-ink-900 px-4 h-14">
        <Logo variant="light" size="sm" />
        <button className="text-white" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-ink-950/50" onClick={() => setOpen(false)} />
          <div className="relative w-64 bg-ink-900 h-full shadow-raised">
            <button
              className="absolute top-4 right-4 text-ink-300"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
            {content}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-ink-900 h-screen sticky top-0">{content}</aside>
    </>
  )
}
