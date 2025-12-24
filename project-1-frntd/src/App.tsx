import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import Login from "./components/Login";

function App() {
  const location = useLocation();
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

  return (
    <Routes location={location}>
      {/* Login page */}
      <Route path="/login" element={<Login />} />

      {/* Home/dashboard – only if logged in */}
      <Route
        path="/"
        element={
          isLoggedIn ? <Home /> : <Navigate to="/login" replace />
        }
      />

      {/* About page – publicly accessible */}
      <Route path="/about" element={<About />} />

      {/* Contact page – publicly accessible */}
      <Route path="/contact" element={<Contact />} />

      {/* Catch-all: send to home, which will itself redirect to /login if not logged in */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
