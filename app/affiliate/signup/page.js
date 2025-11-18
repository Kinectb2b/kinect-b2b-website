'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AffiliateSignup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_name: '',
    website: '',
    experience: '',
    referral_source: '',
    password: '',
    confirm_password: '',
    agree_terms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const experienceLevels = [
    'Beginner (0-2 years)',
    'Intermediate (3-5 years)',
    'Advanced (6-10 years)',
    'Expert (10+ years)',
  ];

  const referralSources = [
    'Google Search',
    'Social Media',
    'Friend/Colleague Referral',
    'Industry Event',
    'Advertisement',
    'Other',
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.agree_terms) {
      setError('You must agree to the Terms & Conditions');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const full_name = `${formData.first_name} ${formData.last_name}`;
      
      const response = await fetch('/api/affiliate/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name,
          email: formData.email,
          phone: formData.phone,
          company_name: formData.company_name,
          website: formData.website,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('affiliate', JSON.stringify(data.affiliate));
        alert('Account created successfully!');
        router.push('/affiliate/dashboard');
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-4xl my-8">
        {/* Header with Logo */}
        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image 
              src="/my-logo.png" 
              alt="Kinect B2B Logo" 
              width={40} 
              height={40}
              className="w-10 h-10"
            />
            <h1 className="text-2xl md:text-4xl font-bold text-blue-600">Become an Affiliate Partner</h1>
          </div>
          <p className="text-sm md:text-base text-gray-600">Join our program and earn 10% recurring commissions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm md:text-base">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">First Name *</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white text-sm md:text-base"
                placeholder="John"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">Last Name *</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white text-sm md:text-base"
                placeholder="Smith"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white text-sm md:text-base"
                placeholder="john@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white text-sm md:text-base"
                placeholder="(555) 123-4567"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">Company Name</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white text-sm md:text-base"
                placeholder="Your Company LLC"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-2.5 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white text-sm md:text-base"
                placeholder="https://yoursite.com"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">Sales/Marketing Experience</label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-2.5 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white text-sm md:text-base"
              >
                <option value="" className="text-gray-800">Select your experience level...</option>
                {experienceLevels.map((level) => (
                  <option key={level} value={level} className="text-gray-800">{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">How did you hear about us?</label>
              <select
                name="referral_source"
                value={formData.referral_source}
                onChange={handleChange}
                className="w-full px-4 py-2.5 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white text-sm md:text-base"
              >
                <option value="" className="text-gray-800">Select an option...</option>
                {referralSources.map((source) => (
                  <option key={source} value={source} className="text-gray-800">{source}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white text-sm md:text-base"
                placeholder="Minimum 8 characters"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">Confirm Password *</label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white text-sm md:text-base"
                placeholder="Re-enter your password"
                required
              />
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl md:rounded-2xl p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold text-blue-600 mb-3 md:mb-4">Commission Structure</h3>
            <ul className="space-y-2 text-gray-700 text-sm md:text-base">
              <li>✓ <strong>10% recurring commission</strong> on all referrals</li>
              <li>✓ Commissions paid for <strong>up to 12 months</strong></li>
              <li>✓ Monthly payouts via PayPal or bank transfer</li>
              <li>✓ Real-time tracking dashboard</li>
            </ul>
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
            <input
              type="checkbox"
              name="agree_terms"
              checked={formData.agree_terms}
              onChange={handleChange}
              className="mt-1 w-4 h-4 md:w-5 md:h-5 flex-shrink-0"
              required
            />
            <label className="text-xs md:text-sm text-gray-700">
              I agree to the <span className="text-blue-600 font-medium">Terms & Conditions</span> and{' '}
              <span className="text-blue-600 font-medium">Privacy Policy</span>. I understand I will earn 10% commission on all referrals for up to 12 months as long as they remain active.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 md:py-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 text-base md:text-lg"
          >
            {loading ? 'Creating Account...' : 'Join Affiliate Program'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-xs md:text-sm">
            Already have an account?{' '}
            <a href="/affiliate/login" className="text-blue-600 hover:underline font-semibold">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
}