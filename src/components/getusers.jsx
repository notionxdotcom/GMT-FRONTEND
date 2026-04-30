import React, { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, User, Wallet, MoreVertical, ExternalLink } from 'lucide-react';
import api from '../../interceptor';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0
  });

  const fetchUsers = useCallback(async (page = 1, query = "") => {
    setLoading(true);
    try {
      const response = await api.get(`user/users?page=${page}&limit=10&search=${query}`);
      const result = response.data;

      if (result.status === "success") {
        setUsers(result.data);
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(pagination.currentPage, search);
  }, [pagination.currentPage, fetchUsers]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchUsers(1, search);
  };

  return (
    <div className="p-6 bg-[#F8FAFC] min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">User Management</h1>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Control and Monitor GMT Members</p>
          </div>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative flex items-center group">
            <input
              type="text"
              placeholder="Search phone number..."
              className="pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-72 shadow-sm transition-all group-hover:border-slate-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 text-slate-400" size={18} />
            <button type="submit" className="hidden">Search</button>
          </form>
        </div>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 flex items-center gap-5">
            <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
              <User size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Members</p>
              <p className="text-2xl font-black text-slate-800">{pagination.totalUsers.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Users Table Container */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-50">
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Details</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Wallet Balance</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined Date</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">Syncing Member Data...</p>
                      </div>
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.user_id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="p-5">
                        <div className="font-black text-slate-800 text-[14px]">{user.phone_number}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{user.user_id}</div>
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                          user.role === 'admin' 
                            ? 'bg-purple-50 text-purple-600' 
                            : 'bg-blue-50 text-blue-600'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-slate-700 font-black text-[14px]">
                          <Wallet size={14} className="text-slate-300" />
                          ₦{parseFloat(user.balance || 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="p-5 text-slate-500 text-[12px] font-medium">
                        {new Date(user.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </td>
                      <td className="p-5 text-right">
                        <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-blue-600">
                          <ExternalLink size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                      No matching records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
            <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest">
              Page {pagination.currentPage} <span className="mx-1 text-slate-200">/</span> {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={pagination.currentPage === 1 || loading}
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                className="p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronLeft size={18} className="text-slate-600" />
              </button>
              <button
                disabled={pagination.currentPage === pagination.totalPages || loading}
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                className="p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronRight size={18} className="text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;