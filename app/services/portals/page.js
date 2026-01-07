'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Mail,
  X,
  ChevronRight,
  Check,
  Lock,
  BarChart3,
  FolderOpen,
  MessageSquare,
  Calendar,
  Bell,
  Smartphone,
  Palette
} from 'lucide-react';

export default function PortalsPage() {
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [referralCode, setReferralCode] = useState('');
  const [formStatus, setFormStatus] = useState('');
  const [formData, setFormData] = useState({
    business_name: '',
    name: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    industry: '',
    questions: '',
    selected_plan: '',
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');

    if (refCode) {
      localStorage.setItem('referral_code', refCode);
      localStorage.setItem('referral_code_date', Date.now().toString());
      setReferralCode(refCode);
    } else {
      const storedCode = localStorage.getItem('referral_code');
      const storedDate = localStorage.getItem('referral_code_date');

      if (storedCode && storedDate) {
        const daysSince = (Date.now() - parseInt(storedDate)) / (1000 * 60 * 60 * 24);
        if (daysSince < 30) {
          setReferralCode(storedCode);
        } else {
          localStorage.removeItem('referral_code');
          localStorage.removeItem('referral_code_date');
        }
      }
    }
  }, []);

  const setupPackages = [
    {
      name: 'Basic Portal',
      price: 1500,
      hosting: 100,
      clients: 'Up to 10 clients',
      description: 'Perfect for simple client communication',
      features: [
        'Custom branded portal',
        'Secure login system',
        'Document sharing',
        'Basic messaging',
        'Mobile responsive',
        'SSL security',
      ],
      popular: false,
    },
    {
      name: 'Professional Portal',
      price: 3000,
      hosting: 250,
      clients: 'Up to 50 clients',
      description: 'Best for service businesses tracking campaigns',
      features: [
        'Everything in Basic',
        'Real-time reporting dashboard',
        'Lead tracking & status updates',
        'Appointment scheduling integration',
        'File upload/download',
        'Email notifications',
        'Client analytics',
      ],
      popular: true,
    },
    {
      name: 'Enterprise Portal',
      price: 5000,
      hosting: 500,
      clients: 'Unlimited clients',
      description: 'Complete client management solution',
      features: [
        'Everything in Professional',
        'Multi-user team access',
        'Advanced automation',
        'Custom integrations (CRM, etc)',
        'Dedicated support',
        'Priority updates',
        'Custom features',
      ],
      popular: false,
    },
  ];

  const portalFeatures = [
    { icon: Lock, name: 'Secure Login', desc: 'Bank-level encryption for client data' },
    { icon: BarChart3, name: 'Real-Time Reports', desc: 'Live campaign tracking and analytics' },
    { icon: FolderOpen, name: 'Document Sharing', desc: 'Easy file exchange with clients' },
    { icon: MessageSquare, name: 'Direct Messaging', desc: 'In-portal client communication' },
    { icon: Calendar, name: 'Scheduling', desc: 'Integrated appointment booking' },
    { icon: Bell, name: 'Notifications', desc: 'Automated email & SMS alerts' },
    { icon: Smartphone, name: 'Mobile Ready', desc: 'Works perfectly on all devices' },
    { icon: Palette, name: 'Custom Branding', desc: 'Your logo, colors, and domain' },
  ];

  const handleLearnMore = (pkg) => {
    setSelectedPackage(pkg);
    setFormData({ ...formData, selected_plan: pkg.name });
    setShowContactForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');

    try {
      const response = await fetch('/api/leads/service-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          service_type: 'Client Portal',
          lead_source: 'Portals Page - Contact Form',
          referral_code: referralCode
        }),
      });

      if (response.ok) {
        setFormStatus('success');
        alert('Thank you! We will contact you shortly to discuss your portal needs.');
        setShowContactForm(false);
        setFormData({
          business_name: '',
          name: '',
          phone: '',
          email: '',
          city: '',
          state: '',
          industry: '',
          questions: '',
          selected_plan: '',
        });
      } else {
        setFormStatus('error');
        alert('Something went wrong. Please try again or email us at accounts@kinectb2b.com');
      }
    } catch (error) {
      console.error('Error:', error);
      setFormStatus('error');
      alert('Something went wrong. Please try again or email us at accounts@kinectb2b.com');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header currentPage="/services/portals" />

      {/* Hero Section */}
      <section className="bg-slate-900 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Client Portals That{' '}
              <span className="text-teal-400">Impress</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Give your clients 24/7 access to their campaign data, reports, and documents through a beautiful branded portal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowContactForm(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Contact Us
              </button>
              <a
                href="#packages"
                className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2"
              >
                View Packages
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Portal Features Grid */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to deliver a premium client experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {portalFeatures.map((feature, idx) => {
              const IconComponent = feature.icon;
              return (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-6 hover:shadow-lg transition">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.name}</h3>
                  <p className="text-slate-600">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Setup Packages */}
      <section id="packages" className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Portal Packages
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              One-time setup fee plus monthly hosting. Scale as you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {setupPackages.map((pkg, idx) => (
              <div
                key={idx}
                className={`relative bg-white rounded-2xl border-2 ${pkg.popular ? 'border-teal-500 shadow-xl' : 'border-slate-200'} p-8 flex flex-col`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-teal-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
                  <p className="text-slate-600 mb-4">{pkg.description}</p>
                  <div className="text-4xl font-bold text-slate-900 mb-2">
                    ${pkg.price.toLocaleString()}
                    <span className="text-lg font-normal text-slate-500">/setup</span>
                  </div>
                  <div className="text-teal-600 font-semibold">
                    + ${pkg.hosting}/mo hosting
                  </div>
                  <p className="text-slate-500 text-sm mt-2">{pkg.clients}</p>
                </div>

                <div className="space-y-3 mb-8 flex-1">
                  {pkg.features.map((feature, fidx) => (
                    <div key={fidx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleLearnMore(pkg)}
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    pkg.popular
                      ? 'bg-teal-600 hover:bg-teal-700 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From consultation to launch, we handle everything.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Consultation', desc: 'We discuss your needs and design requirements' },
              { step: '2', title: 'Design & Build', desc: 'We create your custom branded portal' },
              { step: '3', title: 'Setup & Testing', desc: 'We configure and thoroughly test everything' },
              { step: '4', title: 'Launch & Support', desc: 'Go live with ongoing support and updates' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Impress Your Clients?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Get a custom client portal that sets you apart from the competition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowContactForm(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Contact Us
            </button>
            <a
              href="mailto:accounts@kinectb2b.com"
              className="bg-white hover:bg-slate-100 text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg transition"
            >
              accounts@kinectb2b.com
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative max-w-xl w-full bg-white rounded-2xl shadow-2xl p-6 md:p-8 my-8">
            <button
              onClick={() => {
                setShowContactForm(false);
                setSelectedPackage(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              {selectedPackage ? `Get Started: ${selectedPackage.name}` : 'Request a Consultation'}
            </h3>
            <p className="text-slate-600 mb-6">
              Fill out the form below and we'll be in touch within 24 hours.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Business Name *"
                  required
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Your Name *"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="City *"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="State *"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <input
                type="text"
                placeholder="Industry *"
                required
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />

              <textarea
                placeholder="What features do you need in your portal?"
                rows={4}
                value={formData.questions}
                onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              />

              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
              >
                {formStatus === 'sending' ? 'Sending...' : 'Request Consultation'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
