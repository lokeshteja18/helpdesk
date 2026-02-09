import { useEffect, useState } from "react";

export default function Profile() {
  const [loggedUser, setLoggedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedUser"));
    setLoggedUser(user);
    setEditForm({
      name: user?.name || "",
      email: user?.email || "",
      password: user?.password || "",
    });
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleSaveProfile = () => {
    if (!editForm.name || !editForm.email) {
      alert("Name and Email are required!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) => {
      if (u.email === loggedUser.email) {
        return {
          ...u,
          name: editForm.name,
          email: editForm.email,
          password: editForm.password,
        };
      }
      return u;
    });

    const updatedLoggedUser = {
      ...loggedUser,
      name: editForm.name,
      email: editForm.email,
      password: editForm.password,
    };

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("loggedUser", JSON.stringify(updatedLoggedUser));
    setLoggedUser(updatedLoggedUser);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  if (!loggedUser) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="dashboard-header">
        <h1>👤 My Profile</h1>
        <p>Manage your account information</p>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div
          style={{
            background: "white",
            padding: "32px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          }}
        >
          {!isEditing ? (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "32px",
                  paddingBottom: "24px",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "32px",
                    marginRight: "20px",
                  }}
                >
                  👨‍💼
                </div>
                <div>
                  <h2 style={{ color: "#1a202c", marginBottom: "4px" }}>
                    {loggedUser.name}
                  </h2>
                  <p style={{ color: "#718096", fontSize: "14px" }}>
                    Super Administrator
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#718096", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                  Full Name
                </label>
                <p style={{ fontSize: "16px", color: "#1a202c", fontWeight: "500" }}>
                  {loggedUser.name}
                </p>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#718096", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                  Email Address
                </label>
                <p style={{ fontSize: "16px", color: "#1a202c", fontWeight: "500" }}>
                  {loggedUser.email}
                </p>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#718096", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                  Role
                </label>
                <p style={{ fontSize: "16px", color: "#667eea", fontWeight: "600", textTransform: "uppercase" }}>
                  {loggedUser.role}
                </p>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#718096", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                  Status
                </label>
                <p style={{ fontSize: "16px", color: "#48bb78", fontWeight: "600" }}>
                  ✓ Active
                </p>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                style={{
                  padding: "12px 24px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                  marginTop: "20px",
                }}
                onMouseEnter={(e) => {
                  e.target.transform = "translateY(-2px)";
                  e.target.boxShadow = "0 8px 16px rgba(102, 126, 234, 0.3)";
                }}
              >
                ✏️ Edit Profile
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProfile();
              }}
            >
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#718096", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", fontWeight: "600" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #cbd5e0",
                    borderRadius: "6px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.target.borderColor = "#667eea";
                    e.target.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.borderColor = "#cbd5e0";
                    e.target.boxShadow = "none";
                  }}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#718096", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", fontWeight: "600" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #cbd5e0",
                    borderRadius: "6px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.target.borderColor = "#667eea";
                    e.target.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.borderColor = "#cbd5e0";
                    e.target.boxShadow = "none";
                  }}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "12px", color: "#718096", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", fontWeight: "600" }}>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={editForm.password}
                  onChange={handleEditChange}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #cbd5e0",
                    borderRadius: "6px",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.target.borderColor = "#667eea";
                    e.target.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.borderColor = "#cbd5e0";
                    e.target.boxShadow = "none";
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
                <button
                  type="submit"
                  style={{
                    padding: "12px 24px",
                    background: "#48bb78",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.background = "#38a169";
                  }}
                  onMouseLeave={(e) => {
                    e.target.background = "#48bb78";
                  }}
                >
                  ✓ Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={{
                    padding: "12px 24px",
                    background: "#cbd5e0",
                    color: "#2d3748",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.background = "#a0aec0";
                  }}
                  onMouseLeave={(e) => {
                    e.target.background = "#cbd5e0";
                  }}
                >
                  ✕ Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}