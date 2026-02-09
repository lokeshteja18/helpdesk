import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

// Mock data for fallback
const MOCK_CATEGORY_DATA = [
  { name: "Account", value: 3 },
  { name: "Technical", value: 2 },
  { name: "Security", value: 2 },
  { name: "Billing", value: 1 },
];

const MOCK_STATUS_DATA = [
  { name: "Open", value: 3 },
  { name: "In Progress", value: 2 },
  { name: "On Hold", value: 1 },
  { name: "Closed", value: 2 },
];

const MOCK_PRIORITY_DATA = [
  { name: "High", value: 3 },
  { name: "Medium", value: 2 },
  { name: "Low", value: 2 },
  { name: "Critical", value: 1 },
];

export default function DashboardHome() {
  const [loggedUser, setLoggedUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 8,
    totalStaff: 3,
    totalTickets: 8,
    openTickets: 3,
  });
  const [categoryStats, setCategoryStats] = useState(MOCK_CATEGORY_DATA);
  const [statusStats, setStatusStats] = useState(MOCK_STATUS_DATA);
  const [priorityStats, setPriorityStats] = useState(MOCK_PRIORITY_DATA);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedUser"));
    setLoggedUser(user);

    // Fetch all tickets and users
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch tickets
        const ticketResponse = await axios.get("http://localhost:5000/api/tickets", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const allTickets = ticketResponse.data.data || [];
        
        if (allTickets.length > 0) {
          const openTickets = allTickets.filter(t => t.status !== "closed").length;
          
          // Calculate category statistics
          const categories = {};
          allTickets.forEach(ticket => {
            const category = ticket.category || "Other";
            categories[category] = (categories[category] || 0) + 1;
          });
          
          const categoryData = Object.entries(categories).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value
          }));
          setCategoryStats(categoryData.length > 0 ? categoryData : MOCK_CATEGORY_DATA);
          
          // Calculate status statistics
          const statuses = {};
          allTickets.forEach(ticket => {
            const status = ticket.status || "open";
            statuses[status] = (statuses[status] || 0) + 1;
          });
          
          const statusData = Object.entries(statuses).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value
          }));
          setStatusStats(statusData.length > 0 ? statusData : MOCK_STATUS_DATA);
          
          // Calculate priority statistics
          const priorities = {};
          allTickets.forEach(ticket => {
            const priority = ticket.priority || "medium";
            priorities[priority] = (priorities[priority] || 0) + 1;
          });
          
          const priorityData = Object.entries(priorities).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value
          }));
          setPriorityStats(priorityData.length > 0 ? priorityData : MOCK_PRIORITY_DATA);
          
          setStats({
            totalUsers: 8,
            totalStaff: 3,
            totalTickets: allTickets.length,
            openTickets,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Use mock data on error
      }
    };
    
    fetchData();
  }, []);

  const COLORS = ["#3182ce", "#38a169", "#ed8936", "#e53e3e", "#805ad5", "#d69e2e"];

  return (
    <div>
      <div className="dashboard-header">
        <h1>🎯 Super Admin Dashboard</h1>
        <p>Welcome back, <strong>{loggedUser?.name || "Super Admin"}</strong>! 👋</p>
      </div>

      <div className="cards">
        <div className="card">
          <h3>Total Users</h3>
          <div className="card-value">{stats.totalUsers}</div>
          <div className="card-subtitle">All registered users</div>
        </div>

        <div className="card success">
          <h3>Staff Members</h3>
          <div className="card-value">{stats.totalStaff}</div>
          <div className="card-subtitle">Agents & Admins</div>
        </div>

        <div className="card warning">
          <h3>Total Tickets</h3>
          <div className="card-value">{stats.totalTickets}</div>
          <div className="card-subtitle">All support tickets</div>
        </div>

        <div className="card danger">
          <h3>Open Tickets</h3>
          <div className="card-value">{stats.openTickets}</div>
          <div className="card-subtitle">Pending resolution</div>
        </div>
      </div>

      <div className="charts">
        <div className="chart-box">
          <div style={{ textAlign: "center" }}>
            <h3 style={{ marginBottom: "10px", color: "#1a202c" }}>📊 Tickets by Category</h3>
            <p style={{ color: "#718096", fontSize: "14px" }}>System-wide distribution</p>
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
            <h3 style={{ marginBottom: "10px", color: "#1a202c" }}>📈 Ticket Status</h3>
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

        <div className="chart-box">
          <div style={{ textAlign: "center" }}>
            <h3 style={{ marginBottom: "10px", color: "#1a202c" }}>🎯 Priority Distribution</h3>
            <p style={{ color: "#718096", fontSize: "14px" }}>Ticket priorities</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {priorityStats.map((entry, index) => (
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
        <h3>📋 Quick Stats</h3>
        <div className="stats-grid" style={{ marginTop: "20px" }}>
          <div className="stat-item">
            <div className="stat-label">Average Response Time</div>
            <div className="stat-value">2.4h</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Resolution Rate</div>
            <div className="stat-value">94%</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Customer Satisfaction</div>
            <div className="stat-value">4.8/5</div>
          </div>
        </div>
      </div>
    </div>
  );
}