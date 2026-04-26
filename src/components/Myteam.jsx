import React, { useEffect, useState } from 'react';
import { Users, UserPlus, ArrowLeft, Share2, Calendar, Wallet, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../interceptor';

const MyTeam = () => {
  const navigate = useNavigate();
  const [referrals, setReferrals] = useState([]);
  const [totalCommission, setTotalCommission] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching both the team list and the ledger simultaneously
        const [referralRes, ledgerRes] = await Promise.all([
          api.get('/user/my-referrals'),
          api.get('/user/ledger')
        ]);

        // 1. Set the team members list
        setReferrals(referralRes.data.data || []);

        // 2. Calculate Total Commission from the Ledger
        // We filter for 'referral_bonus' types linked to your wallet_id
        const ledgerEntries = ledgerRes.data.data || [];
        const sum = ledgerEntries.reduce((acc, curr) => {
  // 1. Clean the type string (remove spaces and make lowercase)
  const entryType = curr.entry_type?.toLowerCase().trim();
  
  // 2. Check for the match
  if (entryType === 'referral_commission') {
    // 3. Ensure the amount is treated as a number
    // parseFloat handles strings like "500.00" from Postgres
    const amount = parseFloat(curr.amount);
    return acc + (isNaN(amount) ? 0 : amount);
  }
  
  return acc;
}, 0);

setTotalCommission(sum);
      } catch (err) {
        console.error("Error syncing team data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
      {/* Header Section - Increased spacing and rounded corners */}
      <div className="bg-[#006B5E] pt-14 pb-24 px-6 rounded-b-[3.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-12 -mt-12 blur-3xl"></div>
        
        <button 
          onClick={() => navigate(-1)} 
          className="text-white mb-10 p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all"
        >
          <ArrowLeft size={22} />
        </button>
        
        <div className="mb-10">
          <h1 className="text-3xl font-black text-white tracking-tight">My Team</h1>
          <p className="text-emerald-100/70 text-sm mt-1">Track your network and earned commissions.</p>
        </div>

        {/* Stats Cards - Added more padding and gap */}
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-lg">
            <Users className="text-emerald-300 mb-3" size={20} />
            <p className="text-[10px] text-emerald-100/60 uppercase font-black tracking-widest">Team Size</p>
            <p className="text-2xl font-bold text-white mt-1">{referrals.length}</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-lg">
            <TrendingUp className="text-emerald-300 mb-3" size={20} />
            <p className="text-[10px] text-emerald-100/60 uppercase font-black tracking-widest">Total Earned</p>
            <p className="text-2xl font-bold text-white mt-1">₦{totalCommission.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* List Section - Increased top margin for better separation */}
      <div className="px-6 -mt-10">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 min-h-[400px]">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-bold text-gray-800 text-lg tracking-tight">Recent Referrals</h3>
            <span className="bg-emerald-50 text-[#006B5E] text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter">
              Active Members
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Fetching Ledger...</p>
            </div>
          ) : referrals.length > 0 ? (
            <div className="space-y-8">
              {referrals.map((member, index) => (
                <div key={index} className="flex items-center justify-between group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#006B5E] font-black text-lg group-hover:bg-[#006B5E] group-hover:text-white transition-all">
                      {member.phone_number?.slice(-2) || "00"}
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-gray-800">{member.phone_number}</p>
                      <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                        <Calendar size={12} />
                        <span>Joined {new Date(member.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      ACTIVE
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                <UserPlus className="text-gray-300" size={40} />
              </div>
              <div>
                <p className="text-gray-800 font-bold text-lg">No referrals yet</p>
                <p className="text-gray-400 text-sm px-10">Start sharing your link to earn 10% commission on every deposit.</p>
              </div>
              <button 
                onClick={() => navigate('/profile')}
                className="flex items-center gap-3 bg-[#006B5E] text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-900/20 active:scale-95 transition-all"
              >
                <Share2 size={18} />
                Get Invite Link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTeam;