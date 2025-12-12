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

    try {
      const response = await fetch('/api/master-admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (data.success) {
        router.push('/master-admin/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
        setLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-3">
                <img src="/icon.png" alt="Kinect B2B" className="w-12 h-12 rounded-xl shadow-lg" />
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Kinect B2B</h1>
                  <p className="text-slate-500 text-sm font-medium">Master Admin</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-sm">Username</label>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-sm">Password</label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Logging in...</span>
                  </>
                ) : (
                  'Access Dashboard'
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-slate-400 text-xs text-center">
                🔒 Restricted access - Authorized personnel only
              </p>
            </div>
          </div>

          {/* Access Info */}
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm mb-3">Full access to all portals:</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full">Client Portal</span>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded-full">Affiliate Portal</span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-medium rounded-full">Sales Portal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src="/icon.png" alt="Kinect B2B" className="w-5 h-5 rounded" />
          <span className="text-slate-400 text-sm">Powered by <span className="font-semibold text-slate-300">Kinect B2B</span></span>
        </div>
        <p className="text-slate-500 text-xs">© {new Date().getFullYear()} Kinect B2B. All rights reserved.</p>
      </footer>
    </div>
  );
}