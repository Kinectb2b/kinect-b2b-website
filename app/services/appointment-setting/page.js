'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function AppointmentSettingPage() {
  const [showContactForm, setShowContactForm] = useState(false);
  const [formStatus, setFormStatus] = useState('');
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    business_name: '',
    name: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    industry: '',
    questions: '',
  });

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
          service_type: 'Appointment Setting',
        }),
      });

      if (response.ok) {
        setFormStatus('success');
        alert('Thank you! We will contact you shortly to discuss your appointment setting needs.');
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
        });
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

  const processSteps = [
    {
      step: '01',
      title: 'Discovery Call',
      description: 'We learn about your business, ideal customer profile, and goals. This helps us build a custom outreach strategy tailored to your market.'
    },
    {
      step: '02',
      title: 'List Building',
      description: 'We build a targeted list of decision-makers in your ideal market using premium data sources like Apollo, LinkedIn Sales Navigator, and ZoomInfo.'
    },
    {
      step: '03',
      title: 'Campaign Launch',
      description: 'We launch multi-channel outreach campaigns via email, LinkedIn, and phone. Each touchpoint is personalized and optimized for response.'
    },
    {
      step: '04',
      title: 'Appointments Booked',
      description: 'Qualified leads are scheduled directly on your calendar. You show up, close deals, and grow your business.'
    }
  ];

  const industries = [
    'HVAC', 'Plumbing', 'Roofing', 'Electrical', 'Solar', 'Home Services',
    'Commercial Services', 'Landscaping', 'Pest Control', 'Restoration'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative bg-gradient-to-r from-slate-900/80 to-blue-900/80 backdrop-blur-xl border-b border-white/10 z-[100]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/my-logo.png"
                alt="Kinect B2B Logo"
                width={40}
                height={40}
                className="w-8 h-8 md:w-10 md:h-10"
              />
              <h1 className="text-xl md:text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Kinect B2B
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex gap-6 items-center">
              <a href="/" className="text-gray-300 hover:text-cyan-400 transition">Home</a>
              <a href="/about" className="text-gray-300 hover:text-cyan-400 transition">About</a>

              <div className="relative">
                <button
                  onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  className="text-white hover:text-cyan-400 transition font-bold flex items-center gap-1 py-2 px-2"
                >
                  Our Services
                  <span className="text-sm">{servicesDropdownOpen ? '▲' : '▼'}</span>
                </button>
                {servicesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl shadow-2xl z-[200]">
                    <a href="/plans" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-cyan-500/20 transition rounded-t-xl">Plans & Pricing</a>
                    <a href="/services/appointment-setting" className="block px-4 py-3 text-white hover:text-cyan-400 hover:bg-cyan-500/20 transition font-bold">Appointment Setting</a>
                    <a href="/services/websites" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-cyan-500/20 transition">Websites</a>
                    <a href="/services/automations" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-cyan-500/20 transition">Automations</a>
                    <a href="/services/portals" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-cyan-500/20 transition rounded-b-xl">Client Portals</a>
                  </div>
                )}
              </div>

              <a href="/affiliate" className="text-gray-300 hover:text-cyan-400 transition">Affiliate Program</a>
              <a href="/portal" className="text-gray-300 hover:text-cyan-400 transition">Client Login</a>
            </nav>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 space-y-2 animate-fadeIn">
              <a href="/" className="block px-4 py-3 text-gray-300 hover:bg-cyan-500/20 rounded-lg transition">Home</a>
              <a href="/about" className="block px-4 py-3 text-gray-300 hover:bg-cyan-500/20 rounded-lg transition">About</a>

              <div>
                <button
                  onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  className="w-full text-left px-4 py-3 text-white hover:bg-cyan-500/20 rounded-lg transition font-bold flex items-center justify-between"
                >
                  Our Services
                  <span className="text-sm">{servicesDropdownOpen ? '▲' : '▼'}</span>
                </button>
                {servicesDropdownOpen && (
                  <div className="ml-4 mt-2 space-y-2">
                    <a href="/plans" className="block px-4 py-2 text-gray-300 hover:bg-cyan-500/20 rounded-lg transition text-sm">Plans & Pricing</a>
                    <a href="/services/appointment-setting" className="block px-4 py-2 text-white hover:bg-cyan-500/20 rounded-lg transition text-sm font-bold">Appointment Setting</a>
                    <a href="/services/websites" className="block px-4 py-2 text-gray-300 hover:bg-cyan-500/20 rounded-lg transition text-sm">Websites</a>
                    <a href="/services/automations" className="block px-4 py-2 text-gray-300 hover:bg-cyan-500/20 rounded-lg transition text-sm">Automations</a>
                    <a href="/services/portals" className="block px-4 py-2 text-gray-300 hover:bg-cyan-500/20 rounded-lg transition text-sm">Client Portals</a>
                  </div>
                )}
              </div>

              <a href="/affiliate" className="block px-4 py-3 text-gray-300 hover:bg-cyan-500/20 rounded-lg transition">Affiliate Program</a>
              <a href="/portal" className="block px-4 py-3 text-gray-300 hover:bg-cyan-500/20 rounded-lg transition">Client Login</a>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
            <span className="text-cyan-400 font-bold text-sm md:text-base">Core Service</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 md:mb-8">
            <span className="text-white">B2B Appointment</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Setting
            </span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed">
            We fill your calendar with qualified appointments so you can focus on what you do best: closing deals and serving customers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setShowContactForm(true)}
              className="w-full sm:w-auto group relative px-8 md:px-12 py-4 md:py-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-full text-white font-black text-lg md:text-xl transition-all duration-300 shadow-2xl hover:shadow-cyan-500/50 hover:scale-105"
            >
              <span className="relative z-10">See If You Qualify</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 blur-xl opacity-0 group-hover:opacity-75 transition-opacity"></div>
            </button>

            <a
              href="/plans"
              className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 border-2 border-cyan-500/50 hover:bg-cyan-500/10 rounded-full text-cyan-400 font-bold text-lg md:text-xl transition-all duration-300 hover:scale-105"
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* What Is Appointment Setting */}
      <section className="relative py-16 md:py-24 bg-slate-900/50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-8">
            <span className="text-white">What Is </span>
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Appointment Setting?</span>
          </h2>

          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-3xl p-8 md:p-12">
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-6">
              Appointment setting is the process of identifying, contacting, and scheduling meetings with potential customers on your behalf. Instead of cold calling yourself or hoping leads come to you, we proactively reach out to your ideal prospects and book qualified appointments directly on your calendar.
            </p>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
              Think of us as your dedicated sales development team — without the overhead of hiring, training, and managing employees. You focus on closing deals while we focus on filling your pipeline.
            </p>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-4">
            <span className="text-white">Our </span>
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Process</span>
          </h2>
          <p className="text-gray-400 text-center mb-12 md:mb-16 max-w-2xl mx-auto">
            A proven methodology that delivers results.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((item, idx) => (
              <div key={idx} className="relative">
                <div className="text-7xl md:text-8xl font-black text-cyan-500/10 absolute -top-6 -left-2">{item.step}</div>
                <div className="relative pt-10 pl-4">
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm md:text-base">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="relative py-16 md:py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-4">
            <span className="text-white">Industries We </span>
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Serve</span>
          </h2>
          <p className="text-gray-400 text-center mb-12 md:mb-16 max-w-2xl mx-auto">
            We specialize in appointment setting for service-based B2B businesses.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {industries.map((industry, idx) => (
              <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 md:p-6 text-center hover:border-cyan-500/50 transition-colors">
                <span className="text-white font-bold">{industry}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-12">
            <span className="text-white">What to </span>
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Expect</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-2xl p-6 md:p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Timeline</h3>
              <p className="text-gray-400">Campaigns typically launch within 1-2 weeks. First appointments often come in week 2-3.</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-2xl p-6 md:p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Appointment Volume</h3>
              <p className="text-gray-400">Expect 8-50+ qualified appointments per month depending on your plan and market.</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-2xl p-6 md:p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Guarantee</h3>
              <p className="text-gray-400">20 qualified appointments in 90 days or we work for free until we deliver.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Overview */}
      <section className="relative py-16 md:py-24 bg-slate-900/50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-4">
            <span className="text-white">Pricing </span>
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Overview</span>
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Transparent pricing based on your appointment volume needs.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-6 md:p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
              <div className="text-3xl font-black text-cyan-400 mb-2">$2,000 - $3,000<span className="text-lg text-gray-400 font-normal">/mo</span></div>
              <p className="text-gray-400 text-sm mb-4">8-12 appointments/month</p>
              <p className="text-gray-500 text-sm">Best for solo operators and small teams</p>
            </div>

            <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-2xl p-6 md:p-8">
              <div className="text-xs font-bold text-cyan-400 mb-2">MOST POPULAR</div>
              <h3 className="text-2xl font-bold text-white mb-2">Growth</h3>
              <div className="text-3xl font-black text-cyan-400 mb-2">$4,000 - $6,000<span className="text-lg text-gray-400 font-normal">/mo</span></div>
              <p className="text-gray-400 text-sm mb-4">15-25 appointments/month</p>
              <p className="text-gray-500 text-sm">Best for growing businesses ready to scale</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl p-6 md:p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Scale</h3>
              <div className="text-3xl font-black text-cyan-400 mb-2">$7,000 - $10,000<span className="text-lg text-gray-400 font-normal">/mo</span></div>
              <p className="text-gray-400 text-sm mb-4">30-50 appointments/month</p>
              <p className="text-gray-500 text-sm">Best for established companies with aggressive goals</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <a
              href="/plans"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl text-white font-bold text-lg transition-all duration-300 hover:scale-105"
            >
              View Full Pricing Details
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Ready to Fill Your Calendar?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Apply to work with us and see if you're a good fit for our boutique appointment setting service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowContactForm(true)}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl text-white font-black text-lg transition-all duration-300 hover:scale-105"
              >
                Apply Now
              </button>
              <a
                href="tel:219-270-7863"
                className="px-8 py-4 border-2 border-cyan-500/50 hover:bg-cyan-500/10 rounded-xl text-cyan-400 font-bold text-lg transition-all duration-300"
              >
                Call: (219) 270-7863
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-black/50 backdrop-blur-xl py-8 md:py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image
              src="/my-logo.png"
              alt="Kinect B2B Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              KINECT B2B
            </div>
          </div>
          <p className="text-gray-500 text-sm md:text-base">© 2025 Kinect B2B. All rights reserved.</p>
        </div>
      </footer>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative max-w-2xl w-full my-8">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur-xl opacity-75"></div>
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500/50 rounded-3xl p-6 md:p-10 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowContactForm(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-white hover:bg-white/10 rounded-full p-2 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h3 className="text-2xl md:text-4xl font-black text-white mb-6 text-center">
                Apply for <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Appointment Setting</span>
              </h3>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Business Name *"
                    required
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition text-sm md:text-base"
                  />
                  <input
                    type="text"
                    placeholder="Your Name *"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition text-sm md:text-base"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition text-sm md:text-base"
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition text-sm md:text-base"
                  />
                  <input
                    type="text"
                    placeholder="City *"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition text-sm md:text-base"
                  />
                  <input
                    type="text"
                    placeholder="State *"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition text-sm md:text-base"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Industry *"
                  required
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition text-sm md:text-base"
                />

                <textarea
                  placeholder="Tell us about your business and goals"
                  rows={4}
                  value={formData.questions}
                  onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
                  className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition resize-none text-sm md:text-base"
                />

                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full py-4 md:py-5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:scale-105 transition duration-300 rounded-xl text-white font-black text-lg md:text-xl shadow-lg disabled:opacity-50"
                >
                  {formStatus === 'sending' ? 'Submitting...' : 'Submit Application'}
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
      `}</style>
    </div>
  );
}
