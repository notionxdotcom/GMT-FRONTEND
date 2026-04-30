import React, { useState, useEffect } from 'react';
import { Phone, Lock, Shield, Tag, Eye, EyeOff, CheckCircle2, Loader2, Globe } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    referralCode: ''
  });

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setFormData(prev => ({ ...prev, referralCode: ref }));
    }
  }, [searchParams]);

  const logoPath = '/src/assets/logo.jpeg';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlesignup = async (e) => {
    e.preventDefault();
    const { phoneNumber, password, confirmPassword, referralCode } = formData;

    if (!phoneNumber || !password || !confirmPassword) {
      alert("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const baseUrl = 'https://sublime-optimism-production-20d2.up.railway.app'; 
      const response = await axios.post(`${baseUrl}/api/auth/signup`, {
        phoneNumber,
        password,
        referralCode
      });

      alert("GMT Account created successfully!");
      navigate('/login'); 
    } catch (error) {
      const errormessage = error?.response?.data?.message || "Connection failed. Check your network.";
      alert(errormessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-[3rem] shadow-2xl shadow-blue-900/10 flex flex-col md:flex-row overflow-hidden min-h-[650px] border border-slate-100">
        
        {/* Left Section - GMT Branding */}
        <div className="md:w-5/12 bg-[#0F172A] p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-blue-600/20 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-48 h-48 bg-indigo-500/10 rounded-full blur-[60px]"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center overflow-hidden border border-white/20 shadow-xl">
                 <img src={logoPath} alt="Logo" className="h-full w-full object-cover" />
              </div>
              <span className="text-2xl font-black tracking-tighter">GMT GLOBAL</span>
            </div>
            
            <h1 className="text-5xl font-black mb-6 leading-[1.1] tracking-tight">Secure <br />Your Future.</h1>
            <p className="text-blue-100/60 text-lg mb-12 max-w-xs font-medium leading-relaxed">
              Join the elite GMT network and unlock tiered investment yields in seconds.
            </p>
            
            <div className="space-y-6">
              {[
                "Institutional-grade security", 
                "Automated yield distribution", 
                "Tiered referral ecosystem"
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="bg-blue-500/20 p-1.5 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-sm font-bold text-blue-50/90 tracking-tight">{f}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative z-10 flex items-center gap-2 mt-12 opacity-40">
            <Globe size={14} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">GMT Protocol v2.6</p>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="md:w-7/12 p-8 md:p-16 bg-white flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Get Started</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Authorized Access Registration</p>
            
            {formData.referralCode && (
              <div className="mt-6 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black border border-blue-100 uppercase tracking-widest shadow-sm shadow-blue-100/50">
                <Tag size={12} className="animate-pulse" /> Referral Verified
              </div>
            )}
          </div>

          <form className="space-y-6" onSubmit={handlesignup}>
            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone number</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-focus-within:bg-blue-50 transition-colors">
                  <Phone className="w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input 
                  type="tel" 
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter Phone Number"
                  className="w-full bg-slate-50 border-2 border-transparent rounded-[1.25rem] py-4 pl-16 pr-4 focus:bg-white focus:border-blue-600/20 transition-all outline-none text-slate-700 font-black tracking-tight"
                />
              </div>
            </div>

            {/* Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border-2 border-transparent rounded-[1.25rem] py-4 pl-12 pr-12 focus:bg-white focus:border-blue-600/20 transition-all outline-none text-slate-700 font-black"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative group">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full border-2 rounded-[1.25rem] py-4 pl-12 pr-4 transition-all outline-none text-slate-700 font-black ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-100 bg-red-50 text-red-600' : 'border-transparent bg-slate-50 focus:bg-white focus:border-blue-600/20'}`}
                  />
                </div>
              </div>
            </div>

            {/* Referral Code */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Referral Code (Optional)</label>
              <div className="relative group">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="text" 
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleChange}
                  placeholder="Invite Code"
                  className="w-full bg-slate-50 border-2 border-transparent rounded-[1.25rem] py-4 pl-12 pr-4 focus:bg-white focus:border-blue-600/20 transition-all outline-none text-slate-700 font-black uppercase tracking-widest"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-black py-5 rounded-[1.25rem] hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-600/20 mt-4 flex justify-center items-center gap-3 uppercase tracking-widest text-sm"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  <Shield size={18} />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-10 text-slate-400 font-bold text-xs uppercase tracking-widest">
            Alredy have an account ? <Link to="/login" className="text-blue-600 hover:text-blue-800 transition-colors border-b-2 border-blue-600/20 pb-0.5">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;