import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";   // 🔥 THIS IS MUST

// 🔹 Initialize Dummy Accounts
const initializeDummyAccounts = () => {
  const existingUsers = localStorage.getItem("users");
  
  if (!existingUsers) {
    const dummyUsers = [
      {
        name: "Super Admin",
        email: "superadmin@gmail.com",
        password: "superadmin123",
        role: "superadmin",
      },
      {
        name: "Admin",
        email: "admin@gmail.com",
        password: "admin123",
        role: "admin",
      },
      {
        name: "Agent",
        email: "agent@gmail.com",
        password: "agent123",
        role: "agent",
      },
      {
        name: "John User",
        email: "user@gmail.com",
        password: "user123",
        role: "user",
      },
    ];
    
    localStorage.setItem("users", JSON.stringify(dummyUsers));
    console.log("✅ Dummy accounts initialized successfully!");
  }
};

// Initialize accounts before rendering
initializeDummyAccounts();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);