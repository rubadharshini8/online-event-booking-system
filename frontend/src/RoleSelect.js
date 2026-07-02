import { useNavigate } from "react-router-dom";

function RoleSelect() {
  const navigate = useNavigate();

  // 🔹 Styles
  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const titleStyle = {
    marginBottom: "30px",
    color: "#2c3e50"
  };

  const gridStyle = {
    display: "flex",
    gap: "25px",
    flexWrap: "wrap",
    justifyContent: "center"
  };

  const cardStyle = {
    width: "220px",
    height: "180px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    transition: "0.3s",
    textAlign: "center"
  };

  const iconStyle = {
    fontSize: "40px",
    marginBottom: "10px"
  };

  const textStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#2c3e50"
  };

  // 🔹 Hover effect handler
  const handleHover = (e, isHover) => {
    e.currentTarget.style.transform = isHover ? "translateY(-8px)" : "translateY(0)";
    e.currentTarget.style.boxShadow = isHover
      ? "0 12px 25px rgba(0,0,0,0.2)"
      : "0 8px 20px rgba(0,0,0,0.1)";
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Select Your Role</h2>

      <div style={gridStyle}>
        
        {/* User Card */}
        <div
          style={{ ...cardStyle, borderTop: "5px solid #3498db" }}
          onClick={() => navigate("/home")}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          <div style={iconStyle}>👤</div>
          <div style={textStyle}>User</div>
        </div>

        {/* Organizer Card */}
        <div
          style={{ ...cardStyle, borderTop: "5px solid #2c3e50" }}
          onClick={() => navigate("/organizer-login")}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          <div style={iconStyle}>🎤</div>
          <div style={textStyle}>Organizer</div>
        </div>

        {/* Admin Card */}
        <div
          style={{ ...cardStyle, borderTop: "5px solid #8e44ad" }}
          onClick={() => navigate("/system-admin-login")}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          <div style={iconStyle}>🛠</div>
          <div style={textStyle}>System Admin</div>
        </div>

      </div>
    </div>
  );
}

export default RoleSelect;