"use client";

import Navbar from '../components/Navbar';
import '../css/home.css';

export default function Fleet() {
  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-title-wrap">
          <div className="page-title">VESSEL OVERVIEW</div>
        </div>
        
        <div className="fleet-stats">
          <div className="stat-box">
            <div className="stat-value">50+</div>
            <div className="stat-label">ACTIVE FLEETS</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">200+</div>
            <div className="stat-label">COMPLETED VOYAGES</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">15</div>
            <div className="stat-label">DESTINATION PORTS</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">24/7</div>
            <div className="stat-label">LIVE MONITORING</div>
          </div>
        </div>

        <div className="fleet-center-text">
          <div className="fleet-center-title">CONNECTING THE ARCHIPELAGO WITH GLOBAL MARITIME STANDARDS</div>
          <div className="fleet-center-desc">Thalassa Sisterhood Group is committed to being the most trusted and innovative maritime logistics partner in Southeast Asia, connecting strategic ports with secure, timely, and transparent shipping services.</div>
        </div>

        <div className="fleet-features">
          <div className="fleet-feature-card">
            <div className="ff-icon">🛡️</div>
            <div className="ff-title">SAFETY</div>
            <div className="ff-desc">IMO &amp; SOLAS STANDARDS</div>
          </div>
          <div className="fleet-feature-card">
            <div className="ff-icon">📈</div>
            <div className="ff-title">EFFICIENCY</div>
            <div className="ff-desc">REAL-TIME ROUTE OPTIMIZATION</div>
          </div>
          <div className="fleet-feature-card">
            <div className="ff-icon">👥</div>
            <div className="ff-title">PROFESSIONAL</div>
            <div className="ff-desc">INTERNATIONALLY CERTIFIED CREW</div>
          </div>
        </div>
      </div>
    </>
  );
}
