import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FaceScanScreen() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => navigate("/home"), 2000);
  };

  return (
    <div className="min-h-full flex flex-col" style={{ background: "#1e2a3b" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="text-white font-semibold text-sm">09:26 AM</span>
      </div>

      {/* Face icon */}
      <div className="flex flex-col items-center mt-12 mb-8">
        <div className="w-16 h-16 border-2 border-blue-400 rounded-full flex items-center justify-center mb-6">
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#60a5fa" strokeWidth="1.5" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="9" cy="11" r="1" fill="#60a5fa" />
            <circle cx="15" cy="11" r="1" fill="#60a5fa" />
          </svg>
        </div>
        <h2 className="text-white font-bold text-2xl mb-2">Position your face</h2>
        <p className="text-white/50 text-sm">Align your face within the frame</p>
      </div>

      {/* Face frame */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="relative w-full" style={{ aspectRatio: "3/4", maxHeight: 320 }}>
          {/* Corner brackets */}
          {/* Top-left */}
          <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-blue-400 rounded-tl-lg" />
          {/* Top-right */}
          <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-blue-400 rounded-tr-lg" />
          {/* Bottom-left */}
          <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-blue-400 rounded-bl-lg" />
          {/* Bottom-right */}
          <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-blue-400 rounded-br-lg" />

          {/* Scan line */}
          {scanning && (
            <div
              className="absolute left-0 right-0 h-0.5 bg-blue-400 opacity-80"
              style={{ top: "50%", animation: "scan 1s ease-in-out infinite alternate" }}
            />
          )}

          {/* Center line */}
          <div className="absolute left-4 right-4 h-0.5 bg-blue-500/50" style={{ top: "50%" }} />
        </div>
      </div>

      {/* Bottom */}
      <div className="px-6 pb-12">
        {!scanning ? (
          <button
            onClick={handleScan}
            className="w-full bg-blue-500 text-white font-semibold py-4 rounded-2xl text-base"
          >
            Start Scan
          </button>
        ) : (
          <div className="w-full bg-white/10 text-white/70 font-semibold py-4 rounded-2xl text-base text-center">
            Scanning...
          </div>
        )}
        <button
          onClick={() => navigate(-1)}
          className="w-full border border-white/20 text-white font-semibold py-4 rounded-2xl text-base mt-3"
        >
          Cancel
        </button>
      </div>

      <style>{`
        @keyframes scan {
          from { top: 20%; }
          to { top: 80%; }
        }
      `}</style>
    </div>
  );
}
