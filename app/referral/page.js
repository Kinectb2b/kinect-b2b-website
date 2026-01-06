'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Gift,
  Calendar,
  Globe,
  Settings,
  BarChart3,
  Target,
  Briefcase,
  Rocket,
  Clock,
  Check,
  X
} from 'lucide-react';

function ReferralContent() {
  const searchParams = useSearchParams();
  const [referralCode, setReferralCode] = useState('');
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [formData, setFormData] = useState({
    business_name: '',
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    industry: '',
    interested_in: '',
  });
  const [formStatus, setFormStatus] = useState('');

  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
      localStorage.setItem('referral_code', refCode);
      localStorage.setItem('referral_code_date', Date.now().toString());
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');

    try {
      const response = await fetch('/api/referrals/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          referral_code: referralCode,
        }),
      });

      if (response.ok) {
        setFormStatus('success');
        alert('Thank you! Your exclusive discount has been applied. We will contact you shortly to get started!');
        setShowSignupForm(false);
      } else {
        setFormStatus('error');
        alert('Something went wrong. Please try again or call us at (219) 270-7863');
      }
    } catch (error) {
      console.error('Error:', error);
      setFormStatus('error');
      alert('Something went wrong. Please try again or call us at (219) 270-7863');
    }
  };

  const discounts = [
    {
      icon: Calendar,
      title: 'Appointment Setting',
      discount: '20% OFF',
      description: '20% discount for the first 3 months on any Pro Plan',
      details: ['Pro Plan 100-1200', 'First 3 months only', 'Save up to $240/month!']
    },
    {
      icon: Globe,
      title: 'Website Building',
      discount: '10% OFF',
      description: '10% off initial website build cost',
      details: ['Starter, Pro, or Premium', 'Setup fee discount', 'Save up to $750!']
    },
    {
      icon: Settings,
      title: 'Automations',
      discount: '10% OFF',
      description: '10% off automation build cost',
      details: ['Any automation package', 'Setup fee discount', 'Save up to $350!']
    },
    {
      icon: BarChart3,
      title: 'Client Portals',
      discount: '10% OFF',
      description: '10% off portal build cost',
      details: ['Any portal package', 'Setup fee discount', 'Save up to $550!']
    }
  ];

  const benefits = [
    {
      icon: Target,
      title: 'Proven Results',
      description: 'Thousands of qualified appointments set, websites launched, and businesses automated.'
    },
    {
      icon: Briefcase,
      title: 'Industry Experts',
      description: 'Dedicated account managers who understand your business and industry.'
    },
    {
      icon: Rocket,
      title: 'Fast Delivery',
      description: 'Quick turnaround times so you can start seeing results immediately.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-center items-center">
          <div className="text-2xl font-bold text-white">
            Kinect B2B
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-slate-900 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-full font-semibold text-lg mb-8">
            <Gift className="w-5 h-5" />
            <span>Exclusive Referral Discount</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Your Friend Shared<br />
            <span className="text-teal-400">
              Something Special
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            You've been invited to join Kinect B2B with <span className="font-bold text-teal-400">exclusive discounts</span> not available anywhere else.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => setShowSignupForm(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-10 py-5 rounded-lg font-semibold text-xl transition"
          >
            Claim My Exclusive Discount
          </button>
        </div>
      </section>

      {/* Discount Cards */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">
            Your Exclusive Discounts
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {discounts.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="relative bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-teal-500 transition">
                  <div className="absolute top-0 right-0 bg-teal-600 text-white px-3 py-1 rounded-bl-lg rounded-tr-xl font-bold text-sm">
                    {item.discount}
                  </div>
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 mb-4">{item.description}</p>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <div className="font-semibold text-slate-900 mb-2 text-sm">Discount Applies To:</div>
                    <ul className="text-slate-600 space-y-1 text-sm">
                      {item.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-teal-600" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Kinect B2B Section */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-4">
            Why Kinect B2B?
          </h2>
          <p className="text-lg text-slate-600 text-center mb-12">
            Your friend trusts us. Here's why you should too.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="bg-white border border-slate-200 rounded-xl p-8 hover:shadow-lg transition">
                  <div className="w-14 h-14 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-7 h-7 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                  <p className="text-slate-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-16 md:py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-10">
            <Clock className="w-12 h-12 text-teal-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Limited Time Offer</h2>
            <p className="text-xl text-slate-300 mb-8">
              This exclusive referral discount is only valid for 30 days from when your friend shared it with you.
            </p>
            <button
              onClick={() => setShowSignupForm(true)}
              className="bg-white hover:bg-slate-100 text-slate-900 px-10 py-4 rounded-lg font-semibold text-lg transition"
            >
              Claim My Discount Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-xl font-bold text-white mb-4">
            Kinect B2B
          </div>
          <p className="text-slate-400 mb-6">Connecting service providers with qualified leads.</p>
          <div className="flex justify-center gap-8 text-slate-400">
            <a href="mailto:accounts@kinectb2b.com" className="hover:text-white transition">
              accounts@kinectb2b.com
            </a>
            <a href="tel:2192707863" className="hover:text-white transition">
              (219) 270-7863
            </a>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800">
            <p className="text-slate-500">&copy; 2025 Kinect B2B. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Signup Form Modal */}
      {showSignupForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative max-w-xl w-full bg-white rounded-2xl shadow-2xl p-6 md:p-8 my-8">
            <button
              onClick={() => setShowSignupForm(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Claim Your Discount</h2>
              {referralCode && (
                <p className="text-teal-600 font-semibold">Referral code: {referralCode}</p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-2">Business Name *</label>
                  <input
                    type="text"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-2">Your Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-2">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-2">State *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-2">Industry *</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="e.g., Landscaping, HVAC, Cleaning"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-2">What are you interested in? *</label>
                <select
                  value={formData.interested_in}
                  onChange={(e) => setFormData({ ...formData, interested_in: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a service...</option>
                  <option value="Appointment Setting">Appointment Setting (20% OFF first 3 months)</option>
                  <option value="Website Building">Website Building (10% OFF)</option>
                  <option value="Automations">Automations (10% OFF)</option>
                  <option value="Client Portals">Client Portals (10% OFF)</option>
                  <option value="Multiple Services">Multiple Services</option>
                </select>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-teal-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900 mb-1">Your Exclusive Discount Will Be Applied!</div>
                    <div className="text-sm text-slate-600">
                      We'll contact you within 24 hours to discuss your needs and apply your referral discount.
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
              >
                {formStatus === 'sending' ? 'Claiming Your Discount...' : 'Claim My Exclusive Discount'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ReferralLandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="text-slate-600 text-xl">Loading...</div></div>}>
      <ReferralContent />
    </Suspense>
  );
}
