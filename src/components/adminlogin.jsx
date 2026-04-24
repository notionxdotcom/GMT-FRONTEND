import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Phone, Loader2, ShieldCheck } from 'lucide-react';
import api from '../../interceptor';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ phoneNumber: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', formData);
      const { token, user } = response.data;

      // Check if the user has the admin role
      if (user.role !== 'admin') {
        setError("Access Denied: You do not have administrative privileges.");
        return;
      }

      // Store token and redirect
      localStorage.setItem('token', token);
      localStorage.setItem('user_role', user.role);
      navigate('/admin/transactions');
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="h-16 w-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-200">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Admin Portal</h1>
          <p className="text-gray-500 text-sm mt-1">Secure access to NOTIONX Logistics</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Phone Number */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                required
                placeholder="0801 234 5678"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:border-green-500 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold shadow-lg shadow-green-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign In to Dashboard"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-gray-400">
          Authorized Personnel Only. Internal IP logging active.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;