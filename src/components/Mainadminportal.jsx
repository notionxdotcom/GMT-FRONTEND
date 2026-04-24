import React, { useState } from 'react';
import AdminLayout from './adminlayout';
import TransactionScreen from './Transaction';
import UserManagementScreen from './usermanagement';
import ProductManagement from './productmanagement';

const MainAdminPortal = () => {
  const [activeTab, setActiveTab] = useState('transactions');

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'transactions' ? <TransactionScreen /> : activeTab === 'users' ? <UserManagementScreen /> : <ProductManagement />}
    </AdminLayout>
  );
};

export default MainAdminPortal;