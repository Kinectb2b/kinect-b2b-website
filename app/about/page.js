'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Menu,
  X,
  Phone,
  Mail,
  ChevronDown,
  Target,
  Zap,
  Handshake,
  Lightbulb,
  PhoneCall,
  FileText,
  Rocket,
  TrendingUp
} from 'lucide-react';

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
      icon: Target,
      title: "Results-Driven",
      description: "We only win when you win. Our success is measured by your growth."
    },
    {
      icon: Zap,
      title: "Speed & Efficiency",
      description: "Fast implementation, quick results. No delays, no excuses."
    },
    {
      icon: Handshake,
      title: "Partnership Mindset",
      description: "We're not just a vendor - we're your growth partner for the long haul."
    },
    {
      icon: Lightbulb,
      title: "Innovation First",
      description: "Constantly evolving our methods to stay ahead of the market."
    }
  ];

  const process = [
    {
      number: "01",
      icon: PhoneCall,
      title: "Discovery Call",
      description: "We learn about your business, goals, and challenges in a free 30-minute consultation."
    },
    {
      number: "02",
      icon: FileText,
      title: "Custom Strategy",
      description: "We build a tailored plan with clear KPIs and timelines for your specific needs."
    },
    {
      number: "03",
      icon: Rocket,
      title: "Fast Implementation",
      description: "Get up and running within 48 hours with our proven systems and processes."
    },
    {
      number: "04",
      icon: TrendingUp,
      title: "Ongoing Optimization",
      description: "Continuous testing and refinement to maximize your ROI month over month."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <Image
                src="/my-logo.png"
                alt="Kinect B2B Logo"
                width={40}
                height={40}
                className="w-8 h-8 md:w-10 md:h-10"
              />
              <span className="text-xl md:text-2xl font-bold text-white">
                Kinect B2B
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <a href="/" className="text-slate-300 hover:text-white transition font-medium">Home</a>
              <a href="/about" className="text-teal-400 hover:text-teal-300 transition font-medium">About</a>

              <div className="relative">
                <button
                  onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  className="text-slate-300 hover:text-white transition font-medium flex items-center gap-1"
                >
                  Services
                  <ChevronDown className={`w-4 h-4 transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {servicesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-2">
                    <a href="/services/appointment-setting" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 transition">Appointment Setting</a>
                    <a href="/services/websites" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 transition">Website Development</a>
                    <a href="/services/automations" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 transition">Automations</a>
                    <a href="/services/portals" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 transition">Client Portals</a>
                    <div className="border-t border-slate-700 my-2"></div>
                    <a href="/plans" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 transition">View All Plans</a>
                  </div>
                )}
              </div>

              <a href="/portal" className="text-slate-300 hover:text-white transition font-medium">Client Portal</a>

              <a
                href="tel:2192707863"
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
              >
                <Phone className="w-4 h-4" />
                (219) 270-7863
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-slate-800 pt-4">
              <nav className="flex flex-col gap-4">
                <a href="/" className="text-slate-300 hover:text-white transition">Home</a>
                <a href="/about" className="text-teal-400 transition font-medium">About</a>
                <a href="/services/appointment-setting" className="text-slate-300 hover:text-white transition">Appointment Setting</a>
                <a href="/services/websites" className="text-slate-300 hover:text-white transition">Website Development</a>
                <a href="/services/automations" className="text-slate-300 hover:text-white transition">Automations</a>
                <a href="/services/portals" className="text-slate-300 hover:text-white transition">Client Portals</a>
                <a href="/plans" className="text-slate-300 hover:text-white transition">View All Plans</a>
                <a href="/portal" className="text-slate-300 hover:text-white transition">Client Portal</a>
                <a
                  href="tel:2192707863"
                  className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg font-medium w-fit"
                >
                  <Phone className="w-4 h-4" />
                  (219) 270-7863
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-slate-900 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              We're{' '}
              <span className="text-teal-400">Kinect B2B</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Your growth partner specializing in appointment setting, lead generation,
              and scalable business solutions for service-based companies.
            </p>

            {/* Mission Statement */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 md:p-8 max-w-3xl mx-auto">
              <p className="text-lg md:text-xl text-slate-300 italic">
                "Empowering businesses to grow through innovative solutions, proven systems, and unwavering commitment to results."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              The principles that guide everything we do.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-6 hover:shadow-lg transition">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-slate-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How We Work Together
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A simple, proven process to get you results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {process.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-teal-600 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-teal-600 mb-1">Step {step.number}</div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">{step.title}</h3>
                      <p className="text-slate-600">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Our Story</h2>
            <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
              <p>
                Kinect B2B was founded with one simple mission: help service-based businesses scale
                predictably and profitably. After years of building and selling successful companies,
                our founder saw a massive gap in the market and set out to fill it.
              </p>
              <p>
                Most agencies promised the world but delivered mediocre results. Business owners were
                drowning in sales calls, manual processes, and inconsistent lead flow. We knew there
                had to be a better way - a company built on integrity, excellence, and genuine care
                for our clients' success.
              </p>
              <p>
                Today, we've helped hundreds of companies generate millions in revenue through our proven
                systems for appointment setting, web development, automation, and client management.
                We don't just work for you - we work with you as your dedicated growth partner.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Grow Together?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Let's discuss how we can help you scale your business predictably and profitably.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowLeadForm(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Book Your Growth Call
            </button>
            <a
              href="tel:2192707863"
              className="bg-white hover:bg-slate-100 text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg transition"
            >
              Call (219) 270-7863
            </a>
          </div>
        </div>
      </section>

      {/* Lead Form Modal */}
      {showLeadForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative max-w-xl w-full bg-white rounded-2xl shadow-2xl p-6 md:p-8 my-8">
            <button
              onClick={() => setShowLeadForm(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
              Book Your Growth Call
            </h3>
            <p className="text-slate-600 mb-6">
              Fill out the form below and we'll be in touch within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 mb-2 font-medium">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-2 font-medium">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-2 font-medium">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-2 font-medium">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-2 font-medium">Tell us about your business</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/my-logo.png"
                alt="Kinect B2B Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-white">Kinect B2B</span>
            </div>

            <div className="flex items-center gap-6">
              <a href="tel:2192707863" className="flex items-center gap-2 text-slate-400 hover:text-white transition">
                <Phone className="w-4 h-4" />
                (219) 270-7863
              </a>
              <a href="mailto:accounts@kinectb2b.com" className="flex items-center gap-2 text-slate-400 hover:text-white transition">
                <Mail className="w-4 h-4" />
                accounts@kinectb2b.com
              </a>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p className="text-slate-500">
              &copy; 2025 Kinect B2B. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
