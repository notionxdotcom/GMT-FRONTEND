import React, { useState, useEffect } from 'react';
import { 
  Zap, Copy, Menu, User, Loader2, History, CalendarCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import useAuthStore from '../../store/authstore';
import api from '../../interceptor';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const logoPath = '/src/assets/logo.jpeg';
  const [activeTab, setActiveTab] = useState('Home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dbProducts, setDbProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);

  // States for Active Deposit logic
  const [activeDeposit, setActiveDeposit] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const { user, wallet, syncAppData } = useAuthStore();

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        await Promise.all([
          syncAppData(),
          checkActiveDeposit(),
          fetchProducts()
        ]);
      } catch (error) {
        console.error("Initialization failed:", error);
      } finally {
        setProductsLoading(false);
      }
    };
    initializeDashboard();
  }, []);

  const checkActiveDeposit = async () => {
    try {
      const response = await api.get('/wallet/active-deposit');
      
      /** * THE STRICT CHECK:
       * Only show the banner if status is 'pending'.
       * If it's 'processing', 'success', or 'failed', activeDeposit remains null.
       */
      if (response.data.active && response.data.deposit.status === 'pending') {
        setActiveDeposit(response.data.deposit);
      } else {
        setActiveDeposit(null);
      }
    } catch (error) {
      console.error("Failed to check active deposit:", error);
      setActiveDeposit(null);
    }
  };

  const handleCancelDeposit = async (id) => {
    if (!window.confirm("Discard this deposit request?")) return;
    try {
      setCancelLoading(true);
      await api.post(`/wallet/cancel-deposit/${id}`);
      toast.success("Deposit cancelled");
      setActiveDeposit(null); 
    } catch (error) {
      toast.error("Failed to cancel request");
    } finally {
      setCancelLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products/all'); 
      setDbProducts(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch investment plans:", error);
    }
  };

  const handleInvest = async (productId, productName) => {
    if (!window.confirm(`Confirm investment in ${productName}?`)) return;
    try {
      setBuyingId(productId);
      const response = await api.post('/products/buy-product', { productId });
      if (response.data.status === "success") {
        toast.success("Investment active!");
        syncAppData(); 
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Purchase failed.");
    } finally {
      setBuyingId(null);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Referral code copied!");
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
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-800 leading-tight">
                Welcome, {user?.phoneNumber || 'User'}!
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/transactions')} className="text-gray-500 p-2.5 bg-gray-50 rounded-full">
              <History size={22} />
            </button>
            <button onClick={() => navigate('/profile')} className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-[#006B5E] shadow-sm">
              <User size={20} />
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* --- STRICTLY PENDING BANNER --- */}
          {activeDeposit && (
            <div className="animate-in slide-in-from-top-4 duration-500 rounded-[2rem] p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-4 border-l-8 bg-[#1E293B] border-[#00D084]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <CalendarCheck className="text-[#00D084]" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Unfinished Recharge</h4>
                  <p className="text-slate-400 text-sm">₦{Number(activeDeposit.amount).toLocaleString()} • Ref: {activeDeposit.description}</p>
                </div>
              </div>
              
              <div className="flex gap-3 w-full md:w-auto">
                <button 
                  onClick={() => handleCancelDeposit(activeDeposit.ledger_id)}
                  disabled={cancelLoading}
                  className="flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white border border-slate-700 transition-all"
                >
                  {cancelLoading ? <Loader2 size={16} className="animate-spin" /> : "Cancel"}
                </button>
                <button 
                  onClick={() => navigate('/confirm-deposit', { 
                    state: { 
                      amount: activeDeposit.amount, 
                      reference: activeDeposit.description, 
                      transactionId: activeDeposit.ledger_id 
                    } 
                  })}
                  className="flex-1 md:flex-none bg-[#00D084] hover:bg-[#00b975] text-white px-8 py-3 rounded-xl font-black transition-all shadow-lg"
                >
                  Complete Now
                </button>
              </div>
            </div>
          )}

          {/* BALANCE SECTION */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-gradient-to-br from-[#005F55] to-[#007B6E] rounded-[2.5rem] p-6 md:p-10 text-white shadow-xl relative min-h-[240px] flex flex-col justify-between">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <p className="text-emerald-200 text-xs font-bold uppercase tracking-widest mb-2 opacity-80">Portfolio Balance</p>
                  <h3 className="text-4xl md:text-6xl font-black tracking-tight">
                    ₦{wallet?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                  </h3>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 cursor-pointer" onClick={() => handleCopy(user?.referral_code)}>
                  <p className="text-[10px] uppercase font-black text-emerald-100 mb-1">Referral ID</p>
                  <div className="flex items-center gap-4">
                    <span className="font-bold tracking-widest text-lg">{user?.referral_code || '-------'}</span>
                    <Copy size={16} className={copied ? "text-emerald-300" : "text-white"} />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <Link to="/deposit" className="flex-1 md:flex-none">
                  <button className="w-full bg-white text-[#006B5E] px-10 py-4 rounded-2xl font-black shadow-lg">Recharge</button>
                </Link>
                <Link to="/withdraw" className="flex-1 md:flex-none">
                  <button className="w-full bg-emerald-900/40 text-white px-10 py-4 rounded-2xl font-black border border-white/20 backdrop-blur-sm">Withdraw</button>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Platform Summary</h4>
              <div className="space-y-4">
                <InfoRow label="Total Invested" value={`₦${wallet.totalDeposit?.toLocaleString() || 0}`} />
                <InfoRow label="Service Fee" value="20%" />
              </div>
            </div>
          </div>

          {/* PRODUCTS SECTION */}
          <section className="pb-12">
            <h3 className="text-xl font-black text-gray-800 mb-8 px-2">Available Investment Plans</h3>
            {productsLoading ? (
              <div className="flex justify-center items-center py-20"><Loader2 className="animate-spin text-emerald-600" size={40} /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dbProducts.map((pkg) => (
                  <InvestmentCard key={pkg.id} pkg={pkg} onInvest={handleInvest} isBuying={buyingId === pkg.id} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

/* HELPERS */
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
    <span className="text-gray-400 text-[10px] font-black uppercase tracking-wider">{label}</span>
    <span className="text-gray-800 font-black">{value}</span>
  </div>
);

const InvestmentCard = ({ pkg, onInvest, isBuying }) => (
  <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
    <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 w-fit mb-4"><Zap size={24} /></div>
    <h4 className="text-xl font-black text-gray-800 mb-1">{pkg.name}</h4>
    <p className="text-gray-400 text-xs mb-6 font-bold">Daily yield: {pkg.daily_yield}%</p>
    <div className="flex items-center justify-between">
      <p className="text-lg font-black text-gray-800">₦{Number(pkg.price).toLocaleString()}</p>
      <button 
        onClick={() => onInvest(pkg.id, pkg.name)} 
        disabled={isBuying} 
        className="bg-[#006B5E] text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50"
      >
        {isBuying ? <Loader2 size={20} className="animate-spin" /> : 'Invest'}
      </button>
    </div>
  </div>
);

export default Dashboard;