import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SystemAdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


 const login = async () => {
  if (!username || !password) {
    alert("Please enter username and password");
    return;
  }

  const res = await fetch(`${process.env.REACT_APP_API_URL}/admin-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (data.success) {
    localStorage.setItem("role", "systemadmin");
    localStorage.setItem("username", username);
    navigate("/system-admin");
  } else {
    alert("Invalid Admin Credentials");
  }
};

  // Styles
  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const cardStyle = {
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(8px)",
    padding: "40px 30px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "380px",  // ensures card doesn't stretch too wide
    textAlign: "center",
    display: "flex",
    flexDirection: "column",  // stack inputs vertically
    gap: "16px"              // uniform spacing between elements
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    boxSizing: "border-box"  // ensures padding doesn't break width
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    background: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px"
  };

  const titleStyle = {
    marginBottom: "10px",
    color: "#2c3e50"
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>System Admin Login</h2>

        <input
          style={inputStyle}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          style={inputStyle}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={buttonStyle} onClick={login}>
          Login
        </button>
      </div>
    </div>
  );
}

export default SystemAdminLogin;