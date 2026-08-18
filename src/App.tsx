import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import DailyDetailScreen from "./screens/DailyDetailScreen";
import TeamCalendarScreen from "./screens/TeamCalendarScreen";
import ApplyLeaveScreen from "./screens/ApplyLeaveScreen";
import LeaveBalanceScreen from "./screens/LeaveBalanceScreen";
import HolidaysScreen from "./screens/HolidaysScreen";
import AnalyticsScreen from "./screens/AnalyticsScreen";
import OvertimeScreen from "./screens/OvertimeScreen";
import LocationCheckInScreen from "./screens/LocationCheckInScreen";
import FaceScanScreen from "./screens/FaceScanScreen";

export default function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-200 p-4">
      <div
        className="relative overflow-hidden shadow-2xl"
        style={{
          width: 390,
          height: 844,
          borderRadius: 44,
          background: "#fff",
        }}
      >
        <BrowserRouter>
          <div className="w-full h-full overflow-y-auto overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/home" element={<HomeScreen />} />
              <Route path="/daily-detail" element={<DailyDetailScreen />} />
              <Route path="/team-calendar" element={<TeamCalendarScreen />} />
              <Route path="/apply-leave" element={<ApplyLeaveScreen />} />
              <Route path="/leave-balance" element={<LeaveBalanceScreen />} />
              <Route path="/holidays" element={<HolidaysScreen />} />
              <Route path="/analytics" element={<AnalyticsScreen />} />
              <Route path="/overtime" element={<OvertimeScreen />} />
              <Route path="/location-checkin" element={<LocationCheckInScreen />} />
              <Route path="/face-scan" element={<FaceScanScreen />} />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </div>
  );
}
