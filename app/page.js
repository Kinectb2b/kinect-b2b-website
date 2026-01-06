'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [formStatus, setFormStatus] = useState('');
  const [formData, setFormData] = useState({
    businessName: '',
    name: '',
    phone: '',
    email: '',
    industry: '',
    revenue: '',
    goals: ''
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');

    try {
      const response = await fetch('/api/leads/service-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          service_type: 'Appointment Setting',
          lead_source: 'Homepage Application'
        }),
      });

      if (response.ok) {
        setFormStatus('success');
        setShowApplicationForm(false);
        setFormData({
          businessName: '',
          name: '',
          phone: '',
          email: '',
          industry: '',
          revenue: '',
          goals: ''
        });
        alert('Application submitted! We\'ll be in touch within 24 hours.');
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      setFormStatus('error');
      alert('Something went wrong. Please call us at (219) 270-7863');
    }
  };

  // Lucide-style SVG Icons
  const Icons = {
    phone: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    target: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    settings: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    send: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
      </svg>
    ),
    calendar: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    shield: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    arrowRight: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    ),
    check: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    x: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    menu: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    )
  };

  // Industry Icons
  const IndustryIcon = ({ type }) => {
    const icons = {
      hvac: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      ),
      plumbing: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
      ),
      roofing: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      ),
      electrical: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
      landscaping: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
        </svg>
      ),
      cleaning: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      )
    };
    return icons[type] || icons.hvac;
  };

  const industries = [
    { name: 'HVAC & Mechanical', icon: 'hvac' },
    { name: 'Plumbing', icon: 'plumbing' },
    { name: 'Roofing & Exteriors', icon: 'roofing' },
    { name: 'Electrical', icon: 'electrical' },
    { name: 'Landscaping & Lawn Care', icon: 'landscaping' },
    { name: 'Commercial Cleaning', icon: 'cleaning' }
  ];

  const tools = ['Apollo.io', 'LinkedIn Sales Navigator', 'HubSpot', 'Calendly', 'Instantly', 'Clay'];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image src="/my-logo.png" alt="Kinect B2B" width={32} height={32} className="w-8 h-8" />
              <span className="text-white font-bold text-lg">Kinect B2B</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/services/appointment-setting" className="text-gray-300 hover:text-white text-sm font-medium transition">Services</Link>
              <Link href="/plans" className="text-gray-300 hover:text-white text-sm font-medium transition">Pricing</Link>
              <Link href="/about" className="text-gray-300 hover:text-white text-sm font-medium transition">About</Link>
              <button
                onClick={() => setShowApplicationForm(true)}
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                Apply Now
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white p-2">
              {mobileMenuOpen ? Icons.x : Icons.menu}
            </button>
          </div>

          {/* Mobile Nav */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-800">
              <div className="flex flex-col gap-4">
                <Link href="/services/appointment-setting" className="text-gray-300 hover:text-white text-sm font-medium">Services</Link>
                <Link href="/plans" className="text-gray-300 hover:text-white text-sm font-medium">Pricing</Link>
                <Link href="/about" className="text-gray-300 hover:text-white text-sm font-medium">About</Link>
                <button
                  onClick={() => { setShowApplicationForm(true); setMobileMenuOpen(false); }}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold w-full"
                >
                  Apply Now
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-slate-900 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            We Book Qualified Appointments.
            <br />
            <span className="text-teal-400">You Close Deals.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Boutique appointment setting for service businesses.
            <br className="hidden sm:block" />
            Founder-led campaigns. Performance guaranteed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setShowApplicationForm(true)}
              className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition shadow-lg shadow-teal-500/25"
            >
              Apply to Work With Us
            </button>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto text-gray-400 hover:text-white px-6 py-4 font-medium text-lg transition flex items-center justify-center gap-2"
            >
              See How It Works
              {Icons.arrowRight}
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A proven process that delivers qualified appointments to your calendar.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 md:gap-6">
            {[
              { icon: Icons.target, step: '1', title: 'Strategy Call', desc: 'We learn your ideal customer, market, and goals.' },
              { icon: Icons.settings, step: '2', title: 'Campaign Build', desc: 'Custom outreach sequences, targeting, and messaging.' },
              { icon: Icons.send, step: '3', title: 'Outreach Launch', desc: 'We contact prospects daily via email, phone, and LinkedIn.' },
              { icon: Icons.calendar, step: '4', title: 'Appointments Booked', desc: 'Qualified meetings land directly on your calendar.' }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-teal-600 mb-5">
                  {item.icon}
                </div>
                <div className="text-xs font-bold text-teal-600 tracking-wider mb-2">STEP {item.step}</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Work With */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Who We Work With</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We specialize in service businesses ready to scale.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
            {industries.map((industry, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:border-teal-300 hover:shadow-md transition"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 text-slate-600 mb-3">
                  <IndustryIcon type={industry.icon} />
                </div>
                <div className="text-slate-900 font-medium text-sm">{industry.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Guarantee */}
      <section className="py-20 md:py-28 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-teal-500/10 text-teal-400 mb-8">
            {Icons.shield}
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Results or You Don't Pay
          </h2>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            We're so confident in our process that we guarantee qualified appointments within 90 days — or we work for free until you get them.
          </p>

          <p className="text-gray-500 mb-10">
            No long-term contracts. No setup fees. Just results.
          </p>

          <Link
            href="/plans"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-slate-900 px-6 py-3 rounded-lg font-semibold transition"
          >
            See Pricing
            {Icons.arrowRight}
          </Link>
        </div>
      </section>

      {/* Tools We Use */}
      <section className="py-16 md:py-20 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm font-medium tracking-wider uppercase mb-10">
            Powered by industry-leading tools
          </p>

          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6">
            {tools.map((tool, idx) => (
              <div key={idx} className="text-gray-400 font-semibold text-sm md:text-base">
                {tool}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About the Founder */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Photo Placeholder */}
            <div className="flex justify-center md:justify-start">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-slate-100 rounded-2xl flex items-center justify-center">
                <span className="text-gray-400 text-sm">Photo Coming Soon</span>
              </div>
            </div>

            {/* Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Founder-Led.
                <br />
                Hands-On.
                <br />
                Accountable.
              </h2>

              <blockquote className="text-gray-600 text-lg leading-relaxed mb-6">
                "I started Kinect B2B because I saw service businesses getting burned by agencies that overpromise and underdeliver. Every campaign I take on gets my direct oversight. Your growth is my reputation."
              </blockquote>

              <div className="flex items-center gap-4">
                <div>
                  <div className="text-slate-900 font-semibold">Robert Cole</div>
                  <div className="text-gray-500 text-sm">Founder, Kinect B2B</div>
                </div>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-teal-600 transition"
                >
                  {Icons.linkedin}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 md:py-24 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Fill Your Calendar?
          </h2>

          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            We take on 3-5 new clients per quarter. Apply now to see if we're a fit.
          </p>

          <button
            onClick={() => setShowApplicationForm(true)}
            className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition shadow-lg shadow-teal-500/25"
          >
            Apply to Work With Us
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Image src="/my-logo.png" alt="Kinect B2B" width={24} height={24} className="w-6 h-6" />
              <span className="text-white font-semibold">Kinect B2B</span>
            </div>

            {/* Links */}
            <nav className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/" className="text-gray-400 hover:text-white transition">Home</Link>
              <Link href="/services/appointment-setting" className="text-gray-400 hover:text-white transition">Services</Link>
              <Link href="/plans" className="text-gray-400 hover:text-white transition">Pricing</Link>
              <Link href="/about" className="text-gray-400 hover:text-white transition">About</Link>
              <a href="tel:2192707863" className="text-gray-400 hover:text-white transition">Contact</a>
            </nav>

            {/* Copyright */}
            <div className="text-gray-500 text-sm">
              © 2025 Kinect B2B
            </div>
          </div>
        </div>
      </footer>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Apply to Work With Us</h3>
                <p className="text-gray-500 text-sm mt-1">Tell us about your business</p>
              </div>
              <button
                onClick={() => setShowApplicationForm(false)}
                className="text-gray-400 hover:text-gray-600 p-2 transition"
              >
                {Icons.x}
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Business Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                    placeholder="Acme HVAC"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                    placeholder="John Smith"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                    placeholder="john@acmehvac.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Industry *</label>
                <select
                  required
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition bg-white"
                >
                  <option value="">Select your industry</option>
                  <option value="HVAC">HVAC & Mechanical</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Roofing">Roofing & Exteriors</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Landscaping">Landscaping & Lawn Care</option>
                  <option value="Cleaning">Commercial Cleaning</option>
                  <option value="Other">Other Service Business</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Annual Revenue</label>
                <select
                  value={formData.revenue}
                  onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition bg-white"
                >
                  <option value="">Select range</option>
                  <option value="Under $500K">Under $500K</option>
                  <option value="$500K - $1M">$500K - $1M</option>
                  <option value="$1M - $3M">$1M - $3M</option>
                  <option value="$3M - $5M">$3M - $5M</option>
                  <option value="$5M+">$5M+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">What are your growth goals?</label>
                <textarea
                  rows={3}
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition resize-none"
                  placeholder="Tell us about your ideal customer and what you're hoping to achieve..."
                />
              </div>

              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white py-4 rounded-lg font-semibold text-lg transition"
              >
                {formStatus === 'sending' ? 'Submitting...' : 'Submit Application'}
              </button>

              <p className="text-center text-gray-500 text-xs">
                We'll respond within 24 hours to schedule a strategy call.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
