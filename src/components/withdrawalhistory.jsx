import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Clock, ShieldCheck, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../interceptor';

const WithdrawalHistory = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/user/ledger');
        // Filter strictly for withdrawals
        const withdrawals = (res.data.data || []).filter(tx => 
          tx.entry_type?.toLowerCase().trim() === 'withdrawal'
        );
        setData(withdrawals);
      } catch (err) {
        console.error("GMT Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header - GMT Blue Branding */}
      <header className="bg-white p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2.5 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100"
          >
            <ArrowLeft size={22} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">Payout Logs</h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1.5">Asset Distributions</p>
          </div>
        </div>
        <ShieldCheck className="text-blue-600/20" size={24} />
      </header>

      <div className="p-6 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Querying Node...</p>
          </div>
        ) : data.length > 0 ? (
          data.map((tx) => (
            <div key={tx.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-center group active:scale-[0.98] transition-all hover:border-blue-100">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <ArrowUpRight size={22} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Electronic Transfer</p>
                  <p className="font-black text-slate-900 text-sm tracking-tight">External Payout</p>
                  <div className={`text-[9px] font-black px-2.5 py-1 rounded-lg mt-2 inline-block uppercase tracking-tighter ${
                    tx.status === 'success' 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                      : 'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {tx.status}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-900 font-black text-lg tracking-tight">-₦{parseFloat(tx.amount).toLocaleString()}</p>
                <div className="flex items-center justify-end gap-1.5 mt-1 text-slate-400">
                  <Calendar size={10} />
                  <p className="text-[10px] font-bold uppercase tracking-tighter">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-32">
            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 transform -rotate-12 border border-slate-100">
              <Clock className="text-slate-200" size={40} />
            </div>
            <h3 className="text-slate-900 font-black text-lg tracking-tight">No Outbound History</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2 max-w-[200px] mx-auto leading-relaxed">
              Your withdrawal records will appear here after processing.
            </p>
          </div>
        )}
      </div>

      <div className="text-center py-10">
        <p className="text-[9px] font-black text-slate-200 uppercase tracking-[0.4em]">GMT Protocol Secured</p>
      </div>
    </div>
  );
};

export default WithdrawalHistory;