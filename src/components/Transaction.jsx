import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../interceptor';

const TransactionScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [actionLoading, setActionLoading] = useState(null); // Tracks which ID is being processed

  const fetchTransactions = async (page = 1) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/wallet/pending-deposits?page=${page}&limit=10`);
      setTransactions(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAction = async (id, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this transaction?`)) return;
    
    try {
      setActionLoading(id);
      // Ensure these endpoints match your backend routes
      const endpoint = action === 'approve' 
        ? `/wallet/approve-deposit/${id}` 
        : `/wallet/reject-deposit/${id}`;
      
      await api.post(endpoint);
      
      // Refresh list after success
      fetchTransactions(pagination.currentPage);
      alert(`Transaction ${action}d successfully`);
    } catch (err) {
      alert(err.response?.data?.message || `Error during ${action}`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Transaction Approvals</h2>
          <p className="text-slate-500 font-medium">Review and manage pending financial movements.</p>
        </div>
      </div>

      {/* Stats Section - Values can be derived from your meta data if available */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        <StatCard label="Pending Volume" value={`₦${transactions.reduce((acc, curr) => acc + parseFloat(curr.amount), 0).toLocaleString()}`} trend="Current page volume" color="text-slate-900" />
        <StatCard label="Queue Count" value={`${pagination.totalItems || 0} Items`} trend="Total pending" color="text-slate-600" />
        <StatCard label="Platform Status" value="Online" trend="System operational" color="text-emerald-500" />
        <StatCard label="Current Page" value={pagination.currentPage} trend={`of ${pagination.totalPages}`} color="text-blue-600" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User / Entity</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="py-20 text-center">
                  <Loader2 className="animate-spin mx-auto text-slate-300" size={32} />
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-20 text-center text-slate-400 font-medium">No pending transactions found.</td>
              </tr>
            ) : (
              transactions.map((txn) => (
                <TransactionRow 
                  key={txn.id} 
                  txn={txn} 
                  onAction={handleAction} 
                  isProcessing={actionLoading === txn.id}
                />
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
           <p className="text-xs text-slate-500 font-bold">
             Page {pagination.currentPage} of {pagination.totalPages}
           </p>
           <div className="flex gap-2">
             <button 
               onClick={() => fetchTransactions(pagination.currentPage - 1)}
               disabled={pagination.currentPage === 1 || loading}
               className="p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50"
             >
               <ChevronLeft size={16} className="text-slate-600" />
             </button>
             <button 
               onClick={() => fetchTransactions(pagination.currentPage + 1)}
               disabled={pagination.currentPage === pagination.totalPages || loading}
               className="p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50"
             >
               <ChevronRight size={16} className="text-slate-600" />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};
const TransactionRow = ({ txn, onAction, isProcessing }) => (
  <tr className="hover:bg-slate-50/50 transition cursor-default">
    <td className="px-6 py-5">
      <p className="text-[10px] text-slate-400 font-mono">{txn.phone_number}</p>
    </td>
    <td className="px-6 py-5">
      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-1 text-[10px] font-black tracking-tighter text-emerald-600 uppercase">
          <ArrowDownLeft size={12}/> DEPOSIT
        </span>
        {/* Added Status Badge to show who actually paid */}
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full w-fit ${
          txn.status === 'processing' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
        }`}>
          {txn.status === 'processing' ? 'PAID / AWAITING' : 'INITIALIZED'}
        </span>
      </div>
    </td>
    <td className="px-6 py-5 font-black text-lg text-slate-900">₦{parseFloat(txn.amount).toLocaleString()}</td>
    <td className="px-6 py-5 text-xs font-mono text-slate-500 font-bold uppercase">
      {txn.reference}
    </td>
    <td className="px-6 py-5 flex justify-center gap-2">
      <button 
        onClick={() => onAction(txn.ledger_id, 'approve')}
        // Disable Approve if user hasn't clicked "I Have Paid" (still pending)
        disabled={isProcessing || txn.status === 'pending'}
        className={`px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all ${
          txn.status === 'pending' 
            ? 'bg-slate-300 cursor-not-allowed' 
            : 'bg-emerald-600 hover:bg-emerald-700 shadow-md active:scale-95'
        }`}
      >
        {isProcessing ? '...' : 'Approve'}
      </button>
      <button 
        onClick={() => onAction(txn.ledger_id, 'reject')}
        disabled={isProcessing}
        className="px-4 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 disabled:opacity-50"
      >
        Reject
      </button>
    </td>
  </tr>
);

const StatCard = ({ label, value, trend, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <p className={`text-2xl font-black mt-2 ${color}`}>{value}</p>
    <p className="text-[10px] text-slate-400 font-bold mt-1">{trend}</p>
  </div>
);

export default TransactionScreen;