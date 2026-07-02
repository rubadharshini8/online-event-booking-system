import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Event details
  const [event, setEvent] = useState(null);

  // Solo fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Team fields
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState([
    { name: "", email: "", phone: "" }  // first member = leader
  ]);

  // Fetch event to know if solo or team
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/events`)
      .then(res => res.json())
      .then(data => {
        const found = data.find(e => String(e.id) === String(id));
        setEvent(found);

        // Pre-fill member slots based on team size
        if (found && found.event_type === "team") {
          const slots = Array.from({ length: found.team_size }, () => ({
            name: "", email: "", phone: ""
          }));
          setMembers(slots);
        }
      });
  }, [id]);

  // Update a specific member's field
  const updateMember = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  // Validate and submit solo booking
  const confirmSoloBooking = async () => {
    if (!name || !email || !phone) {
      alert("Please fill all fields");
      return;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Enter valid 10-digit phone number");
      return;
    }
    if (!email.includes("@")) {
      alert("Enter valid email");
      return;
    }

    const res = await fetch(`${process.env.REACT_APP_API_URL}/book/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone })
    });

    const text = await res.text();
    try {
      const data = JSON.parse(text);
      if (data.success) {
        navigate("/success", { state: data });
      } else {
        alert("Booking failed");
      }
    } catch {
      alert("Server error: " + text);
    }
  };

  // Validate and submit team booking
  const confirmTeamBooking = async () => {
    if (!teamName) {
      alert("Please enter a team name");
      return;
    }

    // Validate all members
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      const label = i === 0 ? "Leader" : `Member ${i + 1}`;

      if (!m.name || !m.email || !m.phone) {
        alert(`Please fill all fields for ${label}`);
        return;
      }
      if (!m.email.includes("@")) {
        alert(`Enter valid email for ${label}`);
        return;
      }
      if (!/^[0-9]{10}$/.test(m.phone)) {
        alert(`Enter valid 10-digit phone for ${label}`);
        return;
      }
    }

    const res = await fetch(`${process.env.REACT_APP_API_URL}/book-team/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamName, members })
    });

    const text = await res.text();
    try {
      const data = JSON.parse(text);
      if (data.success) {
        navigate("/success", { state: data });
      } else {
        alert("Booking failed: " + data.message);
      }
    } catch {
      alert("Server error: " + text);
    }
  };

  // ── Styles ──────────────────────────────────────────
  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    boxSizing: "border-box"
  };

  const memberCardStyle = {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "15px"
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(135deg, #36d1dc, #5b86e5)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold"
  };
  // ────────────────────────────────────────────────────

  if (!event) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Loading event details...</p>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #74ebd5, #9face6)",
      padding: "40px 20px",
      fontFamily: "Arial"
    }}>
      <div style={{
        background: "white",
        padding: "30px",
        borderRadius: "15px",
        width: "100%",
        maxWidth: "480px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
      }}>

        {/* Event Info Banner */}
        <div style={{
          background: event.event_type === "team" ? "#8e44ad" : "#3498db",
          color: "white",
          borderRadius: "10px",
          padding: "12px 16px",
          marginBottom: "24px",
          textAlign: "center"
        }}>
          <h2 style={{ margin: 0 }}>🎟 {event.name}</h2>
          <p style={{ margin: "5px 0 0", fontSize: "13px", opacity: 0.9 }}>
            {event.event_type === "team"
              ? `👥 Team Event — Max ${event.team_size} members per team`
              : "👤 Solo Event"}
          </p>
        </div>

        {/* ── SOLO FORM ── */}
        {event.event_type !== "team" && (
          <>
            <h3 style={{ marginBottom: "15px", color: "#333" }}>Your Details</h3>

            <input style={inputStyle} type="text" placeholder="👤 Your Name"
              value={name} onChange={(e) => setName(e.target.value)} />

            <input style={inputStyle} type="email" placeholder="📧 Email Address"
              value={email} onChange={(e) => setEmail(e.target.value)} />

            <input style={inputStyle} type="tel" placeholder="📱 Phone Number"
              value={phone} onChange={(e) => setPhone(e.target.value)} />

            <button style={buttonStyle} onClick={confirmSoloBooking}>
              Confirm Booking 🚀
            </button>
          </>
        )}

        {/* ── TEAM FORM ── */}
        {event.event_type === "team" && (
          <>
            <input
              style={{ ...inputStyle, fontWeight: "bold", fontSize: "15px" }}
              type="text"
              placeholder="🏷 Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />

            {members.map((member, index) => (
              <div key={index} style={{
                ...memberCardStyle,
                borderLeft: `4px solid ${index === 0 ? "#e67e22" : "#3498db"}`
              }}>
                <p style={{
                  margin: "0 0 10px",
                  fontWeight: "bold",
                  color: index === 0 ? "#e67e22" : "#3498db"
                }}>
                  {index === 0 ? "👑 Team Leader" : `👤 Member ${index + 1}`}
                </p>

                <input style={inputStyle} type="text" placeholder="Full Name"
                  value={member.name}
                  onChange={(e) => updateMember(index, "name", e.target.value)} />

                <input style={inputStyle} type="email" placeholder="Email Address"
                  value={member.email}
                  onChange={(e) => updateMember(index, "email", e.target.value)} />

                <input style={inputStyle} type="tel" placeholder="Phone Number"
                  value={member.phone}
                  onChange={(e) => updateMember(index, "phone", e.target.value)} />
              </div>
            ))}

            <button style={buttonStyle} onClick={confirmTeamBooking}>
              Confirm Team Booking 🚀
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default Booking;