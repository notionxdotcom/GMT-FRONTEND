import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authstore';
import useBankStore from '../../store/bankdetailsstore';
import { 
  ShieldCheck, LogOut, Lock, Landmark, History, 
  UserPlus, ArrowDownLeft, ArrowUpRight, Copy, 
  Check, ChevronRight, User, MessageCircle, Radio, ExternalLink 
} from 'lucide-react';

// --- 1. REUSABLE COMPONENTS ---

const ActionButton = ({ icon, label, color, onClick }) => (
  <button onClick={onClick} className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-50 flex flex-col items-center gap-2 active:scale-95 transition-all">
    <div className={`w-11 h-11 ${color} rounded-2xl flex items-center justify-center`}>
      {icon}
    </div>
    <span className="text-[11px] font-black text-slate-600 uppercase tracking-tighter">{label}</span>
  </button>
);

const ListSection = ({ title, children, accent }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 px-1">
      <div className={`w-1 h-3 ${accent} rounded-full`}></div>
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</h3>
    </div>
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm divide-y divide-slate-50 overflow-hidden">
      {children}
    </div>
  </div>
);

const ListItem = ({ icon, label, subLabel, isDestructive, isExternal, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors active:bg-slate-100 text-left">
    <div className="flex items-center gap-4">
      <div className="flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className={`text-[14px] font-black tracking-tight ${isDestructive ? 'text-red-500' : 'text-slate-800'}`}>{label}</p>
        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter">{subLabel}</p>
      </div>
    </div>
    {isExternal ? 
      <ExternalLink size={14} className="text-slate-300" /> : 
      <ChevronRight size={18} className={isDestructive ? 'text-red-200' : 'text-slate-200'} />
    }
  </button>
);


// --- 2. MAIN COMPONENT ---

export default function Profile() {
  const navigate = useNavigate();
  const { user, wallet, clearAuth } = useAuthStore();
  const { bankData, clearBankData } = useBankStore();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (user?.referral_code) {
      const referralLink = `${window.location.origin}/register?ref=${user.referral_code}`;
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSignOut = () => {
    clearAuth();
    clearBankData();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-32">
      
      {/* --- COPY TOAST --- */}
      {copied && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[100] bg-slate-900/90 backdrop-blur-xl text-white px-6 py-3 rounded-2xl text-xs font-black shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-300">
          <Check size={16} className="text-blue-400" />
          GMT LINK COPIED
        </div>
      )}

      <header className="bg-white px-6 py-8 flex justify-between items-center border-b border-slate-50">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Account</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">GMT Member Identity</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 text-blue-600">
          <User size={24} />
        </div>
      </header>

      <main className="px-5 mt-6 space-y-8">
        {/* Profile Card */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] to-[#1E40AF] rounded-[2.5rem] p-8 shadow-2xl shadow-blue-900/20 text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          
          <div className="flex items-center gap-4 mb-10 relative z-10">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
              <ShieldCheck size={28} className="text-blue-300" />
            </div>
            <div>
              <h2 className="text-[18px] font-black tracking-tight">{user?.phoneNumber || 'GMT Member'}</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-200/70">
                  Verified Investor
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-5 border border-white/10">
              <p className="text-[9px] uppercase tracking-[0.2em] font-black text-blue-200/50 mb-1">Available Funds</p>
              <p className="text-2xl font-black">₦{wallet?.balance?.toLocaleString() || '0'}</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-5 border border-white/10 flex justify-between items-center">
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] font-black text-blue-200/50 mb-1">Ref ID</p>
                <p className="text-lg font-black">{user?.referral_code || '---'}</p>
              </div>
              <button 
                onClick={handleCopyCode} 
                className={`p-2.5 rounded-xl transition-all ${copied ? 'bg-blue-500 scale-110' : 'hover:bg-white/10 bg-white/5'}`}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="grid grid-cols-3 gap-4 px-1">
          <ActionButton onClick={() => navigate('/deposit')} icon={<ArrowDownLeft size={22}/>} label="Deposit" color="bg-blue-50 text-blue-600" />
          <ActionButton onClick={() => navigate('/withdraw')} icon={<ArrowUpRight size={22}/>} label="Payout" color="bg-indigo-50 text-indigo-600" />
          <ActionButton onClick={handleCopyCode} icon={<UserPlus size={22}/>} label="Invite" color="bg-slate-100 text-slate-600" />
        </section>

        {/* List Sections */}
        <ListSection title="Financial Logs" accent="bg-blue-600">
          <ListItem icon={<div className="bg-blue-50 p-2 rounded-xl"><History size={18} className="text-blue-600"/></div>} label="Deposit History" subLabel="Managed recharge logs" onClick={() => navigate('/recharge-history')} />
          <ListItem icon={<div className="bg-slate-50 p-2 rounded-xl"><History size={18} className="text-slate-600"/></div>} label="Payout History" subLabel="Verified withdrawal logs" onClick={() => navigate('/withdrawal-history')} />
        </ListSection>

        <ListSection title="Security & Bank" accent="bg-indigo-600">
          <ListItem onClick={() => navigate('/bank-account')} icon={<div className="bg-indigo-50 p-2 rounded-xl"><Landmark size={18} className="text-indigo-600"/></div>} label="Bank Account" subLabel={bankData ? `${bankData.bank_name}` : "Connect Payout Method"} />
          <ListItem icon={<div className="bg-amber-50 p-2 rounded-xl"><Lock size={18} className="text-amber-600"/></div>} label="Security Core" subLabel="Reset Access Key" />
        </ListSection>

        <ListSection title="GMT Collective" accent="bg-slate-900">
          {/* WhatsApp Community */}
          <a href='https://chat.whatsapp.com/DEhEEQYIAWP3dAiHl2nClp?mode=gi_t' target="_blank" rel="noreferrer">
            <ListItem icon={<div className="bg-emerald-50 p-2 rounded-xl"><MessageCircle size={18} className="text-emerald-600"/></div>} label="WhatsApp Community" subLabel="Connect with GMT Members" isExternal />
          </a>
          
          {/* WhatsApp Channel */}
          <a href='https://whatsapp.com/channel/0029Vb8bI2hEwEjmQ04kNS0F' target="_blank" rel="noreferrer">
            <ListItem icon={<div className="bg-emerald-50 p-2 rounded-xl"><Radio size={18} className="text-emerald-600"/></div>} label="Official Channel" subLabel="Daily GMT Market Updates" isExternal />
          </a>

          <ListItem onClick={handleSignOut} icon={<div className="bg-red-50 p-2 rounded-xl"><LogOut size={18} className="text-red-500"/></div>} label="Exit Session" subLabel="Securely log out" isDestructive />
        </ListSection>

        <div className="text-center pb-10">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">GMT Platform v3.0.1</p>
        </div>
      </main>
    </div>
  );
}