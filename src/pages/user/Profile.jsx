import { useEffect, useState } from "react";

export default function Profile() {
  const [loggedUser, setLoggedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedUser"));
    setLoggedUser(user);
    setForm({ name: user?.name || "", email: user?.email || "", password: user?.password || "" });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSave = () => {
    if (!form.name || !form.email) {
      alert("Name and Email are required");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updated = users.map((u) => (u.email === loggedUser.email ? { ...u, name: form.name, email: form.email, password: form.password } : u));
    const updatedLogged = { ...loggedUser, name: form.name, email: form.email, password: form.password };
    localStorage.setItem("users", JSON.stringify(updated));
    localStorage.setItem("loggedUser", JSON.stringify(updatedLogged));
    setLoggedUser(updatedLogged);
    setIsEditing(false);
    alert("Profile updated");
  };

  if (!loggedUser) return <div>Loading...</div>;

  return (
    <div>
      <div className="dashboard-header">
        <h1>👤 My Profile</h1>
        <p>Manage your account information and update your password.</p>
      </div>

      <div style={{ maxWidth: 700, marginTop: 20 }}>
        <div style={{ background: "white", padding: 24, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
          {!isEditing ? (
            <div>
              <p style={{ fontSize: 16, fontWeight: 700 }}>{loggedUser.name}</p>
              <p style={{ color: "#718096" }}>{loggedUser.email}</p>
              <p style={{ marginTop: 12, fontWeight: 600, color: "#667eea" }}>{loggedUser.role}</p>

              <div style={{ marginTop: 20 }}>
                <button onClick={() => setIsEditing(true)} style={{ padding: "10px 16px", background: "linear-gradient(135deg,#667eea,#764ba2)", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}>Edit Profile</button>
              </div>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0" }} />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>Email</label>
                <input name="email" value={form.email} onChange={handleChange} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0" }} />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e2e8f0" }} />
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                <button type="submit" style={{ padding: "10px 16px", background: "#48bb78", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}>Save</button>
                <button type="button" onClick={() => { setIsEditing(false); setForm({ name: loggedUser.name, email: loggedUser.email, password: loggedUser.password }); }} style={{ padding: "10px 16px", background: "#f7fafc", border: "1px solid #e2e8f0", color: "#4a5568", borderRadius: 8 }}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}