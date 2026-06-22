"use client";

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export const TopNav: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/applicant/dashboard' },
    { name: 'Applications', path: '/applicant/applications' },
    { name: 'Appointments', path: '/applicant/appointments' },
  ];

  const handleSignOut = () => {
    router.push('/auth');
  };

  const isActive = (path: string) => {
    if (path === '/applicant/dashboard') {
      return pathname === '/applicant/dashboard' || pathname === '/applicant/wizard';
    }
    return pathname === path;
  };

  return (
    <nav className="w-full bg-primary text-on-primary border-b border-primary-container shadow-sm z-50">
      <div className="max-w-container-max-width mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Left Side: Logo & Brand */}
        <div
          onClick={() => router.push('/applicant/dashboard')}
          className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-white border border-white/10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <span className="text-xs font-semibold text-on-primary-container/85 uppercase tracking-wider block leading-none">Government of Malaysia</span>
            <span className="text-base font-bold text-white tracking-tight leading-normal">Entertainment Portal</span>
          </div>
        </div>

        {/* Middle: Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-1 h-full">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <button
                key={link.name}
                onClick={() => router.push(link.path)}
                className={`
                  px-4 py-2 text-sm font-semibold rounded-default transition-all h-10 flex items-center
                  ${active
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-on-primary/75 hover:text-white hover:bg-white/5'}
                `}
              >
                {link.name}
              </button>
            );
          })}
        </div>

        {/* Right Side: Profile & Sign Out (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/15 text-white flex items-center justify-center font-bold text-xs border border-white/10 uppercase">
              AA
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight">A. Applicant</span>
              <span className="text-[10px] text-on-primary-container/70 leading-none">Standard User</span>
            </div>
          </div>
          <div className="h-6 w-[1px] bg-white/10" />
          <button
            onClick={handleSignOut}
            className="text-xs font-bold text-on-primary/75 hover:text-white flex items-center gap-1.5 py-2 px-3 rounded-default hover:bg-white/5 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-on-primary hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-primary px-4 py-3 flex flex-col gap-2">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => {
                setMobileMenuOpen(false);
                router.push(link.path);
              }}
              className="w-full text-left py-2 px-3 text-sm font-semibold rounded-default text-on-primary/80 hover:text-white hover:bg-white/5 transition-all"
            >
              {link.name}
            </button>
          ))}
          <div className="h-[1px] bg-white/5 my-1" />
          <div className="flex items-center justify-between py-2 px-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-white">
                AA
              </div>
              <span className="text-xs font-semibold text-white">A. Applicant</span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-xs font-bold text-red-300 hover:text-red-200 flex items-center gap-1.5 py-1.5 px-2 rounded-default hover:bg-white/5 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
