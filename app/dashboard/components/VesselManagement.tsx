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
  
  // STATE BARU: Untuk kontrol Modal Delete Custom dan menampung data kapal yang dipilih
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVessel, setSelectedVessel] = useState<any | null>(null);

  const [vesselErrors, setVesselErrors] = useState({ nama: '', jenis: '', kode: '', kapasitas: '' });
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const [searchTerm, setSearchTerm] = useState('');

  // PAGINATION SETTINGS
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchVessels = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('vessel').select('*');
    if (!error) setVesselList(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchVessels(); }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = { nama: '', jenis: '', kode: '', kapasitas: '' };
    if (!formData.nama.trim()) errors.nama = 'Vessel name is required.';
    if (!formData.jenis.trim()) errors.jenis = 'Vessel type is required.';
    if (!formData.kode.trim()) errors.kode = 'Vessel code is required.';
    if (!formData.kapasitas) errors.kapasitas = 'Capacity is required.';
    else if (Number(formData.kapasitas) <= 0) errors.kapasitas = 'Capacity must be greater than 0.';

    setVesselErrors(errors);
    if (errors.nama || errors.jenis || errors.kode || errors.kapasitas) return;

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
    closeModal();
    fetchVessels();
  };

  // FUNGSI BARU: Eksekusi hapus data dari database setelah konfirmasi di modal custom
  const handleDeleteConfirm = async () => {
    if (!selectedVessel) return;
    
    const { error } = await supabase.from('vessel').delete().eq('id', selectedVessel.id);
    
    if (!error) {
      showNotification('Vessel deleted successfully!', 'success');
      fetchVessels();
    } else {
      showNotification('Failed to delete vessel.', 'error');
    }
    setShowDeleteModal(false);
    setSelectedVessel(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ id: '', nama: '', jenis: '', kode: '', kapasitas: '', status: 'Active' });
    setVesselErrors({ nama: '', jenis: '', kode: '', kapasitas: '' });
  };

  const filteredVessels = vesselList.filter((vessel) =>
    vessel.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vessel.jenis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vessel.kode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVessels.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVessels = filteredVessels.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-6 bg-[#0c0a13] rounded-2xl border border-gray-800 animate-fade-in">
      
      {/* NOTIFICATION TOAST */}
      {notification && (
        <div className={`fixed top-24 right-6 p-4 rounded-xl border text-sm font-mono z-50 shadow-lg transition-all ${
          notification.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {notification.message}
        </div>
      )}

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
        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    <td className="py-4 text-center flex justify-center items-center gap-2">
                      <button onClick={() => { setFormData(v); setIsEditing(true); setShowModal(true); }} className="p-2 rounded-lg bg-[#121016] border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white transition-colors" title="Edit">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      {/* PERUBAHAN: Sekarang memicu pembukaan Modal Custom */}
                      <button onClick={() => { setSelectedVessel(v); setShowDeleteModal(true); }} className="p-2 rounded-lg bg-[#121016] border border-gray-800 hover:border-red-500/50 hover:text-red-400 text-gray-400 transition-colors" title="Hapus">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* CONTROLLER COMPONENT FOR PAGINATION */}
            {filteredVessels.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between p-5 border-t border-gray-800/60 bg-[#0d0a14] gap-4 sm:gap-0 text-sm text-gray-400">
                <div className="text-xs sm:text-sm">
                  Showing <span className="text-white font-medium">{filteredVessels.length === 0 ? 0 : indexOfFirstItem + 1}</span> to <span className="text-white font-medium">{Math.min(currentPage * itemsPerPage, filteredVessels.length)}</span> of <span className="text-white font-medium">{filteredVessels.length}</span> records
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1.5 rounded-xl bg-[#121016] border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    Previous
                  </button>
                  <div className="flex items-center gap-1 font-mono">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button key={page} type="button" onClick={() => setCurrentPage(page)} className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-colors ${currentPage === page ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(147,51,234,0.15)]' : 'bg-[#121016] border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white'}`}>
                        {page}
                      </button>
                    ))}
                  </div>
                  <button type="button" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1.5 rounded-xl bg-[#121016] border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL FORM ADD/EDIT */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c0a13] border border-gray-800 rounded-2xl w-full max-w-lg p-7 shadow-2xl font-mono relative">
            <button onClick={closeModal} className="absolute top-6 right-6 text-gray-500 hover:text-white">✕</button>
            <h2 className="text-xl font-bold text-purple-400 mb-6 uppercase border-l-4 border-purple-500 pl-4">
              {isEditing ? "Edit Vessel" : "Add New Vessel"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] text-gray-400 tracking-widest mb-2 block uppercase">Nama Vessel</label>
                <input 
                  placeholder="e.g. MV Pacific Star" 
                  value={formData.nama} 
                  onChange={e => { setFormData({...formData, nama: e.target.value}); setVesselErrors(p => ({...p, nama: ''})); }} 
                  className={`w-full bg-[#050505] border rounded-xl p-3.5 text-white text-sm focus:outline-none transition-colors ${vesselErrors.nama ? 'border-red-500' : 'border-gray-800 focus:border-purple-500'}`} 
                />
                {vesselErrors.nama && <p className="text-red-400 text-[10px] mt-1.5 tracking-widest font-mono uppercase">{vesselErrors.nama}</p>}
              </div>

              <div>
                <label className="text-[10px] text-gray-400 tracking-widest mb-2 block uppercase">Jenis Vessel</label>
                <input 
                  placeholder="e.g. Container Ship" 
                  value={formData.jenis} 
                  onChange={e => { setFormData({...formData, jenis: e.target.value}); setVesselErrors(p => ({...p, jenis: ''})); }} 
                  className={`w-full bg-[#050505] border rounded-xl p-3.5 text-white text-sm focus:outline-none transition-colors ${vesselErrors.jenis ? 'border-red-500' : 'border-gray-800 focus:border-purple-500'}`} 
                />
                {vesselErrors.jenis && <p className="text-red-400 text-[10px] mt-1.5 tracking-widest font-mono uppercase">{vesselErrors.jenis}</p>}
              </div>

              <div>
                <label className="text-[10px] text-gray-400 tracking-widest mb-2 block uppercase">Kode Vessel</label>
                <input 
                  placeholder="e.g. V-001" 
                  value={formData.kode} 
                  onChange={e => { setFormData({...formData, kode: e.target.value}); setVesselErrors(p => ({...p, kode: ''})); }} 
                  className={`w-full bg-[#050505] border rounded-xl p-3.5 text-white text-sm focus:outline-none transition-colors ${vesselErrors.kode ? 'border-red-500' : 'border-gray-800 focus:border-purple-500'}`} 
                />
                {vesselErrors.kode && <p className="text-red-400 text-[10px] mt-1.5 tracking-widest font-mono uppercase">{vesselErrors.kode}</p>}
              </div>

              <div>
                <label className="text-[10px] text-gray-400 tracking-widest mb-2 block uppercase">Kapasitas (Tons)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 50000" 
                  value={formData.kapasitas} 
                  onChange={e => { setFormData({...formData, kapasitas: e.target.value}); setVesselErrors(p => ({...p, kapasitas: ''})); }} 
                  className={`w-full bg-[#050505] border rounded-xl p-3.5 text-white text-sm focus:outline-none transition-colors ${vesselErrors.kapasitas ? 'border-red-500' : 'border-gray-800 focus:border-purple-500'}`} 
                />
                {vesselErrors.kapasitas && <p className="text-red-400 text-[10px] mt-1.5 tracking-widest font-mono uppercase">{vesselErrors.kapasitas}</p>}
              </div>

              <div>
                <label className="text-[10px] text-gray-400 tracking-widest mb-2 block uppercase">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-[#050505] border border-gray-800 rounded-xl p-3.5 text-white text-sm focus:outline-none focus:border-purple-500">
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="En Route">En Route</option>
                </select>
              </div>

              <div className="flex gap-4 mt-8 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 py-3.5 rounded-xl border border-gray-800 text-gray-400 hover:text-white font-medium text-sm transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                  {isEditing ? "UPDATE VESSEL" : "ADD VESSEL"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL BARU: CUSTOM CONFIRM DELETE BERBAHASA INGGRIS (Sesuai Gambar 3) */}
      {showDeleteModal && selectedVessel && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0a0e] border border-red-500/30 rounded-2xl w-full max-w-md p-6 shadow-[0_0_40px_rgba(239,68,68,0.15)] relative font-mono animate-fade-in">
            <button 
              onClick={() => { setShowDeleteModal(false); setSelectedVessel(null); }} 
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-red-400 mb-4">Confirm Delete</h2>
            <p className="text-gray-300 text-sm mb-8">
              Delete vessel <span className="text-white font-bold">{selectedVessel.nama}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => { setShowDeleteModal(false); setSelectedVessel(null); }} 
                className="flex-1 py-3 rounded-xl bg-[#2a2b36] text-white text-sm hover:bg-[#343544] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm} 
                className="flex-1 py-3 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white font-medium text-sm shadow-[0_0_15px_rgba(220,38,38,0.2)] transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}