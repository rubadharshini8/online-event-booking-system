import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import RoleSelect from "./RoleSelect";
import Home from "./Home";
import Booking from "./Booking";
import OrganizerLogin from "./Login";
import Organizer from "./Organizer";
import Success from "./Success";
import OrganizerSignup from "./OrganizerSignup";
import SystemAdminLogin from "./SystemAdminLogin";
import SystemAdmin from "./SystemAdmin";
import EventRegistration from "./EventRegistration";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelect />} />
        <Route path="/home" element={<Home />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/organizer-login" element={<OrganizerLogin />} />
        <Route path="/organizer" element={<Organizer />} />
        <Route path="/success" element={<Success />} />
        <Route path="/organizer-signup" element={<OrganizerSignup />} />
        <Route path="/system-admin-login" element={<SystemAdminLogin />} />
        <Route path="/system-admin" element={<SystemAdmin />} />
        <Route path="/event-registrations/:id" element={<EventRegistration />} />
      </Routes>
    </Router>
  );
}

export default App;