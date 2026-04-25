import React, { useState, useEffect } from 'react';
import { Package, Calendar, Clock, TrendingUp } from 'lucide-react';
import api from '../../interceptor';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const res = await api.get('/user/my-products');
        // Check the console to see the exact data structure
        console.log("Fetched Products:", res.data.data);
        setProducts(res.data.data);
      } catch (err) {
        console.error("Error fetching products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyProducts();
  }, []);

  if (loading) return <div className="p-10 text-center font-bold text-gray-400 uppercase tracking-widest">Loading Plans...</div>;

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-800">My Active Plans</h1>
        <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mt-2">Track your investment progress</p>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-16 text-center border-2 border-dashed border-gray-100">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="text-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-black text-gray-800">No Active Plans Found</h3>
          <p className="text-gray-400 font-medium mt-2">Purchase a product to start earning daily.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((item) => (
            <div key={item.purchase_id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              
              <div className="p-8 pb-0 flex justify-between items-start">
                <div className="bg-[#006B5E]/10 p-4 rounded-2xl">
                  <TrendingUp className="text-[#006B5E]" size={24} />
                </div>
                <div className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                  Running
                </div>
              </div>

              <div className="p-8 pt-6">
                <h3 className="text-2xl font-black text-gray-800 mb-1">{item.name}</h3>
                {/* Ensure price is handled as a number */}
                <p className="text-[#006B5E] font-black text-lg">₦{Number(item.price).toLocaleString()}</p>

                <div className="mt-8 space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Progress</span>
                    <span className="text-sm font-black text-gray-800">{item.days_left} Days Left</span>
                  </div>
                  
                  <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden p-1">
                    <div 
                      className="bg-[#006B5E] h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${item.progress_percent}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-[10px] font-bold text-gray-400 italic">
                    {item.progress_percent}% Matured
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-gray-300" />
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase">Started</p>
                      {/* FIX: Changed item.purchase_date to item.created_at */}
                      <p className="text-xs font-black text-gray-700">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-gray-300" />
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase">Duration</p>
                      <p className="text-xs font-black text-gray-700">{item.duration_days} Days</p>
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