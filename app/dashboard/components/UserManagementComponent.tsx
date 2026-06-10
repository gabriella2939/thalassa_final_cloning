'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

interface Profile {
  user_id: number;
  user_name: string;
  user_email: string;
  user_role: 'Admin' | 'Operator';
}

export default function UserManagementComponent() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Operator', password: '' });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // ERROR STATES
  const [addErrors, setAddErrors] = useState({ name: '', email: '', password: '' });
  const [editErrors, setEditErrors] = useState({ name: '' });
  const [pwErrors, setPwErrors] = useState({ newPassword: '', confirmPassword: '' });
  const [globalError, setGlobalError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');

  // PAGINATION STATES & CONSTANTS
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('User')
      .select('*')
      .order('user_id', { ascending: true });

    if (!error) {
      setUsers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try { setCurrentUser(JSON.parse(savedUser)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleAddUser = async () => {
    const errors = { name: '', email: '', password: '' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // VALIDASI SAAT DIKLIK
    if (!formData.name.trim()) errors.name = 'Name is required.';
    if (!formData.email.trim()) errors.email = 'Email is required.';
    else if (!emailRegex.test(formData.email)) errors.email = 'Enter a valid email address.';

    if (!formData.password) errors.password = 'Password is required.';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters.';

    setAddErrors(errors);
    if (errors.name || errors.email || errors.password) return;

    setActionLoading(true);
    const { error } = await supabase
      .from('User')
      .insert([{
        user_name: formData.name,
        user_email: formData.email,
        user_password: formData.password,
        user_role: formData.role,
      }]);

    if (error) {
      setAddErrors(prev => ({ ...prev, email: 'This email may already be in use.' }));
      setActionLoading(false);
      return;
    }

    setActionLoading(false);
    fetchUsers();
    setShowAddModal(false);
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;
    
    // VALIDASI EDIT SAAT DIKLIK
    if (!formData.name.trim()) {
      setEditErrors({ name: 'Name is required.' });
      return;
    }

    setActionLoading(true);
    const { error } = await supabase
      .from('User')
      .update({
        user_name: formData.name,
        user_role: formData.role,
      })
      .eq('user_id', selectedUser.user_id);

    if (error) {
      console.error("Error saat edit:", error);
      setGlobalError(error.message);
    } else {
      setShowEditModal(false);
      fetchUsers();
    }
    setActionLoading(false);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    
    const { error } = await supabase
      .from('User')
      .delete()
      .eq('user_id', selectedUser.user_id);

    if (error) {
      console.error("Error saat delete:", error);
      setGlobalError(error.message);
    } else {
      setShowDeleteModal(false);
      fetchUsers();
    }
    setActionLoading(false);
  };

  const handleChangePassword = async () => {
    const errors = { newPassword: '', confirmPassword: '' };

    // VALIDASI PASSWORD SAAT DIKLIK
    if (!newPassword) errors.newPassword = 'New password is required.';
    else if (newPassword.length < 6) errors.newPassword = 'Password must be at least 6 characters.';

    if (!confirmPassword) errors.confirmPassword = 'Please confirm your password.';
    else if (newPassword !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';

    setPwErrors(errors);
    if (errors.newPassword || errors.confirmPassword) return;

    setActionLoading(true);
    const { error } = await supabase
      .from('User')
      .update({ user_password: newPassword })
      .eq('user_id', selectedUser?.user_id);

    if (error) {
      setPwErrors(prev => ({ ...prev, newPassword: error.message }));
    } else {
      setShowPasswordModal(false);
      setNewPassword('');
      setConfirmPassword('');
      fetchUsers();
    }
    setActionLoading(false);
  };

  const openEdit = (user: Profile) => {
    setSelectedUser(user);
    setFormData({ 
      name: user.user_name,
      email: user.user_email,
      role: user.user_role,
      password: '',
    });
    setEditErrors({ name: '' });
    setGlobalError('');
    setShowEditModal(true);
  };

  const totalUsers = users.length;
  const admins = users.filter(u => u.user_role === 'Admin').length;
  const operators = users.filter(u => u.user_role === 'Operator').length;

  const filteredUsers = users.filter((user) =>
    user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="animate-fade-in text-white w-full font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.4)]">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-wide">User Management</h2>
            <p className="text-gray-400 text-sm mt-1">Manage system users and access levels</p>
          </div>
        </div>
        <button
          onClick={() => { setFormData({ name: '', email: '', role: 'Operator', password: '' }); setAddErrors({ name: '', email: '', password: '' }); setGlobalError(''); setShowAddModal(true); }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-medium shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all"
        >
          <span className="text-xl leading-none mt-[-2px]">+</span> Add User
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Users', value: totalUsers, color: 'white' },
          { label: 'Administrators', value: admins, color: 'purple' },
          { label: 'Operators', value: operators, color: 'blue' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#120e1c] border border-purple-500/20 rounded-2xl p-6 flex justify-between items-center">
            <div>
              <div className="text-xs text-gray-400 mb-1">{label}</div>
              <div className={`text-3xl font-bold text-${color}-300`}>{value}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-[#0b0a0e] border border-gray-800/60 rounded-2xl overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border-b border-gray-800/60 gap-4 sm:gap-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <h3 className="text-xs font-bold tracking-widest text-purple-400 uppercase font-mono whitespace-nowrap">
              System Users
            </h3>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-72 bg-[#121016] border border-gray-800 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors placeholder-gray-500 shadow-inner"
              />
            </div>
          </div>
          <span className="text-xs text-gray-500 font-mono self-end sm:self-auto">
            {filteredUsers.length} records
          </span>
        </div>
        
        {loading ? (
          <div className="text-gray-500 text-center py-10">Loading...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800/60 text-[10px] font-bold tracking-widest text-purple-400 uppercase font-mono bg-[#0d0a14]">
                    <th className="p-5">Name</th>
                    <th className="p-5">Email</th>
                    <th className="p-5">Role</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr key={user.user_id} className="border-b border-gray-800/40 hover:bg-[#12101a] transition-colors">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${user.user_role === 'Admin' ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'bg-blue-500/20 border-blue-500/50 text-blue-300'}`}>
                            {user.user_role === 'Admin' ? (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                            ) : (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                            )}
                          </div>
                          <span className="font-medium text-sm text-gray-200">{user.user_name}</span>
                          {user.user_id === currentUser?.user_id && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">You</span>
                          )}
                        </div>
                      </td>
                      <td className="p-5 text-sm text-gray-400">{user.user_email}</td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider font-mono border ${
                          user.user_role === 'Admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        }`}>{user.user_role}</span>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEdit(user)} className="p-2 rounded-lg bg-[#121016] border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button onClick={() => { setSelectedUser(user); setPwErrors({ newPassword: '', confirmPassword: '' }); setShowPasswordModal(true); }} className="p-2 rounded-lg bg-[#121016] border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                          </button>
                          {user.user_id !== currentUser?.user_id && (
                            <button onClick={() => { setSelectedUser(user); setGlobalError(''); setShowDeleteModal(true); }} className="p-2 rounded-lg bg-[#121016] border border-gray-800 hover:border-red-500/50 hover:text-red-400 text-gray-400 transition-colors">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginatedUsers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-5 text-center text-sm text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* CONTROLS PAGINATION */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-5 border-t border-gray-800/60 bg-[#0d0a14] gap-4 sm:gap-0 text-sm text-gray-400">
              <div className="text-xs sm:text-sm">
                Showing{' '}
                <span className="text-white font-medium">
                  {filteredUsers.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}
                </span>{' '}
                to{' '}
                <span className="text-white font-medium">
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}
                </span>{' '}
                of <span className="text-white font-medium">{filteredUsers.length}</span> records
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-xl bg-[#121016] border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-colors ${
                      currentPage === page
                        ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(147,51,234,0.15)]'
                        : 'bg-[#121016] border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 py-1.5 rounded-xl bg-[#121016] border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0a0e] border border-purple-500/30 rounded-2xl w-full max-w-md p-6 shadow-[0_0_40px_rgba(139,92,246,0.15)] relative font-mono">
            <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-xl font-bold text-purple-400 mb-6">Add New User</h2>

            <div className="space-y-4">
              {/* NAME */}
              <div>
                <label className="text-[10px] text-gray-400 tracking-widest mb-2 block uppercase">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => { setFormData({...formData, name: e.target.value}); setAddErrors(p => ({...p, name: ''})); }}
                  className={`w-full bg-[#121016] border rounded-xl p-3 text-white text-sm focus:outline-none transition-colors ${addErrors.name ? 'border-red-500' : 'border-gray-800 focus:border-purple-500'}`}
                />
                {addErrors.name && <p className="text-red-400 text-[10px] mt-1.5 tracking-widest font-mono uppercase">{addErrors.name}</p>}
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-[10px] text-gray-400 tracking-widest mb-2 block uppercase">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => { setFormData({...formData, email: e.target.value}); setAddErrors(p => ({...p, email: ''})); }}
                  className={`w-full bg-[#121016] border rounded-xl p-3 text-white text-sm focus:outline-none transition-colors ${addErrors.email ? 'border-red-500' : 'border-gray-800 focus:border-purple-500'}`}
                />
                {addErrors.email && <p className="text-red-400 text-[10px] mt-1.5 tracking-widest font-mono uppercase">{addErrors.email}</p>}
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-[10px] text-gray-400 tracking-widest mb-2 block uppercase">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={e => { setFormData({...formData, password: e.target.value}); setAddErrors(p => ({...p, password: ''})); }}
                  className={`w-full bg-[#121016] border rounded-xl p-3 text-white text-sm focus:outline-none transition-colors ${addErrors.password ? 'border-red-500' : 'border-gray-800 focus:border-purple-500'}`}
                />
                {addErrors.password && <p className="text-red-400 text-[10px] mt-1.5 tracking-widest font-mono uppercase">{addErrors.password}</p>}
              </div>

              {/* ROLE */}
              <div>
                <label className="text-[10px] text-gray-400 tracking-widest mb-2 block uppercase">Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-[#121016] border border-gray-800 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-purple-500">
                  <option value="Operator">Operator</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 rounded-xl bg-[#2a2b36] text-white text-sm">Cancel</button>
              {/* BUTTON TETAP AKTIF, TIDAK DISABLED */}
              <button 
                onClick={handleAddUser} 
                className="flex-1 py-3 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-medium text-sm transition-all"
              >
                {actionLoading ? 'Adding...' : 'Add User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0a0e] border border-purple-500/30 rounded-2xl w-full max-w-md p-6 shadow-[0_0_40px_rgba(139,92,246,0.15)] relative font-mono">
            <button onClick={() => setShowEditModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-xl font-bold text-purple-400 mb-6">Edit User</h2>
            
            {globalError && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono uppercase">{globalError}</div>}
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-gray-400 tracking-widest mb-2 block uppercase">Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => { setFormData({...formData, name: e.target.value}); setEditErrors({name: ''}); }}
                  className={`w-full bg-[#121016] border rounded-xl p-3 text-white text-sm focus:outline-none transition-colors ${editErrors.name ? 'border-red-500' : 'border-gray-800 focus:border-purple-500'}`} 
                />
                {editErrors.name && <p className="text-red-400 text-[10px] mt-1.5 tracking-widest font-mono uppercase">{editErrors.name}</p>}
              </div>
              <div>
                <label className="text-[10px] text-gray-400 tracking-widest mb-2 block uppercase">Email</label>
                <input type="email" disabled value={formData.email}
                  className="w-full bg-[#121016] border border-gray-800 rounded-xl p-3 text-gray-500 text-sm cursor-not-allowed" />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 tracking-widest mb-2 block uppercase">Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-[#121016] border border-gray-800 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-purple-500">
                  <option value="Operator">Operator</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowEditModal(false)} className="flex-1 py-3 rounded-xl bg-[#2a2b36] text-white text-sm">Cancel</button>
              {/* BUTTON TETAP AKTIF, TIDAK DISABLED */}
              <button 
                onClick={handleEditUser} 
                className="flex-1 py-3 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-medium text-sm transition-all"
              >
                {actionLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0a0e] border border-red-500/30 rounded-2xl w-full max-w-md p-6 shadow-[0_0_40px_rgba(239,68,68,0.15)] relative font-mono">
            <button onClick={() => setShowDeleteModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-xl font-bold text-red-400 mb-4">Confirm Delete</h2>
            {globalError && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono uppercase">{globalError}</div>}
            <p className="text-gray-300 text-sm mb-8">Delete user <span className="text-white font-bold">{selectedUser.user_name}</span>? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 rounded-xl bg-[#2a2b36] text-white text-sm">Cancel</button>
              <button onClick={handleDeleteUser} disabled={actionLoading} className="flex-1 py-3 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white font-medium text-sm disabled:opacity-50">
                {actionLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PASSWORD MODAL */}
      {showPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0a0e] border border-purple-500/30 rounded-2xl w-full max-w-md p-6 shadow-[0_0_40px_rgba(139,92,246,0.15)] relative font-mono">
            <button onClick={() => setShowPasswordModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-xl font-bold text-purple-400 mb-2">Change Password</h2>
            <p className="text-xs text-gray-500 mb-4">User: <span className="text-gray-300">{selectedUser.user_name}</span></p>

            <div className="space-y-4">
              {/* NEW PASSWORD */}
              <div>
                <label className="text-[10px] text-gray-400 tracking-widest mb-2 block uppercase">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => { setNewPassword(e.target.value); setPwErrors(p => ({...p, newPassword: ''})); }}
                  placeholder="••••••••"
                  className={`w-full bg-[#121016] border rounded-xl p-3 text-white text-sm focus:outline-none transition-colors ${pwErrors.newPassword ? 'border-red-500' : 'border-gray-800 focus:border-purple-500'}`}
                />
                {pwErrors.newPassword && <p className="text-red-400 text-[10px] mt-1.5 tracking-widest font-mono uppercase">{pwErrors.newPassword}</p>}
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="text-[10px] text-gray-400 tracking-widest mb-2 block uppercase">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setPwErrors(p => ({...p, confirmPassword: ''})); }}
                  placeholder="••••••••"
                  className={`w-full bg-[#121016] border rounded-xl p-3 text-white text-sm focus:outline-none transition-colors ${pwErrors.confirmPassword ? 'border-red-500' : 'border-gray-800 focus:border-purple-500'}`}
                />
                {pwErrors.confirmPassword && <p className="text-red-400 text-[10px] mt-1.5 tracking-widest font-mono uppercase">{pwErrors.confirmPassword}</p>}
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowPasswordModal(false)} className="flex-1 py-3 rounded-xl bg-[#2a2b36] text-white text-sm">Cancel</button>
              {/* BUTTON TETAP AKTIF, TIDAK DISABLED */}
              <button 
                onClick={handleChangePassword} 
                className="flex-1 py-3 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-medium text-sm transition-all"
              >
                {actionLoading ? 'Saving...' : 'Save Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}