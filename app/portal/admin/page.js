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
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientAppointments, setClientAppointments] = useState([]);

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
        .from('clients')
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  // Detailed Client View
  if (selectedClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <button
                  onClick={handleBackToList}
                  className="mb-4 bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold hover:bg-blue-50 transition-all"
                >
                  ← Back to All Clients
                </button>
                <h1 className="text-3xl font-bold">Client Details</h1>
                <p className="text-blue-100">Viewing {selectedClient.name}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-semibold transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Client Profile Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {selectedClient.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-800">{selectedClient.name}</h2>
                <p className="text-gray-600">{selectedClient.company_name}</p>
                <p className="text-sm text-gray-500">{selectedClient.email}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                selectedClient.status === 'active' 
                  ? 'bg-green-100 text-green-700' 
                  : selectedClient.status === 'needs_plan'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {selectedClient.status.charAt(0).toUpperCase() + selectedClient.status.slice(1).replace('_', ' ')}
              </span>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6">
                <div className="text-sm text-gray-600 mb-1">Current Plan</div>
                <div className="text-2xl font-bold text-blue-600">{selectedClient.plan_name}</div>
                <div className="text-lg text-gray-700">${selectedClient.plan_price}/month</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6">
                <div className="text-sm text-gray-600 mb-1">Next Billing</div>
                <div className="text-2xl font-bold text-gray-800">
                  {selectedClient.billing_cycle || 'Monthly'}
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6">
                <div className="text-sm text-gray-600 mb-1">Total Appointments</div>
                <div className="text-3xl font-bold text-blue-600">{selectedClient.total_appointments || 0}</div>
              </div>
            </div>

            {/* Full Client Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Full Client Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-500">Username</div>
                  <div className="text-lg font-semibold text-gray-800">{selectedClient.username || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="text-lg font-semibold text-gray-800">{selectedClient.email}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <div className="text-lg font-semibold text-gray-800">{selectedClient.phone || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Industry</div>
                  <div className="text-lg font-semibold text-gray-800">{selectedClient.industry || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Account Manager</div>
                  <div className="text-lg font-semibold text-gray-800">{selectedClient.account_manager || 'Robert Cole'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Stripe Customer ID</div>
                  <div className="text-sm font-mono text-gray-600">{selectedClient.stripe_customer_id || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Client Appointments */}
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Client Appointments</h3>
            
            {clientAppointments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No appointments for this client yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {clientAppointments.map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-800">{appointment.company_name}</h4>
                        <p className="text-gray-600">{appointment.contact_person}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-blue-600">
                          {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          appointment.status === 'completed' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <strong>Type:</strong> {appointment.appointment_type || 'N/A'}
                      </div>
                      <div>
                        <strong>Address:</strong> {appointment.address || 'N/A'}
                      </div>
                      <div>
                        <strong>Email:</strong> {appointment.email || 'N/A'}
                      </div>
                      <div>
                        <strong>Phone:</strong> {appointment.phone || 'N/A'}
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="bg-gray-50 rounded-xl p-4 mt-4">
                        <strong className="text-gray-700">Notes:</strong>
                        <p className="text-gray-600 mt-1">{appointment.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // All Clients List View
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-blue-100">Manage all clients and view system data</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-semibold transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="text-sm text-gray-500 mb-1">Total Clients</div>
            <div className="text-3xl font-bold text-blue-600">{clients.length}</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="text-sm text-gray-500 mb-1">Active Clients</div>
            <div className="text-3xl font-bold text-green-600">
              {clients.filter(c => c.status === 'active').length}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="text-sm text-gray-500 mb-1">Pending Clients</div>
            <div className="text-3xl font-bold text-yellow-600">
              {clients.filter(c => c.status === 'pending' || c.status === 'needs_plan').length}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="text-sm text-gray-500 mb-1">Total Revenue</div>
            <div className="text-3xl font-bold text-blue-600">
              ${clients.reduce((sum, c) => sum + (parseFloat(c.plan_price) || 0), 0).toFixed(0)}
            </div>
          </div>
        </div>

        {/* All Clients Section */}
        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">All Clients</h2>

          {clients.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No clients found.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clients.map((client) => (
                <div key={client.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {client.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800">{client.name}</h3>
                      <p className="text-sm text-gray-600">{client.username || 'No username'}</p>
                      <p className="text-sm text-gray-500">{client.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      client.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : client.status === 'needs_plan'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {client.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div>
                      <strong>Plan:</strong> {client.plan_name}
                    </div>
                    <div>
                      <strong>Price:</strong> ${client.plan_price}/month
                    </div>
                    <div>
                      <strong>Phone:</strong> {client.phone || 'N/A'}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-3 mb-4">
                    <div className="text-xs text-gray-600">Total Appointments</div>
                    <div className="text-2xl font-bold text-blue-600">{client.total_appointments || 0}</div>
                  </div>

                  <button
                    onClick={() => handleViewDetails(client)}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}