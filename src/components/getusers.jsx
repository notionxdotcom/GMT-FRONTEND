import React, { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, User, Wallet } from 'lucide-react';
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
      // Adjust the URL to match your backend route
      const response = await api.get(`user/users?page=${page}&limit=10&search=${query}`);
      const result = await response.data

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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              placeholder="Search phone number..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 text-gray-400 size={18}" />
            <button type="submit" className="hidden">Search</button>
          </form>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600"><User /></div>
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-xl font-bold">{pagination.totalUsers}</p>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-bottom border-gray-100">
                  <th className="p-4 font-semibold text-gray-600">User Details</th>
                  <th className="p-4 font-semibold text-gray-600">Role</th>
                  <th className="p-4 font-semibold text-gray-600">Wallet Balance</th>
                  <th className="p-4 font-semibold text-gray-600 text-right">Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-gray-400">Loading users...</td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.user_id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-gray-800">{user.phone_number}</div>
                        <div className="text-xs text-gray-400">{user.user_id}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-700 font-semibold">
                          <Wallet size={16} className="text-gray-400" />
                          ₦{parseFloat(user.balance || 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="p-4 text-right text-gray-500 text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-gray-400">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <p className="text-sm text-gray-500">
              Showing page {pagination.currentPage} of {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={pagination.currentPage === 1 || loading}
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                className="p-2 border rounded bg-white hover:bg-gray-50 disabled:opacity-50 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                disabled={pagination.currentPage === pagination.totalPages || loading}
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                className="p-2 border rounded bg-white hover:bg-gray-50 disabled:opacity-50 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;