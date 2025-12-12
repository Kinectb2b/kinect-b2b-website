'use client';

export default function PlanDetailModal({ plan, tierColors, onClose }) {
  if (!plan) return null;

  const colors = tierColors[plan.tier];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`${colors.bg} p-6 rounded-t-2xl border-b ${colors.border}`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`${colors.badge} text-white text-sm font-black px-3 py-1 rounded-full`}>
                  {plan.tier} Tier
                </span>
                {plan.whiteGlove && (
                  <span className="bg-amber-100 text-amber-700 text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    ⭐ White Glove
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-black text-gray-900">{plan.planName}</h2>
              <div className="mt-2">
                <span className="text-4xl font-black text-green-600">${plan.monthly.toLocaleString()}</span>
                <span className="text-gray-500 text-lg font-medium">/month</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Annual Outreach Metrics */}
          <div>
            <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              📊 Annual Outreach Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard label="Businesses Contacted" value={plan.contacts.toLocaleString()} />
              <StatCard label="Phone Calls" value={plan.calls.toLocaleString()} />
              <StatCard label="Emails Sent" value={plan.emails.toLocaleString()} />
              <StatCard label="SMS Messages" value={plan.sms.toLocaleString()} />
              <StatCard label="Total Points of Contact" value={plan.pointsOfContact.toLocaleString()} highlight />
            </div>
          </div>

          {/* Appointment Metrics */}
          <div>
            <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              📅 Appointment Performance
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
                <p className="text-green-700 text-sm font-bold mb-1">Guaranteed Appointments</p>
                <p className="text-3xl font-black text-green-600">{plan.guaranteedAppts}</p>
                <p className="text-gray-500 text-sm mt-1">per year</p>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center">
                <p className="text-blue-700 text-sm font-bold mb-1">Appointment Goal</p>
                <p className="text-3xl font-black text-blue-600">{plan.apptGoal}</p>
                <p className="text-gray-500 text-sm mt-1">per year</p>
              </div>
            </div>
          </div>

          {/* Support & Team */}
          <div>
            <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              👥 Support & Team
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-gray-500 text-sm font-medium mb-1">Sales Reps</p>
                <p className="text-2xl font-black text-gray-900">{plan.salesReps}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-gray-500 text-sm font-medium mb-1">Account Managers</p>
                <p className="text-2xl font-black text-gray-900">{plan.acctManagers}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-gray-500 text-sm font-medium mb-1">24/7 Email Support</p>
                <p className="text-2xl font-black text-green-600">✓</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-gray-500 text-sm font-medium mb-1">Territory Specific</p>
                <p className="text-2xl font-black text-green-600">{plan.territorySpecific ? '✓' : '—'}</p>
              </div>
            </div>
          </div>

          {/* Benefits & Perks */}
          <div>
            <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              🎁 Benefits & Perks
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <BenefitRow label="Lead List Included" value={plan.leadList} />
              <BenefitRow label="White Glove Service" value={plan.whiteGlove} />
              <BenefitRow label="Strategy Calls" value={plan.strategyCall || false} display={plan.strategyCall} />
              <BenefitRow label="Business Review" value={plan.businessReview || false} display={plan.businessReview} />
              <BenefitRow label="Sales Meetings" value={plan.salesMeeting || false} display={plan.salesMeeting} />
            </div>
          </div>

          {/* Discounts */}
          {(plan.websiteDiscount || plan.automationsDiscount || plan.portalDiscount) && (
            <div>
              <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                🏷️ Service Discounts
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {plan.websiteDiscount && (
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 text-center">
                    <p className="text-purple-700 text-sm font-bold mb-1">Website</p>
                    <p className="text-2xl font-black text-purple-600">{plan.websiteDiscount}</p>
                    <p className="text-gray-500 text-xs">discount</p>
                  </div>
                )}
                {plan.automationsDiscount && (
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 text-center">
                    <p className="text-purple-700 text-sm font-bold mb-1">Automations</p>
                    <p className="text-2xl font-black text-purple-600">{plan.automationsDiscount}</p>
                    <p className="text-gray-500 text-xs">discount</p>
                  </div>
                )}
                {plan.portalDiscount && (
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 text-center">
                    <p className="text-purple-700 text-sm font-bold mb-1">Portal</p>
                    <p className="text-2xl font-black text-purple-600">{plan.portalDiscount}</p>
                    <p className="text-gray-500 text-xs">discount</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pricing Summary */}
          <div className={`${colors.bg} ${colors.border} border-2 rounded-xl p-6`}>
            <h3 className="text-lg font-black text-gray-900 mb-4">💰 Pricing Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Monthly Investment</span>
                <span className="text-xl font-black text-gray-900">${plan.monthly.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Annual Investment</span>
                <span className="text-xl font-black text-gray-900">${(plan.monthly * 12).toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Cost per Guaranteed Appointment</span>
                  <span className={`text-xl font-black ${colors.text}`}>
                    ${((plan.monthly * 12) / plan.guaranteedAppts).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight }) {
  return (
    <div className={`${highlight ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'} border-2 rounded-xl p-4 text-center`}>
      <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
      <p className={`text-xl font-black ${highlight ? 'text-green-600' : 'text-gray-900'}`}>{value}</p>
    </div>
  );
}

function BenefitRow({ label, value, display }) {
  const isIncluded = value === true || (typeof value === 'string' && value);
  
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg ${isIncluded ? 'bg-green-50' : 'bg-gray-50'}`}>
      <span className="text-gray-700 font-medium">{label}</span>
      {isIncluded ? (
        <span className="text-green-600 font-bold flex items-center gap-1">
          ✓ {display || 'Included'}
        </span>
      ) : (
        <span className="text-gray-400">—</span>
      )}
    </div>
  );
}