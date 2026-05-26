"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "../css/login.css";
import { createClient } from "../../utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (data.user?.email?.includes('admin')) {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/operator";
      }
    } catch (err: any) {
      setError("An unexpected error occurred");
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
              <label className="form-label">Email / Username</label>
              <input
                type="text"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {error && <div style={{ color: "#ef4444", fontSize: "12px", marginBottom: "1rem", textAlign: "center" }}>{error}</div>}

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

//login
