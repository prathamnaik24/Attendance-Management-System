import { useState } from 'react'

interface Site {
  id: number
  name: string
  address: string
  employees: string
  gates: number
  status: 'Active' | 'Inactive'
}

const initialSites: Site[] = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  name: 'North Distribution Hub',
  address: '123 Logistics way, NY',
  employees: '45,56',
  gates: 16,
  status: 'Active' as const,
}))

export default function Sites() {
  const [sites, setSites] = useState<Site[]>(initialSites)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', address: '', active: true })

  const filtered = sites.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.address.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = () => {
    if (!form.name) return
    setSites(prev => [{
      id: prev.length + 1,
      name: form.name,
      address: form.address || '123 Logistics way, NY',
      employees: '0',
      gates: 0,
      status: form.active ? 'Active' : 'Inactive',
    }, ...prev])
    setShowModal(false)
    setForm({ name: '', address: '', active: true })
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0, flex: 1 }}>All Sites</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px' }}>
          <SearchIcon />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            style={{ border: 'none', outline: 'none', fontSize: 13, background: 'transparent', color: '#374151', width: 200 }}
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >+ Create Sites</button>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {filtered.map(site => (
          <div key={site.id} style={{
            background: '#fff', borderRadius: 14, padding: 20,
            border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            {/* Top: name + status */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{site.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#9ca3af' }}>
                  <LocationIcon />
                  {site.address}
                </div>
              </div>
              <span style={{
                fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20,
                background: site.status === 'Active' ? '#d1fae5' : '#fee2e2',
                color: site.status === 'Active' ? '#15803d' : '#dc2626',
                whiteSpace: 'nowrap',
              }}>{site.status}</span>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6b7280' }}>
                  <EmployeesIcon />
                  Employees
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{site.employees}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6b7280' }}>
                  <GateIcon />
                  Total Gates
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{site.gates}</span>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: '#f3f4f6' }} />

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button title="Toggle Status" style={actionBtn} onClick={() => setSites(prev => prev.map(s => s.id === site.id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s))}>
                <PowerIcon active={site.status === 'Active'} />
              </button>
              <div style={{ display: 'flex', gap: 10 }}>
                <button title="View" style={actionBtn}><EyeIcon /></button>
                <span style={{ color: '#e5e7eb', fontSize: 16 }}>|</span>
                <button title="Edit" style={actionBtn}><EditIcon /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
          backdropFilter: 'blur(2px)',
        }} onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div style={{ background: '#fff', borderRadius: 16, width: 480, maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
            <div style={{ background: '#2563eb', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>Create Site</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', color: '#fff', fontSize: 16 }}>×</button>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={formLabel}>Site Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Enter site name" style={formInput} />
              </div>
              <div>
                <label style={formLabel}>Address</label>
                <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Enter address" style={formInput} />
              </div>
              <div style={{ background: '#f9fafb', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Active Status</div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Enable or disable this site</div>
                </div>
                <button onClick={() => setForm(f => ({ ...f, active: !f.active }))} style={{ width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer', background: form.active ? '#2563eb' : '#d1d5db', position: 'relative', transition: 'background 0.2s' }}>
                  <span style={{ position: 'absolute', top: 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', left: form.active ? 25 : 3, boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                </button>
              </div>
            </div>
            <div style={{ padding: '0 24px 24px', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '9px 24px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', color: '#374151', fontSize: 14, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleCreate} style={{ padding: '9px 24px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const actionBtn: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center' }
const formLabel: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }
const formInput: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, color: '#374151', outline: 'none', background: '#fff', boxSizing: 'border-box' }

function SearchIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
}

function LocationIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
}

function EmployeesIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
}

function GateIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
}

function EyeIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
}

function EditIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
}

function PowerIcon({ active }: { active: boolean }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? '#ef4444' : '#9ca3af'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0" /><line x1="12" y1="2" x2="12" y2="12" /></svg>
}
