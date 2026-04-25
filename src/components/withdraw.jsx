import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Landmark, Wallet, ShieldCheck, 
  ChevronRight, FileText, Info, Menu, Bell, User
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

const minAmount = 1000; 
  const feeRate = 0.20; 
  
  // Clean the input to avoid floating point issues
  const totalDeduction = parseFloat(amount) || 0; 
  
  // Use toFixed(2) and parseFloat to ensure the backend receives clean numbers
  const fee = parseFloat((totalDeduction * feeRate).toFixed(2));           
  const payoutAmount = parseFloat((totalDeduction - fee).toFixed(2));

  const withdraw = async () => {
    if (!bankData) return alert("Please link your bank account first!");
    if (totalDeduction < minAmount) return alert(`Minimum withdrawal is ₦${minAmount}`);

    setLoading(true);
    try {
      await api.post("/wallet/requestwithdrawal", {
        amount: totalDeduction,   // e.g., 10000
        net_amount: payoutAmount, // e.g., 8000
        fee: fee                  // e.g., 2000
      });

      alert("Withdrawal Request Submitted!");
      navigate('/dashboard'); 
    } catch (err) {
      alert(err?.response?.data?.message || "Transaction failed");
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
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-gray-500"><Menu size={24} /></button>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100"><ArrowLeft size={20} /></button>
              <div>
                <h2 className="text-xl font-black text-gray-800">Withdraw Funds</h2>
                <p className="text-[11px] text-gray-400 font-bold uppercase">20% Service Charge applies</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-10 max-w-4xl mx-auto w-full space-y-8">
          <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-gray-100">
             <h3 className="font-black text-gray-800 uppercase text-xs tracking-widest mb-4">Amount to Withdraw</h3>
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 font-black text-2xl group-focus-within:text-[#006B5E]">₦</div>
              <input 
                type="number" placeholder="0.00" value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-[1.5rem] py-7 pl-14 pr-6 text-3xl font-black focus:outline-none focus:border-[#006B5E] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100">
            <div className="p-6 md:p-8 bg-gray-50/50 border-b border-gray-100 flex items-center gap-3">
              <FileText size={16} /> <h3 className="font-black text-gray-800 uppercase text-xs">Summary</h3>
            </div>
            
            <div className="p-6 md:p-10 space-y-6">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-gray-400 uppercase text-[11px]">Wallet Deduction</span>
                <span className="text-gray-800 font-black">₦{totalDeduction.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-gray-400 uppercase text-[11px]">Platform Fee (20%)</span>
                <span className="text-rose-500 font-black">- ₦{fee.toLocaleString()}</span>
              </div>

              <div className="pt-6 border-t border-dashed border-gray-200 flex justify-between items-center">
                <span className="text-gray-800 uppercase text-xs font-black">Actual Bank Payout</span>
                <span className="text-3xl font-black text-[#006B5E]">₦{payoutAmount.toLocaleString()}</span>
              </div>

              <button 
                onClick={withdraw} disabled={loading}
                className={`w-full ${loading ? 'bg-gray-400' : 'bg-[#006B5E] hover:bg-[#004D44]'} text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 transition-all`}
              >
                {loading ? "Processing..." : "Confirm Withdrawal"} <ChevronRight size={22} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WithdrawPage;