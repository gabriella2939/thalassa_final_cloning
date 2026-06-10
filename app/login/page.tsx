"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "../css/login.css";
import { createClient } from "../../utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const clearErrors = () => {
    setEmailError("");
    setPasswordError("");
    setGeneralError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (!email.trim()) {
      setEmailError("Email cannot be empty");
      return;
    }
    if (!password) {
      setPasswordError("Password cannot be empty");
      return;
    }
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("User")
        .select("*")
        .eq("user_email", email)
        .eq("user_password", password)
        .single();
      if (error || !data) {
        setEmailError(" ");
        setPasswordError(" ");
        setGeneralError("Incorrect email or password. Please check and try again");
        setLoading(false);
        return;
      }
      localStorage.setItem("user", JSON.stringify(data));

      if (data.user_role === "Admin") {
        router.push("/dashboard");
      } else if (data.user_role === "Operator") {
        router.push("/operator");
      } else {
        setGeneralError("Akun Anda tidak memiliki akses ke sistem ini.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error sistem:", err);
      setGeneralError("Terjadi kesalahan sistem. Coba beberapa saat lagi.");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <img src="/background_cp.jpg" alt="Background" className="bg-img" />
        <div className="bg-overlay" />

        <div className="login-card">
          <div className="logo-wrap">
            <div className="logo-circle">
              <img src="/logo-thalassa.png" alt="Thalassa Logo" />
            </div>
            <div>
              <div className="logo-title">Thalassa Sisterhood Group</div>
              <div className="logo-sub">Fleet Monitoring System</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="text"
                className={`form-input${emailError ? " input-error" : ""}`}
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  setEmailError("");
                  setGeneralError("");
                }}
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className={`form-input${passwordError ? " input-error" : ""}`}
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setPasswordError("");
                  setGeneralError("");
                }}
                autoComplete="current-password"
              />
            </div>


            {/* Pesan error — di atas tombol, rata tengah, merah */}
            {(emailError.trim() || passwordError.trim() || generalError) && (
              <p className="form-error-msg">
                {generalError || emailError.trim() || passwordError.trim()}
              </p>
            )}


            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Authenticating..." : "Access System"}
            </button>

          </form>

          <button
            type="button"
            className="back-link"
            onClick={() => router.push("/")}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </>
  );
}
