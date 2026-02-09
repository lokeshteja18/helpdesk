import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateTicket() {
  const navigate = useNavigate();
  const [loggedUser, setLoggedUser] = useState(null);
  const [form, setForm] = useState({ subject: "", description: "", priority: "Medium" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedUser"));
    setLoggedUser(user);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.subject.trim() || !form.description.trim()) {
      setMessage("Please fill subject and description.");
      return;
    }

    const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
    const id = `T-${Date.now()}`;
    const ticket = {
      id,
      subject: form.subject,
      description: form.description,
      priority: form.priority,
      status: "Open",
      createdAt: new Date().toISOString(),
      createdBy: loggedUser?.email || "anonymous",
      createdByName: loggedUser?.name || "",
    };

    tickets.unshift(ticket);
    localStorage.setItem("tickets", JSON.stringify(tickets));

    setMessage("Ticket created successfully!");
    setForm({ subject: "", description: "", priority: "Medium" });

    setTimeout(() => {
      navigate("/user/my-tickets");
    }, 800);
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>📝 Create Ticket</h1>
        <p>Submit a new request and our support team will assist you shortly.</p>
      </div>

      <div style={{ maxWidth: 800, margin: "20px 0" }}>
        <form onSubmit={handleSubmit} style={{ background: "white", padding: 24, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, color: "#4a5568", fontWeight: 600 }}>Subject</label>
            <input name="subject" value={form.subject} onChange={handleChange} placeholder="Enter subject" style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, color: "#4a5568", fontWeight: 600 }}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your issue" rows={6} style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8, color: "#4a5568", fontWeight: 600 }}>Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange} style={{ padding: 10, borderRadius: 8, border: "1px solid #e2e8f0" }}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          {message && <div style={{ marginBottom: 16, color: message.includes("success") ? "#2f855a" : "#c53030" }}>{message}</div>}

          <div style={{ display: "flex", gap: 12 }}>
            <button type="submit" style={{ padding: "10px 18px", background: "linear-gradient(135deg,#667eea,#764ba2)", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Create Ticket</button>
            <button type="button" onClick={() => navigate('/user/my-tickets')} style={{ padding: "10px 18px", background: "#f7fafc", border: "1px solid #e2e8f0", color: "#4a5568", borderRadius: 8, cursor: "pointer" }}>View My Tickets</button>
          </div>
        </form>
      </div>
    </div>
  );
}