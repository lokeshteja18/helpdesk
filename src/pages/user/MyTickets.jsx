import { useEffect, useState } from "react";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedUser"));
    setLoggedUser(user);
    loadTickets();
  }, []);

  const loadTickets = () => {
    const all = JSON.parse(localStorage.getItem("tickets")) || [];
    const my = all.filter((t) => t.createdBy === (JSON.parse(localStorage.getItem("loggedUser"))?.email));
    setTickets(my);
  };

  const handleView = (ticket) => {
    alert(`Ticket ${ticket.id}\n\nSubject: ${ticket.subject}\n\nDescription: ${ticket.description}\n\nStatus: ${ticket.status}`);
  };

  const toggleStatus = (ticketId) => {
    const all = JSON.parse(localStorage.getItem("tickets")) || [];
    const updated = all.map((t) => {
      if (t.id === ticketId) {
        return { ...t, status: t.status === "Open" ? "Closed" : "Open" };
      }
      return t;
    });
    localStorage.setItem("tickets", JSON.stringify(updated));
    loadTickets();
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>📂 My Tickets</h1>
        <p>Tickets submitted by you. You can view details or change status.</p>
      </div>

      <div style={{ marginTop: 20 }}>
        {tickets.length === 0 ? (
          <div style={{ background: "white", padding: 24, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
            <p style={{ color: "#718096" }}>No tickets found. Create a new ticket to get support.</p>
          </div>
        ) : (
          <div style={{ background: "white", padding: 16, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ padding: 12 }}>Ticket</th>
                  <th style={{ padding: 12 }}>Subject</th>
                  <th style={{ padding: 12 }}>Priority</th>
                  <th style={{ padding: 12 }}>Status</th>
                  <th style={{ padding: 12 }}>Created</th>
                  <th style={{ padding: 12 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: 12 }}>{t.id}</td>
                    <td style={{ padding: 12 }}>{t.subject}</td>
                    <td style={{ padding: 12 }}>{t.priority}</td>
                    <td style={{ padding: 12, fontWeight: 700, color: t.status === "Open" ? "#38a169" : "#718096" }}>{t.status}</td>
                    <td style={{ padding: 12 }}>{new Date(t.createdAt).toLocaleString()}</td>
                    <td style={{ padding: 12 }}>
                      <button onClick={() => handleView(t)} style={{ marginRight: 8, padding: "8px 10px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f7fafc", cursor: "pointer" }}>View</button>
                      <button onClick={() => toggleStatus(t.id)} style={{ padding: "8px 10px", borderRadius: 8, border: "none", background: t.status === "Open" ? "#f56565" : "#48bb78", color: "white", cursor: "pointer" }}>{t.status === "Open" ? "Close" : "Reopen"}</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}