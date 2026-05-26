"use client";

import { useRouter } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';
import '../../../css/fleet-detail.css'; // Adjust path if needed depending on where this file is placed

const data = [
  { time: '05:56:30', speed: 2, fuel: 1.8 },
  { time: '05:56:33', speed: 2, fuel: 1.8 },
  { time: '05:56:36', speed: 2, fuel: 1.8 },
];

export default function FleetDetail() {
  const router = useRouter();
  
  return (
    <div className="fleet-detail-page">
      <header className="fd-header">
        <div className="fd-header-left">
          <button onClick={() => router.back()} className="fd-back-btn border-none bg-transparent cursor-pointer font-inherit flex items-center justify-center pb-1">
            &larr;
          </button>
          <div className="fd-title-group">
            <div className="fd-title-row">
              <h1 className="fd-vessel-name">MV Pacific Star</h1>
              <div className="fd-badge-enroute">
                <span>≈</span> EN ROUTE
              </div>
            </div>
            <div className="fd-vessel-sub">Container Ship • ID: V001</div>
          </div>
        </div>
        <div className="fd-live-badge">
          <div className="fd-live-dot"></div>
          LIVE
        </div>
      </header>

      <div className="fd-grid">
        <div>
          <div className="fd-card">
            <div className="fd-card-header">
              <span className="fd-card-icon">((•))</span>
              <span className="fd-card-title">GPS COORDINATES</span>
            </div>
            <div className="fd-coord-label">LATITUDE</div>
            <div className="fd-coord-val">
              6.21149° <span className="fd-coord-dir">S</span>
            </div>
            <div className="fd-coord-label">LONGITUDE</div>
            <div className="fd-coord-val" style={{ marginBottom: 10 }}>
              106.84396° <span className="fd-coord-dir">E</span>
            </div>
            <div className="fd-updated">Updated: 05:56:36 UTC</div>
          </div>

          <div className="fd-small-grid">
            <div className="fd-mini-card">
              <div className="fd-card-header" style={{ marginBottom: 0 }}>
                <span className="fd-card-title">SPEED</span>
              </div>
              <div className="fd-mini-val">18.9 kn</div>
            </div>
            <div className="fd-mini-card">
              <div className="fd-card-header" style={{ marginBottom: 0 }}>
                <span className="fd-card-title">HEADING</span>
              </div>
              <div className="fd-mini-val">129°</div>
            </div>
            <div className="fd-mini-card">
              <div className="fd-card-header" style={{ marginBottom: 0 }}>
                <span className="fd-card-title">CREW</span>
              </div>
              <div className="fd-mini-val">25</div>
            </div>
            <div className="fd-mini-card">
              <div className="fd-card-header" style={{ marginBottom: 0 }}>
                <span className="fd-card-title">WEATHER</span>
              </div>
              <div className="fd-mini-val">CLEAR</div>
            </div>
          </div>

          <div className="fd-card">
            <div className="fd-card-header" style={{ marginBottom: 5 }}>
              <span className="fd-card-title">CAPTAIN</span>
            </div>
            <div className="fd-single-val">Capt. James Anderson</div>
          </div>

          <div className="fd-card">
            <div className="fd-card-header" style={{ marginBottom: 15 }}>
              <span className="fd-card-title">ROUTE INFO</span>
            </div>
            <div className="fd-coord-label">DESTINATION</div>
            <div className="fd-route-val">Singapore</div>
            <div className="fd-coord-label">ETA</div>
            <div className="fd-route-val" style={{ marginBottom: 0 }}>05 Apr 2026, 14:30</div>
          </div>
        </div>

        <div>
          <div className="fd-chart-card">
            <div className="fd-chart-header">
              <div className="fd-chart-title">
                <span className="fd-card-icon">〽</span> Speed &amp; Fuel Monitor
              </div>
              <div className="fd-chart-legend">
                <div className="fd-legend-item">
                  <div className="fd-legend-color" style={{ background: '#10b981' }}></div> Speed
                </div>
                <div className="fd-legend-item">
                  <div className="fd-legend-color" style={{ background: '#eab308' }}></div> Fuel %
                </div>
              </div>
            </div>
            <div className="fd-chart-area">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={true} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={true} domain={[0, 8]} ticks={[0,2,4,6,8]} />
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <Line type="monotone" dataKey="speed" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="fuel" stroke="#eab308" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="fd-status-grid">
            <div className="fd-mini-card">
              <div className="fd-card-title">ENGINE</div>
              <div className="fd-status-badge">
                <div className="fd-live-dot"></div> OPTIMAL
              </div>
            </div>
            <div className="fd-mini-card">
              <div className="fd-card-title">NAVIGATION</div>
              <div className="fd-status-badge">
                <div className="fd-live-dot"></div> OPERATIONAL
              </div>
            </div>
            <div className="fd-mini-card">
              <div className="fd-card-title">ALERTS</div>
              <div className="fd-status-badge">
                <div className="fd-live-dot"></div> ALL CLEAR
              </div>
            </div>
          </div>

          <div className="fd-bottom-grid">
            <div className="fd-card">
              <div className="fd-card-title">CARGO</div>
              <div className="fd-single-val">Electronics &amp; Machinery</div>
            </div>
            <div className="fd-card">
              <div className="fd-card-title">FUEL LEVEL</div>
              <div className="fd-fuel-header">
                <div style={{ width: 10 }}></div> 
                <div className="fd-fuel-pct">78%</div>
              </div>
              <div className="fd-progress-bar">
                <div className="fd-progress-fill" style={{ width: '78%' }}></div>
              </div>
              <div className="fd-fuel-status">Sufficient</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
