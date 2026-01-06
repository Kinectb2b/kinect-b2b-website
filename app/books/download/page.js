'use client';

import { useEffect, useState } from 'react';

export default function BookDownloadPage() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-download after countdown
          handleDownload();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDownload = () => {
    // Trigger download
    const link = document.createElement('a');
    link.href = '/SCALE_YOUR_SERVICE_BASED_BUSINESS.pdf';
    link.download = 'Scale_Your_Service_Based_Business.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-4xl font-black text-gray-900 mb-4">
            Success! Your Book is Ready
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Thank you for downloading "Scale Your Service Based Business"
          </p>

          {/* Countdown */}
          {countdown > 0 ? (
            <div className="mb-8">
              <div className="text-6xl font-black text-purple-600 mb-2">{countdown}</div>
              <p className="text-gray-600">Your download will start automatically...</p>
            </div>
          ) : (
            <div className="mb-8">
              <p className="text-green-600 font-semibold text-lg">✓ Download Started!</p>
            </div>
          )}

          {/* Manual Download Button */}
          <button
            onClick={handleDownload}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg mb-8"
          >
            Click Here if Download Doesn't Start
          </button>

          {/* Next Steps */}
          <div className="bg-purple-50 rounded-2xl p-6 text-left">
            <h3 className="font-bold text-gray-900 text-lg mb-4">What's Next?</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
                  1
                </div>
                <p className="text-gray-700">Read through the book and implement the strategies</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
                  2
                </div>
                <p className="text-gray-700">Check your email - we'll send you bonus resources</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Need help? Contact us at{' '}
              <a href="mailto:info@kinectb2b.com" className="text-purple-600 font-semibold">
                info@kinectb2b.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}