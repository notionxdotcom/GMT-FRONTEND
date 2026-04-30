import React, { useState } from 'react';
import { Phone, Lock, Eye, EyeOff, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useBankStore from '../../store/bankdetailsstore';
import api from '../../interceptor';
import useAuthStore from '../../store/authstore';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAuth, syncAppData } = useAuthStore();
  const fetchBankDetails = useBankStore((state) => state.fetchBankDetails);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: ''
  });

  const logoPath = '/src/assets/logo.jpeg';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { phoneNumber, password } = formData;

    if (!phoneNumber || !password) {
      alert("Please enter both your phone number and password.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(`/auth/login`, {
        phoneNumber,
        password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user_role', response.data.user.role || 'user');
      }
      setAuth(response.data.user, response.data.token);

      console.log("Login & Parallel Sync Success");
      navigate('/dashboard'); 

      await Promise.all([
        syncAppData(),
        fetchBankDetails()
      ]);

    } catch (error) {
      const errormessage = error?.response?.data?.message || "Invalid credentials.";
      alert(errormessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl shadow-blue-200/40 flex flex-col md:flex-row overflow-hidden min-h-[600px] border border-blue-50">
        
        {/* Left Section - GMT Branding */}
        <div className="md:w-5/12 bg-[#0F172A] p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-indigo-600/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-lg shadow-blue-500/20">
                 <img src={logoPath} alt="Logo" className="h-full w-full object-cover" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">GMT</span>
            </div>
            <h1 className="text-5xl font-black mb-6 leading-[1.1] tracking-tight">Welcome <br />Back</h1>
            <p className="text-blue-100/70 text-lg mb-10 max-w-xs leading-relaxed">
              Access your GMT portfolio and monitor your investment growth in real-time.
            </p>
            <div className="space-y-5">
              {["Bank-grade security", "Encrypted transactions", "Real-time GMT yields"].map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="bg-blue-500/20 p-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-sm font-semibold text-blue-50/90">{f}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="relative z-10 text-xs text-blue-300/40 mt-12 font-medium uppercase tracking-widest">© 2026 GMT Secure Ecosystem.</p>
        </div>

        {/* Right Section - Login Form */}
        <div className="md:w-7/12 p-8 md:p-16 bg-white flex flex-col justify-center">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="text-blue-600 w-5 h-5" />
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Sign In</h2>
            </div>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">Secure Member Portal</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="tel" 
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter registered number"
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 focus:border-blue-600/10 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all outline-none text-slate-700 font-bold placeholder:font-normal"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Password</label>
                <Link to="/forgot-password" size="sm" className="text-xs font-black text-blue-600 hover:text-blue-700 transition-colors">Forgot password?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-12 focus:border-blue-600/10 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all outline-none text-slate-700 font-bold"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 active:scale-[0.97] transition-all shadow-xl shadow-blue-600/20 mt-4 flex justify-center items-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Log in"}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-50 text-center">
            <p className="text-slate-500 font-bold text-sm">
              New to the platform? <Link to="/register" className="text-blue-600 font-black hover:underline decoration-2 underline-offset-4">Create GMT Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;