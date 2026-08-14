type View = 'dashboard' | 'logistics' | 'employees' | 'gatekeepers' | 'sites' | 'gates' | 'clock-history'

interface Props {
  onNavigate: (view: View, employee?: string) => void
}

const employees = [
  { name: 'Jaun David', id: 'emp001', email: 'jaun@example.com', phone: '+1234-567-8912', site: 'Site A', status: 'Active', initials: 'JD', color: '#dbeafe' },
  { name: 'Mary-Kate', id: 'emp002', email: 'mary@example.com', phone: '+1234-567-8913', site: 'Site B', status: 'Active', initials: 'MK', color: '#fce7f3' },
  { name: 'John David', id: 'emp003', email: 'john@example.com', phone: '+1234-567-8914', site: 'Site A', status: 'Active', initials: 'JD', color: '#d1fae5' },
  { name: 'Michael-John', id: 'emp004', email: 'michael@example.com', phone: '+1234-567-8915', site: 'Site C', status: 'Inactive', initials: 'MJ', color: '#fef3c7' },
  { name: 'Isaac-John', id: 'emp005', email: 'isaac@example.com', phone: '+1234-567-8916', site: 'Site A', status: 'Active', initials: 'IJ', color: '#ede9fe' },
  { name: 'Bailey-Ray', id: 'emp006', email: 'bailey@example.com', phone: '+1234-567-8917', site: 'Site B', status: 'Active', initials: 'BR', color: '#fef9c3' },
]

export default function Employees({ onNavigate }: Props) {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>Employees</h1>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            + Add Employee
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {['Name', 'Employee ID', 'Email', 'Phone', 'Site', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '11px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#374151', borderBottom: '1px solid #f3f4f6' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f9fafb', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#fafafa'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}
              >
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: emp.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#374151', flexShrink: 0 }}>{emp.initials}</div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{emp.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#6b7280' }}>{emp.id}</td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#6b7280' }}>{emp.email}</td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#6b7280' }}>{emp.phone}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontSize: 12, background: '#f3f4f6', color: '#374151', padding: '3px 10px', borderRadius: 20, fontWeight: 500 }}>{emp.site}</span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: emp.status === 'Active' ? '#d1fae5' : '#fee2e2', color: emp.status === 'Active' ? '#15803d' : '#dc2626' }}>{emp.status}</span>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button title="Clock History" onClick={() => onNavigate('clock-history', emp.name)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 6 }}>
                      <ClockIcon />
                    </button>
                    <button title="Edit" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 6 }}>
                      <EditIcon />
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

function ClockIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
}

function EditIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
}
