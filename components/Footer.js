'use client';

import Link from 'next/link';
import { Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold text-white">Kinect B2B</span>
            </Link>
            <p className="text-slate-400 text-sm">
              Boutique appointment setting for service businesses. We book qualified appointments. You close deals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-slate-400 hover:text-white transition text-sm">Home</Link>
              <Link href="/about" className="text-slate-400 hover:text-white transition text-sm">About</Link>
              <Link href="/plans" className="text-slate-400 hover:text-white transition text-sm">Plans</Link>
            </nav>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/services/appointment-setting" className="text-slate-400 hover:text-white transition text-sm">Appointment Setting</Link>
              <Link href="/services/websites" className="text-slate-400 hover:text-white transition text-sm">Websites</Link>
              <Link href="/services/automations" className="text-slate-400 hover:text-white transition text-sm">Automations</Link>
              <Link href="/services/portals" className="text-slate-400 hover:text-white transition text-sm">Client Portals</Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <div className="flex flex-col gap-3">
              <a
                href="tel:2192707863"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm"
              >
                <Phone className="w-4 h-4" />
                (219) 270-7863
              </a>
              <a
                href="mailto:accounts@kinectb2b.com"
                className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm"
              >
                <Mail className="w-4 h-4" />
                accounts@kinectb2b.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 text-center">
          <p className="text-slate-500 text-sm mb-3">
            &copy; 2025 Kinect B2B. All rights reserved.
          </p>
          <div className="text-sm text-slate-500">
            <Link href="/portal/login" className="hover:text-white transition">Client Login</Link>
            <span className="mx-2">|</span>
            <Link href="/affiliate/login" className="hover:text-white transition">Affiliate Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
