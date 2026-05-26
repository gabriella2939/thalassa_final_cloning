"use client";

import Navbar from '../components/Navbar';
import '../css/home.css';

export default function Contact() {
  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="contact-layout">
          <div>
            <div className="contact-title">CONTACT US</div>
            <div className="contact-subtitle">GET IN TOUCH</div>
            
            <div className="contact-list">
              <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <div>
                  <div className="contact-info-label">EMAIL</div>
                  <div className="contact-info-value">support@thalassa.com</div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📱</div>
                <div>
                  <div className="contact-info-label">WHATSAPP (OFFICIAL)</div>
                  <div className="contact-info-value">+62 812-3456-789</div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <div className="contact-info-label">HEADQUARTERS ADDRESS</div>
                  <div className="contact-info-value">Jl. Maritim No. 88, Pelabuhan Tanjung Priok<br/>Jakarta Utara, 14310 - Indonesia</div>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">🕒</div>
                <div>
                  <div className="contact-info-label">OPERATION HOURS</div>
                  <div className="contact-info-value">24/7 Maritime Support</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <img src="/gambar-cp-3.png" alt="Control Room" className="contact-image" />
          </div>
        </div>
      </div>
    </>
  );
}
