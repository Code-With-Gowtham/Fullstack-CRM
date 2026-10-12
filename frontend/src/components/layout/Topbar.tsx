import { Search, Bell, ChevronDown, LogOut, User } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { notifications } from '@/mock/data'
import type { Role } from '@/types'

const roleLabels: Record<Role, string> = {
  admin: 'Administrator',
  manager: 'Sales Manager',
  sales: 'Sales Executive',
  support: 'Support Agent',
}

export function Topbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [openMenu, setOpenMenu] = useState(false)
  const [openNotif, setOpenNotif] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenu(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setOpenNotif(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!user) return null
  const unread = notifications.filter((n) => !n.read).length

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-ink-200 bg-white/80 px-6 backdrop-blur">
      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          type="search"
          placeholder="Search customers, leads, conversations..."
          className="input pl-9"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setOpenNotif((v) => !v)}
            className="relative rounded-lg p-2 text-ink-600 hover:bg-ink-100"
          >
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                {unread}
              </span>
            )}
          </button>
          {openNotif && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-ink-200 bg-white shadow-soft">
              <div className="border-b border-ink-100 px-4 py-3">
                <p className="text-sm font-semibold">Notifications</p>
                <p className="text-xs text-ink-500">{unread} unread</p>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.slice(0, 5).map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      setOpenNotif(false)
                      navigate(n.link ?? '/notifications')
                    }}
                    className="flex w-full items-start gap-3 border-b border-ink-100 px-4 py-3 text-left hover:bg-ink-50"
                  >
                    {!n.read && <span className="mt-1.5 h-2 w-2 rounded-full bg-brand-500" />}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ink-900">{n.title}</p>
                      <p className="mt-0.5 text-xs text-ink-500">{n.body}</p>
                      <p className="mt-1 text-[11px] text-ink-400">{n.createdAt}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={menuRef}>
          <button onClick={() => setOpenMenu((v) => !v)} className="flex items-center gap-2 rounded-lg p-1 hover:bg-ink-100">
            <Avatar name={user.name} color={user.avatarColor} />
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium text-ink-900">{user.name}</p>
              <p className="text-xs text-ink-500">{roleLabels[user.role]}</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-ink-500 md:block" />
          </button>
          {openMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-ink-200 bg-white p-1 shadow-soft">
              <div className="border-b border-ink-100 px-3 py-2">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-ink-500">{user.email}</p>
              </div>
              <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-ink-50">
                <User className="h-4 w-4" /> Profile
              </button>
              <button
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
