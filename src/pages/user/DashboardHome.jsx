import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

// Mock data for fallback
const MOCK_USER_DATA = [
  { name: "Account", value: 2 },
  { name: "Technical", value: 1 },
  { name: "Security", value: 1 },
];

export default function DashboardHome() {
  const [loggedUser, setLoggedUser] = useState(null);
  const [ticketStats, setTicketStats] = useState({ total: 4, open: 2, closed: 2 });
  const [categoryStats, setCategoryStats] = useState(MOCK_USER_DATA);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedUser"));
    setLoggedUser(user);
    
    // Fetch tickets
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/tickets", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const allTickets = response.data.data || [];
        
        // Filter tickets for current user
        const userTickets = allTickets.filter(t => {
          if (t.userId && user?._id) {
            return t.userId === user._id || t.userId._id === user._id;
          }
          return false;
        });
        
        if (userTickets.length > 0) {
          const open = userTickets.filter(t => t.status !== "closed").length;
          const closed = userTickets.filter(t => t.status === "closed").length;
          setTicketStats({
            total: userTickets.length,
            open,
            closed
          });
          
          // Calculate category statistics for pie chart
          const categories = {};
          userTickets.forEach(ticket => {
            const category = ticket.category || "Other";
            categories[category] = (categories[category] || 0) + 1;
          });
          
          const categoryData = Object.entries(categories).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value
          }));
          setCategoryStats(categoryData.length > 0 ? categoryData : MOCK_USER_DATA);
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

  const COLORS = ["#3182ce", "#38a169", "#ed8936", "#e53e3e", "#805ad5", "#d69e2e"];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>🏠 User Dashboard</h1>
        <p>Welcome back, <strong>{loggedUser?.name || "User"}</strong>! 👋</p>
      </div>

      <div className="cards">
        <div className="card success">
          <h3>Total Tickets</h3>
          <div className="card-value">{ticketStats.total}</div>
          <div className="card-subtitle">Your support requests</div>
        </div>

        <div className="card warning">
          <h3>Open Tickets</h3>
          <div className="card-value">{ticketStats.open}</div>
          <div className="card-subtitle">Awaiting support</div>
        </div>

        <div className="card">
          <h3>Closed Tickets</h3>
          <div className="card-value">{ticketStats.closed}</div>
          <div className="card-subtitle">Resolved</div>
        </div>
      </div>

      <div className="charts">
        <div className="chart-box">
          <div style={{ textAlign: "center" }}>
            <h3 style={{ marginBottom: "10px", color: "#1a202c" }}>📊 Tickets by Category</h3>
            <p style={{ color: "#718096", fontSize: "14px" }}>Distribution of your support requests</p>
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
            <h3 style={{ marginBottom: "10px", color: "#1a202c" }}>🎯 Ticket Status</h3>
            <p style={{ color: "#718096", fontSize: "14px" }}>Open vs Closed tickets</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "Open", value: ticketStats.open },
                  { name: "Closed", value: ticketStats.closed }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#ed8936" />
                <Cell fill="#38a169" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <div style={{ textAlign: "center" }}>
            <h3 style={{ marginBottom: "10px", color: "#1a202c" }}>⭐ Satisfaction</h3>
            <p style={{ color: "#718096", fontSize: "14px" }}>Quality feedback</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "40px", background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
        <h3>💡 Support Tips</h3>
        <div className="stats-grid" style={{ marginTop: "20px" }}>
          <div className="stat-item">
            <div className="stat-label">Avg Response Time</div>
            <div className="stat-value">2h</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Resolution Rate</div>
            <div className="stat-value">95%</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Your Rating</div>
            <div className="stat-value">5.0</div>
          </div>
        </div>
      </div>
    </div>
  );
}