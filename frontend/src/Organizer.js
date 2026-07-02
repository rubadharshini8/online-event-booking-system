import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "10px 0",
  borderRadius: "5px",
  border: "1px solid #ccc"
};

const buttonStyle = {
  padding: "10px",
  background: "#3498db",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
  marginRight: "10px"
};

function Organizer() {
  const [events, setEvents] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [seats, setSeats] = useState("");
  const [editId, setEditId] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [eventType, setEventType] = useState("solo");   // NEW
  const [teamSize, setTeamSize] = useState("");          // NEW

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/");
  };

  const fetchEvents = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/events`);
    const data = await res.json();
    setEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const resetForm = () => {
    setName(""); setLocation(""); setSeats("");
    setDate(""); setTime("");
    setEventType("solo"); setTeamSize("");
    setEditId(null);
  };

  const addEvent = async () => {
    if (!name || !location || !seats || !date || !time) {
      alert("Please fill all fields");
      return;
    }
    if (eventType === "team" && (!teamSize || teamSize < 2)) {
      alert("Team size must be at least 2");
      return;
    }

    const username = localStorage.getItem("username");
    await fetch(`${process.env.REACT_APP_API_URL}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name, location, seats,
        organizer: username,
        date, time,
        event_type: eventType,          // NEW
        team_size: eventType === "team" ? teamSize : 1  // NEW
      })
    });
    alert("Event added successfully!");

    resetForm();
    fetchEvents();
  };

  const updateEvent = async () => {
    const username = localStorage.getItem("username");
    await fetch(`${process.env.REACT_APP_API_URL}/events/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name, location, seats,
        organizer: username,
        date, time,
        event_type: eventType,          // NEW
        team_size: eventType === "team" ? teamSize : 1  // NEW
      })
    });

    alert("Event updated successfully!");
    resetForm();
    fetchEvents();
  };

  const deleteEvent = async (id) => {
    const username = localStorage.getItem("username");
    await fetch(`${process.env.REACT_APP_API_URL}/events/${id}?username=${username}`, {
      method: "DELETE"
    });
    fetchEvents();
  };

  return (
    <div style={{ minHeight: "100vh", padding: "20px", background: "#f8fafc" }}>

      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 25px",
        background: "#2c3e50",
        color: "white",
        borderRadius: "8px",
        marginBottom: "20px"
      }}>
        <div>
          <h2 style={{ margin: 0 }}>Organizer Panel</h2>
          <p style={{ margin: 0 }}>Welcome, {localStorage.getItem("username")}</p>
        </div>
        <button onClick={logout} style={{
          background: "#e74c3c", color: "white", border: "none",
          padding: "8px 15px", borderRadius: "5px", cursor: "pointer"
        }}>
          Logout
        </button>
      </div>

      {/* Add / Edit Form */}
      <div style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "20px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
      }}>
        <h3>{editId ? "✏️ Edit Event" : "➕ Add Event"}</h3>

        <input style={inputStyle} placeholder="Event Name" value={name}
          onChange={(e) => setName(e.target.value)} />

        <input style={inputStyle} placeholder="Location" value={location}
          onChange={(e) => setLocation(e.target.value)} />

        <input style={inputStyle} placeholder="Total Seats" value={seats}
          onChange={(e) => setSeats(e.target.value)} />

        <input style={inputStyle} type="date" value={date}
          onChange={(e) => setDate(e.target.value)} />

        <input style={inputStyle} type="time" value={time}
          onChange={(e) => setTime(e.target.value)} />

        {/* NEW — Event Type Dropdown */}
        <select
          value={eventType}
          onChange={(e) => {
            setEventType(e.target.value);
            setTeamSize("");
          }}
          style={{ ...inputStyle, background: "white" }}
        >
          <option value="solo">👤 Solo Event</option>
          <option value="team">👥 Team Event</option>
        </select>

        {/* NEW — Team Size (only shown for team events) */}
        {eventType === "team" && (
          <input
            style={inputStyle}
            placeholder="Max Team Size (e.g. 4)"
            value={teamSize}
            type="number"
            min="2"
            onChange={(e) => setTeamSize(e.target.value)}
          />
        )}

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button style={buttonStyle} onClick={editId ? updateEvent : addEvent}>
            {editId ? "Update Event" : "Add Event"}
          </button>

          {editId && (
            <button
              style={{ ...buttonStyle, background: "#95a5a6" }}
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Events List */}
      {events
        .filter(evnt => evnt.organizer === localStorage.getItem("username"))
        .map((evnt) => (
          <div key={evnt.id} style={{
            background: "white",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "15px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            borderLeft: `5px solid ${evnt.event_type === "team" ? "#8e44ad" : "#3498db"}`
          }}>

            {/* NEW — Event type badge */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>{evnt.name}</h3>
              <span style={{
                background: evnt.event_type === "team" ? "#8e44ad" : "#3498db",
                color: "white",
                padding: "3px 10px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "bold"
              }}>
                {evnt.event_type === "team" ? `👥 Team (max ${evnt.team_size})` : "👤 Solo"}
              </span>
            </div>

            <p>📍 {evnt.location}</p>
            <p>🎟 Seats: {evnt.seats}</p>
            <p>📅 {evnt.date} &nbsp; ⏰ {evnt.time}</p>

            <div style={{ marginTop: "10px" }}>
              <button
                style={{ ...buttonStyle, background: "#e74c3c" }}
                onClick={() => deleteEvent(evnt.id)}
              >
                Delete
              </button>

              <button
                style={{ ...buttonStyle, background: "#f39c12" }}
                onClick={() => {
                  setEditId(evnt.id);
                  setName(evnt.name);
                  setLocation(evnt.location);
                  setSeats(evnt.seats);
                  setDate(evnt.date);
                  setTime(evnt.time);
                  setEventType(evnt.event_type || "solo");   // NEW
                  setTeamSize(evnt.team_size || "");          // NEW
                }}
              >
                Edit
              </button>

              <button
                style={{ ...buttonStyle, background: "#27ae60" }}
                onClick={() => navigate(`/event-registrations/${evnt.id}`)}
              >
                👥 View Registrations
              </button>
            </div>

          </div>
        ))}

    </div>
  );
}

export default Organizer;