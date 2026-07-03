const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
require("dotenv").config(); 

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.log("Database connection failed");
  } else {
    console.log("Connected to MySQL");
  }
});

// ── Events ──────────────────────────────────────────────────────

app.get("/events", (req, res) => {
  db.query("SELECT * FROM events", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.post("/events", (req, res) => {
  const { name, location, seats, organizer, date, time, event_type, team_size } = req.body;
  const sql = `INSERT INTO events (name, location, seats, organizer, date, time, event_type, team_size)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [name, location, seats, organizer, date, time, event_type || "solo", team_size || 1], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error adding event");
    }
    res.send("Event added successfully");
  });
});

app.put("/events/:id", (req, res) => {
  const id = req.params.id;
  const { name, location, seats, date, time, organizer, event_type, team_size } = req.body;

  if (!name || !location || !seats || !date || !time) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = `UPDATE events 
               SET name=?, location=?, seats=?, date=?, time=?, event_type=?, team_size=?
               WHERE id=? AND organizer=?`;

  db.query(sql, [name, location, seats, date, time, event_type || "solo", team_size || 1, id, organizer], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Event not found or unauthorized" });
    }
    res.json({ message: "Event updated successfully" });
  });
});

app.delete("/events/:id", (req, res) => {
  const id = req.params.id;
  const username = req.query.username;
  db.query("DELETE FROM events WHERE id=? AND organizer=?", [id, username], (err, result) => {
    if (err) return res.status(500).send("Error");
    if (result.affectedRows === 0) return res.status(403).send("Not allowed");
    res.send("Deleted successfully");
  });
});

// ── Organizer Signup & Login ─────────────────────────────────────

app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  const checkSql = "SELECT * FROM organizers WHERE username=?";
  db.query(checkSql, [username], (err, result) => {
    if (err) return res.status(500).send("Error");

    if (result.length > 0) {
      return res.json({ success: false, message: "Username already taken" });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
  if (err) return res.status(500).send("Error hashing password");

  const insertSql = "INSERT INTO organizers (username, password) VALUES (?, ?)";
  db.query(insertSql, [username, hashedPassword], (err2) => {
    if (err2) {
      console.log(err2);
      return res.status(500).send("Error creating account");
    }
    res.json({ success: true, message: "Signup successful" });
  });
});
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt:", username);

  const sql = "SELECT * FROM organizers WHERE username=?";
  db.query(sql, [username], (err, result) => {
    if (err) throw err;

    if (result.length === 0) {
      return res.json({ success: false });
    }

    const hashedPassword = result[0].password;

    bcrypt.compare(password, hashedPassword, (err, match) => {
      if (err) return res.status(500).send("Error comparing password");

      if (match) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    });
  });
});
// ── Bookings ─────────────────────────────────────────────────────

app.get("/bookings", (req, res) => {
  db.query("SELECT * FROM bookings", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.post("/book/:id", (req, res) => {
  const eventId = req.params.id;
  const { name, email, phone } = req.body;

  const getEvent = "SELECT * FROM events WHERE id=?";
  db.query(getEvent, [eventId], (err, eventResult) => {
    if (err || eventResult.length === 0) {
      return res.status(500).send("Event not found");
    }

    const event = eventResult[0];

    const updateSeats = "UPDATE events SET seats = seats - 1 WHERE id=? AND seats > 0";
    db.query(updateSeats, [eventId], (err) => {
      if (err) return res.send("Error booking event");

      const insertBooking = `INSERT INTO bookings (event_id, user_name, email, phone)
                             VALUES (?, ?, ?, ?)`;
      db.query(insertBooking, [eventId, name, email, phone], (err, result) => {
        if (err) return res.send("Error saving booking");

        res.json({
          success: true,
          ticketId: result.insertId,
          name,
          eventName: event.name,
          location: event.location,
          date: event.date,
          time: event.time
        });
      });
    });
  });
});

app.post("/book-team/:id", (req, res) => {
  const eventId = req.params.id;
  const { teamName, members } = req.body;

  const ticketId = "TEAM-" + Date.now();

  const insertPromises = members.map((member, index) => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO bookings (event_id, user_name, email, phone, team_name, is_leader)
                   VALUES (?, ?, ?, ?, ?, ?)`;
      db.query(sql, [eventId, member.name, member.email, member.phone, teamName, index === 0 ? 1 : 0], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });

  Promise.all(insertPromises)
    .then(() => {
      db.query("UPDATE events SET seats = seats - 1 WHERE id=?", [eventId], (err) => {
        if (err) return res.status(500).send("Error updating seats");

        db.query("SELECT * FROM events WHERE id=?", [eventId], (err, result) => {
          if (err || result.length === 0) return res.status(500).send("Event not found");

          const event = result[0];
          res.json({
            success: true,
            ticketId,
            teamName,
            members,
            eventName: event.name,
            location: event.location,
            date: event.date,
            time: event.time
          });
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ success: false, message: "Error saving team booking" });
    });
});

// ── Organizers list ───────────────────────────────────────────────

app.get("/organizers", (req, res) => {
  db.query("SELECT * FROM organizers", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});
app.post("/admin-login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin123") {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});