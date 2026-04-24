import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, XCircle, Loader2, Landmark, User, 
  RefreshCw, ChevronLeft, ChevronRight, AlertCircle 
} from 'lucide-react';
import api from '../../interceptor';

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10
  });
  
  const [statusFilter, setStatusFilter] = useState('pending');

  const fetchWithdrawals = async (page = 1) => {
    setLoading(true);
    try {
      // The API now returns bank details joined with the withdrawal record
      const response = await api.get(`wallet/withdrawals?status=${statusFilter}&page=${page}&limit=${pagination.limit}`);
      setWithdrawals(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals(pagination.currentPage);
  }, [pagination.currentPage, statusFilter]);

  const handleAction = async (id, action) => {
    const confirmAction = window.confirm(`Are you sure you want to ${action} this withdrawal?`);
    if (!confirmAction) return;

    setProcessingId(id);
    try {
      const endpoint = action === 'approve' 
        ? `wallet/approve-withdrawal/${id}` 
        : `wallet/reject-withdrawal/${id}`;
      
      await api.post(endpoint);
      
      // Auto-refresh to reflect updated counts and list
      fetchWithdrawals(pagination.currentPage);
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Withdrawal Management</h1>
            <p className="text-gray-500 text-sm">Review and process user payout requests</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
              {['pending', 'completed', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setPagination(prev => ({ ...prev, currentPage: 1 }));
                  }}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold capitalize transition-all ${
                    statusFilter === status 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <button 
              onClick={() => fetchWithdrawals(pagination.currentPage)}
              className="p-2.5 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition shadow-sm"
            >
              <RefreshCw size={20} className={`${loading ? "animate-spin" : ""} text-gray-600`} />
            </button>
          </div>
        </div>

        {/* Main List */}
        {loading ? (
          <div className="flex h-96 items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Loader2 className="animate-spin text-green-600" size={40} />
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="bg-white py-24 text-center rounded-3xl border border-dashed border-gray-200">
            <Landmark size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium text-lg">No {statusFilter} requests to display</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {withdrawals.map((req) => (
                <div key={req.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
                  
                  {/* User Identity */}
                  <div className="flex items-center gap-4 w-full lg:w-1/4">
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 shrink-0">
                      <User size={24} />
                    </div>
                    <div className="truncate">
                      <h3 className="font-bold text-gray-900 truncate">{req.full_name || 'NOTIONX User'}</h3>
                      <p className="text-sm text-gray-500 font-medium">{req.phone_number}</p>
                    </div>
                  </div>

                  {/* Beneficiary Bank Details (The joined data) */}
                  <div className="w-full lg:w-1/3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-1">
                      <Landmark size={16} className="text-green-600" />
                      {req.bank_name || 'Bank Not Set'}
                    </div>
                    {req.account_number ? (
                      <div className="ml-6">
                        <p className="text-sm text-gray-600 font-mono tracking-widest">{req.account_number}</p>
                        <p className="text-[10px] uppercase font-black text-gray-400 mt-1 tracking-tighter">
                          Beneficiary: {req.account_name}
                        </p>
                      </div>
                    ) : (
                      <div className="ml-6 flex items-center gap-1 text-xs text-red-500 font-medium">
                        <AlertCircle size={12} /> Missing Bank Details
                      </div>
                    )}
                  </div>

                  {/* Financials & Logic */}
                  <div className="flex flex-col items-end gap-3 w-full lg:w-auto">
                    <div className="text-2xl font-black text-gray-900">
                      ₦{parseFloat(req.amount).toLocaleString()}
                    </div>
                    
                    {statusFilter === 'pending' ? (
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          disabled={processingId === req.id}
                          onClick={() => handleAction(req.id, 'reject')}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-bold transition disabled:opacity-50"
                        >
                          <XCircle size={18} /> Reject
                        </button>
                        <button
                          disabled={processingId === req.id || !req.account_number}
                          onClick={() => handleAction(req.id, 'approve')}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-white bg-green-600 hover:bg-green-700 rounded-xl font-bold shadow-lg shadow-green-100 transition disabled:opacity-50"
                        >
                          {processingId === req.id ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                          Pay Now
                        </button>
                      </div>
                    ) : (
                      <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        statusFilter === 'completed' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {statusFilter}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Footer */}
            <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                Page <span className="font-bold text-gray-900">{pagination.currentPage}</span> of {pagination.totalPages}
              </p>
              
              <div className="flex items-center gap-1">
                <button
                  disabled={pagination.currentPage === 1}
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  className="p-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-20 transition"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <button
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  className="p-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-20 transition"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminWithdrawals;