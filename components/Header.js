'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown } from 'lucide-react';

export default function Header({ currentPage = '' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  const isActive = (path) => currentPage === path;

  const services = [
    { name: 'Appointment Setting', href: '/services/appointment-setting' },
    { name: 'Websites', href: '/services/websites' },
    { name: 'Automations', href: '/services/automations' },
    { name: 'Client Portals', href: '/services/portals' },
  ];

  const isServicePage = services.some(s => currentPage === s.href);

  return (
    <header className="bg-slate-900 border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/my-logo.png"
              alt="Kinect B2B"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-xl md:text-2xl font-bold text-white">
              Kinect B2B
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/"
              className={`${isActive('/') ? 'text-cyan-400' : 'text-slate-300'} hover:text-white transition font-medium`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`${isActive('/about') ? 'text-cyan-400' : 'text-slate-300'} hover:text-white transition font-medium`}
            >
              About
            </Link>

            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                onBlur={() => setTimeout(() => setServicesDropdownOpen(false), 150)}
                className={`${isServicePage ? 'text-cyan-400' : 'text-slate-300'} hover:text-white transition font-medium flex items-center gap-1`}
              >
                Services
                <ChevronDown className={`w-4 h-4 transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-2">
                  {services.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      className={`block px-4 py-2 ${isActive(service.href) ? 'text-cyan-400' : 'text-slate-300'} hover:text-white hover:bg-slate-700 transition`}
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/plans"
              className={`${isActive('/plans') ? 'text-cyan-400' : 'text-slate-300'} hover:text-white transition font-medium`}
            >
              Plans
            </Link>

            <Link
              href="/plans"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-5 py-2.5 rounded-lg font-semibold transition"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-slate-800 pt-4">
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                className={`${isActive('/') ? 'text-cyan-400' : 'text-slate-300'} hover:text-white transition`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className={`${isActive('/about') ? 'text-cyan-400' : 'text-slate-300'} hover:text-white transition`}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>

              {/* Mobile Services */}
              <div className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Services</div>
              {services.map((service) => (
                <Link
                  key={service.href}
                  href={service.href}
                  className={`${isActive(service.href) ? 'text-cyan-400' : 'text-slate-300'} hover:text-white transition pl-4`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {service.name}
                </Link>
              ))}

              <Link
                href="/plans"
                className={`${isActive('/plans') ? 'text-cyan-400' : 'text-slate-300'} hover:text-white transition`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Plans
              </Link>

              <Link
                href="/plans"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-3 rounded-lg font-semibold transition text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
