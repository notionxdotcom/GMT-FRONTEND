import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authstore';
import useBankStore from '../../store/bankdetailsstore';


const ActionButton = ({ icon, label, color, onClick }) => (
  <button onClick={onClick} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex flex-col items-center gap-2 active:scale-95 transition-transform">
    <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
      {icon}
    </div>
    <span className="text-[12px] font-bold text-gray-700">{label}</span>
  </button>
);

const ListSection = ({ title, children, accent }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 px-1">
      <div className={`w-1 h-4 ${accent} rounded-full`}></div>
      <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">{title}</h3>
    </div>
    <div className="bg-white rounded-[24px] border border-gray-50 shadow-sm divide-y divide-gray-50 overflow-hidden">
      {children}
    </div>
  </div>
);

const ListItem = ({ icon, label, subLabel, isDestructive, isExternal, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors active:bg-gray-100 text-left">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className={`text-[14px] font-bold ${isDestructive ? 'text-red-500' : 'text-gray-800'}`}>{label}</p>
        <p className="text-[11px] text-gray-400 font-medium">{subLabel}</p>
      </div>
    </div>
    <IconChevronRight color={isDestructive ? '#EF4444' : '#D1D5DB'} isExternal={isExternal} />
  </button>
);

const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 ${active ? 'text-[#007B6E]' : 'text-gray-300'}`}>
    {icon}
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);

// --- 2. ICONS (SVGs) ---

const IconUserSmall = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#007B6E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconUserLarge = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconCopy = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>;
const IconChevronRight = ({ color, isExternal }) => (
  isExternal ? 
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> :
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);
const IconRecharge = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const IconWithdraw = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 5 7 7-7 7"/><path d="M5 12h14"/></svg>;
const IconInvite = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>;
const IconHistoryGreen = () => <div className="bg-green-100 p-2 rounded-lg"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><path d="m7 10 5 5 5-5"/></svg></div>;
const IconHistoryRed = () => <div className="bg-red-100 p-2 rounded-lg"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5"><path d="m17 14-5-5-5 5"/></svg></div>;
const IconBank = () => <div className="bg-purple-100 p-2 rounded-lg"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.5"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 6l7-3 7 3"/><path d="M4 10v11"/><path d="M20 10v11"/><path d="M8 14v3"/><path d="M12 14v3"/><path d="M16 14v3"/></svg></div>;
const IconLock = () => <div className="bg-amber-100 p-2 rounded-lg"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>;
const IconTelegram = () => <div className="bg-blue-100 p-2 rounded-lg"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.5"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg></div>;
const IconSignOut = () => <div className="bg-red-50 p-2 rounded-lg"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></div>;
const IconHome = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconProducts = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const IconTeams = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconUserActive = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;




export default function Profile() {
  const navigate = useNavigate();
  const { user, wallet, clearAuth } = useAuthStore();
  const { bankData, clearBankData } = useBankStore();

  const handleSignOut = () => {
    clearAuth();
    clearBankData();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-[#1A1C1E] pb-32">
      <header className="bg-white px-6 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-[20px] font-bold">My Profile</h1>
          <p className="text-[12px] text-gray-400 font-medium">Account overview & settings</p>
        </div>
        <div className="w-10 h-10 bg-[#F0FDFB] rounded-full flex items-center justify-center border border-[#CCF0EB]">
          <IconUserSmall />
        </div>
      </header>

      <main className="px-5 mt-4 space-y-6">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#005F55] to-[#007B6E] rounded-[28px] p-6 shadow-xl shadow-[#007B6E]/20 text-white">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
              <IconUserLarge />
            </div>
            <div>
              <h2 className="text-[18px] font-bold">{user?.phoneNumber || 'Member'}</h2>
              <p className="text-[11px] text-white/70 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span> 
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'April 2026'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <p className="text-[10px] uppercase tracking-wider font-bold text-white/60 mb-1">Balance</p>
              <p className="text-[20px] font-black">₦{wallet?.balance?.toLocaleString() || '0'}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex justify-between items-center">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-white/60 mb-1">Referral Code</p>
                <p className="text-[15px] font-bold">{user?.referral_code || '---'}</p>
              </div>
              <button onClick={() => navigator.clipboard.writeText(user?.referral_code)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <IconCopy />
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-3">
          <ActionButton onClick={() => navigate('/recharge')} icon={<IconRecharge />} label="Recharge" color="bg-green-50 text-[#007B6E]" />
          <ActionButton onClick={() => navigate('/withdraw')} icon={<IconWithdraw />} label="Withdraw" color="bg-purple-50 text-[#7C3AED]" />
          <ActionButton icon={<IconInvite />} label="Invite" color="bg-blue-50 text-[#3B82F6]" />
        </section>

        <ListSection title="Transaction Records" accent="bg-[#007B6E]">
          <ListItem icon={<IconHistoryGreen />} label="Recharge History" subLabel="View all deposits" />
          <ListItem icon={<IconHistoryRed />} label="Withdrawal History" subLabel="View all withdrawals" />
        </ListSection>

        <ListSection title="Account Settings" accent="bg-[#7C3AED]">
          <ListItem onClick={() => navigate('/bank-account')} icon={<IconBank />} label="Bank Account" subLabel={bankData ? `${bankData.bank_name} • ${bankData.account_number}` : "Manage payout account"} />
          <ListItem icon={<IconLock />} label="Change Password" subLabel="Update your security" />
        </ListSection>

        <ListSection title="Support & Community" accent="bg-[#3B82F6]">
          <ListItem icon={<IconTelegram />} label="Telegram Channel" subLabel="Join our community" isExternal />
          <ListItem onClick={handleSignOut} icon={<IconSignOut />} label="Sign Out" subLabel="Log out of your account" isDestructive />
        </ListSection>
      </main>

      <nav className="fixed bottom-6 left-0 right-0 flex justify-center px-5 z-50">
        <div className="bg-white rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 px-8 py-3 flex justify-between items-center w-full max-w-[400px]">
          <NavItem onClick={() => navigate('/dashboard')} icon={<IconHome />} label="Home" />
          <NavItem icon={<IconProducts />} label="My Products" />
          <NavItem icon={<IconTeams />} label="Teams" />
          <NavItem icon={<IconUserActive />} label="Profile" active />
        </div>
      </nav>
    </div>
  );
}