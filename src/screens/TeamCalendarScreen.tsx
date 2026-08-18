import GreenHeader from "../components/GreenHeader";

const days = [
  { label: "M", date: 21 },
  { label: "T", date: 22 },
  { label: "W", date: 23, active: true },
  { label: "T", date: 24 },
  { label: "F", date: 25 },
];

const teamMembers = [
  { name: "Alex Rivera", role: "Frontend Dev", status: "Present", color: "bg-green-100 text-green-600" },
  { name: "Jordan Lee", role: "Backend Dev", status: "Leave", color: "bg-blue-100 text-blue-600" },
  { name: "Taylor Swift", role: "Product Manager", status: "Present", color: "bg-green-100 text-green-600" },
  { name: "Casey Smith", role: "QA Engineer", status: "Absent", color: "bg-red-100 text-red-600" },
];

const avatarColors = ["#f59e0b", "#10b981", "#6366f1", "#ef4444"];

export default function TeamCalendarScreen() {
  return (
    <div className="min-h-full bg-gray-50">
      <GreenHeader title="Team Calendar" />

      {/* Week selector */}
      <div className="mx-4 mt-4 bg-white rounded-2xl p-4">
        <div className="flex justify-between">
          {days.map((d) => (
            <div
              key={d.date}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl ${d.active ? "bg-green-500" : ""}`}
            >
              <span className={`text-xs font-medium ${d.active ? "text-white/80" : "text-gray-400"}`}>{d.label}</span>
              <span className={`font-bold text-sm ${d.active ? "text-white" : "text-gray-800"}`}>{d.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Coverage */}
      <div className="mx-4 mt-3 rounded-2xl p-5" style={{ background: "#1e2a3b" }}>
        <p className="text-white/60 text-sm mb-3">Today's Coverage</p>
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {avatarColors.map((c, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full border-2 border-gray-800 flex items-center justify-center text-white text-xs font-bold"
                style={{ background: c }}
              >
                {["AR", "JL", "TS", "CS"][i]}
              </div>
            ))}
          </div>
          <div className="text-right">
            <p className="text-white font-bold text-3xl">85%</p>
            <p className="text-white/50 text-xs">Team Present</p>
          </div>
        </div>
      </div>

      {/* Team list */}
      <div className="mx-4 mt-3 mb-6 space-y-3">
        {teamMembers.map((m) => (
          <div key={m.name} className="bg-white rounded-2xl px-4 py-4 flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ background: avatarColors[teamMembers.indexOf(m)] }}
            >
              {m.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm">{m.name}</p>
              <p className="text-gray-400 text-xs">{m.role}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${m.color}`}>{m.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
