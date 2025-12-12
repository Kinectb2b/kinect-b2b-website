'use client';

import { useRouter } from 'next/navigation';

export default function AdminDirectory() {
  const router = useRouter();

  const portals = [
    {
      name: 'Client Portal',
      description: 'Manage clients, appointments, and subscriptions',
      icon: '👥',
      color: 'from-blue-600 to-blue-700',
      path: '/portal/admin/login'
    },
    {
      name: 'Affiliate Portal',
      description: 'Manage affiliates, referrals, and commissions',
      icon: '🤝',
      color: 'from-purple-600 to-purple-700',
      path: '/affiliate/admin/login'
    },
    {
      name: 'Sales Portal',
      description: 'Manage sales team, leads, and pipeline',
      icon: '📊',
      color: 'from-emerald-600 to-emerald-700',
      path: '/sales/admin/login'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-6">
        <div className="max-w-5xl w-full">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <div className="flex justify-center mb-4">
              <img src="/icon.png" alt="Kinect B2B" className="w-16 h-16 rounded-2xl shadow-lg" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Admin Directory</h1>
            <p className="text-slate-400">Select the portal you'd like to access</p>
          </div>

          {/* Portal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {portals.map((portal, index) => (
              <button
                key={index}
                onClick={() => router.push(portal.path)}
                className="bg-white rounded-2xl p-6 md:p-8 hover:scale-105 transition-all duration-300 hover:shadow-2xl group text-left"
              >
                {/* Icon */}
                <div className="text-5xl md:text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {portal.icon}
                </div>

                {/* Portal Name */}
                <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-2">
                  {portal.name}
                </h2>

                {/* Description */}
                <p className="text-slate-500 text-sm mb-5">
                  {portal.description}
                </p>

                {/* Arrow Button */}
                <div className={`bg-gradient-to-r ${portal.color} text-white px-5 py-2.5 rounded-xl font-bold group-hover:shadow-lg transition-all inline-flex items-center gap-2 text-sm`}>
                  Access Portal
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          {/* Back to Home Link */}
          <div className="text-center mt-8 md:mt-12">
            <button
              onClick={() => router.push('/')}
              className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src="/icon.png" alt="Kinect B2B" className="w-5 h-5 rounded" />
          <span className="text-slate-400 text-sm">Powered by <span className="font-semibold text-slate-300">Kinect B2B</span></span>
        </div>
        <p className="text-slate-500 text-xs">© {new Date().getFullYear()} Kinect B2B. All rights reserved.</p>
      </footer>
    </div>
  );
}