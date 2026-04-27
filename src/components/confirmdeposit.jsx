import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Copy, Info, CheckCircle, ChevronLeft, Loader2, XCircle } from 'lucide-react';
import api from '../../interceptor';
import toast from 'react-hot-toast';

const ConfirmDeposit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extracting data safely from location.state
  const amount = location.state?.amount;
  const reference = location.state?.reference;
  const transactionId = location.state?.transactionId;

  const [copied, setCopied] = useState("");
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const BANK_DETAILS = {
    name: "FIRST BANK",
    accountName: "ARTHUR EMMANUEL VICTOR",
    accountNumber: "3130114223"
  };

  useEffect(() => {
    // FIX: Only redirect if we are SURE there is no data and no state.
    // If we redirect to /deposit and /deposit is protected, 
    // the Auth Guard might be the one sending you to Register/Sign-up.
    if (!location.state || !transactionId) {
      console.warn("No transaction state found. Redirecting to deposit selection.");
      // Use replace: true so the user can't "Go Back" into an empty state
      navigate('/deposit', { replace: true });
    }
  }, [location.state, transactionId, navigate]);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    toast.success(`${field.toUpperCase()} copied!`);
    setTimeout(() => setCopied(""), 2000);
  };

  const sendApproval = async () => {
    if (!window.confirm("Confirmed: I have transferred the exact amount mentioned below.")) return;
    
    try {
      setLoading(true);
      // Moves status from 'pending' to 'processing'
      await api.post('/wallet/requestdeposit', { transactionId });
      
      toast.success("Submission Successful! Verifying transfer.");
      navigate('/dashboard'); 
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to discard this deposit request?")) return;
    
    try {
      setCancelLoading(true);
      const response = await api.post(`/wallet/cancel-deposit/${transactionId}`);
      
      if (response.data.status === "success") {
        toast.success("Request discarded successfully");
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not cancel request.");
    } finally {
      setCancelLoading(false);
    }
  };

  // Prevent rendering the UI if we don't have the required data
  if (!transactionId) return null;

  return (
    <div className="min-h-screen bg-[#002B2B] text-white p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pt-4">
        <button 
          onClick={() => navigate(-1)} 
          disabled={loading || cancelLoading}
          className="p-2 bg-white/10 rounded-full disabled:opacity-30"
        >
          <ChevronLeft size={20}/>
        </button>
        <h1 className="text-lg font-bold">Transfer Details</h1>
      </div>

      {/* Instruction Box */}
      <div className="bg-yellow-50/10 border border-yellow-500/20 p-4 rounded-2xl mb-6 flex gap-3 text-yellow-100 text-xs">
        <Info className="text-yellow-400 shrink-0" size={18} />
        <p>Transfer exactly <b>₦{Number(amount).toLocaleString()}</b> and use the reference below as your narration.</p>
      </div>

      {/* Bank Details Card */}
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
          value={`₦${Number(amount).toLocaleString()}`} 
          copyable 
          onCopy={() => handleCopy(amount.toString(), "amt")}
          isCopied={copied === "amt"}
        />
      </div>

      {/* Reference Card */}
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

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <button 
          onClick={sendApproval}
          disabled={loading || cancelLoading}
          className="w-full bg-teal-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <><CheckCircle size={20} /> I Have Paid</>
          )}
        </button>

        {!loading && (
          <button 
            onClick={handleCancel}
            disabled={cancelLoading}
            className="w-full bg-transparent text-slate-400 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:text-white transition-all disabled:opacity-50"
          >
            {cancelLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <><XCircle size={18} /> Cancel Request</>
            )}
          </button>
        )}
      </div>

      <p className="text-[10px] text-slate-500 text-center mt-6 px-4 uppercase font-bold tracking-wider">
        Secure transaction powered by Upnepa Ledger System
      </p>
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
          {isCopied ? (
            <span className="text-[10px] text-teal-500 font-bold animate-pulse">Copied</span>
          ) : (
            <Copy size={14} className="text-slate-300 hover:text-teal-500 transition-colors"/>
          )}
        </button>
      )}
    </div>
  </div>
);

export default ConfirmDeposit;