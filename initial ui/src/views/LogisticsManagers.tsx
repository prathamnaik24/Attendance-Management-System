import { useState } from 'react'

interface Manager {
  id: number
  name: string
  email: string
  phone: string
  sites: string[]
  status: 'Active' | 'Inactive'
  initials: string
  color: string
}

const initialManagers: Manager[] = [
  { id: 1, name: 'Riley-James', email: 'john@example.com', phone: '+1 234-567-8901', sites: ['Site A', 'Site B'], status: 'Active', initials: 'RJ', color: '#fef3c7' },
  { id: 2, name: 'Riley-James', email: 'john@example.com', phone: '+1 234-567-8901', sites: ['Site A', 'Site B'], status: 'Inactive', initials: 'RJ', color: '#f3f4f6' },
  { id: 3, name: 'Riley-James', email: 'john@example.com', phone: '+1 234-567-8901', sites: ['Site A', 'Site B'], status: 'Active', initials: 'RJ', color: '#dbeafe' },
  { id: 4, name: 'Riley-James', email: 'john@example.com', phone: '+1 234-567-8901', sites: ['Site A', 'Site B'], status: 'Active', initials: 'RJ', color: '#d1fae5' },
  { id: 5, name: 'Riley-James', email: 'john@example.com', phone: '+1 234-567-8901', sites: ['Site A', 'Site B'], status: 'Active', initials: 'RJ', color: '#ede9fe' },
  { id: 6, name: 'Riley-James', email: 'john@example.com', phone: '+1 234-567-8901', sites: ['Site A', 'Site B'], status: 'Active', initials: 'RJ', color: '#fce7f3' },
  { id: 7, name: 'Riley-James', email: 'john@example.com', phone: '+1 234-567-8901', sites: ['Site A', 'Site B'], status: 'Active', initials: 'RJ', color: '#fef3c7' },
]

export default function LogisticsManagers() {
  const [managers, setManagers] = useState<Manager[]>(initialManagers)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [showFilter, setShowFilter] = useState('All')

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', sites: '', active: true
  })

  const filtered = managers.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = showFilter === 'All' || m.status === showFilter
    return matchSearch && matchFilter
  })

  const handleCreate = () => {
    if (!form.fullName) return
    const newManager: Manager = {
      id: managers.length + 1,
      name: form.fullName,
      email: form.email || 'john@example.com',
      phone: form.phone || '+1 234-567-8901',
      sites: form.sites ? form.sites.split(',').map(s => s.trim()) : ['Site A'],
      status: form.active ? 'Active' : 'Inactive',
      initials: form.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      color: '#dbeafe',
    }
    setManagers(prev => [newManager, ...prev])
    setShowModal(false)
    setForm({ fullName: '', email: '', phone: '', sites: '', active: true })
  }

  const toggleStatus = (id: number) => {
    setManagers(prev => prev.map(m =>
      m.id === id ? { ...m, status: m.status === 'Active' ? 'Inactive' : 'Active' } : m
    ))
  }

  return (
    <div style={{ padding: 24, height: '100%' }}>
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '20px 24px', gap: 12, borderBottom: '1px solid #f3f4f6' }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0, flex: 1 }}>Logistics Managers</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px' }}>
            <SearchIcon />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              style={{ border: 'none', outline: 'none', fontSize: 13, background: 'transparent', color: '#374151', width: 160 }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, color: '#6b7280' }}>Show:</span>
            <select
              value={showFilter}
              onChange={e => setShowFilter(e.target.value)}
              style={{ fontSize: 13, color: '#374151', border: '1px solid #e5e7eb', borderRadius: 8, padding: '6px 10px', background: '#fff', cursor: 'pointer', outline: 'none' }}
            >
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#2563eb', color: '#fff', border: 'none',
              borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            + Create Manager
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['Name', 'Email', 'Phone', 'Assigned Sites', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{
                    padding: '11px 20px', textAlign: 'left', fontSize: 13,
                    fontWeight: 600, color: '#374151', borderBottom: '1px solid #f3f4f6',
                    whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #f9fafb' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#fafafa'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}
                >
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%', background: m.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 600, color: '#374151', flexShrink: 0,
                      }}>{m.initials}</div>
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{m.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: '#6b7280' }}>{m.email}</td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: '#6b7280' }}>{m.phone}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {m.sites.map(s => (
                        <span key={s} style={{ fontSize: 12, background: '#f3f4f6', color: '#374151', padding: '3px 10px', borderRadius: 20, fontWeight: 500 }}>{s}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20,
                      background: m.status === 'Active' ? '#d1fae5' : '#fee2e2',
                      color: m.status === 'Active' ? '#15803d' : '#dc2626',
                    }}>{m.status}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <button title="View" style={actionBtn}>
                        <EyeIcon />
                      </button>
                      <button title="Edit" style={actionBtn}>
                        <EditIcon />
                      </button>
                      <button title="Toggle Status" onClick={() => toggleStatus(m.id)} style={actionBtn}>
                        <PowerIcon active={m.status === 'Active'} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
          backdropFilter: 'blur(2px)',
        }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}
        >
          <div style={{
            background: '#fff', borderRadius: 16, width: 620, maxWidth: '90vw',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden',
          }}>
            {/* Modal header */}
            <div style={{ background: '#2563eb', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>Create Logistics Manager</h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', color: '#fff', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >×</button>
            </div>

            {/* Modal body */}
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={formLabel}>Full Name</label>
                  <input
                    value={form.fullName}
                    onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                    placeholder="Enter Name"
                    style={formInput}
                  />
                </div>
                <div>
                  <label style={formLabel}>Email Address</label>
                  <input
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="Enter Email Address"
                    style={formInput}
                  />
                </div>
                <div>
                  <label style={formLabel}>Phone Number</label>
                  <input
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="Enter Phone Number"
                    style={formInput}
                  />
                </div>
                <div>
                  <label style={formLabel}>Assign Sites</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={form.sites}
                      onChange={e => setForm(f => ({ ...f, sites: e.target.value }))}
                      style={{ ...formInput, appearance: 'none', cursor: 'pointer' }}
                    >
                      <option value="">Select Sites</option>
                      <option value="Site A">Site A</option>
                      <option value="Site B">Site B</option>
                      <option value="Site A, Site B">Site A, Site B</option>
                    </select>
                    <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9ca3af' }}>▾</span>
                  </div>
                </div>
              </div>

              {/* Active Status toggle */}
              <div style={{ background: '#f9fafb', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Active Status</div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Enable or disable this manager's access</div>
                </div>
                <button
                  onClick={() => setForm(f => ({ ...f, active: !f.active }))}
                  style={{
                    width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
                    background: form.active ? '#2563eb' : '#d1d5db',
                    position: 'relative', transition: 'background 0.2s',
                    flexShrink: 0,
                  }}
                >
                  <span style={{
                    position: 'absolute', top: 3, width: 20, height: 20, borderRadius: '50%',
                    background: '#fff', transition: 'left 0.2s',
                    left: form.active ? 25 : 3,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  }} />
                </button>
              </div>
            </div>

            {/* Modal footer */}
            <div style={{ padding: '0 24px 24px', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ padding: '9px 24px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
              >Cancel</button>
              <button
                onClick={handleCreate}
                style={{ padding: '9px 24px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
              >Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const actionBtn: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
}

const formLabel: React.CSSProperties = {
  display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6,
}

const formInput: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13,
  color: '#374151', outline: 'none', background: '#fff', boxSizing: 'border-box',
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function PowerIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? '#ef4444' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
      <line x1="12" y1="2" x2="12" y2="12" />
    </svg>
  )
}
