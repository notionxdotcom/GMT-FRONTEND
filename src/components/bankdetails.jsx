import React, { useState, useEffect } from 'react';
import { Landmark, AlertCircle, Edit3, Save, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../../interceptor';
import useBankStore from '../../store/bankdetailsstore';

const BankAccountScreen = () => {
  const { bankData, fetchBankDetails, setBankData, loading: storeLoading } = useBankStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Local form state to prevent "dirtying" the global store before saving
  const [formData, setFormData] = useState({ 
    bank_name: '', 
    account_number: '', 
    account_name: '' 
  });

  // 1. Fetch on mount if empty
  useEffect(() => {
    if (!bankData) {
        fetchBankDetails();
    }
  }, []);

  // 2. Sync local form with global data, and decide if we should show the form
  useEffect(() => {
    if (bankData) {
      setFormData(bankData);
      setIsEditing(false); // Show card view if data exists
    } else {
      setIsEditing(true); // Show form if no bank exists
    }
  }, [bankData]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.post('/wallet/addbankdetails', formData);
      setBankData(data.data); // Update global store ONLY on success
      setIsEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  // Use storeLoading to show the initial spinner
  if (storeLoading && !bankData) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="animate-spin text-slate-400" size={32} />
    </div>
  );

  return (
    <div className="max-w-md mx-auto p-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Payout Settings</h2>
        <p className="text-slate-500 text-sm font-medium">Manage where your earnings are sent.</p>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6 flex gap-3">
        <AlertCircle className="text-amber-600 shrink-0" size={20} />
        <p className="text-[11px] leading-relaxed text-amber-800 font-bold uppercase tracking-tight">
          DISCLAIMER: Please double-check details. Incorrect info may lead to loss of funds.
        </p>
      </div>

      {!isEditing && bankData ? (
        /* Saved Account Card View */
        <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
             <CheckCircle2 className="text-emerald-500" size={24} />
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600">
              <Landmark size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Linked Bank</p>
              <h3 className="text-lg font-bold text-slate-900">{bankData.bank_name}</h3>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Number</p>
              <p className="text-xl font-mono font-black text-slate-800 tracking-tighter">{bankData.account_number}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Name</p>
              <p className="font-bold text-slate-700">{bankData.account_name}</p>
            </div>
          </div>

          <button 
            onClick={() => setIsEditing(true)}
            className="w-full mt-8 flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition"
          >
            <Edit3 size={16} /> Update Details
          </button>
        </div>
      ) : (
        /* Form View - Linked to formData, NOT bankData */
        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Bank Name</label>
            <input 
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-slate-900 transition"
              placeholder="e.g. OPay"
              value={formData.bank_name}
              onChange={(e) => setFormData({...formData, bank_name: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Account Number</label>
            <input 
              required
              maxLength={10}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-slate-900 transition font-mono"
              placeholder="0123456789"
              value={formData.account_number}
              onChange={(e) => setFormData({...formData, account_number: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Full Account Name</label>
            <input 
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-slate-900 transition"
              placeholder="Emmanuel Arthur"
              value={formData.account_name}
              onChange={(e) => setFormData({...formData, account_name: e.target.value})}
            />
          </div>

          <div className="flex gap-3 pt-2">
            {bankData && (
              <button 
                type="button"
                onClick={() => {
                    setIsEditing(false);
                    setFormData(bankData); // Reset form to original data
                }}
                className="flex-1 py-3.5 border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            )}
            <button 
              type="submit"
              disabled={saving}
              className="flex-[2] py-3.5 bg-black text-white rounded-2xl font-bold text-sm hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Save Account</>}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BankAccountScreen;