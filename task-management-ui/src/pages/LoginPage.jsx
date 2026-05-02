import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
    const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data);
      navigate("/dashboard");
    } catch {
      setError("Email หรือ Password ไม่ถูกต้อง");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", padding: 24 }}>
      <h2>Task Management</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: "100%", marginBottom: 8, padding: 8 }} />
        </div>
        <div>
          <input placeholder="Password" type="password" value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: "100%", marginBottom: 8, padding: 8 }} />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ width: "100%", padding: 8 }}>Login</button>
      </form>
    </div>
  );
}