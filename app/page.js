'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Search,
  Users,
  Send,
  Calendar,
  Shield,
  ChevronRight,
  Building2,
  Flame,
  Droplets,
  Zap,
  Home,
  Trees,
  Sparkles,
  HardHat,
  Key,
  ArrowRight
} from 'lucide-react';

export default function HomePage() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const processSteps = [
    {
      number: '01',
      title: 'We Research Your Market',
      description: 'We identify decision-makers in your territory who need your services.',
      icon: Search
    },
    {
      number: '02',
      title: 'We Build Your List',
      description: 'Verified contacts with direct phone numbers and email addresses.',
      icon: Users
    },
    {
      number: '03',
      title: 'We Run Outreach',
      description: 'Multi-touch campaigns across phone, email, and LinkedIn.',
      icon: Send
    },
    {
      number: '04',
      title: 'You Take the Meeting',
      description: 'Qualified appointments land directly on your calendar.',
      icon: Calendar
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

  const tools = [
    'Apollo.io',
    'HubSpot',
    'LinkedIn Sales Navigator',
    'ZoomInfo',
    'Salesforce',
    'Calendly'
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="/" />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 pt-16 pb-20 md:pt-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              We Book Qualified Appointments.
              <br />
              <span className="text-teal-400">You Close Deals.</span>
            </h1>

            <p className="mt-6 md:mt-8 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Boutique B2B lead generation for service businesses.
              <br className="hidden sm:block" />
              Founder-led. Results-guaranteed.
            </p>

            <div className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/plans"
                className="inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-lg text-base md:text-lg font-semibold transition-all hover:shadow-lg hover:shadow-teal-500/25"
              >
                Apply to Work With Us
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="inline-flex items-center justify-center gap-2 text-gray-300 hover:text-white px-8 py-4 text-base md:text-lg font-medium transition-colors"
              >
                See How It Works
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Subtle gradient overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              A proven four-step process that fills your calendar with qualified appointments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step) => (
              <div
                key={step.number}
                className="relative bg-slate-50 rounded-2xl p-8 hover:bg-slate-100 transition-colors group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl font-bold text-slate-200 group-hover:text-teal-200 transition-colors">
                    {step.number}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-teal-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Built for Service Businesses
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We specialize in B2B lead generation for trades and service companies.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            {industries.map((industry) => (
              <div
                key={industry.name}
                className="bg-white rounded-xl p-5 md:p-6 text-center border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-slate-100 group-hover:bg-teal-50 flex items-center justify-center transition-colors">
                  <industry.icon className="w-5 h-5 text-slate-600 group-hover:text-teal-600 transition-colors" />
                </div>
                <span className="text-slate-900 font-medium text-sm">
                  {industry.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Guarantee */}
      <section className="py-20 md:py-28 bg-slate-900 relative overflow-hidden">
        {/* Accent border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-teal-500/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-teal-400" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Results or You Don't Pay
            </h2>

            <p className="mt-6 text-lg md:text-xl text-gray-400 leading-relaxed">
              We guarantee qualified appointments. If we don't deliver, you don't pay.
              <br className="hidden md:block" />
              Simple as that.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/plans"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-slate-900 px-6 py-3 rounded-lg text-base font-semibold transition-colors"
              >
                See Our Plans
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tools We Use */}
      <section className="py-16 md:py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
              Powered By Industry-Leading Tools
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Enterprise-grade tools. Boutique service.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-8 md:gap-x-12 gap-y-4">
            {tools.map((tool) => (
              <div
                key={tool}
                className="text-gray-400 hover:text-gray-600 font-medium text-sm md:text-base transition-colors"
              >
                {tool}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About the Founder */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
              {/* Founder Photo */}
              <div className="flex justify-center md:justify-start order-2 md:order-1">
                <Image
                  src="/robert-cole.jpg"
                  alt="Robert Cole, Founder of Kinect B2B"
                  width={400}
                  height={500}
                  className="rounded-2xl object-cover shadow-lg"
                />
              </div>

              {/* Content */}
              <div className="order-1 md:order-2">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                  Founder-Led.
                  <br />
                  Not Outsourced.
                </h2>

                <div className="mt-6 space-y-4">
                  <p className="text-gray-600 leading-relaxed">
                    After scaling multiple service businesses, Robert built Kinect B2B to solve the #1 problem every owner faces: finding qualified leads without wasting time on tire-kickers.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Every campaign gets direct oversight. Your growth isn't delegated to a junior rep in another country.
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <div>
                    <div className="font-semibold text-slate-900">Robert Cole</div>
                    <div className="text-sm text-gray-500">Founder, Kinect B2B</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-20 md:py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Ready to Fill Your Calendar?
            </h2>

            <p className="mt-4 text-lg text-gray-400">
              Limited availability. We only take on clients we know we can help.
            </p>

            <div className="mt-10">
              <Link
                href="/plans"
                className="inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:shadow-lg hover:shadow-teal-500/25"
              >
                Apply Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
