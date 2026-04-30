import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, Users, User, LogOut, X, ShieldCheck, Layers
} from 'lucide-react';

const Sidebar = ({ isMenuOpen, toggleMenu, logoPath }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={toggleMenu}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#0F172A] text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col border-r border-white/5 shadow-2xl
      `}>
        {/* Logo Section */}
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-white/10 shadow-lg">
              <img src={logoPath} alt="Logo" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter leading-none">GMT</span>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">Global</span>
            </div>
          </div>
          <button onClick={toggleMenu} className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={22} className="text-slate-400" />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 space-y-1.5 mt-6">
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Main Menu</p>
          
          <SidebarLink 
            to="/dashboard" 
            icon={<LayoutDashboard size={20}/>} 
            label="Dashboard" 
            onClick={toggleMenu} 
          />
          <SidebarLink 
            to="/bank-account" 
            icon={<Briefcase size={20}/>} 
            label="Bank Account" 
            onClick={toggleMenu} 
          />
          <SidebarLink 
            to="/products" 
            icon={<Layers size={20}/>} 
            label="My Products" 
            onClick={toggleMenu} 
          />
          <SidebarLink 
            to="/team" 
            icon={<Users size={20}/>} 
            label="My Network" 
            onClick={toggleMenu} 
          />
          <SidebarLink 
            to="/profile" 
            icon={<User size={20}/>} 
            label="Profile" 
            onClick={toggleMenu} 
          />
          <SidebarLink 
            to="/users" 
            icon={<User size={20}/>} 
            label="users" 
            onClick={toggleMenu} 
          />
        </nav>

        {/* Bottom Section */}
        <div className="p-6 mt-auto border-t border-white/5 bg-slate-900/50">
          <div className="mb-6 px-2 py-3 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShieldCheck size={16} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-white tracking-tight">Secure Node</span>
              <span className="text-[9px] font-bold text-blue-400 uppercase tracking-tighter">Verified Session</span>
            </div>
          </div>
          
          <button className="flex items-center gap-3 text-slate-400 hover:text-red-400 transition-all font-black text-xs uppercase tracking-widest w-full p-3 rounded-xl hover:bg-red-500/5 group">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

/* Updated SidebarLink using NavLink with GMT Blue logic */
const SidebarLink = ({ icon, label, to, onClick }) => (
  <NavLink 
    to={to}
    onClick={onClick}
    className={({ isActive }) => `
      w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-black transition-all duration-200 uppercase tracking-tighter text-[13px]
      ${isActive 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 border border-blue-500/50' 
        : 'text-slate-400 hover:bg-white/5 hover:text-blue-100'}
    `}
  >
    <div className="transition-transform duration-200">
      {icon}
    </div>
    <span>{label}</span>
  </NavLink>
);

export default Sidebar;