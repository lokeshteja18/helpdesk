import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [activeTab, setActiveTab] = useState("user"); // "user", "staff", or "superadmin"
  const [isRegister, setIsRegister] = useState(false); // Toggle between login/register in user section
  
  // User section states
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userConfirmPassword, setUserConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");

  // Staff roles section states (Agent & Admin)
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [staffRole, setStaffRole] = useState("agent");

  // Super Admin section states
  const [superAdminEmail, setSuperAdminEmail] = useState("");
  const [superAdminPassword, setSuperAdminPassword] = useState("");

  const navigate = useNavigate();

  // 🔹 User Register Handler
  const handleUserRegister = (e) => {
    e.preventDefault();

    if (userPassword !== userConfirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!userName || !userEmail || !userPassword) {
      alert("All fields are required");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const normalizedEmail = userEmail.trim().toLowerCase();

    // Check if user already exists
    if (users.find((u) => u.email.toLowerCase() === normalizedEmail)) {
      alert("Email already registered");
      return;
    }

    // Add new user
    const newUser = {
      name: userName,
      email: normalizedEmail,
      password: userPassword,
      role: "user",
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful! Please login.");
    setIsRegister(false);
    setUserEmail("");
    setUserPassword("");
    setUserConfirmPassword("");
    setUserName("");
  };

  // 🔹 User Login Handler
  const handleUserLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const normalizedEmail = userEmail.trim().toLowerCase();

    const foundUser = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.password === userPassword && u.role === "user"
    );

    if (!foundUser) {
      alert("Invalid email or password");
      return;
    }

    localStorage.setItem("loggedUser", JSON.stringify(foundUser));
    navigate("/user");
  };

  // 🔹 Staff (Agent & Admin) Login Handler
  const handleStaffLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const normalizedEmail = staffEmail.trim().toLowerCase();

    const foundUser = users.find((u) => u.email.toLowerCase() === normalizedEmail && u.password === staffPassword);

    if (!foundUser) {
      alert("Invalid email or password");
      return;
    }

    // Ensure selected role matches the account's role
    if (foundUser.role !== staffRole) {
      alert(`Account exists but is a '${foundUser.role}'. Please select the correct role.`);
      return;
    }

    localStorage.setItem("loggedUser", JSON.stringify(foundUser));

    if (foundUser.role === "agent") {
      navigate("/agent");
    } else if (foundUser.role === "admin") {
      navigate("/admin");
    }
  };

  // 🔹 Super Admin Login Handler
  const handleSuperAdminLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const normalizedEmail = superAdminEmail.trim().toLowerCase();

    const foundUser = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.password === superAdminPassword && u.role === "superadmin"
    );

    if (!foundUser) {
      alert("Invalid email or password");
      return;
    }

    localStorage.setItem("loggedUser", JSON.stringify(foundUser));
    navigate("/superadmin");
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Helpdesk Portal</h2>

        {/* 🔹 Tabs for User, Staff, and Super Admin */}
        <div className="login-tabs">
          <button
            type="button"
            className={`tab ${activeTab === "user" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("user");
              setIsRegister(false);
              setUserEmail("");
              setUserPassword("");
            }}
          >
            User Login & Register
          </button>
          <button
            type="button"
            className={`tab ${activeTab === "staff" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("staff");
              setStaffEmail("");
              setStaffPassword("");
            }}
          >
            Staff Login
          </button>
          <button
            type="button"
            className={`tab ${activeTab === "superadmin" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("superadmin");
              setSuperAdminEmail("");
              setSuperAdminPassword("");
            }}
          >
            Super Admin Login
          </button>
        </div>

        {/* 🔹 USER SECTION - Login & Register */}
        {activeTab === "user" && (
          <div className="tab-content">
            {/* Register Form */}
            {isRegister ? (
              <form onSubmit={handleUserRegister}>
                <h3>User Registration</h3>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email ID"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={userConfirmPassword}
                  onChange={(e) => setUserConfirmPassword(e.target.value)}
                  required
                />
                <button type="submit" className="login-btn">
                  Register
                </button>
                <p className="toggle-text">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsRegister(false)}
                    className="toggle-link"
                  >
                    Login
                  </button>
                </p>
              </form>
            ) : (
              /* Login Form */
              <form onSubmit={handleUserLogin}>
                <h3>User Login</h3>
                <input
                  type="email"
                  placeholder="Email ID"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  required
                />
                <div className="options">
                  <label className="remember">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a href="/forgot-password" className="forgot">
                    Forgot Password?
                  </a>
                </div>
                <button type="submit" className="login-btn">
                  Login
                </button>
                <p className="toggle-text">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsRegister(true)}
                    className="toggle-link"
                  >
                    Register here
                  </button>
                </p>
              </form>
            )}
          </div>
        )}

        {/* 🔹 STAFF SECTION - Agent & Admin Login */}
        {activeTab === "staff" && (
          <div className="tab-content">
            <form onSubmit={handleStaffLogin}>
              <h3>Staff Login</h3>
              <div className="role-selector">
                <label htmlFor="staffRole">Select Role:</label>
                <select
                  id="staffRole"
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value)}
                  required
                >
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <input
                type="email"
                placeholder="Email ID"
                value={staffEmail}
                onChange={(e) => setStaffEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={staffPassword}
                onChange={(e) => setStaffPassword(e.target.value)}
                required
              />
              <div className="options">
                <label className="remember">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="/forgot-password" className="forgot">
                  Forgot Password?
                </a>
              </div>
              <button type="submit" className="login-btn">
                Login
              </button>
            </form>
          </div>
        )}

        {/* 🔹 SUPER ADMIN SECTION */}
        {activeTab === "superadmin" && (
          <div className="tab-content">
            <form onSubmit={handleSuperAdminLogin}>
              <h3>Super Admin Login</h3>
              <input
                type="email"
                placeholder="Email ID"
                value={superAdminEmail}
                onChange={(e) => setSuperAdminEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={superAdminPassword}
                onChange={(e) => setSuperAdminPassword(e.target.value)}
                required
              />
              <div className="options">
                <label className="remember">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="/forgot-password" className="forgot">
                  Forgot Password?
                </a>
              </div>
              <button type="submit" className="login-btn">
                Login
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}