'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Menu, X, Phone, Mail, Linkedin, ChevronDown, ChevronRight,
  Search, Database, Send, CheckCircle, Calendar, Shield, Users,
  Flame, Droplets, Zap, Home, Trees, Sparkles, HardHat, Key,
  UserCheck, MapPin, Target
} from 'lucide-react';

export default function AppointmentSettingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const processSteps = [
    {
      step: '01',
      title: 'Research',
      description: 'We analyze your market, identify your ideal customers, and map out decision-makers (GMs, District Managers, Regional Managers).',
      icon: Search
    },
    {
      step: '02',
      title: 'List Building',
      description: 'We build verified contact lists with direct dials and emails. No generic info@ addresses.',
      icon: Database
    },
    {
      step: '03',
      title: 'Multi-Channel Outreach',
      description: 'We contact each prospect up to 9 times across phone, email, and LinkedIn. Persistent but professional.',
      icon: Send
    },
    {
      step: '04',
      title: 'Qualification',
      description: 'We confirm interest, budget, and timeline before booking. No tire-kickers on your calendar.',
      icon: CheckCircle
    },
    {
      step: '05',
      title: 'Appointment Booked',
      description: 'Qualified meeting lands on your calendar with full context. You just show up ready to close.',
      icon: Calendar
    }
  ];

  const differentiators = [
    {
      icon: UserCheck,
      title: 'Founder-led, not outsourced overseas'
    },
    {
      icon: MapPin,
      title: "Territory exclusive - we won't work with your competitors"
    },
    {
      icon: Shield,
      title: "Results guaranteed or you don't pay"
    },
    {
      icon: Users,
      title: 'Real humans, not just automated sequences'
    }
  ];

  const industries = [
    { name: 'HVAC', icon: Flame },
    { name: 'Plumbing', icon: Droplets },
    { name: 'Electrical', icon: Zap },
    { name: 'Roofing', icon: Home },
    { name: 'Landscaping', icon: Trees },
    { name: 'Cleaning Services', icon: Sparkles },
    { name: 'Construction', icon: HardHat },
    { name: 'Property Management', icon: Key }
  ];

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

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/" className="text-slate-600 hover:text-slate-900 font-medium transition">Home</Link>
              <Link href="/about" className="text-slate-600 hover:text-slate-900 font-medium transition">About</Link>
              <div className="relative">
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className="flex items-center gap-1 text-slate-900 font-medium transition"
                >
                  Services <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                </button>
                {servicesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2">
                    <Link href="/services/appointment-setting" className="block px-4 py-2 text-teal-600 font-medium bg-teal-50">Appointment Setting</Link>
                    <Link href="/plans" className="block px-4 py-2 text-slate-600 hover:bg-gray-50 hover:text-slate-900">Plans & Pricing</Link>
                    <Link href="/services/websites" className="block px-4 py-2 text-slate-600 hover:bg-gray-50 hover:text-slate-900">Websites</Link>
                    <Link href="/services/automations" className="block px-4 py-2 text-slate-600 hover:bg-gray-50 hover:text-slate-900">Automations</Link>
                    <Link href="/services/portals" className="block px-4 py-2 text-slate-600 hover:bg-gray-50 hover:text-slate-900">Client Portals</Link>
                  </div>
                )}
              </div>
              <Link href="/affiliate" className="text-slate-600 hover:text-slate-900 font-medium transition">Affiliates</Link>
              <Link href="/portal" className="text-slate-600 hover:text-slate-900 font-medium transition">Client Login</Link>
            </nav>

            <div className="hidden lg:flex items-center gap-4">
              <a href="tel:2192707863" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium">
                <Phone className="w-4 h-4" />
                (219) 270-7863
              </a>
              <Link
                href="/plans"
                className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2.5 rounded-lg font-semibold transition"
              >
                See Pricing
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2">
              {mobileMenuOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6 text-slate-900" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-100">
              <nav className="flex flex-col gap-2">
                <Link href="/" className="px-4 py-2 text-slate-600 hover:bg-gray-50 rounded-lg">Home</Link>
                <Link href="/about" className="px-4 py-2 text-slate-600 hover:bg-gray-50 rounded-lg">About</Link>
                <Link href="/services/appointment-setting" className="px-4 py-2 text-teal-600 font-medium bg-teal-50 rounded-lg">Appointment Setting</Link>
                <Link href="/plans" className="px-4 py-2 text-slate-600 hover:bg-gray-50 rounded-lg">Plans & Pricing</Link>
                <Link href="/affiliate" className="px-4 py-2 text-slate-600 hover:bg-gray-50 rounded-lg">Affiliates</Link>
                <Link href="/portal" className="px-4 py-2 text-slate-600 hover:bg-gray-50 rounded-lg">Client Login</Link>
                <a href="tel:2192707863" className="px-4 py-2 text-slate-600 hover:bg-gray-50 rounded-lg flex items-center gap-2">
                  <Phone className="w-4 h-4" /> (219) 270-7863
                </a>
                <Link
                  href="/plans"
                  className="mx-4 mt-2 bg-teal-500 hover:bg-teal-600 text-white px-5 py-2.5 rounded-lg font-semibold transition text-center"
                >
                  See Pricing
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            B2B Appointment Setting That Actually Works
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto">
            We find decision-makers, run the outreach, and book qualified meetings on your calendar. You just show up and close.
          </p>
          <Link
            href="/plans"
            className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition"
          >
            See Pricing
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              You're Great at Your Job. Prospecting? Not So Much.
            </h2>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              Most service business owners lose 10-20 hours a week chasing leads that go nowhere. Cold calls that don't connect. Emails that don't get opened. You didn't start your business to be a telemarketer.
            </p>
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How We Fill Your Calendar
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our proven 5-step process delivers qualified appointments consistently.
            </p>
          </div>

          <div className="space-y-6">
            {processSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 md:p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row gap-6 items-start"
              >
                <div className="flex items-center gap-4 md:w-64 flex-shrink-0">
                  <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-7 h-7 text-teal-600" />
                  </div>
                  <div>
                    <span className="text-teal-500 font-bold text-sm">STEP {step.step}</span>
                    <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                  </div>
                </div>
                <p className="text-slate-600 md:pt-2">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Boutique Service. Enterprise Results.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {differentiators.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-teal-600" />
                </div>
                <span className="text-slate-700 font-medium text-lg">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve Section */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Industries We Serve
            </h2>
            <p className="text-lg text-slate-600">
              We specialize in appointment setting for service-based B2B businesses.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {industries.map((industry, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 border border-gray-200 text-center hover:border-teal-300 hover:shadow-md transition"
              >
                <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <industry.icon className="w-6 h-6 text-teal-600" />
                </div>
                <span className="text-slate-700 font-semibold">{industry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Stop Chasing Leads?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            See our pricing and find the right plan for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/plans"
              className="inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition"
            >
              View Pricing
              <ChevronRight className="w-5 h-5" />
            </Link>
            <a
              href="tel:2192707863"
              className="inline-flex items-center justify-center gap-2 border-2 border-slate-600 hover:border-slate-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition"
            >
              <Phone className="w-5 h-5" />
              Call: (219) 270-7863
            </a>
          </div>
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
              <p className="text-slate-400 mb-4 max-w-md">
                Boutique appointment setting for service businesses. We fill your calendar with qualified appointments so you can focus on closing deals.
              </p>
              <div className="flex items-center gap-4">
                <a href="https://linkedin.com/company/kinectb2b" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
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
                <li>
                  <a href="tel:2192707863" className="text-slate-400 hover:text-white transition flex items-center gap-2">
                    <Phone className="w-4 h-4" /> (219) 270-7863
                  </a>
                </li>
                <li>
                  <a href="mailto:accounts@kinectb2b.com" className="text-slate-400 hover:text-white transition flex items-center gap-2">
                    <Mail className="w-4 h-4" /> accounts@kinectb2b.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p className="text-slate-500 text-sm">
              © 2025 Kinect B2B. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
