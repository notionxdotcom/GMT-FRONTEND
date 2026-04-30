import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Wallet, Users, LogOut, LayoutDashboard, ShieldCheck,Package, User } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation items matching your two screens
  const menuItems = [
    { label: 'Transactions', path: '/admin/transactions', icon: <Wallet size={18} /> },
    { label: 'Withdrawal Management', path: '/admin/withdrawals', icon: <Wallet size={18} /> },
    { label: 'Product Management', path: '/admin/products', icon: <Package size={18} /> },
     { label: 'Users', path: '/admin/users', icon: <User size={18} /> },
    
  ];
  

  return (
    <div className="flex h-screen bg-[#F9FAFB] font-sans text-slate-900">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-black flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white text-[10px]">NX</div>
            Notion X Admin
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase px-4 mb-4 tracking-widest">Command Center</p>
          {menuItems.map((item) => (
            <button 
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                location.pathname === item.path 
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        {/* ADMIN FOOTER */}
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase text-slate-400">Security Status</span>
            </div>
            <p className="text-[10px] font-bold text-slate-600">Encrypted Session Active</p>
          </div>
          <button className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 w-full rounded-xl transition">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* TOP BAR */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
           <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Server: Nexus-01</span>
           </div>
           <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs font-black text-slate-900">System Admin</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Root Access</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-full border-2 border-white shadow-sm overflow-hidden">
                <img src="https://api.dicebear.com/7.x/shapes/svg?seed=admin" alt="avatar" />
              </div>
           </div>
        </header>

        {/* DYNAMIC SCREEN CONTENT */}
        <div className="flex-1 overflow-y-auto p-10">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;