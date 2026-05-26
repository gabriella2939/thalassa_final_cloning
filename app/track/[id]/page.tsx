"use client";

import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('../../dashboard/components/MapComponent'), { 
  ssr: false, 
  loading: () => (
    <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#a855f7] border-t-transparent animate-spin"></div>
    </div>
  )
});

export default function TrackDetail({ params }: { params: { id: string } }) {
  const router = useRouter();

  const mockVessel = [{
    id: 999,
    name: 'MV Polaris',
    type: 'Container Ship',
    status: 'EN ROUTE',
    speed: '18.9',
    heading: '129°',
    weather: 'Clear',
    fuel: 78,
    location: 'Central Kalimantan',
    colorKey: 'emerald'
  }];

  return (
    <div className="min-h-screen bg-[#050408] font-mono text-gray-300 p-6 md:p-10">
      <button 
        onClick={() => router.push('/track')}
        className="bg-[#a855f7] hover:bg-[#9333ea] text-white px-6 py-2 rounded-lg font-bold tracking-wider mb-10 transition-colors"
      >
        Back
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white tracking-widest mb-1 font-sans uppercase">SHIPPING TRACKING DETAIL</h1>
        <p className="text-gray-500 text-xs tracking-wide">Shipment Tracking Detail Real-Time</p>
      </div>

      <div className="w-full h-[400px] border border-[#a855f7]/20 rounded-xl mb-10 bg-[#0a0812] relative overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.1)]">
        <MapComponent vessels={mockVessel} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-white font-bold tracking-widest text-[13px] mb-6 border-b border-gray-800 pb-4">SHIPPING INFORMATION</h2>
          
          <div className="space-y-5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 tracking-wider">SHIPPING</span>
              <span className="text-white font-bold">Jakarta to Surabaya</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 tracking-wider">RECEIPT NUMBER</span>
              <span className="text-white font-bold uppercase">{decodeURIComponent(params.id) || 'PLF-2026-0417-SG'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 tracking-wider">VESSEL</span>
              <span className="text-white font-bold">MV Polaris</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 tracking-wider">VESSEL ID</span>
              <span className="text-white font-bold">MV-POLARIS-001</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 tracking-wider">CARGO TYPE</span>
              <span className="text-white font-bold">Container Cargo</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 tracking-wider">ROUTE DISTANCE</span>
              <span className="text-white font-bold">887 NM</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-white font-bold tracking-widest text-[13px] mb-6 border-b border-gray-800 pb-4">SHIPMENT HISTORY</h2>
          
          <div className="relative border-l border-[#a855f7]/20 ml-2 space-y-8 pb-4">
            
            <div className="relative pl-6">
              <div className="absolute w-2.5 h-2.5 bg-[#a855f7] rounded-full -left-[5.5px] top-1 shadow-[0_0_10px_rgba(168,85,247,0.8)] border border-[#d8b4fe]"></div>
              <div className="text-white font-bold text-[13px] tracking-wide leading-tight mb-1">The package arrived at the Port of Tanjung Perak, Surabaya</div>
              <div className="text-gray-600 text-[10px] tracking-widest">18th Apr 14:00 WIB</div>
            </div>

            <div className="relative pl-6">
              <div className="absolute w-2.5 h-2.5 bg-[#050408] rounded-full -left-[5.5px] top-1 border border-[#a855f7]/50"></div>
              <div className="text-gray-300 font-bold text-[13px] tracking-wide leading-tight mb-1">The ship left Tanjung Priok Port</div>
              <div className="text-gray-600 text-[10px] tracking-widest">15th Apr 14:00 WIB</div>
            </div>

            <div className="relative pl-6">
              <div className="absolute w-2.5 h-2.5 bg-[#050408] rounded-full -left-[5.5px] top-1 border border-[#a855f7]/50"></div>
              <div className="text-gray-300 font-bold text-[13px] tracking-wide leading-tight mb-1">Cargo is loaded onto the MV Polaris</div>
              <div className="text-gray-600 text-[10px] tracking-widest">15th Apr 04:00 WIB</div>
            </div>

            <div className="relative pl-6">
              <div className="absolute w-2.5 h-2.5 bg-[#050408] rounded-full -left-[5.5px] top-1 border border-[#a855f7]/50"></div>
              <div className="text-gray-300 font-bold text-[13px] tracking-wide leading-tight mb-1">Order received & confirmed</div>
              <div className="text-gray-600 text-[10px] tracking-widest">14th Apr 14:00 WIB</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
