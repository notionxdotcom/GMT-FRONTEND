import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Calendar,
  Wallet,
  ShieldCheck,
  Clock
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
        console.error("GMT Ledger Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Filter logic for search bar
  const filteredTransactions = transactions.filter(tx => 
    tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.entry_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
      {/* Header - GMT Blue Branding */}
      <div className="bg-white px-6 pt-12 pb-6 sticky top-0 z-10 border-b border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2.5 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100"
            >
              <ArrowLeft size={22} className="text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Ledger Books</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master Transaction Log</p>
            </div>
          </div>
          <ShieldCheck className="text-blue-600/20" size={24} />
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search by type or description..."
            className="w-full bg-slate-50 border-2 border-transparent rounded-[1.25rem] py-3.5 pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-blue-600/10 transition-all outline-none text-slate-700"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="px-6 mt-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Synchronizing Nodes...</p>
          </div>
        ) : filteredTransactions.length > 0 ? (
          <div className="space-y-4">
            {filteredTransactions.map((tx) => {
              const isCredit = ['deposit', 'referral_commission', "welcomebonus",  'investment_return'].includes(tx.entry_type?.toLowerCase());
              
              return (
                <div key={tx.id} className="bg-white p-5 rounded-[2rem] border border-slate-50 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all hover:border-blue-100">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                      isCredit ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' : 'bg-slate-50 text-slate-400'
                    }`}>
                      {isCredit ? <ArrowDownLeft size={22} /> : <ArrowUpRight size={22} />}
                    </div>
                    
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-tighter bg-blue-50 px-2 py-0.5 rounded-md inline-block mb-1 group-hover:bg-blue-100 transition-colors">
                        {tx.entry_type?.replace('_', ' ')}
                      </p>
                      <p className="font-black text-slate-800 text-sm tracking-tight leading-tight">
                        {tx.description || 'System Entry'}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">
                        <Clock size={10} />
                        <span>{new Date(tx.created_at).toLocaleDateString()} • {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`font-black text-base tracking-tight ${isCredit ? 'text-blue-600' : 'text-slate-900'}`}>
                      {isCredit ? '+' : '-'}₦{parseFloat(tx.amount).toLocaleString()}
                    </p>
                    <p className={`text-[9px] font-black px-2.5 py-1 rounded-lg inline-block mt-2 uppercase tracking-widest ${
                      tx.status === 'success' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {tx.status}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-6 transform rotate-12 border border-slate-100">
              <Wallet className="text-slate-200" size={40} />
            </div>
            <h3 className="text-slate-900 font-black text-lg">No Records Found</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2 max-w-[200px]">Adjust your search to find specific logs</p>
          </div>
        )}
      </div>

      <div className="text-center py-10">
        <p className="text-[9px] font-black text-slate-200 uppercase tracking-[0.4em]">GMT Financial Core</p>
      </div>
    </div>
  );
};

export default TransactionHistory;