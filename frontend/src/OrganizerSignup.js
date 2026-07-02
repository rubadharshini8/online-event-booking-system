import { useState } from "react";
import { useNavigate } from "react-router-dom";


function OrganizerSignup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signup = async () => {
  if (!username || !password) {
    alert("Please enter username and password");
    return;
  }

  const res = await fetch(`${process.env.REACT_APP_API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  // FIX: was res.text(), backend returns JSON
  const data = await res.json();

  if (data.success) {
    alert("Signup successful! Please login.");
    navigate("/organizer-login");
  } else {
    alert(data.message || "Signup failed");
  }
};

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#f4f6f8"
    }}>

      <div style={{
        background: "white",
        padding: "35px",
        borderRadius: "10px",
        width: "350px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
      }}>

        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Organizer Signup
        </h2>

        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        />

        <button
          onClick={signup}
          style={{
            width: "100%",
            padding: "10px",
            background: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Signup
        </button>

        <p style={{ textAlign: "center", marginTop: "15px" }}>
          Already an organizer?{" "}
          <span
            onClick={() => navigate("/organizer-login")}
            style={{ color: "#3498db", cursor: "pointer" }}
          >
            Login
          </span>
        </p>

      </div>

    </div>
  );

}

export default OrganizerSignup;