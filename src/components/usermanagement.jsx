import React, { useState } from 'react';
import { MoreVertical, Ban, Trash2, ShieldCheck } from 'lucide-react';

const UserManagementScreen = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h2>
          <p className="text-slate-500 font-medium">Manage and monitor institutional and retail investment accounts.</p>
        </div>
        <button className="px-5 py-2.5 bg-black text-white rounded-xl text-sm font-bold shadow-lg">+ Create Account</button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Type</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Balance</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-right pr-10">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <UserRow name="Julianna DeWitt" email="j.dewitt@institutional.co" type="INSTITUTIONAL" balance="1,620,000.00" status="Active" />
            <UserRow name="Marcus Blackwell" email="m.blackwell@retail.co" type="RETAIL" balance="42,150.00" status="Active" />
            <UserRow name="Elena Kostic" email="e.kostic@fund.io" type="INSTITUTIONAL" balance="0.00" status="Suspended" />
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UserRow = ({ name, email, type, balance, status }) => (
  <tr className="hover:bg-slate-50/50 transition">
    <td className="px-6 py-5">
      <p className="font-bold text-slate-800">{name}</p>
      <p className="text-[10px] text-slate-400 font-medium">{email}</p>
    </td>
    <td className="px-6 py-5">
      <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{type}</span>
    </td>
    <td className="px-6 py-5 font-black text-slate-900">${balance}</td>
    <td className="px-6 py-5">
      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{status}</span>
    </td>
    <td className="px-6 py-5 text-right pr-8">
      <ActionDropdown />
    </td>
  </tr>
);

const ActionDropdown = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button onClick={() => setOpen(!open)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition">
        <MoreVertical size={18} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 py-2 overflow-hidden animate-in zoom-in-95 duration-100">
          <button className="flex items-center gap-2 w-full px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50">
            <ShieldCheck size={14} className="text-blue-500"/> View Identity
          </button>
          <button className="flex items-center gap-2 w-full px-4 py-2 text-xs font-bold text-amber-600 hover:bg-amber-50">
            <Ban size={14}/> Freeze Wallet
          </button>
          <button className="flex items-center gap-2 w-full px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 border-t border-slate-50 mt-1 pt-3">
            <Trash2 size={14}/> Permanent Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default UserManagementScreen;