import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleRegister = (e) => {
    e.preventDefault();

    // 🔹 Get existing users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // 🔹 Check if email already exists
    const alreadyExists = users.find(
      (u) => u.email === email
    );

    if (alreadyExists) {
      alert("User already registered. Please login.");
      return;
    }

    // 🔹 Create new user object
    const newUser = {
      name,
      dob,
      email,
      password,
      role, // IMPORTANT: lowercase role
    };

    // 🔹 Save user
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful");
    navigate("/login");
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <h2>Register</h2>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>

        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}