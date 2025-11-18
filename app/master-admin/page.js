'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MasterAdminLogin() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // For now, hardcoded master admin credentials
    // Later we'll connect to Supabase
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      // Store session
      localStorage.setItem('masterAdminAuth', 'true');
      router.push('/master-admin/dashboard');
    } else {
      setError('Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Master Admin</h1>
          <p className="text-purple-300">Complete System Access</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-white font-medium mb-2">Username</label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Enter username"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white font-medium mb-2">Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Enter password"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-3">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Access Master Dashboard'}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-gray-400 text-sm text-center">
              Restricted access - Authorized personnel only
            </p>
          </div>
        </div>

        {/* Access Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            This dashboard provides access to:
          </p>
          <div className="flex justify-center gap-4 mt-3">
            <span className="text-blue-400 text-sm">Client Portal</span>
            <span className="text-purple-400 text-sm">Affiliate Portal</span>
            <span className="text-green-400 text-sm">Sales Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
}