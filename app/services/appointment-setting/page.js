'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  ChevronRight, Search, Database, Send, CheckCircle, Calendar,
  Shield, Users, Flame, Droplets, Zap, Home, Trees, Sparkles, HardHat, Key,
  UserCheck, MapPin, Mail
} from 'lucide-react';

export default function AppointmentSettingPage() {
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
    { icon: UserCheck, title: 'Founder-led, not outsourced overseas' },
    { icon: MapPin, title: "Territory exclusive - we won't work with your competitors" },
    { icon: Shield, title: "Results guaranteed or you don't pay" },
    { icon: Users, title: 'Real humans, not just automated sequences' }
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
      <Header currentPage="/services/appointment-setting" />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            B2B Appointment Setting That Actually Works
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
            We find decision-makers, run the outreach, and book qualified meetings on your calendar. You just show up and close.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/plans"
              className="inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition"
            >
              See Pricing
              <ChevronRight className="w-5 h-5" />
            </Link>
            <a
              href="mailto:accounts@kinectb2b.com"
              className="inline-flex items-center justify-center gap-2 border-2 border-slate-600 hover:border-slate-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition"
            >
              <Mail className="w-5 h-5" />
              Contact Us
            </a>
          </div>
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
              Built for Service Businesses
            </h2>
            <p className="text-lg text-slate-600">
              We specialize in B2B appointment setting for trades and service companies.
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
            Let us fill your calendar with qualified appointments.
          </p>
          <Link
            href="/plans"
            className="inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition mb-4"
          >
            View Pricing
            <ChevronRight className="w-5 h-5" />
          </Link>
          <p className="text-slate-400">
            Or email{' '}
            <a href="mailto:accounts@kinectb2b.com" className="text-white hover:text-teal-400 transition">
              accounts@kinectb2b.com
            </a>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
