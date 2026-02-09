import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

// Mock data for fallback
const MOCK_AGENT_DATA = [
  { name: "Account", value: 1 },
  { name: "Technical", value: 1 },
  { name: "Security", value: 1 },
];

const MOCK_AGENT_STATUS = [
  { name: "Open", value: 2 },
  { name: "In Progress", value: 1 },
];

export default function DashboardHome() {
  const [loggedUser, setLoggedUser] = useState(null);
  const [ticketStats, setTicketStats] = useState({ assigned: 3, resolved: 0, pending: 3 });
  const [categoryStats, setCategoryStats] = useState(MOCK_AGENT_DATA);
  const [statusStats, setStatusStats] = useState(MOCK_AGENT_STATUS);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedUser"));
    setLoggedUser(user);
    
    // Fetch tickets assigned to this agent
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/tickets", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const allTickets = response.data.data || [];
        
        // Filter tickets assigned to this agent
        const agentTickets = allTickets.filter(t => {
          if (t.assignedTo && user?._id) {
            return t.assignedTo === user._id || t.assignedTo._id === user._id;
          }
          return false;
        });
        
        if (agentTickets.length > 0) {
          const resolved = agentTickets.filter(t => t.status === "closed").length;
          const pending = agentTickets.filter(t => t.status !== "closed").length;
          setTicketStats({
            assigned: agentTickets.length,
            resolved,
            pending
          });
          
          // Calculate category statistics
          const categories = {};
          agentTickets.forEach(ticket => {
            const category = ticket.category || "Other";
            categories[category] = (categories[category] || 0) + 1;
          });
          
          const categoryData = Object.entries(categories).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value
          }));
          setCategoryStats(categoryData.length > 0 ? categoryData : MOCK_AGENT_DATA);
          
          // Calculate status statistics
          const statuses = {};
          agentTickets.forEach(ticket => {
            const status = ticket.status || "open";
            statuses[status] = (statuses[status] || 0) + 1;
          });
          
          const statusData = Object.entries(statuses).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value
          }));
          setStatusStats(statusData.length > 0 ? statusData : MOCK_AGENT_STATUS);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
        // Use mock data on error
      }
    };
    
    if (user?._id) {
      fetchTickets();
    }
  }, []);

  const COLORS = ["#3182ce", "#38a169", "#ed8936", "#e53e3e", "#805ad5"];

  return (
    <div>
      <div className="dashboard-header">
        <h1>🎯 Agent Dashboard</h1>
        <p>Welcome back, <strong>{loggedUser?.name || "Agent"}</strong>! 👋</p>
      </div>

      <div className="cards">
        <div className="card success">
          <h3>Assigned Tickets</h3>
          <div className="card-value">{ticketStats.assigned}</div>
          <div className="card-subtitle">Your queue</div>
        </div>

        <div className="card">
          <h3>Resolved Tickets</h3>
          <div className="card-value">{ticketStats.resolved}</div>
          <div className="card-subtitle">This month</div>
        </div>

        <div className="card warning">
          <h3>Pending Tickets</h3>
          <div className="card-value">{ticketStats.pending}</div>
          <div className="card-subtitle">Awaiting action</div>
        </div>
      </div>

      <div className="charts">
        <div className="chart-box">
          <div style={{ textAlign: "center" }}>
            <h3 style={{ marginBottom: "10px", color: "#1a202c" }}>📊 Tickets by Category</h3>
            <p style={{ color: "#718096", fontSize: "14px" }}>Your assigned tickets</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <div style={{ textAlign: "center" }}>
            <h3 style={{ marginBottom: "10px", color: "#1a202c" }}>⭐ Ticket Status</h3>
            <p style={{ color: "#718096", fontSize: "14px" }}>Status distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ marginTop: "40px", background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
        <h3>📋 Next Steps</h3>
        <div className="stats-grid" style={{ marginTop: "20px" }}>
          <div className="stat-item">
            <div className="stat-label">Avg Response Time</div>
            <div className="stat-value">15m</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Resolution Rate</div>
            <div className="stat-value">92%</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Customer Rating</div>
            <div className="stat-value">4.7</div>
          </div>
        </div>
      </div>
    </div>
  );
}