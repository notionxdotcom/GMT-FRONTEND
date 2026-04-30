import React, { useState, useEffect } from 'react';
import { Package, Calendar, Clock, TrendingUp, ShieldCheck } from 'lucide-react';
import api from '../../interceptor';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const res = await api.get('/user/my-products');
        console.log("Fetched GMT Products:", res.data.data);
        setProducts(res.data.data);
      } catch (err) {
        console.error("Error fetching GMT products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyProducts();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60 flex-col items-center justify-center p-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
      <div className="text-center font-black text-slate-400 uppercase tracking-[0.2em] text-sm">Synchronizing GMT Plans...</div>
    </div>
  );

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto min-h-screen">
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="text-blue-600" size={24} />
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">GMT Portfolio</h1>
        </div>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] ml-1">Live Investment Performance</p>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100 shadow-sm">
          <div className="bg-slate-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 transform rotate-12">
            <Package className="text-slate-300" size={40} />
          </div>
          <h3 className="text-2xl font-black text-slate-800">No Active Assets</h3>
          <p className="text-slate-400 font-medium mt-3 max-w-xs mx-auto">
            You haven't acquired any GMT investment plans yet. Visit the dashboard to start earning.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((item) => (
            <div key={item.purchase_id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all group">
              
              <div className="p-8 pb-0 flex justify-between items-start">
                <div className="bg-blue-600/10 p-4 rounded-2xl group-hover:bg-blue-600 transition-colors">
                  <TrendingUp className="text-blue-600 group-hover:text-white transition-colors" size={24} />
                </div>
                <div className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border border-blue-100">
                  Active
                </div>
              </div>

              <div className="p-8 pt-6">
                <h3 className="text-2xl font-black text-slate-800 mb-1 tracking-tight">{item.name}</h3>
                <p className="text-blue-600 font-black text-xl">₦{Number(item.price).toLocaleString()}</p>

                <div className="mt-8 space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yield Maturity</span>
                    <span className="text-sm font-black text-slate-800">{item.days_left} Days Left</span>
                  </div>
                  
                  <div className="w-full bg-slate-50 h-5 rounded-full overflow-hidden p-1 border border-slate-100">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out shadow-lg shadow-blue-600/20"
                      style={{ width: `${item.progress_percent}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold text-slate-400 italic">
                      GMT Protocol Running
                    </p>
                    <p className="text-[10px] font-black text-blue-600 uppercase">
                      {item.progress_percent}% Complete
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <Calendar size={14} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase">Entry</p>
                      <p className="text-xs font-black text-slate-700">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-l border-slate-50 pl-4">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <Clock size={14} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase">Cycle</p>
                      <p className="text-xs font-black text-slate-700">{item.duration_days} Days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProducts;