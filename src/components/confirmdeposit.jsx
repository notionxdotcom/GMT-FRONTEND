import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Copy, Info, CheckCircle, ChevronLeft, Loader2 } from 'lucide-react';
import api from '../../interceptor';

const ConfirmDeposit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Data passed from the selection page
  const amount = location.state?.amount;
  const reference = location.state?.reference;
  const transactionId = location.state?.transactionId;

  const [copied, setCopied] = useState("");
  const [loading, setLoading] = useState(false);

  const BANK_DETAILS = {
    name: "FIRST BANK",
    accountName: "ARTHUR EMMANUEL VICTOR",
    accountNumber: "3130114223"
  };

  useEffect(() => {
    // If the user refreshed or navigated directly here without a transaction, send them back
    if (!amount || !transactionId) {
      navigate('/deposit');
    }
  }, [amount, transactionId, navigate]);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(""), 2000);
  };

  const sendApproval = async () => {
    try {
      setLoading(true);
      // We only send the ID. The backend already knows the amount and reference from step 1.
      await api.post('/wallet/request-approval', { transactionId });
      
      alert("Submission Successful! We are verifying your transfer.");
      navigate('/dashboard'); 
    } catch (err) {
      alert(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!amount) return null;

  return (
    <div className="min-h-screen bg-[#002B2B] text-white p-4 max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-6 pt-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/10 rounded-full">
          <ChevronLeft size={20}/>
        </button>
        <h1 className="text-lg font-bold">Transfer Details</h1>
      </div>

      <div className="bg-yellow-50/10 border border-yellow-500/20 p-4 rounded-2xl mb-6 flex gap-3 text-yellow-100 text-xs">
        <Info className="text-yellow-400 shrink-0" size={18} />
        <p>Transfer exactly <b>₦{amount.toLocaleString()}</b> and use the reference below as your narration.</p>
      </div>

      <div className="bg-white rounded-3xl p-6 text-slate-800 space-y-5 mb-6 shadow-xl">
        <DetailRow label="Bank Name" value={BANK_DETAILS.name} />
        <DetailRow label="Account Name" value={BANK_DETAILS.accountName} />
        <DetailRow 
          label="Account Number" 
          value={BANK_DETAILS.accountNumber} 
          copyable 
          onCopy={() => handleCopy(BANK_DETAILS.accountNumber, "acct")}
          isCopied={copied === "acct"}
        />
        <DetailRow 
          label="Exact Amount" 
          value={`₦${amount.toLocaleString()}`} 
          copyable 
          onCopy={() => handleCopy(amount.toString(), "amt")}
          isCopied={copied === "amt"}
        />
      </div>

      <div className="bg-white rounded-3xl p-6 text-slate-800 mb-8 shadow-xl text-center">
        <span className="text-[10px] font-black text-slate-400 uppercase block mb-2">Transfer Narration / Reference</span>
        <div 
          onClick={() => handleCopy(reference, "ref")}
          className="bg-teal-50 border-2 border-dashed border-teal-200 p-4 rounded-xl flex justify-between items-center cursor-pointer active:scale-95 transition-all"
        >
          <span className="font-mono font-bold text-teal-700 text-lg uppercase tracking-widest">{reference}</span>
          <Copy size={20} className="text-teal-400" />
        </div>
        {copied === "ref" && <p className="text-[10px] text-teal-600 mt-2 font-bold">COPIED TO CLIPBOARD</p>}
      </div>

      <button 
        onClick={sendApproval}
        disabled={loading}
        className="w-full bg-teal-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
      >
        {loading ? <Loader2 size={20} className="animate-spin" /> : <><CheckCircle size={20} /> I Have Paid</>}
      </button>
    </div>
  );
};

const DetailRow = ({ label, value, copyable, onCopy, isCopied }) => (
  <div className="flex justify-between items-center">
    <span className="text-xs text-slate-400 font-medium">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-sm font-bold text-slate-700">{value}</span>
      {copyable && (
        <button onClick={onCopy} className="p-1">
          {isCopied ? <span className="text-[10px] text-teal-500 font-bold">Copied</span> : <Copy size={14} className="text-slate-300"/>}
        </button>
      )}
    </div>
  </div>
);

export default ConfirmDeposit;