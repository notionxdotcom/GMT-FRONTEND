import React, { useEffect, useState } from 'react';
import { Users, UserPlus, ArrowLeft, Share2, Calendar, Wallet, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../interceptor';

const MyTeam = () => {
  const navigate = useNavigate();
  const [referrals, setReferrals] = useState([]);
  const [totalBonus, setTotalBonus] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch referral list
        const referralRes = await api.get('/user/my-referrals');
        setReferrals(referralRes.data.data || []);

        // 2. Fetch bonus from Ledger (Filter for referral/bonus types)
        const ledgerRes = await api.get('/user/ledger'); 
        const ledgerData = ledgerRes.data.data || [];
        
        // Summing up ledger entries that are marked as referral bonuses
        const bonusSum = ledgerData
          .filter(entry => entry.type === 'referral_bonus' || entry.description?.toLowerCase().includes('bonus'))
          .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
          
        setTotalBonus(bonusSum);
      } catch (err) {
        console.error("Error fetching team data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Header Section with increased padding */}
      <div className="bg-[#006B5E] pt-14 pb-24 px-6 rounded-b-[3.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-12 -mt-12 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        
        <button 
          onClick={() => navigate(-1)} 
          className="text-white mb-8 p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all backdrop-blur-sm"
        >
          <ArrowLeft size={22} />
        </button>
        
        <div className="space-y-1 mb-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">My Network</h1>
          <p className="text-emerald-100/70 text-sm font-medium">Earn 10% commission on your team's growth.</p>
        </div>

        {/* Stats Grid with more breathing room */}
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-white/15 backdrop-blur-lg border border-white/20 p-5 rounded-3xl shadow-inner">
            <div className="bg-emerald-400/20 w-8 h-8 rounded-lg flex items-center justify-center mb-3">
              <Users className="text-emerald-200" size={18} />
            </div>
            <p className="text-[10px] text-emerald-100/60 uppercase font-black tracking-widest">Total Team</p>
            <p className="text-2xl font-bold text-white mt-1">{referrals.length}</p>
          </div>
          
          <div className="bg-white/15 backdrop-blur-lg border border-white/20 p-5 rounded-3xl shadow-inner">
            <div className="bg-emerald-400/20 w-8 h-8 rounded-lg flex items-center justify-center mb-3">
              <TrendingUp className="text-emerald-200" size={18} />
            </div>
            <p className="text-[10px] text-emerald-100/60 uppercase font-black tracking-widest">Ledger Bonus</p>
            <p className="text-2xl font-bold text-white mt-1">₦{totalBonus.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Main List Container */}
      <div className="px-6 -mt-10">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-emerald-900/5 border border-gray-100 p-8 min-h-[450px]">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-black text-gray-900 text-xl tracking-tight">Team Members</h3>
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full text-[11px] font-bold">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Live Tracking
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-28 space-y-4">
              <div className="w-12 h-12 border-[3px] border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Syncing Ledger...</p>
            </div>
          ) : referrals.length > 0 ? (
            <div className="space-y-8">
              {referrals.map((member, index) => (
                <div key={index} className="flex items-center justify-between group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-emerald-700 font-black text-lg border border-gray-100 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                      {member.phone_number?.slice(-2) || "00"}
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-gray-800 text-base">{member.phone_number}</p>
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Calendar size={13} className="opacity-70" />
                        <span className="text-[11px] font-medium">Joined {new Date(member.created_at).toLocaleDateString('en-NG')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 px-4 py-2 rounded-xl group-hover:bg-emerald-50 transition-colors">
                    <p className="text-[10px] text-gray-400 font-bold uppercase text-right mb-0.5">Status</p>
                    <p className="text-xs font-black text-emerald-600">ACTIVE</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State with more vertical space */
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center">
                <UserPlus className="text-emerald-200" size={48} />
              </div>
              <div className="space-y-2">
                <p className="text-gray-800 font-black text-lg">No one here yet</p>
                <p className="text-gray-400 text-sm max-w-[200px] mx-auto">Invite your friends using your referral link to earn 10% on deposits.</p>
              </div>
              <button 
                onClick={() => navigate('/profile')}
                className="flex items-center gap-3 bg-[#006B5E] text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-900/20 active:scale-95 transition-all hover:bg-[#005a4f]"
              >
                <Share2 size={18} />
                Get Referral Link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTeam;