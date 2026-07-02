import { useState } from "react";
import { useNavigate } from "react-router-dom";


function UserSignup() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const signup = () => {
    localStorage.setItem("userName", name);
    navigate("/");
  };

  return (
    <div>
      <h2>User Signup</h2>
      <input placeholder="Enter name" onChange={(e) => setName(e.target.value)} />
      <button onClick={signup}>Signup</button>
    </div>
  );
}

export default UserSignup;