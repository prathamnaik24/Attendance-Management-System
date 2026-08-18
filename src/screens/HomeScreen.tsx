import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

type DayStatus = "present" | "late" | "leave" | "absent" | "none";

interface CalDay {
  day: number | null;
  status: DayStatus;
}

const calDays: CalDay[] = [
  { day: null, status: "none" },
  { day: 1, status: "present" },
  { day: 2, status: "present" },
  { day: 3, status: "present" },
  { day: 4, status: "present" },
  { day: 5, status: "none" },
  { day: 6, status: "none" },
  { day: 7, status: "present" },
  { day: 8, status: "late" },
  { day: 9, status: "present" },
  { day: 10, status: "leave" },
  { day: 11, status: "present" },
  { day: 12, status: "none" },
  { day: 13, status: "none" },
  { day: 14, status: "present" },
  { day: 15, status: "absent" },
  { day: 16, status: "present" },
  { day: 17, status: "present" },
  { day: 18, status: "present" },
  { day: 19, status: "none" },
  { day: 20, status: "none" },
  { day: 21, status: "present" },
  { day: 22, status: "late" },
  { day: 23, status: "present" },
  { day: 24, status: "present" },
  { day: 25, status: "present" },
  { day: 26, status: "none" },
];

const statusColor: Record<DayStatus, string> = {
  present: "bg-green-500 text-white",
  late: "bg-amber-400 text-white",
  leave: "bg-blue-500 text-white",
  absent: "bg-red-500 text-white",
  none: "bg-transparent text-gray-400",
};

const quickActions = [
  { label: "Leave", icon: "📋", path: "/leave-balance" },
  { label: "Overtime", icon: "📈", path: "/overtime" },
  { label: "Team", icon: "👥", path: "/team-calendar" },
  { label: "Analytics", icon: "📊", path: "/analytics" },
];

export default function HomeScreen() {
  const navigate = useNavigate();
  const [activeBtn, setActiveBtn] = useState<string>("Check In");
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="min-h-full bg-gray-50">
      {/* Green header */}
      <div className="bg-green-500 px-5 pt-10 pb-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 border-2 border-white">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format"
                alt="Safi"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-white/80 text-xs">{dateStr}</p>
              <p className="text-white font-bold text-lg">Hi, Safi 👋</p>
            </div>
          </div>
          <button className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              <path d="M13.73 21a2 2 0 01-3.46 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Working hours card */}
        <div className="bg-green-600 rounded-2xl p-4 mt-4">
          <p className="text-green-100 text-xs mb-1">Working Hours</p>
          <p className="text-white font-bold text-3xl tracking-widest font-mono mb-3">00:00:00</p>
          <div className="flex gap-2">
            {["Check In", "Lunch", "WFH", "Check Out"].map((btn) => (
              <button
                key={btn}
                onClick={() => {
                  setActiveBtn(btn);
                  if (btn === "Check In") navigate("/location-checkin");
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeBtn === btn
                    ? "bg-white text-green-600"
                    : "border border-white/40 text-white"
                }`}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-5 py-4 grid grid-cols-4 gap-3">
        {quickActions.map(({ label, icon, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className="bg-white rounded-2xl py-4 flex flex-col items-center gap-2 shadow-sm"
          >
            <span className="text-2xl">{icon}</span>
            <span className="text-xs text-gray-600 font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Attendance Calendar */}
      <div className="px-5 pb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-900 text-base">Attendance Calendar</h2>
          <button className="flex items-center gap-1 text-sm text-gray-500">
            May 2026
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-4">
          {[
            { count: 14, label: "Present", color: "bg-green-500" },
            { count: "02", label: "Late", color: "bg-amber-400" },
            { count: "02", label: "Leave", color: "bg-blue-500" },
            { count: "01", label: "Absent", color: "bg-red-500" },
          ].map(({ count, label, color }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-1 h-8 rounded-full ${color}`} />
              <div>
                <p className="font-bold text-sm text-gray-900">{count}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} className="text-center text-xs text-gray-400 font-medium">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-y-1">
          {calDays.map((cd, i) => (
            <button
              key={i}
              onClick={() => cd.day && navigate("/daily-detail")}
              className="flex items-center justify-center"
            >
              {cd.day ? (
                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${statusColor[cd.status]}`}
                >
                  {cd.day}
                </span>
              ) : (
                <span className="text-sm text-gray-300">{/* empty */}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
