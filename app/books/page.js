'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BookLandingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    business_name: '',
    name: '',
    phone: '',
    email: '',
    industry: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/book-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        router.push('/books/download');
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setError('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 overflow-hidden">
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.2); }
          50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.6), 0 0 80px rgba(168, 85, 247, 0.3); }
        }

        .book-scene {
          perspective: 2500px;
          perspective-origin: center;
        }

        .book-3d-container {
          transform-style: preserve-3d;
          transform: rotateY(-30deg) rotateX(5deg);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .book-scene:hover .book-3d-container {
          transform: rotateY(-25deg) rotateX(8deg) translateY(-30px);
        }

        .book-cover-main {
          transform-style: preserve-3d;
          position: relative;
        }

        .book-spine-3d {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 60px;
          background: linear-gradient(to right, #1e293b, #334155, #1e293b);
          transform-origin: right center;
          transform: translateX(-60px) rotateY(90deg);
          box-shadow: inset -20px 0 30px rgba(0,0,0,0.8);
        }

        .book-pages {
          position: absolute;
          right: 0;
          top: 2%;
          bottom: 2%;
          width: 20px;
          background: linear-gradient(to left, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%);
          box-shadow: 
            inset -5px 0 10px rgba(0,0,0,0.1),
            2px 0 5px rgba(0,0,0,0.2);
          border-radius: 0 4px 4px 0;
        }

        .page-layer {
          position: absolute;
          right: 0;
          height: 96%;
          top: 2%;
          background: white;
          box-shadow: 2px 0 4px rgba(0,0,0,0.15);
          border-radius: 0 2px 2px 0;
        }

        .book-shadow {
          position: absolute;
          bottom: -60px;
          left: 50%;
          transform: translateX(-50%) rotateX(90deg);
          width: 120%;
          height: 100px;
          background: radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, transparent 70%);
          filter: blur(20px);
        }

        .floating-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: rgba(168, 85, 247, 0.6);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      {/* Animated Background Particles */}
      <div className="floating-particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Ultra-Premium 3D Book */}
            <div className="relative">
              {/* Limited Time Badge */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-black text-sm shadow-2xl animate-pulse">
                  ⚡ LIMITED TIME - INSTANT DOWNLOAD
                </div>
              </div>

              {/* 3D Book Scene */}
              <div className="book-scene relative pt-12 pb-20">
                <div className="book-3d-container mx-auto" style={{ width: '420px', maxWidth: '100%' }}>
                  <div className="book-cover-main relative">
                    {/* Main Book Cover with Glow */}
                    <div className="relative" style={{ animation: 'glow 3s ease-in-out infinite' }}>
                      <img 
                        src="/book-cover.jpg" 
                        alt="Scale Your Service Based Business - Robert Cole"
                        className="w-full h-auto rounded-r-xl"
                        style={{ 
                          boxShadow: `
                            -20px 20px 60px rgba(0,0,0,0.7),
                            -10px 10px 30px rgba(0,0,0,0.5),
                            0 5px 15px rgba(168, 85, 247, 0.3)
                          `,
                          filter: 'brightness(1.05) contrast(1.1)'
                        }}
                      />
                    </div>

                    {/* Book Spine with Text */}
                    <div className="book-spine-3d">
                      <div className="h-full flex items-center justify-center py-8">
                        <div 
                          className="text-white text-sm font-black tracking-wider"
                          style={{ 
                            writingMode: 'vertical-rl',
                            textOrientation: 'mixed',
                            transform: 'rotate(180deg)',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                          }}
                        >
                          SCALE YOUR SERVICE BUSINESS • ROBERT COLE
                        </div>
                      </div>
                    </div>

                    {/* Realistic Book Pages */}
                    <div className="book-pages">
                      <div className="page-layer" style={{ width: '3px', right: '17px' }}></div>
                      <div className="page-layer" style={{ width: '3px', right: '14px', opacity: 0.9 }}></div>
                      <div className="page-layer" style={{ width: '3px', right: '11px', opacity: 0.8 }}></div>
                      <div className="page-layer" style={{ width: '3px', right: '8px', opacity: 0.7 }}></div>
                      <div className="page-layer" style={{ width: '3px', right: '5px', opacity: 0.6 }}></div>
                    </div>

                    {/* Ground Shadow */}
                    <div className="book-shadow"></div>
                  </div>
                </div>

                {/* Accent Glow Behind Book */}
                <div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600 rounded-full opacity-20 blur-3xl -z-10"
                  style={{ animation: 'glow 4s ease-in-out infinite' }}
                ></div>
              </div>

              {/* Price Section */}
              <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-6 mb-4">
                  <div className="relative">
                    <span className="text-5xl text-gray-500 line-through font-black">$49.99</span>
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full rotate-12">
                      SAVE 100%
                    </div>
                  </div>
                  <div className="text-7xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                    FREE
                  </div>
                </div>
                <p className="text-2xl text-purple-300 font-bold mb-6">
                  🎁 Get Your Free Digital Copy - Instant Access!
                </p>
                <div className="inline-flex items-center gap-2 bg-purple-900/50 text-purple-200 px-6 py-3 rounded-full border border-purple-500/30">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/>
                  </svg>
                  <span className="font-semibold">2,847 downloads in the last 30 days</span>
                </div>
              </div>

              {/* Key Benefits */}
              <div className="space-y-4 max-w-md mx-auto">
                {[
                  'The exact blueprint used by 500+ service businesses to scale',
                  'Step-by-step system for landing high-value commercial clients',
                  'Proven strategies that generated over $10M in revenue'
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start gap-4 bg-gradient-to-r from-purple-900/30 to-transparent p-4 rounded-xl border border-purple-500/20">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-white text-lg font-medium leading-snug">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Premium Lead Form */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-20"></div>
              
              <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20">
                <div className="mb-8">
                  <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                    📥 INSTANT DOWNLOAD
                  </div>
                  <h2 className="text-4xl font-black text-gray-900 mb-3">
                    Claim Your Free Copy
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Join 2,847+ business owners who've already downloaded this book
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-xl mb-6 font-semibold">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-black text-gray-800 mb-2 uppercase tracking-wide">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      name="business_name"
                      value={formData.business_name}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none text-gray-900 font-medium transition-all"
                      placeholder="Enter your business name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black text-gray-800 mb-2 uppercase tracking-wide">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none text-gray-900 font-medium transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black text-gray-800 mb-2 uppercase tracking-wide">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none text-gray-900 font-medium transition-all"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black text-gray-800 mb-2 uppercase tracking-wide">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none text-gray-900 font-medium transition-all"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-black text-gray-800 mb-2 uppercase tracking-wide">
                      Industry
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 focus:outline-none text-gray-900 font-medium transition-all"
                    >
                      <option value="">Select your industry</option>
                      <option value="Construction">Construction</option>
                      <option value="HVAC">HVAC</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Landscaping">Landscaping</option>
                      <option value="Cleaning">Cleaning Services</option>
                      <option value="Pest Control">Pest Control</option>
                      <option value="Roofing">Roofing</option>
                      <option value="Power Washing">Power Washing</option>
                      <option value="Other">Other Service Business</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white text-xl font-black rounded-xl hover:shadow-2xl hover:scale-105 transition-all transform disabled:opacity-50 disabled:cursor-not-allowed shadow-xl relative overflow-hidden group"
                  >
                    <span className="relative z-10">
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        '📥 GET FREE INSTANT ACCESS NOW'
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>

                  <div className="flex items-start gap-2 pt-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                    </svg>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      <strong>100% Secure.</strong> We respect your privacy. Occasional emails from Kinect B2B. Unsubscribe anytime.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 py-16 border-t border-purple-500/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <p className="text-center text-purple-300 font-black text-lg mb-10 uppercase tracking-wider">
              ⭐ Trusted By Service Business Owners Nationwide
            </p>
            <div className="grid md:grid-cols-3 gap-10">
              {[
                { number: '500+', label: 'Businesses Scaled', icon: '📈' },
                { number: '$10M+', label: 'Revenue Generated', icon: '💰' },
                { number: '4.9★', label: 'Average Rating', icon: '⭐' }
              ].map((stat, i) => (
                <div key={i} className="text-center bg-slate-800/50 rounded-2xl p-8 border border-purple-500/20">
                  <div className="text-5xl mb-4">{stat.icon}</div>
                  <div className="text-6xl font-black text-white mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 text-lg font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
