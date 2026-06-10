"use client";

import Navbar from "../components/Navbar";
import "../css/home.css";

export default function Fleet() {
  return (
    <>
      <Navbar />

      <main className="fleet-page-custom">
        <section className="fleet-content-custom">
          <div className="fleet-stats-custom">
            <div className="fleet-stat-box-custom">
              <div className="fleet-stat-value-custom">50+</div>
              <div className="fleet-stat-label-custom">ACTIVE FLEETS</div>
            </div>

            <div className="fleet-stat-box-custom">
              <div className="fleet-stat-value-custom">200+</div>
              <div className="fleet-stat-label-custom">COMPLETED VOYAGES</div>
            </div>

            <div className="fleet-stat-box-custom">
              <div className="fleet-stat-value-custom">15</div>
              <div className="fleet-stat-label-custom">DESTINATION PORTS</div>
            </div>

            <div className="fleet-stat-box-custom">
              <div className="fleet-stat-value-custom">24/7</div>
              <div className="fleet-stat-label-custom">LIVE MONITORING</div>
            </div>
          </div>

          <div className="fleet-center-text-custom">
            <h1>
              CONNECTING THE ARCHIPELAGO WITH <br />
              GLOBAL MARITIME STANDARDS
            </h1>

            <p>
              Thalassa Sisterhood Group is committed to being the most trusted
              and innovative maritime logistics partner in Southeast Asia,
              connecting strategic ports with secure, timely, and transparent
              shipping services.
            </p>
          </div>

          <div className="fleet-features-custom">
            <div className="fleet-feature-card-custom">
              <div className="fleet-feature-icon-custom">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3L19 6V11C19 15.5 16.1 19.7 12 21C7.9 19.7 5 15.5 5 11V6L12 3Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2>SAFETY</h2>
              <p>IMO &amp; SOLAS Standards</p>
            </div>

            <div className="fleet-feature-card-custom">
              <div className="fleet-feature-icon-custom">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 13H8L10 7L14 17L16 11H20"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2>EFFICIENCY</h2>
              <p>Real-time route optimization</p>
            </div>

            <div className="fleet-feature-card-custom">
              <div className="fleet-feature-icon-custom">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M16 11C17.66 11 19 9.66 19 8C19 6.34 17.66 5 16 5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 11C9.66 11 11 9.66 11 8C11 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M3 19C3 16.24 5.24 14 8 14C10.76 14 13 16.24 13 19"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M14 14C16.76 14 19 16.24 19 19"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h2>PROFESSIONAL</h2>
              <p>Internationally certified crew</p>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .fleet-page-custom {
          min-height: calc(100vh - 71px);
          width: 100%;
          padding: 28px 56px 64px;
          color: #ffffff;
          background:
            radial-gradient(
              circle at 15% 18%,
              rgba(88, 28, 135, 0.36),
              transparent 34%
            ),
            radial-gradient(
              circle at 85% 25%,
              rgba(88, 28, 135, 0.22),
              transparent 36%
            ),
            linear-gradient(
              135deg,
              #1b0735 0%,
              #120323 46%,
              #0a0113 100%
            );
          overflow-x: hidden;
        }

        .fleet-content-custom {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
        }

        .fleet-stats-custom {
          width: 100%;
          min-height: 138px;
          padding: 28px 54px;
          border: 1.5px solid rgba(168, 85, 247, 0.72);
          border-radius: 8px;
          background: rgba(11, 9, 32, 0.72);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          align-items: center;
          gap: 24px;
          box-shadow:
            0 0 0 1px rgba(168, 85, 247, 0.06),
            0 18px 48px rgba(0, 0, 0, 0.22);
        }

        .fleet-stat-box-custom {
          text-align: center;
        }

        .fleet-stat-value-custom {
          color: #a855f7;
          font-size: 48px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-shadow:
            0 0 10px rgba(168, 85, 247, 0.85),
            0 0 24px rgba(168, 85, 247, 0.45);
          margin-bottom: 14px;
        }

        .fleet-stat-label-custom {
          color: rgba(226, 216, 255, 0.58);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .fleet-center-text-custom {
          max-width: 920px;
          margin: 34px auto 28px;
          text-align: center;
        }

        .fleet-center-text-custom h1 {
          margin: 0 0 24px;
          color: #ffffff;
          font-size: 30px;
          line-height: 1.45;
          font-weight: 900;
          letter-spacing: 0.06em;
        }

        .fleet-center-text-custom p {
          margin: 0 auto;
          max-width: 880px;
          color: rgba(226, 216, 255, 0.66);
          font-size: 17px;
          line-height: 1.55;
          letter-spacing: 0.04em;
        }

        .fleet-features-custom {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 28px;
        }

        .fleet-feature-card-custom {
          min-height: 150px;
          padding: 28px 24px;
          border: 1.5px solid rgba(168, 85, 247, 0.72);
          border-radius: 8px;
          background: rgba(11, 9, 32, 0.74);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          box-shadow:
            0 0 0 1px rgba(168, 85, 247, 0.06),
            0 18px 44px rgba(0, 0, 0, 0.18);
        }

        .fleet-feature-icon-custom {
          color: #a855f7;
          margin-bottom: 18px;
          filter: drop-shadow(0 0 12px rgba(168, 85, 247, 0.55));
        }

        .fleet-feature-card-custom h2 {
          margin: 0 0 10px;
          color: #ffffff;
          font-size: 17px;
          font-weight: 900;
          letter-spacing: 0.06em;
        }

        .fleet-feature-card-custom p {
          margin: 0;
          color: rgba(226, 216, 255, 0.62);
          font-size: 12px;
          letter-spacing: 0.04em;
        }

        @media (max-width: 900px) {
          .fleet-page-custom {
            padding: 28px 24px 56px;
          }

          .fleet-stats-custom {
            grid-template-columns: repeat(2, 1fr);
            padding: 28px 24px;
          }

          .fleet-features-custom {
            grid-template-columns: 1fr;
          }

          .fleet-center-text-custom h1 {
            font-size: 24px;
          }

          .fleet-center-text-custom p {
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
}