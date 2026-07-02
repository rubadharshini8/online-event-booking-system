import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EventRegistration() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("solo");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch event details
    fetch(`${process.env.REACT_APP_API_URL}/events`)
      .then(res => res.json())
      .then(events => {
        const event = events.find(e => String(e.id) === String(id));
        if (event) {
          setEventName(event.name);
          setEventType(event.event_type || "solo");
        }
      });

    // Fetch bookings filtered by event id
    fetch(`${process.env.REACT_APP_API_URL}/bookings`)
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(b => String(b.event_id) === String(id));
        setBookings(filtered);
        setLoading(false);
      });
  }, [id]);

  // Group bookings by team_name for team events
  const groupByTeam = () => {
    const teams = {};
    bookings.forEach(b => {
      const key = b.team_name || "Unknown Team";
      if (!teams[key]) teams[key] = [];
      teams[key].push(b);
    });
    return teams;
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f4f6f8",
      padding: "30px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>

      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#2c3e50",
        color: "white",
        padding: "15px 25px",
        borderRadius: "10px",
        marginBottom: "25px"
      }}>
        <div>
          <h2 style={{ margin: 0 }}>
            {eventType === "team" ? "👥" : "📋"} Registered Participants
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: "14px", opacity: 0.85 }}>
            Event: {eventName || `#${id}`} &nbsp;|&nbsp;
            <span style={{
              background: eventType === "team" ? "#8e44ad" : "#3498db",
              padding: "2px 10px",
              borderRadius: "10px",
              fontSize: "12px"
            }}>
              {eventType === "team" ? "👥 Team Event" : "👤 Solo Event"}
            </span>
          </p>
        </div>

        <button
          onClick={() => navigate("/organizer")}
          style={{
            background: "#3498db",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          ← Back to Panel
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <p style={{ textAlign: "center", color: "#888" }}>Loading...</p>

      ) : bookings.length === 0 ? (
        <div style={{
          textAlign: "center",
          background: "white",
          padding: "50px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          color: "#888"
        }}>
          <div style={{ fontSize: "50px", marginBottom: "10px" }}>📭</div>
          <h3>No registrations yet</h3>
          <p>No one has registered for this event so far.</p>
        </div>

      ) : eventType === "solo" ? (
        // ── SOLO VIEW ──────────────────────────────────────
        <>
          <div style={{
            display: "inline-block",
            background: "#27ae60",
            color: "white",
            padding: "8px 18px",
            borderRadius: "20px",
            marginBottom: "20px",
            fontWeight: "bold",
            fontSize: "14px"
          }}>
            ✅ Total Registrations: {bookings.length}
          </div>

          <div style={{
            background: "white",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 3px 10px rgba(0,0,0,0.1)"
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#2c3e50", color: "white" }}>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>👤 Name</th>
                  <th style={thStyle}>📧 Email</th>
                  <th style={thStyle}>📱 Phone</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr
                    key={i}
                    style={{ background: i % 2 === 0 ? "white" : "#f9f9f9" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#eaf4fb"}
                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "white" : "#f9f9f9"}
                  >
                    <td style={tdStyle}>{i + 1}</td>
                    <td style={{ ...tdStyle, fontWeight: "bold" }}>{b.user_name}</td>
                    <td style={tdStyle}>{b.email}</td>
                    <td style={tdStyle}>{b.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>

      ) : (
        // ── TEAM VIEW ──────────────────────────────────────
        <>
          {/* Summary */}
          <div style={{ display: "flex", gap: "15px", marginBottom: "20px", flexWrap: "wrap" }}>
            <div style={{
              background: "#8e44ad",
              color: "white",
              padding: "8px 18px",
              borderRadius: "20px",
              fontWeight: "bold",
              fontSize: "14px"
            }}>
              🏆 Total Teams: {Object.keys(groupByTeam()).length}
            </div>
            <div style={{
              background: "#27ae60",
              color: "white",
              padding: "8px 18px",
              borderRadius: "20px",
              fontWeight: "bold",
              fontSize: "14px"
            }}>
              👥 Total Participants: {bookings.length}
            </div>
          </div>

          {/* Team Cards */}
          {Object.entries(groupByTeam()).map(([teamName, members], teamIndex) => (
            <div key={teamIndex} style={{
              background: "white",
              borderRadius: "10px",
              marginBottom: "20px",
              boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
              overflow: "hidden"
            }}>

              {/* Team Header */}
              <div style={{
                background: "#8e44ad",
                color: "white",
                padding: "12px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <h3 style={{ margin: 0 }}>🏷 {teamName}</h3>
                <span style={{
                  background: "rgba(255,255,255,0.2)",
                  padding: "3px 12px",
                  borderRadius: "20px",
                  fontSize: "13px"
                }}>
                  {members.length} member{members.length > 1 ? "s" : ""}
                </span>
              </div>

              {/* Members Table */}
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f4f6f8" }}>
                    <th style={thStyle}>Role</th>
                    <th style={thStyle}>👤 Name</th>
                    <th style={thStyle}>📧 Email</th>
                    <th style={thStyle}>📱 Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, i) => (
                    <tr
                      key={i}
                      style={{ background: i % 2 === 0 ? "white" : "#f9f9f9" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f3e5f5"}
                      onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "white" : "#f9f9f9"}
                    >
                      <td style={tdStyle}>
                        {member.is_leader === 1 ? (
                          <span style={{
                            background: "#e67e22",
                            color: "white",
                            padding: "2px 10px",
                            borderRadius: "10px",
                            fontSize: "12px",
                            fontWeight: "bold"
                          }}>
                            👑 Leader
                          </span>
                        ) : (
                          <span style={{
                            background: "#3498db",
                            color: "white",
                            padding: "2px 10px",
                            borderRadius: "10px",
                            fontSize: "12px"
                          }}>
                            👤 Member
                          </span>
                        )}
                      </td>
                      <td style={{ ...tdStyle, fontWeight: "bold" }}>{member.user_name}</td>
                      <td style={tdStyle}>{member.email}</td>
                      <td style={tdStyle}>{member.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          ))}
        </>
      )}

    </div>
  );
}

const thStyle = {
  padding: "14px 16px",
  textAlign: "left",
  fontWeight: "bold",
  fontSize: "14px"
};

const tdStyle = {
  padding: "12px 16px",
  borderBottom: "1px solid #eee",
  fontSize: "14px"
};

export default EventRegistration;