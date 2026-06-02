'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export default function CargoManagementComponent() {
  const [showModal, setShowModal] = useState(false);
  const [cargoList, setCargoList] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cargoData, setCargoData] = useState({
    tanggal_kirim: '', nama_pengirim: '', nama_penerima: '', no_telepon: '',
    kota_asal: '', kota_tujuan: '', jenis_barang: '', berat_barang: '',
    harga_tarif: '', jenis_kendaraan: 'Truck', jenis_pengiriman: 'Biasa',
    status_pengiriman: 'Diproses', deskripsi: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  
  // STATE: Untuk menyimpan data kargo yang sedang dilihat detailnya
  const [detailItem, setDetailItem] = useState<any | null>(null);

  // STATE BARU: Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchCargo = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('cargo').select('*').order('created_at', { ascending: false });
    if (!error) setCargoList(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCargo(); }, []);

  // Reset ke halaman 1 setiap kali melakukan pencarian baru
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await supabase.from('cargo').update({ ...cargoData }).eq('id', editingId);
    } else {
      const newId = 'RESI-' + Math.floor(100000 + Math.random() * 900000);
      await supabase.from('cargo').insert({ id: newId, ...cargoData });
    }
    closeModal();
    fetchCargo();
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setCargoData({
      tanggal_kirim: item.tanggal_kirim, nama_pengirim: item.nama_pengirim,
      nama_penerima: item.nama_penerima, no_telepon: item.no_telepon,
      kota_asal: item.kota_asal, kota_tujuan: item.kota_tujuan,
      jenis_barang: item.jenis_barang, berat_barang: item.berat_barang,
      harga_tarif: item.harga_tarif, jenis_kendaraan: item.jenis_kendaraan,
      jenis_pengiriman: item.jenis_pengiriman, status_pengiriman: item.status_pengiriman,
      deskripsi: item.deskripsi || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      await supabase.from('cargo').delete().eq('id', id);
      fetchCargo();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setCargoData({
      tanggal_kirim: '', nama_pengirim: '', nama_penerima: '', no_telepon: '',
      kota_asal: '', kota_tujuan: '', jenis_barang: '', berat_barang: '',
      harga_tarif: '', jenis_kendaraan: 'Truck', jenis_pengiriman: 'Biasa',
      status_pengiriman: 'Diproses', deskripsi: ''
    });
  };

  const filteredCargo = cargoList.filter((item) =>
    item.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nama_pengirim?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kota_tujuan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.jenis_barang?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // LOGIKA PAGINATION
  const totalPages = Math.ceil(filteredCargo.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCargo = filteredCargo.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 bg-[#0c0a13] rounded-2xl border border-gray-800 animate-fade-in">
      
      {/* HEADER UTAMA */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-white text-xl font-bold font-mono tracking-widest uppercase border-l-4 border-purple-500 pl-4">
          Cargo Management
        </h2>
        <button 
          onClick={() => setShowModal(true)} 
          className="bg-purple-600 px-6 py-3 rounded-xl text-white font-bold tracking-widest hover:bg-purple-500 transition-all"
        >
          + Add Cargo
        </button>
      </div>

      {/* SEARCH BAR */}
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
          placeholder="Search resi, sender, destination, or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-72 bg-[#121016] border border-gray-800 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors placeholder-gray-500 shadow-inner"
        />
      </div>

      <div className="overflow-x-auto min-h-[400px] flex flex-col justify-between">
        <div className="w-full">
          {loading ? (
            <div className="text-gray-500 text-center py-10">Loading...</div>
          ) : cargoList.length === 0 ? (
            <div className="text-gray-500 text-center py-10">Belum ada data cargo.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-[10px] uppercase tracking-widest border-b border-gray-800">
                  <th className="pb-4">Resi</th><th className="pb-4">Pengirim</th>
                  <th className="pb-4">Tujuan</th><th className="pb-4">Jenis</th>
                  <th className="pb-4">Status</th><th className="pb-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-white text-sm">
                {/* Ganti filteredCargo dengan paginatedCargo */}
                {paginatedCargo.map((item) => (
                  <tr key={item.id} className="border-b border-gray-800/50 hover:bg-white/5">
                    <td className="py-4 font-mono text-purple-400">{item.id}</td>
                    <td className="py-4">{item.nama_pengirim}</td>
                    <td className="py-4">{item.kota_tujuan}</td>
                    <td className="py-4">{item.jenis_barang}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                        item.status_pengiriman === 'Diterima' ? 'bg-emerald-600/20 text-emerald-400' :
                        item.status_pengiriman === 'Dikirim' ? 'bg-blue-600/20 text-blue-400' :
                        'bg-yellow-600/20 text-yellow-400'
                      }`}>{item.status_pengiriman}</span>
                    </td>
                    <td className="py-4 text-center flex justify-center gap-2">
                      <button 
                        onClick={() => setDetailItem(item)} 
                        className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-lg text-[10px] font-bold hover:bg-purple-600/40 transition-colors"
                      >
                        DETAIL
                      </button>
                      <button onClick={() => handleEdit(item)} className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-[10px] font-bold hover:bg-blue-600/40">EDIT</button>
                      <button onClick={() => handleDelete(item.id)} className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg text-[10px] font-bold hover:bg-red-600/40">HAPUS</button>
                    </td>
                  </tr>
                ))}
                {paginatedCargo.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-gray-500 text-center py-10 text-sm">
                      Tidak ada data kargo yang cocok dengan pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* PAGINATION CONTROLS */}
        {!loading && filteredCargo.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-800/50 gap-4">
            <span className="text-xs text-gray-500 font-mono">
              Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredCargo.length)} dari {filteredCargo.length} data
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-[#121016] border border-gray-800 rounded-lg text-white text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
              >
                PREV
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                      currentPage === page 
                        ? 'bg-purple-600 text-white' 
                        : 'text-gray-400 hover:bg-gray-800 border border-transparent hover:border-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-[#121016] border border-gray-800 rounded-lg text-white text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
              >
                NEXT
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL FORM: TAMBAH / EDIT CARGO */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c0a13] border border-gray-800 rounded-2xl w-full max-w-2xl p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={closeModal} className="absolute top-6 right-6 text-gray-500 hover:text-white">✕</button>
            <h2 className="text-white text-xl font-bold font-mono mb-6 uppercase border-l-4 border-purple-500 pl-4">{editingId ? "Edit Cargo" : "Tambah Cargo"}</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
              <div className="md:col-span-2">
                <label className="text-[10px] text-gray-500 uppercase mb-2 block">Id Pengiriman / No Resi</label>
                <input disabled value={editingId || "AUTO-GENERATED"} className="w-full bg-[#050505] border border-gray-800 rounded-xl p-4 text-gray-600 font-mono" />
              </div>
              {[
                { label: 'Tanggal Kirim', key: 'tanggal_kirim', type: 'date' },
                { label: 'Nama Pengirim', key: 'nama_pengirim', type: 'text' },
                { label: 'Nama Penerima', key: 'nama_penerima', type: 'text' },
                { label: 'No Telepon', key: 'no_telepon', type: 'text' },
                { label: 'Kota Asal', key: 'kota_asal', type: 'text' },
                { label: 'Kota Tujuan', key: 'kota_tujuan', type: 'text' },
                { label: 'Jenis Barang', key: 'jenis_barang', type: 'text' },
                { label: 'Berat Barang (Kg)', key: 'berat_barang', type: 'number' },
                { label: 'Harga/Tarif', key: 'harga_tarif', type: 'number' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="text-[10px] text-gray-500 uppercase mb-2 block">{label}</label>
                  <input required type={type} value={(cargoData as any)[key]}
                    onChange={(e) => setCargoData({...cargoData, [key]: e.target.value})}
                    className="w-full bg-[#050505] border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500" />
                </div>
              ))}
              {[
                { label: 'Jenis Kendaraan', key: 'jenis_kendaraan', options: ['Truck', 'Pick-up', 'Kontainer'] },
                { label: 'Jenis Pengiriman', key: 'jenis_pengiriman', options: ['Biasa', 'Cepat', 'Vvip'] },
                { label: 'Status', key: 'status_pengiriman', options: ['Diproses', 'Dikirim', 'Diterima'] },
              ].map(({ label, key, options }) => (
                <div key={key}>
                  <label className="text-[10px] text-gray-500 uppercase mb-2 block">{label}</label>
                  <select value={(cargoData as any)[key]}
                    onChange={(e) => setCargoData({...cargoData, [key]: e.target.value})}
                    className="w-full bg-[#050505] border border-gray-800 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500">
                    {options.map(o => <option key={o} className="bg-[#0c0a13]">{o}</option>)}
                  </select>
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="text-[10px] text-gray-500 uppercase mb-2 block">Deskripsi Barang</label>
                <textarea value={cargoData.deskripsi}
                  onChange={(e) => setCargoData({...cargoData, deskripsi: e.target.value})}
                  className="w-full bg-[#050505] border border-gray-800 rounded-xl p-4 text-white h-24 focus:outline-none focus:border-purple-500" />
              </div>
              <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                <button type="button" onClick={closeModal} className="px-8 py-4 rounded-xl border border-gray-800 text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-8 py-4 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500 transition-colors">{editingId ? "UPDATE CARGO" : "SUBMIT CARGO"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL BARU: VIEW DETAILS DI DESIGN SEPERTI DETAIL PENGIRIMAN / RINGKASAN RESI */}
      {detailItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c0a13] border border-gray-800 rounded-2xl w-full max-w-2xl p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setDetailItem(null)} 
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
              ✕
            </button>
            
            <h2 className="text-white text-xl font-bold font-mono mb-6 uppercase border-l-4 border-purple-500 pl-4">
              Detail Pengiriman
            </h2>

            {/* Bagian Ringkasan Resi & Status */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#121016] border border-gray-800/60 p-4 rounded-xl mb-6">
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">No. Resi Pengiriman</span>
                <span className="text-purple-400 font-mono font-bold text-lg">{detailItem.id}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase block mb-1 text-right sm:text-left">Status Kargo</span>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  detailItem.status_pengiriman === 'Diterima' ? 'bg-emerald-600/20 text-emerald-400' :
                  detailItem.status_pengiriman === 'Dikirim' ? 'bg-blue-600/20 text-blue-400' :
                  'bg-yellow-600/20 text-yellow-400'
                }`}>
                  {detailItem.status_pengiriman}
                </span>
              </div>
            </div>

            {/* Rute Perjalanan */}
            <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 bg-[#050505] border border-gray-800 p-4 rounded-xl mb-6 text-center sm:text-left">
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">Kota Asal</span>
                <span className="text-white font-bold text-base">{detailItem.kota_asal}</span>
              </div>
              <div className="flex flex-col items-center justify-center text-purple-500">
                <span className="text-[10px] text-gray-600 uppercase">Rute</span>
                <svg className="w-6 h-6 hidden sm:block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <span className="sm:hidden font-bold">↓</span>
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] text-gray-500 uppercase block">Kota Tujuan</span>
                <span className="text-white font-bold text-base">{detailItem.kota_tujuan}</span>
              </div>
            </div>

            {/* Informasi Pengirim & Penerima */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#121016] border border-gray-800 p-6 rounded-xl mb-6">
              <div>
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-3 border-b border-gray-800 pb-1">Data Pengirim</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Nama:</span> <span className="text-white font-medium">{detailItem.nama_pengirim}</span></p>
                  <p><span className="text-gray-500">Tanggal Kirim:</span> <span className="text-white font-mono">{detailItem.tanggal_kirim}</span></p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-3 border-b border-gray-800 pb-1">Data Penerima</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Nama:</span> <span className="text-white font-medium">{detailItem.nama_penerima}</span></p>
                  <p><span className="text-gray-500">No. Telepon:</span> <span className="text-white font-mono">{detailItem.no_telepon}</span></p>
                </div>
              </div>
            </div>

            {/* Spesifikasi & Tarif Barang */}
            <div className="bg-[#050505] border border-gray-800 rounded-xl p-6 mb-6">
              <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-4 border-b border-gray-800 pb-1">Spesifikasi & Logistik</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase">Jenis Barang</span>
                  <span className="text-white font-medium">{detailItem.jenis_barang}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase">Berat Barang</span>
                  <span className="text-white font-medium">{detailItem.berat_barang} Kg</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase">Jenis Kendaraan</span>
                  <span className="text-white font-medium">{detailItem.jenis_kendaraan}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px] uppercase">Jenis Pengiriman</span>
                  <span className="text-white font-medium">{detailItem.jenis_pengiriman}</span>
                </div>
                <div className="col-span-2 sm:col-span-2">
                  <span className="text-gray-500 block text-[10px] uppercase">Harga / Tarif</span>
                  <span className="text-emerald-400 font-bold text-base">
                    Rp {Number(detailItem.harga_tarif).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            {/* Deskripsi Barang */}
            <div className="bg-[#121016] border border-gray-800 rounded-xl p-4 mb-6">
              <span className="text-[10px] text-gray-500 uppercase block mb-1">Deskripsi Barang</span>
              <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                {detailItem.deskripsi || <span className="text-gray-600 italic">Tidak ada deskripsi barang.</span>}
              </p>
            </div>

            {/* Tombol Tutup */}
            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={() => setDetailItem(null)} 
                className="px-6 py-3 rounded-xl bg-gray-800 text-white font-bold hover:bg-gray-700 transition-colors text-sm"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}