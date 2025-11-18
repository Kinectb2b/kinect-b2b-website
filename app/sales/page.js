'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SalesLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/sales/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          rememberMe 
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Save user data to localStorage for dashboard filtering
        localStorage.setItem('sales_user', JSON.stringify({
          id: data.salesUser.id,
          username: data.salesUser.username,
          email: data.salesUser.email,
          full_name: data.salesUser.full_name,
          role: data.salesUser.role
        }));
        
        router.push('/sales/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-500 to-teal-400 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-4xl font-black text-white">K</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-gray-900 mb-2">Kinect B2B</h1>
            <p className="text-gray-600 text-lg">Sales Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-bold mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500 transition"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500 transition"
                placeholder="Enter your password"
              />
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm font-medium text-gray-700">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-gradient-to-r from-green-600 to-green-700 rounded-xl text-white text-xl font-bold hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 font-bold mb-4">Need Help?</p>
            <div className="space-y-2">
              <a href="mailto:sales@kinectb2b.com" className="flex items-center justify-center gap-2 text-green-600 hover:text-green-700 font-bold">
                📧 sales@kinectb2b.com
              </a>
              <a href="tel:2192077863" className="flex items-center justify-center gap-2 text-green-600 hover:text-green-700 font-bold">
                📞 (219) 207-7863
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}