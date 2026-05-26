'use client';
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';
const createCustomIcon = (colorKey: string) => {
  const colorMap: Record<string, string> = {
    'emerald': '#10b981',
    'sky': '#0ea5e9',
    'cyan': '#06b6d4',
    'yellow': '#eab308',
    'red': '#ef4444'
  };
  const color = colorMap[colorKey] || '#8b5cf6';
  return L.divIcon({
    className: 'custom-map-marker',
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${color}, inset 0 0 4px rgba(0,0,0,0.5);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};
interface Vessel {
  id: number;
  name: string;
  status: string;
  location: string;
  colorKey: string;
  lat?: number;
  lng?: number;
}
const getCoordinates = (location: string): [number, number] => {
  const locMap: Record<string, [number, number]> = {
    'Singapore': [1.290270, 103.851959],
    'Port of Surabaya': [-7.1996, 112.7381],
    'Port Klang': [3.0014, 101.3965],
    'Bali Port': [-8.7455, 115.1706],
    'Kuala Lumpur Port': [3.1390, 101.6869],
    'Balikpapan': [-1.2379, 116.8529],
  };
  if (!locMap[location]) {
    const lat = -5 + (Math.random() * 4 - 2);
    const lng = 110 + (Math.random() * 10 - 5);
    return [lat, lng];
  }
  return locMap[location];
};
export default function MapComponent({ vessels }: { vessels: Vessel[] }) {
  const tileUrl = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-purple-500/20 shadow-[0_0_30px_rgba(147,51,234,0.15)] relative z-0">
      <MapContainer 
        center={[-2.5, 110]} 
        zoom={5} 
        style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
        zoomControl={true}
      >
        <TileLayer
          url={tileUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {vessels.map(vessel => {
          const pos = getCoordinates(vessel.location);
          return (
            <Marker 
              key={vessel.id} 
              position={pos}
              icon={createCustomIcon(vessel.colorKey)}
            >
              <Popup className="custom-popup">
                <div className="font-mono">
                  <strong>{vessel.name}</strong><br/>
                  Status: {vessel.status}<br/>
                  Location: {vessel.location}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <style jsx global>{`
        .leaflet-container {
          background: #0a0a0a !important;
          font-family: inherit;
        }
        .leaflet-control-zoom a {
          background-color: #121016 !important;
          color: #a855f7 !important;
          border-color: #374151 !important;
        }
        .leaflet-control-zoom a:hover {
          background-color: #1a152e !important;
        }
        .leaflet-popup-content-wrapper {
          background: #121016;
          color: #e5e7eb;
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 8px;
        }
        .leaflet-popup-tip {
          background: #121016;
          border-top: 1px solid rgba(139, 92, 246, 0.3);
          border-left: 1px solid rgba(139, 92, 246, 0.3);
        }
      `}</style>
    </div>
  );
}
