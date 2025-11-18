'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zsjmqlsnvkbtdhjbtwkr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzam1xbHNudmtidGRoamJ0d2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMzcxOTYsImV4cCI6MjA3NzYxMzE5Nn0.vsbFj5m6pCaoVpHKpB3SZ2WzF4yRufOd27NlcEPhHGc'
);

export default function SalesAdminDashboard() {
  const [salesUsers, setSalesUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedSalesperson, setSelectedSalesperson] = useState('all');
  
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    email: '',
    full_name: '',
    role: 'sales'
  });

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
    } catch (error) {
      window.location.href = '/sales/admin/login';
      return;
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchSalesUsers(), fetchClients()]);
    setLoading(false);
  };

  const fetchSalesUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('sales_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSalesUsers(data || []);
    } catch (error) {
      console.error('Error fetching sales users:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('pipeline_clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from('sales_users')
        .insert([newUser])
        .select();

      if (error) throw error;

      alert('Sales user added successfully!');
      setShowAddUserModal(false);
      setNewUser({ username: '', password: '', email: '', full_name: '', role: 'sales' });
      fetchSalesUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user: ' + error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this sales user?')) return;

    try {
      const { error } = await supabase
        .from('sales_users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      alert('User deleted successfully!');
      fetchSalesUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user: ' + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sales_admin');
    window.location.href = '/sales/admin/login';
  };

  const viewUserDashboard = (user) => {
    localStorage.setItem('sales_user', JSON.stringify(user));
    window.open('/sales/dashboard', '_blank');
  };

  const getUserStats = (userId, username) => {
    const userClients = clients.filter(c => 
      c.sales_rep_username?.toLowerCase() === username?.toLowerCase()
    );
    
    const revenue = userClients.reduce((sum, c) => sum + parseFloat(c.deal_value || 0), 0);
    
    return {
      totalClients: userClients.length,
      activeClients: userClients.filter(c => c.status === 'active').length,
      revenue: revenue
    };
  };

  const getFilteredClients = () => {
    if (selectedSalesperson === 'all') {
      return clients;
    }
    return clients.filter(c => 
      c.sales_rep_username?.toLowerCase() === selectedSalesperson?.toLowerCase()
    );
  };

  const getTotalRevenue = () => {
    return clients.reduce((sum, c) => sum + parseFloat(c.deal_value || 0), 0);
  };

  const filteredClients = getFilteredClients();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Sales Admin Dashboard</h1>
            <p className="text-purple-100">Manage sales team and monitor performance</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-semibold transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="text-sm text-gray-500 mb-1">Total Sales Users</div>
            <div className="text-3xl font-bold text-purple-600">{salesUsers.length}</div>
          </div>
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
            <div className="text-sm text-gray-500 mb-1">Total Revenue</div>
            <div className="text-3xl font-bold text-purple-600">${getTotalRevenue()}</div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setShowAddUserModal(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            + Add New Sales User
          </button>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Sales Team</h2>

          {salesUsers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No sales users found.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {salesUsers.map((user) => {
                const stats = getUserStats(user.id, user.username);
                return (
                  <div key={user.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {user.full_name?.charAt(0) || user.username?.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800">{user.full_name || user.username}</h3>
                        <p className="text-sm text-gray-600">@{user.username}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {user.role}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Clients</div>
                        <div className="text-xl font-bold text-purple-600">{stats.totalClients}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Active</div>
                        <div className="text-xl font-bold text-green-600">{stats.activeClients}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Revenue</div>
                        <div className="text-xl font-bold text-blue-600">${stats.revenue}</div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 mb-4">
                      Created: {new Date(user.created_at).toLocaleDateString()}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => viewUserDashboard(user)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                      >
                        View Dashboard
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-600 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">All Clients</h2>
            
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700">Filter by Salesperson:</label>
              <select
                value={selectedSalesperson}
                onChange={(e) => setSelectedSalesperson(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-800"
              >
                <option value="all">All Salespeople</option>
                {salesUsers.filter(u => u.role === 'sales').map(user => (
                  <option key={user.id} value={user.username}>
                    {user.full_name || user.username}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredClients.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No clients found for this filter.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map((client) => (
                <div key={client.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {client.client_name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800">{client.client_name}</h3>
                      <p className="text-sm text-gray-600">{client.business_name || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{client.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      client.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : client.status === 'lead'
                        ? 'bg-blue-100 text-blue-700'
                        : client.status === 'quote_sent'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {client.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div><strong>Deal Value:</strong> ${client.deal_value}</div>
                    <div><strong>Sales Rep:</strong> {client.sales_rep_username || 'N/A'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showAddUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Sales User</h2>

              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={newUser.full_name}
                    onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 text-gray-800"
                  >
                    <option value="sales">Sales</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}