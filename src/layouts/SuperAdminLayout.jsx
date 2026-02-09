import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SuperAdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedUser, setLoggedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("loggedUser"));

    if (!user || user.role !== "superadmin") {
      // Redirect to login if not superadmin
      localStorage.clear();
      navigate("/login");
      return;
    }

    setLoggedUser(user);
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#f8fafc" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
          <p style={{ color: "#718096", fontSize: "16px" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      {/* Sidebar */}
      <div style={{
        width: "260px",
        background: "linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)",
        color: "#2d3748",
        padding: "24px 20px",
        boxShadow: "2px 0 15px rgba(0, 0, 0, 0.08)",
        borderRight: "1px solid #e2e8f0",
        overflow: "auto",
      }}>
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{
            fontSize: "22px",
            fontWeight: "700",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "8px",
          }}>
            ⚙️ Super Admin
          </h2>
          <p style={{ fontSize: "12px", color: "#718096", margin: "0" }}>
            {loggedUser?.name || "Administrator"}
          </p>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button
            onClick={() => handleNavigate("/superadmin")}
            style={{
              padding: "12px 16px",
              backgroundColor: location.pathname === "/superadmin" ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "#f7fafc",
              color: location.pathname === "/superadmin" ? "#fff" : "#4a5568",
              border: location.pathname === "/superadmin" ? "none" : "1px solid transparent",
              borderRadius: "8px",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.3s ease",
              fontWeight: "500",
              fontSize: "15px",
              background: location.pathname === "/superadmin" 
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                : "#f7fafc",
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== "/superadmin") {
                e.target.style.background = "#edf2f7";
                e.target.style.transform = "translateX(5px)";
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== "/superadmin") {
                e.target.style.background = "#f7fafc";
                e.target.style.transform = "translateX(0)";
              }
            }}
          >
            📊 Dashboard
          </button>

          <button
            onClick={() => handleNavigate("/superadmin/users")}
            style={{
              padding: "12px 16px",
              backgroundColor: location.pathname === "/superadmin/users" ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "#f7fafc",
              color: location.pathname === "/superadmin/users" ? "#fff" : "#4a5568",
              border: location.pathname === "/superadmin/users" ? "none" : "1px solid transparent",
              borderRadius: "8px",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.3s ease",
              fontWeight: "500",
              fontSize: "15px",
              background: location.pathname === "/superadmin/users"
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                : "#f7fafc",
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== "/superadmin/users") {
                e.target.style.background = "#edf2f7";
                e.target.style.transform = "translateX(5px)";
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== "/superadmin/users") {
                e.target.style.background = "#f7fafc";
                e.target.style.transform = "translateX(0)";
              }
            }}
          >
            👥 Staff Management
          </button>

          <button
            onClick={() => handleNavigate("/superadmin/profile")}
            style={{
              padding: "12px 16px",
              backgroundColor: location.pathname === "/superadmin/profile" ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "#f7fafc",
              color: location.pathname === "/superadmin/profile" ? "#fff" : "#4a5568",
              border: location.pathname === "/superadmin/profile" ? "none" : "1px solid transparent",
              borderRadius: "8px",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.3s ease",
              fontWeight: "500",
              fontSize: "15px",
              background: location.pathname === "/superadmin/profile"
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                : "#f7fafc",
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== "/superadmin/profile") {
                e.target.style.background = "#edf2f7";
                e.target.style.transform = "translateX(5px)";
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== "/superadmin/profile") {
                e.target.style.background = "#f7fafc";
                e.target.style.transform = "translateX(0)";
              }
            }}
          >
            👤 My Profile
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: "12px 16px",
              background: "linear-gradient(135deg, #f56565 0%, #e53e3e 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "24px",
              transition: "all 0.3s ease",
              fontWeight: "600",
              fontSize: "15px",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "linear-gradient(135deg, #e53e3e 0%, #c53030 100%)";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 16px rgba(245, 101, 101, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "linear-gradient(135deg, #f56565 0%, #e53e3e 100%)";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            🚪 Logout
          </button>
        </nav>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "40px", overflowY: "auto", background: "#f8fafc" }}>
        <Outlet />
      </div>
    </div>
  );
}