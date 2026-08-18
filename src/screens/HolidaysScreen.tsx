import GreenHeader from "../components/GreenHeader";

const holidays: Record<string, { count: string; items: { date: string; month: string; name: string; type: string; countdown: string }[] }> = {
  November: {
    count: "1 day",
    items: [
      { date: "28", month: "Nov", name: "Thanksgiving Day", type: "Public", countdown: "in 12 days" },
    ],
  },
  December: {
    count: "3 days",
    items: [
      { date: "24", month: "Dec", name: "Christmas Eve", type: "Public", countdown: "in 38 days" },
      { date: "25", month: "Dec", name: "Christmas Day", type: "Public", countdown: "in 39 days" },
      { date: "31", month: "Dec", name: "New Year's Eve", type: "Public", countdown: "in 45 days" },
    ],
  },
  January: {
    count: "2 days",
    items: [
      { date: "1", month: "Jan", name: "New Year's Day", type: "Public", countdown: "in 46 days" },
      { date: "20", month: "Jan", name: "Martin Luther King Jr. Day", type: "Public", countdown: "in 65 days" },
    ],
  },
};

export default function HolidaysScreen() {
  return (
    <div className="min-h-full bg-gray-50">
      <GreenHeader title="Holidays" />

      {/* Next holiday banner */}
      <div className="mx-4 mt-4 bg-green-500 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#fff" />
          </svg>
          <span className="text-white/80 text-xs font-medium">Next Holiday</span>
        </div>
        <p className="text-white font-bold text-xl">Thanksgiving Day</p>
        <p className="text-white/70 text-sm mt-1">Nov 28 · in 12 days</p>
        {/* Decorative circle */}
        <div className="absolute right-8 top-4 w-24 h-24 rounded-full bg-white/10 -mr-4 -mt-4" />
      </div>

      {/* Grouped list */}
      <div className="px-4 pb-8 mt-4 space-y-5">
        {Object.entries(holidays).map(([month, { count, items }]) => (
          <div key={month}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-500 text-sm">{month}</h3>
              <span className="text-gray-400 text-xs">{count}</span>
            </div>
            <div className="space-y-2">
              {items.map((h) => (
                <div key={h.name} className="bg-white rounded-2xl px-4 py-4 flex items-center gap-4">
                  <div className="bg-green-100 rounded-xl px-3 py-2 text-center shrink-0">
                    <p className="text-green-500 text-xs font-medium">{h.month}</p>
                    <p className="text-green-700 font-bold text-lg leading-none">{h.date}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{h.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">{h.type}</span>
                      <span className="text-gray-400 text-xs">{h.countdown}</span>
                    </div>
                  </div>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="#d1d5db" strokeWidth="1.5" />
                    <path d="M16 2v4M8 2v4M3 10h18" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
