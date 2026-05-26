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

  const fetchCargo = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('cargo').select('*').order('created_at', { ascending: false });
    if (!error) setCargoList(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCargo(); }, []);

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

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex justify-end mb-6">
        <button onClick={() => setShowModal(true)} className="px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold tracking-widest shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all">
          + ADD CARGO
        </button>
      </div>

      <div className="bg-[#0c0a13] border border-gray-800/60 rounded-2xl p-8 shadow-2xl">
        <h3 className="text-white font-bold mb-6 font-mono tracking-widest uppercase">Data Cargo</h3>
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
              {cargoList.map((item) => (
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
                    <button onClick={() => handleEdit(item)} className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg text-[10px] font-bold hover:bg-blue-600/40">EDIT</button>
                    <button onClick={() => handleDelete(item.id)} className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg text-[10px] font-bold hover:bg-red-600/40">HAPUS</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c0a13] border border-gray-800 rounded-2xl w-full max-w-2xl p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={closeModal} className="absolute top-6 right-6 text-gray-500">✕</button>
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
                    className="w-full bg-[#050505] border border-gray-800 rounded-xl p-4 text-white" />
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
                    className="w-full bg-[#050505] border border-gray-800 rounded-xl p-4 text-white">
                    {options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="text-[10px] text-gray-500 uppercase mb-2 block">Deskripsi Barang</label>
                <textarea value={cargoData.deskripsi}
                  onChange={(e) => setCargoData({...cargoData, deskripsi: e.target.value})}
                  className="w-full bg-[#050505] border border-gray-800 rounded-xl p-4 text-white h-24" />
              </div>
              <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                <button type="button" onClick={closeModal} className="px-8 py-4 rounded-xl border border-gray-800 text-gray-400">Cancel</button>
                <button type="submit" className="px-8 py-4 rounded-xl bg-purple-600 text-white font-bold">{editingId ? "UPDATE CARGO" : "SUBMIT CARGO"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}