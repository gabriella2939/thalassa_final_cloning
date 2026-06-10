"use client";

import Navbar from "../components/Navbar";
import "../css/home.css";

export default function Contact() {
  return (
    <>
      <Navbar />

      <main className="contact-page-custom">
        <section className="contact-content-custom">
          <div className="contact-info-side-custom">
            <h1>CONTACT US</h1>
            <h2>GET IN TOUCH</h2>

            <div className="contact-list-custom">
              <div className="contact-item-custom">
                <div className="contact-icon-custom">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 6H20V18H4V6Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 7L12 13L20 7"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div>
                  <p className="contact-label-custom">EMAIL</p>
                  <p className="contact-value-custom">support@thalassa.com</p>
                </div>
              </div>

              <div className="contact-item-custom">
                <div className="contact-icon-custom">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 4H17V20H7V4Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 17H14"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div>
                  <p className="contact-label-custom">WHATSAPP OFFICIAL</p>
                  <p className="contact-value-custom">+62 812-3456-789</p>
                </div>
              </div>

              <div className="contact-item-custom">
                <div className="contact-icon-custom">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 21S19 14.8 19 8.8C19 5.5 15.9 3 12 3C8.1 3 5 5.5 5 8.8C5 14.8 12 21 12 21Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="9"
                      r="2.4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                  </svg>
                </div>

                <div>
                  <p className="contact-label-custom">HEADQUARTERS ADDRESS</p>
                  <p className="contact-value-custom">
                    Jl. Maritim No. 88, Pelabuhan Tanjung Priok
                    <br />
                    Jakarta Utara, 14310 - Indonesia
                  </p>
                </div>
              </div>

              <div className="contact-item-custom">
                <div className="contact-icon-custom">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="8"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M12 7V12L15.2 15"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div>
                  <p className="contact-label-custom">OPERATION HOURS</p>
                  <p className="contact-value-custom">24/7 Maritime Support</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-image-side-custom">
            <div className="contact-image-frame-custom">
              <img src="/contact-fleet.png" alt="Thalassa Maritime Fleet" />
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .contact-page-custom {
          min-height: calc(100vh - 71px);
          width: 100%;
          padding: 62px 56px 72px;
          color: #ffffff;
          background:
            radial-gradient(
              circle at 16% 18%,
              rgba(88, 28, 135, 0.36),
              transparent 34%
            ),
            radial-gradient(
              circle at 85% 26%,
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
          box-sizing: border-box;
        }

        .contact-content-custom {
          width: 100%;
          max-width: 1120px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }

        .contact-info-side-custom h1 {
          margin: 0 0 10px;
          color: #ffffff;
          font-size: 44px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: 0.06em;
        }

        .contact-info-side-custom h2 {
          margin: 0 0 48px;
          color: #ffffff;
          font-size: 26px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: 0.04em;
        }

        .contact-list-custom {
          display: flex;
          flex-direction: column;
          gap: 34px;
        }

        .contact-item-custom {
          display: grid;
          grid-template-columns: 34px 1fr;
          gap: 18px;
          align-items: flex-start;
        }

        .contact-icon-custom {
          color: #a855f7;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 0 10px rgba(168, 85, 247, 0.5));
        }

        .contact-label-custom {
          margin: 0 0 10px;
          color: rgba(226, 216, 255, 0.46);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
        }

        .contact-value-custom {
          margin: 0;
          color: #ffffff;
          font-size: 15px;
          line-height: 1.7;
          letter-spacing: 0.05em;
        }

        .contact-image-side-custom {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .contact-image-frame-custom {
          width: 100%;
          max-width: 520px;
          height: 360px;
          border-radius: 16px;
          overflow: hidden;
          border: 1.5px solid rgba(168, 85, 247, 0.42);
          box-shadow:
            0 0 0 1px rgba(168, 85, 247, 0.08),
            0 24px 60px rgba(0, 0, 0, 0.32);
          background: rgba(11, 9, 32, 0.72);
        }

        .contact-image-frame-custom img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        @media (max-width: 900px) {
          .contact-page-custom {
            padding: 42px 24px 58px;
          }

          .contact-content-custom {
            grid-template-columns: 1fr;
            gap: 42px;
          }

          .contact-info-side-custom h1 {
            font-size: 34px;
          }

          .contact-info-side-custom h2 {
            font-size: 22px;
            margin-bottom: 36px;
          }

          .contact-image-frame-custom {
            height: 300px;
          }
        }
      `}</style>
    </>
  );
}