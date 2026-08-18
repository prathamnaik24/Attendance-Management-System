import { useNavigate } from "react-router-dom";
import GreenHeader from "../components/GreenHeader";

const timeline = [
  { time: "09:15 AM", event: "Checked In", detail: "L2N Software Limited · 15 mins late", color: "bg-amber-400", dotColor: "#f59e0b" },
  { time: "01:00 PM", event: "Lunch Out", detail: "Duration: 45 mins", color: "bg-gray-300", dotColor: "#9ca3af" },
  { time: "01:45 PM", event: "Lunch In", detail: "Resumed work", color: "bg-gray-300", dotColor: "#9ca3af" },
  { time: "06:30 PM", event: "Checked Out", detail: "L2N Software Limited · +30m overtime", color: "bg-green-500", dotColor: "#22c55e" },
];

export default function DailyDetailScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-gray-50">
      <GreenHeader title="Daily Detail" />

      {/* Date & hours card */}
      <div className="mx-4 mt-4 rounded-2xl overflow-hidden" style={{ background: "#1e2a3b" }}>
        <div className="px-6 py-6 text-center">
          <p className="text-white/60 text-sm mb-1">Oct 24, Thu</p>
          <p className="text-white font-bold text-4xl mb-4">8h 30m</p>
          <div className="flex justify-center gap-3">
            <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-amber-400/20 text-amber-300">Late</span>
            <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-green-500/20 text-green-400">Present</span>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-5">
        <h3 className="font-semibold text-gray-900 mb-5">Activity Timeline</h3>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-3 bottom-3 w-px bg-gray-100" />
          <div className="space-y-6">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div
                  className="w-3.5 h-3.5 rounded-full border-2 border-white shrink-0 mt-0.5 relative z-10"
                  style={{ background: item.dotColor, boxShadow: `0 0 0 3px ${item.dotColor}22` }}
                />
                <div>
                  <p className="text-green-500 text-sm font-semibold mb-0.5">{item.time}</p>
                  <p className="text-gray-900 font-medium text-sm">{item.event}</p>
                  <p className="text-gray-400 text-xs">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mx-4 mt-4 mb-6 bg-white rounded-2xl p-5">
        <div className="flex items-center gap-2 text-gray-400">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.5" />
            <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span className="text-sm font-medium">Notes</span>
        </div>
        <p className="text-gray-400 text-sm mt-2">No notes for this day.</p>
      </div>
    </div>
  );
}
