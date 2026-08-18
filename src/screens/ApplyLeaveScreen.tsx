import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GreenHeader from "../components/GreenHeader";

export default function ApplyLeaveScreen() {
  const navigate = useNavigate();
  const [leaveType, setLeaveType] = useState("Annual Leave");

  return (
    <div className="min-h-full bg-gray-50">
      <GreenHeader title="Apply Leave" />

      <div className="px-5 py-5">
        <h2 className="font-bold text-gray-900 text-lg mb-5">Create leave application</h2>

        {/* Leave type */}
        <label className="text-sm font-medium text-gray-700 block mb-2">Leave Type</label>
        <div className="relative mb-4">
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white appearance-none outline-none focus:border-green-400"
          >
            <option>Annual Leave</option>
            <option>Sick Leave</option>
            <option>Casual Leave</option>
            <option>Compensatory</option>
          </select>
          <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" fill="none" viewBox="0 0 24 24">
            <path d="M6 9l6 6 6-6" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Available balance */}
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-5 flex items-center justify-between">
          <div>
            <p className="text-green-600 text-xs font-medium">Available Balance</p>
            <p className="text-green-600 font-bold text-lg">14 Days</p>
          </div>
          <div className="relative w-14 h-14">
            <svg width="56" height="56" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="22" fill="none" stroke="#dcfce7" strokeWidth="6" />
              <circle
                cx="28" cy="28" r="22" fill="none"
                stroke="#22c55e" strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 22 * 0.7} ${2 * Math.PI * 22}`}
                strokeLinecap="round"
                transform="rotate(-90 28 28)"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-green-600 text-xs font-bold">70%</span>
          </div>
        </div>

        {/* Dates */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 block mb-2">Start Date</label>
            <div className="border border-gray-200 rounded-xl px-4 py-3 bg-white flex items-center justify-between">
              <span className="text-gray-400 text-sm">dd-mm-yyyy</span>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="#9ca3af" strokeWidth="1.5" />
                <path d="M16 2v4M8 2v4M3 10h18" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 block mb-2">End Date</label>
            <div className="border border-gray-200 rounded-xl px-4 py-3 bg-white flex items-center justify-between">
              <span className="text-gray-400 text-sm">dd-mm-yyyy</span>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="#9ca3af" strokeWidth="1.5" />
                <path d="M16 2v4M8 2v4M3 10h18" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Reason */}
        <label className="text-sm font-medium text-gray-700 block mb-2">Reason for Leave</label>
        <textarea
          placeholder="Please provide details..."
          rows={4}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white outline-none focus:border-green-400 resize-none mb-5"
        />

        {/* Attachments */}
        <label className="text-sm font-medium text-gray-700 block mb-2">Attachments (Optional)</label>
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-white mb-6">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="text-gray-300 mb-2">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-gray-400 text-sm font-medium">Upload File</p>
          <p className="text-gray-300 text-xs">PDF, JPG or PNG (Max 5MB)</p>
        </div>

        <button className="w-full bg-green-500 text-white font-semibold py-4 rounded-2xl text-base">
          Submit Application
        </button>
      </div>
    </div>
  );
}
