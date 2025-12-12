'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import PaymentModal from '../dashboard/components/PaymentModal';

const supabase = createClient(
  'https://zsjmqlsnvkbtdhjbtwkr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzam1xbHNudmtidGRoamJ0d2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMzcxOTYsImV4cCI6MjA3NzYxMzE5Nn0.vsbFj5m6pCaoVpHKpB3SZ2WzF4yRufOd27NlcEPhHGc'
);

export default function SalesAdminDashboard() {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainView, setMainView] = useState('sales');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [dashboardView, setDashboardView] = useState('clients');
  const [myClients, setMyClients] = useState([]);
  const [myPayments, setMyPayments] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    needsAttention: true,
    active: true,
    inactive: false,
  });
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [clientToUpdate, setClientToUpdate] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const [adminTab, setAdminTab] = useState('team');
  const [salesUsers, setSalesUsers] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [selectedClientForPayment, setSelectedClientForPayment] = useState(null);
  const [selectedSalesperson, setSelectedSalesperson] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditPaymentModal, setShowEditPaymentModal] = useState(false);
  const [paymentToEdit, setPaymentToEdit] = useState(null);
  const [showDeletePaymentModal, setShowDeletePaymentModal] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const [deletingPayment, setDeletingPayment] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [savingUser, setSavingUser] = useState(false);
  const [uploadingLicense, setUploadingLicense] = useState(false);
  
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    email: '',
    full_name: '',
    role: 'sales_rep',
    first_month_commission: 50,
    recurring_commission: 10,
  });

  const [newPayment, setNewPayment] = useState({
    month_number: 1,
    amount: '',
    commission_percent: '',
    paid_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const STATUS_CONFIG = {
    awaiting_payment: { label: 'Awaiting Payment', color: 'yellow', emoji: '⏳' },
    payment_failed: { label: 'Payment Failed', color: 'red', emoji: '❌' },
    renewal_due: { label: 'Renewal Due', color: 'orange', emoji: '🔄' },
    plan_lapsed: { label: 'Plan Lapsed', color: 'red', emoji: '⚠️' },
    active: { label: 'Active', color: 'green', emoji: '✅' },
    on_hold: { label: 'On Hold', color: 'blue', emoji: '⏸️' },
    cancelled: { label: 'Cancelled', color: 'gray', emoji: '🚫' },
  };

  useEffect(() => {
    const adminData = localStorage.getItem('sales_admin');
    if (!adminData) {
      window.location.href = '/sales/admin/login';
      return;
    }
    try {
      const admin = JSON.parse(adminData);
      if (admin.role !== 'admin') {
        window.location.href = '/sales/login';
        return;
      }
      // Fetch full profile including photo
      const fetchAdminProfile = async () => {
        const { data: profileData } = await supabase
          .from('sales_users')
          .select('*')
          .ilike('email', admin.email)
          .single();
        
        const adminWithProfile = {
          ...admin,
          profile_photo_url: profileData?.profile_photo_url || '',
          full_name: profileData?.full_name || admin.full_name,
        };
        setAdminUser(adminWithProfile);
      };
      fetchAdminProfile();
      fetchAllData(admin.email);
    } catch (error) {
      window.location.href = '/sales/admin/login';
    }
  }, []);

  const fetchAllData = async (adminEmail) => {
    setLoading(true);
    await Promise.all([
      fetchSalesUsers(),
      fetchAllClients(),
      fetchAllPayments(),
      fetchMyClients(adminEmail),
      fetchMyPayments(adminEmail),
    ]);
    setLoading(false);
  };

  const fetchSalesUsers = async () => {
    const { data } = await supabase.from('sales_users').select('*').order('created_at', { ascending: false });
    setSalesUsers(data || []);
  };

  const fetchAllClients = async () => {
    const { data } = await supabase.from('active_clients').select('*').order('created_at', { ascending: false });
    setAllClients(data || []);
  };

  const fetchAllPayments = async () => {
    const { data } = await supabase.from('client_payments').select('*').order('paid_date', { ascending: false });
    setAllPayments(data || []);
  };

  const fetchMyClients = async (email) => {
    const { data } = await supabase.from('active_clients').select('*').ilike('sales_rep_email', email).order('created_at', { ascending: false });
    setMyClients(data || []);
  };

  const fetchMyPayments = async (email) => {
    const { data } = await supabase.from('client_payments').select('*').ilike('sales_rep_email', email).order('paid_date', { ascending: false });
    setMyPayments(data || []);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('sales_users').insert([newUser]);
      if (error) throw error;
      alert('Sales user added successfully!');
      setShowAddUserModal(false);
      setNewUser({ username: '', password: '', email: '', full_name: '', role: 'sales_rep', first_month_commission: 50, recurring_commission: 10 });
      fetchSalesUsers();
    } catch (error) {
      alert('Failed to add user: ' + error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this sales user?')) return;
    try {
      await supabase.from('sales_users').delete().eq('id', userId);
      fetchSalesUsers();
    } catch (error) {
      alert('Failed to delete user: ' + error.message);
    }
  };

  const handleOpenUserModal = (user) => {
    setSelectedUser(user);
    setEditingUser({
      ...user,
      new_password: '',
      confirm_password: '',
    });
    setShowUserModal(true);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;
    setSavingUser(true);
    
    try {
      const updateData = {
        full_name: editingUser.full_name,
        email: editingUser.email,
        phone: editingUser.phone,
        role: editingUser.role,
        first_month_commission: editingUser.first_month_commission,
        recurring_commission: editingUser.recurring_commission,
        // Payment info
        payment_method: editingUser.payment_method,
        routing_number: editingUser.routing_number,
        account_number: editingUser.account_number,
        zelle_contact: editingUser.zelle_contact,
        // Tax info
        tax_legal_name: editingUser.tax_legal_name,
        tax_id_type: editingUser.tax_id_type,
        tax_id_number: editingUser.tax_id_number,
        tax_business_name: editingUser.tax_business_name,
        tax_street1: editingUser.tax_street1,
        tax_street2: editingUser.tax_street2,
        tax_suite: editingUser.tax_suite,
        tax_city: editingUser.tax_city,
        tax_state: editingUser.tax_state,
        tax_zip: editingUser.tax_zip,
        tax_info_completed: editingUser.tax_info_completed,
        // Driver's license
        drivers_license_front_url: editingUser.drivers_license_front_url,
        drivers_license_back_url: editingUser.drivers_license_back_url,
        drivers_license_uploaded: editingUser.drivers_license_uploaded,
      };

      // Only update password if a new one was entered
      if (editingUser.new_password && editingUser.new_password === editingUser.confirm_password) {
        updateData.password = editingUser.new_password;
      }

      const { error } = await supabase
        .from('sales_users')
        .update(updateData)
        .eq('id', editingUser.id);

      if (error) throw error;

      alert('User updated successfully!');
      setShowUserModal(false);
      setSelectedUser(null);
      setEditingUser(null);
      fetchSalesUsers();
    } catch (error) {
      alert('Failed to update user: ' + error.message);
    } finally {
      setSavingUser(false);
    }
  };

  const handleLicenseUpload = async (e, side) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingLicense(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${editingUser.username?.replace('@', '-').replace('.', '-')}-license-${side}-${Date.now()}.${fileExt}`;
      const filePath = `drivers-licenses/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('sales-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('sales-assets')
        .getPublicUrl(filePath);

      setEditingUser(prev => ({
        ...prev,
        [side === 'front' ? 'drivers_license_front_url' : 'drivers_license_back_url']: publicUrl,
        drivers_license_uploaded: 'true'
      }));

    } catch (error) {
      alert('Failed to upload image: ' + error.message);
    } finally {
      setUploadingLicense(false);
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!selectedClientForPayment) return;
    const paymentAmount = parseFloat(newPayment.amount);
    const commissionPercent = parseFloat(newPayment.commission_percent);
    const commissionAmount = (paymentAmount * commissionPercent) / 100;

    try {
      const { error } = await supabase.from('client_payments').insert([{
        client_id: selectedClientForPayment.id,
        sales_rep_email: selectedClientForPayment.sales_rep_email,
        month_number: parseInt(newPayment.month_number),
        amount: paymentAmount,
        commission_amount: commissionAmount,
        paid_date: newPayment.paid_date,
        notes: newPayment.notes,
      }]);
      if (error) throw error;
      alert('Payment recorded successfully!');
      setShowRecordPaymentModal(false);
      setSelectedClientForPayment(null);
      setNewPayment({ month_number: 1, amount: '', commission_percent: '', paid_date: new Date().toISOString().split('T')[0], notes: '' });
      fetchAllPayments();
      if (adminUser) fetchMyPayments(adminUser.email);
    } catch (error) {
      alert('Failed to record payment: ' + error.message);
    }
  };

  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    if (!paymentToEdit) return;
    try {
      const { error } = await supabase.from('client_payments').update({
        month_number: parseInt(paymentToEdit.month_number),
        amount: parseFloat(paymentToEdit.amount),
        commission_amount: parseFloat(paymentToEdit.commission_amount),
        paid_date: paymentToEdit.paid_date,
        notes: paymentToEdit.notes,
      }).eq('id', paymentToEdit.id);
      if (error) throw error;
      alert('Payment updated successfully!');
      setShowEditPaymentModal(false);
      setPaymentToEdit(null);
      fetchAllPayments();
    } catch (error) {
      alert('Failed to update payment: ' + error.message);
    }
  };

  const handleDeletePayment = async () => {
    if (!paymentToDelete) return;
    setDeletingPayment(true);
    try {
      await supabase.from('client_payments').delete().eq('id', paymentToDelete.id);
      fetchAllPayments();
      setShowDeletePaymentModal(false);
      setPaymentToDelete(null);
    } catch (error) {
      alert('Failed to delete payment: ' + error.message);
    } finally {
      setDeletingPayment(false);
    }
  };

  const handleStatusChange = async (clientId, newStatus) => {
    try {
      const updateData = { status: newStatus, status_updated_at: new Date().toISOString() };
      if (newStatus === 'active') {
        const contractStart = new Date().toISOString().split('T')[0];
        const contractEnd = new Date();
        contractEnd.setFullYear(contractEnd.getFullYear() + 1);
        updateData.contract_start_date = contractStart;
        updateData.contract_end_date = contractEnd.toISOString().split('T')[0];
      }
      await supabase.from('active_clients').update(updateData).eq('id', clientId);
      fetchAllClients();
      if (adminUser) fetchMyClients(adminUser.email);
    } catch (error) {
      alert('Failed to update status: ' + error.message);
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
    await supabase.from('active_clients').update({
      stripe_customer_id: stripeData.customerId,
      stripe_subscription_id: stripeData.subscriptionId,
      setup_fee_paid: stripeData.setupFeePaid,
      status: 'active',
      contract_start_date: contractStart,
      contract_end_date: contractEnd.toISOString().split('T')[0],
      status_updated_at: new Date().toISOString(),
    }).eq('id', clientId);
    fetchAllClients();
    setShowPaymentModal(false);
    setSelectedClient(null);
  };

  const handleDeleteClient = async () => {
    if (!clientToDelete) return;
    setDeleting(true);
    try {
      await supabase.from('active_clients').delete().eq('id', clientToDelete.id);
      fetchAllClients();
      setShowDeleteModal(false);
      setClientToDelete(null);
    } catch (error) {
      alert('Failed to delete client. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sales_admin');
    window.location.href = '/sales/admin/login';
  };

  const getStatusBadge = (status) => {
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

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const activeStatusClients = allClients.filter(c => c.status === 'active');
  const inactiveClients = allClients.filter(c => ['on_hold', 'cancelled'].includes(c.status));
  const needsAttentionClients = allClients.filter(c => !['active', 'on_hold', 'cancelled'].includes(c.status));

  const totalCommission = allPayments.reduce((sum, p) => sum + (parseFloat(p.commission_amount) || 0), 0);
  const monthlyRecurring = activeStatusClients.reduce((sum, c) => {
    const salesRep = salesUsers.find(u => u.email?.toLowerCase() === c.sales_rep_email?.toLowerCase());
    const commissionRate = parseFloat(salesRep?.recurring_commission) || 10;
    return sum + ((parseFloat(c.plan_price) || 0) * commissionRate / 100);
  }, 0);
  const paymentsByClient = allPayments.reduce((acc, p) => { acc[p.client_id] = (acc[p.client_id] || 0) + 1; return acc; }, {});
  const commissionByClient = allPayments.reduce((acc, p) => { acc[p.client_id] = (acc[p.client_id] || 0) + (parseFloat(p.commission_amount) || 0); return acc; }, {});

  const filteredAllClients = selectedSalesperson === 'all' ? allClients : allClients.filter(c => c.sales_rep_email?.toLowerCase() === selectedSalesperson.toLowerCase());
  const teamTotalCommission = allPayments.reduce((sum, p) => sum + (parseFloat(p.commission_amount) || 0), 0);
  const teamTotalRevenue = allPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
  const teamMonthlyRevenue = allClients.filter(c => c.status === 'active').reduce((sum, c) => sum + (parseFloat(c.plan_price) || 0), 0);
  const teamMonthlyCommission = allClients.filter(c => c.status === 'active').reduce((sum, c) => {
    const salesRep = salesUsers.find(u => u.email?.toLowerCase() === c.sales_rep_email?.toLowerCase());
    return sum + ((parseFloat(c.plan_price) || 0) * (parseFloat(salesRep?.recurring_commission) || 10) / 100);
  }, 0);
  const getClientPaymentCount = (clientId) => allPayments.filter(p => p.client_id === clientId).length;

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
                <p className="text-xs text-slate-400">Admin Portal</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 hover:bg-white/10 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <nav className="space-y-1">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">Navigation</p>
            <button
              onClick={() => { setMainView('sales'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mainView === 'sales' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              Dashboard
            </button>
            <button
              onClick={() => { setMainView('admin'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mainView === 'admin' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Admin Panel
            </button>
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            {adminUser?.profile_photo_url ? (
              <img src={adminUser.profile_photo_url} alt={adminUser.username} className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                {adminUser?.username?.charAt(0)?.toUpperCase() || 'A'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{adminUser?.full_name || adminUser?.username}</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-slate-400 hover:text-white transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="px-4 md:px-8 py-4 md:py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-slate-900">{mainView === 'sales' ? 'Dashboard Overview' : 'Admin Panel'}</h2>
                <p className="text-xs md:text-sm text-slate-500 mt-0.5 hidden sm:block">{mainView === 'sales' ? 'Monitor clients and earnings across your team' : 'Manage team, clients, and payments'}</p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-400">Today</p>
              <p className="text-sm font-medium text-slate-700">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8">
          {mainView === 'sales' ? (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-6 md:mb-8">
                {[
                  { label: 'Total Clients', value: allClients.length, icon: '👥', color: 'from-blue-500 to-blue-600' },
                  { label: 'Needs Attention', value: needsAttentionClients.length, icon: '⚠️', color: 'from-amber-500 to-orange-500' },
                  { label: 'Active Clients', value: activeStatusClients.length, icon: '✅', color: 'from-emerald-500 to-green-600' },
                  { label: 'Monthly Commission', value: `$${monthlyRecurring.toFixed(2)}`, icon: '💰', color: 'from-blue-500 to-cyan-500' },
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

              {/* View Toggle */}
              <div className="flex gap-2 mb-4 md:mb-6 overflow-x-auto pb-2">
                {['clients', 'earnings'].map(view => (
                  <button key={view} onClick={() => setDashboardView(view)} className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition whitespace-nowrap ${dashboardView === view ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                    {view === 'clients' ? '👥 Client Overview' : '💵 Earnings Report'}
                  </button>
                ))}
              </div>

              {dashboardView === 'clients' ? (
                <div className="space-y-4 md:space-y-5">
                  {/* Needs Attention */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
                    <button onClick={() => toggleSection('needsAttention')} className="w-full px-4 md:px-5 py-3 md:py-4 flex items-center justify-between hover:bg-slate-50 transition">
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
                      <div className="border-t border-slate-100">
                        {needsAttentionClients.length === 0 ? (
                          <div className="p-6 md:p-10 text-center"><p className="text-slate-500">🎉 All caught up! No clients need attention.</p></div>
                        ) : (
                          <>
                            {/* Mobile Card View */}
                            <div className="md:hidden divide-y divide-slate-100">
                              {needsAttentionClients.map(client => (
                                <div key={client.id} className="p-4 space-y-3">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <p className="font-medium text-slate-900">{client.name}</p>
                                      <p className="text-xs text-slate-500">{client.email}</p>
                                    </div>
                                    <button onClick={() => { setClientToUpdate(client); setShowStatusModal(true); }}>{getStatusBadge(client.status)}</button>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">{client.sales_rep_email?.split('@')[0] || '—'}</span>
                                    <span className="font-medium text-slate-900">{client.plan}</span>
                                    <span className="font-semibold text-emerald-600">${client.plan_price}</span>
                                  </div>
                                  <div className="flex gap-2">
                                    {!client.stripe_subscription_id && <button onClick={() => handleCollectPayment(client)} className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition">Collect Payment</button>}
                                    <button onClick={() => { setClientToDelete(client); setShowDeleteModal(true); }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-slate-50 text-xs text-slate-500 uppercase"><tr><th className="px-5 py-3 text-left font-medium">Business</th><th className="px-5 py-3 text-left font-medium">Sales Rep</th><th className="px-5 py-3 text-left font-medium">Plan</th><th className="px-5 py-3 text-left font-medium">Monthly</th><th className="px-5 py-3 text-left font-medium">Status</th><th className="px-5 py-3 text-left font-medium">Actions</th></tr></thead>
                                <tbody className="divide-y divide-slate-100">
                                  {needsAttentionClients.map(client => (
                                    <tr key={client.id} className="hover:bg-slate-50/50">
                                      <td className="px-5 py-3"><p className="font-medium text-slate-900">{client.name}</p><p className="text-xs text-slate-500">{client.email}</p></td>
                                      <td className="px-5 py-3 text-sm text-slate-600">{client.sales_rep_email?.split('@')[0] || '—'}</td>
                                      <td className="px-5 py-3 text-sm font-medium text-slate-900">{client.plan}</td>
                                      <td className="px-5 py-3 text-sm font-semibold text-emerald-600">${client.plan_price}</td>
                                      <td className="px-5 py-3"><button onClick={() => { setClientToUpdate(client); setShowStatusModal(true); }}>{getStatusBadge(client.status)}</button></td>
                                      <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                          {!client.stripe_subscription_id && <button onClick={() => handleCollectPayment(client)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition">Collect</button>}
                                          <button onClick={() => { setClientToDelete(client); setShowDeleteModal(true); }} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Active Clients */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
                    <button onClick={() => toggleSection('active')} className="w-full px-4 md:px-5 py-3 md:py-4 flex items-center justify-between hover:bg-slate-50 transition">
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
                      <div className="border-t border-slate-100">
                        {activeStatusClients.length === 0 ? (
                          <div className="p-6 md:p-10 text-center"><p className="text-slate-500">No active clients yet.</p></div>
                        ) : (
                          <>
                            {/* Mobile Card View */}
                            <div className="md:hidden divide-y divide-slate-100">
                              {activeStatusClients.map(client => (
                                <div key={client.id} className="p-4 space-y-3">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <p className="font-medium text-slate-900">{client.name}</p>
                                      <p className="text-xs text-slate-500">{client.email}</p>
                                    </div>
                                    <button onClick={() => { setClientToUpdate(client); setShowStatusModal(true); }}>{getStatusBadge(client.status)}</button>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">{client.sales_rep_email?.split('@')[0] || '—'}</span>
                                    <span className="font-medium text-slate-900">{client.plan}</span>
                                    <span className="font-semibold text-emerald-600">${client.plan_price}/mo</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500">Ends: {client.contract_end_date ? new Date(client.contract_end_date).toLocaleDateString() : '—'}</span>
                                    <button onClick={() => { setClientToDelete(client); setShowDeleteModal(true); }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-slate-50 text-xs text-slate-500 uppercase"><tr><th className="px-5 py-3 text-left font-medium">Business</th><th className="px-5 py-3 text-left font-medium">Sales Rep</th><th className="px-5 py-3 text-left font-medium">Plan</th><th className="px-5 py-3 text-left font-medium">Monthly</th><th className="px-5 py-3 text-left font-medium">Contract End</th><th className="px-5 py-3 text-left font-medium">Status</th><th className="px-5 py-3 text-left font-medium">Actions</th></tr></thead>
                                <tbody className="divide-y divide-slate-100">
                                  {activeStatusClients.map(client => (
                                    <tr key={client.id} className="hover:bg-slate-50/50">
                                      <td className="px-5 py-3"><p className="font-medium text-slate-900">{client.name}</p><p className="text-xs text-slate-500">{client.email}</p></td>
                                      <td className="px-5 py-3 text-sm text-slate-600">{client.sales_rep_email?.split('@')[0] || '—'}</td>
                                      <td className="px-5 py-3 text-sm font-medium text-slate-900">{client.plan}</td>
                                      <td className="px-5 py-3 text-sm font-semibold text-emerald-600">${client.plan_price}</td>
                                      <td className="px-5 py-3 text-sm text-slate-600">{client.contract_end_date ? new Date(client.contract_end_date).toLocaleDateString() : '—'}</td>
                                      <td className="px-5 py-3"><button onClick={() => { setClientToUpdate(client); setShowStatusModal(true); }}>{getStatusBadge(client.status)}</button></td>
                                      <td className="px-5 py-3"><button onClick={() => { setClientToDelete(client); setShowDeleteModal(true); }} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Inactive Clients */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
                    <button onClick={() => toggleSection('inactive')} className="w-full px-4 md:px-5 py-3 md:py-4 flex items-center justify-between hover:bg-slate-50 transition">
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
                      <div className="border-t border-slate-100">
                        {inactiveClients.length === 0 ? (
                          <div className="p-6 md:p-10 text-center"><p className="text-slate-500">No inactive clients.</p></div>
                        ) : (
                          <>
                            {/* Mobile Card View */}
                            <div className="md:hidden divide-y divide-slate-100">
                              {inactiveClients.map(client => (
                                <div key={client.id} className="p-4 space-y-3 opacity-60">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <p className="font-medium text-slate-900">{client.name}</p>
                                      <p className="text-xs text-slate-500">{client.email}</p>
                                    </div>
                                    <button onClick={() => { setClientToUpdate(client); setShowStatusModal(true); }}>{getStatusBadge(client.status)}</button>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">{client.sales_rep_email?.split('@')[0] || '—'}</span>
                                    <span className="font-medium text-slate-900">{client.plan}</span>
                                    <span className="text-slate-500">${client.plan_price}</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <button onClick={() => { setClientToUpdate(client); setShowStatusModal(true); }} className="flex-1 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-medium rounded-lg transition">Reactivate</button>
                                    <button onClick={() => { setClientToDelete(client); setShowDeleteModal(true); }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-slate-50 text-xs text-slate-500 uppercase"><tr><th className="px-5 py-3 text-left font-medium">Business</th><th className="px-5 py-3 text-left font-medium">Sales Rep</th><th className="px-5 py-3 text-left font-medium">Plan</th><th className="px-5 py-3 text-left font-medium">Monthly</th><th className="px-5 py-3 text-left font-medium">Status</th><th className="px-5 py-3 text-left font-medium">Actions</th></tr></thead>
                                <tbody className="divide-y divide-slate-100">
                                  {inactiveClients.map(client => (
                                    <tr key={client.id} className="hover:bg-slate-50/50 opacity-60">
                                      <td className="px-5 py-3"><p className="font-medium text-slate-900">{client.name}</p><p className="text-xs text-slate-500">{client.email}</p></td>
                                      <td className="px-5 py-3 text-sm text-slate-600">{client.sales_rep_email?.split('@')[0] || '—'}</td>
                                      <td className="px-5 py-3 text-sm font-medium text-slate-900">{client.plan}</td>
                                      <td className="px-5 py-3 text-sm text-slate-500">${client.plan_price}</td>
                                      <td className="px-5 py-3"><button onClick={() => { setClientToUpdate(client); setShowStatusModal(true); }}>{getStatusBadge(client.status)}</button></td>
                                      <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                          <button onClick={() => { setClientToUpdate(client); setShowStatusModal(true); }} className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-medium rounded-lg transition">Reactivate</button>
                                          <button onClick={() => { setClientToDelete(client); setShowDeleteModal(true); }} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 md:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5">
                    <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-4 md:p-5 text-white shadow-lg">
                      <p className="text-emerald-100 text-xs md:text-sm">Total Commission Paid</p>
                      <p className="text-2xl md:text-3xl font-bold mt-1">${totalCommission.toFixed(2)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 md:p-5 text-white shadow-lg">
                      <p className="text-blue-100 text-xs md:text-sm">Monthly Commission</p>
                      <p className="text-2xl md:text-3xl font-bold mt-1">${monthlyRecurring.toFixed(2)}</p>
                    </div>
                    <div className="bg-blue-600 rounded-xl p-4 md:p-5 text-white shadow-lg">
                      <p className="text-blue-100 text-xs md:text-sm">Total Payments</p>
                      <p className="text-2xl md:text-3xl font-bold mt-1">{allPayments.length}</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
                    <div className="px-4 md:px-5 py-3 md:py-4 border-b border-slate-100"><h3 className="font-semibold text-slate-900 text-sm md:text-base">Earnings by Client</h3></div>
                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-slate-100">
                      {allClients.map(client => (
                        <div key={client.id} className="p-4 space-y-2">
                          <div className="flex items-start justify-between">
                            <p className="font-medium text-slate-900">{client.name}</p>
                            {getStatusBadge(client.status)}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">{client.sales_rep_email?.split('@')[0] || '—'}</span>
                            <span className="font-medium text-slate-900">{client.plan}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">{paymentsByClient[client.id] || 0} of 12</span>
                            <span className="font-semibold text-emerald-600">${(commissionByClient[client.id] || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase"><tr><th className="px-5 py-3 text-left font-medium">Business</th><th className="px-5 py-3 text-left font-medium">Sales Rep</th><th className="px-5 py-3 text-left font-medium">Plan</th><th className="px-5 py-3 text-left font-medium">Payments</th><th className="px-5 py-3 text-left font-medium">Commission</th><th className="px-5 py-3 text-left font-medium">Status</th></tr></thead>
                        <tbody className="divide-y divide-slate-100">
                          {allClients.map(client => (
                            <tr key={client.id} className="hover:bg-slate-50/50">
                              <td className="px-5 py-3 font-medium text-slate-900">{client.name}</td>
                              <td className="px-5 py-3 text-sm text-slate-600">{client.sales_rep_email?.split('@')[0] || '—'}</td>
                              <td className="px-5 py-3 text-sm font-medium text-slate-900">{client.plan}</td>
                              <td className="px-5 py-3"><span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">{paymentsByClient[client.id] || 0} of 12</span></td>
                              <td className="px-5 py-3 font-semibold text-emerald-600">${(commissionByClient[client.id] || 0).toFixed(2)}</td>
                              <td className="px-5 py-3">{getStatusBadge(client.status)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-4 md:mb-6 overflow-x-auto pb-2">
                {[{ id: 'team', label: 'Sales Team', icon: '👥' }, { id: 'clients', label: 'All Clients', icon: '📋' }, { id: 'payments', label: 'Payments', icon: '💳' }, { id: 'earnings', label: 'Team Earnings', icon: '📊' }].map(tab => (
                  <button key={tab.id} onClick={() => setAdminTab(tab.id)} className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition whitespace-nowrap ${adminTab === tab.id ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                    {tab.icon} <span className="hidden sm:inline">{tab.label}</span><span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {adminTab === 'team' && (
                <>
                  <div className="flex justify-end mb-4 md:mb-6">
                    <button onClick={() => setShowAddUserModal(true)} className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                      <span className="hidden sm:inline">Add Sales User</span><span className="sm:hidden">Add</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                    {salesUsers.map(user => {
                      const userClients = allClients.filter(c => c.sales_rep_email?.toLowerCase() === user.email?.toLowerCase());
                      const userPayments = allPayments.filter(p => p.sales_rep_email?.toLowerCase() === user.email?.toLowerCase());
                      const userCommission = userPayments.reduce((sum, p) => sum + (parseFloat(p.commission_amount) || 0), 0);
                      return (
                        <div key={user.id} className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden hover:shadow-md transition cursor-pointer" onClick={() => handleOpenUserModal(user)}>
                          <div className="p-5">
                            <div className="flex items-start gap-4 mb-5">
                              {user.profile_photo_url ? (
                                <img src={user.profile_photo_url} alt={user.full_name || user.username} className="w-12 h-12 rounded-xl object-cover shadow-lg" />
                              ) : (
                                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                                  {user.full_name?.charAt(0) || user.username?.charAt(0)}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-900 truncate">{user.full_name || user.username}</h3>
                                <p className="text-sm text-slate-500 truncate">{user.email}</p>
                                <span className={`inline-flex mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-blue-100 text-blue-700' : user.role === 'manager' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>{user.role === 'sales_rep' ? 'Sales Rep' : user.role}</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3 mb-4">
                              <div className="text-center p-2 bg-slate-50 rounded-lg"><p className="text-lg font-bold text-slate-900">{userClients.length}</p><p className="text-xs text-slate-500">Clients</p></div>
                              <div className="text-center p-2 bg-emerald-50 rounded-lg"><p className="text-lg font-bold text-emerald-600">{userClients.filter(c => c.status === 'active').length}</p><p className="text-xs text-slate-500">Active</p></div>
                              <div className="text-center p-2 bg-blue-50 rounded-lg"><p className="text-lg font-bold text-blue-600">${userCommission.toFixed(0)}</p><p className="text-xs text-slate-500">Earned</p></div>
                            </div>
                            <p className="text-xs text-slate-500 mb-4">Commission: {user.first_month_commission || 50}% first / {user.recurring_commission || 10}% recurring</p>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteUser(user.id); }} className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition text-sm">Delete User</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {adminTab === 'payments' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5 mb-4 md:mb-6">
                    <div className="bg-blue-600 rounded-xl p-4 md:p-5 text-white shadow-lg"><p className="text-blue-100 text-xs md:text-sm">Total Revenue</p><p className="text-2xl md:text-3xl font-bold mt-1">${teamTotalRevenue.toFixed(2)}</p></div>
                    <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-4 md:p-5 text-white shadow-lg"><p className="text-emerald-100 text-xs md:text-sm">Commission Paid</p><p className="text-2xl md:text-3xl font-bold mt-1">${teamTotalCommission.toFixed(2)}</p></div>
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 md:p-5 text-white shadow-lg"><p className="text-blue-100 text-xs md:text-sm">Total Payments</p><p className="text-2xl md:text-3xl font-bold mt-1">{allPayments.length}</p></div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
                    <div className="px-4 md:px-5 py-3 md:py-4 border-b border-slate-100"><h3 className="font-semibold text-slate-900 text-sm md:text-base">All Payment Records</h3></div>
                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-slate-100">
                      {allPayments.map(payment => {
                        const client = allClients.find(c => c.id === payment.client_id);
                        return (
                          <div key={payment.id} className="p-4 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-slate-900">{client?.name || 'Unknown'}</p>
                                <p className="text-xs text-slate-500">{payment.sales_rep_email?.split('@')[0]}</p>
                              </div>
                              <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">Month {payment.month_number}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-500">{new Date(payment.paid_date).toLocaleDateString()}</span>
                              <span className="font-medium text-slate-900">${parseFloat(payment.amount).toFixed(2)}</span>
                              <span className="font-semibold text-emerald-600">${parseFloat(payment.commission_amount).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-end gap-2">
                              <button onClick={() => { setPaymentToEdit({ ...payment, paid_date: payment.paid_date?.split('T')[0] || payment.paid_date }); setShowEditPaymentModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                              <button onClick={() => { setPaymentToDelete({ ...payment, clientName: client?.name || 'Unknown' }); setShowDeletePaymentModal(true); }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase"><tr><th className="px-5 py-3 text-left font-medium">Date</th><th className="px-5 py-3 text-left font-medium">Client</th><th className="px-5 py-3 text-left font-medium">Sales Rep</th><th className="px-5 py-3 text-left font-medium">Month</th><th className="px-5 py-3 text-left font-medium">Amount</th><th className="px-5 py-3 text-left font-medium">Commission</th><th className="px-5 py-3 text-left font-medium">Actions</th></tr></thead>
                        <tbody className="divide-y divide-slate-100">
                          {allPayments.map(payment => {
                            const client = allClients.find(c => c.id === payment.client_id);
                            return (
                              <tr key={payment.id} className="hover:bg-slate-50/50">
                                <td className="px-5 py-3 text-sm text-slate-600">{new Date(payment.paid_date).toLocaleDateString()}</td>
                                <td className="px-5 py-3 font-medium text-slate-900">{client?.name || 'Unknown'}</td>
                                <td className="px-5 py-3 text-sm text-slate-600">{payment.sales_rep_email?.split('@')[0]}</td>
                                <td className="px-5 py-3"><span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">Month {payment.month_number}</span></td>
                                <td className="px-5 py-3 font-medium text-slate-900">${parseFloat(payment.amount).toFixed(2)}</td>
                                <td className="px-5 py-3 font-semibold text-emerald-600">${parseFloat(payment.commission_amount).toFixed(2)}</td>
                                <td className="px-5 py-3">
                                  <div className="flex items-center gap-1">
                                    <button onClick={() => { setPaymentToEdit({ ...payment, paid_date: payment.paid_date?.split('T')[0] || payment.paid_date }); setShowEditPaymentModal(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                                    <button onClick={() => { setPaymentToDelete({ ...payment, clientName: client?.name || 'Unknown' }); setShowDeletePaymentModal(true); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {adminTab === 'earnings' && (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-4 md:mb-6">
                    <div className="bg-blue-600 rounded-xl p-4 md:p-5 text-white shadow-lg"><p className="text-blue-100 text-xs md:text-sm">Total Revenue</p><p className="text-xl md:text-2xl font-bold mt-1">${teamTotalRevenue.toFixed(2)}</p></div>
                    <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-4 md:p-5 text-white shadow-lg"><p className="text-emerald-100 text-xs md:text-sm">Commission Paid</p><p className="text-xl md:text-2xl font-bold mt-1">${teamTotalCommission.toFixed(2)}</p></div>
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 md:p-5 text-white shadow-lg"><p className="text-blue-100 text-xs md:text-sm">Monthly Revenue</p><p className="text-xl md:text-2xl font-bold mt-1">${teamMonthlyRevenue.toFixed(2)}</p><p className="text-xs text-blue-200 mt-1">${teamMonthlyCommission.toFixed(2)} commission</p></div>
                    <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-4 md:p-5 text-white shadow-lg"><p className="text-orange-100 text-xs md:text-sm">Active Clients</p><p className="text-xl md:text-2xl font-bold mt-1">{activeStatusClients.length}</p></div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
                    <div className="px-4 md:px-5 py-3 md:py-4 border-b border-slate-100"><h3 className="font-semibold text-slate-900 text-sm md:text-base">Earnings by Sales Rep</h3></div>
                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-slate-100">
                      {salesUsers.map(user => {
                        const userClients = allClients.filter(c => c.sales_rep_email?.toLowerCase() === user.email?.toLowerCase());
                        const userPayments = allPayments.filter(p => p.sales_rep_email?.toLowerCase() === user.email?.toLowerCase());
                        const userRevenue = userPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
                        const userCommission = userPayments.reduce((sum, p) => sum + (parseFloat(p.commission_amount) || 0), 0);
                        return (
                          <div key={user.id} className="p-4 space-y-3">
                            <div className="flex items-center gap-3">
                              {user.profile_photo_url ? (
                                <img src={user.profile_photo_url} alt={user.full_name || user.username} className="w-10 h-10 rounded-full object-cover" />
                              ) : (
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">{user.full_name?.charAt(0) || user.username?.charAt(0)}</div>
                              )}
                              <div>
                                <p className="font-medium text-slate-900">{user.full_name || user.username}</p>
                                <p className="text-xs text-slate-500">{user.email}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-center text-sm">
                              <div><p className="font-medium text-slate-900">{userClients.length}</p><p className="text-xs text-slate-500">Clients</p></div>
                              <div><p className="font-medium text-emerald-600">{userClients.filter(c => c.status === 'active').length}</p><p className="text-xs text-slate-500">Active</p></div>
                              <div><p className="font-medium text-slate-900">${userRevenue.toFixed(0)}</p><p className="text-xs text-slate-500">Revenue</p></div>
                              <div><p className="font-bold text-emerald-600">${userCommission.toFixed(0)}</p><p className="text-xs text-slate-500">Commission</p></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 text-xs text-slate-500 uppercase"><tr><th className="px-5 py-3 text-left font-medium">Sales Rep</th><th className="px-5 py-3 text-left font-medium">Clients</th><th className="px-5 py-3 text-left font-medium">Active</th><th className="px-5 py-3 text-left font-medium">Payments</th><th className="px-5 py-3 text-left font-medium">Revenue</th><th className="px-5 py-3 text-left font-medium">Commission</th></tr></thead>
                        <tbody className="divide-y divide-slate-100">
                          {salesUsers.map(user => {
                            const userClients = allClients.filter(c => c.sales_rep_email?.toLowerCase() === user.email?.toLowerCase());
                            const userPayments = allPayments.filter(p => p.sales_rep_email?.toLowerCase() === user.email?.toLowerCase());
                            const userRevenue = userPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
                            const userCommission = userPayments.reduce((sum, p) => sum + (parseFloat(p.commission_amount) || 0), 0);
                            return (
                              <tr key={user.id} className="hover:bg-slate-50/50">
                                <td className="px-5 py-3"><div className="flex items-center gap-3">{user.profile_photo_url ? (<img src={user.profile_photo_url} alt={user.full_name || user.username} className="w-9 h-9 rounded-full object-cover" />) : (<div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">{user.full_name?.charAt(0) || user.username?.charAt(0)}</div>)}<div><p className="font-medium text-slate-900">{user.full_name || user.username}</p><p className="text-xs text-slate-500">{user.email}</p></div></div></td>
                                <td className="px-5 py-3 font-medium text-slate-900">{userClients.length}</td>
                                <td className="px-5 py-3 font-medium text-emerald-600">{userClients.filter(c => c.status === 'active').length}</td>
                                <td className="px-5 py-3 font-medium text-blue-600">{userPayments.length}</td>
                                <td className="px-5 py-3 font-medium text-slate-900">${userRevenue.toFixed(2)}</td>
                                <td className="px-5 py-3 font-bold text-emerald-600 text-lg">${userCommission.toFixed(2)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="py-6 text-center border-t border-slate-200 mt-8 bg-white">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img src="/icon.png" alt="Kinect B2B" className="w-5 h-5 rounded" />
            <span className="text-slate-500 text-sm">Powered by <span className="font-semibold text-slate-700">Kinect B2B</span></span>
          </div>
          <p className="text-slate-400 text-xs">© {new Date().getFullYear()} Kinect B2B. All rights reserved.</p>
        </footer>
      </div>

      {/* MODALS */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b border-slate-100"><h2 className="text-lg font-semibold text-slate-900">Add New Sales User</h2></div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label><input type="text" value={newUser.full_name} onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Username</label><input type="text" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Email</label><input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Password</label><input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-slate-700 mb-1">First Month %</label><input type="number" value={newUser.first_month_commission} onChange={(e) => setNewUser({ ...newUser, first_month_commission: parseInt(e.target.value) })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-sm font-medium text-slate-700 mb-1">Recurring %</label><input type="number" value={newUser.recurring_commission} onChange={(e) => setNewUser({ ...newUser, recurring_commission: parseInt(e.target.value) })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              </div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Role</label><select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="sales_rep">Sales Rep</option><option value="manager">Manager</option><option value="admin">Admin</option></select></div>
              <div className="flex gap-3 pt-2"><button type="button" onClick={() => setShowAddUserModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition">Cancel</button><button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition">Add User</button></div>
            </form>
          </div>
        </div>
      )}

      {showRecordPaymentModal && selectedClientForPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b border-slate-100"><h2 className="text-lg font-semibold text-slate-900">Record Payment</h2><p className="text-sm text-slate-500 mt-1">Client: {selectedClientForPayment.name}</p></div>
            <form onSubmit={handleRecordPayment} className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Month Number</label><input type="number" min="1" max="12" value={newPayment.month_number} onChange={(e) => setNewPayment({ ...newPayment, month_number: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Payment Amount ($)</label><input type="number" step="0.01" value={newPayment.amount} onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Commission %</label><input type="number" step="1" min="0" max="100" value={newPayment.commission_percent} onChange={(e) => setNewPayment({ ...newPayment, commission_percent: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />{newPayment.amount && newPayment.commission_percent && <p className="text-sm text-slate-500 mt-1">Commission: <span className="font-semibold text-emerald-600">${((parseFloat(newPayment.amount) * parseFloat(newPayment.commission_percent)) / 100).toFixed(2)}</span></p>}</div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Payment Date</label><input type="date" value={newPayment.paid_date} onChange={(e) => setNewPayment({ ...newPayment, paid_date: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Notes (optional)</label><textarea value={newPayment.notes} onChange={(e) => setNewPayment({ ...newPayment, notes: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="2" /></div>
              <div className="flex gap-3 pt-2"><button type="button" onClick={() => { setShowRecordPaymentModal(false); setSelectedClientForPayment(null); }} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition">Cancel</button><button type="submit" className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition">Record Payment</button></div>
            </form>
          </div>
        </div>
      )}

      {showPaymentModal && selectedClient && <PaymentModal client={selectedClient} onClose={() => { setShowPaymentModal(false); setSelectedClient(null); }} onSuccess={handlePaymentSuccess} />}

      {showStatusModal && clientToUpdate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b border-slate-100 text-center"><h3 className="text-lg font-semibold text-slate-900">Change Status</h3><p className="text-sm text-slate-500">{clientToUpdate.name}</p></div>
            <div className="p-4 space-y-2">
              {Object.entries(STATUS_CONFIG).map(([statusKey, config]) => (
                <button key={statusKey} onClick={() => { handleStatusChange(clientToUpdate.id, statusKey); setShowStatusModal(false); setClientToUpdate(null); }} className={`w-full p-3 rounded-xl border-2 text-left transition flex items-center justify-between ${clientToUpdate.status === statusKey || (!clientToUpdate.status && statusKey === 'awaiting_payment') ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                  <div className="flex items-center gap-3"><span className="text-xl">{config.emoji}</span><span className="font-medium text-slate-900">{config.label}</span></div>
                  {(clientToUpdate.status === statusKey || (!clientToUpdate.status && statusKey === 'awaiting_payment')) && <span className="text-blue-600 font-medium text-sm">✓ Current</span>}
                </button>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100"><button onClick={() => { setShowStatusModal(false); setClientToUpdate(null); }} className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition">Cancel</button></div>
          </div>
        </div>
      )}

      {showDeleteModal && clientToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Client?</h3>
              <p className="text-slate-600">Are you sure you want to delete <span className="font-semibold">{clientToDelete.name}</span>?</p>
              <p className="text-sm text-slate-500 mt-2">This action cannot be undone.</p>
            </div>
            <div className="p-4 border-t border-slate-100 flex gap-3"><button onClick={() => { setShowDeleteModal(false); setClientToDelete(null); }} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition">Cancel</button><button onClick={handleDeleteClient} disabled={deleting} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition disabled:opacity-50">{deleting ? 'Deleting...' : 'Delete'}</button></div>
          </div>
        </div>
      )}

      {showEditPaymentModal && paymentToEdit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b border-slate-100"><h2 className="text-lg font-semibold text-slate-900">Edit Payment</h2></div>
            <form onSubmit={handleUpdatePayment} className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Month Number</label><input type="number" min="1" max="12" value={paymentToEdit.month_number} onChange={(e) => setPaymentToEdit({ ...paymentToEdit, month_number: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Payment Amount ($)</label><input type="number" step="0.01" value={paymentToEdit.amount} onChange={(e) => setPaymentToEdit({ ...paymentToEdit, amount: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Commission Amount ($)</label><input type="number" step="0.01" value={paymentToEdit.commission_amount} onChange={(e) => setPaymentToEdit({ ...paymentToEdit, commission_amount: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Payment Date</label><input type="date" value={paymentToEdit.paid_date} onChange={(e) => setPaymentToEdit({ ...paymentToEdit, paid_date: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Notes (optional)</label><textarea value={paymentToEdit.notes || ''} onChange={(e) => setPaymentToEdit({ ...paymentToEdit, notes: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows="2" /></div>
              <div className="flex gap-3 pt-2"><button type="button" onClick={() => { setShowEditPaymentModal(false); setPaymentToEdit(null); }} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition">Cancel</button><button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition">Save Changes</button></div>
            </form>
          </div>
        </div>
      )}

      {showDeletePaymentModal && paymentToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Payment?</h3>
              <p className="text-slate-600">Delete payment for <span className="font-semibold">{paymentToDelete.clientName}</span>?</p>
              <p className="text-sm text-slate-500 mt-2">Month {paymentToDelete.month_number} • ${parseFloat(paymentToDelete.amount).toFixed(2)}</p>
            </div>
            <div className="p-4 border-t border-slate-100 flex gap-3"><button onClick={() => { setShowDeletePaymentModal(false); setPaymentToDelete(null); }} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition">Cancel</button><button onClick={handleDeletePayment} disabled={deletingPayment} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition disabled:opacity-50">{deletingPayment ? 'Deleting...' : 'Delete'}</button></div>
          </div>
        </div>
      )}

      {/* Sales User Profile Modal */}
      {showUserModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl my-4 md:my-8">
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4">
                {editingUser.profile_photo_url ? (
                  <img src={editingUser.profile_photo_url} alt={editingUser.full_name} className="w-12 h-12 md:w-16 md:h-16 rounded-xl object-cover" />
                ) : (
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl md:text-2xl font-bold">
                    {editingUser.full_name?.charAt(0) || editingUser.username?.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="text-lg md:text-xl font-bold text-slate-900 truncate">{editingUser.full_name || editingUser.username}</h2>
                  <p className="text-sm text-slate-500 truncate">{editingUser.email}</p>
                </div>
              </div>
              <button onClick={() => { setShowUserModal(false); setEditingUser(null); }} className="p-2 hover:bg-slate-100 rounded-lg transition">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-4 md:p-6 max-h-[70vh] overflow-y-auto">
              {/* Basic Info */}
              <div className="mb-6 md:mb-8">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 md:mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input type="text" value={editingUser.full_name || ''} onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input type="email" value={editingUser.email || ''} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                    <input type="tel" value={editingUser.phone || ''} onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="(555) 555-5555" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                    <select value={editingUser.role || 'sales_rep'} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="sales_rep">Sales Representative</option>
                      <option value="admin">Administrator</option>
                      <option value="manager">Sales Manager</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Commission Settings */}
              <div className="mb-6 md:mb-8">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 md:mb-4">Commission Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">First Month Commission (%)</label>
                    <input type="number" min="0" max="100" value={editingUser.first_month_commission || 50} onChange={(e) => setEditingUser({ ...editingUser, first_month_commission: parseInt(e.target.value) })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Recurring Commission (%)</label>
                    <input type="number" min="0" max="100" value={editingUser.recurring_commission || 10} onChange={(e) => setEditingUser({ ...editingUser, recurring_commission: parseInt(e.target.value) })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              {/* Password Change */}
              <div className="mb-6 md:mb-8">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 md:mb-4">Change Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                    <input type="password" value={editingUser.new_password || ''} onChange={(e) => setEditingUser({ ...editingUser, new_password: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Leave blank to keep current" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                    <input type="password" value={editingUser.confirm_password || ''} onChange={(e) => setEditingUser({ ...editingUser, confirm_password: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Confirm new password" />
                    {editingUser.new_password && editingUser.confirm_password && editingUser.new_password !== editingUser.confirm_password && (
                      <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6 md:mb-8">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 md:mb-4">Payment Method</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
                    <select value={editingUser.payment_method || ''} onChange={(e) => setEditingUser({ ...editingUser, payment_method: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select payment method</option>
                      <option value="zelle">Zelle</option>
                      <option value="direct_deposit">Direct Deposit</option>
                      <option value="check">Check</option>
                    </select>
                  </div>
                  {editingUser.payment_method === 'zelle' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Zelle Phone/Email</label>
                      <input type="text" value={editingUser.zelle_contact || ''} onChange={(e) => setEditingUser({ ...editingUser, zelle_contact: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Phone or email for Zelle" />
                    </div>
                  )}
                  {editingUser.payment_method === 'direct_deposit' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Routing Number</label>
                        <input type="text" value={editingUser.routing_number || ''} onChange={(e) => setEditingUser({ ...editingUser, routing_number: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Account Number</label>
                        <input type="text" value={editingUser.account_number || ''} onChange={(e) => setEditingUser({ ...editingUser, account_number: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tax Information */}
              <div className="mb-6 md:mb-8">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 md:mb-4">Tax Information</h3>
                <div className="space-y-3 md:space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Legal Name (for taxes)</label>
                      <input type="text" value={editingUser.tax_legal_name || ''} onChange={(e) => setEditingUser({ ...editingUser, tax_legal_name: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Business Name (if applicable)</label>
                      <input type="text" value={editingUser.tax_business_name || ''} onChange={(e) => setEditingUser({ ...editingUser, tax_business_name: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Tax ID Type</label>
                      <select value={editingUser.tax_id_type || ''} onChange={(e) => setEditingUser({ ...editingUser, tax_id_type: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select type</option>
                        <option value="ssn">SSN</option>
                        <option value="ein">EIN</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Tax ID Number</label>
                      <input type="text" value={editingUser.tax_id_number || ''} onChange={(e) => setEditingUser({ ...editingUser, tax_id_number: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="XXX-XX-XXXX or XX-XXXXXXX" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Street Address</label>
                    <input type="text" value={editingUser.tax_street1 || ''} onChange={(e) => setEditingUser({ ...editingUser, tax_street1: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Street Address 2</label>
                      <input type="text" value={editingUser.tax_street2 || ''} onChange={(e) => setEditingUser({ ...editingUser, tax_street2: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Apt, Suite, etc." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Suite</label>
                      <input type="text" value={editingUser.tax_suite || ''} onChange={(e) => setEditingUser({ ...editingUser, tax_suite: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 md:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                      <input type="text" value={editingUser.tax_city || ''} onChange={(e) => setEditingUser({ ...editingUser, tax_city: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                      <input type="text" value={editingUser.tax_state || ''} onChange={(e) => setEditingUser({ ...editingUser, tax_state: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength="2" placeholder="IN" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">ZIP</label>
                      <input type="text" value={editingUser.tax_zip || ''} onChange={(e) => setEditingUser({ ...editingUser, tax_zip: e.target.value })} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength="10" />
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={editingUser.tax_info_completed === 'true' || editingUser.tax_info_completed === true} onChange={(e) => setEditingUser({ ...editingUser, tax_info_completed: e.target.checked ? 'true' : 'false' })} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm font-medium text-slate-700">Tax Information Completed</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Driver's License */}
              <div className="mb-6 md:mb-8">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 md:mb-4">Driver's License</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Front */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Front of License</label>
                    {editingUser.drivers_license_front_url ? (
                      <div className="relative group">
                        <img src={editingUser.drivers_license_front_url} alt="License Front" className="w-full h-40 object-cover rounded-lg border border-slate-200" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center gap-2">
                          <a href={editingUser.drivers_license_front_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-white text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-100 transition">View</a>
                          <button onClick={() => setEditingUser({ ...editingUser, drivers_license_front_url: null, drivers_license_uploaded: 'false' })} className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition">Remove</button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition">
                        <svg className="w-10 h-10 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="text-sm text-slate-500">{uploadingLicense ? 'Uploading...' : 'Click to upload front'}</span>
                        <input type="file" accept="image/*" onChange={(e) => handleLicenseUpload(e, 'front')} className="hidden" disabled={uploadingLicense} />
                      </label>
                    )}
                  </div>
                  {/* Back */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Back of License</label>
                    {editingUser.drivers_license_back_url ? (
                      <div className="relative group">
                        <img src={editingUser.drivers_license_back_url} alt="License Back" className="w-full h-40 object-cover rounded-lg border border-slate-200" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center gap-2">
                          <a href={editingUser.drivers_license_back_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-white text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-100 transition">View</a>
                          <button onClick={() => setEditingUser({ ...editingUser, drivers_license_back_url: null })} className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition">Remove</button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition">
                        <svg className="w-10 h-10 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="text-sm text-slate-500">{uploadingLicense ? 'Uploading...' : 'Click to upload back'}</span>
                        <input type="file" accept="image/*" onChange={(e) => handleLicenseUpload(e, 'back')} className="hidden" disabled={uploadingLicense} />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Performance Stats */}
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 md:mb-4">Performance Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {(() => {
                    const userClients = allClients.filter(c => c.sales_rep_email?.toLowerCase() === editingUser.email?.toLowerCase());
                    const userPayments = allPayments.filter(p => p.sales_rep_email?.toLowerCase() === editingUser.email?.toLowerCase());
                    const totalRevenue = userPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
                    const totalCommission = userPayments.reduce((sum, p) => sum + (parseFloat(p.commission_amount) || 0), 0);
                    return (
                      <>
                        <div className="text-center p-4 bg-slate-50 rounded-xl">
                          <p className="text-2xl font-bold text-slate-900">{userClients.length}</p>
                          <p className="text-xs text-slate-500">Total Clients</p>
                        </div>
                        <div className="text-center p-4 bg-emerald-50 rounded-xl">
                          <p className="text-2xl font-bold text-emerald-600">{userClients.filter(c => c.status === 'active').length}</p>
                          <p className="text-xs text-slate-500">Active</p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-xl">
                          <p className="text-2xl font-bold text-blue-600">${totalRevenue.toFixed(0)}</p>
                          <p className="text-xs text-slate-500">Revenue</p>
                        </div>
                        <div className="text-center p-4 bg-emerald-50 rounded-xl">
                          <p className="text-2xl font-bold text-emerald-600">${totalCommission.toFixed(0)}</p>
                          <p className="text-xs text-slate-500">Commission</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 md:p-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
              <button onClick={() => { if (confirm('Delete this user?')) { handleDeleteUser(editingUser.id); setShowUserModal(false); } }} className="w-full sm:w-auto px-4 py-2 text-red-600 hover:bg-red-50 font-medium rounded-lg transition">Delete User</button>
              <div className="flex gap-3 w-full sm:w-auto">
                <button onClick={() => { setShowUserModal(false); setEditingUser(null); }} className="flex-1 sm:flex-none px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition">Cancel</button>
                <button onClick={handleSaveUser} disabled={savingUser || (editingUser.new_password && editingUser.new_password !== editingUser.confirm_password)} className="flex-1 sm:flex-none px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50">{savingUser ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}