'use client';
import { useState } from 'react';
import Image from 'next/image';
import { DollarSign, Rocket, Target, Zap, ArrowUp } from 'lucide-react';

export default function Affiliate() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    { businesses: 100, price: 250 },
    { businesses: 200, price: 500 },
    { businesses: 300, price: 750 },
    { businesses: 400, price: 1000 },
    { businesses: 500, price: 1250 },
    { businesses: 600, price: 1500 },
    { businesses: 700, price: 1750 },
    { businesses: 800, price: 2000 },
    { businesses: 900, price: 2250 },
    { businesses: 1000, price: 2500 },
    { businesses: 1100, price: 2750 },
    { businesses: 1200, price: 3000 },
  ];

  const calculateCommission = (price) => {
    return (price * 0.1).toFixed(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-slate-900 to-blue-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/my-logo.png"
                alt="Kinect B2B Logo"
                width={40}
                height={40}
                className="w-8 h-8 md:w-10 md:h-10"
              />
              <h1 className="text-xl md:text-3xl font-black text-white">KinectB2B Affiliates</h1>
            </div>
            <div className="flex gap-2 md:gap-4">
              <a href="/" className="px-3 md:px-6 py-2 md:py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-white/20 transition text-sm md:text-base">
                Home
              </a>
              <a href="/affiliate/login" className="px-3 md:px-6 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-bold transition text-sm md:text-base">
                Login
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-black mb-6 md:mb-8">
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Earn $300+
            </span>
            <br />
            <span className="text-white">Monthly</span>
          </h1>

          <p className="text-lg md:text-2xl lg:text-3xl text-gray-300 mb-6 max-w-4xl mx-auto font-light">
            Join the KinectB2B Affiliate Program and earn <span className="text-green-400 font-bold">10% commission</span> every month for <span className="text-cyan-400 font-bold">up to 12 months</span> on every client you refer!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mt-8 md:mt-12">
            <a href="#signup" className="w-full sm:w-auto group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
              <div className="relative px-8 md:px-12 py-4 md:py-6 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl text-white font-black text-lg md:text-2xl hover:scale-110 transition-all duration-300 text-center">
                Start Earning Now
              </div>
            </a>

            <button
              onClick={() => document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 bg-white/10 backdrop-blur-xl border-2 border-white/30 rounded-2xl text-white font-bold text-base md:text-xl hover:bg-white/20 transition-all duration-300"
            >
              Calculate Your Earnings
            </button>
          </div>
        </div>
      </section>

      {/* Commission Banner */}
      <section className="relative py-12 md:py-16 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-3 md:mb-4">
            10% Monthly Commission
          </h2>
          <p className="text-base md:text-2xl text-green-100">
            Get paid every month for up to 12 months as long as your referrals stay active!
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-2xl border border-yellow-500/30 p-6 md:p-10 rounded-3xl">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-yellow-500/20 rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                  <DollarSign className="w-8 h-8 md:w-10 md:h-10 text-yellow-400" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-3 md:mb-4">High Commissions</h3>
                <p className="text-base md:text-xl text-gray-300 leading-relaxed">
                  Earn 10% of your referral's monthly payment for up to 12 months. That's up to <span className="text-green-400 font-bold">$3,600</span> per high-value referral!
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-red-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-2xl border border-pink-500/30 p-6 md:p-10 rounded-3xl">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                  <Rocket className="w-8 h-8 md:w-10 md:h-10 text-pink-400" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-3 md:mb-4">No Sales Experience Required</h3>
                <p className="text-base md:text-xl text-gray-300 leading-relaxed">
                  Simply refer businesses that need more leads. We handle all the sales and onboarding!
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-2xl border border-purple-500/30 p-6 md:p-10 rounded-3xl">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                  <Target className="w-8 h-8 md:w-10 md:h-10 text-purple-400" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-3 md:mb-4">Proven Results</h3>
                <p className="text-base md:text-xl text-gray-300 leading-relaxed">
                  KinectB2B helps service businesses book more qualified appointments with our proven lead generation system.
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-2xl border border-cyan-500/30 p-6 md:p-10 rounded-3xl">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                  <Zap className="w-8 h-8 md:w-10 md:h-10 text-cyan-400" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-3 md:mb-4">Quick Payouts</h3>
                <p className="text-base md:text-xl text-gray-300 leading-relaxed">
                  Get paid within 30 days of your referral becoming a client. Fast, reliable, monthly payments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="relative py-12 md:py-20 bg-gradient-to-b from-transparent via-blue-950/30 to-transparent">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-3 md:mb-4">
              Commission <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Calculator</span>
            </h2>
            <p className="text-lg md:text-2xl text-gray-400">See exactly how much you can earn</p>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-3xl blur-2xl group-hover:blur-3xl transition duration-500"></div>
            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-2xl border-2 border-blue-500/50 p-6 md:p-12 rounded-3xl">

              <div className="mb-6 md:mb-8">
                <label className="text-base md:text-xl font-bold text-white mb-3 md:mb-4 block">
                  Select a Pro Plan to see your commission:
                </label>
                <select
                  onChange={(e) => setSelectedPlan(plans[e.target.value])}
                  className="w-full px-4 md:px-6 py-4 md:py-5 bg-white/10 backdrop-blur-xl border-2 border-blue-500/50 rounded-2xl text-white text-base md:text-xl font-bold appearance-none cursor-pointer hover:border-cyan-400 transition focus:outline-none focus:border-cyan-400"
                >
                  <option value="">Choose a plan...</option>
                  {plans.map((plan, index) => (
                    <option key={index} value={index} className="bg-slate-900">
                      Pro Plan {plan.businesses} - ${plan.price.toLocaleString()}/month
                    </option>
                  ))}
                </select>
              </div>

              {selectedPlan && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-fadeIn">
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl"></div>
                    <div className="relative bg-gradient-to-br from-green-600 to-emerald-600 p-6 md:p-8 rounded-2xl text-center transform hover:scale-105 transition duration-300">
                      <div className="text-white/80 text-sm md:text-lg font-bold mb-2">Monthly Commission</div>
                      <div className="text-4xl md:text-6xl font-black text-white">
                        ${calculateCommission(selectedPlan.price)}
                      </div>
                      <div className="text-green-100 mt-2 text-sm md:text-base">per month</div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl"></div>
                    <div className="relative bg-gradient-to-br from-blue-600 to-cyan-600 p-6 md:p-8 rounded-2xl text-center transform hover:scale-105 transition duration-300">
                      <div className="text-white/80 text-sm md:text-lg font-bold mb-2">12-Month Total</div>
                      <div className="text-4xl md:text-6xl font-black text-white">
                        ${(calculateCommission(selectedPlan.price) * 12).toLocaleString()}
                      </div>
                      <div className="text-blue-100 mt-2 text-sm md:text-base">total earned</div>
                    </div>
                  </div>
                </div>
              )}

              {!selectedPlan && (
                <div className="text-center py-8 md:py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                    <ArrowUp className="w-8 h-8 text-blue-400" />
                  </div>
                  <p className="text-lg md:text-2xl text-gray-400 font-bold">Select a plan above to calculate earnings</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="signup" className="relative py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6">
            Ready to <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Start Earning?</span>
          </h2>
          <p className="text-lg md:text-2xl text-gray-300 mb-8 md:mb-12">
            Join affiliates already earning with KinectB2B
          </p>

          <a href="/affiliate/signup" className="group relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
            <div className="relative px-8 md:px-16 py-5 md:py-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl text-white font-black text-xl md:text-3xl hover:scale-110 transition-all duration-300">
              Sign Up Now - It's Free
            </div>
          </a>

          <div className="mt-8 md:mt-12 text-gray-400 text-sm md:text-base">
            Already an affiliate?{' '}
            <a href="/affiliate/login" className="text-cyan-400 hover:text-cyan-300 font-bold transition">
              Login here
            </a>
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
          <p className="text-gray-500 text-sm md:text-base">© 2025 KinectB2B Affiliates. All rights reserved.</p>
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
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
      `}</style>
    </div>
  );
}
