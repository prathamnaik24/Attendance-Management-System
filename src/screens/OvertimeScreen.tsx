import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import GreenHeader from "../components/GreenHeader";

const monthlyData = [
  { month: "Jan", hours: 4.5 },
  { month: "Feb", hours: 3.0 },
  { month: "Mar", hours: 5.0 },
  { month: "Apr", hours: 2.5 },
  { month: "May", hours: 6.0 },
  { month: "Jun", hours: 8.5 },
];

const overtimeLog = [
  { date: "Jun 24", hours: "2.5h", status: "Approved" },
  { date: "Jun 20", hours: "1.5h", status: "Approved" },
  { date: "Jun 18", hours: "3.0h", status: "Pending" },
  { date: "Jun 10", hours: "1.5h", status: "Approved" },
];

export default function OvertimeScreen() {
  const [compType, setCompType] = useState<"Cash" | "Time Off">("Time Off");

  return (
    <div className="min-h-full bg-gray-50">
      <GreenHeader
        title="Overtime"
        rightEl={
          <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        }
      />

      {/* Total card */}
      <div className="mx-4 mt-4 bg-green-500 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="1.5" />
            <path d="M12 6v6l4 2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-white/80 text-xs">Total This Month</span>
        </div>
        <p className="text-white font-black text-4xl">8.5 hrs</p>
        <p className="text-white/70 text-sm mt-1 flex items-center gap-1">
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
            <path d="M22 7l-12 12-5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          +3.5h vs last month
        </p>
      </div>

      {/* Monthly trend chart */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900 text-sm">Monthly Trend</h3>
          <span className="text-gray-400 text-xs">Last 6 months</span>
        </div>
        <ResponsiveContainer width="100%" height={130}>
          <BarChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }} barSize={28}>
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }}
              formatter={(v) => [`${v}h`, "Overtime"]}
            />
            <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
              {monthlyData.map((_, i) => (
                <Cell key={i} fill={i === monthlyData.length - 1 ? "#22c55e" : "#e5e7eb"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Approved / Pending */}
      <div className="mx-4 mt-3 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 text-center">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M20 6L9 17l-5-5" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-gray-400 text-xs">Approved</p>
          <p className="text-gray-900 font-bold text-xl">5.5h</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center">
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M12 2v10M12 18h.01" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-gray-400 text-xs">Pending</p>
          <p className="text-gray-900 font-bold text-xl">3.0h</p>
        </div>
      </div>

      {/* Compensation type */}
      <div className="mx-4 mt-3 bg-white rounded-2xl p-4">
        <p className="text-gray-500 text-xs font-medium mb-3">Compensation Type</p>
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          {(["Cash", "Time Off"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setCompType(opt)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                compType === opt ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Log */}
      <div className="mx-4 mt-3 mb-6 bg-white rounded-2xl overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <p className="text-gray-500 text-xs font-medium">Recent Overtime</p>
        </div>
        {overtimeLog.map((item, i) => (
          <div key={i} className={`flex items-center px-4 py-3 ${i < overtimeLog.length - 1 ? "border-b border-gray-50" : ""}`}>
            <span className="text-sm text-gray-500 flex-1">{item.date}</span>
            <span className="text-sm font-semibold text-gray-900 mr-3">{item.hours}</span>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                item.status === "Approved" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
