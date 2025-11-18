'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

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
        alert('🎉 Thank you! Your exclusive discount has been applied. We will contact you shortly to get started!');
        setShowSignupForm(false);
      } else {
        setFormStatus('error');
        alert('Something went wrong. Please try again or call us at (219) 207-7863');
      }
    } catch (error) {
      console.error('Error:', error);
      setFormStatus('error');
      alert('Something went wrong. Please try again or call us at (219) 207-7863');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative bg-gradient-to-r from-slate-900/80 to-cyan-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-center items-center">
          <div className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            KINECT B2B
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-full font-bold text-lg mb-8 shadow-2xl animate-bounce">
            <span className="text-2xl">🎁</span>
            <span>Exclusive Referral Discount!</span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
            Your Friend Shared<br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Something Special
            </span>
          </h1>

          <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            You've been invited to join Kinect B2B with <span className="font-bold text-cyan-400">exclusive discounts</span> not available anywhere else!
          </p>

          {/* CTA Button */}
          <button
            onClick={() => setShowSignupForm(true)}
            className="group relative inline-block"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
            <div className="relative px-12 py-6 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl text-white font-black text-2xl hover:scale-110 transition-all duration-300">
              Claim My Exclusive Discount →
            </div>
          </button>
        </div>
      </section>

      {/* Discount Cards */}
      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-black text-center text-white mb-12">
            Your Exclusive <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Discounts</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Appointment Setting Discount */}
            <div className="group relative">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-bl-3xl rounded-tr-3xl font-black text-lg z-10">
                20% OFF
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-2 border-cyan-500/50 rounded-3xl p-8 hover:border-cyan-400 transition duration-300 h-full">
                <div className="text-5xl mb-4">📅</div>
                <h3 className="text-2xl font-bold text-white mb-3">Appointment Setting</h3>
                <p className="text-gray-300 mb-4">20% discount for the first 3 months on any Pro Plan</p>
                <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-2xl p-4 text-sm">
                  <div className="font-bold text-white mb-2">Discount Applies To:</div>
                  <ul className="text-gray-300 space-y-1">
                    <li>✓ Pro Plan 100-1200</li>
                    <li>✓ First 3 months only</li>
                    <li>✓ Save up to $240/month!</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Website Building Discount */}
            <div className="group relative">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-bl-3xl rounded-tr-3xl font-black text-lg z-10">
                10% OFF
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-2 border-blue-500/50 rounded-3xl p-8 hover:border-blue-400 transition duration-300 h-full">
                <div className="text-5xl mb-4">🌐</div>
                <h3 className="text-2xl font-bold text-white mb-3">Website Building</h3>
                <p className="text-gray-300 mb-4">10% off initial website build cost</p>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-2xl p-4 text-sm">
                  <div className="font-bold text-white mb-2">Discount Applies To:</div>
                  <ul className="text-gray-300 space-y-1">
                    <li>✓ Starter, Pro, or Premium</li>
                    <li>✓ Setup fee discount</li>
                    <li>✓ Save up to $750!</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Automations Discount */}
            <div className="group relative">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-bl-3xl rounded-tr-3xl font-black text-lg z-10">
                10% OFF
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-2 border-cyan-500/50 rounded-3xl p-8 hover:border-cyan-400 transition duration-300 h-full">
                <div className="text-5xl mb-4">⚙️</div>
                <h3 className="text-2xl font-bold text-white mb-3">Automations</h3>
                <p className="text-gray-300 mb-4">10% off automation build cost</p>
                <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-2xl p-4 text-sm">
                  <div className="font-bold text-white mb-2">Discount Applies To:</div>
                  <ul className="text-gray-300 space-y-1">
                    <li>✓ Any automation package</li>
                    <li>✓ Setup fee discount</li>
                    <li>✓ Save up to $350!</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Client Portals Discount */}
            <div className="group relative">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-bl-3xl rounded-tr-3xl font-black text-lg z-10">
                10% OFF
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-2 border-blue-500/50 rounded-3xl p-8 hover:border-blue-400 transition duration-300 h-full">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-2xl font-bold text-white mb-3">Client Portals</h3>
                <p className="text-gray-300 mb-4">10% off portal build cost</p>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-2xl p-4 text-sm">
                  <div className="font-bold text-white mb-2">Discount Applies To:</div>
                  <ul className="text-gray-300 space-y-1">
                    <li>✓ Any portal package</li>
                    <li>✓ Setup fee discount</li>
                    <li>✓ Save up to $550!</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Kinect B2B Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-black text-center text-white mb-4">
            Why <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Kinect B2B?</span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16">
            Your friend trusts us. Here's why you should too.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20 p-8 rounded-2xl hover:border-cyan-500/50 transition duration-300">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-white mb-3">Proven Results</h3>
                <p className="text-gray-300">
                  Thousands of qualified appointments set, websites launched, and businesses automated.
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20 p-8 rounded-2xl hover:border-cyan-500/50 transition duration-300">
                <div className="text-5xl mb-4">💼</div>
                <h3 className="text-2xl font-bold text-white mb-3">Industry Experts</h3>
                <p className="text-gray-300">
                  Dedicated account managers who understand your business and industry.
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-cyan-500/20 p-8 rounded-2xl hover:border-cyan-500/50 transition duration-300">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold text-white mb-3">Fast Delivery</h3>
                <p className="text-gray-300">
                  Quick turnaround times so you can start seeing results immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="relative py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-cyan-800/50 to-blue-800/50 backdrop-blur-2xl border-2 border-cyan-500/50 p-12 rounded-3xl">
              <div className="text-5xl mb-4">⏰</div>
              <h2 className="text-4xl font-black text-white mb-4">Limited Time Offer</h2>
              <p className="text-xl text-cyan-200 mb-8">
                This exclusive referral discount is only valid for 30 days from when your friend shared it with you.
              </p>
              <button
                onClick={() => setShowSignupForm(true)}
                className="group relative inline-block"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
                <div className="relative px-12 py-6 bg-white rounded-2xl text-blue-600 font-black text-2xl hover:scale-110 transition-all duration-300">
                  Claim My Discount Now →
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-black/50 backdrop-blur-xl py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            KINECT B2B
          </div>
          <p className="text-gray-400 mb-6">Connecting service providers with qualified leads.</p>
          <div className="flex justify-center gap-8 text-gray-400">
            <a href="mailto:accounts@kinectb2b.com" className="hover:text-cyan-400 transition">
              accounts@kinectb2b.com
            </a>
            <a href="tel:2192077863" className="hover:text-cyan-400 transition">
              (219) 207-7863
            </a>
          </div>
        </div>
      </footer>

      {/* Signup Form Modal */}
      {showSignupForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="relative max-w-2xl w-full my-8">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur-xl opacity-75"></div>
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500/50 rounded-3xl p-10 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowSignupForm(false)}
                className="absolute top-6 right-6 text-white hover:bg-white/20 rounded-full p-2 transition text-2xl w-10 h-10 flex items-center justify-center"
              >
                ✕
              </button>

              <div className="mb-6">
                <h2 className="text-4xl font-black text-white mb-2">Claim Your Discount</h2>
                <p className="text-cyan-400 font-bold text-lg">Referral code: {referralCode}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Business Name *</label>
                    <input
                      type="text"
                      value={formData.business_name}
                      onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Your Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">State *</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Industry *</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
                    placeholder="e.g., Landscaping, HVAC, Cleaning"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">What are you interested in? *</label>
                  <select
                    value={formData.interested_in}
                    onChange={(e) => setFormData({ ...formData, interested_in: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition"
                    required
                  >
                    <option value="" className="bg-slate-900">Select a service...</option>
                    <option value="Appointment Setting" className="bg-slate-900">Appointment Setting (20% OFF first 3 months)</option>
                    <option value="Website Building" className="bg-slate-900">Website Building (10% OFF)</option>
                    <option value="Automations" className="bg-slate-900">Automations (10% OFF)</option>
                    <option value="Client Portals" className="bg-slate-900">Client Portals (10% OFF)</option>
                    <option value="Multiple Services" className="bg-slate-900">Multiple Services</option>
                  </select>
                </div>

                <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <div className="font-bold text-white mb-1">Your Exclusive Discount Will Be Applied!</div>
                      <div className="text-sm text-gray-300">
                        We'll contact you within 24 hours to discuss your needs and apply your referral discount.
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full py-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:scale-105 transition duration-300 rounded-xl text-white font-black text-xl shadow-lg disabled:opacity-50"
                >
                  {formStatus === 'sending' ? 'Claiming Your Discount...' : 'Claim My Exclusive Discount →'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}

export default function ReferralLandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900"><div className="text-white text-2xl">Loading...</div></div>}>
      <ReferralContent />
    </Suspense>
  );
}