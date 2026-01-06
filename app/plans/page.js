'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  ChevronDown, ChevronRight, Check, Calendar, Users, BarChart3,
  Headphones, Target, MessageSquare, Star, X
} from 'lucide-react';

export default function Plans() {
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({
    businessName: '',
    name: '',
    phone: '',
    email: '',
    industry: '',
    revenue: ''
  });

  const plans = [
    {
      name: 'Starter',
      price: '$2,000-$3,000',
      period: '/month',
      description: 'For businesses under $500K revenue',
      appointments: '10-15 qualified appointments/month',
      features: [
        'Dedicated account manager',
        'CRM integration',
        'Weekly reporting',
        'Email + phone outreach'
      ],
      buttonText: 'Apply for Starter',
      popular: false
    },
    {
      name: 'Growth',
      price: '$4,000-$6,000',
      period: '/month',
      description: 'For businesses $500K-2M revenue',
      appointments: '20-30 qualified appointments/month',
      features: [
        'Senior account manager',
        'CRM + calendar integration',
        'Bi-weekly strategy calls',
        'Email + phone + LinkedIn outreach',
        'Priority support'
      ],
      buttonText: 'Apply for Growth',
      popular: true
    },
    {
      name: 'Scale',
      price: '$7,000-$10,000',
      period: '/month',
      description: 'For businesses $2M+ revenue',
      appointments: '40+ qualified appointments/month',
      features: [
        'Dedicated team (2+ reps)',
        'Full tech stack integration',
        'Weekly strategy calls',
        'Multi-channel outreach',
        'White-glove onboarding',
        'Custom reporting dashboard'
      ],
      buttonText: 'Apply for Scale',
      popular: false
    }
  ];

  const includedFeatures = [
    { icon: Target, text: 'Verified contact lists' },
    { icon: MessageSquare, text: 'Multi-touch outreach sequences' },
    { icon: Calendar, text: 'Appointment scheduling' },
    { icon: BarChart3, text: 'CRM updates' },
    { icon: Users, text: 'Performance reporting' },
    { icon: Headphones, text: 'Dedicated support' }
  ];

  const faqs = [
    {
      question: 'What counts as a qualified appointment?',
      answer: 'A scheduled call with a decision-maker who matches your ideal customer profile and has expressed interest.'
    },
    {
      question: "What if you don't hit the appointment numbers?",
      answer: 'We guarantee results. If we underdeliver, we credit your account or extend service at no cost.'
    },
    {
      question: 'How long until I see results?',
      answer: 'Most clients see first appointments within 2-3 weeks of campaign launch.'
    },
    {
      question: 'Do I need to sign a long-term contract?',
      answer: 'No. Month-to-month. Cancel anytime with 30-day notice.'
    }
  ];

  const handleOpenForm = (planName) => {
    setSelectedPlan(planName);
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
          questions: formData.revenue,
          selected_plan: selectedPlan,
          status: 'new'
        })
      });
      if (response.ok) {
        setShowSuccess(true);
        setShowForm(false);
        setFormData({ businessName: '', name: '', phone: '', email: '', industry: '', revenue: '' });
        setTimeout(() => setShowSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="/plans" />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Investment Levels
          </h1>
          <p className="text-xl md:text-2xl text-slate-600">
            Transparent pricing. No contracts. Results guaranteed.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl p-8 ${
                  plan.popular
                    ? 'border-2 border-teal-500 shadow-xl'
                    : 'border border-gray-200 shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-teal-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Star className="w-4 h-4" /> Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-slate-500 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl md:text-5xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-slate-500">{plan.period}</span>
                  </div>
                  <p className="text-teal-600 font-semibold mt-3">{plan.appointments}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleOpenForm(plan.name)}
                  className={`w-full py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-teal-500 hover:bg-teal-600 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {plan.buttonText}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What's Included in Every Plan
            </h2>
            <p className="text-lg text-slate-600">
              Every engagement comes with the essentials for success.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {includedFeatures.map((feature, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 flex items-center gap-4 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-teal-600" />
                </div>
                <span className="text-slate-700 font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition"
                >
                  <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5">
                    <p className="text-slate-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Not Sure Which Plan?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Book a 15-minute call. We'll help you figure out the right fit.
          </p>
          <a
            href="https://calendly.com/kinectb2b/discovery"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition"
          >
            <Calendar className="w-5 h-5" />
            Schedule a Call
          </a>
        </div>
      </section>

      <Footer />

      {/* Application Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-bold text-slate-900 mb-2">Apply Now</h3>
            {selectedPlan && (
              <p className="text-slate-600 mb-6">
                Selected plan: <span className="text-teal-600 font-semibold">{selectedPlan}</span>
              </p>
            )}
            {!selectedPlan && (
              <p className="text-slate-600 mb-6">Tell us about your business and we'll recommend the right plan.</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  placeholder="Your Company Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                  placeholder="HVAC, Plumbing, Roofing, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Annual Revenue</label>
                <select
                  name="revenue"
                  value={formData.revenue}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                >
                  <option value="">Select your revenue range</option>
                  <option value="Under $500K">Under $500K</option>
                  <option value="$500K - $1M">$500K - $1M</option>
                  <option value="$1M - $2M">$1M - $2M</option>
                  <option value="$2M - $5M">$2M - $5M</option>
                  <option value="$5M+">$5M+</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                {!isSubmitting && <ChevronRight className="w-5 h-5" />}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed bottom-8 right-8 z-50 bg-teal-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
          <Check className="w-6 h-6" />
          <div>
            <p className="font-semibold">Application Submitted</p>
            <p className="text-sm text-teal-100">We'll be in touch within 24 hours.</p>
          </div>
        </div>
      )}
    </div>
  );
}
