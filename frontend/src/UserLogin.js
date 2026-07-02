import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";


function UserLogin() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const login = () => {
    if (!name) return alert("Enter name");
    localStorage.setItem("userName", name);
    navigate("/home");
  };

  return (
    <div>
      <h2>User Login</h2>

      <input
        placeholder="Enter your name"
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={login}>Login</button>

      <p>
        New user? <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
}

export default UserLogin;