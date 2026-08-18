import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import GreenHeader from "../components/GreenHeader";

const attendanceTrend = [
  { week: "W1", value: 88 },
  { week: "W2", value: 82 },
  { week: "W3", value: 94 },
  { week: "W4", value: 90 },
  { week: "W5", value: 97 },
  { week: "W6", value: 96 },
];

const punctualityData = [
  { name: "On time", value: 78 },
  { name: "Late", value: 22 },
];

const stats = [
  { icon: "🎯", label: "Attendance", value: "96%", bg: "#eff6ff" },
  { icon: "⏰", label: "Punctuality", value: "92%", bg: "#f0fdf4" },
  { icon: "📈", label: "Trend", value: "+4.2%", bg: "#fffbeb" },
  { icon: "⚡", label: "Productivity", value: "A+", bg: "#faf5ff" },
];

export default function AnalyticsScreen() {
  return (
    <div className="min-h-full bg-gray-50">
      <GreenHeader title="Analytics" />

      {/* Stat grid */}
      <div className="mx-4 mt-4 grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4" style={{ background: s.bg }}>
            <span className="text-2xl">{s.icon}</span>
            <p className="text-gray-400 text-xs mt-2">{s.label}</p>
            <p className="text-gray-900 font-bold text-xl">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Attendance Trend */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900 text-sm">Attendance Trend</h3>
          <span className="text-gray-400 text-xs">Last 6 weeks</span>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={attendanceTrend} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} domain={[70, 100]} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }}
              formatter={(v) => [`${v}%`, "Attendance"]}
            />
            <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2.5} fill="url(#greenGrad)" dot={{ fill: "#22c55e", r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Punctuality */}
      <div className="mx-4 mt-4 mb-6 bg-white rounded-2xl p-5">
        <h3 className="font-semibold text-gray-900 text-sm mb-4">Punctuality</h3>
        <div className="flex items-center gap-4">
          <PieChart width={120} height={120}>
            <Pie
              data={punctualityData}
              cx={55} cy={55} innerRadius={35} outerRadius={55}
              startAngle={90} endAngle={-270}
              dataKey="value" strokeWidth={0}
            >
              <Cell fill="#22c55e" />
              <Cell fill="#f3f4f6" />
            </Pie>
          </PieChart>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-gray-600">On time</span>
              <span className="text-sm font-bold text-gray-900 ml-auto">78%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-200" />
              <span className="text-sm text-gray-600">Late</span>
              <span className="text-sm font-bold text-gray-900 ml-auto">22%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
