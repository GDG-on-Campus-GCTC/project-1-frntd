import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import Landing from "./Landing";
import Signup from './components/Signup';
import OTPVerify from './components/OTPVerify';
import LoginFailure from './components/LoginFailure';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'sonner';

function App() {
    return (
        <AuthProvider>
            <Toaster position="top-center" richColors duration={5000} />
            <AppRoutes />
        </AuthProvider>
    );
}

function AppRoutes() {
    const location = useLocation();
    const { user, loading } = useAuth();
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";

    if (loading) return null; // Or a loader

    return (
        <Routes location={location}>
            {/* Landing page - public */}
            <Route path="/" element={<Landing />} />

            {/* Login page */}
            <Route path="/login" element={<Login />} />
            <Route path="/login-failure" element={<LoginFailure />} />

            {/* Signup page */}
            <Route path="/signup" element={<Signup />} />

            {/* OTP Verification */}
            <Route path="/otp-verify" element={<OTPVerify />} />

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
