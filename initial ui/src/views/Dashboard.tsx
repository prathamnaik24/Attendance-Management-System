import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'

type View = 'dashboard' | 'logistics' | 'employees' | 'gatekeepers' | 'sites' | 'gates' | 'clock-history'

interface Props {
  onNavigate: (view: View) => void
}

const attendanceData = [
  { day: 'Sun', present: 30000, absent: 1800 },
  { day: 'Mon', present: 38000, absent: 2000 },
  { day: 'Tue', present: 38126, absent: 2126 },
  { day: 'Wed', present: 35000, absent: 3000 },
  { day: 'Thu', present: 37000, absent: 2200 },
  { day: 'Fri', present: 36000, absent: 1900 },
  { day: 'Sat', present: 32000, absent: 1600 },
]

const staffData = [
  { name: 'Managers', value: 2232, color: '#6d28d9' },
  { name: 'Employees', value: 28126, color: '#2563eb' },
  { name: 'GateKeepers', value: 243, color: '#f59e0b' },
]

const recentActivities = [
  { name: 'David Lee', action: 'Clocked In', time: '12 min ago', initials: 'DL', color: '#dbeafe' },
  { name: 'Elsie-Mae', action: 'Clocked In', time: '22 min ago', initials: 'EM', color: '#fce7f3' },
  { name: 'Jack-Henry', action: 'Clocked In', time: '22 min ago', initials: 'JH', color: '#d1fae5' },
  { name: 'Riley-James', action: 'Clocked In', time: '22 min ago', initials: 'RJ', color: '#fef3c7' },
  { name: 'Bailey-Ray', action: 'Clocked In', time: '22 min ago', initials: 'BR', color: '#ede9fe' },
  { name: 'David Lee', action: 'Clocked In', time: '22 min ago', initials: 'DL', color: '#dbeafe' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
        padding: '10px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: 13
      }}>
        <div style={{ fontWeight: 600, color: '#111827', marginBottom: 6 }}>{label}</div>
        {payload.map((p: any, i: number) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#374151' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.fill, display: 'inline-block' }} />
            <span style={{ color: '#6b7280' }}>{p.name === 'present' ? 'Present' : 'Absent'}</span>
            <span style={{ fontWeight: 600, marginLeft: 4 }}>{p.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const RADIAN = Math.PI / 180
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  return null
}

export default function Dashboard({ onNavigate }: Props) {
  const [attendanceTab, setAttendanceTab] = useState<'Monthly' | 'Weekly'>('Weekly')

  const total = staffData.reduce((s, d) => s + d.value, 0)

  const managersClockedIn = 256
  const managersTotal = 583
  const employeesClockedIn = 23645
  const employeesTotal = 30583
  const gatekeepersClockedIn = 170
  const gatekeepersTotal = 200

  return (
    <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20, minHeight: '100%' }}>
      {/* Row 1: Staff Overview + Today's Clock-In */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Staff Overview */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <h2 style={cardTitle}>Staff Overview</h2>
            <span style={dateBadge}>
              <CalIcon /> Last 7 days
            </span>
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 4 }}>
            {staffData.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#374151' }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: d.color, display: 'inline-block' }} />
                <span style={{ color: '#6b7280' }}>{d.name}</span>
                <span style={{ fontWeight: 600 }}>{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div style={{ position: 'relative', height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={staffData}
                  cx="50%"
                  cy="80%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={90}
                  outerRadius={135}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomLabel}
                >
                  {staffData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{
              position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)',
              textAlign: 'center', pointerEvents: 'none',
            }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', letterSpacing: '-0.03em' }}>
                {total.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Total Staff</div>
            </div>
          </div>
        </div>

        {/* Today's Clock-In */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={cardTitle}>Today's Clock-In</h2>
            <span style={dateBadge}><CalIcon /> Last 7 days</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              {[['#6d28d9', 'Managers'], ['#2563eb', 'Employees'], ['#a855f7', 'Gatekeepers']].map(([c, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6b7280' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: c as string, display: 'inline-block' }} />
                  {l}
                </div>
              ))}
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: '#111827', letterSpacing: '-0.03em' }}>9,580</span>
              <span style={{ background: '#eff6ff', color: '#2563eb', fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>+24</span>
            </div>
          </div>

          {/* Bar rows */}
          {[
            { label1: '256', label2: '583', color: '#6d28d9', bg: '#ede9fe', pct: (256/583)*100 },
            { label1: '23,645', label2: '30,583', color: '#2563eb', bg: '#dbeafe', pct: (23645/30583)*100 },
            { label1: '170', label2: '200', color: '#f59e0b', bg: '#fef3c7', pct: (170/200)*100 },
          ].map((row, i) => (
            <div key={i} style={{ marginBottom: i < 2 ? 16 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#374151', fontWeight: 500, marginBottom: 6 }}>
                <span>{row.label1}</span>
                <span>{row.label2}</span>
              </div>
              <div style={{ height: 28, borderRadius: 8, background: row.bg, overflow: 'hidden' }}>
                <div style={{ width: `${row.pct}%`, height: '100%', background: row.color, borderRadius: 8, transition: 'width 0.6s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Active Sites + Active Gates */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 20 }}>
        <StatCard label="Active Sites" value="185" delta="+2.3% Last Week" onClick={() => onNavigate('sites')} />
        <StatCard label="Active Gates" value="185" delta="+2.3% Last Week" onClick={() => onNavigate('gates')} />
        <div /> <div />
      </div>

      {/* Row 3: Attendance Overview + Recent Activities */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Attendance Overview */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <h2 style={cardTitle}>Attendance Overview</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6b7280' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                  Absent Employees
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6b7280' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                  Present Employees
                </span>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {(['Monthly', 'Weekly'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setAttendanceTab(t)}
                    style={{
                      padding: '4px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12,
                      background: attendanceTab === t ? '#6d28d9' : '#f3f4f6',
                      color: attendanceTab === t ? '#fff' : '#6b7280',
                      fontWeight: attendanceTab === t ? 600 : 400,
                    }}
                  >{t}</button>
                ))}
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={attendanceData} barCategoryGap="30%" barGap={2}>
              <CartesianGrid vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={v => `${v/1000}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
              <Bar dataKey="present" fill="#22c55e" radius={[6, 6, 6, 6]} name="present" />
              <Bar dataKey="absent" fill="#ef4444" radius={[6, 6, 6, 6]} name="absent" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activities */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={cardTitle}>Recent Activities</h2>
            <button style={{ fontSize: 13, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
              View more
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {recentActivities.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', background: a.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 600, color: '#374151', flexShrink: 0,
                }}>
                  {a.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', lineHeight: 1.3 }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.3 }}>{a.action}</div>
                </div>
                <div style={{ fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' }}>{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, delta, onClick }: { label: string; value: string; delta: string; onClick?: () => void }) {
  return (
    <div style={{ ...card, cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" />
          </svg>
        </div>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#6b7280' }}>{label}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', letterSpacing: '-0.03em', marginBottom: 6 }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 500 }}>▲ {delta}</span>
        <button style={{ fontSize: 12, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
          View more ↗
        </button>
      </div>
    </div>
  )
}

function CalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: 4 }}>
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

const card: React.CSSProperties = {
  background: '#fff',
  borderRadius: 14,
  padding: '18px 20px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  border: '1px solid #f3f4f6',
}

const cardTitle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  color: '#111827',
  margin: 0,
}

const dateBadge: React.CSSProperties = {
  fontSize: 12,
  color: '#9ca3af',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  background: '#f9fafb',
  border: '1px solid #e5e7eb',
  padding: '3px 10px',
  borderRadius: 20,
}
