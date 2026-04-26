import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter,
  Calendar,
  Wallet
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../interceptor';

const TransactionHistory = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/user/ledger');
        setTransactions(response.data.data || []);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Filter logic for search bar
  const filteredTransactions = transactions.filter(tx => 
    tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-gray-100 rounded-full transition-all"
          >
            <ArrowLeft size={24} className="text-gray-800" />
          </button>
          <h1 className="text-xl font-black text-gray-900">Transaction History</h1>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search transactions..."
            className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#006B5E]/20 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="px-6 mt-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-emerald-100 border-t-[#006B5E] rounded-full animate-spin"></div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Loading Ledger...</p>
          </div>
        ) : filteredTransactions.length > 0 ? (
          <div className="space-y-4">
            {filteredTransactions.map((tx) => {
              // Determine if it's a credit or debit (fintech style)
              const isCredit = ['deposit', 'referral_commission'].includes(tx.entry_type?.toLowerCase());
              
              return (
                <div key={tx.id} className="bg-white p-4 rounded-2xl border border-gray-50 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all">
                  <div className="flex items-center gap-4">
                    {/* Dynamic Icon based on type */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {isCredit ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    
                    <div>
                      <p className="font-bold text-gray-900 text-sm capitalize">
                        {tx.entry_type?.replace('_', ' ')}
                      </p>
                      <p className="text-[11px] text-gray-400 font-medium truncate max-w-[150px]">
                        {tx.description || 'No description'}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-gray-300 mt-0.5">
                        <Calendar size={10} />
                        <span>{new Date(tx.created_at).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`font-black text-sm ${isCredit ? 'text-emerald-600' : 'text-gray-900'}`}>
                      {isCredit ? '+' : '-'}₦{parseFloat(tx.amount).toLocaleString()}
                    </p>
                    <p className={`text-[9px] font-bold px-2 py-0.5 rounded-md inline-block mt-1 uppercase tracking-tighter ${
                      tx.status === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {tx.status}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
              <Wallet className="text-gray-200" size={40} />
            </div>
            <p className="text-gray-400 font-medium">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;