'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zsjmqlsnvkbtdhjbtwkr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzam1xbHNudmtidGRoamJ0d2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMzcxOTYsImV4cCI6MjA3NzYxMzE5Nn0.vsbFj5m6pCaoVpHKpB3SZ2WzF4yRufOd27NlcEPhHGc'
);

export default function ClientPortalLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check active_clients table for matching credentials
      const { data, error: fetchError } = await supabase
        .from('active_clients')
        .select('*')
        .ilike('email', email.trim())
        .single();

      if (fetchError || !data) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      // Check password
      if (data.password !== password) {
        // Check if account is paused
        if (data.password === 'INACTIVE2025') {
          setError('Your account has been paused. Please contact support.');
        } else {
          setError('Invalid email or password');
        }
        setLoading(false);
        return;
      }

      // Check status
      if (data.status?.toLowerCase() === 'paused') {
        setError('Your account has been paused. Please contact support.');
        setLoading(false);
        return;
      }

      if (data.status?.toLowerCase() !== 'active') {
        setError('Your account is not active. Please contact support.');
        setLoading(false);
        return;
      }

      // Success - store client data and redirect
      localStorage.setItem('client', JSON.stringify({
        id: data.id,
        name: data.name,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        plan: data.plan,
        plan_price: data.plan_price,
        industry: data.industry,
        status: data.status
      }));

      window.location.href = '/portal/dashboard';
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/icon.png" 
              alt="Kinect B2B" 
              className="w-16 h-16 rounded-2xl shadow-lg"
            />
          </div>
          <h1 className="text-2xl font-bold text-white">Client Portal</h1>
          <p className="text-slate-400 mt-1">Sign in to access your dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-slate-800"
                placeholder="you@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-slate-800"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-teal-800 transition-all shadow-lg shadow-teal-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              Need help?{' '}
              <a href="mailto:support@kinectb2b.com" className="text-teal-600 hover:text-teal-700 font-medium">
                Contact Support
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img src="/icon.png" alt="Kinect B2B" className="w-4 h-4 rounded" />
            <span className="text-slate-400 text-sm">Powered by <span className="text-slate-300">Kinect B2B</span></span>
          </div>
          <p className="text-slate-500 text-xs">© {new Date().getFullYear()} Kinect B2B. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}