'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AutomationsPage() {
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

  const packages = [
    {
      name: 'Starter Automation',
      price: 500,
      description: 'Perfect for single workflow automation',
      features: [
        '1 custom automation workflow',
        'Basic triggers & actions',
        'Email sequences OR form automation',
        'Setup & testing included',
        '30-day support',
        'Integration with 1-2 tools',
      ],
      examples: 'Lead notification, welcome email sequence, form to CRM',
      popular: false,
      color: 'from-red-500 to-orange-500',
    },
    {
      name: 'Professional Automation Pack',
      price: 1500,
      description: 'Best for growing businesses',
      features: [
        '3-5 automation workflows',
        'Advanced triggers & conditional logic',
        'Multi-channel (email, SMS, CRM)',
        'Integration setup (2-3 tools)',
        '60-day support',
        'Workflow documentation',
      ],
      examples: 'Lead nurturing, appointment reminders, follow-up sequences',
      popular: true,
      color: 'from-orange-500 to-red-500',
    },
    {
      name: 'Enterprise Automation Suite',
      price: 3500,
      description: 'Complete business process automation',
      features: [
        'Unlimited workflows',
        'Full business process automation',
        'Multi-platform integrations (unlimited)',
        'Custom API connections',
        'Dashboard & reporting',
        '90-day support + monthly optimization',
      ],
      examples: 'Complete sales funnel, client onboarding, internal workflows',
      popular: false,
      color: 'from-red-600 to-orange-600',
    },
  ];

  const monthlyPlans = [
    {
      name: 'Bronze',
      price: 250,
      workflows: 'Up to 5 workflows',
      features: ['Monthly updates', 'Email support', 'Basic optimizations'],
      color: 'from-red-500 to-orange-500',
    },
    {
      name: 'Silver',
      price: 500,
      workflows: 'Up to 15 workflows',
      features: ['Bi-weekly optimization', 'Priority support', 'Performance reporting'],
      color: 'from-orange-500 to-red-500',
    },
    {
      name: 'Gold',
      price: 1000,
      workflows: 'Unlimited workflows',
      features: ['Weekly optimization', 'Dedicated support', 'Advanced analytics', 'Custom integrations'],
      color: 'from-red-600 to-orange-600',
    },
  ];

  const automationTypes = [
    { icon: '📧', name: 'Email Sequences', desc: 'Automated follow-ups and nurture campaigns' },
    { icon: '📱', name: 'SMS Automation', desc: 'Text message triggers and responses' },
    { icon: '📝', name: 'Form Processing', desc: 'Automatic lead capture and routing' },
    { icon: '📊', name: 'CRM Integration', desc: 'Sync data across platforms automatically' },
    { icon: '📅', name: 'Appointment Booking', desc: 'Automated scheduling and reminders' },
    { icon: '💰', name: 'Payment Processing', desc: 'Invoice generation and payment tracking' },
    { icon: '📂', name: 'Document Generation', desc: 'Auto-create proposals and contracts' },
    { icon: '🔔', name: 'Notifications', desc: 'Real-time alerts for your team' },
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
          service_type: 'Automations',
          referral_code: referralCode
        }),
      });

      if (response.ok) {
        setFormStatus('success');
        alert('Thank you! We will contact you shortly to discuss your automation needs.');
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
        alert('Something went wrong. Please try again or call us at (219) 207-7863');
      }
    } catch (error) {
      console.error('Error:', error);
      setFormStatus('error');
      alert('Something went wrong. Please try again or call us at (219) 207-7863');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-950 to-slate-900">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative bg-gradient-to-r from-slate-900/80 to-red-900/80 backdrop-blur-xl border-b border-white/10 z-[100]">
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
              <h1 className="text-xl md:text-3xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                Kinect B2B
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex gap-6 items-center">
              <a href="/" className="text-gray-300 hover:text-orange-400 transition">Home</a>
              <a href="/about" className="text-gray-300 hover:text-orange-400 transition">About</a>
              
              <div className="relative">
                <button 
                  onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  className="text-white hover:text-orange-400 transition font-bold flex items-center gap-1 py-2 px-2"
                >
                  Our Services
                  <span className="text-sm">{servicesDropdownOpen ? '▲' : '▼'}</span>
                </button>
                {servicesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-xl border border-orange-500/30 rounded-xl shadow-2xl z-[200]">
                    <a href="/plans" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-orange-500/20 transition rounded-t-xl">Plans</a>
                    <a href="/services/websites" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-orange-500/20 transition">Websites</a>
                    <a href="/services/automations" className="block px-4 py-3 text-white hover:text-orange-400 hover:bg-orange-500/20 transition font-bold">Automations</a>
                    <a href="/services/portals" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-orange-500/20 transition rounded-b-xl">Portals</a>
                  </div>
                )}
              </div>

              <a href="/affiliate" className="text-gray-300 hover:text-orange-400 transition">Affiliate Program</a>
              <a href="/portal" className="text-gray-300 hover:text-orange-400 transition">Client Login</a>
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
              <a href="/" className="block px-4 py-3 text-gray-300 hover:bg-orange-500/20 rounded-lg transition">Home</a>
              <a href="/about" className="block px-4 py-3 text-gray-300 hover:bg-orange-500/20 rounded-lg transition">About</a>
              
              <div>
                <button 
                  onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  className="w-full text-left px-4 py-3 text-white hover:bg-orange-500/20 rounded-lg transition font-bold flex items-center justify-between"
                >
                  Our Services
                  <span className="text-sm">{servicesDropdownOpen ? '▲' : '▼'}</span>
                </button>
                {servicesDropdownOpen && (
                  <div className="ml-4 mt-2 space-y-2">
                    <a href="/plans" className="block px-4 py-2 text-gray-300 hover:bg-orange-500/20 rounded-lg transition text-sm">Plans</a>
                    <a href="/services/websites" className="block px-4 py-2 text-gray-300 hover:bg-orange-500/20 rounded-lg transition text-sm">Websites</a>
                    <a href="/services/automations" className="block px-4 py-2 text-white hover:bg-orange-500/20 rounded-lg transition text-sm font-bold">Automations</a>
                    <a href="/services/portals" className="block px-4 py-2 text-gray-300 hover:bg-orange-500/20 rounded-lg transition text-sm">Portals</a>
                  </div>
                )}
              </div>

              <a href="/affiliate" className="block px-4 py-3 text-gray-300 hover:bg-orange-500/20 rounded-lg transition">Affiliate Program</a>
              <a href="/portal" className="block px-4 py-3 text-gray-300 hover:bg-orange-500/20 rounded-lg transition">Client Login</a>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 md:py-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-black mb-6 md:mb-8">
            <span className="text-white">Automate Your Business.</span>
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent">
              Work Smarter, Not Harder.
            </span>
          </h1>

          <p className="text-lg md:text-2xl lg:text-3xl text-gray-300 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed">
            Save time, reduce errors, and scale faster with custom automation workflows designed for your business.
          </p>

          <button
            onClick={() => setShowContactForm(true)}
            className="w-full sm:w-auto px-6 md:px-12 py-4 md:py-6 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-full text-white font-black text-base md:text-2xl transition-all duration-300 shadow-2xl hover:shadow-orange-500/50 hover:scale-105"
          >
            Get Your Free Automation Audit 🚀
          </button>
        </div>
      </section>

      {/* Automation Types Grid */}
      <section className="relative py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-center mb-12 md:mb-20">
            <span className="text-white">What We </span>
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Automate</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {automationTypes.map((type, idx) => (
              <div key={idx} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-orange-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 hover:border-orange-500/50 transition-all duration-300 text-center">
                  <div className="text-5xl md:text-6xl mb-4 md:mb-6">{type.icon}</div>
                  <h3 className="text-lg md:text-xl font-black text-white mb-2 md:mb-3">{type.name}</h3>
                  <p className="text-sm md:text-base text-gray-400">{type.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* One-Time Packages */}
      <section className="relative py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-center mb-12 md:mb-20">
            <span className="text-white">One-Time </span>
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Build Packages</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {packages.map((pkg, idx) => (
              <div key={idx} className="group relative">
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 md:px-6 py-1 md:py-2 rounded-full text-xs md:text-sm font-black">
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
                      <div className="text-4xl md:text-5xl font-black text-white">
                        ${pkg.price.toLocaleString()}<span className="text-base md:text-lg text-gray-400">/one-time</span>
                      </div>
                    </div>

                    <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 flex-1">
                      {pkg.features.map((feature, fidx) => (
                        <div key={fidx} className="flex items-center gap-3 text-gray-300">
                          <span className="text-orange-400 text-lg md:text-xl">✓</span>
                          <span className="text-sm md:text-base">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-red-950/50 border border-red-500/20 rounded-xl p-3 md:p-4 mb-6 md:mb-8">
                      <p className="text-orange-400 font-bold text-xs md:text-sm mb-2">Example Use Cases:</p>
                      <p className="text-gray-300 text-xs md:text-sm">{pkg.examples}</p>
                    </div>

                    <button
                      onClick={() => handleLearnMore(pkg)}
                      className="w-full py-3 md:py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-xl text-white font-black text-base md:text-lg transition-all duration-300 hover:scale-105"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Monthly Maintenance Plans */}
      <section className="relative py-12 md:py-20 bg-gradient-to-r from-red-950/50 to-orange-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-center mb-6 md:mb-8">
            <span className="text-white">Ongoing </span>
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Maintenance Plans</span>
          </h2>
          <p className="text-center text-gray-300 text-base md:text-xl mb-12 md:mb-16 max-w-3xl mx-auto">
            Keep your automations running smoothly with monthly updates, optimization, and support.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {monthlyPlans.map((plan, idx) => (
              <div key={idx} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 rounded-3xl"></div>
                
                <div className={`relative bg-gradient-to-br ${plan.color} p-1 rounded-3xl`}>
                  <div className="bg-slate-900 rounded-3xl p-6 md:p-8">
                    <div className="text-center mb-6 md:mb-8">
                      <h3 className="text-2xl md:text-3xl font-black text-white mb-2 md:mb-3">{plan.name}</h3>
                      <div className="text-3xl md:text-4xl font-black text-white">
                        ${plan.price}<span className="text-base md:text-lg text-gray-400">/mo</span>
                      </div>
                      <p className="text-orange-400 font-bold mt-2 md:mt-3 text-sm md:text-base">{plan.workflows}</p>
                    </div>

                    <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                      {plan.features.map((feature, fidx) => (
                        <div key={fidx} className="flex items-center gap-3 text-gray-300">
                          <span className="text-orange-400 text-lg md:text-xl">✓</span>
                          <span className="text-sm md:text-base">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedPackage(plan);
                        setFormData({ ...formData, selected_plan: plan.name });
                        setShowContactForm(true);
                      }}
                      className="w-full py-3 md:py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-xl text-white font-black text-base md:text-lg transition-all duration-300 hover:scale-105"
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
      <section className="relative py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-center mb-12 md:mb-20">
            <span className="text-white">How It </span>
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Works</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { step: '1', title: 'Discovery Call', desc: 'We learn about your workflows and pain points' },
              { step: '2', title: 'Strategy Session', desc: 'We identify automation opportunities' },
              { step: '3', title: 'Build & Test', desc: 'We create and thoroughly test your automations' },
              { step: '4', title: 'Launch & Support', desc: 'We deploy and provide ongoing optimization' },
            ].map((item, idx) => (
              <div key={idx} className="group relative text-center">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
                
                <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-red-500/20 p-6 md:p-8 rounded-2xl hover:border-red-500/50 transition duration-300">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-black mx-auto mb-4">
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
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-2xl border border-red-500/30 p-6 md:p-12 rounded-3xl text-center">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 md:mb-6">
                Ready to <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Automate</span> Your Business?
              </h2>
              <p className="text-base md:text-xl text-gray-300 mb-6 md:mb-8">
                Stop wasting time on repetitive tasks. Let's build custom automations that work for you 24/7.
              </p>
              <button
                onClick={() => setShowContactForm(true)}
                className="group relative inline-block"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
                <div className="relative px-8 md:px-12 py-4 md:py-6 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl text-white font-black text-lg md:text-2xl hover:scale-110 transition-all duration-300">
                  Schedule Discovery Call →
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
            <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              KINECT B2B
            </div>
          </div>
          <p className="text-gray-500 text-sm md:text-base">© 2018 Kinect B2B. All rights reserved.</p>
        </div>
      </footer>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative max-w-2xl w-full my-8">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-600 rounded-3xl blur-xl opacity-75"></div>
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-red-500/50 rounded-3xl p-6 md:p-10 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => {
                  setShowContactForm(false);
                  setSelectedPackage(null);
                }}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-white hover:bg-white/20 rounded-full p-2 transition"
              >
                ✕
              </button>

              <h3 className="text-2xl md:text-4xl font-black text-white mb-6 text-center">
                {selectedPackage ? `Learn More: ${selectedPackage.name}` : 'Get Started with'} <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Automations</span>
              </h3>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Business Name *"
                    required
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 transition text-sm md:text-base"
                  />
                  <input
                    type="text"
                    placeholder="Your Name *"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 transition text-sm md:text-base"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 transition text-sm md:text-base"
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 transition text-sm md:text-base"
                  />
                  <input
                    type="text"
                    placeholder="City *"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 transition text-sm md:text-base"
                  />
                  <input
                    type="text"
                    placeholder="State *"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 transition text-sm md:text-base"
                  />
                </div>
                
                <input
                  type="text"
                  placeholder="Industry *"
                  required
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 transition text-sm md:text-base"
                />

                <textarea
                  placeholder="What workflows do you want to automate?"
                  rows={4}
                  value={formData.questions}
                  onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
                  className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 transition resize-none text-sm md:text-base"
                />

                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full py-4 md:py-5 bg-gradient-to-r from-red-600 to-orange-600 hover:scale-105 transition duration-300 rounded-xl text-white font-black text-lg md:text-xl shadow-lg disabled:opacity-50"
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
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}