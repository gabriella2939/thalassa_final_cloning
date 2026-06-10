"use client";

import { FormEvent, useState } from "react";
import { Roboto_Mono } from "next/font/google";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function TrackShipmentPage() {
  const [keyword, setKeyword] = useState("");

  const handleBack = () => {
    window.location.href = "/";
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const searchValue = keyword.trim();

    if (!searchValue) {
      return;
    }

    window.location.href = `/track/${encodeURIComponent(searchValue)}`;
  };

  return (
    <main className={`track-page ${robotoMono.className}`}>
      <button type="button" className="track-back-button" onClick={handleBack}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M19 12H5M12 19L5 12L12 5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        BACK
      </button>

      <section className="track-container">
        <div className="track-label-row">
          <span className="track-line" />

          <div className="track-label-wrap">
            <p className="track-label">CARGO TRACKING</p>
            <p className="track-sub-label">REAL-TIME VESSEL TRACKING</p>
          </div>

          <span className="track-line" />
        </div>

        <h1 className="track-title">TRACK YOUR SHIPMENT</h1>

        <p className="track-desc">
          Enter the receipt number or Vessel ID to monitor the cargo position in
          real-time.
        </p>

        <form className="track-form" onSubmit={handleSubmit}>
          <div className="track-input-wrap">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter the receipt number / vessel ID"
              className="track-input"
            />

            <div className="track-search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 21L15.8 15.8M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <button type="submit" className="track-button">
            Track Shipment
          </button>
        </form>

        <div className="track-example">
          <span>Example:</span>
          <strong>PLF-2026-0417-SG</strong>
          <strong>MV-POLARIS-001</strong>
        </div>

        <div className="track-features">
          <div className="track-feature">
            <span />
            Live Tracking
          </div>

          <div className="track-feature">
            <span />
            Real-Time ETA
          </div>

          <div className="track-feature">
            <span />
            Port Notifications
          </div>
        </div>
      </section>

      <style jsx>{`
        .track-page {
          min-height: 100vh;
          width: 100%;
          padding: 72px 56px;
          color: #ffffff;
          background:
            radial-gradient(
              circle at 18% 18%,
              rgba(88, 28, 135, 0.38),
              transparent 34%
            ),
            radial-gradient(
              circle at 84% 24%,
              rgba(88, 28, 135, 0.22),
              transparent 36%
            ),
            linear-gradient(
              135deg,
              #1b0735 0%,
              #120323 46%,
              #080111 100%
            );
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          overflow-x: hidden;
          font-family: "Roboto Mono", monospace;
          position: relative;
        }

        .track-back-button {
          position: absolute;
          top: 34px;
          left: 38px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: none;
          background: transparent;
          color: rgba(226, 216, 255, 0.62);
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.12em;
          cursor: pointer;
          transition:
            color 0.2s ease,
            transform 0.2s ease;
        }

        .track-back-button:hover {
          color: #ffffff;
          transform: translateX(-3px);
        }

        .track-container {
          width: 100%;
          max-width: 1040px;
          text-align: center;
          font-family: inherit;
        }

        .track-label-row {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          margin-bottom: 48px;
        }

        .track-line {
          width: 330px;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(168, 85, 247, 0.9),
            rgba(168, 85, 247, 0.3)
          );
        }

        .track-line:last-child {
          background: linear-gradient(
            90deg,
            rgba(168, 85, 247, 0.3),
            rgba(168, 85, 247, 0.9),
            transparent
          );
        }

        .track-label-wrap {
          min-width: 190px;
        }

        .track-label {
          margin: 0 0 8px;
          color: #c084fc;
          font-family: inherit;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.2em;
        }

        .track-sub-label {
          margin: 0;
          color: rgba(226, 216, 255, 0.62);
          font-family: inherit;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.2em;
        }

        .track-title {
          margin: 0 0 18px;
          color: #ffffff;
          font-family: inherit;
          font-size: clamp(42px, 5vw, 62px);
          line-height: 1;
          font-weight: 700;
          letter-spacing: 0.09em;
        }

        .track-desc {
          margin: 0 auto 64px;
          max-width: 980px;
          color: rgba(226, 216, 255, 0.68);
          font-family: inherit;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.7;
          letter-spacing: 0.03em;
        }

        .track-form {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 292px;
          gap: 0;
          margin: 0 auto 28px;
          max-width: 960px;
          font-family: inherit;
        }

        .track-input-wrap {
          position: relative;
          width: 100%;
          font-family: inherit;
        }

        .track-input {
          width: 100%;
          height: 74px;
          padding: 0 66px 0 24px;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);
          border: 1.5px solid rgba(168, 85, 247, 0.62);
          border-right: none;
          border-radius: 8px 0 0 8px;
          outline: none;
          font-family: inherit;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 0.03em;
          box-sizing: border-box;
        }

        .track-input::placeholder {
          color: rgba(226, 216, 255, 0.55);
          font-family: inherit;
          font-weight: 700;
        }

        .track-search-icon {
          position: absolute;
          top: 50%;
          right: 22px;
          transform: translateY(-50%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .track-button {
          height: 74px;
          border: none;
          border-radius: 0 8px 8px 0;
          background: linear-gradient(135deg, #a855f7 0%, #8b00ff 100%);
          color: #ffffff;
          font-family: inherit;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 0.03em;
          cursor: pointer;
          box-shadow: 0 0 28px rgba(168, 85, 247, 0.38);
          transition:
            box-shadow 0.2s ease,
            filter 0.2s ease;
        }

        .track-button:hover {
          filter: brightness(1.08);
          box-shadow: 0 0 38px rgba(168, 85, 247, 0.55);
        }

        .track-example {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 64px;
          color: rgba(226, 216, 255, 0.62);
          font-family: inherit;
          font-size: 15px;
          font-weight: 400;
          letter-spacing: 0.03em;
        }

        .track-example strong {
          color: #d8b4fe;
          font-family: inherit;
          font-weight: 700;
        }

        .track-features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          max-width: 940px;
          margin: 0 auto;
          font-family: inherit;
        }

        .track-feature {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: rgba(226, 216, 255, 0.66);
          font-family: inherit;
          font-size: 16px;
          font-weight: 400;
          letter-spacing: 0.03em;
        }

        .track-feature span {
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: #a3a9b8;
          display: inline-block;
        }

        @media (max-width: 900px) {
          .track-page {
            padding: 72px 24px 56px;
          }

          .track-back-button {
            top: 26px;
            left: 24px;
            font-size: 13px;
          }

          .track-label-row {
            gap: 12px;
            margin-bottom: 38px;
          }

          .track-line {
            width: 80px;
          }

          .track-title {
            font-size: 38px;
          }

          .track-desc {
            margin-bottom: 38px;
            font-size: 14px;
          }

          .track-form {
            grid-template-columns: 1fr;
          }

          .track-input {
            height: 64px;
            border-right: 1.5px solid rgba(168, 85, 247, 0.62);
            border-radius: 8px 8px 0 0;
            font-size: 15px;
          }

          .track-button {
            height: 64px;
            border-radius: 0 0 8px 8px;
            font-size: 18px;
          }

          .track-features {
            grid-template-columns: 1fr;
            gap: 18px;
          }
        }
      `}</style>
    </main>
  );
}