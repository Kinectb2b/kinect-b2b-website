'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  // Add custom animations via inline styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideUp {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      @keyframes gentleBounce {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }
      .animate-slideUp {
        animation: slideUp 0.5s ease-out;
      }
      .animate-gentleBounce {
        animation: gentleBounce 2s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [chatStep, setChatStep] = useState('initial');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGrowthCallForm, setShowGrowthCallForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [growthCallForm, setGrowthCallForm] = useState({
    businessName: '',
    name: '',
    phone: '',
    email: '',
    painPoint: ''
  });
  const [formData, setFormData] = useState({
    businessName: '',
    name: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    industry: '',
    selectedService: '',
    budget: '',
    timeline: '',
    painPoint: ''
  });
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  // Auto-open chatbot preview after 10 seconds with gentle introduction
  useEffect(() => {
    const timer = setTimeout(() => {
      setChatOpen(true);
    }, 10000); // Changed from 3 to 10 seconds
    return () => clearTimeout(timer);
  }, []);

  const services = [
    { id: 'appointment', name: 'Appointment Setting', icon: '📅', color: 'from-blue-500 to-cyan-500' },
    { id: 'websites', name: 'Website Building', icon: '🌐', color: 'from-purple-500 to-pink-500' },
    { id: 'automations', name: 'Automations', icon: '⚙️', color: 'from-orange-500 to-red-500' },
    { id: 'portals', name: 'Client Portals', icon: '👥', color: 'from-green-500 to-emerald-500' }
  ];

  const budgets = [
    { value: 'under-1k', label: 'Under $1,000/month' },
    { value: '1k-3k', label: '$1,000 - $3,000/month' },
    { value: '3k-5k', label: '$3,000 - $5,000/month' },
    { value: '5k-plus', label: '$5,000+/month' }
  ];

  const timelines = [
    { value: 'asap', label: 'ASAP (Within 1 week)' },
    { value: '1-month', label: 'Within 1 month' },
    { value: '1-3-months', label: '1-3 months' },
    { value: 'just-exploring', label: 'Just exploring' }
  ];

  const handleServiceSelect = (serviceId) => {
    setFormData({ ...formData, selectedService: serviceId });
    setChatStep('budget');
  };

  const handleBudgetSelect = (budget) => {
    setFormData({ ...formData, budget: budget });
    setChatStep('timeline');
  };

  const handleTimelineSelect = (timeline) => {
    setFormData({ ...formData, timeline: timeline });
    setChatStep('form');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setChatStep('success');
      } else {
        alert('Something went wrong. Please try again or call us directly.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Something went wrong. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const testimonials = [
    {
      name: "Michael Torres",
      company: "Torres HVAC Services",
      text: "KinectB2B has helped us not only with multiple automations but they built us an amazing affiliate portal that generates leads daily!!",
      rating: 5,
      initials: "MT"
    },
    {
      name: "Jennifer Wilson",
      company: "Wilson Roofing Co",
      text: "We have used Kinect for a while now and don't plan on leaving any time soon. The team is friendly and the results are actually there.",
      rating: 5,
      initials: "JW"
    },
    {
      name: "David Martinez",
      company: "Elite Plumbing Solutions",
      text: "The automations alone have saved us 20+ hours a week. On top of that, we have grown our recurring work by 115% in 8 months. So I'm a happy client!",
      rating: 5,
      initials: "DM"
    }
  ];
  
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
            {/* Logo */}
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
              <a href="/" className="text-white hover:text-cyan-400 transition font-bold">Home</a>
              <a href="/about" className="text-gray-300 hover:text-cyan-400 transition">About</a>
              
              {/* Services Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  className="text-gray-300 hover:text-cyan-400 transition font-bold flex items-center gap-1 py-2 px-2"
                >
                  Our Services
                  <span className="text-sm">{servicesDropdownOpen ? '▲' : '▼'}</span>
                </button>
                {servicesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl shadow-2xl z-[200]">
                    <a href="/plans" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-cyan-500/20 transition rounded-t-xl">Plans</a>
                    <a href="/services/websites" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-cyan-500/20 transition">Websites</a>
                    <a href="/services/automations" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-cyan-500/20 transition">Automations</a>
                    <a href="/services/portals" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-cyan-500/20 transition rounded-b-xl">Portals</a>
                  </div>
                )}
              </div>

              <a href="/affiliate" className="text-gray-300 hover:text-cyan-400 transition">Affiliate Program</a>
              <a href="/portal" className="text-gray-300 hover:text-cyan-400 transition">Client Login</a>
            </nav>

            {/* Mobile Hamburger Button */}
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
              <a href="/" className="block px-4 py-3 text-white hover:bg-cyan-500/20 rounded-lg transition font-bold">Home</a>
              <a href="/about" className="block px-4 py-3 text-gray-300 hover:bg-cyan-500/20 rounded-lg transition">About</a>
              
              {/* Mobile Services Submenu */}
              <div>
                <button 
                  onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  className="w-full text-left px-4 py-3 text-gray-300 hover:bg-cyan-500/20 rounded-lg transition font-bold flex items-center justify-between"
                >
                  Our Services
                  <span className="text-sm">{servicesDropdownOpen ? '▲' : '▼'}</span>
                </button>
                {servicesDropdownOpen && (
                  <div className="ml-4 mt-2 space-y-2">
                    <a href="/plans" className="block px-4 py-2 text-gray-300 hover:bg-cyan-500/20 rounded-lg transition text-sm">Plans</a>
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
      <section className="relative py-16 md:py-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-black mb-6 md:mb-8">
            <span className="text-white">Grow Your Business.</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              We Handle The Rest.
            </span>
          </h1>

          <p className="text-lg md:text-2xl lg:text-3xl text-gray-300 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed">
            From appointment setting to automations - we provide the tools and team to scale your business without the overhead.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setShowGrowthCallForm(true)}
              className="w-full sm:w-auto group relative px-8 md:px-12 py-4 md:py-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-full text-white font-black text-lg md:text-2xl transition-all duration-300 shadow-2xl hover:shadow-cyan-500/50 hover:scale-105"
            >
              <span className="relative z-10">Book a Free Growth Call 📞</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 blur-xl opacity-0 group-hover:opacity-75 transition-opacity"></div>
            </button>

            <a
              href="/plans"
              className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 border-2 border-cyan-500 hover:bg-cyan-500/10 rounded-full text-cyan-400 font-black text-lg md:text-2xl transition-all duration-300 hover:scale-105"
            >
              View Our Plans 📊
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-black text-center mb-12 md:mb-20">
            <span className="text-white">Our </span>
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Services</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {services.map((service, index) => (
              <a
                key={service.id}
                href={service.id === 'appointment' ? '/plans' : `/services/${service.id}`}
                className="group relative overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                <div className={`relative h-full bg-gradient-to-br ${service.color} p-1 rounded-3xl hover:scale-105 transition-all duration-300`}>
                  <div className="h-full bg-slate-900 rounded-3xl p-6 md:p-8 flex flex-col items-center text-center">
                    <div className="text-5xl md:text-6xl mb-4 md:mb-6 transform group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-white mb-3 md:mb-4">{service.name}</h3>
                    <p className="text-sm md:text-base text-gray-400 group-hover:text-gray-300 transition">
                      {service.id === 'appointment' && 'Fill your calendar with qualified leads'}
                      {service.id === 'websites' && 'Modern, conversion-focused websites'}
                      {service.id === 'automations' && 'Save time with smart workflows'}
                      {service.id === 'portals' && 'Streamline client communication'}
                    </p>
                    <div className="mt-auto pt-4 md:pt-6">
                      <span className="text-cyan-400 font-bold group-hover:underline">Learn More →</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="relative py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-black text-center mb-12 md:mb-20">
            <span className="text-white">What Our </span>
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Clients Say</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-75 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 hover:border-cyan-500/50 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4 md:mb-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center text-white font-black text-lg md:text-xl">
                      {testimonial.initials}
                    </div>
                    <div>
                      <div className="font-black text-white text-base md:text-lg">{testimonial.name}</div>
                      <div className="text-xs md:text-sm text-gray-400">{testimonial.company}</div>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg md:text-xl">⭐</span>
                    ))}
                  </div>

                  <p className="text-sm md:text-base text-gray-300 leading-relaxed">"{testimonial.text}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500/50 rounded-3xl p-8 md:p-16 text-center">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6">
                <span className="text-white">Ready to </span>
                <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Scale?</span>
              </h2>

              <p className="text-lg md:text-2xl text-gray-300 mb-8 md:mb-12 max-w-3xl mx-auto">
                Join hundreds of businesses that trust Kinect B2B to handle their growth.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setShowGrowthCallForm(true)}
                  className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-full text-white font-black text-lg md:text-2xl transition-all duration-300 shadow-2xl hover:shadow-cyan-500/50 hover:scale-105"
                >
                  Get Started Today 🚀
                </button>

                <a
                  href="tel:219-207-7863"
                  className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 border-2 border-cyan-500 hover:bg-cyan-500/10 rounded-full text-cyan-400 font-black text-lg md:text-2xl transition-all duration-300 hover:scale-105"
                >
                  Call: 219-207-7863 📞
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot Window */}
      {chatOpen && (
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 animate-slideUp">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-xl opacity-75 animate-pulse"></div>
            
            {/* Chat Container */}
            <div className="relative w-[90vw] max-w-[420px] bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-500/50 rounded-3xl shadow-2xl flex flex-col max-h-[80vh] md:max-h-[600px]">
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-xl md:text-2xl">
                    🤖
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-black text-white">Kinect Assistant</h3>
                    <p className="text-xs md:text-sm text-green-400">● Online</p>
                  </div>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all hover:rotate-90"
                  title="Close chat"
                >
                  ✕
                </button>
              </div>

              {/* Chat Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                {chatStep === 'initial' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="bg-blue-600/20 border border-blue-500/30 rounded-2xl p-4 md:p-6">
                      <h3 className="text-xl md:text-2xl font-black text-white mb-3 md:mb-4">
                        👋 Welcome to Kinect B2B!
                      </h3>
                      <p className="text-sm md:text-base text-gray-300 mb-4">
                        Let's find the perfect solution for your business. Which service interests you most?
                      </p>
                    </div>

                    <div className="space-y-3">
                      {services.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => handleServiceSelect(service.id)}
                          className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-blue-600 hover:to-purple-600 border border-white/10 rounded-2xl p-4 text-left transition-all duration-300 hover:scale-105 group"
                        >
                          <div className="flex items-center gap-3 md:gap-4">
                            <span className="text-2xl md:text-3xl">{service.icon}</span>
                            <div className="flex-1">
                              <div className="font-black text-white text-sm md:text-base group-hover:text-cyan-300">{service.name}</div>
                              <div className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300">Click to learn more</div>
                            </div>
                            <span className="text-cyan-400 opacity-0 group-hover:opacity-100 transition">→</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {chatStep === 'budget' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="bg-blue-600/20 border border-blue-500/30 rounded-2xl p-4 md:p-6">
                      <h3 className="text-xl md:text-2xl font-black text-white mb-2 md:mb-3">Great choice! 🎯</h3>
                      <p className="text-sm md:text-base text-gray-300">What's your approximate monthly budget?</p>
                    </div>

                    <div className="space-y-3">
                      {budgets.map((budget) => (
                        <button
                          key={budget.value}
                          onClick={() => handleBudgetSelect(budget.value)}
                          className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-green-600 hover:to-emerald-600 border border-white/10 rounded-2xl p-4 text-left transition-all duration-300 hover:scale-105 group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-sm md:text-base group-hover:text-cyan-300">{budget.label}</span>
                            <span className="text-cyan-400 opacity-0 group-hover:opacity-100 transition">→</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {chatStep === 'timeline' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="bg-blue-600/20 border border-blue-500/30 rounded-2xl p-4 md:p-6">
                      <h3 className="text-xl md:text-2xl font-black text-white mb-2 md:mb-3">Perfect! ⏰</h3>
                      <p className="text-sm md:text-base text-gray-300">When would you like to get started?</p>
                    </div>

                    <div className="space-y-3">
                      {timelines.map((timeline) => (
                        <button
                          key={timeline.value}
                          onClick={() => handleTimelineSelect(timeline.value)}
                          className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-purple-600 hover:to-pink-600 border border-white/10 rounded-2xl p-4 text-left transition-all duration-300 hover:scale-105 group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-sm md:text-base group-hover:text-cyan-300">{timeline.label}</span>
                            <span className="text-cyan-400 opacity-0 group-hover:opacity-100 transition">→</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {chatStep === 'form' && (
                  <div className="animate-fadeIn">
                    <div className="bg-blue-600/20 border border-blue-500/30 rounded-2xl p-4 md:p-6 mb-4">
                      <h3 className="text-xl md:text-2xl font-black text-white mb-2 md:mb-3">Almost there! 📝</h3>
                      <p className="text-sm md:text-base text-gray-300">Tell us about your business</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      <input
                        type="text"
                        placeholder="Business Name *"
                        required
                        value={formData.businessName}
                        onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm md:text-base placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
                      />

                      <input
                        type="text"
                        placeholder="Your Name *"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm md:text-base placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
                      />

                      <input
                        type="tel"
                        placeholder="Phone Number *"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm md:text-base placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
                      />

                      <input
                        type="email"
                        placeholder="Email Address *"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm md:text-base placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="City"
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm md:text-base placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
                        />
                        <input
                          type="text"
                          placeholder="State"
                          value={formData.state}
                          onChange={(e) => setFormData({...formData, state: e.target.value})}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm md:text-base placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
                        />
                      </div>

                      <textarea
                        placeholder="What challenges are you facing? (Optional)"
                        rows={3}
                        value={formData.painPoint}
                        onChange={(e) => setFormData({...formData, painPoint: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm md:text-base placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition resize-none"
                      />

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 rounded-xl text-white font-black text-base md:text-lg transition-all duration-300 hover:scale-105 disabled:scale-100"
                      >
                        {isSubmitting ? 'Submitting...' : 'Get Started 🚀'}
                      </button>
                    </form>
                  </div>
                )}

                {chatStep === 'success' && (
                  <div className="text-center py-6 md:py-8 animate-fadeIn">
                    <div className="text-5xl md:text-6xl mb-4">🎉</div>
                    <h3 className="text-xl md:text-2xl font-black text-white mb-2">Thank You!</h3>
                    <p className="text-sm md:text-base text-gray-300 mb-4">We'll contact you within 24 hours to discuss your needs.</p>
                    <div className="bg-green-600/20 border border-green-500/30 rounded-2xl p-4 mb-6">
                      <p className="text-green-300 font-bold text-sm md:text-base">✅ Your information has been received</p>
                      <p className="text-gray-300 text-xs md:text-sm mt-2">Check your email for confirmation</p>
                    </div>
                    <button
                      onClick={() => {
                        setChatStep('initial');
                        setFormData({});
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full text-white font-bold text-sm md:text-base hover:scale-110 transition"
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

      {/* Floating Chat Button (when closed) */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 group animate-gentleBounce"
        >
          {/* Notification badge */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
          
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative w-16 h-16 md:w-18 md:h-18 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-3xl md:text-4xl hover:scale-110 transition-all duration-300 shadow-2xl">
            💬
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat with us! 👋
          </div>
        </button>
      )}

      {/* Growth Call Form Modal */}
      {showGrowthCallForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-3xl blur-xl opacity-75"></div>
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-blue-500/50 rounded-3xl p-6 md:p-10">
              <button
                onClick={() => setShowGrowthCallForm(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 text-white hover:bg-white/20 rounded-full p-2 transition"
              >
                ✕
              </button>

              <h3 className="text-3xl md:text-4xl font-black text-white mb-6 text-center">
                Book Your <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Growth Call</span>
              </h3>

              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const response = await fetch('/api/leads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      full_name: growthCallForm.name,
                      business_name: growthCallForm.businessName,
                      phone: growthCallForm.phone,
                      email: growthCallForm.email,
                      questions: growthCallForm.painPoint,
                      selected_plan: 'Growth Call',
                      lead_type: 'growth_call'
                    })
                  });

                  if (response.ok) {
                    alert('Thank you! We will contact you within 24 hours to schedule your growth call.');
                    setShowGrowthCallForm(false);
                    setGrowthCallForm({ businessName: '', name: '', phone: '', email: '', painPoint: '' });
                  } else {
                    throw new Error('Failed to submit');
                  }
                } catch (error) {
                  alert('Something went wrong. Please try again or call us at 219-207-7863.');
                }
              }} className="space-y-4">
                
                <input
                  type="text"
                  placeholder="Your Name *"
                  required
                  value={growthCallForm.name}
                  onChange={(e) => setGrowthCallForm({...growthCallForm, name: e.target.value})}
                  className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition text-sm md:text-base"
                />

                <input
                  type="text"
                  placeholder="Business Name *"
                  required
                  value={growthCallForm.businessName}
                  onChange={(e) => setGrowthCallForm({...growthCallForm, businessName: e.target.value})}
                  className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition text-sm md:text-base"
                />

                <input
                  type="tel"
                  placeholder="Phone Number *"
                  required
                  value={growthCallForm.phone}
                  onChange={(e) => setGrowthCallForm({...growthCallForm, phone: e.target.value})}
                  className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition text-sm md:text-base"
                />

                <input
                  type="email"
                  placeholder="Email Address *"
                  required
                  value={growthCallForm.email}
                  onChange={(e) => setGrowthCallForm({...growthCallForm, email: e.target.value})}
                  className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition text-sm md:text-base"
                />

                <textarea
                  placeholder="What challenges are you facing? (Optional)"
                  rows={4}
                  value={growthCallForm.painPoint}
                  onChange={(e) => setGrowthCallForm({...growthCallForm, painPoint: e.target.value})}
                  className="w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition resize-none text-sm md:text-base"
                />

                <button
                  type="submit"
                  className="w-full py-4 md:py-5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:scale-105 transition duration-300 rounded-xl text-white font-black text-lg md:text-xl shadow-lg"
                >
                  Book My Call 📞
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

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
            <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              KINECT B2B
            </div>
          </div>
          <p className="text-gray-500 text-sm md:text-base">© 2018 Kinect B2B. All rights reserved.</p>
        </div>
      </footer>

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