interface Props {
  employee: string | null
  onBack: () => void
}

const historyRows = [
  { name: 'Mary-Kate', id: 'emp001', gate: 'Gate A', clockIn: 'Today, 10:00 AM', clockOut: 'Today, 07:00 PM', duration: '9h 12m', inColor: '#22c55e', outColor: '#ef4444', initials: 'MK', color: '#fce7f3' },
  { name: 'John David', id: 'emp001', gate: 'Gate A', clockIn: '2026-01-26 10:00 AM', clockOut: '2026-01-26 8:00 PM', duration: '9h 12m', inColor: '#22c55e', outColor: '#ef4444', initials: 'JD', color: '#dbeafe' },
  { name: 'Michael-John', id: 'emp001', gate: 'Gate A', clockIn: '2026-01-26 10:00 AM', clockOut: '2026-01-26 8:00 PM', duration: '9h 12m', inColor: '#22c55e', outColor: '#ef4444', initials: 'MJ', color: '#d1fae5' },
  { name: 'Isaac-John', id: 'emp001', gate: 'Gate A', clockIn: '2026-01-26 10:00 AM', clockOut: '2026-01-26 8:00 PM', duration: '9h 12m', inColor: '#22c55e', outColor: '#ef4444', initials: 'IJ', color: '#fef3c7' },
  { name: 'Mary-Kate', id: 'emp001', gate: 'Gate A', clockIn: '2026-01-26 10:00 AM', clockOut: '2026-01-26 8:00 PM', duration: '9h 12m', inColor: '#22c55e', outColor: '#ef4444', initials: 'MK', color: '#fce7f3' },
]

export default function ClockHistory({ employee, onBack }: Props) {
  return (
    <div style={{ padding: 24 }}>
      {/* Back + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#374151', fontSize: 14, padding: 0 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5m7-7-7 7 7 7" />
          </svg>
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>Clock In/Out History</h1>
      </div>

      {/* Employee Profile Card */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#2563eb', flexShrink: 0 }}>
          JD
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 2 }}>
            {employee || 'Jaun David'}
          </div>
          <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 8 }}>#emp001</div>
          <div style={{ display: 'flex', gap: 20 }}>
            {[
              { icon: <MailIcon />, text: 'jaun@example.com' },
              { icon: <PhoneIcon />, text: '+1234-567-8912' },
              { icon: <BuildingIcon />, text: 'Site A' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6b7280' }}>
                {icon}{text}
              </div>
            ))}
          </div>
        </div>
        <span style={{ background: '#22c55e', color: '#fff', fontSize: 14, fontWeight: 600, padding: '8px 20px', borderRadius: 20 }}>Active</span>
      </div>

      {/* Attendance History Table */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid #f3f4f6' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Attendance History</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '6px 12px', fontSize: 13, color: '#6b7280' }}>
            <CalIcon />
            20-12-2025 — 20-01-2026
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {['Name', 'Employee ID', 'Gate', 'Last Clock In', 'Last Clock Out', 'Actions'].map(h => (
                <th key={h} style={{ padding: '11px 20px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#374151', borderBottom: '1px solid #f3f4f6' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {historyRows.map((row, i) => (
              <tr key={i}
                style={{ borderBottom: '1px solid #f9fafb' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#fafafa'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}
              >
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: row.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#374151', flexShrink: 0 }}>
                      {row.initials}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{row.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: '#6b7280' }}>{row.id}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ fontSize: 12, background: '#f3f4f6', color: '#374151', padding: '4px 12px', borderRadius: 20, fontWeight: 500 }}>{row.gate}</span>
                </td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: row.inColor, fontWeight: 500 }}>{row.clockIn}</td>
                <td style={{ padding: '14px 20px', fontSize: 13, color: row.outColor, fontWeight: 500 }}>{row.clockOut}</td>
                <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: '#374151' }}>{row.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function MailIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
}

function PhoneIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.66 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.57 2H6.5a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
}

function BuildingIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" /></svg>
}

function CalIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline' }}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
}
