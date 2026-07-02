import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SystemAdmin() {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  // 🔄 Fetch events and bookings
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/events`)
      .then(res => res.json())
      .then(data => setEvents(data));

    fetch(`${process.env.REACT_APP_API_URL}/bookings`)
      .then(res => res.json())
      .then(data => setBookings(data));
  }, []);

  // 🔐 Logout function
  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/");
  };

  // 💼 Styles
  const containerStyle = {
    minHeight: "100vh",
    background: "#f4f6f8",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    padding: "15px 25px",
    background: "#2c3e50",
    color: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  };

  const logoutButtonStyle = {
    background: "#e74c3c",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold"
  };

  const eventCardStyle = {
    background: "white",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 3px 8px rgba(0,0,0,0.1)"
  };

  const bookingListStyle = {
    marginTop: "10px",
    paddingLeft: "20px"
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
          <p style={{ margin: 0, fontSize: "14px" }}>
            Welcome, {localStorage.getItem("username")}
          </p>
        </div>
        <button onClick={logout} style={logoutButtonStyle}>Logout</button>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <p>Loading events...</p>
      ) : (
        events.map(event => {
          const eventBookings = bookings.filter(b => b.event_id == event.id);

          return (
            <div key={event.id} style={eventCardStyle}>
              <h3 style={{ marginTop: 0 }}>{event.name}</h3>
              <p><b>Location:</b> {event.location}</p>
              <p><b>Organizer:</b> {event.organizer}</p>
              <p><b>Total Bookings:</b> {eventBookings.length}</p>

              {eventBookings.length === 0 ? (
                <p style={{ fontStyle: "italic", color: "#888" }}>No bookings yet</p>
              ) : (
                <ul style={bookingListStyle}>
                  {eventBookings.map((b, i) => (
                    <li key={i}>{b.user_name}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default SystemAdmin;