'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function PortalsPage() {
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [referralCode, setReferralCode] = useState('');
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
    selected_plan: '',
  });

  // Chatbot States
  const [chatOpen, setChatOpen] = useState(false);
  const [chatStep, setChatStep] = useState('greeting');
  const [isTyping, setIsTyping] = useState(false);
  const [chatFormData, setChatFormData] = useState({
    name: '',
    business_name: '',
    phone: '',
    email: '',
    discount_code: ''
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

  // Auto-open chatbot after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setChatOpen(true);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setChatStep('greeting');
      }, 2000);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Handle chatbot form submission (for call scheduling)
  const handleChatCallSubmit = async () => {
    try {
      const response = await fetch('/api/leads/service-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: chatFormData.name,
          business_name: chatFormData.business_name,
          phone: chatFormData.phone,
          email: chatFormData.email,
          service_type: 'Client Portal',
          lead_source: 'Chatbot - Abigail - Call Request',
          referral_code: referralCode
        }),
      });

      if (response.ok) {
        setChatStep('callSuccess');
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      alert('Something went wrong. Please try again or call us at (219) 270-7863');
    }
  };

  // Typing animation helper
  const showTypingThenNext = (nextStep, delay = 2000) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setChatStep(nextStep);
    }, delay);
  };

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
      color: 'from-green-500 to-emerald-500',
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
      color: 'from-emerald-500 to-teal-500',
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
      color: 'from-teal-500 to-cyan-500',
    },
  ];

  const portalFeatures = [
    { icon: '🔒', name: 'Secure Login', desc: 'Bank-level encryption for client data' },
    { icon: '📊', name: 'Real-Time Reports', desc: 'Live campaign tracking and analytics' },
    { icon: '📁', name: 'Document Sharing', desc: 'Easy file exchange with clients' },
    { icon: '💬', name: 'Direct Messaging', desc: 'In-portal client communication' },
    { icon: '📅', name: 'Scheduling', desc: 'Integrated appointment booking' },
    { icon: '🔔', name: 'Notifications', desc: 'Automated email & SMS alerts' },
    { icon: '📱', name: 'Mobile Ready', desc: 'Works perfectly on all devices' },
    { icon: '🎨', name: 'Custom Branding', desc: 'Your logo, colors, and domain' },
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
        alert('Something went wrong. Please try again or call us at (219) 270-7863');
      }
    } catch (error) {
      console.error('Error:', error);
      setFormStatus('error');
      alert('Something went wrong. Please try again or call us at (219) 270-7863');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative bg-gradient-to-r from-slate-900/80 to-emerald-900/80 backdrop-blur-xl border-b border-white/10 z-[100]">
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
              <h1 className="text-xl md:text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                Kinect B2B
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex gap-6 items-center">
              <a href="/" className="text-gray-300 hover:text-emerald-400 transition">Home</a>
              <a href="/about" className="text-gray-300 hover:text-emerald-400 transition">About</a>
              
              <div className="relative">
                <button 
                  onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  className="text-white hover:text-emerald-400 transition font-bold flex items-center gap-1 py-2 px-2"
                >
                  Our Services
                  <span className="text-sm">{servicesDropdownOpen ? '▲' : '▼'}</span>
                </button>
                {servicesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-xl border border-emerald-500/30 rounded-xl shadow-2xl z-[200]">
                    <a href="/plans" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-emerald-500/20 transition rounded-t-xl">Plans</a>
                    <a href="/services/websites" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-emerald-500/20 transition">Websites</a>
                    <a href="/services/automations" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-emerald-500/20 transition">Automations</a>
                    <a href="/services/portals" className="block px-4 py-3 text-white hover:text-emerald-400 hover:bg-emerald-500/20 transition rounded-b-xl font-bold">Portals</a>
                  </div>
                )}
              </div>

              <a href="/affiliate" className="text-gray-300 hover:text-emerald-400 transition">Affiliate Program</a>
              <a href="/portal" className="text-gray-300 hover:text-emerald-400 transition">Client Login</a>
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
              <a href="/" className="block px-4 py-3 text-gray-300 hover:bg-emerald-500/20 rounded-lg transition">Home</a>
              <a href="/about" className="block px-4 py-3 text-gray-300 hover:bg-emerald-500/20 rounded-lg transition">About</a>
              
              <div>
                <button 
                  onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  className="w-full text-left px-4 py-3 text-white hover:bg-emerald-500/20 rounded-lg transition font-bold flex items-center justify-between"
                >
                  Our Services
                  <span className="text-sm">{servicesDropdownOpen ? '▲' : '▼'}</span>
                </button>
                {servicesDropdownOpen && (
                  <div className="ml-4 mt-2 space-y-2">
                    <a href="/plans" className="block px-4 py-2 text-gray-300 hover:bg-emerald-500/20 rounded-lg transition text-sm">Plans</a>
                    <a href="/services/websites" className="block px-4 py-2 text-gray-300 hover:bg-emerald-500/20 rounded-lg transition text-sm">Websites</a>
                    <a href="/services/automations" className="block px-4 py-2 text-gray-300 hover:bg-emerald-500/20 rounded-lg transition text-sm">Automations</a>
                    <a href="/services/portals" className="block px-4 py-2 text-white hover:bg-emerald-500/20 rounded-lg transition text-sm font-bold">Portals</a>
                  </div>
                )}
              </div>

              <a href="/affiliate" className="block px-4 py-3 text-gray-300 hover:bg-emerald-500/20 rounded-lg transition">Affiliate Program</a>
              <a href="/portal" className="block px-4 py-3 text-gray-300 hover:bg-emerald-500/20 rounded-lg transition">Client Login</a>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 md:py-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-black mb-6 md:mb-8">
            <span className="text-white">Client Portals That</span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
              Wow Your Clients.
            </span>
          </h1>

          <p className="text-lg md:text-2xl lg:text-3xl text-gray-300 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed">
            Give your clients 24/7 access to their campaign data, reports, and documents through a beautiful branded portal.
          </p>

          <button
            onClick={() => setChatOpen(true)}
            className="w-full sm:w-auto px-6 md:px-12 py-4 md:py-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-full text-white font-black text-base md:text-2xl transition-all duration-300 shadow-2xl hover:shadow-emerald-500/50 hover:scale-105"
          >
            Schedule a Call
          </button>
        </div>
      </section>

      {/* Portal Features Grid */}
      <section className="relative py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-center mb-12 md:mb-20">
            <span className="text-white">Powerful </span>
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Features</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {portalFeatures.map((feature, idx) => (
              <div key={idx} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 hover:border-emerald-500/50 transition-all duration-300 text-center">
                  <div className="text-5xl md:text-6xl mb-4 md:mb-6">{feature.icon}</div>
                  <h3 className="text-lg md:text-xl font-black text-white mb-2 md:mb-3">{feature.name}</h3>
                  <p className="text-sm md:text-base text-gray-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Setup Packages */}
      <section className="relative py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-center mb-12 md:mb-20">
            <span className="text-white">Choose Your </span>
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Portal Package</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {setupPackages.map((pkg, idx) => (
              <div key={idx} className="group relative">
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 md:px-6 py-1 md:py-2 rounded-full text-xs md:text-sm font-black">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 rounded-3xl"></div>
                
                <div className={`relative bg-gradient-to-br ${pkg.color} p-1 rounded-3xl h-full`}>
                  <div className="bg-slate-900 rounded-3xl p-6 md:p-8 h-full flex flex-col">
                    <div className="text-center mb-6 md:mb-8">
                      <h3 className="text-2xl md:text-3xl font-black text-white mb-2 md:mb-3">{pkg.name}</h3>
                      <p className="text-gray-400 text-sm md:text-base mb-4 md:mb-6">{pkg.description}</p>
                      <p className="text-sm md:text-base font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent mb-2">STARTING AT</p>
                      <div className="text-4xl md:text-5xl font-black text-white mb-2">
                        ${pkg.price.toLocaleString()}<span className="text-base md:text-lg text-gray-400">/setup</span>
                      </div>
                      <div className="text-emerald-400 font-bold text-sm md:text-base">
                        + <span className="text-gray-400 font-normal text-xs">Starting at</span> ${pkg.hosting}/mo hosting
                      </div>
                      <p className="text-gray-400 mt-2 text-xs md:text-sm">{pkg.clients}</p>
                    </div>

                    <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 flex-1">
                      {pkg.features.map((feature, fidx) => (
                        <div key={fidx} className="flex items-center gap-3 text-gray-300">
                          <span className="text-emerald-400 text-lg md:text-xl">✓</span>
                          <span className="text-sm md:text-base">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleLearnMore(pkg)}
                      className="w-full py-3 md:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl text-white font-black text-base md:text-lg transition-all duration-300 hover:scale-105"
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-12 md:py-20 bg-gradient-to-r from-emerald-950/50 to-teal-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-center mb-12 md:mb-20">
            <span className="text-white">How It </span>
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Works</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { step: '1', title: 'Consultation', desc: 'We discuss your needs and design requirements' },
              { step: '2', title: 'Design & Build', desc: 'We create your custom branded portal' },
              { step: '3', title: 'Setup & Testing', desc: 'We configure and thoroughly test everything' },
              { step: '4', title: 'Launch & Support', desc: 'Go live with ongoing support and updates' },
            ].map((item, idx) => (
              <div key={idx} className="group relative text-center">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
                
                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-emerald-500/20 p-6 md:p-8 rounded-2xl hover:border-emerald-500/50 transition duration-300">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-black mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm md:text-base">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-2xl border border-emerald-500/30 p-6 md:p-12 rounded-3xl text-center">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 md:mb-6">
                Ready to <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Impress</span> Your Clients?
              </h2>
              <p className="text-base md:text-xl text-gray-300 mb-6 md:mb-8">
                Get a custom client portal that sets you apart from the competition.
              </p>
              <button
                onClick={() => setChatOpen(true)}
                className="group relative inline-block"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
                <div className="relative px-8 md:px-12 py-4 md:py-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl text-white font-black text-lg md:text-2xl hover:scale-110 transition-all duration-300">
                  Talk to Abigail (Our AI) →
                </div>
              </button>
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
            <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              KINECT B2B
            </div>
          </div>
          <p className="text-gray-500 text-sm md:text-base">© 2025 Kinect B2B. All rights reserved.</p>
        </div>
      </footer>

      {/* Chatbot - Mobile Friendly */}
      {chatOpen && (
        <div className="fixed inset-0 md:inset-auto md:bottom-8 md:right-8 z-50 p-4 md:p-0">
          <div className="relative h-full md:h-auto md:w-[420px]">
            <div 
              className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm -z-10"
              onClick={() => setChatOpen(false)}
            ></div>

            <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl blur-xl opacity-75"></div>
            
            <div className="relative h-full md:h-auto bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-emerald-500/50 rounded-3xl shadow-2xl flex flex-col max-h-screen md:max-h-[600px]">
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-xl md:text-2xl">
                    🤖
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-black text-white">Abigail (AI)</h3>
                    <p className="text-xs md:text-sm text-emerald-400">● Online</p>
                  </div>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full p-2 transition"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                {/* Typing Animation */}
                {isTyping && (
                  <div className="bg-emerald-600/20 border border-emerald-500/30 rounded-2xl p-4 mb-4 animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-white text-sm">Abigail is typing...</span>
                    </div>
                  </div>
                )}

                {/* Greeting */}
                {chatStep === 'greeting' && !isTyping && (
                  <div className="animate-fadeIn space-y-4">
                    <div className="bg-emerald-600/20 border border-emerald-500/30 rounded-2xl p-4 md:p-6">
                      <h3 className="text-xl md:text-2xl font-black text-white mb-3 md:mb-4">
                        👋 Hi! I'm Abigail!
                      </h3>
                      <p className="text-sm md:text-base text-gray-300 mb-4">
                        I'm here to help you get your custom client portal set up. I can either:
                      </p>
                    </div>

                    <button
                      onClick={() => showTypingThenNext('wantCall')}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:scale-105 transition duration-300 rounded-2xl p-4 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl md:text-3xl">📞</span>
                        <div>
                          <div className="font-black text-white text-sm md:text-base">Schedule a Growth Call</div>
                          <div className="text-xs md:text-sm text-gray-300">Let's discuss your needs (15 mins)</div>
                        </div>
                      </div>
                    </button>
                  </div>
                )}

                {/* Want Call Form */}
                {chatStep === 'wantCall' && !isTyping && (
                  <div className="animate-fadeIn space-y-3">
                    <div className="bg-emerald-600/20 border border-emerald-500/30 rounded-2xl p-4 mb-4">
                      <p className="text-white font-bold text-sm md:text-base">📋 Perfect! Let me grab your details:</p>
                    </div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={chatFormData.name}
                      onChange={(e) => setChatFormData({ ...chatFormData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition text-sm md:text-base"
                    />
                    <input
                      type="text"
                      placeholder="Business Name"
                      value={chatFormData.business_name}
                      onChange={(e) => setChatFormData({ ...chatFormData, business_name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition text-sm md:text-base"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={chatFormData.phone}
                      onChange={(e) => setChatFormData({ ...chatFormData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition text-sm md:text-base"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={chatFormData.email}
                      onChange={(e) => setChatFormData({ ...chatFormData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition text-sm md:text-base"
                    />
                    <button
                      onClick={handleChatCallSubmit}
                      disabled={!chatFormData.name || !chatFormData.business_name || !chatFormData.phone || !chatFormData.email}
                      className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:scale-105 transition duration-300 rounded-xl text-white font-black text-sm md:text-base disabled:opacity-50"
                    >
                      Schedule My Call
                    </button>
                  </div>
                )}

                {/* Want Discount Form */}
                {chatStep === 'wantDiscount' && !isTyping && (
                  <div className="animate-fadeIn space-y-3">
                    <div className="bg-emerald-600/20 border border-emerald-500/30 rounded-2xl p-4 mb-4">
                      <p className="text-white font-bold text-sm md:text-base">🎯 Great choice! Let me get your info:</p>
                    </div>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={chatFormData.name}
                      onChange={(e) => setChatFormData({ ...chatFormData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition text-sm md:text-base"
                    />
                    <input
                      type="text"
                      placeholder="Business Name"
                      value={chatFormData.business_name}
                      onChange={(e) => setChatFormData({ ...chatFormData, business_name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition text-sm md:text-base"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={chatFormData.phone}
                      onChange={(e) => setChatFormData({ ...chatFormData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition text-sm md:text-base"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={chatFormData.email}
                      onChange={(e) => setChatFormData({ ...chatFormData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition text-sm md:text-base"
                    />
                    <button
                      onClick={handleDiscountRequest}
                      disabled={!chatFormData.name || !chatFormData.business_name || !chatFormData.phone || !chatFormData.email}
                      className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:scale-105 transition duration-300 rounded-xl text-white font-black text-sm md:text-base disabled:opacity-50"
                    >
                      Get My Discount Code
                    </button>
                  </div>
                )}

                {/* Call Scheduled Success */}
                {chatStep === 'callSuccess' && (
                  <div className="text-center animate-fadeIn">
                    <div className="text-5xl md:text-6xl mb-4">🎉</div>
                    <div className="bg-emerald-600/30 border-2 border-emerald-500/50 rounded-2xl p-4 md:p-6 mb-4">
                      <p className="text-emerald-400 font-black text-xl md:text-2xl mb-3">Perfect!</p>
                      <p className="text-white font-bold mb-4 text-sm md:text-base">We'll be reaching out shortly to schedule your consultation call!</p>
                      <div className="space-y-2 text-emerald-400 text-xs md:text-sm">
                        <div>📞 <a href="tel:2192707863" className="font-bold hover:text-emerald-300">219-270-7863</a></div>
                        <div>📧 <a href="mailto:accounts@kinectb2b.com" className="font-bold hover:text-emerald-300">accounts@kinectb2b.com</a></div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setChatStep('greeting');
                        setChatFormData({ name: '', business_name: '', phone: '', email: '', discount_code: '' });
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white font-bold hover:scale-105 transition text-sm md:text-base"
                    >
                      Start Over
                    </button>
                  </div>
                )}

                {/* Discount Success */}
                {chatStep === 'discountSuccess' && (
                  <div className="text-center animate-fadeIn">
                    <div className="text-5xl md:text-6xl mb-4">🎉</div>
                    <div className="bg-emerald-600/30 border-2 border-emerald-500/50 rounded-2xl p-4 md:p-6 mb-4">
                      <p className="text-emerald-400 font-black text-xl md:text-2xl mb-3">Success!</p>
                      <p className="text-white font-bold mb-4 text-sm md:text-base">Here's your exclusive 10% discount code for setup:</p>
                      <div className="bg-slate-900 border-2 border-emerald-400 rounded-xl p-4 mb-4">
                        <div className="text-2xl md:text-3xl font-black text-emerald-400 tracking-wider">
                          {chatFormData.discount_code}
                        </div>
                      </div>
                      <p className="text-gray-300 text-xs md:text-sm mb-4">
                        Save this code! Use it when you're ready to get started.
                      </p>
                      <div className="space-y-2 text-emerald-400 text-xs md:text-sm">
                        <div>📞 <a href="tel:2192707863" className="font-bold hover:text-emerald-300">219-270-7863</a></div>
                        <div>📧 <a href="mailto:accounts@kinectb2b.com" className="font-bold hover:text-emerald-300">accounts@kinectb2b.com</a></div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setChatStep('greeting');
                        setChatFormData({ name: '', business_name: '', phone: '', email: '', discount_code: '' });
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white font-bold hover:scale-105 transition text-sm md:text-base"
                    >
                      Start Over
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full blur-xl opacity-75 group-hover:opacity-100 animate-pulse"></div>
          <div className="relative w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-2xl md:text-3xl hover:scale-110 transition duration-300 shadow-2xl">
            💬
          </div>
        </button>
      )}

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative max-w-2xl w-full my-8">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl blur-xl opacity-75"></div>
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 md:p-10 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => {
                  setShowContactForm(false);
                  setSelectedPackage(null);
                }}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-white hover:bg-white/10 rounded-full p-2 transition"
              >
                ✕
              </button>

              <h3 className="text-2xl md:text-4xl font-black text-white mb-6 text-center">
                {selectedPackage ? `Get Started: ${selectedPackage.name}` : 'Get Your'} <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Client Portal</span>
              </h3>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Business Name *"
                    required
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition text-sm md:text-base"
                  />
                  <input
                    type="text"
                    placeholder="Your Name *"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition text-sm md:text-base"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition text-sm md:text-base"
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition text-sm md:text-base"
                  />
                  <input
                    type="text"
                    placeholder="City *"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition text-sm md:text-base"
                  />
                  <input
                    type="text"
                    placeholder="State *"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition text-sm md:text-base"
                  />
                </div>
                
                <input
                  type="text"
                  placeholder="Industry *"
                  required
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition text-sm md:text-base"
                />

                <textarea
                  placeholder="What features do you need in your portal?"
                  rows={4}
                  value={formData.questions}
                  onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
                  className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition resize-none text-sm md:text-base"
                />

                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full py-4 md:py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:scale-105 transition duration-300 rounded-xl text-white font-black text-lg md:text-xl shadow-lg disabled:opacity-50"
                >
                  {formStatus === 'sending' ? 'Sending...' : 'Request Consultation'}
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
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideIn { animation: slideIn 0.5s ease-out; }
      `}</style>
    </div>
  );
}