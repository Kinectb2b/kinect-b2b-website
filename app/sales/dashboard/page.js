'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import PaymentModal from './components/PaymentModal';

const supabase = createClient(
  'https://zsjmqlsnvkbtdhjbtwkr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzam1xbHNudmtidGRoamJ0d2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMzcxOTYsImV4cCI6MjA3NzYxMzE5Nn0.vsbFj5m6pCaoVpHKpB3SZ2WzF4yRufOd27NlcEPhHGc'
);

export default function SalesDashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeClients, setActiveClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [isTestMode, setIsTestMode] = useState(true);
  const [togglingMode, setTogglingMode] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch('/api/sales/verify');
        const data = await response.json();

        if (!data.authenticated || !data.salesUser) {
          localStorage.removeItem('sales_user');
          window.location.href = '/sales';
          return;
        }

        setCurrentUser(data.salesUser);
        fetchActiveClients(data.salesUser.email);
        fetchStripeMode();
      } catch (error) {
        console.error('Auth verification failed:', error);
        localStorage.removeItem('sales_user');
        window.location.href = '/sales';
      }
    };

    verifyAuth();
  }, []);

  const fetchStripeMode = async () => {
    try {
      const res = await fetch('/api/settings/stripe-mode');
      const data = await res.json();
      setIsTestMode(data.testMode);
    } catch (err) {
      console.error('Failed to fetch stripe mode:', err);
    }
  };

  const toggleStripeMode = async () => {
    setTogglingMode(true);
    try {
      const res = await fetch('/api/settings/stripe-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testMode: !isTestMode })
      });
      const data = await res.json();
      if (data.success) {
        setIsTestMode(data.testMode);
      }
    } catch (err) {
      console.error('Failed to toggle stripe mode:', err);
    } finally {
      setTogglingMode(false);
    }
  };

  const fetchActiveClients = async (userEmail) => {
    try {
      const { data, error } = await supabase
        .from('active_clients')
        .select('*')
        .ilike('sales_rep_email', userEmail)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Supabase error:', error);
        return;
      }
      setActiveClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCollectPayment = (client) => {
    setSelectedClient(client);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (clientId, stripeData) => {
    const { error } = await supabase
      .from('active_clients')
      .update({
        stripe_customer_id: stripeData.customerId,
        stripe_subscription_id: stripeData.subscriptionId,
        setup_fee_paid: stripeData.setupFeePaid,
        status: 'Payment Collected'
      })
      .eq('id', clientId);

    if (!error) {
      fetchActiveClients(currentUser.email);
      setShowPaymentModal(false);
      setSelectedClient(null);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/sales/logout', { method: 'POST' });
    localStorage.removeItem('sales_user');
    window.location.href = '/sales';
  };

  const filteredClients = activeClients.filter(client => {
    if (filter === 'pending') return !client.stripe_subscription_id;
    if (filter === 'paid') return !!client.stripe_subscription_id;
    return true;
  });

  const getStatusBadge = (client) => {
    if (client.stripe_subscription_id) {
      return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">✓ Payment Active</span>;
    }
    return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold">⏳ Awaiting Payment</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-black text-white">K</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Sales Dashboard</h1>
              <p className="text-gray-600">Welcome, {currentUser?.full_name || currentUser?.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Stripe Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${isTestMode ? 'text-orange-600' : 'text-green-600'}`}>
                {isTestMode ? '🧪 Test' : '🔴 Live'}
              </span>
              <button
                onClick={toggleStripeMode}
                disabled={togglingMode}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  isTestMode ? 'bg-orange-500' : 'bg-green-600'
                } ${togglingMode ? 'opacity-50' : ''}`}
              >
                <span
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    isTestMode ? 'left-1' : 'left-8'
                  }`}
                />
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-4xl mb-2">👥</div>
            <div className="text-3xl font-black text-gray-900">{activeClients.length}</div>
            <div className="text-gray-600 font-medium">Total Clients</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-4xl mb-2">⏳</div>
            <div className="text-3xl font-black text-yellow-600">
              {activeClients.filter(c => !c.stripe_subscription_id).length}
            </div>
            <div className="text-gray-600 font-medium">Awaiting Payment</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-3xl font-black text-green-600">
              {activeClients.filter(c => c.stripe_subscription_id).length}
            </div>
            <div className="text-gray-600 font-medium">Payment Collected</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-lg font-bold transition ${
                filter === 'all' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Clients
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-6 py-2 rounded-lg font-bold transition ${
                filter === 'pending' 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Awaiting Payment
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`px-6 py-2 rounded-lg font-bold transition ${
                filter === 'paid' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Payment Collected
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-black text-gray-900">Active Clients</h2>
          </div>
          
          {filteredClients.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No clients yet</h3>
              <p className="text-gray-500">Clients will appear here when deals are moved to WON in Pipedrive</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Business</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Plan</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Monthly</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900">{client.full_name}</div>
                        <div className="text-sm text-gray-500">{client.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900">{client.plan}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-green-600">${client.plan_price}/mo</span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(client)}
                      </td>
                      <td className="px-6 py-4">
                        {!client.stripe_subscription_id ? (
                          <button
                            onClick={() => handleCollectPayment(client)}
                            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-bold hover:from-green-700 hover:to-green-800 transition transform hover:scale-105"
                          >
                            💳 Collect Payment
                          </button>
                        ) : (
                          <span className="text-gray-400 font-medium">Subscribed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {showPaymentModal && selectedClient && (
        <PaymentModal
          client={selectedClient}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedClient(null);
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}