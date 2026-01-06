'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Plans() {
  const [showForm, setShowForm] = useState(false);
  const [selectedTier, setSelectedTier] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    name: '',
    phone: '',
    email: '',
    industry: '',
    budget: '',
    annualRevenue: ''
  });

  // Chatbot States
  const [chatOpen, setChatOpen] = useState(false);
  const [chatStep, setChatStep] = useState('greeting');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatFormData, setChatFormData] = useState({
    name: '',
    business_name: '',
    industry: '',
    marketing_budget: '',
    timeline: '',
    zip_code: '',
    email: '',
    phone: ''
  });

  // Auto-open chatbot after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setChatOpen(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Handle chatbot form submission
  const handleChatFormSubmit = async () => {
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
          industry: chatFormData.industry,
          budget: chatFormData.marketing_budget,
          timeline: chatFormData.timeline,
          zip_code: chatFormData.zip_code,
          service_type: 'Appointment Setting',
          lead_source: 'Chatbot - Robert - Plans Page'
        }),
      });

      if (response.ok) {
        setChatStep('success');
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

  // Loading animation helper (for zip code check)
  const showLoadingThenNext = (nextStep, delay = 3500) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setChatStep(nextStep);
    }, delay);
  };

  // Validate zip code (5 digits)
  const isValidZipCode = (zip) => /^\d{5}$/.test(zip);

  const tiers = [
    {
      name: 'Starter',
      priceRange: '$2,000 - $3,000',
      priceNote: '/month',
      appointments: '8-12 appointments/month',
      bestFor: 'Solo operators and small teams starting to scale',
      description: 'Launch your growth engine with guaranteed qualified appointments',
      trim: '#CD7F32',
      glowColor: 'rgba(205, 127, 50, 0.4)',
      gradientFrom: 'from-amber-600',
      gradientTo: 'to-orange-700',
      stars: 2,
      benefits: [
        'Guaranteed Qualified Appointments',
        'Dedicated Account Manager',
        'Client Portal Access',
        'Weekly Performance Reports',
        'Territory-Specific Targeting',
        'Email Support'
      ]
    },
    {
      name: 'Growth',
      priceRange: '$4,000 - $6,000',
      priceNote: '/month',
      appointments: '15-25 appointments/month',
      bestFor: 'Growing businesses ready to scale aggressively',
      description: 'Accelerate your pipeline with expanded outreach and strategy',
      trim: '#C0C0C0',
      glowColor: 'rgba(192, 192, 192, 0.4)',
      gradientFrom: 'from-gray-400',
      gradientTo: 'to-slate-500',
      stars: 3,
      popular: true,
      benefits: [
        'Everything in Starter',
        'Multi-Channel Outreach',
        'Monthly Strategy Calls',
        'Lead List Included',
        '10% off Website & Automations',
        'Priority Support'
      ]
    },
    {
      name: 'Scale',
      priceRange: '$7,000 - $10,000',
      priceNote: '/month',
      appointments: '30-50 appointments/month',
      bestFor: 'Established companies with aggressive growth goals',
      description: 'Dominate your market with white glove service',
      trim: '#FFD700',
      glowColor: 'rgba(255, 215, 0, 0.4)',
      gradientFrom: 'from-yellow-400',
      gradientTo: 'to-amber-600',
      stars: 4,
      benefits: [
        'Everything in Growth',
        'Dedicated Team of Reps',
        'Bi-Weekly Strategy Calls',
        '15% off All Services',
        'White Glove Service',
        'Direct Founder Access'
      ]
    }
  ];

  const premiumTier = {
    name: 'Enterprise',
    priceRange: 'Custom',
    priceNote: 'pricing',
    appointments: '50+ appointments/month',
    bestFor: 'Large organizations with complex requirements',
    description: 'Enterprise-level partnership for maximum growth. Custom solutions, dedicated teams, and comprehensive support.',
    trim: '#B9F2FF',
    glowColor: 'rgba(185, 242, 255, 0.5)',
    stars: 5,
    benefits: [
      'Everything in Scale',
      'Custom Appointment Volume',
      'Multiple Account Managers',
      '25% off All Services',
      'Quarterly Business Reviews',
      'Custom Integrations'
    ]
  };

  const budgetOptions = [
    'Under $1,500',
    '$1,500 - $3,000',
    '$3,000 - $7,500',
    '$7,500 - $15,000',
    '$15,000 - $25,000',
    '$30,000+'
  ];

  const renderStars = (count, color) => {
    return (
      <div className="flex gap-1 justify-center">
        {[...Array(count)].map((_, i) => (
          <span key={i} style={{ color, textShadow: `0 0 10px ${color}, 0 0 20px ${color}` }} className="text-2xl">★</span>
        ))}
      </div>
    );
  };

  const handleOpenForm = (tierName) => {
    setSelectedTier(tierName);
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'plans_page',
          business_name: formData.businessName,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          industry: formData.industry,
          budget: formData.budget,
          selected_plan: selectedTier,
          status: 'new'
        })
      });
      if (response.ok) {
        setShowSuccess(true);
        setShowForm(false);
        setFormData({ businessName: '', name: '', phone: '', email: '', industry: '', budget: '' });
        setTimeout(() => setShowSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative bg-gradient-to-r from-slate-900/80 to-blue-900/80 backdrop-blur-xl border-b border-white/10 z-[100]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <Image src="/my-logo.png" alt="Kinect B2B Logo" width={40} height={40} className="w-8 h-8 md:w-10 md:h-10" />
              <h1 className="text-xl md:text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Kinect B2B</h1>
            </a>
            <nav className="hidden lg:flex gap-6 items-center">
              <a href="/" className="text-gray-300 hover:text-cyan-400 transition font-bold">Home</a>
              <a href="/about" className="text-gray-300 hover:text-cyan-400 transition">About</a>
              <div className="relative">
                <button onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)} className="text-white hover:text-cyan-400 transition font-bold flex items-center gap-1 py-2 px-2">
                  Our Services <span className="text-sm">{servicesDropdownOpen ? '▲' : '▼'}</span>
                </button>
                {servicesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl shadow-2xl z-[200]">
                    <a href="/plans" className="block px-4 py-3 text-white hover:bg-cyan-500/20 transition rounded-t-xl font-bold">Plans</a>
                    <a href="/services/websites" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-cyan-500/20 transition">Websites</a>
                    <a href="/services/automations" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-cyan-500/20 transition">Automations</a>
                    <a href="/services/portals" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-cyan-500/20 transition rounded-b-xl">Portals</a>
                  </div>
                )}
              </div>
              <a href="/affiliate" className="text-gray-300 hover:text-cyan-400 transition">Affiliate Program</a>
              <a href="/portal" className="text-gray-300 hover:text-cyan-400 transition">Client Login</a>
            </nav>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 space-y-2 animate-fadeIn">
              <a href="/" className="block px-4 py-3 text-gray-300 hover:bg-cyan-500/20 rounded-lg transition font-bold">Home</a>
              <a href="/about" className="block px-4 py-3 text-gray-300 hover:bg-cyan-500/20 rounded-lg transition">About</a>
              <div>
                <button onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)} className="w-full text-left px-4 py-3 text-white hover:bg-cyan-500/20 rounded-lg transition font-bold flex items-center justify-between">
                  Our Services <span className="text-sm">{servicesDropdownOpen ? '▲' : '▼'}</span>
                </button>
                {servicesDropdownOpen && (
                  <div className="ml-4 mt-2 space-y-2">
                    <a href="/plans" className="block px-4 py-2 text-white hover:bg-cyan-500/20 rounded-lg transition text-sm font-bold">Plans</a>
                    <a href="/services/websites" className="block px-4 py-2 text-gray-300 hover:bg-cyan-500/20 rounded-lg transition text-sm">Websites</a>
                    <a href="/services/automations" className="block px-4 py-2 text-gray-300 hover:bg-cyan-500/20 rounded-lg transition text-sm">Automations</a>
                    <a href="/services/portals" className="block px-4 py-2 text-gray-300 hover:bg-cyan-500/20 rounded-lg transition text-sm">Portals</a>
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
      <section className="relative py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-white">
            Plans That <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Scale With You</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">Whether you're just getting started or running a multi-million dollar operation, we grow with you every step of the way.</p>
        </div>
      </section>

      {/* Premium Tier - Landscape Featured Card */}
      <section className="relative py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-50 animate-pulse"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-3xl blur-lg opacity-40"></div>
            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 border-2" style={{ borderColor: premiumTier.trim }}>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur-md opacity-75"></div>
                  <div className="relative bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 text-slate-900 text-sm font-black px-6 py-2 rounded-full flex items-center gap-2">
                    ENTERPRISE PARTNER
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-8 mt-4">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    {renderStars(premiumTier.stars, premiumTier.trim)}
                    <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ backgroundColor: `${premiumTier.trim}20`, color: premiumTier.trim }}>{premiumTier.appointments}</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-2">{premiumTier.name}</h2>
                  <div className="text-2xl font-bold text-cyan-400 mb-2">{premiumTier.priceRange} {premiumTier.priceNote}</div>
                  <p className="text-gray-300 text-base mb-4">{premiumTier.description}</p>
                  <p className="text-cyan-400 text-sm mb-6">Best for: {premiumTier.bestFor}</p>
                  <button onClick={() => handleOpenForm(premiumTier.name)} className="px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white font-black text-lg rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg shadow-cyan-500/25">Contact Us</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {premiumTier.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span style={{ color: premiumTier.trim }} className="mt-0.5 text-lg">✓</span>
                      <span className="text-gray-300 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <span className="text-gray-500 text-sm font-bold">CHOOSE YOUR STARTING POINT</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
      </div>

      {/* Three Tier Cards - All Premium Looking */}
      <section className="relative py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <div key={tier.name} className="relative group">
                {/* Glow Effect for ALL cards */}
                <div 
                  className="absolute -inset-2 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle, ${tier.glowColor} 0%, transparent 70%)` }}
                ></div>
                
                {tier.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full blur-md opacity-75"></div>
                      <span className="relative bg-gradient-to-r from-gray-200 to-gray-400 text-slate-900 text-xs font-black px-5 py-2 rounded-full flex items-center gap-1">
                        MOST POPULAR
                      </span>
                    </div>
                  </div>
                )}
                
                <div 
                  className="relative h-full bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border-2 hover:scale-105 transition-all duration-500 shadow-2xl"
                  style={{ borderColor: tier.trim }}
                >
                  {/* Stars */}
                  <div className="mb-4">
                    {renderStars(tier.stars, tier.trim)}
                  </div>
                  
                  {/* Tier Name */}
                  <h3 
                    className="text-3xl font-black text-center mb-2"
                    style={{ 
                      background: `linear-gradient(180deg, ${tier.trim} 0%, ${tier.trim}cc 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: `drop-shadow(0 0 10px ${tier.glowColor})`
                    }}
                  >
                    {tier.name}
                  </h3>
                  
                  {/* Pricing */}
                  <div className="text-center mb-4">
                    <div className="text-3xl md:text-4xl font-black text-white mb-1">
                      {tier.priceRange}
                      <span className="text-lg text-gray-400 font-normal">{tier.priceNote}</span>
                    </div>
                    <div
                      className="text-sm font-bold"
                      style={{ color: tier.trim }}
                    >
                      {tier.appointments}
                    </div>
                  </div>

                  <p className="text-gray-400 text-center text-sm mb-2">{tier.description}</p>
                  <p className="text-cyan-400 text-center text-xs mb-6">Best for: {tier.bestFor}</p>
                  
                  {/* Benefits */}
                  <ul className="space-y-3 mb-8">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span 
                          style={{ color: tier.trim, textShadow: `0 0 8px ${tier.trim}` }} 
                          className="text-lg font-bold"
                        >✓</span>
                        <span className="text-gray-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* CTA Button */}
                  <button
                    onClick={() => handleOpenForm(tier.name)}
                    className={`w-full py-4 font-black text-lg rounded-xl transition-all duration-300 hover:shadow-xl bg-gradient-to-r ${tier.gradientFrom} ${tier.gradientTo} text-slate-900 hover:scale-105`}
                    style={{ boxShadow: `0 10px 40px ${tier.glowColor}` }}
                  >
                    Get Started →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Growth Journey Section */}
      <section className="relative py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 via-gray-400/20 via-yellow-500/20 to-cyan-500/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-white/10 rounded-3xl p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Your Growth Journey</h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">Start where you are today. As your business grows, we'll be right there with you — scaling your outreach, expanding your team, and increasing your results.</p>
              <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
                {[...tiers, premiumTier].map((tier, index) => (
                  <div key={tier.name} className="flex items-center">
                    <div 
                      className="text-sm font-bold px-5 py-3 rounded-full border-2 transition-all hover:scale-110"
                      style={{ 
                        borderColor: tier.trim, 
                        color: tier.trim,
                        boxShadow: `0 0 20px ${tier.glowColor}`,
                        backgroundColor: `${tier.trim}10`
                      }}
                    >
                      {tier.name}
                    </div>
                    {index < 3 && <span className="text-gray-500 mx-2 hidden md:block text-xl">→</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur border border-blue-500/30 p-8 md:p-12 rounded-3xl text-center">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Not Sure Where You Fit?</h2>
              <p className="text-gray-400 text-lg mb-8">Let's talk. We'll help you find the perfect plan for your business.</p>
              <button onClick={() => handleOpenForm('')} className="inline-block px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white font-black text-xl rounded-2xl hover:scale-105 transition-transform duration-300 shadow-lg shadow-purple-500/25">Book a Free Consultation</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-black/50 backdrop-blur-xl py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image src="/my-logo.png" alt="Kinect B2B Logo" width={32} height={32} className="w-8 h-8" />
            <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">KINECT B2B</div>
          </div>
          <p className="text-gray-500 text-sm md:text-base">© 2025 Kinect B2B. All rights reserved.</p>
        </div>
      </footer>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-white/20 rounded-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl transition">×</button>
            <h3 className="text-2xl font-black text-white mb-2">Book a Call</h3>
            {selectedTier && <p className="text-gray-400 mb-6">Interested in: <span className="text-cyan-400 font-bold">{selectedTier}</span></p>}
            {!selectedTier && <p className="text-gray-400 mb-6">Tell us about your business</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Business Name</label>
                <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition" placeholder="Your Company LLC" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Your Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition" placeholder="John Smith" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition" placeholder="(555) 123-4567" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition" placeholder="john@company.com" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Industry</label>
                <input type="text" name="industry" value={formData.industry} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition" placeholder="Commercial Cleaning, HVAC, etc." />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Marketing Budget</label>
                <select name="budget" value={formData.budget} onChange={handleInputChange} required className="w-full px-4 py-3 bg-slate-700/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition">
                  <option value="">Select your budget</option>
                  {budgetOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white font-black text-lg rounded-xl hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-cyan-500/25">{isSubmitting ? 'Submitting...' : 'Submit Request'}</button>
            </form>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl animate-fadeIn">
          <p className="font-bold">🎉 Request Submitted!</p>
          <p className="text-sm">We'll be in touch soon.</p>
        </div>
      )}

      {/* Robert Chatbot */}
      {chatOpen && (
        <div className="fixed inset-0 md:inset-auto md:bottom-8 md:right-8 z-50 md:w-[420px]">
          <div 
            className="hidden md:block fixed inset-0 bg-transparent"
            onClick={() => setChatOpen(false)}
          ></div>

          <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-xl opacity-75"></div>
          
          <div className="relative h-full md:h-auto bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-purple-500/50 rounded-3xl shadow-2xl flex flex-col max-h-screen md:max-h-[650px]">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-xl md:text-2xl">
                  🤖
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-black text-white">Robert (AI)</h3>
                  <p className="text-xs md:text-sm text-purple-400">● Online</p>
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
                <div className="bg-purple-600/20 border border-purple-500/30 rounded-2xl p-4 mb-4 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-white text-sm">Robert is typing...</span>
                  </div>
                </div>
              )}

              {/* Loading Animation (for zip check) */}
              {isLoading && (
                <div className="bg-purple-600/20 border border-purple-500/30 rounded-2xl p-4 mb-4 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-white text-sm">One moment...</span>
                  </div>
                </div>
              )}

              {/* Step 1: Greeting */}
              {chatStep === 'greeting' && !isTyping && (
                <div className="animate-fadeIn space-y-4">
                  <div className="bg-purple-600/20 border border-purple-500/30 rounded-2xl p-4 md:p-6">
                    <h3 className="text-xl md:text-2xl font-black text-white mb-3 md:mb-4">
                      👋 Hey there! I'm Robert!
                    </h3>
                    <p className="text-sm md:text-base text-gray-300 mb-4">
                      Are you looking to get connected with more clients and grow your business?
                    </p>
                  </div>

                  <button
                    onClick={() => showTypingThenNext('askName')}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition duration-300 rounded-2xl p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl md:text-3xl">✅</span>
                      <div>
                        <div className="font-black text-white text-sm md:text-base">Yes, Let's Do It!</div>
                        <div className="text-xs md:text-sm text-gray-300">I want more qualified leads</div>
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {/* Step 2: Ask Name */}
              {chatStep === 'askName' && !isTyping && (
                <div className="animate-fadeIn space-y-4">
                  <div className="bg-purple-600/20 border border-purple-500/30 rounded-2xl p-4">
                    <p className="text-white font-bold text-sm md:text-base">Great! For starters, what is your name?</p>
                  </div>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={chatFormData.name}
                    onChange={(e) => setChatFormData({ ...chatFormData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition text-sm md:text-base"
                  />
                  <button
                    onClick={() => showTypingThenNext('askBusiness')}
                    disabled={!chatFormData.name}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition duration-300 rounded-xl text-white font-bold text-sm md:text-base disabled:opacity-50"
                  >
                    Continue →
                  </button>
                </div>
              )}

              {/* Step 3: Ask Business & Industry */}
              {chatStep === 'askBusiness' && !isTyping && (
                <div className="animate-fadeIn space-y-4">
                  <div className="bg-purple-600/20 border border-purple-500/30 rounded-2xl p-4">
                    <p className="text-white font-bold text-sm md:text-base">Great, got it! What is the name of your business and what industry is it?</p>
                  </div>
                  <input
                    type="text"
                    placeholder="Business name"
                    value={chatFormData.business_name}
                    onChange={(e) => setChatFormData({ ...chatFormData, business_name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition text-sm md:text-base"
                  />
                  <input
                    type="text"
                    placeholder="Industry (e.g., Cleaning, HVAC, Landscaping)"
                    value={chatFormData.industry}
                    onChange={(e) => setChatFormData({ ...chatFormData, industry: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition text-sm md:text-base"
                  />
                  <button
                    onClick={() => showTypingThenNext('askBudgetTimeline')}
                    disabled={!chatFormData.business_name || !chatFormData.industry}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition duration-300 rounded-xl text-white font-bold text-sm md:text-base disabled:opacity-50"
                  >
                    Continue →
                  </button>
                </div>
              )}

              {/* Step 4: Ask Budget & Timeline */}
              {chatStep === 'askBudgetTimeline' && !isTyping && (
                <div className="animate-fadeIn space-y-4">
                  <div className="bg-purple-600/20 border border-purple-500/30 rounded-2xl p-4">
                    <p className="text-white font-bold text-sm md:text-base">Excellent, got it! Next question - what is your marketing budget and how soon are you looking to grow your business?</p>
                  </div>
                  <select
                    value={chatFormData.marketing_budget}
                    onChange={(e) => setChatFormData({ ...chatFormData, marketing_budget: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400 transition text-sm md:text-base"
                  >
                    <option value="" className="bg-slate-800">Select marketing budget</option>
                    <option value="Under $1,500" className="bg-slate-800">Under $1,500</option>
                    <option value="$1,500 - $3,000" className="bg-slate-800">$1,500 - $3,000</option>
                    <option value="$3,000 - $7,500" className="bg-slate-800">$3,000 - $7,500</option>
                    <option value="$7,500 - $15,000" className="bg-slate-800">$7,500 - $15,000</option>
                    <option value="$15,000 - $25,000" className="bg-slate-800">$15,000 - $25,000</option>
                    <option value="$30,000+" className="bg-slate-800">$30,000+</option>
                  </select>
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">How soon do you want to grow?</p>
                    <button
                      onClick={() => { setChatFormData({ ...chatFormData, timeline: "I'm ready to grow!" }); showTypingThenNext('askZipCode'); }}
                      disabled={!chatFormData.marketing_budget}
                      className={`w-full py-3 rounded-xl font-bold text-sm md:text-base transition ${chatFormData.timeline === "I'm ready to grow!" ? 'bg-purple-600 text-white' : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'} disabled:opacity-50`}
                    >
                      I'm ready to grow
                    </button>
                    <button
                      onClick={() => { setChatFormData({ ...chatFormData, timeline: 'Within 3 months' }); showTypingThenNext('askZipCode'); }}
                      disabled={!chatFormData.marketing_budget}
                      className={`w-full py-3 rounded-xl font-bold text-sm md:text-base transition ${chatFormData.timeline === 'Within 3 months' ? 'bg-purple-600 text-white' : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'} disabled:opacity-50`}
                    >
                      📅 Within 3 months
                    </button>
                    <button
                      onClick={() => { setChatFormData({ ...chatFormData, timeline: 'I have questions' }); showTypingThenNext('askZipCode'); }}
                      disabled={!chatFormData.marketing_budget}
                      className={`w-full py-3 rounded-xl font-bold text-sm md:text-base transition ${chatFormData.timeline === 'I have questions' ? 'bg-purple-600 text-white' : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'} disabled:opacity-50`}
                    >
                      ❓ I have questions
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Ask Zip Code */}
              {chatStep === 'askZipCode' && !isTyping && (
                <div className="animate-fadeIn space-y-4">
                  <div className="bg-purple-600/20 border border-purple-500/30 rounded-2xl p-4">
                    <p className="text-white font-bold text-sm md:text-base">Excellent, got it! Let's see if our services are available in your area. What is your zip code?</p>
                  </div>
                  <input
                    type="text"
                    placeholder="5-digit zip code"
                    maxLength={5}
                    value={chatFormData.zip_code}
                    onChange={(e) => setChatFormData({ ...chatFormData, zip_code: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition text-sm md:text-base"
                  />
                  <button
                    onClick={() => showLoadingThenNext('zipConfirmed')}
                    disabled={!isValidZipCode(chatFormData.zip_code)}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition duration-300 rounded-xl text-white font-bold text-sm md:text-base disabled:opacity-50"
                  >
                    Check Availability →
                  </button>
                </div>
              )}

              {/* Step 6: Zip Confirmed - Ask Contact */}
              {chatStep === 'zipConfirmed' && !isTyping && !isLoading && (
                <div className="animate-fadeIn space-y-4">
                  <div className="bg-green-600/20 border border-green-500/30 rounded-2xl p-4">
                    <p className="text-white font-bold text-sm md:text-base">✅ Great! We can service your area.</p>
                  </div>
                  <div className="bg-purple-600/20 border border-purple-500/30 rounded-2xl p-4">
                    <p className="text-white font-bold text-sm md:text-base">I can prepare an example list of leads in your area. What is your email address and phone number?</p>
                  </div>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={chatFormData.email}
                    onChange={(e) => setChatFormData({ ...chatFormData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition text-sm md:text-base"
                  />
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={chatFormData.phone}
                    onChange={(e) => setChatFormData({ ...chatFormData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition text-sm md:text-base"
                  />
                  <button
                    onClick={handleChatFormSubmit}
                    disabled={!chatFormData.email || !chatFormData.phone}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition duration-300 rounded-xl text-white font-bold text-sm md:text-base disabled:opacity-50"
                  >
                    Submit →
                  </button>
                </div>
              )}

              {/* Step 7: Success */}
              {chatStep === 'success' && (
                <div className="animate-fadeIn space-y-4">
                  <div className="bg-green-600/20 border border-green-500/30 rounded-2xl p-4 md:p-6">
                    <p className="text-white font-bold text-sm md:text-base mb-4">Excellent! Someone from our team will be in touch shortly!</p>
                    <p className="text-gray-300 text-sm">In the meantime if you have any questions please reach out to us at:</p>
                    <div className="mt-3 space-y-2 text-purple-400 text-sm">
                      <div><a href="tel:2192707863" className="font-bold hover:text-purple-300">(219) 270-7863</a></div>
                      <div><a href="mailto:accounts@kinectb2b.com" className="font-bold hover:text-purple-300">accounts@kinectb2b.com</a></div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setChatStep('greeting');
                      setChatFormData({ name: '', business_name: '', industry: '', marketing_budget: '', timeline: '', zip_code: '', email: '', phone: '' });
                    }}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-bold hover:scale-105 transition text-sm md:text-base"
                  >
                    Start Over
                  </button>
                </div>
              )}
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
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-75 group-hover:opacity-100 animate-pulse"></div>
          <div className="relative w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-2xl md:text-3xl hover:scale-110 transition duration-300 shadow-2xl">
            💬
          </div>
        </button>
      )}

      <style jsx>{`
        @keyframes blob { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
      `}</style>
    </div>
  );
}