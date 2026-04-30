import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Landmark, Wallet, ShieldCheck, 
  ChevronRight, FileText, Info, Menu, Bell, User, Clock
} from 'lucide-react';
import Sidebar from './sidebar';
import useBankStore from '../../store/bankdetailsstore';
import api from '../../interceptor';

const WithdrawPage = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { bankData, fetchBankDetails } = useBankStore();

  useEffect(() => {
    if (!bankData) { fetchBankDetails(); }
  }, [bankData, fetchBankDetails]);

  const minAmount = 1500; 
  const feeRate = 0.20; 
  
  const totalDeduction = parseFloat(amount) || 0; 
  const fee = parseFloat((totalDeduction * feeRate).toFixed(2));           
  const payoutAmount = parseFloat((totalDeduction - fee).toFixed(2));

  const withdraw = async () => {
    if (!bankData) return alert("Please link your bank account first!");
    if (totalDeduction < minAmount) return alert(`Minimum withdrawal is ₦${minAmount}`);

    setLoading(true);
    try {
      await api.post("/wallet/requestwithdrawal", {
        amount: totalDeduction,
        net_amount: payoutAmount,
        fee: fee
      });

      alert("GMT Withdrawal Request Submitted!");
      navigate('/dashboard'); 
    } catch (err) {
      alert(err?.response?.data?.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex overflow-x-hidden font-sans">
      <Sidebar isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header - GMT Style */}
        <header className="bg-white border-b border-slate-100 h-20 flex items-center justify-between px-6 md:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100 text-slate-600 transition-all border border-slate-100">
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">Withdraw Assets</h2>
                <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-1">Institutional Payout</p>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
            <Clock size={14} className="text-slate-400" />
            <span className="text-[10px] font-black text-slate-500 uppercase">Processing: 24/7</span>
          </div>
        </header>

        <div className="p-4 md:p-10 max-w-4xl mx-auto w-full space-y-8">
          {/* Amount Input Card */}
          <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-slate-900/5 border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-[5rem] -z-0"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <Wallet className="text-blue-600" size={18} />
                <h3 className="font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">Debit Request Amount</h3>
              </div>
              
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-black text-3xl group-focus-within:text-blue-600 transition-colors">₦</div>
                <input 
                  type="number" placeholder="0.00" value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent rounded-[2rem] py-8 pl-16 pr-8 text-4xl font-black text-slate-900 focus:outline-none focus:border-blue-600/10 focus:bg-white transition-all placeholder:text-slate-200"
                />
              </div>
              <p className="mt-4 text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                <Info size={14} className="text-blue-500" /> 
                Min withdrawal threshold: <span className="text-slate-900 font-black">₦{minAmount.toLocaleString()}</span>
              </p>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-900/5 border border-slate-100">
            <div className="p-6 md:px-10 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                   <FileText size={18} className="text-blue-400" />
                </div>
                <h3 className="font-black uppercase text-xs tracking-widest">Payout Summary</h3>
              </div>
              <ShieldCheck size={20} className="text-blue-500" />
            </div>
            
            <div className="p-8 md:p-12 space-y-6">
              <div className="flex justify-between items-center group">
                <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest group-hover:text-slate-600 transition-colors">Gross Deduction</span>
                <span className="text-slate-900 font-black text-lg">₦{totalDeduction.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center group">
                <div className="flex flex-col">
                  <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest group-hover:text-slate-600 transition-colors">Node Service Fee</span>
                  <span className="text-[9px] font-bold text-blue-500 uppercase">Tier 1 Rate (20%)</span>
                </div>
                <span className="text-red-500 font-black text-lg">- ₦{fee.toLocaleString()}</span>
              </div>

              <div className="pt-8 border-t-2 border-dashed border-slate-100 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <span className="text-slate-900 uppercase text-xs font-black tracking-widest block mb-1">Net Bank Credit</span>
                  <p className="text-[10px] font-bold text-slate-400">Funds will arrive at linked GMT account</p>
                </div>
                <span className="text-4xl font-black text-blue-600 tracking-tighter">₦{payoutAmount.toLocaleString()}</span>
              </div>

              <button 
                onClick={withdraw} disabled={loading}
                className={`w-full mt-6 ${loading ? 'bg-slate-200' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-xl shadow-blue-600/20'} text-white py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 transition-all uppercase tracking-widest`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Authorize Payout <ChevronRight size={24} /></>
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-center pb-12">
          <p className="text-[9px] font-black text-slate-200 uppercase tracking-[0.4em]">GMT Secure Transaction Layer</p>
        </div>
      </main>
    </div>
  );
};

export default WithdrawPage;