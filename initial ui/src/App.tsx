import { useState } from 'react'
import Dashboard from './views/Dashboard'
import LogisticsManagers from './views/LogisticsManagers'
import Sites from './views/Sites'
import ClockHistory from './views/ClockHistory'
import Employees from './views/Employees'
import Gatekeepers from './views/Gatekeepers'
import Gates from './views/Gates'

type View = 'dashboard' | 'logistics' | 'employees' | 'gatekeepers' | 'sites' | 'gates' | 'clock-history'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { id: 'logistics', label: 'Logistics Managers', icon: LogisticsIcon },
  { id: 'employees', label: 'Employees', icon: EmployeesIcon },
  { id: 'gatekeepers', label: 'Gatekeepers', icon: GatekeepersIcon },
  { id: 'sites', label: 'Sites', icon: SitesIcon },
  { id: 'gates', label: 'Gates', icon: GatesIcon },
]

export default function App() {
  const [activeView, setActiveView] = useState<View>('dashboard')
  const [clockHistoryEmployee, setClockHistoryEmployee] = useState<string | null>(null)

  const navigate = (view: View, employee?: string) => {
    setActiveView(view)
    if (employee) setClockHistoryEmployee(employee)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#f0f2f5' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220,
        minWidth: 220,
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 12px',
        borderRight: '1px solid #e5e7eb',
        gap: 4,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px 20px' }}>
          <ClonijaLogo />
          <span style={{ fontWeight: 700, fontSize: 18, color: '#111827', letterSpacing: '-0.02em' }}>Clonija</span>
        </div>

        {/* Nav items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = activeView === item.id
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id as View)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 12px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  background: isActive ? '#eff6ff' : 'transparent',
                  color: isActive ? '#2563eb' : '#6b7280',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 14,
                  textAlign: 'left',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = '#f9fafb' }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <Icon size={18} color={isActive ? '#2563eb' : '#9ca3af'} />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Bottom nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, borderTop: '1px solid #f3f4f6', paddingTop: 12 }}>
          <button style={bottomNavStyle}>
            <ProfileIcon size={16} color="#9ca3af" />
            Profile Setting
          </button>
          <button style={bottomNavStyle}>
            <LogoutIcon size={16} color="#9ca3af" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <header style={{
          height: 64,
          background: activeView === 'dashboard' ? 'transparent' : '#fff',
          borderBottom: activeView === 'dashboard' ? 'none' : '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          gap: 16,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: '8px 14px',
            flex: 1,
            maxWidth: 320,
          }}>
            <SearchIcon size={16} color="#9ca3af" />
            <input
              placeholder="Search..."
              style={{ border: 'none', outline: 'none', fontSize: 14, color: '#374151', background: 'transparent', width: '100%' }}
            />
          </div>
          <div style={{ flex: 1 }} />
          <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 8 }}>
            <BellIcon size={22} color="#6b7280" />
            <span style={{
              position: 'absolute', top: 6, right: 6, width: 8, height: 8,
              background: '#3b82f6', borderRadius: '50%', border: '2px solid #fff'
            }} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, #93c5fd, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <UserAvatar />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', lineHeight: 1.2 }}>Richard Mile</div>
              <div style={{ fontSize: 11, color: '#9ca3af', lineHeight: 1.2 }}>richard@gmail.com</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: 'auto', padding: activeView === 'clock-history' ? 0 : 0 }}>
          {activeView === 'dashboard' && <Dashboard onNavigate={navigate} />}
          {activeView === 'logistics' && <LogisticsManagers />}
          {activeView === 'employees' && <Employees onNavigate={navigate} />}
          {activeView === 'gatekeepers' && <Gatekeepers />}
          {activeView === 'sites' && <Sites />}
          {activeView === 'gates' && <Gates />}
          {activeView === 'clock-history' && <ClockHistory employee={clockHistoryEmployee} onBack={() => navigate('employees')} />}
        </main>
      </div>
    </div>
  )
}

const bottomNavStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '9px 12px',
  borderRadius: 8,
  border: 'none',
  cursor: 'pointer',
  background: 'transparent',
  color: '#6b7280',
  fontSize: 14,
  textAlign: 'left',
}

// ── Icons ──────────────────────────────────────────────────────────────────

function ClonijaLogo() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <rect width="30" height="30" rx="8" fill="#2563eb" />
      <path d="M8 15 L15 8 L22 15 L15 12 Z" fill="white" opacity="0.9" />
      <path d="M8 15 L15 22 L22 15 L15 18 Z" fill="white" opacity="0.6" />
    </svg>
  )
}

function UserAvatar() {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
      <rect width="38" height="38" fill="#dbeafe" />
      <circle cx="19" cy="14" r="7" fill="#93c5fd" />
      <ellipse cx="19" cy="36" rx="13" ry="10" fill="#93c5fd" />
    </svg>
  )
}

function SearchIcon({ size = 16, color = '#9ca3af' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function BellIcon({ size = 22, color = '#6b7280' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function DashboardIcon({ size = 18, color = '#9ca3af' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function LogisticsIcon({ size = 18, color = '#9ca3af' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  )
}

function EmployeesIcon({ size = 18, color = '#9ca3af' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function GatekeepersIcon({ size = 18, color = '#9ca3af' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function SitesIcon({ size = 18, color = '#9ca3af' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </svg>
  )
}

function GatesIcon({ size = 18, color = '#9ca3af' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  )
}

function ProfileIcon({ size = 16, color = '#9ca3af' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}

function LogoutIcon({ size = 16, color = '#9ca3af' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}
