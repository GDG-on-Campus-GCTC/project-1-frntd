import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css";

export default function Signup() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) return "Please enter first and last name.";
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.email)) return "Enter a valid email.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError("");
    // Front-end only: replace with real API call when backend is ready
    console.log("Signup payload:", form);
    navigate("/login");
  };

  const handleGoogle = () => {
    alert("Google sign-up placeholder. Integrate OAuth when backend/client-id available.");
  };

  return (
    <main className="signup-page">
      <section className="signup-card">
        <h1 className="signup-title">Create an account</h1>

        <button type="button" className="btn google-btn" onClick={handleGoogle}>
          Sign up with Google
        </button>

        <div className="divider">or</div>

        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          {error && <div className="form-error">{error}</div>}

          <div className="row">
            <label className="field">
              First name
              <input name="firstName" value={form.firstName} onChange={handleChange} />
            </label>

            <label className="field">
              Last name
              <input name="lastName" value={form.lastName} onChange={handleChange} />
            </label>
          </div>

          <label className="field">
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} />
          </label>

          <label className="field">
            Password
            <input name="password" type="password" value={form.password} onChange={handleChange} />
          </label>

          <button type="submit" className="btn primary">Sign up</button>

          <p className="signin-note">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </section>
    </main>
  );
}