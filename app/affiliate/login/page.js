'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function AffiliateLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/affiliate/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('affiliate', JSON.stringify(data.affiliate));

        if (data.affiliate.role === 'admin') {
          router.push('/affiliate/admin');
        } else {
          router.push('/affiliate/dashboard');
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <a href="/" className="inline-flex items-center text-slate-400 hover:text-white transition mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </a>
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-3">
                <img src="/icon.png" alt="Kinect B2B" className="w-12 h-12 rounded-xl shadow-lg" />
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Kinect B2B</h1>
                  <p className="text-slate-500 text-sm font-medium">Affiliate Portal</p>
                </div>
              </div>
            </div>

            {/* Login Form */}
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
                <label className="block text-slate-700 font-semibold mb-2 text-sm">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-sm">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-slate-100 border-slate-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-slate-600">
                  Remember me for 30 days
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl text-white font-bold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  'Sign In'
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-5 text-center">
              <p className="text-slate-600 text-sm">
                Don't have an account?{' '}
                <a href="/affiliate/signup" className="text-purple-600 hover:text-purple-700 font-semibold">
                  Sign up here
                </a>
              </p>
            </div>

            {/* Help Section */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-slate-500 text-sm text-center mb-3">Need Help?</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
                <a href="mailto:affiliates@kinectb2b.com" className="text-purple-600 hover:text-purple-700 font-medium">
                  affiliates@kinectb2b.com
                </a>
                <span className="hidden sm:inline text-slate-300">|</span>
                <a href="tel:2192707863" className="text-purple-600 hover:text-purple-700 font-medium">
                  (219) 270-7863
                </a>
              </div>
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