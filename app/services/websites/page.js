'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Menu,
  X,
  Phone,
  Mail,
  Linkedin,
  ChevronDown,
  ChevronRight,
  Check,
  Smartphone,
  Zap,
  Palette,
  Search,
  Shield,
  BarChart3,
  MessageSquare,
  Rocket,
  Wrench,
  FileEdit,
  LineChart
} from 'lucide-react';

export default function WebsitesPage() {
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
      name: 'Starter Website',
      price: 2500,
      description: 'Perfect for new businesses establishing online presence',
      features: [
        '3-5 Professional Pages',
        'Mobile-Responsive Design',
        'Contact Form Integration',
        'Basic SEO Setup',
        'Stock Image Library Access',
        '30-Day Support & Training',
        'Fast 2-Week Delivery'
      ],
      popular: false,
    },
    {
      name: 'Professional Website',
      price: 7500,
      description: 'Best for growing businesses focused on lead generation',
      features: [
        '5-10 Custom Pages',
        'Custom Brand-Matched Design',
        'Advanced Lead Capture Forms',
        'Blog Setup & Content Strategy',
        'Advanced SEO Optimization',
        'Basic CRM Integration',
        '60-Day Support & Training',
        'Fast 3-Week Delivery'
      ],
      popular: true,
    },
    {
      name: 'Premium Website',
      price: 15000,
      description: 'Enterprise solution for businesses scaling rapidly',
      features: [
        'Unlimited Pages',
        'Premium Custom Design + Animations',
        'Advanced Lead Tracking & Analytics',
        'Full CRM & Tool Integration',
        'E-commerce Capability (Optional)',
        'Custom Analytics Dashboard',
        'Priority Support + Monthly Updates',
        'Fast 4-Week Delivery'
      ],
      popular: false,
    }
  ];

  const addons = [
    { name: 'Monthly Maintenance', price: 200, priceLabel: 'As low as $200/mo', desc: 'Ongoing updates, security, and support', icon: Wrench },
    { name: 'Content Updates', price: 150, priceLabel: 'As low as $150/mo', desc: 'Monthly content refreshes and blog posts', icon: FileEdit },
    { name: 'Advanced Analytics', price: 100, priceLabel: 'As low as $100/mo', desc: 'Detailed tracking and reporting dashboard', icon: LineChart }
  ];

  const features = [
    { icon: Smartphone, title: 'Mobile-First Design', desc: 'Looks perfect on all devices' },
    { icon: Zap, title: 'Lightning Fast', desc: 'Optimized for speed and performance' },
    { icon: Palette, title: 'Custom Branding', desc: 'Matches your brand perfectly' },
    { icon: Search, title: 'SEO Optimized', desc: 'Built to rank on Google' },
    { icon: Shield, title: 'Secure & Reliable', desc: 'SSL encryption included' },
    { icon: BarChart3, title: 'Analytics Ready', desc: 'Track your traffic and leads' },
    { icon: MessageSquare, title: 'Lead Capture', desc: 'Convert visitors to customers' },
    { icon: Rocket, title: 'Fast Delivery', desc: 'Launch in 2-4 weeks' },
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
          business_name: formData.business_name,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          city: formData.city,
          state: formData.state,
          industry: formData.industry,
          questions: formData.questions,
          selected_plan: selectedPackage?.name || formData.selected_plan || null,
          service_type: 'Website',
          lead_source: 'Website Page - Contact Form',
          referral_code: referralCode || null
        }),
      });

      if (response.ok) {
        setFormStatus('success');
        alert('Thank you! We will contact you shortly to discuss your website needs.');
        setShowContactForm(false);
        setSelectedPackage(null);
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
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Error:', error);
      setFormStatus('error');
      alert('Something went wrong. Please try again or call us at (219) 270-7863');
    }
  };

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
              <a href="/about" className="text-slate-300 hover:text-white transition font-medium">About</a>

              <div className="relative">
                <button
                  onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  className="text-white hover:text-teal-400 transition font-medium flex items-center gap-1"
                >
                  Services
                  <ChevronDown className={`w-4 h-4 transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {servicesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-2">
                    <a href="/services/appointment-setting" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 transition">Appointment Setting</a>
                    <a href="/services/websites" className="block px-4 py-2 text-teal-400 hover:bg-slate-700 transition font-medium">Website Development</a>
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
                <a href="/about" className="text-slate-300 hover:text-white transition">About</a>
                <a href="/services/appointment-setting" className="text-slate-300 hover:text-white transition">Appointment Setting</a>
                <a href="/services/websites" className="text-teal-400 transition font-medium">Website Development</a>
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
              Websites That{' '}
              <span className="text-teal-400">Generate Leads</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Professional websites designed to convert visitors into customers. Fast delivery, mobile-first design, SEO optimized.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowContactForm(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Schedule a Call
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

      {/* Features Grid */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose Our Websites
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We build websites that work hard for your business, not just look pretty.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const IconComponent = feature.icon;
              return (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-6 hover:shadow-lg transition">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Website Packages
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              One-time investment for a professional website that generates leads.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {packages.map((pkg, idx) => (
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
                  <div className="text-4xl font-bold text-slate-900">
                    ${pkg.price.toLocaleString()}
                    <span className="text-lg font-normal text-slate-500">/one-time</span>
                  </div>
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

      {/* Add-ons */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Optional Add-Ons
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Keep your website fresh and performing at its best with ongoing support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {addons.map((addon, idx) => {
              const IconComponent = addon.icon;
              return (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center hover:shadow-lg transition">
                  <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-7 h-7 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{addon.name}</h3>
                  <div className="text-3xl font-bold text-teal-600 mb-2">
                    ${addon.price}<span className="text-lg font-normal text-slate-500">/mo</span>
                  </div>
                  <p className="text-slate-600">{addon.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From consultation to launch in as little as 2 weeks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Discovery', desc: 'We learn about your business and goals' },
              { step: '2', title: 'Design', desc: 'We create custom mockups for your approval' },
              { step: '3', title: 'Build', desc: 'We develop and thoroughly test your site' },
              { step: '4', title: 'Launch', desc: 'Go live with training and support' },
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
            Ready to Get a Website That Works?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Get a professional website that turns visitors into customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowContactForm(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Schedule a Call
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
                placeholder="What features do you need on your website?"
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
