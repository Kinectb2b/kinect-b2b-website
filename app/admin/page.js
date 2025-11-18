'use client';

import { useRouter } from 'next/navigation';

export default function AdminDirectory() {
  const router = useRouter();

  const portals = [
    {
      name: 'Client Portal',
      description: 'Manage clients, appointments, and subscriptions',
      icon: '👥',
      color: 'from-blue-600 to-cyan-600',
      hoverColor: 'hover:from-blue-700 hover:to-cyan-700',
      path: '/portal/admin/login'
    },
    {
      name: 'Affiliate Portal',
      description: 'Manage affiliates, referrals, and commissions',
      icon: '🤝',
      color: 'from-purple-600 to-pink-600',
      hoverColor: 'hover:from-purple-700 hover:to-pink-700',
      path: '/affiliate/admin/login'
    },
    {
      name: 'Sales Portal',
      description: 'Manage sales team, leads, and pipeline',
      icon: '📊',
      color: 'from-green-600 to-emerald-600',
      hoverColor: 'hover:from-green-700 hover:to-emerald-700',
      path: '/sales/admin/login'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-white mb-4">Admin Directory</h1>
          <p className="text-xl text-purple-200">Select the portal you'd like to access</p>
        </div>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {portals.map((portal, index) => (
            <button
              key={index}
              onClick={() => router.push(portal.path)}
              className={`bg-white/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/20 ${portal.hoverColor} hover:scale-105 transition-all duration-300 hover:shadow-2xl group`}
            >
              {/* Icon */}
              <div className="text-7xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {portal.icon}
              </div>

              {/* Portal Name */}
              <h2 className="text-2xl font-black text-white mb-3">
                {portal.name}
              </h2>

              {/* Description */}
              <p className="text-purple-200 text-sm mb-6">
                {portal.description}
              </p>

              {/* Arrow Button */}
              <div className={`bg-gradient-to-r ${portal.color} text-white px-6 py-3 rounded-xl font-bold group-hover:shadow-lg transition-all inline-flex items-center gap-2`}>
                Access Portal
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-12">
          <button
            onClick={() => router.push('/')}
            className="text-purple-300 hover:text-white transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}