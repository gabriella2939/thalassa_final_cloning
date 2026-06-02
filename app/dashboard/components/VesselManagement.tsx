'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export default function VesselManagement() {
  const [vesselList, setVesselList] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: '', nama: '', jenis: '', kode: '', kapasitas: '', status: 'Active'
  });
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showNotification = (message: string, type: 'success' | 'error') => {
  setNotification({ message, type });
  setTimeout(() => setNotification(null), 4000);
  };

  // State untuk search term
  const [searchTerm, setSearchTerm] = useState('');

  // ==========================================
  // STATE DAN KONFIGURASI PAGINATION
  // ==========================================
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchVessels = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('vessel').select('*');
    if (!error) setVesselList(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchVessels(); }, []);

  // Reset halaman ke 1 setiap kali user mengetik sesuatu di kolom pencarian
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      await supabase.from('vessel').update({
        nama: formData.nama, jenis: formData.jenis, kode: formData.kode,
        kapasitas: formData.kapasitas, status: formData.status
      }).eq('id', formData.id);
      showNotification('Vessel updated successfully!', 'success');
    } else {
      await supabase.from('vessel').insert({
        nama: formData.nama, jenis: formData.jenis, kode: formData.kode,
        kapasitas: formData.kapasitas, status: formData.status
      });
      showNotification('Vessel added successfully!', 'success');
    }
    setShowModal(false);
    setFormData({ id: '', nama: '', jenis: '', kode: '', kapasitas: '', status: 'Active' });
    fetchVessels();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus data kapal ini?")) {
      await supabase.from('vessel').delete().eq('id', id);
      showNotification('Vessel deleted successfully!', 'success');
      fetchVessels();
    }
  };

  // Logika filter berdasarkan nama, jenis, atau kode kapal
  const filteredVessels = vesselList.filter((vessel) =>
    vessel.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vessel.jenis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vessel.kode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ==========================================
  // LOGIKA PEMOTONGAN DATA (SLICE) UNTUK PAGINATION
  // ==========================================
  const totalPages = Math.ceil(filteredVessels.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVessels = filteredVessels.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-6 bg-[#0c0a13] rounded-2xl border border-gray-800 animate-fade-in">
      
      {/* 1. HEADER UTAMA */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-white text-xl font-bold font-mono tracking-widest uppercase border-l-4 border-purple-500 pl-4">
          Vessel Management
        </h2>
        <button 
          onClick={() => { setIsEditing(false); setShowModal(true); }} 
          className="bg-purple-600 px-6 py-3 rounded-xl text-white font-bold tracking-widest hover:bg-purple-500 transition-all"
        >
          + Add Vessel
        </button>
      </div>

      {/* 2. STANDALONE SEARCH BAR */}
      <div className="flex items-center gap-3 mb-6">
        <svg 
          className="w-5 h-5 text-gray-400 flex-shrink-0" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        
        <input
          type="text"
          placeholder="Search vessel name, type, or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-72 bg-[#121016] border border-gray-800 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors placeholder-gray-500 shadow-inner"
        />
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-gray-500 text-center py-10">Loading...</div>
        ) : vesselList.length === 0 ? (
          <div className="text-gray-500 text-center py-10">Belum ada data vessel.</div>
        ) : (
          <>
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-[10px] uppercase tracking-widest border-b border-gray-800">
                  <th className="pb-4">Nama</th><th className="pb-4">Jenis</th><th className="pb-4">Kode</th>
                  <th className="pb-4">Kapasitas</th><th className="pb-4">Status</th><th className="pb-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-white text-sm">
                {/* MAPPING MENGGUNAKAN DATA HALAMAN SEKARANG (currentVessels) */}
                {currentVessels.map((v) => (
                  <tr key={v.id} className="border-b border-gray-800/50 hover:bg-white/5">
                    <td className="py-4">{v.nama}</td>
                    <td className="py-4">{v.jenis}</td>
                    <td className="py-4 font-mono">{v.kode}</td>
                    <td className="py-4">{v.kapasitas} Tons</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                        v.status === 'Active' ? 'bg-emerald-600/20 text-emerald-400' :
                        v.status === 'En Route' ? 'bg-blue-600/20 text-blue-400' :
                        'bg-yellow-600/20 text-yellow-400'
                      }`}>{v.status}</span>
                    </td>
                    <td className="py-4 text-center flex justify-center gap-2">
                      <button onClick={() => { setFormData(v); setIsEditing(true); setShowModal(true); }} className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-[10px] font-bold hover:bg-blue-600/40 transition-colors">EDIT</button>
                      <button onClick={() => handleDelete(v.id)} className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg text-[10px] font-bold hover:bg-red-600/40 transition-colors">HAPUS</button>
                    </td>
                  </tr>
                ))}
                {filteredVessels.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-gray-500 text-center py-10 text-sm">
                      Tidak ada data vessel yang cocok dengan pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* CONTROLLER COMPONENT FOR PAGINATION */}
            {filteredVessels.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t border-gray-800/50 text-xs text-gray-400">
                {/* Teks Keterangan Data */}
                <div>
                  Showing <span className="text-white font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="text-white font-medium">
                    {Math.min(indexOfLastItem, filteredVessels.length)}
                  </span>{' '}
                  of <span className="text-white font-medium">{filteredVessels.length}</span> records
                </div>
                
                {/* Tombol Angka & Navigasi */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="px-3 py-2 bg-[#121016] border border-gray-800 rounded-lg font-bold hover:border-purple-500 disabled:opacity-30 disabled:hover:border-gray-800 transition-colors disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>
                  
                  <div className="flex items-center gap-1 font-mono">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg border font-bold transition-all ${
                          currentPage === page
                            ? 'bg-purple-600 border-purple-500 text-white'
                            : 'bg-[#121016] border-gray-800 hover:border-purple-500 text-gray-400'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="px-3 py-2 bg-[#121016] border border-gray-800 rounded-lg font-bold hover:border-purple-500 disabled:opacity-30 disabled:hover:border-gray-800 transition-colors disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL FORM */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c0a13] border border-gray-800 rounded-2xl w-full max-w-lg p-8 shadow-2xl">
            <h2 className="text-white font-bold mb-6 uppercase">{isEditing ? "Edit Vessel" : "Add New Vessel"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Nama Vessel" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full bg-[#050505] p-3 rounded-lg text-white border border-gray-800" />
              <input required placeholder="Jenis Vessel" value={formData.jenis} onChange={e => setFormData({...formData, jenis: e.target.value})} className="w-full bg-[#050505] p-3 rounded-lg text-white border border-gray-800" />
              <input required placeholder="Kode Vessel" value={formData.kode} onChange={e => setFormData({...formData, kode: e.target.value})} className="w-full bg-[#050505] p-3 rounded-lg text-white border border-gray-800" />
              <input required type="number" placeholder="Kapasitas (Tons)" value={formData.kapasitas} onChange={e => setFormData({...formData, kapasitas: e.target.value})} className="w-full bg-[#050505] p-3 rounded-lg text-white border border-gray-800" />
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-[#050505] p-3 rounded-lg text-white border border-gray-800">
                <option>Active</option><option>Maintenance</option><option>En Route</option>
              </select>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 p-3 border border-gray-700 rounded-lg text-gray-400">Cancel</button>
                <button type="submit" className="flex-1 p-3 bg-purple-600 rounded-lg text-white font-bold">{isEditing ? "Update" : "Add Vessel"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}