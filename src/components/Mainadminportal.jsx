import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminLayout from './adminlayout';

const MainAdminPortal = () => {
  // We remove the activeTab state here because the URL in App.js 
  // now determines which component renders via the <Outlet />
  
  return (
    <AdminLayout>
      {/* This Outlet acts as a placeholder for TransactionScreen, 
          UserManagementScreen, or ProductManagement based on the URL */}
      <Outlet />
    </AdminLayout>
  );
};

export default MainAdminPortal;