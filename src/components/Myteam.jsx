import React, { useEffect, useState } from 'react';
import { Users, UserPlus, ArrowLeft, Share2, Calendar, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../interceptor';

const MyTeam = () => {
  const navigate = useNavigate();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        // Using your interceptor-based api instance
        const response = await api.get('/user/my-referrals');
        setReferrals(response.data.data || []);
      } catch (err) {
        console.error("Error fetching team:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  // Calculate total bonus if your API returns a commission field
  const totalBonus = referrals.reduce((acc, curr) => acc + (Number(curr.commission_earned) || 0), 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header Section */}
      <div className="bg-[#006B5E] pt-12 pb-20 px-6 rounded-b-[3rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        
        <button 
          onClick={() => navigate(-1)} 
          className="text-white mb-6 p-2 hover:bg-white/10 rounded-full transition-all"
        >
          <ArrowLeft size={24} />
        </button>
        
        <h1 className="text-3xl font-bold text-white mb-2">My Team</h1>
        <p className="text-emerald-50/70 mb-8">You earn 10% on every deposit your team makes.</p>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
            <Users className="text-emerald-300 mb-2" size={20} />
            <p className="text-xs text-emerald-50/60 uppercase font-bold tracking-wider">Total Members</p>
            <p className="text-2xl font-bold text-white">{referrals.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
            <Wallet className="text-emerald-300 mb-2" size={20} />
            <p className="text-xs text-emerald-50/60 uppercase font-bold tracking-wider">Total Bonus</p>
            <p className="text-2xl font-bold text-white">₦{totalBonus.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* List Section */}
      <div className="px-6 -mt-8 mb-10">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 text-lg">Team Members</h3>
            <span className="bg-emerald-50 text-[#006B5E] text-xs font-bold px-3 py-1 rounded-full">
              Newest
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#006B5E] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400 text-sm">Loading your team...</p>
            </div>
          ) : referrals.length > 0 ? (
            <div className="space-y-6">
              {referrals.map((member, index) => (
                <div key={index} className="flex items-center justify-between group border-b border-gray-50 pb-4 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#006B5E] font-bold">
                      {member.phone_number?.slice(-2) || "??"}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{member.phone_number}</p>
                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <Calendar size={12} />
                        <span>Joined {new Date(member.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-medium font-bold text-emerald-600">
                      ₦{(Number(member.commission_earned) || 0).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Earned</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="text-gray-300" size={40} />
              </div>
              <p className="text-gray-500 font-medium mb-6">No team members yet.<br/>Share your link to start earning!</p>
              <button 
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 bg-[#006B5E] text-white px-8 py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-all"
              >
                <Share2 size={18} />
                Invite Friends
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTeam;