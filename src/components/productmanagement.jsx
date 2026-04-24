import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Calendar, Loader2, Package, X, ShieldCheck } from 'lucide-react';
import api from '../../interceptor';

/**
 * --- ADD PRODUCT MODAL COMPONENT ---
 */
const AddProductModal = ({ isOpen, onClose, onAdd, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    daily_income: '',
    duration: 30
  });

  if (!isOpen) return null;

  const totalReturn = formData.price && formData.daily_income && formData.duration
    ? (Number(formData.daily_income) * Number(formData.duration)) 
    : 0;

  const handleSubmit = () => {
    onAdd({ ...formData, total_return: totalReturn });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 relative">
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>

        <h3 className="text-2xl font-black text-slate-900 mb-2">Create VIP Plan</h3>
        <p className="text-sm text-slate-500 mb-8 font-medium">Configure the earnings and lifecycle for this tier.</p>
        
        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Plan Name</label>
            <input 
              type="text" 
              className="w-full mt-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
              placeholder="e.g. VIP 3"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Price (₦)</label>
              <input 
                type="number" 
                className="w-full mt-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all"
                placeholder="5000"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Daily (₦)</label>
              <input 
                type="number" 
                className="w-full mt-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all"
                placeholder="800"
                value={formData.daily_income}
                onChange={(e) => setFormData({...formData, daily_income: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Total Duration (Days)</label>
            <div className="relative">
              <input 
                type="number" 
                className="w-full mt-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
              />
              <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            </div>
          </div>

          <div className="p-6 bg-slate-900 rounded-[1.5rem] text-white shadow-xl shadow-slate-900/20">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expected Return</p>
                <p className="text-2xl font-black text-emerald-400 mt-1">₦{totalReturn.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Yield</p>
                <p className="font-bold text-slate-200">{formData.daily_income ? `₦${formData.daily_income}/day` : '—'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button 
            onClick={onClose} 
            className="flex-1 py-4 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition active:scale-95"
          >
            Cancel
          </button>
          <button 
            disabled={!formData.name || !formData.price || !formData.daily_income || isSubmitting}
            onClick={handleSubmit}
            className="flex-1 py-4 bg-[#006B5E] text-white rounded-2xl font-bold hover:bg-[#004D44] shadow-lg shadow-emerald-900/20 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Create Plan"}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * --- MAIN MANAGEMENT PAGE ---
 */
const ProductManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products/all');
      setProducts(res.data.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await api.post('/products/create', {
        name: formData.name,
        price: Number(formData.price),
        daily_income: Number(formData.daily_income),
        duration: Number(formData.duration),
        total_return: Number(formData.total_return)
      });

      if (response.data.status === "success") {
        setProducts(prev => [...prev, response.data.data]);
        setIsModalOpen(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error creating plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure? This plan will be removed from the store immediately.")) return;
    
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddProduct}
        isSubmitting={isSubmitting}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
              <Package size={18} />
            </div>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Inventory System</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">VIP Management</h2>
          <p className="text-slate-500 font-medium mt-1">Control investment tiers and earnings lifecycle.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-4 bg-slate-900 text-white rounded-[1.2rem] font-bold shadow-2xl flex items-center gap-3 hover:bg-slate-800 transition-all active:scale-95"
        >
          <Plus size={20} strokeWidth={3} /> Create New Plan
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4 bg-white rounded-[2.5rem] border border-slate-100">
          <Loader2 className="animate-spin text-emerald-500" size={32} />
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Syncing with database...</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Plan Tier</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Cost</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Daily Earn</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-center">Duration</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Net Return</th>
                  <th className="px-8 py-6 text-right pr-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-8 py-20 text-center text-slate-400 font-medium">
                      No VIP plans created yet. Click "Create New Plan" to start.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/30 transition group">
                      <td className="px-8 py-7">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-500 group-hover:bg-[#006B5E] group-hover:text-white transition-colors">
                            {p.name.charAt(0)}
                          </div>
                          <span className="font-black text-slate-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-7 font-black text-slate-900">₦{Number(p.price).toLocaleString()}</td>
                      <td className="px-8 py-7 font-bold text-emerald-600">₦{Number(p.daily_income || p.daily).toLocaleString()}</td>
                      <td className="px-8 py-7 text-center">
                        <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase">
                          {p.duration} Days
                        </span>
                      </td>
                      <td className="px-8 py-7">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900">₦{Number(p.total_return || p.return).toLocaleString()}</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase">Estimated</span>
                        </div>
                      </td>
                      <td className="px-8 py-7 text-right pr-10">
                        <button 
                          onClick={() => deleteProduct(p.id)}
                          className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all active:scale-90"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="bg-slate-50/50 p-6 border-t border-slate-100 flex items-center justify-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Admin Portal · NOTIONX Management</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;