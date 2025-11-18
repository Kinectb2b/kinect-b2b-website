'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MasterAdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalAffiliates: 0,
    totalSalesReps: 0,
    monthlyRevenue: 0,
    activeDeals: 0,
    pendingReferrals: 0
  });

  // Check authentication on page load
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch('/api/master-admin/verify');
        const data = await response.json();

        if (!data.authenticated) {
          router.push('/master-admin');
          return;
        }

        setIsAuthenticated(true);
        fetchStats();
      } catch (error) {
        console.error('Auth verification failed:', error);
        router.push('/master-admin');
      }
    };

    verifyAuth();
  }, [router]);

  // Fetch real stats from API
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/master-admin/stats');
      const data = await response.json();
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  const navigateTo = (path) => {
    router.push(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('masterAdminAuth');
    router.push('/master-admin');
  };

  // Show nothing while checking auth
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Verifying access...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Master Admin Dashboard</h1>
            <p className="text-purple-300 mt-1">Complete oversight of all systems</p>
          </div>
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-6 text-white shadow-xl">
            <div className="text-4xl font-bold">{loading ? '...' : stats.totalClients}</div>
            <div className="text-blue-100 mt-2">Total Clients</div>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-xl">
            <div className="text-4xl font-bold">{loading ? '...' : stats.totalAffiliates}</div>
            <div className="text-purple-100 mt-2">Active Affiliates</div>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-6 text-white shadow-xl">
            <div className="text-4xl font-bold">{loading ? '...' : stats.totalSalesReps}</div>
            <div className="text-green-100 mt-2">Sales Team Members</div>
          </div>
        </div>

        {/* Portal Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Client Admin Portal */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30 hover:border-blue-500 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-600 rounded-lg p-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{loading ? '...' : stats.totalClients}</div>
                <div className="text-blue-300 text-sm">Clients</div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Client Admin Portal</h3>
            <p className="text-gray-300 text-sm mb-4">Manage all clients, appointments, and subscriptions</p>
            <button
              onClick={() => navigateTo('/portal/admin')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Open Client Portal →
            </button>
          </div>

          {/* Affiliate Admin Portal */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 hover:border-purple-500 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-600 rounded-lg p-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{loading ? '...' : stats.totalAffiliates}</div>
                <div className="text-purple-300 text-sm">Affiliates</div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Affiliate Admin Portal</h3>
            <p className="text-gray-300 text-sm mb-4">Manage affiliates, referrals, and commissions</p>
            <button
              onClick={() => navigateTo('/affiliate/admin')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Open Affiliate Portal →
            </button>
          </div>

          {/* Sales Portal */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 hover:border-green-500 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-600 rounded-lg p-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{loading ? '...' : stats.activeDeals}</div>
                <div className="text-green-300 text-sm">Active Deals</div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Sales Portal</h3>
            <p className="text-gray-300 text-sm mb-4">Manage sales team, leads, and pipeline</p>
            <button
              onClick={() => navigateTo('/sales/dashboard')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Open Sales Portal →
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-white">New client signed up</span>
              </div>
              <span className="text-gray-400 text-sm">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-white">New affiliate referral pending</span>
              </div>
              <span className="text-gray-400 text-sm">5 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-white">Deal closed - $3,500 MRR</span>
              </div>
              <span className="text-gray-400 text-sm">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}