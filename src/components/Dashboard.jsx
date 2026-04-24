import React, { useState, useEffect } from 'react';
import { 
  ArrowDownCircle, ArrowUpCircle, CalendarCheck, UserPlus, 
  Zap, Copy, Menu, Bell, User, ChevronRight, Loader2 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from './sidebar';
import useAuthStore from '../../store/authstore';
import api from '../../interceptor';
import toast from 'react-hot-toast'; // Optional: for better notifications

const Dashboard = () => {
  const logoPath = '/src/assets/logo.jpeg';
  const [activeTab, setActiveTab] = useState('Home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dbProducts, setDbProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null); // Track which product is being bought

  const { user, wallet, syncAppData } = useAuthStore();

  useEffect(() => {
    syncAppData(); 
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await api.get('/products/all'); 
      setDbProducts(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch investment plans:", error);
    } finally {
      setProductsLoading(false);
    }
  };

  // --- NEW BUY LOGIC ---
  const handleInvest = async (productId, productName) => {
    if (!window.confirm(`Confirm investment in ${productName}?`)) return;

    try {
      setBuyingId(productId);
      const response = await api.post('/products/buy-product', { productId });

      if (response.data.success) {
        alert("Success! Your investment is active. First yield in 24hrs.");
        syncAppData(); // Refresh the wallet balance immediately
      } else {
        alert(response.data.message || "Purchase failed.");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Connection error. Try again.";
      alert(errorMsg);
    } finally {
      setBuyingId(null);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex overflow-x-hidden">
      <Sidebar 
        isMenuOpen={isMenuOpen} 
        toggleMenu={() => setIsMenuOpen(!isMenuOpen)} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        logoPath={logoPath}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Menu size={24} />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 leading-tight">
                Welcome, {user?.phoneNumber || 'User'}!
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <button className="text-gray-400 hover:text-gray-600 relative p-2 bg-gray-50 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l pl-3 md:pl-6 border-gray-100">
              <div className="hidden md:block text-right">
                <p className="text-sm font-black text-gray-800">{user?.phoneNumber || '0000000000'}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-center text-[#006B5E]">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Balance Card */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-gradient-to-br from-[#005F55] to-[#007B6E] rounded-[2.5rem] p-6 md:p-10 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[240px]">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <p className="text-emerald-200 text-xs font-bold uppercase tracking-[0.2em] mb-2 opacity-80">Portfolio Balance</p>
                  <h3 className="text-4xl md:text-6xl font-black tracking-tight">
                    ₦{wallet?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                  </h3>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 w-full md:w-auto cursor-pointer" onClick={() => handleCopy(user?.referral_code)}>
                  <p className="text-[10px] uppercase font-black text-emerald-100 mb-1">Referral ID</p>
                  <div className="flex items-center justify-between md:justify-start gap-4">
                    <span className="font-bold tracking-widest text-lg">{user?.referral_code || '-------'}</span>
                    <Copy size={16} className={copied ? "text-emerald-300" : "text-white"} />
                  </div>
                </div>
              </div>
              <div className="relative z-10 flex gap-4 mt-8">
                <Link to="/deposit" className="flex-1 md:flex-none">
                  <button className="w-full bg-white text-[#006B5E] px-10 py-4 rounded-2xl font-black hover:bg-emerald-50 transition-all shadow-lg active:scale-95">Recharge</button>
                </Link>
                <Link to="/withdraw" className="flex-1 md:flex-none">
                  <button className="w-full bg-emerald-900/40 text-white px-10 py-4 rounded-2xl font-black border border-white/20 hover:bg-emerald-900/60 transition-all active:scale-95 backdrop-blur-sm">Withdraw</button>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Platform Summary</h4>
              <div className="space-y-4">
                <InfoRow label="Total Invested" value={`₦${wallet.totalDeposit?.toLocaleString() || 0}`} />
                <InfoRow label="Daily Bonus" value="₦50" />
                <InfoRow label="Service Fee" value="15%" />
              </div>
              <div className="mt-6 bg-emerald-50 p-4 rounded-2xl border border-emerald-100 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[#006B5E] text-[10px] font-black uppercase">Account Status</p>
                    <p className="text-[#006B5E] text-sm font-black">{user?.isVerified ? 'Verified' : 'Verification Pending'}</p>
                  </div>
                  <ChevronRight className="text-[#006B5E]" size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Investment Plans */}
          <section className="pb-12">
            <div className="flex items-center justify-between mb-8 px-2">
                <h3 className="text-xl font-black text-gray-800">Available Investment Plans</h3>
                <button onClick={fetchProducts} className="text-emerald-600 font-bold text-sm hover:underline">Refresh</button>
            </div>
            
            {productsLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-emerald-600" size={40} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dbProducts.map((pkg, i) => (
                  <InvestmentCard 
                    key={pkg.id || i} 
                    pkg={pkg} 
                    index={i} 
                    onInvest={handleInvest}
                    isBuying={buyingId === pkg.id} 
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

const InvestmentCard = ({ pkg, index, onInvest, isBuying }) => (
  <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
    <div className="bg-[#006B5E] p-8 text-white flex justify-between items-center relative overflow-hidden">
      <div className="relative z-10">
        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 font-black mb-2">
          {index + 1}
        </div>
        <h4 className="font-black text-xl">{pkg.name}</h4>
      </div>
      <p className="text-3xl font-black relative z-10 tracking-tighter">
        ₦{Number(pkg.price).toLocaleString()}
      </p>
      <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
        <Zap size={100} fill="white" />
      </div>
    </div>
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-3 gap-2">
        <StatBox label="Term" value={`${pkg.duration_days} Days`} />
        <StatBox label="Daily" value={`₦${Number(pkg.daily_income).toLocaleString()}`} />
        <StatBox label="Total" value={`₦${Number(pkg.total_return).toLocaleString()}`} />
      </div>
      <button 
        disabled={isBuying}
        onClick={() => onInvest(pkg.product_id, pkg.name)}
        className="w-full bg-[#006B5E] text-white py-5 rounded-[1.5rem] font-black flex items-center justify-center gap-3 hover:bg-[#005F55] active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isBuying ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <>
            <Zap size={20} fill="white" /> Invest Now
          </>
        )}
      </button>
    </div>
  </div>
);

const StatBox = ({ label, value }) => (
  <div className="text-center bg-gray-50 p-3 rounded-2xl">
    <p className="text-[9px] text-gray-400 font-bold uppercase mb-1 tracking-widest">{label}</p>
    <p className="font-black text-gray-800 text-xs md:text-sm whitespace-nowrap">{value}</p>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</span>
    <span className="text-sm font-black text-gray-800">{value}</span>
  </div>
);

const QuickAction = ({ icon, label, sub, color }) => {
  const colors = {
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600'
  };

  return (
    <button className="w-full bg-white p-5 md:p-7 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center gap-3 hover:shadow-md hover:border-emerald-200 transition-all active:scale-95 group">
      <div className={`w-14 h-14 ${colors[color]} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
        {React.cloneElement(icon, { size: 28 })}
      </div>
      <div className="text-center">
        <p className="text-sm font-black text-gray-800">{label}</p>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{sub}</p>
      </div>
    </button>
  );
};

export default Dashboard;