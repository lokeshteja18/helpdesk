// src/layouts/UserLayout.jsx
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../dashboard.css";

export default function UserLayout() {
  const navigate = useNavigate();

  const logout = () => {
    navigate("/login");
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <h3>User</h3>

        <nav className="menu">
          <Link to="/user">Dashboard</Link>
          <Link to="/user/create-ticket">Create Ticket</Link>
          <Link to="/user/my-tickets">My Tickets</Link>
          <Link to="/user/profile">Profile</Link>
        </nav>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}