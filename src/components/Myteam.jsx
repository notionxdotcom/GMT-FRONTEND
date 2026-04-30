import React, { useEffect, useState } from 'react';
import { Users, UserPlus, ArrowLeft, Share2, Calendar, TrendingUp, Layers, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../interceptor';

const MyTeam = () => {
  const navigate = useNavigate();
  const [network, setNetwork] = useState({ level1: [], level2: [], level3: [] });
  const [totalCommission, setTotalCommission] = useState(0);
  const [activeTab, setActiveTab] = useState('level1');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [networkRes, ledgerRes] = await Promise.all([
          api.get('/wallet/getreferralchain'),
          api.get('/user/ledger')
        ]);

        setNetwork(networkRes.data.data || { level1: [], level2: [], level3: [] });

        const ledgerEntries = ledgerRes.data.data || [];
        const sum = ledgerEntries.reduce((acc, curr) => {
          const entryType = curr.entry_type?.toLowerCase().trim();
          if (entryType === 'referral_commission') {
            const amount = parseFloat(curr.amount);
            return acc + (isNaN(amount) ? 0 : amount);
          }
          return acc;
        }, 0);

        setTotalCommission(sum);
      } catch (err) {
        console.error("Error syncing GMT network data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const tierConfig = {
    level1: { label: "1st Tier", reward: "10%", color: "bg-blue-600", textColor: "text-blue-600" },
    level2: { label: "2nd Tier", reward: "2%", color: "bg-indigo-500", textColor: "text-indigo-500" },
    level3: { label: "3rd Tier", reward: "1%", color: "bg-slate-500", textColor: "text-slate-500" },
  };

  const currentList = network[activeTab] || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
      {/* Header Section - GMT Navy */}
      <div className="bg-[#0F172A] pt-14 pb-24 px-6 rounded-b-[3.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full -mr-12 -mt-12 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-600/5 rounded-full -ml-8 -mb-8 blur-2xl"></div>
        
        <button 
          onClick={() => navigate(-1)} 
          className="text-white mb-10 p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/5"
        >
          <ArrowLeft size={22} />
        </button>
        
        <div className="mb-10 relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck size={16} className="text-blue-400" />
            <h1 className="text-3xl font-black text-white tracking-tight">GMT Network</h1>
          </div>
          <p className="text-blue-200/60 text-sm font-medium">Earn tiered rewards across 3 referral generations.</p>
        </div>

        <div className="grid grid-cols-2 gap-5 relative z-10">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem]">
            <Layers className="text-blue-400 mb-3" size={20} />
            <p className="text-[10px] text-blue-200/50 uppercase font-black tracking-[0.15em]">Total Network</p>
            <p className="text-2xl font-black text-white mt-1 tracking-tight">
              {network.level1.length + network.level2.length + network.level3.length}
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem]">
            <TrendingUp className="text-blue-400 mb-3" size={20} />
            <p className="text-[10px] text-blue-200/50 uppercase font-black tracking-[0.15em]">Total Earned</p>
            <p className="text-2xl font-black text-white mt-1 tracking-tight">₦{totalCommission.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Level Selector Tabs */}
      <div className="px-6 -mt-8 flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide relative z-20">
        {Object.keys(tierConfig).map((lvl) => (
          <button
            key={lvl}
            onClick={() => setActiveTab(lvl)}
            className={`flex-1 min-w-[110px] py-4 px-2 rounded-2xl font-black text-[11px] uppercase tracking-wider transition-all shadow-lg ${
              activeTab === lvl 
              ? 'bg-blue-600 text-white scale-105 shadow-blue-600/20' 
              : 'bg-white text-slate-400 opacity-90 border border-slate-50'
            }`}
          >
            {tierConfig[lvl].label}
            <div className={`mt-1 text-[9px] font-bold ${activeTab === lvl ? 'text-blue-100' : 'text-slate-400'}`}>
              Yield {tierConfig[lvl].reward}
            </div>
          </button>
        ))}
      </div>

      {/* Main List Section */}
      <div className="px-6">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 min-h-[300px]">
          <div className="flex justify-between items-center mb-10">
            <div>
               <h3 className="font-black text-slate-800 text-lg tracking-tight">{tierConfig[activeTab].label} Assets</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Active GMT Connections</p>
            </div>
            <span className="bg-slate-50 text-slate-500 px-3 py-1 rounded-lg text-xs font-black">{currentList.length}</span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : currentList.length > 0 ? (
            <div className="space-y-6">
              {currentList.map((member, index) => (
                <div key={index} className="flex items-center justify-between group p-1">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm ${tierConfig[activeTab].color} shadow-xl shadow-blue-900/5`}>
                      {member.phone_number?.slice(-2) || "00"}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-sm tracking-tight">{member.phone_number}</p>
                      <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase tracking-tighter">
                        <Calendar size={10} />
                        <span>Member Since {new Date(member.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-[10px] font-black ${tierConfig[activeTab].textColor}`}>+{tierConfig[activeTab].reward}</p>
                    <p className="text-[8px] text-slate-300 font-black uppercase tracking-widest">Commission</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 rotate-12">
                <UserPlus className="text-slate-200" size={32} />
              </div>
              <p className="text-slate-800 font-black tracking-tight">Tier Currently Empty</p>
              <p className="text-slate-400 text-[11px] font-medium px-10 mt-2 max-w-xs mx-auto">
                Expand your GMT ecosystem by inviting others to the platform.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTeam;