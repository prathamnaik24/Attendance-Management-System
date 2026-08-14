const gates = [
  { id: 'gate001', name: 'Gate A', site: 'North Distribution Hub', keeper: 'Alex Morgan', status: 'Active', type: 'Entry/Exit' },
  { id: 'gate002', name: 'Gate B', site: 'North Distribution Hub', keeper: 'Sam Rivera', status: 'Active', type: 'Entry Only' },
  { id: 'gate003', name: 'Gate C', site: 'South Logistics Center', keeper: 'Jordan Lee', status: 'Inactive', type: 'Exit Only' },
  { id: 'gate004', name: 'Gate D', site: 'East Warehouse', keeper: 'Casey Kim', status: 'Active', type: 'Entry/Exit' },
  { id: 'gate005', name: 'Gate E', site: 'West Depot', keeper: 'Riley James', status: 'Active', type: 'Entry Only' },
]

export default function Gates() {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>Gates</h1>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            + Add Gate
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {['Gate ID', 'Name', 'Site', 'Gatekeeper', 'Type', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '11px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#374151', borderBottom: '1px solid #f3f4f6' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gates.map((gate, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#fafafa'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}
              >
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#9ca3af', fontFamily: 'monospace' }}>{gate.id}</td>
                <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: '#111827' }}>{gate.name}</td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#6b7280' }}>{gate.site}</td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#6b7280' }}>{gate.keeper}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontSize: 12, background: '#eff6ff', color: '#2563eb', padding: '3px 10px', borderRadius: 20, fontWeight: 500 }}>{gate.type}</span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: gate.status === 'Active' ? '#d1fae5' : '#fee2e2', color: gate.status === 'Active' ? '#15803d' : '#dc2626' }}>{gate.status}</span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    </button>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </button>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0" /><line x1="12" y1="2" x2="12" y2="12" /></svg>
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
