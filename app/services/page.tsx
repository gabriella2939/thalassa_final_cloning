"use client";

import Navbar from "../components/Navbar";
import "../css/home.css";

const services = [
  {
    icon: "🚢",
    title: "CONTAINER SHIPPING",
    desc: "Inter-island and international container shipping with modern high-capacity fleets.",
  },
  {
    icon: "⚓",
    title: "TANKER OPERATION",
    desc: "Transportation of fuel and liquid cargo with international safety standards.",
  },
  {
    icon: "▣",
    title: "BULK CARGO",
    desc: "Handling of bulk cargo such as coal, grains, and minerals with optimal efficiency.",
  },
  {
    icon: "⌁",
    title: "LIVE FLEET MONITORING",
    desc: "24/7 real-time fleet monitoring system based on AIS and satellite technology.",
  },
];

export default function Services() {
  return (
    <>
      <Navbar />

      <main className="services-page-clean">
        <section className="services-content-clean">
          <div className="services-grid-clean">
            {services.map((service) => (
              <div className="service-card-clean" key={service.title}>
                <div className="service-card-glow-clean" />

                <div className="service-card-inner-clean">
                  <div className="service-icon-clean">{service.icon}</div>

                  <div className="service-text-clean">
                    <h2>{service.title}</h2>
                    <p>{service.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <style jsx>{`
        .services-page-clean {
          min-height: calc(100vh - 71px);
          width: 100%;
          padding: 54px 56px 70px;
          background:
            radial-gradient(
              circle at 16% 18%,
              rgba(88, 28, 135, 0.35),
              transparent 32%
            ),
            linear-gradient(
              135deg,
              #1b0735 0%,
              #120323 45%,
              #0a0113 100%
            );
          color: #ffffff;
          overflow-x: hidden;
        }

        .services-content-clean {
          width: 100%;
          max-width: 1320px;
          margin: 0 auto;
        }

        .services-grid-clean {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 44px 38px;
          margin: 0 auto;
        }

        .service-card-clean {
          position: relative;
          min-height: 240px;
          border-radius: 10px;
          background:
            linear-gradient(
              135deg,
              rgba(16, 10, 42, 0.94),
              rgba(9, 5, 26, 0.94)
            );
          border: 1.5px solid rgba(168, 85, 247, 0.8);
          box-shadow:
            0 0 0 1px rgba(168, 85, 247, 0.08),
            0 18px 45px rgba(0, 0, 0, 0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          cursor: pointer;
          transition:
            transform 0.28s ease,
            border-color 0.28s ease,
            box-shadow 0.28s ease,
            background 0.28s ease;
        }

        .service-card-clean::before {
          content: "";
          position: absolute;
          top: 0;
          left: -120%;
          width: 70%;
          height: 100%;
          background: linear-gradient(
            120deg,
            transparent,
            rgba(255, 255, 255, 0.08),
            transparent
          );
          transform: skewX(-18deg);
          transition: left 0.65s ease;
          pointer-events: none;
        }

        .service-card-clean::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background:
            radial-gradient(
              circle at 20% 20%,
              rgba(168, 85, 247, 0.16),
              transparent 32%
            ),
            radial-gradient(
              circle at 80% 80%,
              rgba(192, 132, 252, 0.1),
              transparent 35%
            );
          opacity: 0;
          transition: opacity 0.28s ease;
          pointer-events: none;
        }

        .service-card-clean:hover {
          transform: translateY(-10px) scale(1.015);
          border-color: rgba(216, 180, 254, 1);
          box-shadow:
            0 0 0 1px rgba(216, 180, 254, 0.2),
            0 0 28px rgba(168, 85, 247, 0.38),
            0 26px 70px rgba(0, 0, 0, 0.38);
          background:
            linear-gradient(
              135deg,
              rgba(24, 12, 58, 0.98),
              rgba(11, 5, 32, 0.98)
            );
        }

        .service-card-clean:hover::before {
          left: 130%;
        }

        .service-card-clean:hover::after {
          opacity: 1;
        }

        .service-card-glow-clean {
          position: absolute;
          inset: auto auto -70px -70px;
          width: 170px;
          height: 170px;
          border-radius: 999px;
          background: rgba(168, 85, 247, 0.22);
          filter: blur(36px);
          opacity: 0;
          transition:
            opacity 0.3s ease,
            transform 0.3s ease;
          pointer-events: none;
        }

        .service-card-clean:hover .service-card-glow-clean {
          opacity: 1;
          transform: scale(1.25);
        }

        .service-card-inner-clean {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          padding: 38px 46px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
        }

        .service-icon-clean {
          width: 56px;
          height: 56px;
          margin-bottom: 26px;
          border-radius: 11px;
          background: rgba(88, 28, 135, 0.82);
          border: 1px solid rgba(168, 85, 247, 0.65);
          color: #b45cff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 25px;
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.18);
          transition:
            transform 0.28s ease,
            box-shadow 0.28s ease,
            background 0.28s ease,
            border-color 0.28s ease;
        }

        .service-card-clean:hover .service-icon-clean {
          transform: translateY(-4px) scale(1.12) rotate(-3deg);
          background: rgba(126, 34, 206, 0.92);
          border-color: rgba(216, 180, 254, 0.95);
          box-shadow:
            0 0 18px rgba(168, 85, 247, 0.55),
            0 0 34px rgba(168, 85, 247, 0.28);
        }

        .service-text-clean {
          max-width: 520px;
        }

        .service-text-clean h2 {
          margin: 0 0 18px;
          font-size: 16px;
          line-height: 1.3;
          font-weight: 800;
          letter-spacing: 0.07em;
          color: #ffffff;
          transition:
            color 0.28s ease,
            text-shadow 0.28s ease,
            transform 0.28s ease;
        }

        .service-card-clean:hover .service-text-clean h2 {
          color: #f3e8ff;
          text-shadow: 0 0 16px rgba(216, 180, 254, 0.42);
          transform: translateX(4px);
        }

        .service-text-clean p {
          margin: 0;
          font-size: 14px;
          line-height: 1.85;
          letter-spacing: 0.03em;
          color: rgba(226, 216, 255, 0.62);
          transition:
            color 0.28s ease,
            transform 0.28s ease;
        }

        .service-card-clean:hover .service-text-clean p {
          color: rgba(255, 255, 255, 0.78);
          transform: translateX(4px);
        }

        @media (max-width: 900px) {
          .services-page-clean {
            padding: 34px 24px 56px;
          }

          .services-grid-clean {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .service-card-clean {
            min-height: 210px;
          }

          .service-card-inner-clean {
            padding: 32px;
          }
        }
      `}</style>
    </>
  );
}