import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowDownLeft, Wallet, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../interceptor';

const DepositHistory = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/api/user/ledger');
        // Filter strictly for deposits and returns
        const deposits = (res.data.data || []).filter(tx => 
          ['deposit', 'investment_return'].includes(tx.entry_type?.toLowerCase().trim())
        );
        setData(deposits);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white p-6 border-b flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-black">Deposit History</h1>
      </header>

      <div className="p-6 space-y-4">
        {loading ? (
          <p className="text-center py-10 text-gray-400 font-bold">Loading...</p>
        ) : data.length > 0 ? (
          data.map((tx) => (
            <div key={tx.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <ArrowDownLeft size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">{tx.entry_type?.replace(/_/g, ' ')}</p>
                  <p className="font-bold text-gray-900 text-sm">{tx.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-emerald-600 font-black">+₦{parseFloat(tx.amount).toLocaleString()}</p>
                <p className="text-[10px] text-gray-400 mt-1">{new Date(tx.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <Wallet className="mx-auto text-gray-200 mb-4" size={48} />
            <p className="text-gray-400">No deposits found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositHistory;