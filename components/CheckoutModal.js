'use client';

import { useState } from 'react';
import CheckoutButton from './CheckoutButton';

export default function CheckoutModal({ priceId, planName, amount, isOpen, onClose }) {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation
    if (!clientName || !clientEmail || !clientPhone || !companyName) {
      alert('Please fill in all required fields');
      return;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-gray-900">Complete Purchase</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-lg font-bold text-gray-900">{planName}</p>
          <p className="text-3xl font-black text-blue-600">{amount}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="John Smith"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="john@company.com"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="ABC Company"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Industry *
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              required
            >
              <option value="">Select Industry</option>
              <option value="Cleaning Services">Cleaning Services</option>
              <option value="Landscaping">Landscaping</option>
              <option value="HVAC">HVAC</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Roofing">Roofing</option>
              <option value="Painting">Painting</option>
              <option value="Pest Control">Pest Control</option>
              <option value="Pool Services">Pool Services</option>
              <option value="Construction">Construction</option>
              <option value="Property Management">Property Management</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="pt-4">
            <CheckoutButton
              priceId={priceId}
              clientEmail={clientEmail}
              clientName={clientName}
              clientPhone={clientPhone}
              companyName={companyName}
              industry={industry}
              planName={planName}
              amount={amount}
            />
          </div>
        </form>
      </div>
    </div>
  );
}