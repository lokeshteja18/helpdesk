import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import AgentLayout from "./layouts/AgentLayout";
import SuperAdminLayout from "./layouts/SuperAdminLayout";

import UserDashboard from "./pages/user/DashboardHome";
import AdminDashboard from "./pages/admin/DashboardHome";
import AgentDashboard from "./pages/agent/DashboardHome";
import SuperAdminDashboard from "./pages/superadmin/DashboardHome";
import SuperAdminUsers from "./pages/superadmin/Users";
import SuperAdminProfile from "./pages/superadmin/Profile";
import UserCreateTicket from "./pages/user/CreateTicket";
import UserMyTickets from "./pages/user/MyTickets";
import UserProfile from "./pages/user/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* USER */}
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<UserDashboard />} />
          <Route path="create-ticket" element={<UserCreateTicket />} />
          <Route path="my-tickets" element={<UserMyTickets />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

        {/* ADMIN */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
        </Route>

        {/* AGENT */}
        <Route path="/agent" element={<AgentLayout />}>
          <Route index element={<AgentDashboard />} />
        </Route>

        {/* SUPER ADMIN */}
        <Route path="/superadmin" element={<SuperAdminLayout />}>
          <Route index element={<SuperAdminDashboard />} />
          <Route path="users" element={<SuperAdminUsers />} />
          <Route path="profile" element={<SuperAdminProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}