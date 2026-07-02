import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  console.log("Ticket data:", data);

  if (!data) return <h2>No ticket data</h2>;

  const isTeam = data.teamName ? true : false;

  const downloadPDF = () => {
    const ticket = document.getElementById("ticket");
    html2canvas(ticket, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`Ticket-${data.ticketId}.pdf`);
    });
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #74ebd5, #9face6)",
      padding: "40px 20px",
      fontFamily: "Arial"
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* Ticket */}
        <div id="ticket" style={{
          width: "380px",
          background: "white",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          marginBottom: "20px"
        }}>

          {/* Header */}
          <div style={{
            background: isTeam ? "#8e44ad" : "#2c3e50",
            color: "white",
            padding: "15px",
            textAlign: "center"
          }}>
            <h2 style={{ margin: 0 }}>🎟 Event Ticket</h2>
            <p style={{ margin: "5px 0 0", fontSize: "13px", opacity: 0.9 }}>
              {isTeam ? "👥 Team Registration" : "👤 Solo Registration"}
            </p>
          </div>

          {/* Body */}
          <div style={{ padding: "20px" }}>

            <p><b>🎟 Ticket ID:</b> {data.ticketId}</p>
            <p><b>🎉 Event:</b> {data.eventName}</p>
            <p><b>📍 Location:</b> {data.location}</p>
            <p><b>📅 Date:</b> {data.date}</p>
            <p><b>⏰ Time:</b> {data.time}</p>

            <hr style={{ margin: "15px 0" }} />

            {/* SOLO details */}
            {!isTeam && (
              <p><b>👤 Name:</b> {data.name}</p>
            )}

            {/* TEAM details */}
            {isTeam && (
              <>
                <p><b>🏷 Team Name:</b> {data.teamName}</p>

                <p style={{ marginBottom: "8px" }}><b>👥 Members:</b></p>

                {data.members.map((member, index) => (
                  <div key={index} style={{
                    background: index === 0 ? "#fef9f0" : "#f8fafc",
                    border: `1px solid ${index === 0 ? "#e67e22" : "#ddd"}`,
                    borderRadius: "8px",
                    padding: "10px 12px",
                    marginBottom: "8px",
                    fontSize: "13px"
                  }}>
                    <p style={{ margin: "0 0 4px", fontWeight: "bold", color: index === 0 ? "#e67e22" : "#333" }}>
                      {index === 0 ? "👑 Leader" : `👤 Member ${index + 1}`} — {member.name}
                    </p>
                    <p style={{ margin: "0 0 2px", color: "#555" }}>📧 {member.email}</p>
                    <p style={{ margin: 0, color: "#555" }}>📱 {member.phone}</p>
                  </div>
                ))}
              </>
            )}

            <hr style={{ margin: "15px 0" }} />

            <p style={{ textAlign: "center", color: "green", fontWeight: "bold" }}>
              ✅ Booking Confirmed
            </p>
          </div>

          {/* Footer */}
          <div style={{
            background: "#ecf0f1",
            padding: "10px",
            textAlign: "center",
            fontSize: "12px"
          }}>
            Show this ticket at entry
          </div>

        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => navigate("/home")}
            style={{
              padding: "10px 20px",
              background: "#2ecc71",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Back to Home
          </button>

          <button
            onClick={downloadPDF}
            style={{
              padding: "10px 20px",
              background: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Download PDF
          </button>
        </div>

      </div>
    </div>
  );
}

export default Success;