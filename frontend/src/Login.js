import React, { useState } from "react";

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "#ecf0f1"
};

const cardStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  width: "300px",
  textAlign: "center"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "10px 0",
  borderRadius: "5px",
  border: "1px solid #ccc"
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  background: "#3498db",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold"
};

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

  const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  console.log(data);

  if (data.success) {
    localStorage.setItem("role", "admin");
    localStorage.setItem("username", username);  
    window.location.href = "/organizer";
  } else {
    alert("Invalid credentials");
  }
};

  return (
    <div style={containerStyle}>
    <div style={cardStyle}>
      <h2>Organizer Login</h2>

      <input
        style={inputStyle}
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        style={inputStyle}
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button style={buttonStyle} onClick={handleLogin}>
        Login
      </button>

      <p>
        New Organizer? <a href="/organizer-signup">Sign up</a>
      </p>
    </div>
  </div>
  );
}

export default Login;