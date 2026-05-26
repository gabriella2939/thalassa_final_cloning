'use client';
import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
interface Vessel {
  id: number;
  name: string;
  status: string;
  speed: string;
  fuel: number;
}
export default function AnalyticsComponent({ fleetData }: { fleetData: Vessel[] }) {
  const totalVessels = fleetData.length;
  const activeVessels = fleetData.filter(v => v.status === 'EN ROUTE').length;
  const avgSpeed = (fleetData.reduce((acc, curr) => acc + parseFloat(curr.speed), 0) / (totalVessels || 1)).toFixed(1);
  const avgFuel = Math.round(fleetData.reduce((acc, curr) => acc + curr.fuel, 0) / (totalVessels || 1));
  const alerts = fleetData.filter(v => v.status === 'DELAYED' || v.status === 'MAINTENANCE').length;
  const fuelData = [
    { name: '01 Apr', consumption: 1200, efficiency: 85 },
    { name: '02 Apr', consumption: 1350, efficiency: 82 },
    { name: '03 Apr', consumption: 1100, efficiency: 88 },
    { name: '04 Apr', consumption: 1450, efficiency: 79 },
    { name: '05 Apr', consumption: 1300, efficiency: 84 },
    { name: '06 Apr', consumption: 1250, efficiency: 86 },
    { name: '07 Apr', consumption: 1180, efficiency: 87 },
  ];
  const activityData = [
    { name: '00:00', active: 2, idle: 3 },
    { name: '04:00', active: 3, idle: 4 },
    { name: '08:00', active: 5, idle: 5 },
    { name: '12:00', active: 6, idle: 6 },
    { name: '16:00', active: 4, idle: 5 },
    { name: '20:00', active: 3, idle: 4 },
  ];
  const cargoData = [
    { name: 'Electronics', value: 3.5, color: '#a855f7' },
    { name: 'Coal', value: 2.5, color: '#c084fc' },
    { name: 'Crude Oil', value: 2.1, color: '#d8b4fe' },
    { name: 'Consumer', value: 1.5, color: '#8b5cf6' },
    { name: 'Vehicles', value: 1.2, color: '#7c3aed' },
  ];
  const statuses = [
    { name: 'En Route', count: fleetData.filter(v => v.status === 'EN ROUTE').length, color: 'bg-emerald-400' },
    { name: 'In Port', count: fleetData.filter(v => v.status === 'IN PORT').length, color: 'bg-sky-400' },
    { name: 'Delayed', count: fleetData.filter(v => v.status === 'DELAYED').length, color: 'bg-yellow-400' },
    { name: 'Maintenance', count: fleetData.filter(v => v.status === 'MAINTENANCE').length, color: 'bg-red-400' },
  ];
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#121016] border border-gray-800 p-3 rounded-lg shadow-xl text-xs font-mono">
          <p className="text-gray-400 mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  return (
    <div className="animate-fade-in text-white w-full">
      <div className="flex justify-between items-end mb-8">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          <h2 className="text-3xl font-bold tracking-widest font-sans">Fleet Analytics</h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-[10px] text-emerald-400 tracking-widest font-mono">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
          LIVE STREAMING
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-[#120e1c] border border-purple-500/20 rounded-2xl p-5 flex flex-col justify-between h-28">
          <svg className="w-5 h-5 text-purple-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
            <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
            <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
            <path d="M12 10v4" />
            <path d="M12 2v3" />
          </svg>
          <div>
            <div className="text-2xl font-bold text-purple-400 font-mono">{totalVessels}</div>
            <div className="text-[9px] text-gray-500 tracking-widest uppercase mt-1">Total Vessels</div>
          </div>
        </div>
        <div className="bg-[#0b1618] border border-emerald-500/20 rounded-2xl p-5 flex flex-col justify-between h-28">
          <svg className="w-5 h-5 text-emerald-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
          <div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">{activeVessels}</div>
            <div className="text-[9px] text-gray-500 tracking-widest uppercase mt-1">Active</div>
          </div>
        </div>
        <div className="bg-[#0a121a] border border-sky-500/20 rounded-2xl p-5 flex flex-col justify-between h-28">
          <svg className="w-5 h-5 text-sky-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          <div>
            <div className="text-2xl font-bold text-sky-400 font-mono">{avgSpeed} kn</div>
            <div className="text-[9px] text-gray-500 tracking-widest uppercase mt-1">Avg Speed</div>
          </div>
        </div>
        <div className="bg-[#10121e] border border-indigo-500/20 rounded-2xl p-5 flex flex-col justify-between h-28">
          <svg className="w-4 h-4 text-indigo-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <div>
            <div className="text-2xl font-bold text-indigo-400 font-mono">142</div>
            <div className="text-[9px] text-gray-500 tracking-widest uppercase mt-1">Total Crew</div>
          </div>
        </div>
        <div className="bg-[#17150c] border border-yellow-500/20 rounded-2xl p-5 flex flex-col justify-between h-28">
          <svg className="w-5 h-5 text-yellow-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="22" x2="15" y2="22"></line>
            <line x1="4" y1="9" x2="14" y2="9"></line>
            <path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"></path>
            <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"></path>
          </svg>
          <div>
            <div className="text-2xl font-bold text-yellow-400 font-mono">{avgFuel}%</div>
            <div className="text-[9px] text-gray-500 tracking-widest uppercase mt-1">Avg Fuel</div>
          </div>
        </div>
        <div className="bg-[#1a0e10] border border-red-500/20 rounded-2xl p-5 flex flex-col justify-between h-28">
          <svg className="w-5 h-5 text-red-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <div>
            <div className="text-2xl font-bold text-red-400 font-mono">{alerts}</div>
            <div className="text-[9px] text-gray-500 tracking-widest uppercase mt-1">Alerts</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0b0a0e] border border-gray-800/60 rounded-2xl p-6 h-80 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="22" x2="15" y2="22"></line>
              <line x1="4" y1="9" x2="14" y2="9"></line>
              <path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"></path>
              <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"></path>
            </svg>
            <h3 className="text-sm font-bold tracking-wide font-mono text-gray-200">Fuel Consumption & Efficiency</h3>
          </div>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fuelData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} tickCount={5} domain={[0, 1600]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="consumption" stroke="#2dd4bf" strokeWidth={2} dot={{ r: 4, fill: "#2dd4bf" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-[10px] font-mono font-bold tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span className="text-purple-500">Consumption (L)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-emerald-500">Efficiency (%)</span>
            </div>
          </div>
        </div>
        <div className="bg-[#0b0a0e] border border-gray-800/60 rounded-2xl p-6 h-80 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            <h3 className="text-sm font-bold tracking-wide font-mono text-gray-200">Vessel Activity (24H)</h3>
          </div>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} domain={[0, 8]} tickCount={5} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} content={<CustomTooltip />} />
                <Bar dataKey="idle" fill="#374151" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-[10px] font-mono font-bold tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-gray-400">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-600"></div>
              <span className="text-gray-400">Idle</span>
            </div>
          </div>
        </div>
        <div className="bg-[#0b0a0e] border border-gray-800/60 rounded-2xl p-6 h-80 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
              <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
              <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
              <path d="M12 10v4" />
              <path d="M12 2v3" />
            </svg>
            <h3 className="text-sm font-bold tracking-wide font-mono text-gray-200">Cargo Type Distribution</h3>
          </div>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cargoData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} width={100} />
                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} tickCount={4} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {cargoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-[#0b0a0e] border border-gray-800/60 rounded-2xl p-6 h-80 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            <h3 className="text-sm font-bold tracking-wide font-mono text-gray-200">Fleet Status Overview</h3>
          </div>
          <div className="flex flex-col justify-around flex-1">
            {statuses.map((s, idx) => (
              <div key={idx} className="mb-2">
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-gray-400">{s.name}</span>
                  <span className="text-cyan-400 font-bold">{s.count}/{totalVessels}</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${s.color} rounded-full transition-all duration-1000`} 
                    style={{ width: `${(s.count / (totalVessels || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
