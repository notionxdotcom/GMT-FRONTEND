import { useState, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import './App.css'

// User Components
import RegistrationPage from './components/Register';
import Dashboard from './components/Dashboard'
import Deposit from './components/deposit'
import Profile from './components/profile'
import WithdrawPage from './components/withdraw'
import LoginPage from './components/login';
import ConfirmDeposit from './components/confirmdeposit';
import BankAccountScreen from './components/bankdetails';
import MyProducts from './components/myproducts';
import MyTeam from './components/Myteam';
import TransactionHistory from './components/Transactionhistory';
import DepositHistory from './components/rechargehistory';
import WithdrawalHistory from './components/withdrawalhistory';
// Lazy Load Admin Components
const MainAdminPortal = lazy(() => import('./components/Mainadminportal'));
const TransactionScreen = lazy(() => import('./components/Transaction'));
const UserManagementScreen = lazy(() => import('./components/usermanagement'));
const Productmanagement = lazy(() => import('./components/productmanagement'));
const Adminwithdrawals = lazy(() => import('./components/adminwithdrawal'));
const Adminlogin = lazy(() => import('./components/adminlogin'));

// --- AUTH GUARDS ---

// 1. Protects any logged-in user route
const PrivateRoute = () => {
  const token = localStorage.getItem('token');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

// 2. Protects Admin-only routes
const AdminGuard = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('user_role'); // Set this during login
  
  return (token && role === 'admin') ? <Outlet /> : <Navigate to="/admin-login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="h-screen flex flex-col items-center justify-center space-y-4">
          <div className="h-10 w-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="font-bold text-slate-400">Loading NOTIONX...</div>
        </div>
      }>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-login" element={<Adminlogin />} />



          {/* --- PROTECTED USER ROUTES --- */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/withdraw" element={<WithdrawPage />} />
            <Route path="/bank-account" element={<BankAccountScreen />} />
            <Route path="/confirm-deposit" element={<ConfirmDeposit />} />
               <Route path="/products" element={<MyProducts />} />
                <Route path="/team" element={<MyTeam />} />
                <Route path="/transactions" element={<TransactionHistory />} />
                  <Route path="/recharge-history" element={<DepositHistory />} />
  <Route path="/withdrawal-history" element={<WithdrawalHistory />} />

          </Route>

          {/* --- PROTECTED ADMIN ROUTES --- */}
          <Route element={<AdminGuard />}>
            <Route path="/admin" element={<MainAdminPortal />}>
              <Route index element={<Navigate to="transactions" replace />} />
              <Route path="transactions" element={<TransactionScreen />} />
              <Route path="users" element={<UserManagementScreen />} />
              <Route path="products" element={<Productmanagement />} />
              <Route path="withdrawals" element={<Adminwithdrawals />} />
            </Route>
          </Route>

          {/* --- 404 CATCH-ALL --- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App