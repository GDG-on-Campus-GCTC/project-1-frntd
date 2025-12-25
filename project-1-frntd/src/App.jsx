import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/signup";
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import Landing from "./Landing";

function App() {
    const location = useLocation();
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

    return (
        <Routes location={location}>
            {/* Landing page - public */}
            <Route path="/" element={<Landing />} />

            {/* Login page */}
            <Route path="/login" element={
                isLoggedIn ? <Navigate to="/home" replace /> : <Login />
            } />

            {/* Signup page (same redirect behavior as Login) */}
            <Route path="/signup" element={
                isLoggedIn ? <Navigate to="/home" replace /> : <Signup />
            } />

            {/* Protected routes */}
            <Route path="/home" element={
                isLoggedIn ? <Home /> : <Navigate to="/login" replace />
            } />

            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
