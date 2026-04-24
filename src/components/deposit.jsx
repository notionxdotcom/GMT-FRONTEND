import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Wallet, Users, User, ChevronLeft } from 'lucide-react';

const Deposit = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');

  const amounts = [3000, 6000, 10000, 20000, 50000, 100000, 200000, 300000];

  const handleSelect = (amt) => setAmount(amt.toString());
  const handleInputChange = (e) => setAmount(e.target.value);

  const handleContinue = () => {
    const finalAmount = parseFloat(amount);
    if (!finalAmount || finalAmount < 3000) {
      alert("Minimum recharge is ₦3,000");
      return;
    }
    // Transfer only the amount to the next page
    navigate('/confirm-deposit', { state: { amount: finalAmount } });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-28 flex justify-center">
      <div className="w-full max-w-md relative">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 pt-6">
          <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center bg-white border border-gray-100 rounded-lg shadow-sm">
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-base font-bold text-gray-900">Recharge Now</h1>
        </div>

        {/* Amount Selection */}
        <div className="mx-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Select Amount</h2>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {amounts.map((amt) => (
              <button
                key={amt}
                onClick={() => handleSelect(amt)}
                className={`py-2.5 rounded-lg border text-sm font-semibold transition-all ${
                  amount === amt.toString() 
                    ? 'border-[#007B65] bg-[#E5F2F0] text-[#007B65]' 
                    : 'border-gray-200 text-gray-600 bg-white'
                }`}
              >
                ₦{amt.toLocaleString()}
              </button>
            ))}
          </div>

          <div className={`flex items-center border rounded-lg overflow-hidden ${amount ? 'border-[#007B65]' : 'border-gray-200'}`}>
            <div className="px-4 py-3 text-[#007B65] font-bold border-r border-gray-200 bg-gray-50">₦</div>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={handleInputChange}
              className="flex-1 p-3 outline-none text-sm bg-white"
            />
          </div>
        </div>

        <div className="px-4 mt-6">
          <button onClick={handleContinue} className="w-full bg-[#007B65] text-white py-4 rounded-xl font-bold shadow-md active:scale-95 transition-all">
            Recharge Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Deposit;