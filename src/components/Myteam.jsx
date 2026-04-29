import React, { useEffect, useState } from 'react';
import { Users, UserPlus, ArrowLeft, Share2, Calendar, TrendingUp, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../interceptor';

const MyTeam = () => {
  const navigate = useNavigate();
  // Changed state to hold levels separately
  const [network, setNetwork] = useState({ level1: [], level2: [], level3: [] });
  const [totalCommission, setTotalCommission] = useState(0);
  const [activeTab, setActiveTab] = useState('level1'); // UI Tab state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Updated API call to your new tiered-referral endpoint
        const [networkRes, ledgerRes] = await Promise.all([
          api.get('/wallet/getreferralchain'), // Ensure this matches your new backend route
          api.get('/user/ledger')
        ]);

        setNetwork(networkRes.data.data || { level1: [], level2: [], level3: [] });

        // Calculate Total Commission
        const ledgerEntries = ledgerRes.data.data || [];
        const sum = ledgerEntries.reduce((acc, curr) => {
          const entryType = curr.entry_type?.toLowerCase().trim();
          // Updated to 'referral' to match our bulletproof script
          if (entryType === 'referral_commission') {
            const amount = parseFloat(curr.amount);
            return acc + (isNaN(amount) ? 0 : amount);
          }
          return acc;
        }, 0);

        setTotalCommission(sum);
      } catch (err) {
        console.error("Error syncing network data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper to get current list based on tab
  const currentList = network[activeTab] || [];
  const tierConfig = {
    level1: { label: "1st Tier", reward: "10%", color: "bg-emerald-500" },
    level2: { label: "2nd Tier", reward: "2%", color: "bg-blue-500" },
    level3: { label: "3rd Tier", reward: "1%", color: "bg-purple-500" },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
      {/* Header Section */}
      <div className="bg-[#006B5E] pt-14 pb-24 px-6 rounded-b-[3.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-12 -mt-12 blur-3xl"></div>
        
        <button 
          onClick={() => navigate(-1)} 
          className="text-white mb-10 p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all"
        >
          <ArrowLeft size={22} />
        </button>
        
        <div className="mb-10">
          <h1 className="text-3xl font-black text-white tracking-tight">My Network</h1>
          <p className="text-emerald-100/70 text-sm mt-1">Earning across 3 generations of referrals.</p>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl">
            <Layers className="text-emerald-300 mb-3" size={20} />
            <p className="text-[10px] text-emerald-100/60 uppercase font-black tracking-widest">Total Network</p>
            <p className="text-2xl font-bold text-white mt-1">
              {network.level1.length + network.level2.length + network.level3.length}
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl">
            <TrendingUp className="text-emerald-300 mb-3" size={20} />
            <p className="text-[10px] text-emerald-100/60 uppercase font-black tracking-widest">Total Earned</p>
            <p className="text-2xl font-bold text-white mt-1">₦{totalCommission.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Level Selector Tabs */}
      <div className="px-6 -mt-8 flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {Object.keys(tierConfig).map((lvl) => (
          <button
            key={lvl}
            onClick={() => setActiveTab(lvl)}
            className={`flex-1 min-w-[100px] py-4 px-2 rounded-2xl font-black text-[11px] uppercase tracking-tighter transition-all shadow-md ${
              activeTab === lvl 
              ? 'bg-white text-[#006B5E] scale-105' 
              : 'bg-white/60 text-gray-400 opacity-80'
            }`}
          >
            {tierConfig[lvl].label}
            <div className={`mt-1 text-[9px] ${activeTab === lvl ? 'text-emerald-600' : 'text-gray-400'}`}>
              Earn {tierConfig[lvl].reward}
            </div>
          </button>
        ))}
      </div>

      {/* Main List Section */}
      <div className="px-6">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 min-h-[300px]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-gray-800 text-lg">{tierConfig[activeTab].label} Members</h3>
            <span className="text-gray-400 text-xs font-bold">{currentList.length} total</span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
            </div>
          ) : currentList.length > 0 ? (
            <div className="space-y-6">
              {currentList.map((member, index) => (
                <div key={index} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm ${tierConfig[activeTab].color} shadow-lg shadow-gray-200`}>
                      {member.phone_number?.slice(-2) || "00"}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{member.phone_number}</p>
                      <div className="flex items-center gap-1 text-gray-400 text-[10px] font-medium">
                        <Calendar size={10} />
                        <span>Joined {new Date(member.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-emerald-600">+{tierConfig[activeTab].reward}</p>
                    <p className="text-[8px] text-gray-300 font-bold uppercase">COMMISSION</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="text-gray-300" size={32} />
              </div>
              <p className="text-gray-800 font-bold">No one here yet</p>
              <p className="text-gray-400 text-xs px-10 mt-1">Invite more people to grow your {activeTab} network!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTeam;