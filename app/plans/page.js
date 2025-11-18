'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Plans() {
  const [expandedPackage, setExpandedPackage] = useState(null);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [showPlanDetails, setShowPlanDetails] = useState(null);
  const [showCompare, setShowCompare] = useState(false);
  const [comparePlan1, setComparePlan1] = useState('');
  const [comparePlan2, setComparePlan2] = useState('');
  const [compareLoading, setCompareLoading] = useState(false);
  const [showTerritoryForm, setShowTerritoryForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedPlanForRequest, setSelectedPlanForRequest] = useState(null);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [selectedPlanForSignUp, setSelectedPlanForSignUp] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [appointmentsNeeded, setAppointmentsNeeded] = useState('');
  const [calculatorStep, setCalculatorStep] = useState('initial');
  const [selectedPlanForView, setSelectedPlanForView] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const [calculatorData, setCalculatorData] = useState({
  annualGoal: '',
  averageJobPrice: ''
});
const [calculatorResults, setCalculatorResults] = useState(null);
const [calculatorLoading, setCalculatorLoading] = useState(false);
const [expandedCalculatorPlan, setExpandedCalculatorPlan] = useState(null);
  const [territoryForm, setTerritoryForm] = useState({ name: '', zipCode: '', industry: '', phone: '', email: '' });
  const [requestForm, setRequestForm] = useState({ 
  fullName: '',
  businessName: '', 
  phone: '', 
  email: '', 
  questions: '',
  selectedPlan: ''
});
const [signUpForm, setSignUpForm] = useState({
  fullName: '',
  businessName: '',
  phone: '',
  email: '',
  selectedPlan: '',
  paymentType: 'monthly',
  industry: ''
});
  const [chatOpen, setChatOpen] = useState(false);
  const [chatStep, setChatStep] = useState('initial');
  const [chatData, setChatData] = useState({ name: '', zipCode: '', industry: '', phone: '', email: '' });
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  
  const compareRef = useRef(null);

  // Auto-open chatbot after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setChatOpen(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const packages = {
    standard: {
      name: 'Standard',
      startingPrice: 250,
      plans: [100, 200, 300],
      color: 'from-blue-500 to-cyan-500',
      recommended: 'Small Businesses',
      benefits: [
        'Guaranteed Leads',
        'Client Facing Portal',
        '1-2 Sales Reps',
        'Support Email',
        '1 Account Manager',
        'Territory/Industry Specific'
      ],
      testimonial: {
        name: "Mike Thompson",
        company: "Thompson Roofing",
        text: "Started with the Standard plan and booked 12 appointments in my first month. Best decision ever!",
        avatar: "👨‍💼"
      }
    },
    preferred: {
      name: 'Preferred',
      startingPrice: 1000,
      plans: [400, 500, 600],
      color: 'from-purple-500 to-pink-500',
      popular: true,
      recommended: 'Growing Businesses',
      benefits: [
        'All Standard Benefits',
        '3-4 Sales Reps',
        'Monthly Lead List',
        '10% off Websites',
        '10% off Automations',
        'Monthly Strategy Call'
      ],
      testimonial: {
        name: "Sarah Martinez",
        company: "Elite HVAC Solutions",
        text: "Upgraded to Preferred and our appointment rate tripled. The monthly strategy calls are game-changers!",
        avatar: "👩‍💼"
      }
    },
    premier: {
      name: 'Premier',
      startingPrice: 2000,
      plans: [700, 800, 900, 1000, 1100],
      color: 'from-orange-500 to-red-500',
      recommended: 'Established Companies',
      benefits: [
        'All Standard & Preferred Benefits',
        '2 Account Managers',
        '5-6 Sales Reps',
        '15% off Websites',
        '15% off Automations',
        '10% off Client Portals',
        'Bi-weekly Strategy Calls',
        'White Glove Service'
      ],
      testimonial: {
        name: "David Chen",
        company: "Pro Plumbing Group",
        text: "White glove service is unmatched. We scaled from 50 to 200 appointments per month with Premier.",
        avatar: "👨‍💼"
      }
    },
    vip: {
      name: 'VIP',
      startingPrice: 3000,
      plans: [1200],
      color: 'from-green-500 to-emerald-500',
      recommended: 'Enterprise Scale',
      benefits: [
        'All Standard, Preferred & Premier Benefits',
        '7+ Sales Reps',
        '3+ Account Managers',
        '25% off Websites',
        '25% off Automations',
        '25% off Client Portals',
        'Quarterly Business Review',
        'Monthly Sales Meeting'
      ],
      testimonial: {
        name: "Jennifer Williams",
        company: "National Home Services",
        text: "VIP tier handles our multi-location operation flawlessly. The quarterly reviews keep us ahead of the market.",
        avatar: "👩‍💼"
      }
    }
  };

  const getPlanDetails = (businesses) => {
    const price = businesses * 2.5;
    let salesReps, accountManagers;
    
    if (businesses <= 200) {
      salesReps = 1;
      accountManagers = 1;
    } else if (businesses === 300) {
      salesReps = 2;
      accountManagers = 1;
    } else if (businesses === 400) {
      salesReps = 3;
      accountManagers = 1;
    } else if (businesses >= 500 && businesses <= 600) {
      salesReps = 4;
      accountManagers = 1;
    } else if (businesses >= 700 && businesses <= 800) {
      salesReps = 5;
      accountManagers = 2;
    } else if (businesses >= 900 && businesses <= 1100) {
      salesReps = 6;
      accountManagers = 2;
    } else if (businesses >= 1200) {
      salesReps = 7;
      accountManagers = 3;
    }

    const decisionMakers = businesses * 3;
    const totalAttempts = decisionMakers * 9;
    const guarantee = Math.floor(businesses / 20);
    const teamGoal = guarantee * 5;

    return { price, salesReps, accountManagers, decisionMakers, totalAttempts, guarantee, teamGoal };
  };

  const handleChatSubmit = async () => {
    try {
      const response = await fetch('/api/territory-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chatData)
      });
      if (response.ok) {
        setChatStep('success');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: requestForm.fullName,
          business_name: requestForm.businessName,
          phone: requestForm.phone,
          email: requestForm.email,
          questions: requestForm.questions,
          selected_plan: requestForm.selectedPlan || selectedPlanForRequest,
          lead_type: 'plan_inquiry'
        })
      });

      if (response.ok) {
        setShowRequestForm(false);
        setShowSuccessMessage(true);
        setRequestForm({ fullName: '', businessName: '', phone: '', email: '', questions: '', selectedPlan: '' });
        setTimeout(() => setShowSuccessMessage(false), 5000);
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Something went wrong. Please try again.');
    }
  };

const handleSignUpSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: signUpForm.fullName,
        business_name: signUpForm.businessName,
        phone: signUpForm.phone,
        email: signUpForm.email,
        selected_plan: selectedPlanForSignUp,
        payment_type: signUpForm.paymentType,
        industry: signUpForm.industry,
        lead_type: 'sign_up'
      })
    });

    if (response.ok) {
      setShowSignUpForm(false);
      setShowSuccessMessage(true);
      setSignUpForm({ fullName: '', businessName: '', phone: '', email: '', selectedPlan: '', paymentType: 'monthly', industry: '' });
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong. Please try again.');
  }
};

const handleCalculatorSubmit = async (e) => {
  e.preventDefault();
  setCalculatorLoading(true);
  
  // Simulate thinking/loading
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const goal = calculatorData.annualGoal;
  let recommendations = [];
  
  if (goal === '250000') {
    recommendations = [
      { businesses: 300, highlight: false },
      { businesses: 400, highlight: true },
      { businesses: 500, highlight: false }
    ];
  } else if (goal === '500000') {
    recommendations = [
      { businesses: 400, highlight: false },
      { businesses: 500, highlight: true },
      { businesses: 600, highlight: false }
    ];
  } else if (goal === '750000') {
    recommendations = [
      { businesses: 700, highlight: false },
      { businesses: 800, highlight: true },
      { businesses: 900, highlight: false }
    ];
  } else if (goal === '1000000') {
    recommendations = [
      { businesses: 1000, highlight: false },
      { businesses: 1100, highlight: true },
      { businesses: 1200, highlight: false }
    ];
  } else if (goal === '2000000') {
    recommendations = [
      { businesses: 1100, highlight: false },
      { businesses: 1200, highlight: true },
      { businesses: 'custom', highlight: false }
    ];
  } else if (goal === '5000000' || goal === '10000000') {
    recommendations = [
      { businesses: 'custom', highlight: true }
    ];
  }
  
  setCalculatorResults(recommendations);
  setCalculatorLoading(false);
};

const getFullPlanDetails = (businesses) => {
  const basicDetails = getPlanDetails(businesses);
  
  // Base benefits for all plans
  const benefits = {
    guaranteedLeads: true,
    clientPortal: true,
    supportEmail: true,
    territorySpecific: true,
    monthlyLeadList: false,
    websiteDiscount: 0,
    automationDiscount: 0,
    portalDiscount: 0,
    strategyCall: '',
    whiteGlove: false,
    businessReview: '',
    salesMeeting: ''
  };

  // Adjust benefits based on business count
  if (businesses >= 400) {
    benefits.monthlyLeadList = true;
    benefits.websiteDiscount = 10;
    benefits.automationDiscount = 10;
    benefits.strategyCall = 'Monthly';
  }
  if (businesses >= 700) {
    benefits.websiteDiscount = 15;
    benefits.automationDiscount = 15;
    benefits.portalDiscount = 10;
    benefits.strategyCall = 'Bi-weekly';
    benefits.whiteGlove = true;
  }
  if (businesses >= 1200) {
    benefits.websiteDiscount = 25;
    benefits.automationDiscount = 25;
    benefits.portalDiscount = 25;
    benefits.businessReview = 'Quarterly';
    benefits.salesMeeting = 'Monthly';
  }

  return { ...basicDetails, ...benefits };
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative bg-gradient-to-r from-slate-900/80 to-blue-900/80 backdrop-blur-xl border-b border-white/10 z-[100]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
              <a href="/about" className="text-gray-300 hover:text-cyan-400 transition">About</a>
              
              <div className="relative">
                <button 
                  onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  className="text-white hover:text-cyan-400 transition font-bold flex items-center gap-1 py-2 px-2"
                >
                  Our Services
                  <span className="text-sm">{servicesDropdownOpen ? '▲' : '▼'}</span>
                </button>
                {servicesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl shadow-2xl z-[200]">
                    <a href="/plans" className="block px-4 py-3 text-white hover:text-cyan-400 hover:bg-cyan-500/20 transition rounded-t-xl font-bold">Plans</a>
                    <a href="/services/websites" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-cyan-500/20 transition">Websites</a>
                    <a href="/services/automations" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-cyan-500/20 transition">Automations</a>
                    <a href="/services/portals" className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-cyan-500/20 transition rounded-b-xl">Portals</a>
                  </div>
                )}
              </div>

              <a href="/affiliate" className="text-gray-300 hover:text-cyan-400 transition">Affiliate Program</a>
              <a href="/portal" className="text-gray-300 hover:text-cyan-400 transition">Client Login</a>
            </nav>

            {/* Mobile Hamburger */}
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
              <a href="/about" className="block px-4 py-3 text-gray-300 hover:bg-cyan-500/20 rounded-lg transition">About</a>
              
              <div>
                <button 
                  onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  className="w-full text-left px-4 py-3 text-white hover:bg-cyan-500/20 rounded-lg transition font-bold flex items-center justify-between"
                >
                  Our Services
                  <span className="text-sm">{servicesDropdownOpen ? '▲' : '▼'}</span>
                </button>
                {servicesDropdownOpen && (
                  <div className="ml-4 mt-2 space-y-2">
                    <a href="/plans" className="block px-4 py-2 text-white hover:bg-cyan-500/20 rounded-lg transition text-sm font-bold">Plans</a>
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
            <span className="text-white">Choose Your</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Growth Plan
            </span>
          </h1>

          <p className="text-lg md:text-2xl lg:text-3xl text-gray-300 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed">
            Scalable appointment setting solutions designed for businesses at every stage of growth.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setShowCalculator(true)}
              className="w-full sm:w-auto px-6 md:px-12 py-4 md:py-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-full text-white font-black text-base md:text-2xl transition-all duration-300 shadow-2xl hover:shadow-cyan-500/50 hover:scale-105"
            >
              Calculate What You Need 🧮
            </button>

            <button
              onClick={() => setChatOpen(true)}
              className="w-full sm:w-auto px-6 md:px-12 py-4 md:py-6 border-2 border-cyan-500 hover:bg-cyan-500/10 rounded-full text-cyan-400 font-black text-base md:text-2xl transition-all duration-300 hover:scale-105"
            >
              Check Territory Availability 📍
            </button>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="relative py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {Object.entries(packages).map(([key, pkg]) => (
              <div key={key} className="group relative">
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 md:px-6 py-1 md:py-2 rounded-full text-xs md:text-sm font-black">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 rounded-3xl"></div>
                
                <div className={`relative bg-gradient-to-br ${pkg.color} p-1 rounded-3xl`}>
                  <div className="bg-slate-900 rounded-3xl p-6 md:p-8">
                    <div className="text-center mb-6 md:mb-8">
                      <h3 className="text-3xl md:text-4xl font-black text-white mb-2 md:mb-3">{pkg.name}</h3>
                      <p className="text-cyan-400 text-base md:text-lg font-bold">{pkg.recommended}</p>
                      <div className="mt-4 md:mt-6">
                        <span className="text-gray-400 text-sm md:text-base">Starting at</span>
                        <div className="text-4xl md:text-5xl font-black text-white mt-2">
                          ${pkg.startingPrice}<span className="text-lg md:text-xl text-gray-400">/mo</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                      {pkg.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-gray-300">
                          <span className="text-green-400 text-lg md:text-xl">✓</span>
                          <span className="text-sm md:text-base">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setExpandedPackage(expandedPackage === key ? null : key)}
                      className="w-full py-3 md:py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-xl text-white font-black text-base md:text-lg transition-all duration-300 hover:scale-105"
                    >
                      {expandedPackage === key ? 'Hide Plans' : 'View Available Plans'}
                    </button>

                    {expandedPackage === key && (
                      <div className="mt-6 space-y-3 md:space-y-4 animate-fadeIn">
                        {pkg.plans.map((businesses) => {
                          const details = getPlanDetails(businesses);
                          const fullDetails = getFullPlanDetails(businesses);
                          const planKey = `${key}-${businesses}`;
                          const isExpanded = expandedPlan === planKey;
                          const showDetails = showPlanDetails === planKey;
                          
                          return (
                            <div
                              key={businesses}
                              className="group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20"
                            >
                              {/* Gradient accent bar on top */}
                              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${pkg.color}`}></div>
                              
                              <div className="p-5 md:p-7">
                                <div className="flex justify-between items-start cursor-pointer" onClick={() => setExpandedPlan(isExpanded ? null : planKey)}>
                                  <div className="flex-1">
                                    <h4 className="text-xl md:text-3xl font-black text-white mb-2">
                                      PRO PLAN {businesses}
                                    </h4>
                                    <p className="text-xs md:text-sm text-gray-400 flex items-center gap-2">
                                      <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                      {details.teamGoal} appointment team goal
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                      ${details.price}
                                    </div>
                                    <div className="text-xs text-gray-500">/month</div>
                                    <button className="mt-2 px-3 py-1 bg-slate-700/50 rounded-full text-xs text-gray-400 hover:text-cyan-400 transition flex items-center gap-1">
                                      {isExpanded ? '▲ Hide' : '▼ View'}
                                    </button>
                                  </div>
                                </div>

                                {isExpanded && (
                                  <div className="mt-6 pt-6 border-t border-white/10 space-y-4 animate-fadeIn">
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="relative group/stat">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-600/5 rounded-xl blur-sm"></div>
                                        <div className="relative bg-gradient-to-br from-blue-600/20 to-transparent border border-blue-500/30 rounded-xl p-4 hover:border-blue-400/50 transition">
                                          <div className="text-blue-400 font-semibold text-xs mb-1 uppercase tracking-wide">Targeted Businesses</div>
                                          <div className="text-white text-2xl font-black">{businesses}</div>
                                        </div>
                                      </div>

                                      <div className="relative group/stat">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-purple-600/5 rounded-xl blur-sm"></div>
                                        <div className="relative bg-gradient-to-br from-purple-600/20 to-transparent border border-purple-500/30 rounded-xl p-4 hover:border-purple-400/50 transition">
                                          <div className="text-purple-400 font-semibold text-xs mb-1 uppercase tracking-wide">Total Contacts</div>
                                          <div className="text-white text-2xl font-black">{details.totalAttempts.toLocaleString()}</div>
                                        </div>
                                      </div>

                                      <div className="relative group/stat">
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-green-600/5 rounded-xl blur-sm"></div>
                                        <div className="relative bg-gradient-to-br from-green-600/20 to-transparent border border-green-500/30 rounded-xl p-4 hover:border-green-400/50 transition">
                                          <div className="text-green-400 font-semibold text-xs mb-1 uppercase tracking-wide">Appointments</div>
                                          <div className="text-white text-2xl font-black">{details.guarantee} - {details.teamGoal}</div>
                                        </div>
                                      </div>

                                      <div className="relative group/stat">
                                        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-orange-600/5 rounded-xl blur-sm"></div>
                                        <div className="relative bg-gradient-to-br from-orange-600/20 to-transparent border border-orange-500/30 rounded-xl p-4 hover:border-orange-400/50 transition">
                                          <div className="text-orange-400 font-semibold text-xs mb-1 uppercase tracking-wide">Sales Reps</div>
                                          <div className="text-white text-2xl font-black">{details.salesReps}</div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Show More Details Button */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setShowPlanDetails(showDetails ? null : planKey);
                                      }}
                                      className="w-full py-3 bg-gradient-to-r from-slate-700/50 to-slate-800/50 border border-cyan-500/30 text-cyan-400 font-bold rounded-xl hover:from-slate-700/70 hover:to-slate-800/70 hover:border-cyan-400/50 transition text-sm flex items-center justify-center gap-2"
                                    >
                                      {showDetails ? (
                                        <>
                                          <span>Hide Full Details</span>
                                          <span className="text-xs">▲</span>
                                        </>
                                      ) : (
                                        <>
                                          <span>Show Full Details & Benefits</span>
                                          <span className="text-xs">▼</span>
                                        </>
                                      )}
                                    </button>

                                    {/* Expandable Details Section */}
                                    {showDetails && (
                                      <div className="space-y-4 p-5 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-cyan-500/20 rounded-xl animate-fadeIn">
                                        {/* Full Details */}
                                        <div>
                                          <div className="flex items-center gap-2 mb-3">
                                            <div className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
                                            <h5 className="text-white font-black text-sm uppercase tracking-wide">Complete Breakdown</h5>
                                          </div>
                                          <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="flex justify-between items-center py-2 px-3 bg-slate-800/50 rounded-lg">
                                              <span className="text-gray-400">Contacts</span>
                                              <span className="text-white font-bold">{details.decisionMakers}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 px-3 bg-slate-800/50 rounded-lg">
                                              <span className="text-gray-400">Calls</span>
                                              <span className="text-white font-bold">{(details.decisionMakers * 3).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 px-3 bg-slate-800/50 rounded-lg">
                                              <span className="text-gray-400">Emails</span>
                                              <span className="text-white font-bold">{(details.decisionMakers * 3).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 px-3 bg-slate-800/50 rounded-lg">
                                              <span className="text-gray-400">SMS</span>
                                              <span className="text-white font-bold">{(details.decisionMakers * 3).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 px-3 bg-slate-800/50 rounded-lg">
                                              <span className="text-gray-400">Account Managers</span>
                                              <span className="text-white font-bold">{details.accountManagers}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 px-3 bg-slate-800/50 rounded-lg">
                                              <span className="text-gray-400">Team Goal</span>
                                              <span className="text-cyan-400 font-bold">{details.teamGoal}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 px-3 bg-slate-800/50 rounded-lg col-span-2">
                                              <span className="text-gray-400">Guarantee</span>
                                              <span className="text-green-400 font-bold">{details.guarantee} appointments</span>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        {/* Benefits */}
                                        <div>
                                          <div className="flex items-center gap-2 mb-3">
                                            <div className="w-1 h-4 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full"></div>
                                            <h5 className="text-white font-black text-sm uppercase tracking-wide">Included Benefits</h5>
                                          </div>
                                          <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="flex items-center gap-2 py-2 px-3 bg-slate-800/50 rounded-lg">
                                              <span className="text-green-400 text-sm">✓</span>
                                              <span className="text-gray-300">Guaranteed Leads</span>
                                            </div>
                                            <div className="flex items-center gap-2 py-2 px-3 bg-slate-800/50 rounded-lg">
                                              <span className="text-green-400 text-sm">✓</span>
                                              <span className="text-gray-300">Client Portal</span>
                                            </div>
                                            <div className="flex items-center gap-2 py-2 px-3 bg-slate-800/50 rounded-lg">
                                              <span className="text-green-400 text-sm">✓</span>
                                              <span className="text-gray-300">Support Email</span>
                                            </div>
                                            <div className="flex items-center gap-2 py-2 px-3 bg-slate-800/50 rounded-lg">
                                              <span className="text-green-400 text-sm">✓</span>
                                              <span className="text-gray-300">Territory Specific</span>
                                            </div>
                                            {fullDetails.monthlyLeadList && (
                                              <div className="flex items-center gap-2 py-2 px-3 bg-slate-800/50 rounded-lg">
                                                <span className="text-green-400 text-sm">✓</span>
                                                <span className="text-gray-300">Monthly Lead List</span>
                                              </div>
                                            )}
                                            {fullDetails.websiteDiscount > 0 && (
                                              <div className="flex items-center gap-2 py-2 px-3 bg-slate-800/50 rounded-lg">
                                                <span className="text-cyan-400 font-bold">{fullDetails.websiteDiscount}%</span>
                                                <span className="text-gray-300">Website Discount</span>
                                              </div>
                                            )}
                                            {fullDetails.automationDiscount > 0 && (
                                              <div className="flex items-center gap-2 py-2 px-3 bg-slate-800/50 rounded-lg">
                                                <span className="text-cyan-400 font-bold">{fullDetails.automationDiscount}%</span>
                                                <span className="text-gray-300">Automation Discount</span>
                                              </div>
                                            )}
                                            {fullDetails.portalDiscount > 0 && (
                                              <div className="flex items-center gap-2 py-2 px-3 bg-slate-800/50 rounded-lg">
                                                <span className="text-cyan-400 font-bold">{fullDetails.portalDiscount}%</span>
                                                <span className="text-gray-300">Portal Discount</span>
                                              </div>
                                            )}
                                            {fullDetails.strategyCall && (
                                              <div className="flex items-center gap-2 py-2 px-3 bg-slate-800/50 rounded-lg">
                                                <span className="text-purple-400 text-sm">📞</span>
                                                <span className="text-gray-300">{fullDetails.strategyCall} Strategy</span>
                                              </div>
                                            )}
                                            {fullDetails.whiteGlove && (
                                              <div className="flex items-center gap-2 py-2 px-3 bg-slate-800/50 rounded-lg">
                                                <span className="text-yellow-400 text-sm">⭐</span>
                                                <span className="text-gray-300">White Glove Service</span>
                                              </div>
                                            )}
                                            {fullDetails.businessReview && (
                                              <div className="flex items-center gap-2 py-2 px-3 bg-slate-800/50 rounded-lg">
                                                <span className="text-blue-400 text-sm">📊</span>
                                                <span className="text-gray-300">{fullDetails.businessReview} Review</span>
                                              </div>
                                            )}
                                            {fullDetails.salesMeeting && (
                                              <div className="flex items-center gap-2 py-2 px-3 bg-slate-800/50 rounded-lg">
                                                <span className="text-orange-400 text-sm">🤝</span>
                                                <span className="text-gray-300">{fullDetails.salesMeeting} Sales Mtg</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedPlanForSignUp(`${pkg.name} - PRO PLAN ${businesses}`);
                                          setShowSignUpForm(true);
                                        }}
                                        className="group/btn relative overflow-hidden py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl text-white font-black text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/50"
                                      >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                                        <span className="relative">Sign Up Now 🚀</span>
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedPlanForRequest(`${pkg.name} - PRO PLAN ${businesses}`);
                                          setShowRequestForm(true);
                                        }}
                                        className="py-4 border-2 border-cyan-500 hover:bg-cyan-500/10 rounded-xl text-cyan-400 font-black text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30"
                                      >
                                        Request Info 💬
                                      </button>
                                    </div>

                                    {/* Compare Button */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setComparePlan1(businesses);
                                        setShowCompare(true);
                                      }}
                                      className="w-full py-3 bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 hover:border-orange-400/50 rounded-xl text-orange-400 font-bold text-sm transition-all duration-300 hover:scale-[1.02]"
                                    >
                                      ⚖️ Compare with Another Plan
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Testimonial */}
                    <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-white/10">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className="text-3xl md:text-4xl">{pkg.testimonial.avatar}</div>
                        <div>
                          <p className="text-gray-300 italic text-sm md:text-base mb-2 md:mb-3">"{pkg.testimonial.text}"</p>
                          <div className="font-bold text-white text-sm md:text-base">{pkg.testimonial.name}</div>
                          <div className="text-cyan-400 text-xs md:text-sm">{pkg.testimonial.company}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chatbot - Mobile Friendly */}
      {chatOpen && (
        <div className="fixed inset-0 md:inset-auto md:bottom-8 md:right-8 z-50 p-4 md:p-0">
          <div className="relative h-full md:h-auto md:w-[420px]">
            <div 
              className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm -z-10"
              onClick={() => setChatOpen(false)}
            ></div>

            <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl blur-xl opacity-75"></div>
            
            <div className="relative h-full md:h-auto bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-green-500/50 rounded-3xl shadow-2xl flex flex-col max-h-screen md:max-h-[600px]">
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-xl md:text-2xl animate-pulse">
                    📍
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-black text-white">Territory Check</h3>
                    <p className="text-xs md:text-sm text-green-400">● Available Now</p>
                  </div>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full p-2 transition"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                {chatStep === 'initial' && (
                  <div className="animate-fadeIn">
                    <div className="bg-green-600/20 border border-green-500/30 rounded-2xl p-4 md:p-6 mb-6">
                      <h3 className="text-xl md:text-2xl font-black text-white mb-3 md:mb-4">
                        Check Territory Availability 📍
                      </h3>
                      <p className="text-sm md:text-base text-gray-300">
                        Let's see if we're already working with someone in your area. What's your name?
                      </p>
                    </div>

                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Your Name"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm md:text-base placeholder-gray-400 focus:outline-none focus:border-green-400 transition"
                        onChange={(e) => setChatData({...chatData, name: e.target.value})}
                      />
                      <button
                        onClick={() => chatData.name && setChatStep('getZipCode')}
                        disabled={!chatData.name}
                        className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-105 transition duration-300 rounded-xl text-white font-black text-sm md:text-base disabled:opacity-50"
                      >
                        Continue →
                      </button>
                    </div>
                  </div>
                )}

                {chatStep === 'getZipCode' && (
                  <div className="animate-fadeIn">
                    <div className="bg-green-600/20 border border-green-500/30 rounded-2xl p-4 mb-6">
                      <p className="text-white font-bold">Hi {chatData.name}! 👋</p>
                      <p className="text-gray-300 mt-2 text-sm md:text-base">What's your zip code?</p>
                    </div>

                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Your Zip Code"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition"
                        onChange={(e) => setChatData({...chatData, zipCode: e.target.value})}
                      />
                      <button
                        onClick={() => chatData.zipCode && setChatStep('getIndustry')}
                        disabled={!chatData.zipCode}
                        className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-105 transition duration-300 rounded-xl text-white font-black disabled:opacity-50"
                      >
                        Continue →
                      </button>
                    </div>
                  </div>
                )}

                {chatStep === 'getIndustry' && (
                  <div className="animate-fadeIn">
                    <div className="bg-green-600/20 border border-green-500/30 rounded-2xl p-4 mb-6">
                      <p className="text-white font-bold">Great! Thanks {chatData.name}!</p>
                      <p className="text-gray-300 mt-2">What industry are you in?</p>
                    </div>

                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Your Industry (e.g. HVAC, Roofing, etc.)"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition"
                        onChange={(e) => setChatData({...chatData, industry: e.target.value})}
                      />
                      <button
                        onClick={() => chatData.industry && setChatStep('checking')}
                        disabled={!chatData.industry}
                        className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-105 transition duration-300 rounded-xl text-white font-black disabled:opacity-50"
                      >
                        Continue →
                      </button>
                    </div>
                  </div>
                )}

                {chatStep === 'checking' && (
                  <div className="animate-fadeIn text-center py-8">
                    <div className="text-5xl md:text-6xl mb-4 animate-pulse">🔍</div>
                    <p className="text-white font-bold text-base md:text-lg">Awesome! I am checking into this now...</p>
                    <div className="mt-6">
                      <button
                        onClick={() => setChatStep('available')}
                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white font-bold"
                      >
                        View Results
                      </button>
                    </div>
                  </div>
                )}

                {chatStep === 'available' && (
                  <div className="animate-fadeIn">
                    <div className="bg-green-600/30 border-2 border-green-500/50 rounded-2xl p-4 md:p-6 mb-6">
                      <div className="text-center">
                        <div className="text-5xl md:text-6xl mb-4">✅</div>
                        <p className="text-green-400 font-black text-xl md:text-2xl mb-2">Great News!</p>
                        <p className="text-white font-bold text-sm md:text-base">We are not working with anyone in your area with your zip code!</p>
                      </div>
                    </div>

                    <div className="bg-blue-600/20 border border-blue-500/30 rounded-2xl p-4 mb-6">
                      <p className="text-white font-bold mb-2 text-sm md:text-base">📋 Let me send you over a sample list of contacts we have in your area!</p>
                      <p className="text-gray-300 text-xs md:text-sm">What's your phone number and email?</p>
                    </div>

                    <div className="space-y-4">
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition"
                        onChange={(e) => setChatData({...chatData, phone: e.target.value})}
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition"
                        onChange={(e) => setChatData({...chatData, email: e.target.value})}
                      />
                      <button
                        onClick={() => chatData.phone && chatData.email && handleChatSubmit()}
                        disabled={!chatData.phone || !chatData.email}
                        className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:scale-105 transition duration-300 rounded-xl text-white font-black disabled:opacity-50"
                      >
                        Send Me The Sample! 🚀
                      </button>
                    </div>
                  </div>
                )}

                {chatStep === 'success' && (
                  <div className="text-center py-6 md:py-8 animate-fadeIn">
                    <div className="text-5xl md:text-6xl mb-4">🎉</div>
                    <h3 className="text-xl md:text-2xl font-black text-white mb-4">Request Sent!</h3>
                    <div className="bg-green-600/20 border border-green-500/30 rounded-2xl p-4 md:p-6 mb-6">
                      <p className="text-white font-bold mb-4 text-sm md:text-base">Great! I have sent this request over!</p>
                      <p className="text-gray-300 text-xs md:text-sm mb-2">In the meantime, if you have any questions:</p>
                      <div className="space-y-2 text-cyan-400 text-xs md:text-sm">
                        <div>📞 Call or Text: <a href="tel:2192077863" className="font-bold hover:text-cyan-300">219-207-7863</a></div>
                        <div>📧 Email: <a href="mailto:accounts@kinectb2b.com" className="font-bold hover:text-cyan-300">accounts@kinectb2b.com</a></div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setChatStep('initial');
                        setChatData({ name: '', zipCode: '', industry: '', phone: '', email: '' });
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full text-white font-bold hover:scale-110 transition"
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

      {/* Floating Chat Button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full blur-xl opacity-75 group-hover:opacity-100 animate-pulse"></div>
          <div className="relative w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-2xl md:text-3xl hover:scale-110 transition duration-300 shadow-2xl">
            💬
          </div>
        </button>
      )}

      {/* Request Form Modal - Mobile Friendly */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/30 rounded-3xl p-6 md:p-8">
              <button
                onClick={() => setShowRequestForm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl md:text-3xl"
              >
                ×
              </button>

              <h3 className="text-2xl md:text-4xl font-black text-white mb-6">Request More Information</h3>
              
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  required
                  value={requestForm.fullName}
                  onChange={(e) => setRequestForm({...requestForm, fullName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-sm md:text-base"
                />

                <input
                  type="text"
                  placeholder="Business Name *"
                  required
                  value={requestForm.businessName}
                  onChange={(e) => setRequestForm({...requestForm, businessName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-sm md:text-base"
                />

                <input
                  type="tel"
                  placeholder="Phone *"
                  required
                  value={requestForm.phone}
                  onChange={(e) => setRequestForm({...requestForm, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-sm md:text-base"
                />

                <input
                  type="email"
                  placeholder="Email *"
                  required
                  value={requestForm.email}
                  onChange={(e) => setRequestForm({...requestForm, email: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-sm md:text-base"
                />

                <textarea
                  placeholder="Questions or Additional Information"
                  rows={4}
                  value={requestForm.questions}
                  onChange={(e) => setRequestForm({...requestForm, questions: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-sm md:text-base"
                ></textarea>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black text-lg md:text-xl rounded-xl hover:scale-105 transition-all duration-300"
                >
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Sign Up Form Modal - Mobile Friendly */}
      {showSignUpForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/30 to-emerald-600/30 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-green-500/30 rounded-3xl p-6 md:p-8">
              <button
                onClick={() => setShowSignUpForm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl md:text-3xl"
              >
                ×
              </button>

              <h3 className="text-2xl md:text-4xl font-black text-white mb-2">Sign Up Now!</h3>
              <p className="text-cyan-400 font-bold mb-6 text-sm md:text-base">{selectedPlanForSignUp}</p>
              
              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  required
                  value={signUpForm.fullName}
                  onChange={(e) => setSignUpForm({...signUpForm, fullName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-green-500/30 rounded-xl text-white focus:outline-none focus:border-green-400 text-sm md:text-base"
                />

                <input
                  type="text"
                  placeholder="Business Name *"
                  required
                  value={signUpForm.businessName}
                  onChange={(e) => setSignUpForm({...signUpForm, businessName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-green-500/30 rounded-xl text-white focus:outline-none focus:border-green-400 text-sm md:text-base"
                />

                <input
                  type="tel"
                  placeholder="Phone *"
                  required
                  value={signUpForm.phone}
                  onChange={(e) => setSignUpForm({...signUpForm, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-green-500/30 rounded-xl text-white focus:outline-none focus:border-green-400 text-sm md:text-base"
                />

                <input
                  type="email"
                  placeholder="Email *"
                  required
                  value={signUpForm.email}
                  onChange={(e) => setSignUpForm({...signUpForm, email: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-green-500/30 rounded-xl text-white focus:outline-none focus:border-green-400 text-sm md:text-base"
                />

                <input
                  type="text"
                  placeholder="Industry *"
                  required
                  value={signUpForm.industry}
                  onChange={(e) => setSignUpForm({...signUpForm, industry: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-green-500/30 rounded-xl text-white focus:outline-none focus:border-green-400 text-sm md:text-base"
                />

                <div>
                  <label className="block text-gray-300 mb-2 font-bold text-sm md:text-base">Payment Preference</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setSignUpForm({...signUpForm, paymentType: 'monthly'})}
                      className={`py-3 rounded-xl font-bold transition text-sm md:text-base ${
                        signUpForm.paymentType === 'monthly'
                          ? 'bg-green-600 text-white'
                          : 'bg-slate-700/50 text-gray-400 hover:bg-slate-700'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignUpForm({...signUpForm, paymentType: 'annual'})}
                      className={`py-3 rounded-xl font-bold transition text-sm md:text-base ${
                        signUpForm.paymentType === 'annual'
                          ? 'bg-green-600 text-white'
                          : 'bg-slate-700/50 text-gray-400 hover:bg-slate-700'
                      }`}
                    >
                      Annual (Save 10%)
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black text-lg md:text-xl rounded-xl hover:scale-105 transition-all duration-300"
                >
                  Complete Sign Up 🚀
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 md:top-8 left-1/2 transform -translate-x-1/2 z-[1001] animate-fadeIn">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 border border-green-400 rounded-2xl p-4 md:p-6 shadow-2xl max-w-md">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="text-3xl md:text-4xl">✅</div>
              <div>
                <h4 className="text-white font-black text-base md:text-lg">Success!</h4>
                <p className="text-green-100 text-sm md:text-base">We'll be in touch within 24 hours.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calculator Modal */}
      {showCalculator && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 rounded-3xl p-6 md:p-8">
              <button
                onClick={() => {
                  setShowCalculator(false);
                  setCalculatorResults(null);
                  setCalculatorData({ annualGoal: '', averageJobPrice: '' });
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl md:text-3xl"
              >
                ×
              </button>

              <h3 className="text-3xl md:text-5xl font-black text-white mb-4 text-center">
                Choose The Right Plan For You!
              </h3>

              {!calculatorResults && !calculatorLoading && (
                <form onSubmit={handleCalculatorSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-300 mb-3 font-bold text-lg">Choose Your Annual Goal</label>
                    <select
                      required
                      value={calculatorData.annualGoal}
                      onChange={(e) => setCalculatorData({...calculatorData, annualGoal: e.target.value})}
                      className="w-full px-4 py-4 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-400 text-lg"
                    >
                      <option value="">Select your annual revenue goal...</option>
                      <option value="250000">$250,000</option>
                      <option value="500000">$500,000</option>
                      <option value="750000">$750,000</option>
                      <option value="1000000">$1,000,000</option>
                      <option value="2000000">$2,000,000</option>
                      <option value="5000000">$5,000,000</option>
                      <option value="10000000">$10,000,000+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-3 font-bold text-lg">Select Your Average Price Per Job</label>
                    <select
                      required
                      value={calculatorData.averageJobPrice}
                      onChange={(e) => setCalculatorData({...calculatorData, averageJobPrice: e.target.value})}
                      className="w-full px-4 py-4 bg-slate-700/50 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-purple-400 text-lg"
                    >
                      <option value="">Select average job price...</option>
                      <option value="49-149">$49 - $149</option>
                      <option value="150-299">$150 - $299</option>
                      <option value="300-599">$300 - $599</option>
                      <option value="600-899">$600 - $899</option>
                      <option value="900-1499">$900 - $1,499</option>
                      <option value="1500-2499">$1,500 - $2,499</option>
                      <option value="2500-3999">$2,500 - $3,999</option>
                      <option value="4000-5000">$4,000 - $5,000</option>
                      <option value="5000-7499">$5,000 - $7,499</option>
                      <option value="7500-10000">$7,500 - $10,000</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-xl rounded-xl hover:scale-105 transition-all duration-300"
                  >
                    Calculate My Perfect Plan 🚀
                  </button>
                </form>
              )}

              {calculatorLoading && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-6 animate-pulse">🧮</div>
                  <p className="text-white font-bold text-2xl mb-4">Analyzing Your Business...</p>
                  <p className="text-gray-400 text-lg">Finding the perfect plan for your goals...</p>
                </div>
              )}

              {calculatorResults && !calculatorLoading && (
                <div className="space-y-6">
                  <p className="text-center text-gray-300 text-lg mb-8">
                    Based on your ${parseInt(calculatorData.annualGoal).toLocaleString()} annual goal, here are our recommendations:
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {calculatorResults.map((rec, index) => {
                      if (rec.businesses === 'custom') {
                        return (
                          <div key={index} className={`relative group ${rec.highlight ? 'md:scale-110 z-10' : ''}`}>
                            <div className={`absolute inset-0 bg-gradient-to-r ${rec.highlight ? 'from-yellow-500/30 to-orange-500/30' : 'from-blue-500/20 to-cyan-500/20'} rounded-2xl blur-xl`}></div>
                            <div className={`relative bg-gradient-to-br from-slate-800 to-slate-900 border ${rec.highlight ? 'border-yellow-500/50' : 'border-blue-500/30'} rounded-2xl p-6`}>
                              {rec.highlight && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-1 rounded-full text-white font-black text-sm">
                                  RECOMMENDED
                                </div>
                              )}
                              <h4 className="text-2xl font-black text-white mb-4 text-center">Custom Plan</h4>
                              <p className="text-gray-300 text-center mb-6">Completely Customizable</p>
                              <div className="space-y-3 mb-6">
                                <p className="text-white text-center">Contact us to discuss your specific needs:</p>
                                <a href="mailto:accounts@kinectb2b.com" className="block text-cyan-400 hover:text-cyan-300 font-bold text-center">
                                  accounts@kinectb2b.com
                                </a>
                                <a href="tel:2192077863" className="block text-cyan-400 hover:text-cyan-300 font-bold text-center">
                                  (219) 207-7863
                                </a>
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedPlanForRequest('Custom Plan');
                                  setShowCalculator(false);
                                  setShowRequestForm(true);
                                }}
                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:scale-105 transition"
                              >
                                Request More Info
                              </button>
                            </div>
                          </div>
                        );
                      }

                      const details = getPlanDetails(rec.businesses);
                      const fullDetails = getFullPlanDetails(rec.businesses);
                      const isExpanded = expandedCalculatorPlan === rec.businesses;
                      
                      return (
                        <div key={index} className={`relative group ${rec.highlight ? 'md:scale-110 z-10' : ''}`}>
                          <div className={`absolute inset-0 bg-gradient-to-r ${rec.highlight ? 'from-green-500/30 to-emerald-500/30' : 'from-blue-500/20 to-cyan-500/20'} rounded-2xl blur-xl`}></div>
                          <div className={`relative bg-gradient-to-br from-slate-800 to-slate-900 border ${rec.highlight ? 'border-green-500/50' : 'border-blue-500/30'} rounded-2xl p-6`}>
                            {rec.highlight && (
                              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-1 rounded-full text-white font-black text-sm">
                                RECOMMENDED
                              </div>
                            )}
                            <h4 className="text-2xl font-black text-white mb-2 text-center">Pro Plan {rec.businesses}</h4>
                            <p className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent text-center mb-4">
                              ${details.price.toLocaleString()}/mo
                            </p>
                            <div className="space-y-2 text-sm mb-4">
                              <div className="flex justify-between text-gray-300">
                                <span>Targeted Businesses:</span>
                                <span className="font-bold text-white">{rec.businesses}</span>
                              </div>
                              <div className="flex justify-between text-gray-300">
                                <span>Total Points of Contact:</span>
                                <span className="font-bold text-white">{details.totalAttempts.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-gray-300">
                                <span>Appointments:</span>
                                <span className="font-bold text-green-400">{details.guarantee} - {details.teamGoal}</span>
                              </div>
                              <div className="flex justify-between text-gray-300">
                                <span>Sales Reps:</span>
                                <span className="font-bold text-white">{details.salesReps}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => setExpandedCalculatorPlan(isExpanded ? null : rec.businesses)}
                              className="w-full py-2 bg-slate-700/50 border border-cyan-500/30 text-cyan-400 font-bold rounded-xl hover:bg-cyan-500/10 transition mb-2 text-sm"
                            >
                              {isExpanded ? 'Hide Details ▲' : 'Show More Details ▼'}
                            </button>

                            {isExpanded && (
                              <div className="space-y-3 mb-4 p-4 bg-slate-700/30 rounded-xl animate-fadeIn">
                                <div className="border-b border-white/10 pb-2">
                                  <h5 className="text-white font-bold text-xs mb-2">📊 FULL DETAILS</h5>
                                  <div className="space-y-1 text-xs">
                                    <div className="flex justify-between text-gray-300">
                                      <span>Contacts:</span>
                                      <span className="text-white">{details.decisionMakers}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-300">
                                      <span>Calls:</span>
                                      <span className="text-white">{(details.decisionMakers * 3).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-300">
                                      <span>Emails:</span>
                                      <span className="text-white">{(details.decisionMakers * 3).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-300">
                                      <span>SMS:</span>
                                      <span className="text-white">{(details.decisionMakers * 3).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-300">
                                      <span>Account Managers:</span>
                                      <span className="text-white">{details.accountManagers}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h5 className="text-white font-bold text-xs mb-2">✨ BENEFITS</h5>
                                  <div className="space-y-1 text-xs">
                                    <div className="flex items-center gap-2 text-gray-300">
                                      <span className="text-green-400">✓</span>
                                      <span>Guaranteed Leads</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-300">
                                      <span className="text-green-400">✓</span>
                                      <span>Client Portal</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-300">
                                      <span className="text-green-400">✓</span>
                                      <span>Support Email</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-300">
                                      <span className="text-green-400">✓</span>
                                      <span>Territory/Industry Specific</span>
                                    </div>
                                    {fullDetails.monthlyLeadList && (
                                      <div className="flex items-center gap-2 text-gray-300">
                                        <span className="text-green-400">✓</span>
                                        <span>Monthly Lead List</span>
                                      </div>
                                    )}
                                    {fullDetails.websiteDiscount > 0 && (
                                      <div className="flex items-center gap-2 text-gray-300">
                                        <span className="text-green-400">✓</span>
                                        <span>{fullDetails.websiteDiscount}% off Websites</span>
                                      </div>
                                    )}
                                    {fullDetails.automationDiscount > 0 && (
                                      <div className="flex items-center gap-2 text-gray-300">
                                        <span className="text-green-400">✓</span>
                                        <span>{fullDetails.automationDiscount}% off Automations</span>
                                      </div>
                                    )}
                                    {fullDetails.portalDiscount > 0 && (
                                      <div className="flex items-center gap-2 text-gray-300">
                                        <span className="text-green-400">✓</span>
                                        <span>{fullDetails.portalDiscount}% off Portals</span>
                                      </div>
                                    )}
                                    {fullDetails.strategyCall && (
                                      <div className="flex items-center gap-2 text-gray-300">
                                        <span className="text-green-400">✓</span>
                                        <span>{fullDetails.strategyCall} Strategy Call</span>
                                      </div>
                                    )}
                                    {fullDetails.whiteGlove && (
                                      <div className="flex items-center gap-2 text-gray-300">
                                        <span className="text-green-400">✓</span>
                                        <span>White Glove Service</span>
                                      </div>
                                    )}
                                    {fullDetails.businessReview && (
                                      <div className="flex items-center gap-2 text-gray-300">
                                        <span className="text-green-400">✓</span>
                                        <span>{fullDetails.businessReview} Business Review</span>
                                      </div>
                                    )}
                                    {fullDetails.salesMeeting && (
                                      <div className="flex items-center gap-2 text-gray-300">
                                        <span className="text-green-400">✓</span>
                                        <span>{fullDetails.salesMeeting} Sales Meeting</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <button
                              onClick={() => {
                                setSelectedPlanForRequest(`Pro Plan ${rec.businesses}`);
                                setShowCalculator(false);
                                setShowRequestForm(true);
                              }}
                              className="w-full py-3 border border-cyan-500 text-cyan-400 font-bold rounded-xl hover:bg-cyan-500/10 transition"
                            >
                              Request More Info
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Compare Plans Modal */}
      {showCompare && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="relative max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/30 to-red-600/30 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-orange-500/30 rounded-3xl p-6 md:p-8">
              <button
                onClick={() => {
                  setShowCompare(false);
                  setComparePlan1('');
                  setComparePlan2('');
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl md:text-3xl z-10"
              >
                ×
              </button>

              <h3 className="text-3xl md:text-5xl font-black text-white mb-6 text-center">
                Compare Plans
              </h3>

              {/* Dropdown Selectors */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="block text-gray-300 mb-2 font-bold">Select First Plan</label>
                  <select
                    value={comparePlan1}
                    onChange={(e) => setComparePlan1(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-orange-500/30 rounded-xl text-white focus:outline-none focus:border-orange-400"
                  >
                    <option value="">Choose a plan...</option>
                    {[100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100].map(num => (
                      <option key={num} value={num}>Pro Plan {num}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-bold">Select Second Plan</label>
                  <select
                    value={comparePlan2}
                    onChange={(e) => setComparePlan2(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-orange-500/30 rounded-xl text-white focus:outline-none focus:border-orange-400"
                  >
                    <option value="">Choose a plan...</option>
                    {[100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100].map(num => (
                      <option key={num} value={num}>Pro Plan {num}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Comparison Table */}
              {comparePlan1 && comparePlan2 && (() => {
                const plan1 = getFullPlanDetails(parseInt(comparePlan1));
                const plan2 = getFullPlanDetails(parseInt(comparePlan2));

                return (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="py-4 px-4 text-gray-300 font-bold text-sm md:text-base">Feature</th>
                          <th className="py-4 px-4 text-center text-cyan-400 font-black text-sm md:text-lg">
                            Pro Plan {comparePlan1}
                          </th>
                          <th className="py-4 px-4 text-center text-purple-400 font-black text-sm md:text-lg">
                            Pro Plan {comparePlan2}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Details Section */}
                        <tr className="border-b border-white/10">
                          <td colSpan="3" className="py-4 px-4">
                            <h4 className="text-xl font-black text-white">📊 Details</h4>
                          </td>
                        </tr>
                        
                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 text-gray-300 text-sm md:text-base">Targeted Businesses</td>
                          <td className="py-3 px-4 text-center text-white font-bold text-sm md:text-base">{comparePlan1}</td>
                          <td className="py-3 px-4 text-center text-white font-bold text-sm md:text-base">{comparePlan2}</td>
                        </tr>

                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 text-gray-300 text-sm md:text-base">Number of Contacts</td>
                          <td className="py-3 px-4 text-center text-white font-bold text-sm md:text-base">{plan1.decisionMakers}</td>
                          <td className="py-3 px-4 text-center text-white font-bold text-sm md:text-base">{plan2.decisionMakers}</td>
                        </tr>

                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 text-gray-300 text-sm md:text-base">Calls Made</td>
                          <td className="py-3 px-4 text-center text-white font-bold text-sm md:text-base">{(plan1.decisionMakers * 3).toLocaleString()}</td>
                          <td className="py-3 px-4 text-center text-white font-bold text-sm md:text-base">{(plan2.decisionMakers * 3).toLocaleString()}</td>
                        </tr>

                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 text-gray-300 text-sm md:text-base">Emails Sent</td>
                          <td className="py-3 px-4 text-center text-white font-bold text-sm md:text-base">{(plan1.decisionMakers * 3).toLocaleString()}</td>
                          <td className="py-3 px-4 text-center text-white font-bold text-sm md:text-base">{(plan2.decisionMakers * 3).toLocaleString()}</td>
                        </tr>

                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 text-gray-300 text-sm md:text-base">SMS Sent</td>
                          <td className="py-3 px-4 text-center text-white font-bold text-sm md:text-base">{(plan1.decisionMakers * 3).toLocaleString()}</td>
                          <td className="py-3 px-4 text-center text-white font-bold text-sm md:text-base">{(plan2.decisionMakers * 3).toLocaleString()}</td>
                        </tr>

                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 text-gray-300 text-sm md:text-base">Total Points of Contact</td>
                          <td className="py-3 px-4 text-center text-cyan-400 font-black text-sm md:text-base">{plan1.totalAttempts.toLocaleString()}</td>
                          <td className="py-3 px-4 text-center text-purple-400 font-black text-sm md:text-base">{plan2.totalAttempts.toLocaleString()}</td>
                        </tr>

                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 text-gray-300 text-sm md:text-base">Team Goal (Appointments)</td>
                          <td className="py-3 px-4 text-center text-cyan-400 font-black text-sm md:text-base">{plan1.teamGoal}</td>
                          <td className="py-3 px-4 text-center text-purple-400 font-black text-sm md:text-base">{plan2.teamGoal}</td>
                        </tr>

                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 text-gray-300 text-sm md:text-base">Guarantee (Appointments)</td>
                          <td className="py-3 px-4 text-center text-green-400 font-black text-sm md:text-base">{plan1.guarantee}</td>
                          <td className="py-3 px-4 text-center text-green-400 font-black text-sm md:text-base">{plan2.guarantee}</td>
                        </tr>

                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 text-gray-300 text-sm md:text-base">Monthly Price</td>
                          <td className="py-3 px-4 text-center text-cyan-400 font-black text-lg md:text-xl">${plan1.price}</td>
                          <td className="py-3 px-4 text-center text-purple-400 font-black text-lg md:text-xl">${plan2.price}</td>
                        </tr>

                        {/* Benefits Section */}
                        <tr className="border-b border-white/10">
                          <td colSpan="3" className="py-4 px-4">
                            <h4 className="text-xl font-black text-white">✨ Benefits</h4>
                          </td>
                        </tr>

                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 text-gray-300 text-sm md:text-base">Guaranteed Leads</td>
                          <td className="py-3 px-4 text-center text-green-400 text-xl">✓</td>
                          <td className="py-3 px-4 text-center text-green-400 text-xl">✓</td>
                        </tr>

                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 text-gray-300 text-sm md:text-base">Client Facing Portal</td>
                          <td className="py-3 px-4 text-center text-green-400 text-xl">✓</td>
                          <td className="py-3 px-4 text-center text-green-400 text-xl">✓</td>
                        </tr>

                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 text-gray-300 text-sm md:text-base">Sales Reps</td>
                          <td className="py-3 px-4 text-center text-white font-bold text-sm md:text-base">{plan1.salesReps}</td>
                          <td className="py-3 px-4 text-center text-white font-bold text-sm md:text-base">{plan2.salesReps}</td>
                        </tr>

                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 text-gray-300 text-sm md:text-base">Account Managers</td>
                          <td className="py-3 px-4 text-center text-white font-bold text-sm md:text-base">{plan1.accountManagers}</td>
                          <td className="py-3 px-4 text-center text-white font-bold text-sm md:text-base">{plan2.accountManagers}</td>
                        </tr>

                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 text-gray-300 text-sm md:text-base">Support Email</td>
                          <td className="py-3 px-4 text-center text-green-400 text-xl">✓</td>
                          <td className="py-3 px-4 text-center text-green-400 text-xl">✓</td>
                        </tr>

                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 text-gray-300 text-sm md:text-base">Territory/Industry Specific</td>
                          <td className="py-3 px-4 text-center text-green-400 text-xl">✓</td>
                          <td className="py-3 px-4 text-center text-green-400 text-xl">✓</td>
                        </tr>

                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 text-gray-300 text-sm md:text-base">Monthly Lead List</td>
                          <td className="py-3 px-4 text-center">
                            {plan1.monthlyLeadList ? <span className="text-green-400 text-xl">✓</span> : <span className="text-gray-600 text-xl">✕</span>}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {plan2.monthlyLeadList ? <span className="text-green-400 text-xl">✓</span> : <span className="text-gray-600 text-xl">✕</span>}
                          </td>
                        </tr>

                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 text-gray-300 text-sm md:text-base">Website Builds Discount</td>
                          <td className="py-3 px-4 text-center">
                            {plan1.websiteDiscount > 0 ? <span className="text-white font-bold text-sm md:text-base">{plan1.websiteDiscount}%</span> : <span className="text-gray-600 text-xl">✕</span>}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {plan2.websiteDiscount > 0 ? <span className="text-white font-bold text-sm md:text-base">{plan2.websiteDiscount}%</span> : <span className="text-gray-600 text-xl">✕</span>}
                          </td>
                        </tr>

                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 text-gray-300 text-sm md:text-base">Automations Discount</td>
                          <td className="py-3 px-4 text-center">
                            {plan1.automationDiscount > 0 ? <span className="text-white font-bold text-sm md:text-base">{plan1.automationDiscount}%</span> : <span className="text-gray-600 text-xl">✕</span>}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {plan2.automationDiscount > 0 ? <span className="text-white font-bold text-sm md:text-base">{plan2.automationDiscount}%</span> : <span className="text-gray-600 text-xl">✕</span>}
                          </td>
                        </tr>

                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 text-gray-300 text-sm md:text-base">Portal Builds Discount</td>
                          <td className="py-3 px-4 text-center">
                            {plan1.portalDiscount > 0 ? <span className="text-white font-bold text-sm md:text-base">{plan1.portalDiscount}%</span> : <span className="text-gray-600 text-xl">✕</span>}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {plan2.portalDiscount > 0 ? <span className="text-white font-bold text-sm md:text-base">{plan2.portalDiscount}%</span> : <span className="text-gray-600 text-xl">✕</span>}
                          </td>
                        </tr>

                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 text-gray-300 text-sm md:text-base">Strategy Call</td>
                          <td className="py-3 px-4 text-center">
                            {plan1.strategyCall ? <span className="text-white font-bold text-sm md:text-base">{plan1.strategyCall}</span> : <span className="text-gray-600 text-xl">✕</span>}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {plan2.strategyCall ? <span className="text-white font-bold text-sm md:text-base">{plan2.strategyCall}</span> : <span className="text-gray-600 text-xl">✕</span>}
                          </td>
                        </tr>

                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 text-gray-300 text-sm md:text-base">White Glove Service</td>
                          <td className="py-3 px-4 text-center">
                            {plan1.whiteGlove ? <span className="text-green-400 text-xl">✓</span> : <span className="text-gray-600 text-xl">✕</span>}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {plan2.whiteGlove ? <span className="text-green-400 text-xl">✓</span> : <span className="text-gray-600 text-xl">✕</span>}
                          </td>
                        </tr>

                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 text-gray-300 text-sm md:text-base">Business Review</td>
                          <td className="py-3 px-4 text-center">
                            {plan1.businessReview ? <span className="text-white font-bold text-sm md:text-base">{plan1.businessReview}</span> : <span className="text-gray-600 text-xl">✕</span>}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {plan2.businessReview ? <span className="text-white font-bold text-sm md:text-base">{plan2.businessReview}</span> : <span className="text-gray-600 text-xl">✕</span>}
                          </td>
                        </tr>

                        <tr className="border-b border-white/10 hover:bg-white/5">
                          <td className="py-3 px-4 text-gray-300 text-sm md:text-base">Sales Meetings</td>
                          <td className="py-3 px-4 text-center">
                            {plan1.salesMeeting ? <span className="text-white font-bold text-sm md:text-base">{plan1.salesMeeting}</span> : <span className="text-gray-600 text-xl">✕</span>}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {plan2.salesMeeting ? <span className="text-white font-bold text-sm md:text-base">{plan2.salesMeeting}</span> : <span className="text-gray-600 text-xl">✕</span>}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Action Buttons */}
                    <div className="grid md:grid-cols-2 gap-4 mt-8">
                      <button
                        onClick={() => {
                          setSelectedPlanForRequest(`Pro Plan ${comparePlan1}`);
                          setShowCompare(false);
                          setShowRequestForm(true);
                        }}
                        className="py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black text-lg rounded-xl hover:scale-105 transition"
                      >
                        Learn More About Plan {comparePlan1}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPlanForRequest(`Pro Plan ${comparePlan2}`);
                          setShowCompare(false);
                          setShowRequestForm(true);
                        }}
                        className="py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg rounded-xl hover:scale-105 transition"
                      >
                        Learn More About Plan {comparePlan2}
                      </button>
                    </div>
                  </div>
                );
              })()}

              {(!comparePlan1 || !comparePlan2) && (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">Select two plans to compare</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Not Sure Which Plan Section */}
      <section className="relative py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-2xl border border-blue-500/30 p-6 md:p-12 rounded-3xl text-center">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 md:mb-6">
                Not Sure Which Plan <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Is Right?</span>
              </h2>
              <p className="text-base md:text-xl text-gray-300 mb-6 md:mb-8">
                Book a free consultation and we'll help you choose the perfect plan for your needs.
              </p>
              <button onClick={() => setShowRequestForm(true)} className="group relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
                <div className="relative px-8 md:px-12 py-4 md:py-6 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl text-white font-black text-lg md:text-2xl hover:scale-110 transition-all duration-300">
                  Book Free Consultation 📞
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

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
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
      `}</style>
    </div>
  );
}