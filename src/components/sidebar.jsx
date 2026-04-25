import React from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import { 
  LayoutDashboard, Briefcase, Users, User, LogOut, X 
} from 'lucide-react';

const Sidebar = ({ isMenuOpen, toggleMenu, logoPath }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleMenu}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#004D44] text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col border-r border-white/5
      `}>
        {/* Logo Section */}
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden">
              <img src={logoPath} alt="Logo" className="h-full w-full object-cover" />
            </div>
            <span className="text-xl font-black tracking-tight">NotionX</span>
          </div>
          <button onClick={toggleMenu} className="lg:hidden p-2 hover:bg-white/10 rounded-lg">
            <X size={24} />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
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
            icon={<Users size={20}/>} 
            label="My Products" 
            onClick={toggleMenu} 
          />
          <SidebarLink 
            to="/profile" 
            icon={<User size={20}/>} 
            label="Profile" 
            onClick={toggleMenu} 
          />
        </nav>

        {/* Bottom Section */}
        <div className="p-6 border-t border-white/10">
          <button className="flex items-center gap-3 text-emerald-200 hover:text-emerald-50 transition-colors font-bold text-sm w-full p-2 rounded-lg hover:bg-white/5">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

/* Updated SidebarLink using NavLink */
const SidebarLink = ({ icon, label, to, onClick }) => (
  <NavLink 
    to={to}
    onClick={onClick}
    className={({ isActive }) => `
      w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold transition-all
      ${isActive 
        ? 'bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' 
        : 'text-emerald-200 hover:bg-white/5 hover:text-white'}
    `}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </NavLink>
);

export default Sidebar;