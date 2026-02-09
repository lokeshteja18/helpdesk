import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const found = users.find((u) => u.email === email);

    if (!found) {
      setMessage("No account found with that email.");
      return;
    }

    // In a real app you'd send reset email. Here we show a stub message.
    setMessage("Password reset link sent to your email (stub).");
    setTimeout(() => navigate("/login"), 1800);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 520, background: 'white', padding: 28, borderRadius: 12, boxShadow: '0 6px 30px rgba(15,23,42,0.08)', border: '1px solid #e6eef8' }}>
        <h2 style={{ marginBottom: 6, color: '#1a202c' }}>Forgot Password</h2>
        <p style={{ marginTop: 0, marginBottom: 18, color: '#718096' }}>Enter your account email and we'll send a password reset link.</p>

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 13, color: '#4a5568', fontWeight: 600 }}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 12 }}
          />

          {message && (
            <div style={{ marginBottom: 12, color: message.includes('sent') ? '#2f855a' : '#c53030' }}>{message}</div>
          )}

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" style={{ padding: '10px 16px', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>Send Reset Link</button>
            <button type="button" onClick={() => navigate('/login')} style={{ padding: '10px 16px', background: '#f7fafc', border: '1px solid #e2e8f0', color: '#4a5568', borderRadius: 8, cursor: 'pointer' }}>Back to Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}