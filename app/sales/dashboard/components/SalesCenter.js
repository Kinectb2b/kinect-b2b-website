'use client';
import { useState, useMemo } from 'react';

// Plan data for ROI Calculator
const plansData = [
  { planName: "Pro Plan 100", monthly: 250, guaranteedAppts: 5, apptGoal: 25 },
  { planName: "Pro Plan 200", monthly: 500, guaranteedAppts: 10, apptGoal: 50 },
  { planName: "Pro Plan 300", monthly: 750, guaranteedAppts: 15, apptGoal: 75 },
  { planName: "Pro Plan 400", monthly: 1000, guaranteedAppts: 20, apptGoal: 100 },
  { planName: "Pro Plan 500", monthly: 1250, guaranteedAppts: 25, apptGoal: 125 },
  { planName: "Pro Plan 600", monthly: 1500, guaranteedAppts: 30, apptGoal: 150 },
  { planName: "Pro Plan 700", monthly: 1750, guaranteedAppts: 35, apptGoal: 175 },
  { planName: "Pro Plan 800", monthly: 2000, guaranteedAppts: 40, apptGoal: 200 },
  { planName: "Pro Plan 900", monthly: 2250, guaranteedAppts: 45, apptGoal: 225 },
  { planName: "Pro Plan 1000", monthly: 2500, guaranteedAppts: 50, apptGoal: 250 },
  { planName: "Pro Plan 1500", monthly: 3750, guaranteedAppts: 75, apptGoal: 375 },
  { planName: "Pro Plan 2000", monthly: 5000, guaranteedAppts: 100, apptGoal: 500 },
  { planName: "Pro Plan 2500", monthly: 6250, guaranteedAppts: 125, apptGoal: 625 },
  { planName: "Pro Plan 3000", monthly: 7500, guaranteedAppts: 150, apptGoal: 750 },
  { planName: "Pro Plan 4000", monthly: 10000, guaranteedAppts: 200, apptGoal: 1000 },
  { planName: "Pro Plan 5000", monthly: 12500, guaranteedAppts: 250, apptGoal: 1250 },
];

const sections = [
  { id: 'roi', label: '💰 ROI Calculator', icon: '💰' },
  { id: 'objections', label: '🛡️ Objections', icon: '🛡️' },
  { id: 'scripts', label: '📝 Scripts', icon: '📝' },
  { id: 'emails', label: '📧 Email Templates', icon: '📧' },
  { id: 'discovery', label: '❓ Discovery Questions', icon: '❓' },
  { id: 'faq', label: '💬 FAQ', icon: '💬' },
];

export default function SalesCenter() {
  const [activeSection, setActiveSection] = useState('roi');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <div className="space-y-6">
      {/* Dropdown Navigation */}
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold flex items-center justify-between gap-4 hover:from-green-700 hover:to-green-800 transition"
          >
            <span className="flex items-center gap-2">
              {currentSection?.label}
            </span>
            <svg className={`w-5 h-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-full md:w-72 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left font-medium flex items-center gap-3 transition-colors ${
                    activeSection === section.id
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{section.icon}</span>
                  {section.label.replace(section.icon + ' ', '')}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Section Content */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {activeSection === 'roi' && <ROICalculator />}
        {activeSection === 'objections' && <ObjectionsSection />}
        {activeSection === 'scripts' && <ScriptsSection />}
        {activeSection === 'emails' && <EmailTemplates />}
        {activeSection === 'discovery' && <DiscoveryQuestions />}
        {activeSection === 'faq' && <FAQSection />}
      </div>
    </div>
  );
}

// ============================================
// ROI CALCULATOR
// ============================================
function ROICalculator() {
  const [selectedPlan, setSelectedPlan] = useState(plansData[4]); // Pro Plan 500 default
  const [avgJobValue, setAvgJobValue] = useState(400);
  const [closeRate, setCloseRate] = useState(30);
  const [recurringPercent, setRecurringPercent] = useState(75);
  const [recurringFrequency, setRecurringFrequency] = useState('monthly');

  const avgAppts = Math.round((selectedPlan.guaranteedAppts + selectedPlan.apptGoal) / 2);
  const monthlyAppts = avgAppts / 12;

  const calculations = useMemo(() => {
    const newCustomersYear = Math.round(avgAppts * (closeRate / 100));
    const oneTimeCustomers = Math.round(newCustomersYear * ((100 - recurringPercent) / 100));
    const recurringCustomers = Math.round(newCustomersYear * (recurringPercent / 100));

    const oneTimeRevenue = oneTimeCustomers * avgJobValue;

    let recurringMultiplier = 12; // monthly
    if (recurringFrequency === 'quarterly') recurringMultiplier = 4;
    if (recurringFrequency === 'yearly') recurringMultiplier = 1;

    const recurringRevenueYear = recurringCustomers * avgJobValue * recurringMultiplier;
    const totalRevenueYear = oneTimeRevenue + recurringRevenueYear;
    const investmentYear = selectedPlan.monthly * 12;
    const roi = ((totalRevenueYear - investmentYear) / investmentYear) * 100;
    const roiMultiplier = totalRevenueYear / investmentYear;

    return {
      avgAppts,
      monthlyAppts,
      newCustomersYear,
      oneTimeCustomers,
      recurringCustomers,
      oneTimeRevenue,
      recurringRevenueYear,
      totalRevenueYear,
      investmentYear,
      roi,
      roiMultiplier
    };
  }, [selectedPlan, avgJobValue, closeRate, recurringPercent, recurringFrequency, avgAppts]);

  const getRoiColor = (roi) => {
    if (roi >= 200) return 'text-green-600';
    if (roi >= 100) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRoiBg = (roi) => {
    if (roi >= 200) return 'bg-green-50 border-green-200';
    if (roi >= 100) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          💰 ROI Calculator
        </h2>
        <p className="text-gray-500 mt-1">Show prospects the real value — use this live on calls!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-6">
          <h3 className="font-bold text-gray-900 text-lg">📊 Input Prospect's Numbers</h3>
          
          {/* Plan Selector */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Select Plan</label>
            <select
              value={selectedPlan.planName}
              onChange={(e) => setSelectedPlan(plansData.find(p => p.planName === e.target.value))}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 font-bold focus:outline-none focus:border-green-500"
            >
              {plansData.map(plan => (
                <option key={plan.planName} value={plan.planName}>
                  {plan.planName} — ${plan.monthly.toLocaleString()}/mo
                </option>
              ))}
            </select>
            <div className="mt-2 flex gap-4 text-sm">
              <span className="text-gray-500">Guaranteed: <strong className="text-gray-900">{selectedPlan.guaranteedAppts}</strong></span>
              <span className="text-gray-500">Goal: <strong className="text-gray-900">{selectedPlan.apptGoal}</strong></span>
              <span className="text-green-600 font-bold">Avg: {avgAppts}/year</span>
            </div>
          </div>

          {/* Average Job Value */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Average Job Value ($)</label>
            <input
              type="number"
              value={avgJobValue}
              onChange={(e) => setAvgJobValue(Number(e.target.value))}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 font-bold focus:outline-none focus:border-green-500"
            />
          </div>

          {/* Close Rate */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Close Rate: {closeRate}%</label>
            <input
              type="range"
              min="5"
              max="80"
              value={closeRate}
              onChange={(e) => setCloseRate(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>5%</span>
              <span>80%</span>
            </div>
          </div>

          {/* Recurring Percentage */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">% Become Recurring: {recurringPercent}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={recurringPercent}
              onChange={(e) => setRecurringPercent(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Recurring Frequency */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Recurring Frequency</label>
            <div className="flex gap-2">
              {['monthly', 'quarterly', 'yearly'].map((freq) => (
                <button
                  key={freq}
                  onClick={() => setRecurringFrequency(freq)}
                  className={`flex-1 px-4 py-2 rounded-lg font-bold capitalize transition ${
                    recurringFrequency === freq
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <h3 className="font-bold text-gray-900 text-lg">📈 The Results</h3>

          {/* Customer Breakdown */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Appointments/Year</span>
              <span className="font-bold text-gray-900">{calculations.avgAppts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">New Customers/Year ({closeRate}% close)</span>
              <span className="font-bold text-gray-900">{calculations.newCustomersYear}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 pl-4">↳ One-time customers</span>
              <span className="font-medium text-gray-700">{calculations.oneTimeCustomers}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 pl-4">↳ Recurring customers</span>
              <span className="font-medium text-gray-700">{calculations.recurringCustomers}</span>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 space-y-3">
            <h4 className="font-bold text-blue-800">💵 Year 1 Revenue</h4>
            <div className="flex justify-between">
              <span className="text-blue-700">One-time revenue</span>
              <span className="font-bold text-blue-900">${calculations.oneTimeRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Recurring revenue ({recurringFrequency})</span>
              <span className="font-bold text-blue-900">${calculations.recurringRevenueYear.toLocaleString()}</span>
            </div>
            <div className="border-t border-blue-200 pt-2 flex justify-between">
              <span className="font-bold text-blue-800">Total Revenue</span>
              <span className="font-black text-blue-900 text-xl">${calculations.totalRevenueYear.toLocaleString()}</span>
            </div>
          </div>

          {/* Investment */}
          <div className="bg-gray-100 rounded-xl p-4">
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Annual Investment</span>
              <span className="font-bold text-gray-900">${calculations.investmentYear.toLocaleString()}</span>
            </div>
          </div>

          {/* ROI Result */}
          <div className={`${getRoiBg(calculations.roi)} border-2 rounded-xl p-6 text-center`}>
            <p className="text-sm font-bold text-gray-600 mb-1">Return on Investment</p>
            <p className={`text-5xl font-black ${getRoiColor(calculations.roi)}`}>
              {calculations.roi.toFixed(0)}%
            </p>
            <p className="text-gray-600 mt-2 font-medium">
              For every $1 spent, you make <strong className={getRoiColor(calculations.roi)}>${calculations.roiMultiplier.toFixed(2)}</strong> back
            </p>
          </div>

          {/* Talk Track */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
            <h4 className="font-bold text-green-800 mb-2">🎤 Say This:</h4>
            <p className="text-green-900 italic">
              "With {selectedPlan.planName}, you'll get around {calculations.avgAppts} appointments per year. 
              At a {closeRate}% close rate, that's {calculations.newCustomersYear} new customers. 
              {calculations.recurringCustomers > 0 && ` If ${recurringPercent}% become recurring ${recurringFrequency} customers, you're looking at $${calculations.totalRevenueYear.toLocaleString()} in revenue from a $${calculations.investmentYear.toLocaleString()} investment.`}
              {calculations.roi >= 100 ? " That's a no-brainer!" : " Let's look at a plan that fits better."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// OBJECTIONS SECTION
// ============================================
function ObjectionsSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const objections = [
    {
      objection: "It's too expensive",
      response: "I totally get it — it's an investment. But let me ask you this: how much is a new customer worth to you? If we book you just 2-3 appointments that close, you've already made your money back. The rest is profit. Want me to run the numbers real quick?",
      tip: "Use the ROI Calculator to show the math live"
    },
    {
      objection: "I need to think about it",
      response: "Absolutely, this is a big decision. What specifically do you want to think over? Is it the price, the service, or just the timing? I want to make sure I've answered everything so you can make the best decision for your business.",
      tip: "Isolate the real objection — usually it's price or trust"
    },
    {
      objection: "I've been burned by lead gen before",
      response: "I hear that a lot, and honestly, most lead gen IS trash. That's exactly why we do things differently. We don't just send you leads — we guarantee appointments. Real conversations with real decision makers. If we don't hit our guarantee, you don't pay. What was the biggest issue with the last company you tried?",
      tip: "Acknowledge their pain, differentiate with the guarantee"
    },
    {
      objection: "I don't have time to follow up on leads",
      response: "That's actually the beauty of what we do — these aren't cold leads you have to chase. We're booking qualified appointments directly on your calendar. You just show up and close. No chasing, no cold calling on your end.",
      tip: "Emphasize appointments vs leads"
    },
    {
      objection: "I already have enough work",
      response: "That's awesome! But let me ask — are you turning away the RIGHT kind of work? The high-ticket jobs? Or are you filling your schedule with whatever comes in? We can help you be selective and focus on the jobs that actually grow your business.",
      tip: "Shift from 'more work' to 'better work'"
    },
    {
      objection: "I need to talk to my partner/spouse",
      response: "Of course! What do you think they'll want to know? Maybe I can give you some info to share with them. Or if it helps, we could set up a quick call with both of you so I can answer any questions directly.",
      tip: "Offer a 3-way call or arm them with info"
    },
    {
      objection: "Can you send me more information?",
      response: "Absolutely, I can send you our full breakdown. But I'm curious — what specific information would help you make a decision? I don't want to just bury you in PDFs. What's the main thing you're trying to figure out?",
      tip: "Don't let them escape — find the real question"
    },
    {
      objection: "What if it doesn't work?",
      response: "Great question. That's why we have a guarantee — if we don't hit our appointment numbers, you're protected. But honestly, in [X] years of doing this, we've never had a client where it 'didn't work' when they actually followed up on the appointments. The appointments show up. Your job is to close them.",
      tip: "Guarantee + shift responsibility to closing"
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          🛡️ Objection Handling
        </h2>
        <p className="text-gray-500 mt-1">Click any objection to see the response</p>
      </div>

      <div className="space-y-3">
        {objections.map((item, index) => (
          <div key={index} className="border-2 border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition"
            >
              <span className="font-bold text-gray-900">"{item.objection}"</span>
              <span className={`text-2xl transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>
                ⌄
              </span>
            </button>
            {openIndex === index && (
              <div className="px-6 py-4 bg-white border-t border-gray-200">
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">{item.response}</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
                  <span className="text-yellow-800 text-sm font-bold">💡 Tip: </span>
                  <span className="text-yellow-700 text-sm">{item.tip}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// SCRIPTS SECTION
// ============================================
function ScriptsSection() {
  const [activeScript, setActiveScript] = useState('opener');

  const scripts = {
    opener: {
      title: "Call Opener",
      content: `Hey [NAME], this is [YOUR NAME] with Kinect B2B — how's it going?

[WAIT FOR RESPONSE]

Awesome! Hey, I'll keep this quick because I know you're busy running [COMPANY NAME]. 

The reason I'm reaching out is we specialize in booking qualified appointments for [INDUSTRY] companies like yours. I'm talking decision-makers who are ready to talk — not tire-kickers.

I wanted to see if you had 2 minutes to hear how it works, and if it makes sense, we can chat more. If not, no worries at all. Fair enough?`
    },
    pitch: {
      title: "The Pitch",
      content: `So here's what we do in a nutshell:

We handle all the outreach — calls, emails, texts — to businesses in your target area. We're not just generating leads though. We're actually booking appointments directly on your calendar.

The cool part? We guarantee a minimum number of appointments. If we don't hit it, you don't pay full price. So you're protected.

For a company your size, we'd typically recommend our [PLAN] which guarantees [X] appointments per year. That's roughly [X] per month of real conversations with potential customers.

Quick question — on average, what's a new customer worth to you?`
    },
    closing: {
      title: "The Close",
      content: `So based on what you told me — if we book you [X] appointments and you close even [X]% of those at $[AVG VALUE] per job, you're looking at $[REVENUE] in new business.

Your investment is $[PRICE]/month, so you'd make that back with just [X] closed deals. Everything after that is profit.

I've got availability to get you started [THIS WEEK/NEXT WEEK]. We can have your campaign live within [X] days.

What questions do you have before we get the paperwork going?`
    },
    voicemail: {
      title: "Voicemail Script",
      content: `Hey [NAME], this is [YOUR NAME] with Kinect B2B.

I work with [INDUSTRY] companies in [AREA] and I wanted to reach out real quick about something that might help you book more jobs without spending more on ads.

Give me a call back when you get a chance — [PHONE NUMBER]. Again, that's [YOUR NAME] with Kinect, [PHONE NUMBER].

Talk soon!`
    },
    followup: {
      title: "Follow-Up Call",
      content: `Hey [NAME], it's [YOUR NAME] from Kinect B2B — we spoke [LAST WEEK / A FEW DAYS AGO] about getting you more appointments.

Just wanted to circle back and see if you had any questions come up, or if you've had a chance to think it over?

[IF THEY NEED MORE TIME]
No problem at all. Is there anything specific holding you back that I can help address?

[IF THEY'RE READY]
Perfect! Let's get you set up. I'll send over the agreement and we can get your campaign launched this week.`
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          📝 Sales Scripts
        </h2>
        <p className="text-gray-500 mt-1">Copy and customize these for your calls</p>
      </div>

      {/* Script Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(scripts).map(([key, script]) => (
          <button
            key={key}
            onClick={() => setActiveScript(key)}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
              activeScript === key
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {script.title}
          </button>
        ))}
      </div>

      {/* Script Content */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-black text-gray-900 text-xl mb-4">{scripts[activeScript].title}</h3>
        <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
          {scripts[activeScript].content}
        </pre>
        <button
          onClick={() => navigator.clipboard.writeText(scripts[activeScript].content)}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition flex items-center gap-2"
        >
          📋 Copy to Clipboard
        </button>
      </div>
    </div>
  );
}

// ============================================
// EMAIL TEMPLATES
// ============================================
function EmailTemplates() {
  const [activeTemplate, setActiveTemplate] = useState('initial');

  const templates = {
    initial: {
      title: "Initial Outreach",
      subject: "Quick question about [COMPANY NAME]",
      body: `Hi [NAME],

I came across [COMPANY NAME] and wanted to reach out real quick.

We help [INDUSTRY] companies book more qualified appointments without spending more on ads. We actually guarantee a minimum number of appointments — if we don't deliver, you don't pay.

Would you be open to a quick 10-minute call to see if this could work for you?

Best,
[YOUR NAME]
Kinect B2B`
    },
    followup1: {
      title: "Follow-Up #1",
      subject: "Re: Quick question about [COMPANY NAME]",
      body: `Hi [NAME],

Just wanted to bump this to the top of your inbox.

I know you're busy, so I'll keep it short: we guarantee appointments for [INDUSTRY] companies. No fluff, no tire-kickers — just real conversations with potential customers.

Worth a quick chat?

[YOUR NAME]`
    },
    followup2: {
      title: "Follow-Up #2 (Breakup)",
      subject: "Should I close your file?",
      body: `Hi [NAME],

I've reached out a couple times and haven't heard back, so I'm guessing the timing isn't right.

No worries at all — I'll close out your file for now. If things change and you want to explore getting more appointments on your calendar, just reply to this email.

Wishing you all the best!

[YOUR NAME]`
    },
    aftercall: {
      title: "After Call Recap",
      subject: "Great chatting — here's what we discussed",
      body: `Hey [NAME],

Great talking with you today! Here's a quick recap:

• Plan: [PLAN NAME] — $[PRICE]/month
• Guaranteed appointments: [X] per year
• Your target: [AREA/INDUSTRY]
• Estimated start: [DATE]

Based on our conversation, you mentioned your average job is around $[VALUE] and you typically close [X]% of appointments. That means even a conservative estimate puts you at $[PROJECTED REVENUE] in new business from this investment.

I've attached the agreement. Just sign and return, and we'll get your campaign live within [X] days.

Any questions, just hit reply!

[YOUR NAME]`
    },
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          📧 Email Templates
        </h2>
        <p className="text-gray-500 mt-1">Copy, customize, and send</p>
      </div>

      {/* Template Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(templates).map(([key, template]) => (
          <button
            key={key}
            onClick={() => setActiveTemplate(key)}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
              activeTemplate === key
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {template.title}
          </button>
        ))}
      </div>

      {/* Template Content */}
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <span className="font-bold text-yellow-800">Subject: </span>
          <span className="text-yellow-900">{templates[activeTemplate].subject}</span>
          <button
            onClick={() => navigator.clipboard.writeText(templates[activeTemplate].subject)}
            className="ml-2 text-yellow-700 hover:text-yellow-900"
          >
            📋
          </button>
        </div>
        <div className="bg-gray-50 rounded-xl p-6">
          <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
            {templates[activeTemplate].body}
          </pre>
          <button
            onClick={() => navigator.clipboard.writeText(templates[activeTemplate].body)}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition flex items-center gap-2"
          >
            📋 Copy Email Body
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DISCOVERY QUESTIONS
// ============================================
function DiscoveryQuestions() {
  const categories = [
    {
      title: "🎯 Understanding Their Business",
      questions: [
        "How long have you been in business?",
        "What's your primary service? What makes up most of your revenue?",
        "What area do you service? How far are you willing to travel for a job?",
        "How many jobs are you doing per week/month right now?",
        "What's your average job size in terms of revenue?",
      ]
    },
    {
      title: "💰 Understanding Their Goals",
      questions: [
        "Where do you want to be in 12 months? Revenue? Team size?",
        "What's holding you back from getting there right now?",
        "If I could wave a magic wand and fix one thing in your business, what would it be?",
        "What does your ideal customer look like?",
        "What size jobs do you WANT to be doing more of?",
      ]
    },
    {
      title: "📣 Understanding Their Current Marketing",
      questions: [
        "How are you currently getting new customers?",
        "What's working best for you right now?",
        "What have you tried that DIDN'T work?",
        "How much are you spending on marketing/ads per month?",
        "Do you know your cost per lead or cost per new customer?",
      ]
    },
    {
      title: "🔥 Pain Points",
      questions: [
        "What's the most frustrating part about getting new customers?",
        "How much time do you spend chasing leads vs. actually doing jobs?",
        "Have you ever worked with a lead gen company before? How'd that go?",
        "What happens during your slow season? How do you fill the gaps?",
        "If you had a steady flow of appointments, what would you do with that time?",
      ]
    },
    {
      title: "✅ Qualification",
      questions: [
        "If we could guarantee X appointments per month, is that something you'd have capacity to handle?",
        "Who else would be involved in this decision?",
        "What would need to be true for you to move forward today?",
        "Is budget a concern, or is it more about making sure this works?",
        "What's your timeline? When would you want to start seeing appointments?",
      ]
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          ❓ Discovery Questions
        </h2>
        <p className="text-gray-500 mt-1">Ask these to uncover pain points and qualify prospects</p>
      </div>

      <div className="space-y-6">
        {categories.map((category, idx) => (
          <div key={idx} className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-black text-gray-900 text-lg mb-4">{category.title}</h3>
            <ul className="space-y-3">
              {category.questions.map((q, qIdx) => (
                <li key={qIdx} className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">•</span>
                  <span className="text-gray-700">{q}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// FAQ SECTION
// ============================================
function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How does the appointment guarantee work?",
      answer: "We guarantee a minimum number of appointments based on your plan. If we don't hit that number, you either get a prorated refund or we continue working at no additional charge until we hit it. You're never paying for appointments you don't get."
    },
    {
      question: "What counts as an 'appointment'?",
      answer: "An appointment is a scheduled conversation with a decision-maker who has expressed interest in your services. They've agreed to a specific date/time to talk. No-shows don't count against your guarantee — we'll replace those."
    },
    {
      question: "How long until I start seeing appointments?",
      answer: "Most campaigns are live within 5-7 business days. You'll typically start seeing appointments within the first 2-3 weeks, with volume ramping up as the campaign optimizes."
    },
    {
      question: "Do I have to sign a long-term contract?",
      answer: "We do month-to-month after an initial 3-month commitment. The 3 months allows time for the campaign to ramp up and optimize. After that, you can cancel anytime with 30 days notice."
    },
    {
      question: "What if the leads are bad quality?",
      answer: "We qualify every appointment before booking. They must be decision-makers in your target area/industry who have expressed interest. If you're consistently seeing bad fits, we'll adjust targeting immediately — that's what account managers are for."
    },
    {
      question: "How is this different from buying leads?",
      answer: "Leads are just contact info — you still have to chase them, call them, follow up repeatedly. We book actual appointments. The prospect has already agreed to talk to you at a specific time. No chasing required."
    },
    {
      question: "Can I choose my territory?",
      answer: "Absolutely. You define your service area and we only reach out to businesses in that zone. You can also specify industries, company sizes, and other targeting criteria."
    },
    {
      question: "What's the setup fee for?",
      answer: "The setup fee covers campaign buildout: creating your target list, writing custom outreach sequences, setting up tracking/reporting, and training your dedicated account manager on your business. It's a one-time cost."
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          💬 Frequently Asked Questions
        </h2>
        <p className="text-gray-500 mt-1">Quick answers to common prospect questions</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div key={index} className="border-2 border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition"
            >
              <span className="font-bold text-gray-900">{faq.question}</span>
              <span className={`text-2xl transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>
                ⌄
              </span>
            </button>
            {openIndex === index && (
              <div className="px-6 py-4 bg-white border-t border-gray-200">
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}