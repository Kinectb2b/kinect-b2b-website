'use client';
import { useState, useRef } from 'react';

// Plan data
const plansData = [
  { planName: "Pro Plan 100", monthly: 250, guaranteedAppts: 5, apptGoal: 25, contacts: 100, calls: 300, emails: 900, sms: 900, pointsOfContact: 2700, tier: "Starter" },
  { planName: "Pro Plan 200", monthly: 500, guaranteedAppts: 10, apptGoal: 50, contacts: 200, calls: 600, emails: 1800, sms: 1800, pointsOfContact: 5400, tier: "Starter" },
  { planName: "Pro Plan 300", monthly: 750, guaranteedAppts: 15, apptGoal: 75, contacts: 300, calls: 900, emails: 2700, sms: 2700, pointsOfContact: 8100, tier: "Starter" },
  { planName: "Pro Plan 400", monthly: 1000, guaranteedAppts: 20, apptGoal: 100, contacts: 400, calls: 1200, emails: 3600, sms: 3600, pointsOfContact: 10800, tier: "Starter" },
  { planName: "Pro Plan 500", monthly: 1250, guaranteedAppts: 25, apptGoal: 125, contacts: 500, calls: 1500, emails: 4500, sms: 4500, pointsOfContact: 13500, tier: "Starter" },
  { planName: "Pro Plan 600", monthly: 1500, guaranteedAppts: 30, apptGoal: 150, contacts: 600, calls: 1800, emails: 5400, sms: 5400, pointsOfContact: 16200, tier: "Starter" },
  { planName: "Pro Plan 700", monthly: 1750, guaranteedAppts: 35, apptGoal: 175, contacts: 700, calls: 2100, emails: 6300, sms: 6300, pointsOfContact: 18900, tier: "Starter" },
  { planName: "Pro Plan 800", monthly: 2000, guaranteedAppts: 40, apptGoal: 200, contacts: 800, calls: 2400, emails: 7200, sms: 7200, pointsOfContact: 21600, tier: "Starter" },
  { planName: "Pro Plan 1000", monthly: 2500, guaranteedAppts: 50, apptGoal: 250, contacts: 1000, calls: 3000, emails: 9000, sms: 9000, pointsOfContact: 27000, tier: "Starter" },
  { planName: "Pro Plan 1500", monthly: 3750, guaranteedAppts: 75, apptGoal: 375, contacts: 1500, calls: 4500, emails: 13500, sms: 13500, pointsOfContact: 40500, tier: "Growth" },
  { planName: "Pro Plan 2000", monthly: 5000, guaranteedAppts: 100, apptGoal: 500, contacts: 2000, calls: 6000, emails: 18000, sms: 18000, pointsOfContact: 54000, tier: "Growth" },
  { planName: "Pro Plan 3000", monthly: 7500, guaranteedAppts: 150, apptGoal: 750, contacts: 3000, calls: 9000, emails: 27000, sms: 27000, pointsOfContact: 81000, tier: "Growth" },
  { planName: "Pro Plan 5000", monthly: 12500, guaranteedAppts: 250, apptGoal: 1250, contacts: 5000, calls: 15000, emails: 45000, sms: 45000, pointsOfContact: 135000, tier: "Scale" },
  { planName: "Pro Plan 10000", monthly: 25000, guaranteedAppts: 500, apptGoal: 2500, contacts: 10000, calls: 30000, emails: 90000, sms: 90000, pointsOfContact: 270000, tier: "Scale" },
  { planName: "Pro Plan 15000", monthly: 37500, guaranteedAppts: 750, apptGoal: 3750, contacts: 15000, calls: 45000, emails: 135000, sms: 135000, pointsOfContact: 405000, tier: "Premier" },
  { planName: "Pro Plan 20000", monthly: 50000, guaranteedAppts: 1000, apptGoal: 5000, contacts: 20000, calls: 60000, emails: 180000, sms: 180000, pointsOfContact: 540000, tier: "Premier" },
];

export default function ProposalBuilder({ currentUser }) {
  const [clientInfo, setClientInfo] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
  });
  const [selectedPlan, setSelectedPlan] = useState(plansData[4]);
  const [setupFee, setSetupFee] = useState(500);
  const [showPreview, setShowPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const proposalRef = useRef(null);

  const repName = currentUser?.full_name || currentUser?.username || 'Your Sales Rep';
  const repEmail = currentUser?.email || 'sales@kinect-b2b.com';

  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const validUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const getProposalHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Proposal - ${clientInfo.company || 'Client'}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 40px; }
            .logo { width: 60px; height: 60px; background: linear-gradient(135deg, #16a34a, #15803d); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; }
            .logo span { color: white; font-size: 28px; font-weight: bold; }
            .company-name { font-size: 28px; font-weight: bold; color: #333; }
            .tagline { color: #666; }
            .proposal-for { background: #f3f4f6; padding: 25px; border-radius: 12px; text-align: center; margin-bottom: 30px; }
            .proposal-for .label { color: #666; font-size: 12px; text-transform: uppercase; }
            .proposal-for .client { font-size: 24px; font-weight: bold; color: #333; }
            .proposal-for .contact { color: #666; }
            .proposal-for .dates { margin-top: 15px; font-size: 13px; color: #888; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 16px; font-weight: bold; color: #16a34a; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #16a34a; }
            .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
            .stat { background: #f9fafb; padding: 15px; border-radius: 8px; }
            .stat-label { font-size: 12px; color: #666; margin-bottom: 4px; }
            .stat-value { font-size: 22px; font-weight: bold; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            th { background: #f9fafb; font-weight: bold; font-size: 13px; color: #666; }
            .price-box { background: linear-gradient(135deg, #16a34a, #15803d); color: white; padding: 25px; border-radius: 12px; text-align: center; }
            .price-box .label { color: rgba(255,255,255,0.8); font-size: 13px; }
            .price-box .amount { font-size: 36px; font-weight: bold; margin: 5px 0; }
            .price-box .sublabel { color: rgba(255,255,255,0.7); font-size: 12px; }
            .included-list { list-style: none; padding: 0; }
            .included-list li { padding: 8px 0; display: flex; align-items: center; gap: 10px; }
            .included-list .check { color: #16a34a; font-weight: bold; }
            .footer { margin-top: 40px; text-align: center; padding-top: 30px; border-top: 1px solid #e5e7eb; }
            .footer .cta { font-weight: bold; color: #333; font-size: 16px; }
            .footer .contact-info { margin-top: 10px; color: #666; }
            .footer .rep-name { font-weight: bold; color: #16a34a; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo"><span>K</span></div>
            <div class="company-name">Kinect B2B</div>
            <div class="tagline">Business Growth Solutions</div>
          </div>

          <div class="proposal-for">
            <div class="label">Proposal For</div>
            <div class="client">${clientInfo.company || '[Company Name]'}</div>
            <div class="contact">${clientInfo.name || '[Contact Name]'}</div>
            <div class="dates">
              Prepared: ${today}<br>
              Valid Until: ${validUntil}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Recommended Plan: ${selectedPlan.planName}</div>
            <div class="stats-grid">
              <div class="stat">
                <div class="stat-label">Guaranteed Appointments</div>
                <div class="stat-value">${selectedPlan.guaranteedAppts}/year</div>
              </div>
              <div class="stat">
                <div class="stat-label">Appointment Goal</div>
                <div class="stat-value">${selectedPlan.apptGoal}/year</div>
              </div>
              <div class="stat">
                <div class="stat-label">Businesses Contacted</div>
                <div class="stat-value">${selectedPlan.contacts.toLocaleString()}</div>
              </div>
              <div class="stat">
                <div class="stat-label">Total Touchpoints</div>
                <div class="stat-value">${selectedPlan.pointsOfContact.toLocaleString()}</div>
              </div>
            </div>

            <div class="section-title">Annual Outreach Breakdown</div>
            <table>
              <thead>
                <tr>
                  <th>Channel</th>
                  <th style="text-align: right;">Annual Volume</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>📞 Phone Calls</td>
                  <td style="text-align: right; font-weight: bold;">${selectedPlan.calls.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>📧 Emails</td>
                  <td style="text-align: right; font-weight: bold;">${selectedPlan.emails.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>💬 SMS Messages</td>
                  <td style="text-align: right; font-weight: bold;">${selectedPlan.sms.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Your Investment</div>
            <table>
              <tbody>
                <tr>
                  <td>Setup Fee (One-Time)</td>
                  <td style="text-align: right; font-weight: bold;">$${setupFee.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Monthly Service Fee</td>
                  <td style="text-align: right; font-weight: bold;">$${selectedPlan.monthly.toLocaleString()}/month</td>
                </tr>
              </tbody>
            </table>

            <div class="price-box">
              <div class="label">To Get Started</div>
              <div class="amount">$${(selectedPlan.monthly + setupFee).toLocaleString()}</div>
              <div class="sublabel">First month + setup fee</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">What's Included</div>
            <ul class="included-list">
              <li><span class="check">✓</span> Dedicated Account Manager</li>
              <li><span class="check">✓</span> Custom Target List Development</li>
              <li><span class="check">✓</span> Multi-Channel Outreach (Calls, Emails, SMS)</li>
              <li><span class="check">✓</span> Appointment Scheduling Directly to Your Calendar</li>
              <li><span class="check">✓</span> Real-Time Reporting Dashboard</li>
              <li><span class="check">✓</span> 24/7 Email Support</li>
              <li><span class="check">✓</span> <strong>Appointment Guarantee — If we don't deliver, you don't pay full price</strong></li>
            </ul>
          </div>

          <div class="footer">
            <div class="cta">Ready to grow your business?</div>
            <div class="contact-info">
              <p>Contact me to get started:</p>
              <p class="rep-name">${repName}</p>
              <p>📧 ${repEmail}</p>
              <p>🌐 kinect-b2b.com</p>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(getProposalHTML());
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  const handleEmailClient = () => {
    if (!clientInfo.email) {
      alert('Please enter the client\'s email address first!');
      return;
    }

    const subject = encodeURIComponent(`Proposal for ${clientInfo.company || 'Your Business'} - Kinect B2B`);
    const body = encodeURIComponent(`Hi ${clientInfo.name || 'there'},

Thank you for your interest in Kinect B2B! I've put together a proposal based on our conversation.

RECOMMENDED PLAN: ${selectedPlan.planName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 Guaranteed Appointments: ${selectedPlan.guaranteedAppts}/year
🎯 Appointment Goal: ${selectedPlan.apptGoal}/year
📞 Businesses Contacted: ${selectedPlan.contacts.toLocaleString()}/year
💬 Total Touchpoints: ${selectedPlan.pointsOfContact.toLocaleString()}/year

YOUR INVESTMENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Setup Fee (One-Time): $${setupFee.toLocaleString()}
• Monthly Service Fee: $${selectedPlan.monthly.toLocaleString()}/month

TO GET STARTED: $${(selectedPlan.monthly + setupFee).toLocaleString()}
(First month + setup fee)

WHAT'S INCLUDED:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Dedicated Account Manager
✓ Custom Target List Development
✓ Multi-Channel Outreach (Calls, Emails, SMS)
✓ Appointment Scheduling Directly to Your Calendar
✓ Real-Time Reporting Dashboard
✓ 24/7 Email Support
✓ Appointment Guarantee — If we don't deliver, you don't pay full price

This proposal is valid for 7 days. Let me know if you have any questions!

Best,
${repName}
${repEmail}
Kinect B2B`);

    window.open(`mailto:${clientInfo.email}?subject=${subject}&body=${body}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          📝 Proposal Builder
        </h2>
        <p className="text-gray-500 mt-1">Generate professional proposals in seconds</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-6">
          {/* Client Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-4">👤 Client Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Contact Name</label>
                <input
                  type="text"
                  value={clientInfo.name}
                  onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                  placeholder="John Smith"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={clientInfo.company}
                  onChange={(e) => setClientInfo({ ...clientInfo, company: e.target.value })}
                  placeholder="Smith's Pressure Washing"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={clientInfo.email}
                    onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={clientInfo.phone}
                    onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Plan Selection */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-4">📋 Select Plan</h3>
            <select
              value={selectedPlan.planName}
              onChange={(e) => setSelectedPlan(plansData.find(p => p.planName === e.target.value))}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-bold focus:outline-none focus:border-green-500"
            >
              {plansData.map(plan => (
                <option key={plan.planName} value={plan.planName}>
                  {plan.planName} — ${plan.monthly.toLocaleString()}/month ({plan.tier})
                </option>
              ))}
            </select>

            <div className="mt-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">Setup Fee</label>
              <input
                type="number"
                value={setupFee}
                onChange={(e) => setSetupFee(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => setShowPreview(true)}
              className="w-full py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition"
            >
              👁️ Preview Proposal
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleDownloadPDF}
                className="py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition"
              >
                📄 Download PDF
              </button>
              <button
                onClick={handleEmailClient}
                className="py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition"
              >
                📧 Email to Client
              </button>
            </div>
          </div>
        </div>

        {/* Quick Preview */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-bold text-gray-900 text-lg mb-4">📊 Plan Summary</h3>
          
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white mb-6">
            <p className="text-green-200 text-sm">Selected Plan</p>
            <p className="text-3xl font-black">{selectedPlan.planName}</p>
            <p className="text-green-200 mt-1">{selectedPlan.tier} Tier</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Monthly Investment</span>
              <span className="font-bold text-gray-900">${selectedPlan.monthly.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Setup Fee (One-Time)</span>
              <span className="font-bold text-gray-900">${setupFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Guaranteed Appointments</span>
              <span className="font-bold text-gray-900">{selectedPlan.guaranteedAppts}/year</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Appointment Goal</span>
              <span className="font-bold text-green-600">{selectedPlan.apptGoal}/year</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Businesses Contacted</span>
              <span className="font-bold text-gray-900">{selectedPlan.contacts.toLocaleString()}/year</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Total Points of Contact</span>
              <span className="font-bold text-gray-900">{selectedPlan.pointsOfContact.toLocaleString()}/year</span>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-700">First Month Total</span>
              <span className="text-2xl font-black text-green-600">
                ${(selectedPlan.monthly + setupFee).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Then ${selectedPlan.monthly.toLocaleString()}/month ongoing
            </p>
          </div>

          {/* Sending from */}
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-green-700 text-sm font-medium">Proposal will be sent from:</p>
            <p className="text-green-900 font-bold">{repName}</p>
            <p className="text-green-700 text-sm">{repEmail}</p>
          </div>
        </div>
      </div>

      {/* Full Proposal Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setShowPreview(false)}>
          <div 
            className="bg-white rounded-2xl max-w-3xl w-full my-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-900">Proposal Preview</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadPDF}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  📄 Download PDF
                </button>
                <button
                  onClick={handleEmailClient}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
                >
                  📧 Email Client
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Proposal Content */}
            <div ref={proposalRef} className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl mb-4">
                  <span className="text-3xl font-black text-white">K</span>
                </div>
                <h1 className="text-3xl font-black text-gray-900">Kinect B2B</h1>
                <p className="text-gray-500">Business Growth Solutions</p>
              </div>

              {/* Proposal Title */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8 text-center">
                <p className="text-gray-500 text-sm">PROPOSAL FOR</p>
                <h2 className="text-2xl font-black text-gray-900">{clientInfo.company || '[Company Name]'}</h2>
                <p className="text-gray-600">{clientInfo.name || '[Contact Name]'}</p>
                <div className="mt-4 text-sm text-gray-500">
                  <p>Prepared: {today}</p>
                  <p>Valid Until: {validUntil}</p>
                </div>
              </div>

              {/* Plan Details */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-green-600 mb-4 pb-2 border-b-2 border-green-600">
                  Recommended Plan: {selectedPlan.planName}
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Guaranteed Appointments</p>
                    <p className="text-2xl font-black text-gray-900">{selectedPlan.guaranteedAppts}/year</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-green-700 text-sm">Appointment Goal</p>
                    <p className="text-2xl font-black text-green-600">{selectedPlan.apptGoal}/year</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Businesses Contacted</p>
                    <p className="text-2xl font-black text-gray-900">{selectedPlan.contacts.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Total Touchpoints</p>
                    <p className="text-2xl font-black text-gray-900">{selectedPlan.pointsOfContact.toLocaleString()}</p>
                  </div>
                </div>

                {/* Outreach Breakdown */}
                <h4 className="font-bold text-gray-900 mb-3">Annual Outreach Breakdown</h4>
                <table className="w-full mb-6">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3 font-bold text-gray-700">Channel</th>
                      <th className="text-right p-3 font-bold text-gray-700">Annual Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 text-gray-700">📞 Phone Calls</td>
                      <td className="p-3 text-right font-bold">{selectedPlan.calls.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 text-gray-700">📧 Emails</td>
                      <td className="p-3 text-right font-bold">{selectedPlan.emails.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 text-gray-700">💬 SMS Messages</td>
                      <td className="p-3 text-right font-bold">{selectedPlan.sms.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Investment */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-green-600 mb-4 pb-2 border-b-2 border-green-600">
                  Your Investment
                </h3>
                
                <table className="w-full mb-4">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 text-gray-700">Setup Fee (One-Time)</td>
                      <td className="p-3 text-right font-bold">${setupFee.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="p-3 text-gray-700">Monthly Service Fee</td>
                      <td className="p-3 text-right font-bold">${selectedPlan.monthly.toLocaleString()}/month</td>
                    </tr>
                  </tbody>
                </table>

                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white text-center">
                  <p className="text-green-200 text-sm">To Get Started</p>
                  <p className="text-4xl font-black">${(selectedPlan.monthly + setupFee).toLocaleString()}</p>
                  <p className="text-green-200 text-sm mt-1">First month + setup fee</p>
                </div>
              </div>

              {/* What's Included */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-green-600 mb-4 pb-2 border-b-2 border-green-600">
                  What's Included
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Dedicated Account Manager</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Custom Target List Development</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Multi-Channel Outreach (Calls, Emails, SMS)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Appointment Scheduling Directly to Your Calendar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Real-Time Reporting Dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>24/7 Email Support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="font-bold">Appointment Guarantee — If we don't deliver, you don't pay full price</span>
                  </li>
                </ul>
              </div>

              {/* Footer */}
              <div className="text-center text-gray-500 text-sm mt-8 pt-8 border-t border-gray-200">
                <p className="font-bold text-gray-700">Ready to grow your business?</p>
                <p className="mt-2">Contact me to get started:</p>
                <p className="font-bold text-green-600 text-lg">{repName}</p>
                <p>📧 {repEmail}</p>
                <p className="mt-2">🌐 kinect-b2b.com</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}