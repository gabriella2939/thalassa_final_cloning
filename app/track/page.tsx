"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function TrackShipment() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/track/${search}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#050408] flex flex-col items-center justify-center p-6 font-mono relative">
      <button
        onClick={() => router.push('/')}
        className="absolute top-8 left-8 text-gray-500 hover:text-white flex items-center gap-2 text-sm tracking-widest uppercase transition-colors z-50 font-bold"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        BACK
      </button>

      <div className="text-center max-w-3xl w-full z-10">
        <div className="text-[#6b21a8] text-[10px] tracking-[0.3em] font-bold mb-2">CARGO TRACKING</div>
        <div className="text-gray-800 text-[10px] tracking-[0.3em] mb-8">REAL-TIME VESSEL TRACKING</div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-widest mb-4 font-sans">TRACK YOUR SHIPMENT</h1>
        <p className="text-gray-400 text-sm mb-10 tracking-wide">Enter the receipt number or Vessel ID to monitor cargo location in real-time.</p>

        <form onSubmit={handleTrack} className="flex flex-col md:flex-row items-stretch bg-[#0c0914] border border-gray-800 rounded-xl overflow-hidden mb-6 shadow-[0_0_30px_rgba(147,51,234,0.1)] focus-within:border-purple-500/50 transition-colors">
          <input 
            type="text" 
            placeholder="Enter Receipt No, Sender, Receiver, or Item Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none px-6 py-5 text-gray-300 focus:outline-none placeholder-gray-600 font-mono text-sm"
            required
          />
          <div className="flex items-center justify-center px-4">
             <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <button type="submit" className="bg-gradient-to-r from-[#a855f7] to-[#d8b4fe] hover:from-[#c084fc] hover:to-[#e9d5ff] text-black font-bold tracking-widest px-8 py-5 transition-all text-sm whitespace-nowrap">
            TRACK SHIPMENT
          </button>
        </form>

        <div className="text-[11px] text-gray-500 flex items-center justify-center gap-3">
          Example: <span className="text-[#d8b4fe] font-bold tracking-wider">PLF-2026-0417-SG</span> <span className="text-[#d8b4fe] font-bold tracking-wider ml-2">MV-POLARIS-001</span>
        </div>

        <div className="w-full h-px bg-gray-800/60 my-12"></div>

        <div className="flex flex-wrap items-center justify-center gap-8 text-[11px] text-gray-400">
          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div> Live Tracking</div>
          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div> Real-Time ETA</div>
          <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div> Port Notifications</div>
        </div>
      </div>

    </div>
  );
}
