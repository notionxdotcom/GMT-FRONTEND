import React, { useState, useEffect } from 'react';
import { 
  Zap, Copy, Menu, User, Loader2, History, CalendarCheck, 
  ShieldCheck, X, MessageCircle, Radio, ChevronRight 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import useAuthStore from '../../store/authstore';
import api from '../../interceptor';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const navigate = useNavigate();
  const logoPath = '/src/assets/logo.jpeg';
  const [activeTab, setActiveTab] = useState('Home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dbProducts, setDbProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);
  const [activeDeposit, setActiveDeposit] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const { user, wallet, syncAppData } = useAuthStore();

  // 1. Pop-up trigger on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowJoinModal(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // 2. Data Initialization
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
      if (response.data.active && response.data.deposit?.status?.toLowerCase() === 'pending') {
        setActiveDeposit(response.data.deposit);
      } else {
        setActiveDeposit(null);
      }
    } catch (error) {
      console.error("Failed to check active deposit:", error);
    }
  };

  const handleCancelDeposit = async (id) => {
    if (!window.confirm("Cancel this deposit request?")) return;
    try {
      setCancelLoading(true);
      await api.post(`/wallet/cancel-deposit/${id}`);
      toast.success("Deposit cancelled");
      setActiveDeposit(null); 
      syncAppData(); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel");
    } finally {
      setCancelLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products/all');
      const data = response.data.data || response.data || [];
      setDbProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch GMT investment plans:", error);
    }
  };

  const handleInvest = async (productId, productName) => {
    if (!window.confirm(`Confirm investment in ${productName}?`)) return;
    try {
      setBuyingId(productId);
      const response = await api.post('/products/buy-product', { productId });
      if (response.data.status === "success") {
        toast.success("GMT Investment active!");
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
    toast.success("GMT Referral code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex overflow-x-hidden relative">
      <Sidebar 
        isMenuOpen={isMenuOpen} 
        toggleMenu={() => setIsMenuOpen(!isMenuOpen)} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        logoPath={logoPath}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-blue-50 h-20 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 text-slate-600 hover:bg-blue-50 rounded-lg">
              <Menu size={24} />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-lg md:text-xl font-bold text-slate-800 leading-tight">
                GMT Dashboard | {user?.phoneNumber || 'Member'}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <button onClick={() => navigate('/transactions')} className="text-slate-500 hover:text-blue-600 p-2.5 bg-slate-50 hover:bg-blue-50 rounded-full transition-all border border-transparent hover:border-blue-100">
              <History size={22} />
            </button>

            <div className="flex items-center gap-3 border-l pl-3 md:pl-6 border-slate-100">
              <div className="hidden md:block text-right">
                <p className="text-sm font-black text-slate-800 tracking-tight">GMT-PRO</p>
              </div>
              <button onClick={() => navigate('/profile')} className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
                <User size={20} />
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {activeDeposit && (
            <div className="animate-in slide-in-from-top-4 duration-500 rounded-[2rem] p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-4 border-l-8 bg-[#0F172A] border-blue-500">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-2xl">
                  <CalendarCheck className="text-blue-400" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Pending GMT Recharge</h4>
                  <p className="text-slate-400 text-sm">₦{Number(activeDeposit.amount).toLocaleString()} • Ref: {activeDeposit.description}</p>
                </div>
              </div>
              
              <div className="flex gap-3 w-full md:w-auto">
                <button 
                  onClick={() => handleCancelDeposit(activeDeposit.ledger_id)}
                  disabled={cancelLoading}
                  className="flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white border border-slate-700 transition-all flex items-center justify-center gap-2"
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
                  className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-black transition-all active:scale-95 shadow-lg shadow-blue-900/20"
                >
                    Verify Now
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] rounded-[2.5rem] p-6 md:p-10 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[240px]">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <p className="text-blue-100 text-xs font-bold uppercase tracking-[0.2em] mb-2 opacity-80">GMT Total Balance</p>
                  <h3 className="text-4xl md:text-6xl font-black tracking-tight">
                    ₦{wallet?.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                  </h3>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 w-full md:w-auto cursor-pointer" onClick={() => handleCopy(user?.referral_code)}>
                  <p className="text-[10px] uppercase font-black text-blue-100 mb-1">GMT Referral ID</p>
                  <div className="flex items-center justify-between md:justify-start gap-4">
                    <span className="font-bold tracking-widest text-lg">{user?.referral_code || '-------'}</span>
                    <Copy size={16} className={copied ? "text-blue-300" : "text-white"} />
                  </div>
                </div>
              </div>
              <div className="relative z-10 flex gap-4 mt-8">
                <Link to="/deposit" className="flex-1 md:flex-none">
                  <button className="w-full bg-white text-blue-900 px-10 py-4 rounded-2xl font-black hover:bg-blue-50 transition-all shadow-lg active:scale-95">Recharge</button>
                </Link>
                <Link to="/withdraw" className="flex-1 md:flex-none">
                  <button className="w-full bg-blue-900/40 text-white px-10 py-4 rounded-2xl font-black border border-white/20 hover:bg-blue-900/60 transition-all active:scale-95 backdrop-blur-sm">Withdraw</button>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">GMT Platform Stats</h4>
              <div className="space-y-4">
                <InfoRow label="Active Capital" value={`₦${wallet.totalDeposit?.toLocaleString() || 0}`} />
                <InfoRow label="Trading Fee" value="20%" />
                <div className="pt-4 mt-4 border-t border-slate-50">
                   <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-tighter">
                      <ShieldCheck size={14} /> 
                      Secure GMT Assets
                   </div>
                </div>
              </div>
            </div>
          </div>

          <section className="pb-12">
            <div className="flex items-center justify-between mb-8 px-2">
                <h3 className="text-xl font-black text-slate-800">GMT Investment Plans</h3>
                <button onClick={fetchProducts} className="text-blue-600 font-bold text-sm hover:underline">Refresh List</button>
            </div>
            
            {productsLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="animate-spin text-blue-600" size={40} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dbProducts.map((pkg) => (
                  <InvestmentCard 
                    key={pkg.product_id} 
                    pkg={pkg} 
                    onInvest={handleInvest}
                    isBuying={buyingId === pkg.product_id} 
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* --- POP-OUT MODAL (Moved here for correct scoping) --- */}
      {showJoinModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500"
            onClick={() => setShowJoinModal(false)}
          ></div>

          <div className="relative bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowJoinModal(false)}
              className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mb-6 border border-blue-100">
                <ShieldCheck size={40} className="text-blue-600" />
              </div>

              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                Join the GMT <br/> Collective
              </h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-3 mb-8">
                Official Real-Time Updates
              </p>

              <div className="w-full space-y-3">
                <a href="https://chat.whatsapp.com/YOUR_LINK" target="_blank" rel="noreferrer" className="w-full flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-2xl group hover:bg-emerald-100 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-600 p-2 rounded-xl text-white"><MessageCircle size={18} /></div>
                    <div className="text-left">
                      <p className="text-[13px] font-black text-emerald-900">GMT Community</p>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase">Chat with Investors</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </a>

                <a href="https://whatsapp.com/channel/YOUR_LINK" target="_blank" rel="noreferrer" className="w-full flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-2xl group hover:bg-blue-100 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-xl text-white"><Radio size={18} /></div>
                    <div className="text-left">
                      <p className="text-[13px] font-black text-blue-900">Official Channel</p>
                      <p className="text-[10px] font-bold text-blue-600 uppercase">Market Signals</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <button 
                onClick={() => setShowJoinModal(false)}
                className="mt-8 text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] hover:text-slate-600 transition-colors"
              >
                Enter Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- HELPERS --- */
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
    <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider">{label}</span>
    <span className="text-slate-800 font-black">{value}</span>
  </div>
);

const InvestmentCard = ({ pkg, onInvest, isBuying }) => (
  <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        <Zap size={24} />
      </div>
    </div>
    <h4 className="text-xl font-black text-slate-800 mb-1">{pkg.name}</h4>
    <div className="space-y-1 mb-6">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
            Daily yield: <span className="text-blue-600">₦{Number(pkg.daily_income).toLocaleString()}</span>
        </p>
        <p className="text-slate-400 text-[11px] font-medium">
            Total Return: ₦{Number(pkg.total_return).toLocaleString()}
        </p>
    </div>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Entry Price</p>
        <p className="text-lg font-black text-slate-800">₦{Number(pkg.price).toLocaleString()}</p>
      </div>
      <button 
        onClick={() => onInvest(pkg.product_id, pkg.name)} 
        disabled={isBuying} 
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-blue-100"
      >
        {isBuying ? <Loader2 size={20} className="animate-spin" /> : 'Invest'}
      </button>
    </div>
  </div>
);

export default Dashboard;