'use client';
import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import MapSkeleton from './components/MapSkeleton';
import AnalyticsSkeleton from './components/AnalyticsSkeleton';
import UsersSkeleton from './components/UsersSkeleton';
import { useRouter } from 'next/navigation';
import { createClient } from '../../utils/supabase/client';


const MapComponent = dynamic(() => import('./components/MapComponent'), { ssr: false });
const AnalyticsComponent = dynamic(() => import('./components/AnalyticsComponent'), { ssr: false });
const UserManagementComponent = dynamic(() => import('./components/UserManagementComponent'), { ssr: false });
const CargoManagementComponent = dynamic(() => import('./components/CargoManagementComponent'), { ssr: false });
const VesselManagement = dynamic(() => import('./components/VesselManagement'), { ssr: false });

const initialVessels = [
  {
    id: 1,
    name: 'MV Pacific Star',
    type: 'Container Ship',
    status: 'EN ROUTE',
    speed: '16.6',
    heading: '141°',
    weather: 'Sunny',
    fuel: 77,
    location: 'Singapore',
    colorKey: 'emerald'
  },
  {
    id: 2,
    name: 'MV Ocean Voyager',
    type: 'Bulk Carrier',
    status: 'IN PORT',
    speed: '0.0',
    heading: '0°',
    weather: 'Sunny',
    fuel: 56,
    location: 'Port of Surabaya',
    colorKey: 'sky'
  },
  {
    id: 3,
    name: 'MV Maritime Express',
    type: 'Tanker',
    status: 'DELAYED',
    speed: '2.0',
    heading: '267°',
    weather: 'Sunny',
    fuel: 62,
    location: 'Port Klang',
    colorKey: 'yellow'
  },
  {
    id: 4,
    name: 'MV Cargo Master',
    type: 'Container Ship',
    status: 'MAINTENANCE',
    speed: '0.0',
    heading: '0°',
    weather: 'Windy',
    fuel: 30,
    location: 'Bali Port',
    colorKey: 'red'
  }
];

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'FLEET' | 'MAP' | 'ANALYTICS' | 'USERS' | 'VESSEL' | 'CARGO'>('FLEET');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCard, setActiveCard] = useState<number>(1);
  const [fleetData, setFleetData] = useState(initialVessels);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router, supabase]);

  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [newVessel, setNewVessel] = useState({
    name: '',
    type: '',
    code: '', // tambahan ugd blm disambung ke db
    capacity: '', // tambahan ugd blm disambung ke db
    status: 'EN ROUTE',
    destination: ''
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('thalassaFleetData');
      if (saved) {
        setFleetData(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading local storage', error);
    }
    const statuses = ['EN ROUTE', 'IN PORT', 'DELAYED', 'MAINTENANCE'];
    const colorMap: Record<string, string> = {
      'EN ROUTE': 'emerald',
      'IN PORT': 'sky',
      'DELAYED': 'yellow',
      'MAINTENANCE': 'red'
    };
    const interval = setInterval(() => {
      setFleetData(prev => {
        const newData = [...prev];
        const randomIndex = Math.floor(Math.random() * newData.length);
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
        newData[randomIndex] = {
          ...newData[randomIndex],
          status: newStatus,
          colorKey: colorMap[newStatus],
          speed: newStatus === 'EN ROUTE' ? (Math.random() * 5 + 14).toFixed(1) :
                 newStatus === 'DELAYED' ? (Math.random() * 2 + 1).toFixed(1) : '0.0'
        };
        return newData;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAddVessel = () => {
    if (!newVessel.name) return;
    const colorMap: Record<string, string> = { 'EN ROUTE': 'emerald', 'IN PORT': 'sky', 'DELAYED': 'yellow', 'MAINTENANCE': 'red' };
    setFleetData(prev => {
      const updated = [
        ...prev,
        {
          id: Date.now(),
          name: newVessel.name,
          type: newVessel.type || 'Unknown Type',
          status: newVessel.status,
          speed: newVessel.status === 'EN ROUTE' ? '15.0' : '0.0',
          heading: '90°',
          weather: 'Sunny',
          fuel: 100,
          location: newVessel.destination || 'Unknown Port',
          colorKey: colorMap[newVessel.status] || 'emerald'
        }
      ];
      try { localStorage.setItem('thalassaFleetData', JSON.stringify(updated)); } catch(e) {}
      return updated;
    });
    setShowAddModal(false);
    setNewVessel({ name: '', type: '', code: '', capacity: '', status: 'EN ROUTE', destination: '' });
  };

  const stats = {
    total: fleetData.length,
    enRoute: fleetData.filter(v => v.status === 'EN ROUTE').length,
    inPort: fleetData.filter(v => v.status === 'IN PORT').length,
    delayed: fleetData.filter(v => v.status === 'DELAYED').length,
    maintenance: fleetData.filter(v => v.status === 'MAINTENANCE').length
  };

  const getStatusColors = (key: string) => {
    switch (key) {
      case 'emerald': return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-400', fill: 'bg-emerald-500', topBorder: 'border-t-emerald-500/80', glow: 'rgba(16,185,129,0.1)' };
      case 'sky': return { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20', dot: 'bg-sky-400', fill: 'bg-sky-500', topBorder: 'border-t-sky-500/80', glow: 'rgba(14,165,233,0.1)' };
      case 'yellow': return { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/20', dot: 'bg-yellow-500', fill: 'bg-yellow-500', topBorder: 'border-t-yellow-500/80', glow: 'rgba(234,179,8,0.1)' };
      case 'red': return { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20', dot: 'bg-red-500', fill: 'bg-red-500', topBorder: 'border-t-red-500/80', glow: 'rgba(239,68,68,0.1)' };
      default: return { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20', dot: 'bg-gray-400', fill: 'bg-gray-500', topBorder: 'border-t-gray-500/80', glow: 'transparent' };
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#07050a] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07050a] text-gray-300 font-sans tracking-wide">
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-gray-800/60 bg-[#0a0812]">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-full p-0.5 border border-purple-500/30 overflow-hidden shadow-[0_0_15px_rgba(139,92,246,0.3)] bg-[#0a0812] flex items-center justify-center">
            <img src="/logo-thalassa.png" alt="Thalassa Logo" className="w-full h-full object-cover rounded-full" />
          </div>
          <div>
            <h1 className="text-white font-bold tracking-[0.15em] text-[15px] leading-tight font-mono">THALASSA SISTERHOOD GROUP</h1>
            <p className="text-[10px] text-gray-400 font-mono tracking-[0.2em] mt-1">ADMIN PORTAL</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-mono tracking-widest uppercase font-bold h-full"></nav>
          {/* FLEET */}
          <div className="relative group h-full flex items-center">
            <button onClick={() => setActiveTab('FLEET')} className={`flex items-center gap-2 py-6 transition-colors ${activeTab === 'FLEET' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>
              FLEET
              <svg className="w-3.5 h-3.5 ml-0.5 opacity-50 group-hover:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className="absolute top-full left-0 w-80 bg-[#0c0914] border border-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden transform translate-y-2 group-hover:translate-y-0">
              <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-3 text-white text-[12px] tracking-widest font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-purple-400"><circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>
                FLEET
              </div>
              <div className="p-3 space-y-1">
                <div onClick={() => { setActiveTab('FLEET'); setFilterStatus(null); }} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group/item">
                  <div className="w-10 h-10 rounded-xl bg-[#1a1528] flex items-center justify-center shrink-0 border border-purple-500/20 group-hover/item:border-purple-500/50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/></svg>
                  </div>
                  <div>
                    <div className="text-white text-[13px] font-bold font-mono tracking-wide capitalize mb-1">Total Fleet</div>
                    <div className="text-gray-500 text-[11px] font-sans tracking-normal leading-relaxed normal-case">Show all active vessels in monitoring grid.</div>
                  </div>
                </div>
                <div onClick={() => { setActiveTab('FLEET'); setFilterStatus('EN ROUTE'); }} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group/item">
                  <div className="w-10 h-10 rounded-xl bg-[#1a1528] flex items-center justify-center shrink-0 border border-purple-500/20 group-hover/item:border-purple-500/50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                  </div>
                  <div>
                    <div className="text-white text-[13px] font-bold font-mono tracking-wide capitalize mb-1">En Route</div>
                    <div className="text-gray-500 text-[11px] font-sans tracking-normal leading-relaxed normal-case">Focus on vessels currently sailing.</div>
                  </div>
                </div>
                <div onClick={() => { setActiveTab('FLEET'); setFilterStatus('IN PORT'); }} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group/item">
                  <div className="w-10 h-10 rounded-xl bg-[#1a1528] flex items-center justify-center shrink-0 border border-purple-500/20 group-hover/item:border-purple-500/50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  </div>
                  <div>
                    <div className="text-white text-[13px] font-bold font-mono tracking-wide capitalize mb-1">In Port</div>
                    <div className="text-gray-500 text-[11px] font-sans tracking-normal leading-relaxed normal-case">Check ships docked at current harbor.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MAP */}
          <div className="relative group h-full flex items-center">
            <button onClick={() => setActiveTab('MAP')} className={`flex items-center gap-2 py-6 transition-colors ${activeTab === 'MAP' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>
              MAP
              <svg className="w-3.5 h-3.5 ml-0.5 opacity-50 group-hover:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className="absolute top-full left-0 w-80 bg-[#0c0914] border border-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden transform translate-y-2 group-hover:translate-y-0">
              <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-3 text-white text-[12px] tracking-widest font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-purple-400"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>
                MAP
              </div>
              <div className="p-3 space-y-1">
                <div onClick={() => setActiveTab('MAP')} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group/item">
                  <div className="w-10 h-10 rounded-xl bg-[#1a1528] flex items-center justify-center shrink-0 border border-purple-500/20 group-hover/item:border-purple-500/50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/></svg>
                  </div>
                  <div>
                    <div className="text-white text-[13px] font-bold font-mono tracking-wide capitalize mb-1">Live Coordinates</div>
                    <div className="text-gray-500 text-[11px] font-sans tracking-normal leading-relaxed normal-case">See real-time vessel location and heading.</div>
                  </div>
                </div>
                <div onClick={() => setActiveTab('MAP')} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group/item">
                  <div className="w-10 h-10 rounded-xl bg-[#1a1528] flex items-center justify-center shrink-0 border border-purple-500/20 group-hover/item:border-purple-500/50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M4 12h16M4 8h16M4 16h16" strokeDasharray="4 4" /></svg>
                  </div>
                  <div>
                    <div className="text-white text-[13px] font-bold font-mono tracking-wide capitalize mb-1">Route Paths</div>
                    <div className="text-gray-500 text-[11px] font-sans tracking-normal leading-relaxed normal-case">Review route lines and movement history.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ANALYTICS */}
          <div className="relative group h-full flex items-center">
            <button onClick={() => setActiveTab('ANALYTICS')} className={`flex items-center gap-2 py-6 transition-colors ${activeTab === 'ANALYTICS' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              ANALYTICS
              <svg className="w-3.5 h-3.5 ml-0.5 opacity-50 group-hover:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className="absolute top-full left-0 w-80 bg-[#0c0914] border border-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden transform translate-y-2 group-hover:translate-y-0">
              <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-3 text-white text-[12px] tracking-widest font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-purple-400"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                ANALYTICS
              </div>
              <div className="p-3 space-y-1">
                <div onClick={() => setActiveTab('ANALYTICS')} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group/item">
                  <div className="w-10 h-10 rounded-xl bg-[#1a1528] flex items-center justify-center shrink-0 border border-purple-500/20 group-hover/item:border-purple-500/50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><polygon points="12 2 22 22 2 22 12 2"/></svg>
                  </div>
                  <div>
                    <div className="text-white text-[13px] font-bold font-mono tracking-wide capitalize mb-1">Performance</div>
                    <div className="text-gray-500 text-[11px] font-sans tracking-normal leading-relaxed normal-case">Inspect speed, heading, and fuel efficiency.</div>
                  </div>
                </div>
                <div onClick={() => setActiveTab('ANALYTICS')} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group/item">
                  <div className="w-10 h-10 rounded-xl bg-[#1a1528] flex items-center justify-center shrink-0 border border-purple-500/20 group-hover/item:border-purple-500/50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="16" y2="18"/></svg>
                  </div>
                  <div>
                    <div className="text-white text-[13px] font-bold font-mono tracking-wide capitalize mb-1">Status Summary</div>
                    <div className="text-gray-500 text-[11px] font-sans tracking-normal leading-relaxed normal-case">Compare fleet condition and alerts.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DROPDOWN MANAGEMENT (User, Vessel, & Cargo) */}
          <div className="relative group h-full flex items-center">
            <button className={`flex items-center gap-2 py-6 transition-colors ${['USERS', 'VESSEL', 'CARGO'].includes(activeTab) ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
              MANAGEMENT
              <svg className="w-3.5 h-3.5 ml-0.5 opacity-50 group-hover:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className="absolute top-full left-0 w-80 bg-[#0c0914] border border-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden transform translate-y-2 group-hover:translate-y-0">
              <div className="px-5 py-4 border-b border-gray-800 text-white text-[12px] tracking-widest font-bold">SYSTEM MANAGEMENT</div>
              
              <div className="p-3 space-y-1">
                {/* 1. User Management */}
                <div onClick={() => setActiveTab('USERS')} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group/item">
                  <div className="w-10 h-10 rounded-xl bg-[#1a1528] flex items-center justify-center shrink-0 border border-purple-500/20"><svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg></div>
                  <div><div className="text-white text-[13px] font-bold">User Management</div><div className="text-gray-500 text-[11px]">Manage accounts.</div></div>
                </div>

                {/* 2. Vessel Management */}
                <div onClick={() => setActiveTab('VESSEL')} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group/item">
                  <div className="w-10 h-10 rounded-xl bg-[#1a1528] flex items-center justify-center shrink-0 border border-purple-500/20"><svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/></svg></div>
                  <div><div className="text-white text-[13px] font-bold">Vessel Management</div><div className="text-gray-500 text-[11px]">Edit and track vessels.</div></div>
                </div>

                {/* 3. Cargo Management */}
                <div onClick={() => setActiveTab('CARGO')} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group/item">
                  <div className="w-10 h-10 rounded-xl bg-[#1a1528] flex items-center justify-center shrink-0 border border-purple-500/20"><svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div>
                  <div><div className="text-white text-[13px] font-bold">Cargo Management</div><div className="text-gray-500 text-[11px]">Manage shipment data.</div></div>
                </div>
              </div>
            </div>
          </div>
        <div className="flex items-center gap-4 text-[11px] font-mono tracking-widest font-bold">
          <button className="px-6 py-2.5 rounded-xl border border-purple-500/30 bg-[#161224] hover:bg-[#1a152e] text-purple-400 transition-colors shadow-[0_4px_15px_rgba(139,92,246,0.1)] uppercase">
            ADMIN
          </button>
          <button
            className="px-6 py-2.5 rounded-xl border border-red-500/30 bg-[#1f1015] hover:bg-[#28151b] text-red-400 transition-colors shadow-[0_4px_15px_rgba(239,68,68,0.1)] uppercase"
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/login");
            }}
          >
            LOGOUT
          </button>
        </div>
      </header>

      <main className="p-6 max-w-[1600px] mx-auto pt-10">

        {activeTab === 'FLEET' ? (
          <>
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-3 px-8 py-4 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-mono font-bold tracking-widest shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] transition-all"
              >
                <span className="text-xl leading-none font-sans mt-[-2px]">+</span> Add Vessel
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div onClick={() => setFilterStatus(null)} className={`cursor-pointer px-6 py-5 rounded-2xl border transition-all ${filterStatus === null ? 'bg-[#0b0811] border-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.15)]' : 'bg-[#080808] border-transparent hover:border-gray-800'} flex items-center gap-5`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`w-7 h-7 ${filterStatus === null ? 'text-purple-400' : 'text-gray-700'}`}>
                  <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/>
                  <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path d="M12 10v4"/><path d="M12 2v3"/>
                </svg>
                <div>
                  <div className="text-xl font-bold text-white font-mono">{stats.total}</div>
                  <div className="text-[10px] text-gray-400 tracking-widest font-mono mt-0.5">TOTAL FLEET</div>
                </div>
              </div>
              <div onClick={() => setFilterStatus('EN ROUTE')} className={`cursor-pointer px-6 py-5 rounded-2xl border transition-all ${filterStatus === 'EN ROUTE' ? 'bg-[#0b0811] border-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.15)]' : 'bg-[#080808] border-transparent hover:border-gray-800'} flex items-center gap-5`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`w-7 h-7 ${filterStatus === 'EN ROUTE' ? 'text-purple-400' : 'text-gray-700'}`}>
                  <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.6 2 5.2 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
                  <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.6 2 5.2 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
                  <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.6 2 5.2 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
                </svg>
                <div>
                  <div className="text-xl font-bold text-white font-mono">{stats.enRoute}</div>
                  <div className="text-[10px] text-gray-600 tracking-widest font-mono mt-0.5">EN ROUTE</div>
                </div>
              </div>
              <div onClick={() => setFilterStatus('IN PORT')} className={`cursor-pointer px-6 py-5 rounded-2xl border transition-all ${filterStatus === 'IN PORT' ? 'bg-[#0b0811] border-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.15)]' : 'bg-[#080808] border-transparent hover:border-gray-800'} flex items-center gap-5`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`w-7 h-7 ${filterStatus === 'IN PORT' ? 'text-purple-400' : 'text-gray-700'}`}>
                  <circle cx="12" cy="5" r="3"/><path d="M12 8v14"/><path d="M5 12v3a7 7 0 0 0 14 0v-3"/>
                </svg>
                <div>
                  <div className="text-xl font-bold text-white font-mono">{stats.inPort}</div>
                  <div className="text-[10px] text-gray-600 tracking-widest font-mono mt-0.5">IN PORT</div>
                </div>
              </div>
              <div onClick={() => setFilterStatus('DELAYED')} className={`cursor-pointer px-6 py-5 rounded-2xl border transition-all ${filterStatus === 'DELAYED' ? 'bg-[#0b0811] border-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.15)]' : 'bg-[#080808] border-transparent hover:border-gray-800'} flex items-center gap-5`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`w-6 h-6 ${filterStatus === 'DELAYED' ? 'text-purple-400' : 'text-gray-700'}`}>
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
                  <path d="M12 9v4"/><path d="M12 17h.01"/>
                </svg>
                <div>
                  <div className="text-xl font-bold text-white font-mono">{stats.delayed}</div>
                  <div className="text-[10px] text-gray-600 tracking-widest font-mono mt-0.5">DELAYED</div>
                </div>
              </div>
              <div onClick={() => setFilterStatus('MAINTENANCE')} className={`cursor-pointer px-6 py-5 rounded-2xl border transition-all ${filterStatus === 'MAINTENANCE' ? 'bg-[#0b0811] border-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.15)]' : 'bg-[#080808] border-transparent hover:border-gray-800'} flex items-center gap-5`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`w-6 h-6 ${filterStatus === 'MAINTENANCE' ? 'text-purple-400' : 'text-gray-700'}`}>
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
                <div>
                  <div className="text-xl font-bold text-white font-mono">{stats.maintenance}</div>
                  <div className="text-[10px] text-gray-600 tracking-widest font-mono mt-0.5">MAINTENANCE</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                {(filterStatus ? fleetData.filter(v => v.status === filterStatus) : fleetData).map((vessel) => {
                  const isActive = activeCard === vessel.id;
                  const badgeColorClass =
                    vessel.colorKey === 'emerald' ? 'text-emerald-400' :
                    vessel.colorKey === 'sky' || vessel.colorKey === 'cyan' ? 'text-cyan-400' :
                    vessel.colorKey === 'yellow' ? 'text-yellow-400' :
                    'text-red-400';
                  const dotColorClass =
                    vessel.colorKey === 'emerald' ? 'bg-emerald-400' :
                    vessel.colorKey === 'sky' || vessel.colorKey === 'cyan' ? 'bg-cyan-400' :
                    vessel.colorKey === 'yellow' ? 'bg-yellow-400' :
                    'bg-red-400';
                  const topBorderColorClass =
                    vessel.colorKey === 'emerald' ? 'bg-emerald-500' :
                    vessel.colorKey === 'sky' || vessel.colorKey === 'cyan' ? 'bg-cyan-500' :
                    vessel.colorKey === 'yellow' ? 'bg-yellow-500' :
                    'bg-red-500';
                  const fuelIsGood = vessel.fuel >= 50;
                  const fuelColor = fuelIsGood ? 'text-emerald-400' : 'text-yellow-400';
                  const fuelBg = fuelIsGood ? 'bg-emerald-400' : 'bg-yellow-400';
                  return (
                    <div
                      key={vessel.id}
                      onClick={() => setActiveCard(vessel.id)}
                      className={`font-mono relative bg-[#09080b] rounded-xl p-5 cursor-pointer transition-all duration-500 ${isActive ? 'border border-purple-600 shadow-[0_0_20px_rgba(147,51,234,0.1)]' : 'border border-gray-800/60 hover:border-gray-700'} overflow-hidden`}
                    >
                      <div className={`absolute top-0 left-0 w-full h-[2px] transition-colors duration-500 ${topBorderColorClass} ${isActive ? 'opacity-100' : 'opacity-30'}`} />
                      <div className="flex justify-start mb-5 mt-1">
                        <span className={`flex items-center gap-2 px-2.5 py-1 rounded-full border border-gray-800/80 bg-transparent text-[10px] tracking-widest transition-colors duration-500 ${badgeColorClass}`}>
                          <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${dotColorClass} ${isActive && vessel.status === 'EN ROUTE' ? 'animate-pulse' : ''}`} />
                          {vessel.status}
                        </span>
                      </div>
                      <h3 className="text-white text-lg font-bold tracking-wide mb-1">{vessel.name}</h3>
                      <p className="text-gray-500 text-[11px] mb-6 opacity-80">{vessel.type}</p>
                      <div className="grid grid-cols-3 gap-3 mb-8">
                        <div className="bg-[#050505] rounded-xl p-3 flex flex-col justify-between">
                          <div className="text-[10px] flex items-center gap-1.5 mb-2 text-gray-500">
                            <svg className={`w-3.5 h-3.5 ${isActive ? 'text-purple-400' : 'text-purple-900'} transition-colors duration-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l-4-4m4 4v-8m8 8A8 8 0 104 14" /></svg>
                            SPEED
                          </div>
                          <div className="text-white font-bold text-lg transition-all duration-500">{vessel.speed} <span className="text-[10px] text-gray-500 font-normal ml-0.5">kn</span></div>
                        </div>
                        <div className="bg-[#050505] rounded-xl p-3 flex flex-col justify-between">
                          <div className="text-[10px] flex items-center gap-1.5 mb-2 text-gray-500">
                            <svg className={`w-3.5 h-3.5 ${isActive ? 'text-purple-400' : 'text-purple-900'} transition-colors duration-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><polygon points="3 11 22 2 13 21 11 13 3 11" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}/></svg>
                            HEADING
                          </div>
                          <div className="text-white font-bold text-lg">{vessel.heading}</div>
                        </div>
                        <div className="bg-[#050505] rounded-xl p-3 flex flex-col justify-between">
                          <div className="text-[10px] flex items-center gap-1.5 mb-2 text-gray-500">
                            <svg className={`w-3.5 h-3.5 ${isActive ? 'text-purple-400' : 'text-purple-900'} transition-colors duration-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="4" strokeWidth={2} /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>
                            WEATHER
                          </div>
                          <div className="text-white font-bold text-lg">{vessel.weather}</div>
                        </div>
                      </div>
                      <div className="mb-6">
                        <div className="flex justify-between items-center text-[10px] text-gray-500 mb-2">
                          <div className="flex items-center gap-1.5 tracking-widest">
                            <svg className="w-3.5 h-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                            FUEL
                          </div>
                          <span className={`${fuelColor} font-bold text-[10px] transition-colors duration-500`}>{vessel.fuel}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div className={`h-full ${fuelBg} rounded-full transition-all duration-1000`} style={{ width: `${vessel.fuel}%` }}></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 font-mono">
                        <svg className="w-3.5 h-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {vessel.location}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="space-y-6">
                <div className="bg-[#121016] border border-gray-800/80 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none"></div>
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 tracking-widest font-mono">
                      <svg className="w-5 h-5 text-purple-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="2" strokeWidth={2} /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.93 19.07a10 10 0 0 1 0-14.14M19.07 4.93a10 10 0 0 1 0 14.14M7.76 16.24a6 6 0 0 1 0-8.49M16.24 7.76a6 6 0 0 1 0 8.49" /></svg>
                      LIVE RADIUS SENSOR
                    </div>
                    <div className="flex items-center gap-1.5 text-purple-400 text-[10px] tracking-wider font-mono">ACTIVE</div>
                  </div>
                  <div className="text-gray-500 text-xs mb-3 font-mono">{fleetData.find(v => v.id === activeCard)?.name || 'Select a vessel'}</div>
                  <div className="space-y-2 mb-8">
                    <div className="flex items-end gap-2">
                      <div className="text-3xl font-bold text-white tracking-widest font-mono">6.2020° <span className="text-purple-400">S</span></div>
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="text-3xl font-bold text-white tracking-widest font-mono">106.8426° <span className="text-purple-400">E</span></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#18161f] rounded-xl p-4 border border-gray-800/60">
                      <div className="text-[10px] text-gray-500 mb-1">SPEED</div>
                      <div className="text-lg text-white font-bold transition-all duration-500">{fleetData.find(v => v.id === activeCard)?.speed || 0} <span className="text-sm text-gray-500 font-normal">kn</span></div>
                    </div>
                    <div className="bg-[#18161f] rounded-xl p-4 border border-gray-800/60">
                      <div className="text-[10px] text-gray-500 mb-1">HEADING</div>
                      <div className="text-lg text-white font-bold">{fleetData.find(v => v.id === activeCard)?.heading || '0°'}</div>
                    </div>
                  </div>
                  <button onClick={() => router.push(`/dashboard/fleet/${activeCard}`)} className="w-full py-4 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-medium transition-colors flex items-center justify-center gap-2">
                    View Full Details
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
                <div className="bg-[#121215] border border-gray-800/80 rounded-2xl p-6">
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 tracking-widest mb-6">
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                    FLEET STATUS
                  </div>
                  <div className="space-y-1 text-sm text-white">
                    {fleetData.map(v => (
                      <div key={v.id} onClick={() => setActiveCard(v.id)} className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${activeCard === v.id ? 'bg-[#18161f] border border-purple-500/20' : 'hover:bg-[#18161f]'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full transition-colors duration-500 ${getStatusColors(v.colorKey).dot}`}></div>
                          <div>
                            <div className={`font-medium text-xs ${activeCard === v.id ? 'text-white' : 'text-gray-300'}`}>{v.name}</div>
                            <div className={`text-[10px] ${getStatusColors(v.colorKey).text} font-bold tracking-wider mt-0.5 transition-colors duration-500`}>{v.status}</div>
                          </div>
                        </div>
                        <div className="text-gray-500 text-xs transition-all duration-500">{v.speed} kn</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#121215] border border-gray-800/80 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 tracking-widest">
                      <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                      ACTIVE ALERTS
                    </div>
                    <div className="bg-yellow-500/20 text-yellow-500 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border border-yellow-500/30">1</div>
                  </div>
                  <div className="bg-[#161214] border border-red-500/30 p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      <div className="text-gray-300 text-sm">MV Maritime Express experiencing delays</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-gray-500 hover:text-gray-400"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg></button>
                      <button className="text-gray-500 hover:text-gray-400"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>

        ) : activeTab === 'MAP' ? (
          <div className="animate-fade-in">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white tracking-widest mb-2 font-sans uppercase">LIVE MAP TRACKING</h2>
                <p className="text-gray-400">Real-time GPS positions of all fleet vessels</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-emerald-400 tracking-widest font-mono">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                GPS DATA STREAMING
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[500px]">
              <div className="lg:col-span-3 rounded-2xl overflow-hidden relative border-2 border-purple-500/20 shadow-[0_0_30px_rgba(147,51,234,0.15)] bg-[#0a0a0a]">
                <Suspense fallback={<MapSkeleton />}>
                  <MapComponent vessels={fleetData} />
                </Suspense>
              </div>
              <div className="lg:col-span-1 flex flex-col gap-4 h-full overflow-hidden">
                <div className="bg-[#121016] border border-gray-800 rounded-xl p-3.5 flex items-center gap-3 shadow-lg shrink-0">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input
                    type="text"
                    placeholder="Search vessel..."
                    className="bg-transparent border-none text-white text-sm focus:outline-none w-full placeholder-gray-600"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-4 min-h-0 pb-4">
                  {fleetData.filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase())).map(vessel => (
                    <div
                      key={vessel.id}
                      onClick={() => { setActiveTab('FLEET'); setActiveCard(vessel.id); }}
                      className="bg-[#121016] border border-gray-800/80 rounded-xl p-5 transition-all flex flex-col relative overflow-hidden shadow-md shrink-0 cursor-pointer hover:border-purple-500/30 hover:bg-[#16141c]"
                    >
                      <div className={`absolute top-0 left-0 w-full h-[1px] ${getStatusColors(vessel.colorKey).fill}`}></div>
                      <h3 className="text-white font-bold text-[13px] tracking-wide mb-3 flex items-center gap-2 font-mono">
                        <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6M12 10v4M12 2v3"/></svg>
                        {vessel.name}
                      </h3>
                      <div className="grid grid-cols-1 gap-2 text-[11px] font-mono mb-4 text-gray-400">
                        <div className="flex items-center gap-2.5"><svg className="w-3 h-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l-4-4m4 4v-8m8 8A8 8 0 104 14"/></svg>{vessel.speed} kn</div>
                        <div className="flex items-center gap-2.5"><svg className="w-3 h-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><polygon points="3 11 22 2 13 21 11 13 3 11" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}/></svg>{vessel.heading}</div>
                        <div className="flex items-center gap-2.5"><svg className="w-3 h-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>{vessel.location}</div>
                      </div>
                      <div className={`flex items-center gap-2 text-[10px] tracking-widest font-bold font-mono uppercase ${getStatusColors(vessel.colorKey).text}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${getStatusColors(vessel.colorKey).dot} ${vessel.status === 'EN ROUTE' ? 'animate-pulse' : ''}`}></div>
                        <span>{vessel.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <style jsx>{`
              .custom-scrollbar::-webkit-scrollbar { width: 6px; }
              .custom-scrollbar::-webkit-scrollbar-track { background: #09080c; border-radius: 10px; }
              .custom-scrollbar::-webkit-scrollbar-thumb { background: #2a2438; border-radius: 10px; }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3e3553; }
              .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
              @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
          </div>

        ) : activeTab === 'ANALYTICS' ? (
          <Suspense fallback={<AnalyticsSkeleton />}>
            <AnalyticsComponent fleetData={fleetData} />
          </Suspense>

        ) : activeTab === 'USERS' ? (
          <Suspense fallback={<UsersSkeleton />}>
            <UserManagementComponent />
          </Suspense>

        ) : activeTab === 'VESSEL' ? (
          <VesselManagement />

        ) : activeTab === 'CARGO' ? (
        <CargoManagementComponent/>

        ) : null}

      </main>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c0a13] border border-gray-800 rounded-2xl w-full max-w-lg p-7 shadow-[0_0_40px_rgba(147,51,234,0.15)] font-mono relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="flex items-center gap-3 text-white font-bold text-lg mb-8 uppercase tracking-widest">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6M12 10v4M12 2v3"/></svg>
              Add New Vessel
            </div>
            
            {/* Modal Form */}
            <div className="space-y-5">
              <div>
                <label className="text-[10px] text-gray-500 tracking-widest mb-2 block uppercase">Vessel Name</label>
                <input type="text" value={newVessel.name} onChange={e => setNewVessel({...newVessel, name: e.target.value})} className="w-full bg-[#050505] border border-gray-800 rounded-xl p-3.5 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" placeholder="e.g. MV Pacific Star" />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 tracking-widest mb-2 block uppercase">Vessel Type</label>
                <input type="text" value={newVessel.type} onChange={e => setNewVessel({...newVessel, type: e.target.value})} className="w-full bg-[#050505] border border-gray-800 rounded-xl p-3.5 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" placeholder="e.g. Container Ship" />
              </div>
              
              {/* TAMBAHAN 2 FIELD WAJIB UGD */}
              <div>
                <label className="text-[10px] text-gray-500 tracking-widest mb-2 block uppercase">Vessel ID / Code</label>
                <input type="text" required value={newVessel.code} onChange={e => setNewVessel({...newVessel, code: e.target.value})} className="w-full bg-[#050505] border border-gray-800 rounded-xl p-3.5 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" placeholder="e.g. V-001" />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 tracking-widest mb-2 block uppercase">Capacity (Tons)</label>
                <input type="number" required value={newVessel.capacity} onChange={e => setNewVessel({...newVessel, capacity: e.target.value})} className="w-full bg-[#050505] border border-gray-800 rounded-xl p-3.5 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" placeholder="e.g. 50000" />
              </div>
              
              <div>
                <label className="text-[10px] text-gray-500 tracking-widest mb-2 block uppercase">Initial Status</label>
                <select value={newVessel.status} onChange={e => setNewVessel({...newVessel, status: e.target.value})} className="w-full bg-[#050505] border border-gray-800 rounded-xl p-3.5 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all appearance-none">
                  <option value="EN ROUTE">EN ROUTE</option>
                  <option value="IN PORT">IN PORT</option>
                  <option value="DELAYED">DELAYED</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-gray-500 tracking-widest mb-2 block uppercase">Destination</label>
                <input type="text" value={newVessel.destination} onChange={e => setNewVessel({...newVessel, destination: e.target.value})} className="w-full bg-[#050505] border border-gray-800 rounded-xl p-3.5 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" placeholder="e.g. Port of Surabaya" />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setShowAddModal(false)} className="px-6 py-2.5 rounded-xl bg-[#1a1a24] text-gray-300 hover:text-white font-medium text-sm transition-colors border border-gray-800/80">Cancel</button>
              <button onClick={handleAddVessel} className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add Vessel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}