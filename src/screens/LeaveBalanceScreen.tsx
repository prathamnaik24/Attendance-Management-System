import { useNavigate } from "react-router-dom";
import GreenHeader from "../components/GreenHeader";

const leaveTypes = [
  { label: "Annual Leave", total: 20, used: 6, remaining: 14, color: "#3b82f6", pct: 70 },
  { label: "Sick Leave", total: 10, used: 2, remaining: 8, color: "#22c55e", pct: 80 },
  { label: "Casual Leave", total: 5, used: 1, remaining: 4, color: "#f59e0b", pct: 80 },
  { label: "Compensatory", total: 3, used: 0, remaining: 3, color: "#6b7280", pct: 100 },
];

const barColors = ["#3b82f6", "#22c55e", "#f59e0b", "#a855f7"];

function RadialProgress({ pct, value, color }: { pct: number; value: number; color: string }) {
  const r = 24;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative w-14 h-14 shrink-0">
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="#f3f4f6" strokeWidth="5" />
        <circle
          cx="28" cy="28" r={r} fill="none"
          stroke={color} strokeWidth="5"
          strokeDasharray={`${circ * (pct / 100)} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 28 28)"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-bold text-gray-800 text-sm">{value}</span>
    </div>
  );
}

export default function LeaveBalanceScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-gray-50">
      <GreenHeader
        title="Leave Balance"
        rightEl={
          <button
            onClick={() => navigate("/apply-leave")}
            className="text-white text-xs font-medium bg-white/20 px-3 py-1 rounded-full"
          >
            Apply
          </button>
        }
      />

      {/* Total available */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-5">
        <p className="text-gray-400 text-sm text-center mb-1">Total Available Days</p>
        <p className="text-gray-900 font-black text-5xl text-center mb-4">29</p>
        {/* Color bar */}
        <div className="flex rounded-full overflow-hidden h-2.5">
          {barColors.map((c, i) => (
            <div key={i} className="flex-1" style={{ background: c }} />
          ))}
        </div>
      </div>

      {/* Leave type cards */}
      <div className="mx-4 mt-3 mb-6 space-y-3">
        {leaveTypes.map((lt) => (
          <div key={lt.label} className="bg-white rounded-2xl px-4 py-4 flex items-center gap-4">
            <RadialProgress pct={lt.pct} value={lt.remaining} color={lt.color} />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-900 text-sm">{lt.label}</p>
                <p className="text-gray-400 text-xs">{lt.total} Total</p>
              </div>
              <p className="text-gray-400 text-xs mt-0.5">
                {lt.used} used · {lt.remaining} remaining
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
