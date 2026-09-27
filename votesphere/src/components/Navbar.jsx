import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogOut, Menu, X } from 'lucide-react'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'
import { getInitials } from '../utils/format'

const voterLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/candidates', label: 'Vote' },
  { to: '/results', label: 'Results' },
  { to: '/profile', label: 'Profile' },
]

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  const links = isAuthenticated && !isAdmin ? voterLinks : []

  return (
    <header className="sticky top-0 z-40 bg-paper-100/90 backdrop-blur border-b border-ink-100">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link to={isAuthenticated ? (isAdmin ? '/admin' : '/dashboard') : '/'}>
          <Logo size="sm" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3.5 py-2 text-sm font-medium rounded-sm transition-colors ${
                  isActive ? 'text-ink-900 bg-ink-100' : 'text-ink-500 hover:text-ink-900 hover:bg-ink-50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 pl-1">
                <span className="h-8 w-8 rounded-full bg-ink-900 text-gold-300 text-xs font-semibold flex items-center justify-center">
                  {getInitials(user?.name)}
                </span>
                <span className="text-sm font-medium text-ink-700 max-w-[140px] truncate">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-ink-500 hover:text-signal-500 transition-colors"
              >
                <LogOut size={15} /> Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-ink-700 hover:text-ink-900 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-ink-900 hover:bg-ink-800 rounded-sm transition-colors"
              >
                Register to vote
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-ink-700" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-ink-100 bg-paper-100 px-5 py-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2.5 text-sm font-medium rounded-sm ${
                  isActive ? 'text-ink-900 bg-ink-100' : 'text-ink-600'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-signal-500"
            >
              <LogOut size={15} /> Log out
            </button>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link to="/login" onClick={() => setOpen(false)} className="px-3 py-2.5 text-sm font-medium text-ink-700">
                Log in
              </Link>
              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-center text-white bg-ink-900 rounded-sm"
              >
                Register to vote
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
