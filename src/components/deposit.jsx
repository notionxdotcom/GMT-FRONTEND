import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2, ShieldCheck } from 'lucide-react';
import api from '../../interceptor'; 

const Deposit = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const amounts = [5000, 10000, 20000, 50000, 100000, 200000, 300000];

  const handleContinue = async () => {
    const finalAmount = parseFloat(amount);
    if (!finalAmount || finalAmount < 3000) {
      alert("GMT Minimum recharge is ₦3,000");
      return;
    }

    setLoading(true);
    try {
      // 1. CHECK FOR PENDING TRANSACTIONS FIRST
      const checkRes = await api.get('/wallet/active-deposit');
      
      if (checkRes.data.active) {
        alert("You have an unfinished GMT deposit request. Please complete or cancel it on your dashboard before making a new one.");
        navigate('/dashboard');
        return; 
      }

      // 2. Create the record in the DB if no active deposit is found
      const res = await api.post('/wallet/initiate-deposit', { amount: finalAmount });
      
      // 3. Pass the ID and Reference from the DB to the next page
      navigate('/confirm-deposit', { 
        state: { 
          amount: finalAmount, 
          reference: res.data.reference, 
          transactionId: res.data.transactionId 
        } 
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || "GMT Secure Server is busy. Please check your connection.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-28 flex justify-center">
      <div className="w-full max-w-md relative px-4">
        {/* Header */}
        <div className="flex items-center gap-4 py-6">
          <button 
            onClick={() => navigate(-1)} 
            disabled={loading}
            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl shadow-sm text-slate-600 disabled:opacity-50 active:scale-90 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-tight">GMT Recharge</h1>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Secure Payment Gateway</p>
          </div>
        </div>

        {/* Amount Selector Card */}
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl shadow-blue-900/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Select Amount</h2>
            <ShieldCheck size={18} className="text-blue-500 opacity-50" />
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {amounts.map((amt) => (
              <button
                key={amt}
                disabled={loading}
                onClick={() => setAmount(amt.toString())}
                className={`py-3 rounded-xl border text-sm font-black transition-all ${
                  amount === amt.toString() 
                  ? 'border-blue-600 bg-blue-50 text-blue-600 ring-2 ring-blue-100' 
                  : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-blue-200'
                } disabled:opacity-50`}
              >
                ₦{amt.toLocaleString()}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Custom Amount</label>
            <div className={`flex items-center border-2 rounded-2xl overflow-hidden transition-all ${amount ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100 bg-slate-50'}`}>
              <div className="px-5 py-4 text-blue-600 font-black text-lg border-r border-slate-200/50">₦</div>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                disabled={loading}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 p-4 bg-transparent outline-none text-slate-800 font-bold placeholder:text-slate-300 placeholder:font-normal disabled:cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2 ml-1 font-medium">
              * Minimum GMT investment starts from <span className="text-slate-800 font-bold">₦3,000</span>
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8">
          <button 
            onClick={handleContinue} 
            disabled={loading || !amount}
            className="group w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.5rem] font-black flex justify-center items-center gap-3 active:scale-95 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 disabled:shadow-none disabled:active:scale-100"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                Continue to Payment
                <ChevronLeft size={18} className="rotate-180 opacity-50 group-hover:opacity-100 transition-opacity" />
              </>
            )}
          </button>
          
          <div className="mt-6 text-center">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Verified GMT Transaction</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;