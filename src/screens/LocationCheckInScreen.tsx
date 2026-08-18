import { useNavigate } from "react-router-dom";

export default function LocationCheckInScreen() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full min-h-screen bg-gray-900">
      {/* Map background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=800&h=900&fit=crop&auto=format"
          alt="Map view"
          className="w-full h-full object-cover opacity-90"
        />
        {/* Office marker */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="bg-white rounded-xl px-3 py-1 shadow-lg mb-1">
            <p className="text-xs font-bold text-gray-800">L2N Software Limited</p>
          </div>
          <div className="w-8 h-8 bg-red-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
            <svg width="14" height="14" fill="white" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Top bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
        <div className="bg-white rounded-full px-4 py-2 shadow text-sm font-semibold text-gray-800">
          09:26 AM
        </div>
      </div>

      {/* Bottom card */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#22c55e" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-gray-900">Software Limited</p>
            <p className="text-green-500 text-sm font-medium flex items-center gap-1">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Within office radius
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/face-scan")}
          className="w-full bg-green-500 text-white font-semibold py-4 rounded-2xl text-base"
        >
          Continue to Scan
        </button>
      </div>
    </div>
  );
}
