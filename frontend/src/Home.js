import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function Home() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/events`)
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);

  return (
  <div style={{ padding: "20px", fontFamily: "Arial", background: "#f4f6f8", minHeight: "100vh" }}>

    {/* Header */}
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px"
    }}>
      <h2>Available Events</h2>

      <a
        href="/organizer-login"
        style={{
          textDecoration: "none",
          background: "#2c3e50",
          color: "white",
          padding: "8px 15px",
          borderRadius: "5px"
        }}
      >
        Organizer Login
      </a>
    </div>

    {/* Search bar */}
    <input
      type="text"
      placeholder="🔍 Search events..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        width: "300px",
        padding: "10px",
        marginBottom: "25px",
        borderRadius: "5px",
        border: "1px solid #ccc"
      }}
    />

    {/* Event Cards */}
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px"
    }}>

      {events
        .filter(event =>
          event.name.toLowerCase().includes(search.toLowerCase()) ||
          event.location.toLowerCase().includes(search.toLowerCase())
        )
        .map(event => (

          <div
            key={event.id}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
              transition: "0.3s"
            }}
          >

            <h3 style={{ marginBottom: "10px" }}>{event.name}</h3>

            <p style={{ color: "#555" }}>
              📍 {event.location}
            </p>

            <p style={{ marginBottom: "15px" }}>
              🎟 Seats Left: <b>{event.seats}</b>
            </p>
            <p>📅 {event.date}</p>
            <p>⏰ {event.time}</p>

            {event.seats > 0 ? (
              <button
                onClick={() => navigate(`/booking/${event.id}`)}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#3498db",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                Book Event
              </button>
            ) : (
              <button
                disabled
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "gray",
                  color: "white",
                  border: "none",
                  borderRadius: "5px"
                }}
              >
                Sold Out
              </button>
            )}

          </div>
        ))}
    </div>

  </div>
);
}
export default Home;