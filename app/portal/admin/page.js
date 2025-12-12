'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zsjmqlsnvkbtdhjbtwkr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzam1xbHNudmtidGRoamJ0d2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMzcxOTYsImV4cCI6MjA3NzYxMzE5Nn0.vsbFj5m6pCaoVpHKpB3SZ2WzF4yRufOd27NlcEPhHGc'
);

export default function ClientAdminDashboard() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Selected client for detail view
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientAppointments, setClientAppointments] = useState([]);
  
  // Add client modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    full_name: '',
    email: '',
    phone: '',
    plan: '',
    plan_price: '',
    industry: '',
    password: ''
  });
  const [addingClient, setAddingClient] = useState(false);
  
  // Password change
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  
  // Delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingClient, setDeletingClient] = useState(false);
  
  // Pause confirmation
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [pausingClient, setPausingClient] = useState(false);
  
  // Add appointment
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    appointment_date: '',
    appointment_type: '',
    notes: '',
    status: 'pending'
  });
  const [addingAppointment, setAddingAppointment] = useState(false);
  
  // Edit appointment
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [showEditAppointmentModal, setShowEditAppointmentModal] = useState(false);
  
  // Search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Admin authentication check
  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    
    if (!adminData) {
      window.location.href = '/portal/admin/login';
      return;
    }

    try {
      const admin = JSON.parse(adminData);
      if (admin.role !== 'admin') {
        window.location.href = '/portal/admin/login';
        return;
      }
    } catch (error) {
      window.location.href = '/portal/admin/login';
      return;
    }

    fetchAllClients();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    window.location.href = '/portal/admin/login';
  };

  const fetchAllClients = async () => {
    try {
      const { data, error } = await supabase
        .from('active_clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientAppointments = async (clientId) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('client_id', clientId)
        .order('appointment_date', { ascending: false });

      if (error) throw error;
      setClientAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setClientAppointments([]);
    }
  };

  const handleViewDetails = async (client) => {
    setSelectedClient(client);
    await fetchClientAppointments(client.id);
  };

  const handleBackToList = () => {
    setSelectedClient(null);
    setClientAppointments([]);
  };

  // Add new client
  const handleAddClient = async () => {
    if (!newClient.name || !newClient.full_name || !newClient.email || !newClient.phone || !newClient.plan) {
      alert('Please fill in all required fields');
      return;
    }

    setAddingClient(true);
    try {
      const { data, error } = await supabase
        .from('active_clients')
        .insert([{
          name: newClient.name,
          full_name: newClient.full_name,
          email: newClient.email,
          phone: newClient.phone,
          plan: newClient.plan,
          plan_price: newClient.plan_price || null,
          industry: newClient.industry || null,
          password: newClient.password || 'Welcome2025',
          status: 'Active',
          setup_fee_paid: false,
          setup_checklist: {
            welcome_email_sent: false,
            onboarding_call_scheduled: false,
            crm_access_granted: false,
            setup_fee_billed: false,
            plan_billing_set_up: false
          }
        }])
        .select();

      if (error) throw error;

      setClients([data[0], ...clients]);
      setShowAddModal(false);
      setNewClient({
        name: '',
        full_name: '',
        email: '',
        phone: '',
        plan: '',
        plan_price: '',
        industry: '',
        password: ''
      });
      alert('Client added successfully!');
    } catch (error) {
      console.error('Error adding client:', error);
      alert('Error adding client. Please try again.');
    } finally {
      setAddingClient(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (!newPassword) {
      alert('Please enter a new password');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await supabase
        .from('active_clients')
        .update({ 
          password: newPassword,
          last_updated: new Date().toISOString()
        })
        .eq('id', selectedClient.id);

      if (error) throw error;

      // Update local state
      const updatedClient = { ...selectedClient, password: newPassword };
      setSelectedClient(updatedClient);
      setClients(clients.map(c => c.id === selectedClient.id ? updatedClient : c));
      
      setShowPasswordModal(false);
      setNewPassword('');
      setConfirmPassword('');
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password. Please try again.');
    } finally {
      setChangingPassword(false);
    }
  };

  // Delete client
  const handleDeleteClient = async () => {
    setDeletingClient(true);
    try {
      const { error } = await supabase
        .from('active_clients')
        .delete()
        .eq('id', selectedClient.id);

      if (error) throw error;

      setClients(clients.filter(c => c.id !== selectedClient.id));
      setShowDeleteModal(false);
      setSelectedClient(null);
      alert('Client deleted successfully!');
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Error deleting client. Please try again.');
    } finally {
      setDeletingClient(false);
    }
  };

  // Pause client (set password to INACTIVE2025)
  const handlePauseClient = async () => {
    setPausingClient(true);
    try {
      const newStatus = selectedClient.status === 'Paused' ? 'Active' : 'Paused';
      const newPasswordValue = newStatus === 'Paused' ? 'INACTIVE2025' : 'Welcome2025';
      
      const { error } = await supabase
        .from('active_clients')
        .update({ 
          status: newStatus,
          password: newPasswordValue,
          status_updated_at: new Date().toISOString(),
          status_notes: newStatus === 'Paused' ? 'Account paused by admin' : 'Account reactivated by admin',
          last_updated: new Date().toISOString()
        })
        .eq('id', selectedClient.id);

      if (error) throw error;

      const updatedClient = { 
        ...selectedClient, 
        status: newStatus, 
        password: newPasswordValue,
        status_notes: newStatus === 'Paused' ? 'Account paused by admin' : 'Account reactivated by admin'
      };
      setSelectedClient(updatedClient);
      setClients(clients.map(c => c.id === selectedClient.id ? updatedClient : c));
      
      setShowPauseModal(false);
      alert(newStatus === 'Paused' ? 'Client account paused!' : 'Client account reactivated!');
    } catch (error) {
      console.error('Error updating client status:', error);
      alert('Error updating client. Please try again.');
    } finally {
      setPausingClient(false);
    }
  };

  // Add appointment
  const handleAddAppointment = async () => {
    if (!newAppointment.company_name || !newAppointment.contact_person || !newAppointment.appointment_date) {
      alert('Please fill in Company Name, Contact Person, and Date');
      return;
    }

    setAddingAppointment(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          client_id: selectedClient.id,
          company_name: newAppointment.company_name,
          contact_person: newAppointment.contact_person,
          email: newAppointment.email || null,
          phone: newAppointment.phone || null,
          address: newAppointment.address || null,
          appointment_date: newAppointment.appointment_date,
          appointment_type: newAppointment.appointment_type || null,
          notes: newAppointment.notes || null,
          status: newAppointment.status || 'pending',
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;

      setClientAppointments([data[0], ...clientAppointments]);
      setShowAppointmentModal(false);
      setNewAppointment({
        company_name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: '',
        appointment_date: '',
        appointment_type: '',
        notes: '',
        status: 'pending'
      });
      alert('Appointment added successfully!');
    } catch (error) {
      console.error('Error adding appointment:', error);
      alert('Error adding appointment. Please try again.');
    } finally {
      setAddingAppointment(false);
    }
  };

  // Update appointment
  const handleUpdateAppointment = async () => {
    if (!editingAppointment) return;

    try {
      const { error } = await supabase
        .from('appointments')
        .update({
          company_name: editingAppointment.company_name,
          contact_person: editingAppointment.contact_person,
          email: editingAppointment.email,
          phone: editingAppointment.phone,
          address: editingAppointment.address,
          appointment_date: editingAppointment.appointment_date,
          appointment_type: editingAppointment.appointment_type,
          notes: editingAppointment.notes,
          status: editingAppointment.status
        })
        .eq('id', editingAppointment.id);

      if (error) throw error;

      setClientAppointments(clientAppointments.map(apt => 
        apt.id === editingAppointment.id ? editingAppointment : apt
      ));
      setShowEditAppointmentModal(false);
      setEditingAppointment(null);
      alert('Appointment updated!');
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Error updating appointment.');
    }
  };

  // Delete appointment
  const handleDeleteAppointment = async (appointmentId) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId);

      if (error) throw error;

      setClientAppointments(clientAppointments.filter(apt => apt.id !== appointmentId));
      alert('Appointment deleted!');
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert('Error deleting appointment.');
    }
  };

  // Update appointment status
  const handleUpdateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (error) throw error;

      setClientAppointments(clientAppointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Filter clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Calculate real stats
  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status?.toLowerCase() === 'active').length,
    paused: clients.filter(c => c.status?.toLowerCase() === 'paused').length,
    revenue: clients
      .filter(c => c.status?.toLowerCase() === 'active')
      .reduce((sum, c) => sum + (parseFloat(c.plan_price) || 0), 0)
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'clients', label: 'All Clients', icon: '👥' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Client Detail View
  if (selectedClient) {
    return (
      <div className="min-h-screen bg-slate-100">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between px-4 md:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToList}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{selectedClient.name}</h2>
                <p className="text-slate-500 text-sm">{selectedClient.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedClient.status?.toLowerCase() === 'active' 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : selectedClient.status?.toLowerCase() === 'paused'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {selectedClient.status || 'Unknown'}
              </span>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
            >
              <span>🔑</span> Change Password
            </button>
            <button
              onClick={() => setShowPauseModal(true)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition ${
                selectedClient.status?.toLowerCase() === 'paused'
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-amber-500 text-white hover:bg-amber-600'
              }`}
            >
              <span>{selectedClient.status?.toLowerCase() === 'paused' ? '▶️' : '⏸️'}</span>
              {selectedClient.status?.toLowerCase() === 'paused' ? 'Reactivate' : 'Pause Account'}
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition"
            >
              <span>🗑️</span> Delete Account
            </button>
          </div>

          {/* Client Info Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                {selectedClient.name?.charAt(0) || '?'}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">{selectedClient.name}</h3>
                <p className="text-slate-500">{selectedClient.full_name}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-slate-500 text-sm mb-1">Email</p>
                <p className="font-medium text-slate-800">{selectedClient.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1">Phone</p>
                <p className="font-medium text-slate-800">{selectedClient.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1">Industry</p>
                <p className="font-medium text-slate-800">{selectedClient.industry || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1">Plan</p>
                <p className="font-medium text-slate-800">{selectedClient.plan || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1">Plan Price</p>
                <p className="font-medium text-slate-800">${selectedClient.plan_price || '0'}/month</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1">Payment Type</p>
                <p className="font-medium text-slate-800">{selectedClient.payment_type || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1">Setup Fee</p>
                <p className="font-medium text-slate-800">${selectedClient.setup_fee || '0'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1">Setup Fee Paid</p>
                <p className="font-medium text-slate-800">{selectedClient.setup_fee_paid ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1">Sales Rep</p>
                <p className="font-medium text-slate-800">{selectedClient.sales_rep_email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1">Contract Start</p>
                <p className="font-medium text-slate-800">
                  {selectedClient.contract_start_date 
                    ? new Date(selectedClient.contract_start_date).toLocaleDateString() 
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1">Contract End</p>
                <p className="font-medium text-slate-800">
                  {selectedClient.contract_end_date 
                    ? new Date(selectedClient.contract_end_date).toLocaleDateString() 
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-sm mb-1">Created</p>
                <p className="font-medium text-slate-800">
                  {selectedClient.created_at 
                    ? new Date(selectedClient.created_at).toLocaleDateString() 
                    : 'N/A'}
                </p>
              </div>
            </div>

            {/* Stripe Info */}
            {(selectedClient.stripe_customer_id || selectedClient.stripe_subscription_id) && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="font-bold text-slate-800 mb-3">Stripe Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Customer ID</p>
                    <p className="font-mono text-sm text-slate-600">{selectedClient.stripe_customer_id || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm mb-1">Subscription ID</p>
                    <p className="font-mono text-sm text-slate-600">{selectedClient.stripe_subscription_id || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Status Notes */}
            {selectedClient.status_notes && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2">Status Notes</h4>
                <p className="text-slate-600">{selectedClient.status_notes}</p>
              </div>
            )}

            {/* Setup Checklist */}
            {selectedClient.setup_checklist && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="font-bold text-slate-800 mb-3">Setup Checklist</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(selectedClient.setup_checklist).map(([key, value]) => (
                    <div key={key} className={`flex items-center gap-2 p-3 rounded-xl ${value ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                      <span className={`text-lg ${value ? 'text-emerald-500' : 'text-slate-300'}`}>
                        {value ? '✓' : '○'}
                      </span>
                      <span className={`text-sm ${value ? 'text-emerald-700' : 'text-slate-500'}`}>
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Portal Features */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h4 className="font-bold text-slate-800 mb-3">Portal Features</h4>
              <p className="text-slate-500 text-sm mb-4">Control which features this client can access in their portal</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { key: 'dashboard', label: 'Dashboard', icon: '📊' },
                  { key: 'pipeline', label: 'Pipeline', icon: '🎯' },
                  { key: 'crm', label: 'CRM', icon: '🏢' },
                  { key: 'personal_profile', label: 'Personal Profile', icon: '👤' },
                  { key: 'company_profile', label: 'Company Profile', icon: '🏛️' },
                ].map(feature => {
                  const features = selectedClient.features || { dashboard: true, pipeline: true, crm: true, personal_profile: true, company_profile: true };
                  const isEnabled = features[feature.key] !== false;
                  return (
                    <button
                      key={feature.key}
                      onClick={async () => {
                        const currentFeatures = selectedClient.features || { dashboard: true, pipeline: true, crm: true, personal_profile: true, company_profile: true };
                        const newFeatures = { ...currentFeatures, [feature.key]: !isEnabled };
                        await supabase.from('active_clients').update({ features: newFeatures }).eq('id', selectedClient.id);
                        const updatedClient = { ...selectedClient, features: newFeatures };
                        setSelectedClient(updatedClient);
                        setClients(clients.map(c => c.id === selectedClient.id ? updatedClient : c));
                      }}
                      className={`flex items-center gap-3 p-3 rounded-xl transition ${isEnabled ? 'bg-teal-50 border-2 border-teal-500' : 'bg-slate-50 border-2 border-transparent'}`}
                    >
                      <span className="text-lg">{feature.icon}</span>
                      <span className={`text-sm font-medium ${isEnabled ? 'text-teal-700' : 'text-slate-500'}`}>{feature.label}</span>
                      <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${isEnabled ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                        {isEnabled ? 'ON' : 'OFF'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Appointments */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Appointments</h3>
              <button
                onClick={() => setShowAppointmentModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition"
              >
                <span>+</span> Add Appointment
              </button>
            </div>
            {clientAppointments.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl">📅</span>
                <p className="text-slate-500 mt-2">No appointments yet</p>
                <button
                  onClick={() => setShowAppointmentModal(true)}
                  className="mt-3 px-4 py-2 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition"
                >
                  Add First Appointment
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {clientAppointments.map((apt) => (
                  <div key={apt.id} className="p-4 bg-slate-50 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-slate-800">{apt.company_name}</p>
                        <p className="text-sm text-slate-500">{apt.contact_person}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={apt.status}
                          onChange={(e) => handleUpdateAppointmentStatus(apt.id, e.target.value)}
                          className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${
                            apt.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 mb-3">
                      <p>📅 {apt.appointment_date ? new Date(apt.appointment_date).toLocaleDateString() : 'No date'}</p>
                      <p>📞 {apt.phone || 'N/A'}</p>
                      <p>✉️ {apt.email || 'N/A'}</p>
                      <p>📍 {apt.address || 'N/A'}</p>
                    </div>
                    {apt.notes && (
                      <p className="text-sm text-slate-500 italic mb-3">"{apt.notes}"</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingAppointment(apt);
                          setShowEditAppointmentModal(true);
                        }}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAppointment(apt.id)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Change Password</h3>
              <p className="text-slate-500 text-sm mb-4">Set a new password for {selectedClient.name}</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                  <input
                    type="text"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleChangePassword}
                  disabled={changingPassword}
                  className="flex-1 py-2.5 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition disabled:opacity-50"
                >
                  {changingPassword ? 'Saving...' : 'Save Password'}
                </button>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="flex-1 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800">Delete Client?</h3>
                <p className="text-slate-500 mt-2">
                  Are you sure you want to delete <strong>{selectedClient.name}</strong>? This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteClient}
                  disabled={deletingClient}
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition disabled:opacity-50"
                >
                  {deletingClient ? 'Deleting...' : 'Yes, Delete'}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pause Confirmation Modal */}
        {showPauseModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="text-center mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  selectedClient.status?.toLowerCase() === 'paused' ? 'bg-emerald-100' : 'bg-amber-100'
                }`}>
                  <span className="text-3xl">{selectedClient.status?.toLowerCase() === 'paused' ? '▶️' : '⏸️'}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  {selectedClient.status?.toLowerCase() === 'paused' ? 'Reactivate Account?' : 'Pause Account?'}
                </h3>
                <p className="text-slate-500 mt-2">
                  {selectedClient.status?.toLowerCase() === 'paused' 
                    ? `This will reactivate ${selectedClient.name}'s account and reset their password.`
                    : `This will pause ${selectedClient.name}'s account and change their password to INACTIVE2025.`
                  }
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handlePauseClient}
                  disabled={pausingClient}
                  className={`flex-1 py-2.5 text-white rounded-xl font-medium transition disabled:opacity-50 ${
                    selectedClient.status?.toLowerCase() === 'paused' 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : 'bg-amber-500 hover:bg-amber-600'
                  }`}
                >
                  {pausingClient ? 'Processing...' : (selectedClient.status?.toLowerCase() === 'paused' ? 'Reactivate' : 'Pause Account')}
                </button>
                <button
                  onClick={() => setShowPauseModal(false)}
                  className="flex-1 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Appointment Modal */}
        {showAppointmentModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Add Appointment for {selectedClient.name}</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Company Name *</label>
                    <input
                      type="text"
                      value={newAppointment.company_name}
                      onChange={(e) => setNewAppointment({...newAppointment, company_name: e.target.value})}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="ABC Company"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person *</label>
                    <input
                      type="text"
                      value={newAppointment.contact_person}
                      onChange={(e) => setNewAppointment({...newAppointment, contact_person: e.target.value})}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="John Smith"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={newAppointment.email}
                      onChange={(e) => setNewAppointment({...newAppointment, email: e.target.value})}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="john@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={newAppointment.phone}
                      onChange={(e) => setNewAppointment({...newAppointment, phone: e.target.value})}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={newAppointment.address}
                    onChange={(e) => setNewAppointment({...newAppointment, address: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="123 Main St, City, State"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Appointment Date *</label>
                    <input
                      type="date"
                      value={newAppointment.appointment_date}
                      onChange={(e) => setNewAppointment({...newAppointment, appointment_date: e.target.value})}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                    <select
                      value={newAppointment.appointment_type}
                      onChange={(e) => setNewAppointment({...newAppointment, appointment_type: e.target.value})}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select type</option>
                      <option value="Sales Call">Sales Call</option>
                      <option value="Demo">Demo</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Onboarding">Onboarding</option>
                      <option value="Support">Support</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                  <textarea
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 h-24"
                    placeholder="Additional notes..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={newAppointment.status}
                    onChange={(e) => setNewAppointment({...newAppointment, status: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddAppointment}
                  disabled={addingAppointment}
                  className="flex-1 py-2.5 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition disabled:opacity-50"
                >
                  {addingAppointment ? 'Adding...' : 'Add Appointment'}
                </button>
                <button
                  onClick={() => {
                    setShowAppointmentModal(false);
                    setNewAppointment({
                      company_name: '', contact_person: '', email: '', phone: '',
                      address: '', appointment_date: '', appointment_type: '', notes: '', status: 'pending'
                    });
                  }}
                  className="flex-1 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Appointment Modal */}
        {showEditAppointmentModal && editingAppointment && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Edit Appointment</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={editingAppointment.company_name}
                      onChange={(e) => setEditingAppointment({...editingAppointment, company_name: e.target.value})}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person</label>
                    <input
                      type="text"
                      value={editingAppointment.contact_person}
                      onChange={(e) => setEditingAppointment({...editingAppointment, contact_person: e.target.value})}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editingAppointment.email || ''}
                      onChange={(e) => setEditingAppointment({...editingAppointment, email: e.target.value})}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={editingAppointment.phone || ''}
                      onChange={(e) => setEditingAppointment({...editingAppointment, phone: e.target.value})}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={editingAppointment.address || ''}
                    onChange={(e) => setEditingAppointment({...editingAppointment, address: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Appointment Date</label>
                    <input
                      type="date"
                      value={editingAppointment.appointment_date?.split('T')[0] || ''}
                      onChange={(e) => setEditingAppointment({...editingAppointment, appointment_date: e.target.value})}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                    <select
                      value={editingAppointment.appointment_type || ''}
                      onChange={(e) => setEditingAppointment({...editingAppointment, appointment_type: e.target.value})}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select type</option>
                      <option value="Sales Call">Sales Call</option>
                      <option value="Demo">Demo</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Onboarding">Onboarding</option>
                      <option value="Support">Support</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                  <textarea
                    value={editingAppointment.notes || ''}
                    onChange={(e) => setEditingAppointment({...editingAppointment, notes: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 h-24"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={editingAppointment.status}
                    onChange={(e) => setEditingAppointment({...editingAppointment, status: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleUpdateAppointment}
                  className="flex-1 py-2.5 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setShowEditAppointmentModal(false);
                    setEditingAppointment(null);
                  }}
                  className="flex-1 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-300 transition"
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

  // Main Dashboard View
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 z-50 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <img src="/icon.png" alt="Kinect B2B" className="w-10 h-10 rounded-xl" />
              <div>
                <h1 className="text-white font-bold text-lg">Kinect B2B</h1>
                <p className="text-slate-400 text-xs">Client Admin</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-slate-700/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700/50 hover:bg-red-600 text-slate-300 hover:text-white rounded-xl transition-all text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between px-4 md:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition"
              >
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                  {activeTab === 'dashboard' ? 'Dashboard' : activeTab === 'clients' ? 'All Clients' : 'Settings'}
                </h2>
                <p className="text-slate-500 text-sm hidden md:block">Manage your clients</p>
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl font-medium hover:from-teal-700 hover:to-teal-800 transition shadow-lg shadow-teal-600/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Add Client</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8">
          {(activeTab === 'dashboard' || activeTab === 'clients') && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg">👥</span>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm mb-1">Total Clients</p>
                  <p className="text-2xl md:text-3xl font-bold text-slate-800">{stats.total}</p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg">✓</span>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm mb-1">Active</p>
                  <p className="text-2xl md:text-3xl font-bold text-slate-800">{stats.active}</p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg">⏸️</span>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm mb-1">Paused</p>
                  <p className="text-2xl md:text-3xl font-bold text-slate-800">{stats.paused}</p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg">💵</span>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm mb-1">Monthly Revenue</p>
                  <p className="text-2xl md:text-3xl font-bold text-slate-800">${stats.revenue.toLocaleString()}</p>
                </div>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                </select>
              </div>

              {/* Clients Grid */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {filteredClients.length === 0 ? (
                  <div className="text-center py-12">
                    <span className="text-5xl">👥</span>
                    <p className="text-slate-500 mt-3">No clients found</p>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="mt-4 px-6 py-2.5 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition"
                    >
                      Add Your First Client
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-slate-100">
                      {filteredClients.map((client) => (
                        <div 
                          key={client.id} 
                          className="p-4 hover:bg-slate-50 cursor-pointer"
                          onClick={() => handleViewDetails(client)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold">
                              {client.name?.charAt(0) || '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="font-bold text-slate-800 truncate">{client.name}</p>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                                  client.status?.toLowerCase() === 'active' 
                                    ? 'bg-emerald-100 text-emerald-700' 
                                    : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {client.status}
                                </span>
                              </div>
                              <p className="text-sm text-slate-500 truncate">{client.email}</p>
                              <p className="text-sm text-slate-600 mt-1">{client.plan}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Client</th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Contact</th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Plan</th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                            <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Price</th>
                            <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredClients.map((client) => (
                            <tr key={client.id} className="hover:bg-slate-50">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold">
                                    {client.name?.charAt(0) || '?'}
                                  </div>
                                  <div>
                                    <p className="font-medium text-slate-800">{client.name}</p>
                                    <p className="text-sm text-slate-500">{client.full_name}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-slate-600">{client.email}</p>
                                <p className="text-sm text-slate-500">{client.phone}</p>
                              </td>
                              <td className="px-6 py-4 text-slate-600">{client.plan || 'N/A'}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                  client.status?.toLowerCase() === 'active' 
                                    ? 'bg-emerald-100 text-emerald-700' 
                                    : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {client.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right font-medium text-slate-800">
                                ${client.plan_price || '0'}/mo
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => handleViewDetails(client)}
                                  className="text-teal-600 hover:text-teal-700 font-medium"
                                >
                                  View →
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Settings</h3>
              <p className="text-slate-500">Settings panel coming soon...</p>
            </div>
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

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Add New Client</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    value={newClient.name}
                    onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Acme Corp"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Name *</label>
                  <input
                    type="text"
                    value={newClient.full_name}
                    onChange={(e) => setNewClient({...newClient, full_name: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="john@acme.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Plan *</label>
                  <select
                    value={newClient.plan}
                    onChange={(e) => setNewClient({...newClient, plan: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select Plan</option>
                    <option value="Pro Plan 100">Pro Plan 100</option>
                    <option value="Pro Plan 200">Pro Plan 200</option>
                    <option value="Pro Plan 300">Pro Plan 300</option>
                    <option value="Pro Plan 400">Pro Plan 400</option>
                    <option value="Pro Plan 500">Pro Plan 500</option>
                    <option value="Pro Plan 600">Pro Plan 600</option>
                    <option value="Pro Plan 700">Pro Plan 700</option>
                    <option value="Pro Plan 800">Pro Plan 800</option>
                    <option value="Pro Plan 900">Pro Plan 900</option>
                    <option value="Pro Plan 1000">Pro Plan 1000</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Plan Price</label>
                  <input
                    type="number"
                    value={newClient.plan_price}
                    onChange={(e) => setNewClient({...newClient, plan_price: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                <input
                  type="text"
                  value={newClient.industry}
                  onChange={(e) => setNewClient({...newClient, industry: e.target.value})}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., Pressure Washing"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Initial Password</label>
                <input
                  type="text"
                  value={newClient.password}
                  onChange={(e) => setNewClient({...newClient, password: e.target.value})}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Welcome2025 (default)"
                />
                <p className="text-xs text-slate-500 mt-1">Leave blank to use default: Welcome2025</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddClient}
                disabled={addingClient}
                className="flex-1 py-2.5 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition disabled:opacity-50"
              >
                {addingClient ? 'Adding...' : 'Add Client'}
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewClient({
                    name: '',
                    full_name: '',
                    email: '',
                    phone: '',
                    plan: '',
                    plan_price: '',
                    industry: '',
                    password: ''
                  });
                }}
                className="flex-1 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-300 transition"
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