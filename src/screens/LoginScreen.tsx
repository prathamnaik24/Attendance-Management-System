import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginScreen() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="min-h-full bg-white flex flex-col px-6 pt-16 pb-8">
      {/* Logo */}
      <div className="mb-10">
        <div className="flex items-center gap-1">
          <span className="text-green-500 font-black text-3xl tracking-tight">P</span>
          <svg width="18" height="22" viewBox="0 0 18 22" fill="none" className="-ml-1 -mt-1">
            <path d="M9 2 L16 9 L9 9" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-green-500 font-black text-3xl tracking-tight -ml-1">APERLES</span>
          <span className="text-gray-400 text-xs align-top mt-1">™</span>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
      <p className="text-gray-400 text-sm mb-8">Sign in to manage your workspace.</p>

      {/* Email */}
      <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
      <input
        type="email"
        placeholder="Enter your work email"
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-5 outline-none focus:border-green-400"
      />

      {/* Password */}
      <label className="text-sm font-medium text-gray-700 mb-2 block">Password</label>
      <div className="relative mb-4">
        <input
          type={showPass ? "text" : "password"}
          defaultValue="password1"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400 pr-10"
        />
        <button
          onClick={() => setShowPass(!showPass)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {/* Remember / Forgot */}
      <div className="flex items-center justify-between mb-8">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" className="accent-green-500" />
          Remember me
        </label>
        <button className="text-sm text-green-500 font-medium">Forgot password?</button>
      </div>

      {/* Sign In */}
      <button
        onClick={() => navigate("/location-checkin")}
        className="w-full bg-green-500 text-white font-semibold py-4 rounded-2xl text-sm mb-6"
      >
        Sign In
      </button>

      {/* Or */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400">Or sign in with</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Biometric */}
      <div className="flex justify-center gap-4 mb-auto">
        <button className="w-14 h-14 rounded-2xl border border-gray-200 flex items-center justify-center">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#9ca3af" strokeWidth="1.5" />
            <path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="14" r="1.5" fill="#9ca3af" />
          </svg>
        </button>
        <button className="w-14 h-14 rounded-2xl border border-gray-200 flex items-center justify-center">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path d="M12 2a4 4 0 014 4c0 1.5-.8 2.8-2 3.5" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M8 6a4 4 0 014-4" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M6 10c0 4 2 7 6 8M18 10c0 4-2 7-6 8" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M10 10c0 2 .5 4 2 5M14 10c0 2-.5 4-2 5" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <p className="text-center text-xs text-gray-400 mt-8">
        Powered by <span className="font-semibold text-gray-500">L2N Software Limited</span>
      </p>
    </div>
  );
}
