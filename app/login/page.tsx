"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "../css/login.css";
import { createClient } from "../../utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

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

  const showPasswordOnHold = () => {
    setShowPassword(true);
  };

  const hidePasswordAfterHold = () => {
    setShowPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
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
        .eq("user_email", trimmedEmail)
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
        window.location.replace("/dashboard");
        return;
      }

      if (data.user_role === "Operator") {
        window.location.replace("/operator");
        return;
      }

      setGeneralError("Akun Anda tidak memiliki akses ke sistem ini.");
      setLoading(false);
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                  setGeneralError("");
                }}
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>

              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-input${passwordError ? " input-error" : ""}`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                    setGeneralError("");
                  }}
                  autoComplete="current-password"
                  style={styles.passwordInput}
                />

                <button
                  type="button"
                  aria-label="Hold to show password"
                  title="Hold to show password"
                  style={styles.eyeButton}
                  onMouseDown={showPasswordOnHold}
                  onMouseUp={hidePasswordAfterHold}
                  onMouseLeave={hidePasswordAfterHold}
                  onTouchStart={showPasswordOnHold}
                  onTouchEnd={hidePasswordAfterHold}
                  onTouchCancel={hidePasswordAfterHold}
                  onBlur={hidePasswordAfterHold}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  {showPassword ? (
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                      <path d="M4 4l16 16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

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

const styles: Record<string, React.CSSProperties> = {
  passwordWrapper: {
    position: "relative",
    width: "100%",
  },

  passwordInput: {
    paddingRight: "54px",
  },

  eyeButton: {
    position: "absolute",
    right: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "34px",
    height: "34px",
    border: "none",
    background: "transparent",
    color: "#4b5563",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    userSelect: "none",
  },
};