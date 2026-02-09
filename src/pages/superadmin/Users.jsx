import { useState, useEffect } from "react";

export default function Users() {
  const [allUsers, setAllUsers] = useState([]);
  const [staffUsers, setStaffUsers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStaffMember, setNewStaffMember] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "agent",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    setAllUsers(users);
    const staff = users.filter((u) => u.role === "agent" || u.role === "admin");
    setStaffUsers(staff);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaffMember({ ...newStaffMember, [name]: value });
    setMessage("");
  };

  const handleCreateStaffMember = (e) => {
    e.preventDefault();

    // Validation
    if (
      !newStaffMember.name ||
      !newStaffMember.email ||
      !newStaffMember.password ||
      !newStaffMember.confirmPassword
    ) {
      setMessage("All fields are required!");
      return;
    }

    if (newStaffMember.password !== newStaffMember.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    if (newStaffMember.password.length < 6) {
      setMessage("Password must be at least 6 characters long!");
      return;
    }

    // Check if email already exists
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find((u) => u.email === newStaffMember.email)) {
      setMessage("Email already exists!");
      return;
    }

    // Create new staff member
    const staffMember = {
      name: newStaffMember.name,
      email: newStaffMember.email,
      password: newStaffMember.password,
      role: newStaffMember.role,
    };

    users.push(staffMember);
    localStorage.setItem("users", JSON.stringify(users));

    setMessage(`${newStaffMember.role.toUpperCase()} created successfully!`);
    setNewStaffMember({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "agent",
    });

    setTimeout(() => {
      setShowCreateForm(false);
      loadUsers();
      setMessage("");
    }, 1500);
  };

  const handleDeleteStaffMember = (email) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const updatedUsers = users.filter((u) => u.email !== email);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      loadUsers();
      setMessage("Staff member deleted successfully!");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Staff Management (Agent & Admin)</h2>

      <button
        onClick={() => setShowCreateForm(!showCreateForm)}
        style={{
          padding: "10px 20px",
          marginBottom: "20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        {showCreateForm ? "Cancel" : "Create New Staff Member"}
      </button>

      {/* Create Staff Form */}
      {showCreateForm && (
        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "4px",
            marginBottom: "30px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3>Create New Staff Member</h3>
          <form onSubmit={handleCreateStaffMember}>
            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="name" style={{ display: "block", marginBottom: "5px" }}>
                Full Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newStaffMember.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="email" style={{ display: "block", marginBottom: "5px" }}>
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={newStaffMember.email}
                onChange={handleInputChange}
                placeholder="Enter email"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="password" style={{ display: "block", marginBottom: "5px" }}>
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={newStaffMember.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="confirmPassword" style={{ display: "block", marginBottom: "5px" }}>
                Confirm Password:
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={newStaffMember.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="role" style={{ display: "block", marginBottom: "5px" }}>
                Select Role:
              </label>
              <select
                id="role"
                name="role"
                value={newStaffMember.role}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
                }}
              >
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {message && (
              <div
                style={{
                  marginBottom: "15px",
                  padding: "10px",
                  borderRadius: "4px",
                  backgroundColor:
                    message.includes("successfully") || message.includes("created")
                      ? "#d4edda"
                      : "#f8d7da",
                  color:
                    message.includes("successfully") || message.includes("created")
                      ? "#155724"
                      : "#721c24",
                  border: "1px solid #ccc",
                }}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Create Staff Member
            </button>
          </form>
        </div>
      )}

      {/* Staff Members List */}
      <div>
        <h3>Current Staff Members ({staffUsers.length})</h3>
        {staffUsers.length === 0 ? (
          <p>No staff members found.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "15px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0", borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: "10px", textAlign: "left", borderRight: "1px solid #ddd" }}>
                  Name
                </th>
                <th style={{ padding: "10px", textAlign: "left", borderRight: "1px solid #ddd" }}>
                  Email
                </th>
                <th style={{ padding: "10px", textAlign: "left", borderRight: "1px solid #ddd" }}>
                  Role
                </th>
                <th style={{ padding: "10px", textAlign: "left" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffUsers.map((user, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: "1px solid #ddd",
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                  }}
                >
                  <td style={{ padding: "10px", borderRight: "1px solid #ddd" }}>
                    {user.name}
                  </td>
                  <td style={{ padding: "10px", borderRight: "1px solid #ddd" }}>
                    {user.email}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      borderRight: "1px solid #ddd",
                      textTransform: "uppercase",
                      fontWeight: "bold",
                      color: user.role === "admin" ? "#ff6b6b" : "#4CAF50",
                    }}
                  >
                    {user.role}
                  </td>
                  <td style={{ padding: "10px" }}>
                    <button
                      onClick={() => handleDeleteStaffMember(user.email)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}