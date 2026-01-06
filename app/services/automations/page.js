'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Menu, X, Phone, Mail, Linkedin, ChevronDown, ChevronRight,
  Check, Mail as MailIcon, MessageSquare, FileText, BarChart3,
  Calendar, DollarSign, FolderOpen, Bell, Zap, Settings, Clock
} from 'lucide-react';

export default function AutomationsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [referralCode, setReferralCode] = useState('');
  const [formStatus, setFormStatus] = useState('');
  const [formData, setFormData] = useState({
    business_name: '',
    name: '',
    phone: '',
    email: '',
    industry: '',
    questions: '',
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode) {
      localStorage.setItem('referral_code', refCode);
      setReferralCode(refCode);
    } else {
      const storedCode = localStorage.getItem('referral_code');
      if (storedCode) setReferralCode(storedCode);
    }
  }, []);

  const automationTypes = [
    { icon: MailIcon, name: 'Email Sequences', desc: 'Automated follow-ups and nurture campaigns' },
    { icon: MessageSquare, name: 'SMS Automation', desc: 'Text message triggers and responses' },
    { icon: FileText, name: 'Form Processing', desc: 'Automatic lead capture and routing' },
    { icon: BarChart3, name: 'CRM Integration', desc: 'Sync data across platforms automatically' },
    { icon: Calendar, name: 'Appointment Booking', desc: 'Automated scheduling and reminders' },
    { icon: DollarSign, name: 'Payment Processing', desc: 'Invoice generation and payment tracking' },
    { icon: FolderOpen, name: 'Document Generation', desc: 'Auto-create proposals and contracts' },
    { icon: Bell, name: 'Notifications', desc: 'Real-time alerts for your team' },
  ];

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
    },
    {
      name: 'Professional Automation',
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
    },
    {
      name: 'Enterprise Automation',
      price: 3500,
      description: 'Complete business process automation',
      features: [
        'Unlimited workflows',
        'Full business process automation',
        'Multi-platform integrations',
        'Custom API connections',
        'Dashboard & reporting',
        '90-day support + monthly optimization',
      ],
      examples: 'Complete sales funnel, client onboarding, internal workflows',
      popular: false,
    },
  ];

  const monthlyPlans = [
    { name: 'Bronze', price: 250, workflows: 'Up to 5 workflows', features: ['Monthly updates', 'Email support', 'Basic optimizations'] },
    { name: 'Silver', price: 500, workflows: 'Up to 15 workflows', features: ['Bi-weekly optimization', 'Priority support', 'Performance reporting'] },
    { name: 'Gold', price: 1000, workflows: 'Unlimited workflows', features: ['Weekly optimization', 'Dedicated support', 'Advanced analytics', 'Custom integrations'] },
  ];

  const handleOpenForm = (pkg = null) => {
    setSelectedPackage(pkg);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    try {
      const response = await fetch('/api/leads/service-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          selected_plan: selectedPackage?.name || '',
          service_type: 'Automations',
          referral_code: referralCode
        }),
      });
      if (response.ok) {
        setFormStatus('success');
        setShowForm(false);
        setFormData({ business_name: '', name: '', phone: '', email: '', industry: '', questions: '' });
        alert('Thank you! We will contact you shortly.');
      } else {
        throw new Error('Failed');
      }
    } catch (error) {
      setFormStatus('error');
      alert('Something went wrong. Please call us at (219) 270-7863');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/my-logo.png" alt="Kinect B2B" width={40} height={40} className="w-8 h-8 md:w-10 md:h-10" />
              <span className="text-xl md:text-2xl font-bold text-slate-900">Kinect B2B</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/" className="text-slate-600 hover:text-slate-900 font-medium transition">Home</Link>
              <Link href="/about" className="text-slate-600 hover:text-slate-900 font-medium transition">About</Link>
              <div className="relative">
                <button onClick={() => setServicesOpen(!servicesOpen)} className="flex items-center gap-1 text-slate-900 font-medium transition">
                  Services <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                </button>
                {servicesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2">
                    <Link href="/services/appointment-setting" className="block px-4 py-2 text-slate-600 hover:bg-gray-50">Appointment Setting</Link>
                    <Link href="/plans" className="block px-4 py-2 text-slate-600 hover:bg-gray-50">Plans & Pricing</Link>
                    <Link href="/services/websites" className="block px-4 py-2 text-slate-600 hover:bg-gray-50">Websites</Link>
                    <Link href="/services/automations" className="block px-4 py-2 text-teal-600 font-medium bg-teal-50">Automations</Link>
                    <Link href="/services/portals" className="block px-4 py-2 text-slate-600 hover:bg-gray-50">Client Portals</Link>
                  </div>
                )}
              </div>
              <Link href="/affiliate" className="text-slate-600 hover:text-slate-900 font-medium transition">Affiliates</Link>
              <Link href="/portal" className="text-slate-600 hover:text-slate-900 font-medium transition">Client Login</Link>
            </nav>

            <div className="hidden lg:flex items-center gap-4">
              <a href="tel:2192707863" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium">
                <Phone className="w-4 h-4" /> (219) 270-7863
              </a>
              <button onClick={() => handleOpenForm()} className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2.5 rounded-lg font-semibold transition">
                Get Started
              </button>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2">
              {mobileMenuOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6 text-slate-900" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-100">
              <nav className="flex flex-col gap-2">
                <Link href="/" className="px-4 py-2 text-slate-600 hover:bg-gray-50 rounded-lg">Home</Link>
                <Link href="/about" className="px-4 py-2 text-slate-600 hover:bg-gray-50 rounded-lg">About</Link>
                <Link href="/services/appointment-setting" className="px-4 py-2 text-slate-600 hover:bg-gray-50 rounded-lg">Appointment Setting</Link>
                <Link href="/plans" className="px-4 py-2 text-slate-600 hover:bg-gray-50 rounded-lg">Plans & Pricing</Link>
                <Link href="/services/automations" className="px-4 py-2 text-teal-600 font-medium bg-teal-50 rounded-lg">Automations</Link>
                <Link href="/services/portals" className="px-4 py-2 text-slate-600 hover:bg-gray-50 rounded-lg">Client Portals</Link>
                <a href="tel:2192707863" className="px-4 py-2 text-slate-600 hover:bg-gray-50 rounded-lg flex items-center gap-2">
                  <Phone className="w-4 h-4" /> (219) 270-7863
                </a>
                <button onClick={() => { setMobileMenuOpen(false); handleOpenForm(); }} className="mx-4 mt-2 bg-teal-500 text-white px-5 py-2.5 rounded-lg font-semibold">
                  Get Started
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Automate Your Business. Work Smarter.
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-8">
            Save time, reduce errors, and scale faster with custom automation workflows designed for your business.
          </p>
          <button onClick={() => handleOpenForm()} className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition">
            Get Started <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* What We Automate */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What We Automate</h2>
            <p className="text-lg text-slate-600">Streamline your operations with custom automation solutions.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {automationTypes.map((type, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 border border-gray-200 text-center hover:border-teal-300 hover:shadow-md transition">
                <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <type.icon className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{type.name}</h3>
                <p className="text-sm text-slate-500">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* One-Time Packages */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">One-Time Build Packages</h2>
            <p className="text-lg text-slate-600">Get your automations built and deployed.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, idx) => (
              <div key={idx} className={`relative bg-white rounded-2xl p-8 ${pkg.popular ? 'border-2 border-teal-500 shadow-xl' : 'border border-gray-200 shadow-lg'}`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-teal-500 text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
                  <p className="text-slate-500 text-sm mb-4">{pkg.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-sm text-slate-500">Starting at</span>
                  </div>
                  <div className="text-4xl font-bold text-slate-900">${pkg.price.toLocaleString()}<span className="text-lg text-slate-500">/one-time</span></div>
                </div>
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-gray-50 rounded-lg p-3 mb-6">
                  <p className="text-xs text-slate-500 font-medium mb-1">Example Use Cases:</p>
                  <p className="text-sm text-slate-600">{pkg.examples}</p>
                </div>
                <button onClick={() => handleOpenForm(pkg)} className={`w-full py-3 rounded-xl font-semibold transition ${pkg.popular ? 'bg-teal-500 hover:bg-teal-600 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}>
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Monthly Maintenance */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Ongoing Maintenance Plans</h2>
            <p className="text-lg text-slate-600">Keep your automations running smoothly with monthly updates and support.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {monthlyPlans.map((plan, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
                  <p className="text-sm text-slate-500">Starting at</p>
                  <div className="text-3xl font-bold text-slate-900">${plan.price}<span className="text-base text-slate-500">/mo</span></div>
                  <p className="text-teal-600 font-medium text-sm mt-2">{plan.workflows}</p>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-teal-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Discovery Call', desc: 'We learn about your workflows and pain points', icon: Phone },
              { step: '2', title: 'Strategy Session', desc: 'We identify automation opportunities', icon: Settings },
              { step: '3', title: 'Build & Test', desc: 'We create and thoroughly test your automations', icon: Zap },
              { step: '4', title: 'Launch & Support', desc: 'We deploy and provide ongoing optimization', icon: Clock },
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Automate Your Business?</h2>
          <p className="text-xl text-slate-300 mb-8">Stop wasting time on repetitive tasks. Let's build custom automations that work for you 24/7.</p>
          <button onClick={() => handleOpenForm()} className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition">
            Get Started <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Image src="/my-logo.png" alt="Kinect B2B" width={32} height={32} className="w-8 h-8" />
                <span className="text-xl font-bold text-white">Kinect B2B</span>
              </div>
              <p className="text-slate-400 mb-4 max-w-md">Boutique appointment setting for service businesses. We fill your calendar with qualified appointments.</p>
              <a href="https://linkedin.com/company/kinectb2b" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                <li><Link href="/services/appointment-setting" className="text-slate-400 hover:text-white transition">Appointment Setting</Link></li>
                <li><Link href="/plans" className="text-slate-400 hover:text-white transition">Plans & Pricing</Link></li>
                <li><Link href="/services/websites" className="text-slate-400 hover:text-white transition">Websites</Link></li>
                <li><Link href="/services/automations" className="text-slate-400 hover:text-white transition">Automations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li><a href="tel:2192707863" className="text-slate-400 hover:text-white transition flex items-center gap-2"><Phone className="w-4 h-4" /> (219) 270-7863</a></li>
                <li><a href="mailto:accounts@kinectb2b.com" className="text-slate-400 hover:text-white transition flex items-center gap-2"><Mail className="w-4 h-4" /> accounts@kinectb2b.com</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p className="text-slate-500 text-sm">© 2025 Kinect B2B. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Get Started with Automations</h3>
            {selectedPackage && <p className="text-slate-600 mb-6">Selected: <span className="text-teal-600 font-semibold">{selectedPackage.name}</span></p>}
            {!selectedPackage && <p className="text-slate-600 mb-6">Tell us about your automation needs.</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Business Name *" required value={formData.business_name} onChange={(e) => setFormData({ ...formData, business_name: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              <input type="text" placeholder="Your Name *" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              <input type="tel" placeholder="Phone *" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              <input type="email" placeholder="Email *" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              <input type="text" placeholder="Industry *" required value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500" />
              <textarea placeholder="What workflows do you want to automate?" rows={3} value={formData.questions} onChange={(e) => setFormData({ ...formData, questions: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
              <button type="submit" disabled={formStatus === 'sending'} className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition disabled:opacity-50">
                {formStatus === 'sending' ? 'Submitting...' : 'Request Consultation'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
