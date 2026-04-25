import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Copy, Info, CheckCircle, ChevronLeft, Loader2 } from 'lucide-react';
import api from '../../interceptor';

const ConfirmDeposit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const amount = location.state?.amount;

  const [copied, setCopied] = useState("");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);

  // Static Bank Details
  const BANK_DETAILS = {
    name: "FIRST BANK",
    accountName: "ARTHUR EMMANUEL VICTOR",
    accountNumber: "3130114223"
  };

  useEffect(() => {
    if (!amount) {
      navigate('/deposit');
      return;
    }
    // Generate a unique reference for this specific session
    const randomRef = "NX" + Math.random().toString(36).substring(2, 9).toUpperCase();
    setReference(randomRef);
  }, [amount, navigate]);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(""), 2000);
  };

  const sendApproval = async () => {
    try {
      setLoading(true);
      // Ensure the endpoint matches your backend route (e.g., /wallet/deposit-request)
      await api.post('/wallet/requestdeposit', { amount, reference });
      
      alert("Deposit Submitted! Your transaction will be verified shortly.");
      navigate('/dashboard'); // Navigate to dashboard or profile on success
    } catch (err) {
      const errormessage = err?.response?.data?.message || "Something went wrong. Please try again.";
      alert(errormessage);
    } finally {
      setLoading(false);
    }
  };

  if (!amount) return null;

  return (
    <div className="min-h-screen bg-[#002B2B] text-white p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pt-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 bg-white/10 rounded-full"
          disabled={loading}
        >
          <ChevronLeft size={20}/>
        </button>
        <h1 className="text-lg font-bold">Transfer Details</h1>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50/10 border border-yellow-500/20 p-4 rounded-2xl mb-6 flex gap-3 text-yellow-100 text-xs">
        <Info className="text-yellow-400 shrink-0" size={18} />
        <p>Transfer the exact amount and use the <b>Reference</b> as your narration.</p>
      </div>

      {/* Static Bank Card */}
      <div className="bg-white rounded-3xl p-6 text-slate-800 space-y-5 mb-6">
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

      {/* Reference Card */}
      <div className="bg-white rounded-3xl p-6 text-slate-800 mb-8">
        <span className="text-[10px] font-black text-slate-400 uppercase block mb-2 text-center">Narration / Reference</span>
        <div 
          onClick={() => handleCopy(reference, "ref")}
          className="bg-teal-50 border-2 border-dashed border-teal-200 p-4 rounded-xl flex justify-between items-center cursor-pointer"
        >
          <span className="font-mono font-bold text-teal-700 text-lg uppercase tracking-widest">{reference}</span>
          <Copy size={20} className="text-teal-400" />
        </div>
        {copied === "ref" && <p className="text-[10px] text-teal-600 mt-2 text-center font-bold uppercase">Copied!</p>}
      </div>

      <button 
        onClick={sendApproval}
        disabled={loading}
        className="w-full bg-teal-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <>
            <CheckCircle size={20} /> I Have Paid
          </>
        )}
      </button>
    </div>
  );
};

// Simple Row Component
const DetailRow = ({ label, value, copyable, onCopy, isCopied }) => (
  <div className="flex justify-between items-center">
    <span className="text-xs text-slate-400 font-medium">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-sm font-bold text-slate-700">{value}</span>
      {copyable && (
        <button onClick={onCopy}>
          {isCopied ? (
            <span className="text-[10px] text-teal-500 font-bold">Copied</span>
          ) : (
            <Copy size={14} className="text-slate-300"/>
          )}
        </button>
      )}
    </div>
  </div>
);

export default ConfirmDeposit;