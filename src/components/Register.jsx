import React, { useState, useEffect } from 'react';
import { Phone, Lock, Shield, Tag, Eye, EyeOff, CheckCircle2, Loader2 } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // --- Added to read URL params ---
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // 1. Form State
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    referralCode: ''
  });

  // --- 2. Auto-fill referral code from URL on load ---
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setFormData(prev => ({ ...prev, referralCode: ref }));
    }
  }, [searchParams]);

  const logoPath = '/src/assets/logo.jpeg';

  // 3. Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. Signup Logic
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

      console.log("Signup Success:", response.data);
      alert("Account created successfully!");
      navigate('/login'); 

    } catch (error) {
      const errormessage = error?.response?.data?.message || "Connection failed. Check your backend logs.";
      console.error("Signup Error:", error);
      alert(errormessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50/30 flex items-center justify-center p-4 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100/50 flex flex-col md:flex-row overflow-hidden min-h-[600px]">
        
        {/* Left Section - Branding */}
        <div className="md:w-5/12 bg-[#006B5E] p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                 <img src={logoPath} alt="Logo" className="h-full w-full object-cover" />
              </div>
              <span className="text-2xl font-semibold tracking-tight">NotionX</span>
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">Join us <br />today</h1>
            <p className="text-emerald-50/80 text-lg mb-10 max-w-xs leading-relaxed">
              Create your free account and start building your investment portfolio in minutes.
            </p>
            <div className="space-y-5">
              {["Secure & encrypted account", "Real-time portfolio tracking", "24/7 customer support"].map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300/80" />
                  <span className="text-sm font-medium text-emerald-50">{f}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="relative z-10 text-xs text-emerald-100/50 mt-12">© 2026 NotionX. All rights reserved.</p>
        </div>

        {/* Right Section - Form */}
        <div className="md:w-7/12 p-8 md:p-16 bg-white flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Create an account</h2>
            <p className="text-gray-400 font-medium">Register to continue with us</p>
            {/* Added a nice badge if a referral is detected */}
            {formData.referralCode && (
              <div className="mt-4 inline-flex items-center gap-2 bg-emerald-50 text-[#006B5E] px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
                <Tag size={12} /> Referral Applied
              </div>
            )}
          </div>

          <form className="space-y-6" onSubmit={handlesignup}>
            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number <span className="text-red-400">*</span></label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#006B5E] transition-colors" />
                <input 
                  type="tel" 
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="09065319674"
                  className="w-full bg-[#F0F5FA] border-none rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#006B5E]/20 transition-all outline-none text-gray-700 font-medium"
                />
              </div>
            </div>

            {/* Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-[#F0F5FA] border-none rounded-xl py-4 pl-12 pr-12 focus:ring-2 focus:ring-[#006B5E]/20 transition-all outline-none text-gray-700"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confirm <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full border rounded-xl py-4 pl-12 pr-12 focus:ring-2 focus:ring-[#006B5E]/20 transition-all outline-none text-gray-700 ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-100 bg-white'}`}
                  />
                </div>
              </div>
            </div>

            {/* Referral Code */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Referral Code (optional)</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleChange}
                  placeholder="eg(RpczhdwR)"
                  className="w-full border border-gray-100 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#006B5E]/20 transition-all outline-none text-gray-700 font-medium"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#006B5E] text-white font-bold py-4 rounded-xl hover:bg-[#005a4f] active:scale-[0.98] transition-all shadow-lg shadow-[#006B5E]/20 mt-4 flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Create Account"}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-500 font-medium">
            Already have an account? <Link to="/login" className="text-[#006B5E] font-bold underline decoration-2 underline-offset-4 hover:text-[#005a4f]">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;