import React, { useState, useEffect } from 'react'; // Added useEffect
import { useNavigate } from 'react-router-dom'; // Added useNavigate
import { 
  ArrowLeft, Landmark, Wallet, ShieldCheck, 
  ChevronRight, FileText, Info, Menu, Bell, User
} from 'lucide-react';
import Sidebar from './sidebar';
import useBankStore from '../../store/bankdetailsstore';
import api from '../../interceptor';

const WithdrawPage = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [amount, setAmount] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Local loading state
  
  const { bankData, fetchBankDetails } = useBankStore();

  // Fetch bank details on mount if they don't exist
  useEffect(() => {
    if (!bankData) {
      fetchBankDetails();
    }
  }, []);

  // Business Logic
  const minAmount = 800;
  const feeRate = 0.15;
  const numericAmount = parseFloat(amount) || 0;
  const fee = numericAmount * feeRate;
  const totalReceive = numericAmount > 0 ? numericAmount - fee : 0;

  const withdraw = async () => {
    // 1. Validation Checks
    if (!bankData) {
      return alert("Please link your bank account first!");
    }
    if (numericAmount < minAmount) {
      return alert(`Minimum withdrawal amount is ₦${minAmount}`);
    }

    setLoading(true);
    try {
      // Your backend expects: amount, bankName, accountNumber, accountName
      await api.post("/wallet/requestwithdrawal", {
        amount: numericAmount,
        
      });

      alert("Withdrawal Submitted! Your transaction will be verified shortly.");
      navigate('/dashboard'); 
    } catch (err) {
      const errormessage = err?.response?.data?.message || "Something went wrong. Please try again.";
      alert(errormessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex overflow-x-hidden">
      <Sidebar isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-100 h-20 flex items-center justify-between px-6 md:px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-gray-500">
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <div>
                <h2 className="text-xl font-black text-gray-800 leading-none">Withdraw Now</h2>
                <p className="text-[11px] text-gray-400 font-bold uppercase mt-1">Cash out your earnings</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 border-r pr-6 border-gray-100">
                <div className="text-right">
                    <p className="text-sm font-black text-gray-900">Goodness Peters</p>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase">VIP 2 Member</p>
                </div>
                <div className="w-11 h-11 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#006B5E] border border-emerald-100">
                    <User size={22} />
                </div>
            </div>
            <Bell size={22} className="text-gray-400 cursor-pointer" />
          </div>
        </header>

        <div className="p-4 md:p-10 max-w-4xl mx-auto w-full space-y-8">
          <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#006B5E] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
                  <Wallet size={24} />
                </div>
                <div>
                  <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest">Withdrawal Amount</h3>
                  <p className="text-gray-400 text-[10px] font-bold uppercase mt-1">Min. Withdrawal: ₦{minAmount}</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/bank-account')}
                className="flex items-center gap-2 text-[#006B5E] font-black text-xs bg-emerald-50 px-5 py-2.5 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-colors"
              >
                <Landmark size={16} /> BANK ACCOUNT
              </button>
            </div>

            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 font-black text-2xl group-focus-within:text-[#006B5E] transition-colors">₦</div>
              <input 
                type="number" 
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-[1.5rem] py-7 pl-14 pr-6 text-3xl font-black text-gray-800 focus:outline-none focus:border-[#006B5E] focus:bg-white transition-all placeholder:text-gray-200"
              />
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100">
            <div className="p-6 md:p-8 bg-gray-50/50 border-b border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-800 text-white rounded-lg flex items-center justify-center">
                <FileText size={16} />
              </div>
              <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest">Withdrawal Summary</h3>
            </div>
            
            <div className="p-6 md:p-10 space-y-6">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-gray-400 uppercase text-[11px] tracking-widest">Minimum</span>
                <span className="text-gray-800 font-black">₦{minAmount.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-gray-400 uppercase text-[11px] tracking-widest">Withdrawal Fee (15%)</span>
                <span className="text-rose-500 font-black">- ₦{fee.toLocaleString()}</span>
              </div>

              <div className="pt-6 border-t border-dashed border-gray-200 flex justify-between items-center">
                <span className="text-gray-800 uppercase text-xs font-black tracking-widest">You Receive</span>
                <span className="text-3xl font-black text-[#006B5E]">₦{totalReceive.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <Info size={16} className="text-gray-400" />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Destination</span>
                </div>
                <span className="text-sm font-black text-gray-800">
                  {bankData?.bank_name || 'Not linked'} {bankData?.account_number && `· ${bankData.account_number}`}
                </span>
              </div>

              <button 
                onClick={withdraw}
                disabled={loading}
                className={`w-full ${loading ? 'bg-gray-400' : 'bg-[#006B5E] hover:bg-[#004D44]'} text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-emerald-900/10 transition-all active:scale-95 group`}
              >
                {loading ? (
                   <span className="animate-pulse">Processing...</span>
                ) : (
                  <>
                    <ShieldCheck size={22} className="group-hover:scale-110 transition-transform" /> 
                    Withdraw Now 
                    <ChevronRight size={22} />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <ShieldCheck size={14} className="text-emerald-500" />
                Secured & encrypted by NotionX
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WithdrawPage;