'use client';
import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zsjmqlsnvkbtdhjbtwkr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzam1xbHNudmtidGRoamJ0d2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMzcxOTYsImV4cCI6MjA3NzYxMzE5Nn0.vsbFj5m6pCaoVpHKpB3SZ2WzF4yRufOd27NlcEPhHGc'
);

// Plan data
const plansData = [
  { planName: "Pro Plan 100", monthly: 250 },
  { planName: "Pro Plan 200", monthly: 500 },
  { planName: "Pro Plan 300", monthly: 750 },
  { planName: "Pro Plan 400", monthly: 1000 },
  { planName: "Pro Plan 500", monthly: 1250 },
  { planName: "Pro Plan 600", monthly: 1500 },
  { planName: "Pro Plan 700", monthly: 1750 },
  { planName: "Pro Plan 800", monthly: 2000 },
  { planName: "Pro Plan 900", monthly: 2250 },
  { planName: "Pro Plan 1000", monthly: 2500 },
  { planName: "Pro Plan 1100", monthly: 2750 },
  { planName: "Pro Plan 1200", monthly: 3000 },
  { planName: "Pro Plan 1300", monthly: 3250 },
  { planName: "Pro Plan 1400", monthly: 3500 },
  { planName: "Pro Plan 1500", monthly: 3750 },
  { planName: "Pro Plan 1600", monthly: 4000 },
  { planName: "Pro Plan 1700", monthly: 4250 },
  { planName: "Pro Plan 1800", monthly: 4500 },
  { planName: "Pro Plan 1900", monthly: 4750 },
  { planName: "Pro Plan 2000", monthly: 5000 },
  { planName: "Pro Plan 2500", monthly: 6250 },
  { planName: "Pro Plan 3000", monthly: 7500 },
  { planName: "Pro Plan 3500", monthly: 8750 },
  { planName: "Pro Plan 4000", monthly: 10000 },
  { planName: "Pro Plan 4500", monthly: 11250 },
  { planName: "Pro Plan 5000", monthly: 12500 },
  { planName: "Pro Plan 6000", monthly: 15000 },
  { planName: "Pro Plan 7000", monthly: 17500 },
  { planName: "Pro Plan 8000", monthly: 20000 },
  { planName: "Pro Plan 9000", monthly: 22500 },
  { planName: "Pro Plan 10000", monthly: 25000 },
  { planName: "Pro Plan 12000", monthly: 30000 },
  { planName: "Pro Plan 14000", monthly: 35000 },
  { planName: "Pro Plan 15000", monthly: 37500 },
  { planName: "Pro Plan 16000", monthly: 40000 },
  { planName: "Pro Plan 18000", monthly: 45000 },
  { planName: "Pro Plan 20000", monthly: 50000 },
];

export default function CommissionEstimator({ currentUser }) {
  const [selectedPlan, setSelectedPlan] = useState(plansData[4]); // Pro Plan 500
  const [commissionRates, setCommissionRates] = useState({
    first_month_commission: 50,
    recurring_commission: 10
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCommissionRates();
  }, [currentUser]);

  const fetchCommissionRates = async () => {
    if (!currentUser?.email) return;
    
    try {
      const { data, error } = await supabase
        .from('sales_users')
        .select('first_month_commission, recurring_commission')
        .ilike('email', currentUser.email)
        .single();

      if (data) {
        // Parse as numbers - stored as whole percentages like 20, 30, 50
        setCommissionRates({
          first_month_commission: parseFloat(data.first_month_commission) || 50,
          recurring_commission: parseFloat(data.recurring_commission) || 10
        });
      }
    } catch (error) {
      console.error('Error fetching commission rates:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate commissions - divide by 100 since rates are stored as whole numbers (20 = 20%)
  const firstMonthCommission = selectedPlan.monthly * (commissionRates.first_month_commission / 100);
  const recurringCommission = selectedPlan.monthly * (commissionRates.recurring_commission / 100);

  // Calculate yearly potential
  const yearOneTotal = firstMonthCommission + (recurringCommission * 11);
  const yearTwoTotal = recurringCommission * 12;

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="text-2xl font-bold text-gray-400">Loading commission rates...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          💰 Commission Estimator
        </h2>
        <p className="text-gray-500 mt-1">See what you'll earn when you close a deal</p>
      </div>

      {/* Your Rates */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-lg p-6 text-white">
        <h3 className="font-bold text-green-100 mb-4">Your Commission Rates</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-green-200 text-sm">First Month Commission</p>
            <p className="text-4xl font-black">{commissionRates.first_month_commission}%</p>
          </div>
          <div>
            <p className="text-green-200 text-sm">Monthly Recurring Commission</p>
            <p className="text-4xl font-black">{commissionRates.recurring_commission}%</p>
          </div>
        </div>
        <p className="text-green-200 text-xs mt-4">* Rates are set by management. Contact your admin if you have questions.</p>
      </div>

      {/* Plan Selector */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Select a Plan to See Your Commission</h3>
        
        <select
          value={selectedPlan.planName}
          onChange={(e) => {
            const plan = plansData.find(p => p.planName === e.target.value);
            setSelectedPlan(plan);
            setShowModal(true);
          }}
          className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 font-bold text-lg focus:outline-none focus:border-green-500 cursor-pointer"
        >
          {plansData.map(plan => (
            <option key={plan.planName} value={plan.planName}>
              {plan.planName} — ${plan.monthly.toLocaleString()}/month
            </option>
          ))}
        </select>

        {/* Quick Grid of Plans */}
        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-3">Or click a plan:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {plansData.slice(0, 12).map(plan => (
              <button
                key={plan.planName}
                onClick={() => {
                  setSelectedPlan(plan);
                  setShowModal(true);
                }}
                className={`p-3 rounded-xl text-center transition font-bold ${
                  selectedPlan.planName === plan.planName
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="text-xs opacity-75">Pro Plan</div>
                <div>{plan.planName.replace('Pro Plan ', '')}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Commission Display (Always Visible) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Month */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200">
          <div className="text-center">
            <div className="text-5xl mb-3">🎉</div>
            <p className="text-gray-500 font-medium mb-1">First Month Commission</p>
            <p className="text-sm text-gray-400 mb-3">{selectedPlan.planName} × {commissionRates.first_month_commission}%</p>
            <p className="text-5xl font-black text-green-600">${firstMonthCommission.toLocaleString()}</p>
          </div>
        </div>

        {/* Recurring */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
          <div className="text-center">
            <div className="text-5xl mb-3">🔄</div>
            <p className="text-gray-500 font-medium mb-1">Monthly Recurring Commission</p>
            <p className="text-sm text-gray-400 mb-3">{selectedPlan.planName} × {commissionRates.recurring_commission}%</p>
            <p className="text-5xl font-black text-blue-600">${recurringCommission.toLocaleString()}</p>
            <p className="text-gray-400 text-sm mt-2">Every month the client stays active</p>
          </div>
        </div>
      </div>

      {/* Yearly Projection */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4">📈 Yearly Earning Potential (per client)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5">
            <p className="text-green-700 font-bold mb-1">Year 1 Total</p>
            <p className="text-3xl font-black text-green-600">${yearOneTotal.toLocaleString()}</p>
            <p className="text-green-600 text-sm mt-2">
              ${firstMonthCommission.toLocaleString()} first month + ${recurringCommission.toLocaleString()} × 11 months
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5">
            <p className="text-blue-700 font-bold mb-1">Year 2+ Total</p>
            <p className="text-3xl font-black text-blue-600">${yearTwoTotal.toLocaleString()}</p>
            <p className="text-blue-600 text-sm mt-2">
              ${recurringCommission.toLocaleString()} × 12 months (pure recurring)
            </p>
          </div>
        </div>
      </div>

      {/* Motivation Section */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
        <h3 className="font-bold text-yellow-800 text-lg mb-3">🔥 Stack Those Commissions!</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-yellow-700 text-sm">Close 5 {selectedPlan.planName}s</p>
            <p className="text-2xl font-black text-yellow-800">${(yearOneTotal * 5).toLocaleString()}/yr</p>
          </div>
          <div>
            <p className="text-yellow-700 text-sm">Close 10 {selectedPlan.planName}s</p>
            <p className="text-2xl font-black text-yellow-800">${(yearOneTotal * 10).toLocaleString()}/yr</p>
          </div>
          <div>
            <p className="text-yellow-700 text-sm">Close 20 {selectedPlan.planName}s</p>
            <p className="text-2xl font-black text-yellow-800">${(yearOneTotal * 20).toLocaleString()}/yr</p>
          </div>
        </div>
      </div>

      {/* Commission Popup Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div 
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-bounce-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white text-center">
              <p className="text-green-200 font-medium">If you close</p>
              <p className="text-3xl font-black">{selectedPlan.planName}</p>
              <p className="text-green-200">${selectedPlan.monthly.toLocaleString()}/month</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div>
                  <p className="font-bold text-gray-900">First Month</p>
                  <p className="text-sm text-gray-500">{commissionRates.first_month_commission}% commission</p>
                </div>
                <p className="text-3xl font-black text-green-600">${firstMonthCommission.toLocaleString()}</p>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div>
                  <p className="font-bold text-gray-900">Monthly Recurring</p>
                  <p className="text-sm text-gray-500">{commissionRates.recurring_commission}% commission</p>
                </div>
                <p className="text-3xl font-black text-blue-600">${recurringCommission.toLocaleString()}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-gray-500 text-sm">Year 1 Total Earnings</p>
                <p className="text-4xl font-black text-gray-900">${yearOneTotal.toLocaleString()}</p>
              </div>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition"
              >
                Let's Get It! 💪
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce-in {
          0% { transform: scale(0.9); opacity: 0; }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}