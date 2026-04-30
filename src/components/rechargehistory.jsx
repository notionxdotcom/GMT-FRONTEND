import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowDownLeft, Wallet, ShieldCheck, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../interceptor';

const DepositHistory = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/user/ledger');
        // Filter strictly for deposits and returns
        const deposits = (res.data.data || []).filter(tx => 
          ['deposit', 'investment_return'].includes(tx.entry_type?.toLowerCase().trim())
        );
        setData(deposits);
      } catch (err) {
        console.error("GMT Ledger Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header - GMT Blue Branding */}
      <header className="bg-white p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100"
          >
            <ArrowLeft size={22} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Recharge Logs</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inbound GMT Assets</p>
          </div>
        </div>
        <ShieldCheck className="text-blue-600/20" size={24} />
      </header>

      <div className="p-6 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Verifying Ledger...</p>
          </div>
        ) : data.length > 0 ? (
          data.map((tx) => (
            <div key={tx.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-center group hover:border-blue-100 transition-all">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ArrowDownLeft size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-tighter bg-blue-50 px-2 py-0.5 rounded-md">
                      {tx.entry_type?.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <p className="font-black text-slate-800 text-sm tracking-tight">{tx.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-blue-600 font-black text-lg tracking-tight">
                  +₦{parseFloat(tx.amount).toLocaleString()}
                </p>
                <div className="flex items-center justify-end gap-1 mt-1 text-slate-400">
                  <Clock size={10} />
                  <p className="text-[10px] font-bold uppercase tracking-tighter">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 transform -rotate-12 border border-slate-100">
              <Wallet className="text-slate-200" size={40} />
            </div>
            <h3 className="text-slate-800 font-black text-lg tracking-tight">No Inbound History</h3>
            <p className="text-slate-400 text-xs font-medium max-w-[200px] mx-auto mt-2 leading-relaxed">
              Your GMT deposit records will appear here once confirmed.
            </p>
          </div>
        )}
      </div>
      
      <div className="text-center pb-10">
        <p className="text-[9px] font-black text-slate-200 uppercase tracking-[0.4em]">GMT Secure Protocol</p>
      </div>
    </div>
  );
};

export default DepositHistory;