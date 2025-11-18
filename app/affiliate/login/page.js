'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 flex items-center justify-center p-4 md:p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.png"
              alt="Kinect B2B Logo"
              width={120}
              height={120}
              className="w-24 h-24 md:w-32 md:h-32"
              priority
            />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-purple-600 mb-2">Kinect B2B</h1>
          <p className="text-sm md:text-base text-gray-600">Affiliate Login</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm md:text-base">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm md:text-base text-gray-800 bg-white"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm md:text-base text-gray-800 bg-white"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="rememberMe" className="ml-2 text-xs md:text-sm font-medium text-gray-700">
              Remember me for 30 days
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 md:py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 text-sm md:text-base"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Help Section */}
        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
          <p className="text-gray-600 text-xs md:text-sm text-center mb-3 md:mb-4">Need help accessing your account?</p>
          <div className="text-center space-y-1">
            <p className="text-xs md:text-sm">
              <a href="mailto:affiliates@kinectb2b.com" className="text-purple-600 hover:underline">
                affiliates@kinectb2b.com
              </a>
            </p>
            <p className="text-xs md:text-sm">
              <a href="tel:2192077863" className="text-purple-600 hover:underline">
                (219) 207-7863
              </a>
            </p>
          </div>
        </div>

        <div className="mt-4 md:mt-6 text-center">
          <p className="text-gray-600 text-xs md:text-sm">
            Don't have an account?{' '}
            <a href="/affiliate/signup" className="text-purple-600 hover:underline font-semibold">
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}