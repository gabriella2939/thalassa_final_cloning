"use client";

import Navbar from '../components/Navbar';
import '../css/home.css';

export default function Services() {
  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-title-wrap">
          <div className="page-title">SERVICES</div>
          <div className="page-subtitle">SERVICES OVERVIEW</div>
        </div>
        
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">🚢</div>
            <div className="service-title">CONTAINER SHIPPING</div>
            <div className="service-desc">Inter-island and international container shipping with modern high-capacity fleets.</div>
          </div>
          <div className="service-card">
            <div className="service-icon">⚓</div>
            <div className="service-title">TANKER OPERATIONS</div>
            <div className="service-desc">Transportation of fuel and liquid cargo with international safety standards.</div>
          </div>
          <div className="service-card">
            <div className="service-icon">📦</div>
            <div className="service-title">BULK CARGO</div>
            <div className="service-desc">Handling of bulk cargo such as coal, grains, and minerals with optimal efficiency.</div>
          </div>
          <div className="service-card">
            <div className="service-icon">📡</div>
            <div className="service-title">LIVE FLEET MONITORING</div>
            <div className="service-desc">24/7 real-time fleet monitoring system based on AIS and satellite technology.</div>
          </div>
        </div>
      </div>
    </>
  );
}
