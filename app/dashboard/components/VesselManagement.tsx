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
    id: '', nama: '', jenis: '', kode: '', kapasitas: '', status: 'Active'});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVessel, setSelectedVessel] = useState<any | null>(null);
  const [vesselErrors, setVesselErrors] = useState({ nama: '', jenis: '', kode: '', kapasitas: '' });
  const [toast, setToast] = useState({ show: false, title: '', message: '', });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const showToast = (title: string, message: string) => {
    setToast({ show: true, title, message, });
    setTimeout(() => { setToast({ show: false, title: '', message: '',});
    }, 3000);
  };
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
      showToast( 'VESSEL UPDATED', 'Vessel information has been updated successfully.');
    } else {
      await supabase.from('vessel').insert({
        nama: formData.nama, jenis: formData.jenis, kode: formData.kode,
        kapasitas: formData.kapasitas, status: formData.status
      });
      showToast( 'VESSEL CREATED', 'Vessel has been added successfully.');
    }
    closeModal();
    fetchVessels();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedVessel) return;
    const { error } = await supabase.from('vessel').delete().eq('id', selectedVessel.id);
    if (!error) {
      showToast( 'VESSEL DELETED', 'Vessel has been deleted successfully.');
      fetchVessels();
    } else {
      showToast( 'DELETE FAILED', 'Failed to delete vessel.');
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
    <div className="animate-fade-in text-white w-full font-sans">
      {/* HEADER UTAMA */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.4)] flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 17l1.5 3h15L21 17M3 17l2-7h14l2 7M12 3v7m0 0l-3 2m3-2l3 2" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-wide">Vessel Management</h2>
            <p className="text-gray-400 text-sm mt-1">Manage fleet vessels, technical specifications, and operation levels</p>
          </div>
        </div>
        <button
          onClick={() => { setIsEditing(false); setVesselErrors({ nama: '', jenis: '', kode: '', kapasitas: '' }); setShowModal(true); }}
          className="bg-purple-600 px-6 py-3 rounded-xl text-white font-bold tracking-widest hover:bg-purple-500 transition-all"
        >
          + Add Vessel
        </button>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-[#0b0a0e] border border-gray-800/60 rounded-2xl overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border-b border-gray-800/60 gap-4 sm:gap-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <h3 className="text-xs font-bold tracking-widest text-purple-400 uppercase font-mono whitespace-nowrap">
              System Vessels
            </h3>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search name, type, or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-72 bg-[#121016] border border-gray-800 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors placeholder-gray-500 shadow-inner"/>
            </div>
          </div>
          <span className="text-xs text-gray-500 font-mono self-end sm:self-auto">
            {filteredVessels.length} records
          </span>
        </div>
        
        {loading ? (
          <div className="text-gray-500 text-center py-10 font-mono text-sm">Loading...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800/60 text-[10px] font-bold tracking-widest text-purple-400 uppercase font-mono bg-[#0d0a14]">
                    <th className="p-5">Name</th>
                    <th className="p-5">Type</th>
                    <th className="p-5">Code</th>
                    <th className="p-5">Capacity</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentVessels.map((v) => (
                    <tr key={v.id} className="border-b border-gray-800/40 hover:bg-[#12101a] transition-colors">
                      <td className="p-5 font-medium text-sm text-gray-200">{v.nama}</td>
                      <td className="p-5 text-sm text-gray-400">{v.jenis}</td>
                      <td className="p-5 font-mono text-sm text-purple-400">{v.kode}</td>
                      <td className="p-5 text-sm text-gray-300">{v.kapasitas} Tons</td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider font-mono border ${
                          v.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                          v.status === 'En Route' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                          'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                        }`}>{v.status}</span>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => { setFormData(v); setIsEditing(true); setVesselErrors({ nama: '', jenis: '', kode: '', kapasitas: '' }); setShowModal(true); }} className="p-2 rounded-lg bg-[#121016] border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button onClick={() => { setSelectedVessel(v); setShowDeleteModal(true); }} className="p-2 rounded-lg bg-[#121016] border border-gray-800 hover:border-red-500/50 hover:text-red-400 text-gray-400 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentVessels.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-5 text-center text-sm text-gray-500 font-mono">
                        No vessels found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* CONTROLS PAGINATION */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-5 border-t border-gray-800/60 bg-[#0d0a14] gap-4 sm:gap-0 text-sm text-gray-400">
              <div className="text-xs sm:text-sm">
                Showing <span className="text-white font-medium">{filteredVessels.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-white font-medium">{Math.min(currentPage * itemsPerPage, filteredVessels.length)}</span> of <span className="text-white font-medium">{filteredVessels.length}</span> records
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1.5 rounded-xl bg-[#121016] border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Previous</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-colors ${currentPage === page ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(147,51,234,0.15)]' : 'bg-[#121016] border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white'}`}>{page}</button>
                ))}
                <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1.5 rounded-xl bg-[#121016] border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Next</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* FORM MODAL (ADD / EDIT) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0a0e] border border-purple-500/30 rounded-2xl w-full max-w-md p-6 shadow-[0_0_40px_rgba(139,92,246,0.15)] relative font-mono">
            <button onClick={closeModal} className="absolute top-6 right-6 text-gray-500 hover:text-white">✕</button>
            <h2 className="text-xl font-bold text-purple-400 mb-6">
              {isEditing ? "Edit Vessel" : "Add New Vessel"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-gray-400 tracking-widest mb-2 block uppercase">Vessel Name</label>
                <input 
                  type="text"
                  placeholder="e.g. MV Pacific Star" 
                  value={formData.nama} 
                  onChange={e => { setFormData({...formData, nama: e.target.value}); setVesselErrors(p => ({...p, nama: ''})); }} 
                  className={`w-full bg-[#121016] border rounded-xl p-3 text-white text-sm focus:outline-none transition-colors ${vesselErrors.nama ? 'border-red-500' : 'border-gray-800 focus:border-purple-500'}`} 
                />
                {vesselErrors.nama && <p className="text-red-400 text-[10px] mt-1.5 tracking-widest font-mono uppercase">{vesselErrors.nama}</p>}
              </div>

              <div>
                <label className="text-[10px] text-gray-400 tracking-widest mb-2 block uppercase">Vessel Type</label>
                <input 
                  type="text"
                  placeholder="e.g. Container Ship" 
                  value={formData.jenis} 
                  onChange={e => { setFormData({...formData, jenis: e.target.value}); setVesselErrors(p => ({...p, jenis: ''})); }} 
                  className={`w-full bg-[#121016] border rounded-xl p-3 text-white text-sm focus:outline-none transition-colors ${vesselErrors.jenis ? 'border-red-500' : 'border-gray-800 focus:border-purple-500'}`} 
                />
                {vesselErrors.jenis && <p className="text-red-400 text-[10px] mt-1.5 tracking-widest font-mono uppercase">{vesselErrors.jenis}</p>}
              </div>

              <div>
                <label className="text-[10px] text-gray-400 tracking-widest mb-2 block uppercase">Vessel Code</label>
                <input 
                  type="text"
                  placeholder="e.g. V-001" 
                  value={formData.kode} 
                  onChange={e => { setFormData({...formData, kode: e.target.value}); setVesselErrors(p => ({...p, kode: ''})); }} 
                  className={`w-full bg-[#121016] border rounded-xl p-3 text-white text-sm focus:outline-none transition-colors ${vesselErrors.kode ? 'border-red-500' : 'border-gray-800 focus:border-purple-500'}`} 
                />
                {vesselErrors.kode && <p className="text-red-400 text-[10px] mt-1.5 tracking-widest font-mono uppercase">{vesselErrors.kode}</p>}
              </div>

              <div>
                <label className="text-[10px] text-gray-400 tracking-widest mb-2 block uppercase">Capacity (Tons)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 50000" 
                  value={formData.kapasitas} 
                  onChange={e => { setFormData({...formData, kapasitas: e.target.value}); setVesselErrors(p => ({...p, kapasitas: ''})); }} 
                  className={`w-full bg-[#121016] border rounded-xl p-3 text-white text-sm focus:outline-none transition-colors ${vesselErrors.kapasitas ? 'border-red-500' : 'border-gray-800 focus:border-purple-500'}`} 
                />
                {vesselErrors.kapasitas && <p className="text-red-400 text-[10px] mt-1.5 tracking-widest font-mono uppercase">{vesselErrors.kapasitas}</p>}
              </div>

              <div>
                <label className="text-[10px] text-gray-400 tracking-widest mb-2 block uppercase">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-[#121016] border border-gray-800 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-purple-500">
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="En Route">En Route</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button type="button" onClick={closeModal} className="flex-1 py-3 rounded-xl bg-[#2a2b36] text-white text-sm">Cancel</button>
              <button type="button" onClick={handleSubmit} className="flex-1 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                {isEditing ? "Save Changes" : "Add Vessel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {showDeleteModal && selectedVessel && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0a0e] border border-red-500/30 rounded-2xl w-full max-w-md p-6 shadow-[0_0_40px_rgba(239,68,68,0.15)] relative font-mono">
            <button 
              onClick={() => { setShowDeleteModal(false); setSelectedVessel(null); }} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
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
    {/* TOAST NOTIFICATION */}
    {toast.show && (
      <div className="fixed bottom-6 right-6 z-[999] bg-[#0b0a0e] border border-purple-500/30 rounded-2xl px-5 py-4 min-w-[340px] shadow-[0_0_30px_rgba(147,51,234,0.2)] animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <div>
            <h3 className="text-purple-400 text-[11px] uppercase tracking-[0.25em] font-mono font-bold">
              {toast.title}
            </h3>
            <p className="text-gray-300 text-sm mt-1">
              {toast.message}
            </p>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}