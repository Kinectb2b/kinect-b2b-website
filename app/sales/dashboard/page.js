'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import PaymentModal from './components/PaymentModal';
import PlansAndPrices from './components/PlansAndPrices';
import SalesCenter from './components/SalesCenter';
import CommissionEstimator from './components/CommissionEstimator';
import QuickActions from './components/QuickActions';
import ProposalBuilder from './components/ProposalBuilder';
import Profile from './components/Profile';

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
  const [isTestMode, setIsTestMode] = useState(true);
  const [togglingMode, setTogglingMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [clientToUpdate, setClientToUpdate] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    needsAttention: true,
    active: true,
    inactive: false,
  });
  const [dashboardView, setDashboardView] = useState('clients'); // 'clients' or 'earnings'
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  // Status configuration
  const STATUS_CONFIG = {
    awaiting_payment: { label: 'Awaiting Payment', color: 'yellow', emoji: '⏳', section: 'needsAttention' },
    payment_failed: { label: 'Payment Failed', color: 'red', emoji: '❌', section: 'needsAttention' },
    renewal_due: { label: 'Renewal Due', color: 'orange', emoji: '🔄', section: 'needsAttention' },
    plan_lapsed: { label: 'Plan Lapsed', color: 'red', emoji: '⚠️', section: 'needsAttention' },
    active: { label: 'Active', color: 'green', emoji: '✅', section: 'active' },
    on_hold: { label: 'On Hold', color: 'blue', emoji: '⏸️', section: 'inactive' },
    cancelled: { label: 'Cancelled', color: 'gray', emoji: '🚫', section: 'inactive' },
  };

  const getStatusBadgeNew = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.awaiting_payment;
    const colorClasses = {
      yellow: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
      red: 'bg-red-50 text-red-700 ring-1 ring-red-600/20',
      orange: 'bg-orange-50 text-orange-700 ring-1 ring-orange-600/20',
      green: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
      blue: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20',
      gray: 'bg-gray-100 text-gray-600 ring-1 ring-gray-500/20',
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colorClasses[config.color]}`}>
        {config.emoji} {config.label}
      </span>
    );
  };

  // Filter clients by section
  const activeStatusClients = activeClients.filter(c => c.status === 'active');
  const inactiveClients = activeClients.filter(c => 
    ['on_hold', 'cancelled'].includes(c.status)
  );
  // Needs attention = everything that's not active or inactive
  const needsAttentionClients = activeClients.filter(c => 
    !['active', 'on_hold', 'cancelled'].includes(c.status)
  );

  // Earnings calculations
  const totalCommissionEarned = payments.reduce((sum, p) => sum + (parseFloat(p.commission_amount) || 0), 0);
  const recurringCommissionRate = currentUser?.recurring_commission || 10;
  const monthlyRecurring = activeStatusClients.reduce((sum, c) => {
    const planPrice = parseFloat(c.plan_price) || 0;
    return sum + (planPrice * recurringCommissionRate / 100);
  }, 0);
  const totalRevenue = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  
  // Get payment count per client
  const paymentsByClient = payments.reduce((acc, p) => {
    acc[p.client_id] = (acc[p.client_id] || 0) + 1;
    return acc;
  }, {});
  
  // Get commission per client
  const commissionByClient = payments.reduce((acc, p) => {
    acc[p.client_id] = (acc[p.client_id] || 0) + (parseFloat(p.commission_amount) || 0);
    return acc;
  }, {});

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

        // Fetch full profile including photo
        const { data: profileData } = await supabase
          .from('sales_users')
          .select('*')
          .ilike('email', data.salesUser.email)
          .single();

        const userWithProfile = {
          ...data.salesUser,
          profile_photo_url: profileData?.profile_photo_url || '',
          phone: profileData?.phone || '',
          role: profileData?.role || 'Sales Representative',
          first_month_commission: parseFloat(profileData?.first_month_commission) || 50,
          recurring_commission: parseFloat(profileData?.recurring_commission) || 10,
        };

        setCurrentUser(userWithProfile);
        fetchActiveClients(data.salesUser.email);
        fetchPayments(data.salesUser.email);
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

  const fetchPayments = async (userEmail) => {
    setLoadingPayments(true);
    try {
      const { data, error } = await supabase
        .from('client_payments')
        .select('*')
        .ilike('sales_rep_email', userEmail)
        .order('paid_date', { ascending: false });
      
      if (error) {
        console.error('Supabase error:', error);
        return;
      }
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoadingPayments(false);
    }
  };

  const handleCollectPayment = (client) => {
    setSelectedClient(client);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (clientId, stripeData) => {
    const contractStart = new Date().toISOString().split('T')[0];
    const contractEnd = new Date();
    contractEnd.setFullYear(contractEnd.getFullYear() + 1);
    
    const { error } = await supabase
      .from('active_clients')
      .update({
        stripe_customer_id: stripeData.customerId,
        stripe_subscription_id: stripeData.subscriptionId,
        setup_fee_paid: stripeData.setupFeePaid,
        status: 'active',
        contract_start_date: contractStart,
        contract_end_date: contractEnd.toISOString().split('T')[0],
        status_updated_at: new Date().toISOString(),
      })
      .eq('id', clientId);

    if (!error) {
      fetchActiveClients(currentUser.email);
      setShowPaymentModal(false);
      setSelectedClient(null);
    }
  };

  const handleDeleteClient = async () => {
    if (!clientToDelete) return;
    
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('active_clients')
        .delete()
        .eq('id', clientToDelete.id);

      if (error) throw error;

      // Refresh the client list
      fetchActiveClients(currentUser.email);
      setShowDeleteModal(false);
      setClientToDelete(null);
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Failed to delete client. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (clientId, newStatus) => {
    try {
      const updateData = {
        status: newStatus,
        status_updated_at: new Date().toISOString(),
      };

      // If changing to active and no contract start date, set it
      if (newStatus === 'active') {
        updateData.contract_start_date = new Date().toISOString().split('T')[0];
        // Set contract end date to 12 months from now
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 1);
        updateData.contract_end_date = endDate.toISOString().split('T')[0];
      }

      const { error } = await supabase
        .from('active_clients')
        .update(updateData)
        .eq('id', clientId);

      if (error) throw error;

      // Refresh the client list
      fetchActiveClients(currentUser.email);
      setShowStatusModal(false);
      setClientToUpdate(null);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleLogout = async () => {
    await fetch('/api/sales/logout', { method: 'POST' });
    localStorage.removeItem('sales_user');
    window.location.href = '/sales';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col fixed h-full z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <img src="/icon.png" alt="Kinect B2B" className="w-10 h-10 rounded-xl shadow-lg" />
              <div>
                <h1 className="font-bold text-lg leading-tight">Kinect B2B</h1>
                <p className="text-xs text-slate-400">Sales Portal</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 hover:bg-white/10 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <nav className="space-y-1">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">Navigation</p>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>, badge: needsAttentionClients.length > 0 ? needsAttentionClients.length : null },
              { id: 'plans', label: 'Plans & Prices', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
              { id: 'sales-center', label: 'Sales Center', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
              { id: 'commission', label: 'Commission', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
              { id: 'proposal', label: 'Proposal Builder', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> },
              { id: 'quick-actions', label: 'Quick Actions', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === item.id ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-3">{item.icon}{item.label}</span>
                {item.badge && <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">{item.badge}</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* Stripe Mode Toggle */}
        <div className="px-6 py-4 border-t border-white/10 mt-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-400">Stripe Mode</span>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold ${isTestMode ? 'text-orange-400' : 'text-emerald-400'}`}>
                {isTestMode ? 'Test' : 'Live'}
              </span>
              <button
                onClick={toggleStripeMode}
                disabled={togglingMode}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  isTestMode ? 'bg-orange-500' : 'bg-emerald-500'
                } ${togglingMode ? 'opacity-50' : ''}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isTestMode ? 'left-1' : 'left-6'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }}
            className="flex items-center gap-3 mb-4 w-full hover:bg-white/5 rounded-lg p-2 transition"
          >
            {currentUser?.profile_photo_url ? (
              <img src={currentUser.profile_photo_url} alt={currentUser.username} className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                {currentUser?.full_name?.charAt(0)?.toUpperCase() || currentUser?.username?.charAt(0)?.toUpperCase() || 'K'}
              </div>
            )}
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium truncate">{currentUser?.full_name || currentUser?.username}</p>
              <p className="text-xs text-slate-500">Sales Representative</p>
            </div>
          </button>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-slate-400 hover:text-white transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="px-4 md:px-8 py-4 md:py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-slate-900">
                  {activeTab === 'dashboard' ? 'Dashboard' : 
                   activeTab === 'plans' ? 'Plans & Prices' :
                   activeTab === 'sales-center' ? 'Sales Center' :
                   activeTab === 'commission' ? 'Commission Calculator' :
                   activeTab === 'proposal' ? 'Proposal Builder' :
                   activeTab === 'quick-actions' ? 'Quick Actions' :
                   activeTab === 'profile' ? 'My Profile' : 'Dashboard'}
                </h2>
                <p className="text-xs md:text-sm text-slate-500 mt-0.5 hidden sm:block">Welcome back, {currentUser?.full_name || currentUser?.username}</p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-400">Today</p>
              <p className="text-sm font-medium text-slate-700">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8 flex-grow">
        {activeTab === 'dashboard' ? (
          <>
            {/* View Toggle */}
            <div className="flex gap-2 mb-4 md:mb-6 overflow-x-auto pb-2">
              <button
                onClick={() => setDashboardView('clients')}
                className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition whitespace-nowrap ${
                  dashboardView === 'clients'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                👥 Client Overview
              </button>
              <button
                onClick={() => setDashboardView('earnings')}
                className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition whitespace-nowrap ${
                  dashboardView === 'earnings'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                💵 My Earnings
              </button>
            </div>

            {dashboardView === 'clients' ? (
              <>
                {/* Client Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-6 md:mb-8">
                  {[
                    { label: 'Total Clients', value: activeClients.length, icon: '👥', color: 'from-blue-500 to-blue-600' },
                    { label: 'Needs Attention', value: needsAttentionClients.length, icon: '⚠️', color: 'from-amber-500 to-orange-500' },
                    { label: 'Active Clients', value: activeStatusClients.length, icon: '✅', color: 'from-emerald-500 to-green-600' },
                    { label: 'Inactive', value: inactiveClients.length, icon: '📁', color: 'from-slate-400 to-slate-500' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2 md:mb-3">
                        <span className={`w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white text-sm md:text-lg shadow-sm`}>{stat.icon}</span>
                      </div>
                      <p className="text-xl md:text-2xl font-bold text-slate-900">{stat.value}</p>
                      <p className="text-xs md:text-sm text-slate-500">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Section 1: Needs Attention */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden mb-4 md:mb-6">
                  <button
                    onClick={() => toggleSection('needsAttention')}
                    className="w-full px-4 md:px-5 py-3 md:py-4 flex items-center justify-between hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-sm">⚠️</span>
                      <div className="text-left">
                        <h3 className="font-semibold text-slate-900 text-sm md:text-base">Needs Attention</h3>
                        <p className="text-xs text-slate-500">{needsAttentionClients.length} clients require action</p>
                      </div>
                    </div>
                    <svg className={`w-5 h-5 text-slate-400 transition-transform ${expandedSections.needsAttention ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  
                  {expandedSections.needsAttention && (
                    needsAttentionClients.length === 0 ? (
                      <div className="p-6 md:p-10 text-center border-t border-slate-100">
                        <div className="text-4xl mb-2">🎉</div>
                        <p className="text-slate-500 font-medium">All caught up! No clients need attention.</p>
                      </div>
                    ) : (
                      <div className="border-t border-slate-100">
                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-slate-100">
                          {needsAttentionClients.map((client) => (
                            <div key={client.id} className="p-4 space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium text-slate-900">{client.name}</p>
                                  <p className="text-xs text-slate-500">{client.email}</p>
                                </div>
                                <button onClick={() => { setClientToUpdate(client); setShowStatusModal(true); }}>
                                  {getStatusBadgeNew(client.status || 'awaiting_payment')}
                                </button>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600">{client.full_name}</span>
                                <span className="font-medium text-slate-900">{client.plan}</span>
                                <span className="font-semibold text-emerald-600">${client.plan_price}/mo</span>
                              </div>
                              <div className="flex gap-2">
                                {!client.stripe_subscription_id && (
                                  <button
                                    onClick={() => handleCollectPayment(client)}
                                    className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition"
                                  >
                                    💳 Collect Payment
                                  </button>
                                )}
                                <button
                                  onClick={() => { setClientToDelete(client); setShowDeleteModal(true); }}
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                              <tr>
                                <th className="px-5 py-3 text-left font-medium">Business</th>
                                <th className="px-5 py-3 text-left font-medium">Contact</th>
                                <th className="px-5 py-3 text-left font-medium">Plan</th>
                                <th className="px-5 py-3 text-left font-medium">Monthly</th>
                                <th className="px-5 py-3 text-left font-medium">Status</th>
                                <th className="px-5 py-3 text-left font-medium">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {needsAttentionClients.map((client) => (
                                <tr key={client.id} className="hover:bg-slate-50/50">
                                  <td className="px-5 py-3">
                                    <p className="font-medium text-slate-900">{client.name}</p>
                                    <p className="text-xs text-slate-500">{client.email}</p>
                                  </td>
                                  <td className="px-5 py-3">
                                    <p className="text-slate-900">{client.full_name}</p>
                                    <p className="text-xs text-slate-500">{client.phone}</p>
                                  </td>
                                  <td className="px-5 py-3 font-medium text-slate-900">{client.plan}</td>
                                  <td className="px-5 py-3 font-semibold text-emerald-600">${client.plan_price}/mo</td>
                                  <td className="px-5 py-3">
                                    <button onClick={() => { setClientToUpdate(client); setShowStatusModal(true); }} className="hover:opacity-80 transition">
                                      {getStatusBadgeNew(client.status || 'awaiting_payment')}
                                    </button>
                                  </td>
                                  <td className="px-5 py-3">
                                    <div className="flex items-center gap-2">
                                      {!client.stripe_subscription_id && (
                                        <button
                                          onClick={() => handleCollectPayment(client)}
                                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition"
                                        >
                                          💳 Collect
                                        </button>
                                      )}
                                      <button
                                        onClick={() => { setClientToDelete(client); setShowDeleteModal(true); }}
                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Section 2: Active Clients */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden mb-4 md:mb-6">
                  <button
                    onClick={() => toggleSection('active')}
                    className="w-full px-4 md:px-5 py-3 md:py-4 flex items-center justify-between hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white text-sm">✅</span>
                      <div className="text-left">
                        <h3 className="font-semibold text-slate-900 text-sm md:text-base">Active Clients</h3>
                        <p className="text-xs text-slate-500">{activeStatusClients.length} currently active</p>
                      </div>
                    </div>
                    <svg className={`w-5 h-5 text-slate-400 transition-transform ${expandedSections.active ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  
                  {expandedSections.active && (
                    activeStatusClients.length === 0 ? (
                      <div className="p-6 md:p-10 text-center border-t border-slate-100">
                        <div className="text-4xl mb-2">📋</div>
                        <p className="text-slate-500 font-medium">No active clients yet. Collect payment to activate!</p>
                      </div>
                    ) : (
                      <div className="border-t border-slate-100">
                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-slate-100">
                          {activeStatusClients.map((client) => (
                            <div key={client.id} className="p-4 space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium text-slate-900">{client.name}</p>
                                  <p className="text-xs text-slate-500">{client.email}</p>
                                </div>
                                <button onClick={() => { setClientToUpdate(client); setShowStatusModal(true); }}>
                                  {getStatusBadgeNew(client.status)}
                                </button>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600">{client.full_name}</span>
                                <span className="font-medium text-slate-900">{client.plan}</span>
                                <span className="font-semibold text-emerald-600">${client.plan_price}/mo</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500">Ends: {client.contract_end_date ? new Date(client.contract_end_date).toLocaleDateString() : '—'}</span>
                                <button
                                  onClick={() => { setClientToDelete(client); setShowDeleteModal(true); }}
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                              <tr>
                                <th className="px-5 py-3 text-left font-medium">Business</th>
                                <th className="px-5 py-3 text-left font-medium">Contact</th>
                                <th className="px-5 py-3 text-left font-medium">Plan</th>
                                <th className="px-5 py-3 text-left font-medium">Monthly</th>
                                <th className="px-5 py-3 text-left font-medium">Contract End</th>
                                <th className="px-5 py-3 text-left font-medium">Status</th>
                                <th className="px-5 py-3 text-left font-medium">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {activeStatusClients.map((client) => (
                                <tr key={client.id} className="hover:bg-slate-50/50">
                                  <td className="px-5 py-3">
                                    <p className="font-medium text-slate-900">{client.name}</p>
                                    <p className="text-xs text-slate-500">{client.email}</p>
                                  </td>
                                  <td className="px-5 py-3">
                                    <p className="text-slate-900">{client.full_name}</p>
                                    <p className="text-xs text-slate-500">{client.phone}</p>
                                  </td>
                                  <td className="px-5 py-3 font-medium text-slate-900">{client.plan}</td>
                                  <td className="px-5 py-3 font-semibold text-emerald-600">${client.plan_price}/mo</td>
                                  <td className="px-5 py-3 text-sm text-slate-600">
                                    {client.contract_end_date ? new Date(client.contract_end_date).toLocaleDateString() : '—'}
                                  </td>
                                  <td className="px-5 py-3">
                                    <button onClick={() => { setClientToUpdate(client); setShowStatusModal(true); }} className="hover:opacity-80 transition">
                                      {getStatusBadgeNew(client.status)}
                                    </button>
                                  </td>
                                  <td className="px-5 py-3">
                                    <button
                                      onClick={() => { setClientToDelete(client); setShowDeleteModal(true); }}
                                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Section 3: Inactive Clients */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
                  <button
                    onClick={() => toggleSection('inactive')}
                    className="w-full px-4 md:px-5 py-3 md:py-4 flex items-center justify-between hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white text-sm">📁</span>
                      <div className="text-left">
                        <h3 className="font-semibold text-slate-900 text-sm md:text-base">Inactive Clients</h3>
                        <p className="text-xs text-slate-500">{inactiveClients.length} on hold or cancelled</p>
                      </div>
                    </div>
                    <svg className={`w-5 h-5 text-slate-400 transition-transform ${expandedSections.inactive ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  
                  {expandedSections.inactive && (
                    inactiveClients.length === 0 ? (
                      <div className="p-6 md:p-10 text-center border-t border-slate-100">
                        <div className="text-4xl mb-2">👍</div>
                        <p className="text-slate-500 font-medium">No inactive clients.</p>
                      </div>
                    ) : (
                      <div className="border-t border-slate-100">
                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-slate-100">
                          {inactiveClients.map((client) => (
                            <div key={client.id} className="p-4 space-y-3 opacity-60">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium text-slate-900">{client.name}</p>
                                  <p className="text-xs text-slate-500">{client.email}</p>
                                </div>
                                <button onClick={() => { setClientToUpdate(client); setShowStatusModal(true); }}>
                                  {getStatusBadgeNew(client.status)}
                                </button>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600">{client.full_name}</span>
                                <span className="font-medium text-slate-900">{client.plan}</span>
                                <span className="text-slate-500">${client.plan_price}</span>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => { setClientToUpdate(client); setShowStatusModal(true); }} className="flex-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-medium rounded-lg transition">Reactivate</button>
                                <button
                                  onClick={() => { setClientToDelete(client); setShowDeleteModal(true); }}
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                              <tr>
                                <th className="px-5 py-3 text-left font-medium">Business</th>
                                <th className="px-5 py-3 text-left font-medium">Contact</th>
                                <th className="px-5 py-3 text-left font-medium">Plan</th>
                                <th className="px-5 py-3 text-left font-medium">Monthly</th>
                                <th className="px-5 py-3 text-left font-medium">Status</th>
                                <th className="px-5 py-3 text-left font-medium">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {inactiveClients.map((client) => (
                                <tr key={client.id} className="hover:bg-slate-50/50 opacity-60">
                                  <td className="px-5 py-3">
                                    <p className="font-medium text-slate-900">{client.name}</p>
                                    <p className="text-xs text-slate-500">{client.email}</p>
                                  </td>
                                  <td className="px-5 py-3">
                                    <p className="text-slate-900">{client.full_name}</p>
                                    <p className="text-xs text-slate-500">{client.phone}</p>
                                  </td>
                                  <td className="px-5 py-3 font-medium text-slate-900">{client.plan}</td>
                                  <td className="px-5 py-3 text-slate-500">${client.plan_price}</td>
                                  <td className="px-5 py-3">
                                    <button onClick={() => { setClientToUpdate(client); setShowStatusModal(true); }} className="hover:opacity-80 transition">
                                      {getStatusBadgeNew(client.status)}
                                    </button>
                                  </td>
                                  <td className="px-5 py-3">
                                    <div className="flex items-center gap-2">
                                      <button onClick={() => { setClientToUpdate(client); setShowStatusModal(true); }} className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-medium rounded-lg transition">Reactivate</button>
                                      <button
                                        onClick={() => { setClientToDelete(client); setShowDeleteModal(true); }}
                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Earnings View */}
                {/* Earnings Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5 mb-6 md:mb-8">
                  <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-4 md:p-5 text-white shadow-lg">
                    <p className="text-emerald-100 text-xs md:text-sm">Total Commission Earned</p>
                    <p className="text-2xl md:text-3xl font-bold mt-1">${totalCommissionEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 md:p-5 text-white shadow-lg">
                    <p className="text-blue-100 text-xs md:text-sm">Monthly Commission</p>
                    <p className="text-2xl md:text-3xl font-bold mt-1">${monthlyRecurring.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    <p className="text-blue-200 text-xs mt-1">({recurringCommissionRate}% of active)</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 md:p-5 text-white shadow-lg">
                    <p className="text-purple-100 text-xs md:text-sm">Total Payments</p>
                    <p className="text-2xl md:text-3xl font-bold mt-1">{payments.length}</p>
                  </div>
                </div>

                {/* Client Earnings Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden mb-6">
                  <div className="px-4 md:px-5 py-3 md:py-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900 text-sm md:text-base">💵 Earnings by Client</h3>
                    <p className="text-slate-500 text-xs mt-1">Track your commission from each client</p>
                  </div>
                  
                  {activeClients.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="text-6xl mb-4">📊</div>
                      <h3 className="text-xl font-bold text-gray-700 mb-2">No clients yet</h3>
                      <p className="text-gray-500">Your earnings will appear here once you have clients</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Business</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Plan</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Monthly Rate</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Payments Made</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">My Earnings</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {activeClients.map((client) => (
                            <tr key={client.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="font-bold text-gray-900">{client.name}</div>
                                <div className="text-sm text-gray-500">{client.full_name}</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="font-bold text-gray-900">{client.plan}</span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="font-bold text-gray-700">${client.plan_price}/mo</span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                                  {paymentsByClient[client.id] || 0} of 12
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="font-black text-green-600 text-lg">
                                  ${(commissionByClient[client.id] || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                {getStatusBadgeNew(client.status || 'awaiting_payment')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Recent Payments */}
                {payments.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden mt-6">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-xl font-black text-gray-900">📅 Recent Payments</h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Date</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Client</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Month #</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Payment</th>
                            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">My Commission</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {payments.slice(0, 10).map((payment) => {
                            const client = activeClients.find(c => c.id === payment.client_id);
                            return (
                              <tr key={payment.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-600">
                                  {new Date(payment.paid_date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-900">
                                  {client?.name || 'Unknown'}
                                </td>
                                <td className="px-6 py-4">
                                  <span className="px-2 py-1 bg-gray-100 rounded text-sm font-bold">
                                    Month {payment.month_number}
                                  </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-700">
                                  ${parseFloat(payment.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-6 py-4 font-black text-green-600">
                                  ${parseFloat(payment.commission_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        ) : activeTab === 'plans' ? (
          <PlansAndPrices />
        ) : activeTab === 'sales-center' ? (
          <SalesCenter />
        ) : activeTab === 'commission' ? (
          <CommissionEstimator currentUser={currentUser} />
        ) : activeTab === 'proposal' ? (
          <ProposalBuilder currentUser={currentUser} />
        ) : activeTab === 'quick-actions' ? (
          <QuickActions />
        ) : activeTab === 'profile' ? (
          <Profile currentUser={currentUser} setCurrentUser={setCurrentUser} />
        ) : (
          <SalesCenter />
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-slate-200 bg-white">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src="/icon.png" alt="Kinect B2B" className="w-5 h-5 rounded" />
          <span className="text-slate-500 text-sm">Powered by <span className="font-semibold text-slate-700">Kinect B2B</span></span>
        </div>
        <p className="text-slate-400 text-xs">© {new Date().getFullYear()} Kinect B2B. All rights reserved.</p>
      </footer>
    </div>

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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && clientToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Delete Client?</h3>
                <p className="text-gray-600 mb-2">
                  Are you sure you want to delete <span className="font-bold">{clientToDelete.name}</span>?
                </p>
                <p className="text-sm text-gray-500">
                  This action cannot be undone.
                </p>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setClientToDelete(null);
                  }}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteClient}
                  disabled={deleting}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && clientToUpdate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-black text-gray-900">Change Status</h3>
                <p className="text-gray-600 mt-1">{clientToUpdate.name}</p>
              </div>

              <div className="space-y-2">
                {Object.entries(STATUS_CONFIG).map(([statusKey, config]) => (
                  <button
                    key={statusKey}
                    onClick={() => handleStatusChange(clientToUpdate.id, statusKey)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition flex items-center justify-between ${
                      clientToUpdate.status === statusKey || (!clientToUpdate.status && statusKey === 'awaiting_payment')
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{config.emoji}</span>
                      <span className="font-bold text-gray-900">{config.label}</span>
                    </div>
                    {(clientToUpdate.status === statusKey || (!clientToUpdate.status && statusKey === 'awaiting_payment')) && (
                      <span className="text-green-600 font-bold">✓ Current</span>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setClientToUpdate(null);
                }}
                className="w-full mt-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}