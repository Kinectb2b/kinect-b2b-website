'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function About() {
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'About Page - Growth Call',
          status: 'new'
        }),
      });

      if (response.ok) {
        alert('Thank you! We will be in touch soon.');
        setShowLeadForm(false);
        setFormData({ name: '', email: '', phone: '', company: '', message: '' });
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const values = [
    {
      icon: "🎯",
      title: "Results-Driven",
      description: "We only win when you win. Our success is measured by your growth."
    },
    {
      icon: "⚡",
      title: "Speed & Efficiency",
      description: "Fast implementation, quick results. No delays, no excuses."
    },
    {
      icon: "🤝",
      title: "Partnership Mindset",
      description: "We're not just a vendor—we're your growth partner for the long haul."
    },
    {
      icon: "💡",
      title: "Innovation First",
      description: "Constantly evolving our methods to stay ahead of the market."
    }
  ];

  const process = [
    {
      number: "01",
      title: "Discovery Call",
      description: "We learn about your business, goals, and challenges in a free 30-minute consultation."
    },
    {
      number: "02",
      title: "Custom Strategy",
      description: "We build a tailored plan with clear KPIs and timelines for your specific needs."
    },
    {
      number: "03",
      title: "Fast Implementation",
      description: "Get up and running within 48 hours with our proven systems and processes."
    },
    {
      number: "04",
      title: "Ongoing Optimization",
      description: "Continuous testing and refinement to maximize your ROI month over month."
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
              <a href="/" className="text-gray-300 hover:text-cyan-400 transition">Home</a>
              <a href="/about" className="text-white hover:text-cyan-400 transition font-bold">About</a>
              
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
              <a href="/" className="block px-4 py-3 text-gray-300 hover:bg-cyan-500/20 rounded-lg transition">Home</a>
              <a href="/about" className="block px-4 py-3 text-white hover:bg-cyan-500/20 rounded-lg transition font-bold">About</a>
              
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
            <span className="text-white">We're </span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Kinect B2B
            </span>
          </h1>

          <p className="text-lg md:text-2xl lg:text-3xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Your growth partner specializing in lead generation, appointment setting, 
            and scalable business solutions for service-based companies.
          </p>

          {/* Mission Statement */}
          <div className="max-w-3xl mx-auto mt-8 md:mt-12 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded-2xl blur-xl"></div>
            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-2xl border border-cyan-500/30 p-6 md:p-8 rounded-2xl">
              <p className="text-base md:text-xl text-gray-200 italic">
                "Empowering businesses to grow through faith-driven partnerships, innovative solutions, and unwavering commitment to excellence."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-12 md:py-20 bg-gradient-to-r from-blue-950/50 to-purple-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2 md:mb-4">500+</div>
              <div className="text-base md:text-xl text-gray-300 font-bold">Businesses Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-6xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-2 md:mb-4">$50M+</div>
              <div className="text-base md:text-xl text-gray-300 font-bold">Revenue Generated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-6xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2 md:mb-4">98%</div>
              <div className="text-base md:text-xl text-gray-300 font-bold">Client Retention</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-6xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2 md:mb-4">7+</div>
              <div className="text-base md:text-xl text-gray-300 font-bold">Years in Business</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="relative py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-center mb-12 md:mb-20">
            <span className="text-white">Our Core </span>
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Values</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {values.map((value, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 hover:border-cyan-500/50 transition-all duration-300">
                  <div className="text-5xl md:text-6xl mb-4 md:mb-6">{value.icon}</div>
                  <h3 className="text-xl md:text-2xl font-black text-white mb-3 md:mb-4">{value.title}</h3>
                  <p className="text-sm md:text-base text-gray-400">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="relative py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-center mb-12 md:mb-20">
            <span className="text-white">How We </span>
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Work Together</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {process.map((step, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 hover:border-cyan-500/50 transition-all duration-300">
                  <div className="flex items-start gap-4 md:gap-6">
                    <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-black text-white mb-2 md:mb-3">{step.title}</h3>
                      <p className="text-sm md:text-base text-gray-400">{step.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="relative py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-2xl border border-blue-500/30 p-6 md:p-12 rounded-3xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 md:mb-6">Our Story</h2>
              <div className="space-y-4 md:space-y-6 text-base md:text-xl text-gray-300 leading-relaxed">
                <p>
                  Kinect B2B was founded with one simple mission: help service-based businesses scale 
                  predictably and profitably. After years of building and selling successful companies, 
                  our founder saw a massive gap in the market—and felt a calling from God to fill it.
                </p>
                <p>
                  Most agencies promised the world but delivered mediocre results. Business owners were 
                  drowning in sales calls, manual processes, and inconsistent lead flow. We knew God had 
                  given us the skills, experience, and vision to create something better—a company built 
                  on integrity, excellence, and genuine care for our clients' success.
                </p>
                <p>
                  Today, we've helped over 500+ companies generate millions in revenue through our proven 
                  systems for appointment setting, web development, automation, and client management. 
                  We don't just work for you—we work with you as your dedicated growth partner, guided 
                  by faith and committed to stewarding your business with the same care we'd give our own.
                </p>
                <p className="text-cyan-400 font-bold text-sm md:text-base lg:text-lg">
                  "In all your ways acknowledge Him, and He will make your paths straight." - Proverbs 3:6
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6">
            Ready to <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Grow Together?</span>
          </h2>
          <p className="text-lg md:text-2xl text-gray-300 mb-8 md:mb-12">
            Let's discuss how we can help you scale your business predictably and profitably.
          </p>

          <button 
            onClick={() => setShowLeadForm(true)}
            className="group relative inline-block"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
            <div className="relative px-8 md:px-16 py-5 md:py-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl text-white font-black text-xl md:text-3xl hover:scale-110 transition-all duration-300">
              Book Your Growth Call 🚀
            </div>
          </button>
        </div>
      </section>

      {/* Lead Form Modal */}
      {showLeadForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/30 rounded-3xl p-6 md:p-8">
              <button
                onClick={() => setShowLeadForm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl md:text-3xl"
              >
                ×
              </button>

              <h3 className="text-2xl md:text-4xl font-black text-white mb-6">Book Your Growth Call</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-bold text-sm md:text-base">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-bold text-sm md:text-base">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-bold text-sm md:text-base">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-bold text-sm md:text-base">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-bold text-sm md:text-base">Tell us about your business</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-sm md:text-base"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black text-lg md:text-xl rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-black/50 backdrop-blur-xl py-8 md:py-12">
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
          <p className="text-gray-500 text-sm md:text-base">© 2025 Kinect B2B. All rights reserved.</p>
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
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
      `}</style>
    </div>
  );
}