const gatekeepers = [
  { name: 'Alex Morgan', id: 'gk001', gate: 'Gate A', site: 'Site A', shift: '06:00 AM – 02:00 PM', status: 'Active', initials: 'AM', color: '#dbeafe' },
  { name: 'Sam Rivera', id: 'gk002', gate: 'Gate B', site: 'Site B', shift: '02:00 PM – 10:00 PM', status: 'Active', initials: 'SR', color: '#d1fae5' },
  { name: 'Jordan Lee', id: 'gk003', gate: 'Gate A', site: 'Site A', shift: '10:00 PM – 06:00 AM', status: 'Inactive', initials: 'JL', color: '#fef3c7' },
  { name: 'Casey Kim', id: 'gk004', gate: 'Gate C', site: 'Site C', shift: '06:00 AM – 02:00 PM', status: 'Active', initials: 'CK', color: '#ede9fe' },
]

export default function Gatekeepers() {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>Gatekeepers</h1>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            + Add Gatekeeper
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {['Name', 'ID', 'Gate', 'Site', 'Shift', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '11px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#374151', borderBottom: '1px solid #f3f4f6' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gatekeepers.map((gk, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#fafafa'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}
              >
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: gk.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#374151', flexShrink: 0 }}>{gk.initials}</div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{gk.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#6b7280' }}>{gk.id}</td>
                <td style={{ padding: '14px 20px' }}><span style={{ fontSize: 12, background: '#f3f4f6', color: '#374151', padding: '3px 10px', borderRadius: 20, fontWeight: 500 }}>{gk.gate}</span></td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#6b7280' }}>{gk.site}</td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#6b7280' }}>{gk.shift}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: gk.status === 'Active' ? '#d1fae5' : '#fee2e2', color: gk.status === 'Active' ? '#15803d' : '#dc2626' }}>{gk.status}</span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    </button>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
