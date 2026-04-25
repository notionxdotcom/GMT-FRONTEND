import React, { useState } from 'react';
import { Phone, Lock, Eye, EyeOff, CheckCircle2, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useBankStore from '../../store/bankdetailsstore';
import api from '../../interceptor';
// 1. Import your store
import useAuthStore from '../../store/authstore';

const LoginPage = () => {
  const navigate = useNavigate();
  
  // 2. Extract actions from the store
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
// 1. Import your custom 'api' instance instead of the global axios

const handleLogin = async (e) => {
  e.preventDefault();
  const { phoneNumber, password } = formData;

  if (!phoneNumber || !password) {
    alert("Please enter both your phone number and password.");
    return;
  }

  try {
    setLoading(true);
    
    // 1. Authenticate
    const response = await api.post(`/auth/login`, {
      phoneNumber,
      password
    });

    // 2. Set the User in Au
    // th Store
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      // If you have roles: 
      localStorage.setItem('user_role', response.data.user.role || 'user');
    }
   setAuth(response.data.user, response.data.token);

    // 3. Parallel Sync: Fetch bank details and app data at the same time
    // This reduces total wait time significantly
  
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
            <h1 className="text-5xl font-bold mb-6 leading-tight">Welcome <br />Back</h1>
            <p className="text-emerald-50/80 text-lg mb-10 max-w-xs leading-relaxed">
              Log in to manage your portfolio and stay updated with your investments.
            </p>
            <div className="space-y-5">
              {["Secure access", "Encrypted data", "Instant notifications"].map((f, i) => (
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
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
            <p className="text-gray-400 font-medium">Enter your details to access your account</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
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

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-[#006B5E] hover:underline">Forgot password?</Link>
              </div>
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

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#006B5E] text-white font-bold py-4 rounded-xl hover:bg-[#005a4f] active:scale-[0.98] transition-all shadow-lg shadow-[#006B5E]/20 mt-4 flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-500 font-medium">
            Don't have an account? <Link to="/register" className="text-[#006B5E] font-bold underline decoration-2 underline-offset-4 hover:text-[#005a4f]">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;