import React, { useState, useEffect } from 'react';
import { Landmark, AlertCircle, Edit3, Save, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../../interceptor';
import useBankStore from '../../store/bankdetailsstore';

const BankAccountScreen = () => {
  const { bankData, fetchBankDetails, setBankData, loading: storeLoading } = useBankStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({ 
    bank_name: '', 
    account_number: '', 
    account_name: '' 
  });

  useEffect(() => {
    if (!bankData) {
        fetchBankDetails();
    }
  }, []);

  useEffect(() => {
    if (bankData) {
      setFormData(bankData);
      setIsEditing(false); 
    } else {
      setIsEditing(true); 
    }
  }, [bankData]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.post('/wallet/addbankdetails', formData);
      setBankData(data.data); 
      setIsEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (storeLoading && !bankData) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="animate-spin text-blue-400" size={32} />
    </div>
  );

  return (
    <div className="max-w-md mx-auto p-6 animate-in fade-in duration-500">
      <div className="mb-8">
        {/* Changed text to GMT */}
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">GMT Payout Settings</h2>
        <p className="text-slate-500 text-sm font-medium">Manage where your GMT earnings are sent.</p>
      </div>

      {/* Changed to Light Blue layout colors */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 flex gap-3">
        <AlertCircle className="text-blue-600 shrink-0" size={20} />
        <p className="text-[11px] leading-relaxed text-blue-800 font-bold uppercase tracking-tight">
          GMT DISCLAIMER: Please double-check details. Incorrect info may lead to loss of funds.
        </p>
      </div>

      {!isEditing && bankData ? (
        /* Saved Account Card View - Blue Accents */
        <div className="bg-white border-2 border-blue-50 rounded-3xl p-6 shadow-sm shadow-blue-100/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
             <CheckCircle2 className="text-blue-500" size={24} />
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <Landmark size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Linked Bank</p>
              <h3 className="text-lg font-bold text-slate-900">{bankData.bank_name}</h3>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Account Number</p>
              <p className="text-xl font-mono font-black text-slate-800 tracking-tighter">{bankData.account_number}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Account Name</p>
              <p className="font-bold text-slate-700">{bankData.account_name}</p>
            </div>
          </div>

          <button 
            onClick={() => setIsEditing(true)}
            className="w-full mt-8 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            <Edit3 size={16} /> Update Details
          </button>
        </div>
      ) : (
        /* Form View - Light Blue Inputs */
        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Bank Name</label>
            <input 
              required
              className="w-full bg-blue-50/50 border border-blue-100 rounded-2xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
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
              className="w-full bg-blue-50/50 border border-blue-100 rounded-2xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition font-mono"
              placeholder="0123456789"
              value={formData.account_number}
              onChange={(e) => setFormData({...formData, account_number: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Full Account Name</label>
            <input 
              required
              className="w-full bg-blue-50/50 border border-blue-100 rounded-2xl px-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              placeholder="Goodness Peters"
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
                    setFormData(bankData);
                }}
                className="flex-1 py-3.5 border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            )}
            <button 
              type="submit"
              disabled={saving}
              className="flex-[2] py-3.5 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Save GMT Account</>}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BankAccountScreen;
