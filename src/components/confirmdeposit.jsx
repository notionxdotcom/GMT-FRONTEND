import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Copy, Info, CheckCircle, ChevronLeft, Loader2, XCircle } from 'lucide-react';
import api from '../../interceptor';
import toast from 'react-hot-toast';

const ConfirmDeposit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
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
    if (!location.state || !transactionId) {
      console.warn("No transaction state found. Redirecting to deposit selection.");
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
      await api.post('/wallet/requestdeposit', { transactionId });
      toast.success("Submission Successful! GMT Verifying transfer.");
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

  if (!transactionId) return null;

  return (
    /* Changed background to very light blue */
    <div className="min-h-screen bg-blue-50 text-slate-900 p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pt-4">
        <button 
          onClick={() => navigate(-1)} 
          disabled={loading || cancelLoading}
          className="p-2 bg-white border border-blue-100 rounded-full shadow-sm disabled:opacity-30"
        >
          <ChevronLeft size={20} className="text-blue-600"/>
        </button>
        <h1 className="text-lg font-bold">GMT Transfer Details</h1>
      </div>

      {/* Instruction Box - Switched to Blue layout */}
      <div className="bg-blue-100/50 border border-blue-200 p-4 rounded-2xl mb-6 flex gap-3 text-blue-800 text-xs">
        <Info className="text-blue-600 shrink-0" size={18} />
        <p>Transfer exactly <b>₦{Number(amount).toLocaleString()}</b>. Use the reference below as your narration for GMT verification.</p>
      </div>

      {/* Bank Details Card */}
      <div className="bg-white rounded-3xl p-6 text-slate-800 space-y-5 mb-6 shadow-sm border border-blue-50">
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

      {/* Reference Card - Blue accents */}
      <div className="bg-white rounded-3xl p-6 text-slate-800 mb-8 shadow-sm border border-blue-50 text-center">
        <span className="text-[10px] font-black text-blue-400 uppercase block mb-2">GMT Transfer Narration / Reference</span>
        <div 
          onClick={() => handleCopy(reference, "ref")}
          className="bg-blue-50 border-2 border-dashed border-blue-200 p-4 rounded-xl flex justify-between items-center cursor-pointer active:scale-95 transition-all"
        >
          <span className="font-mono font-bold text-blue-700 text-lg uppercase tracking-widest">{reference}</span>
          <Copy size={20} className="text-blue-400" />
        </div>
        {copied === "ref" && <p className="text-[10px] text-blue-600 mt-2 font-bold uppercase">Copied to Clipboard</p>}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <button 
          onClick={sendApproval}
          disabled={loading || cancelLoading}
          /* Primary Blue Button */
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 active:scale-95 transition-all disabled:opacity-50"
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
            className="w-full bg-transparent text-slate-400 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:text-red-500 transition-all disabled:opacity-50"
          >
            {cancelLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <><XCircle size={18} /> Cancel GMT Request</>
            )}
          </button>
        )}
      </div>

      <p className="text-[10px] text-slate-400 text-center mt-6 px-4 uppercase font-bold tracking-wider">
        Secure transaction powered by GMT Ledger System
      </p>
    </div>
  );
};

const DetailRow = ({ label, value, copyable, onCopy, isCopied }) => (
  <div className="flex justify-between items-center">
    <span className="text-xs text-blue-400 font-bold uppercase tracking-tight">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-sm font-bold text-slate-700">{value}</span>
      {copyable && (
        <button onClick={onCopy} className="p-1">
          {isCopied ? (
            <span className="text-[10px] text-blue-500 font-bold animate-pulse uppercase">Copied</span>
          ) : (
            <Copy size={14} className="text-blue-200 hover:text-blue-500 transition-colors"/>
          )}
        </button>
      )}
    </div>
  </div>
);

export default ConfirmDeposit;
