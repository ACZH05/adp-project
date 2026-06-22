"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SideNavProps {
  activePath?: string;
}

export const SideNav: React.FC<SideNavProps> = ({ activePath = '/officer/queue' }) => {
  const router = useRouter();
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const navItems = [
    {
      name: 'Application Queue',
      path: '/officer/queue',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
          <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </svg>
      )
    },
    {
      name: 'Analytics',
      path: '/officer/analytics',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      )
    },
    {
      name: 'Appointments',
      path: '/officer/appointments',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    },
    {
      name: 'Settings',
      path: '/officer/settings',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    }
  ];

  const handleLogout = () => {
    router.push('/auth');
  };

  return (
    <>
      {/* Small Screen / Mobile Header */}
      <header className="lg:hidden w-full h-16 bg-primary text-white flex items-center justify-between px-4 z-30 sticky top-0 shadow-sm">
        <div className="flex items-center gap-2">
          {/* Logo Emblem */}
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" />
              <path d="M2 17L12 22L22 17" />
              <path d="M2 12L12 17L22 12" />
            </svg>
          </div>
          <span className="font-bold text-sm tracking-tight">ADP Officer Portal</span>
        </div>
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="p-1 rounded-default focus:outline-none hover:bg-white/10 text-white"
          aria-label="Toggle navigation menu"
        >
          {isOpenMobile ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-20 transition-opacity"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Navigation Drawer (Mobile) & Fixed Sidebar (Desktop) */}
      <aside className={`
        fixed inset-y-0 left-0 z-20 w-64 bg-primary text-white flex flex-col justify-between
        transition-transform duration-300 transform border-r border-primary-container
        lg:translate-x-0 lg:fixed lg:inset-y-0 lg:left-0 lg:h-screen lg:z-auto
        ${isOpenMobile ? 'translate-x-0 pt-16' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Section */}
        <div className="flex flex-col">
          {/* Logo Branding - Desktop only */}
          <div className="hidden lg:flex items-center gap-3 px-6 py-6 border-b border-white/10">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                <path d="M2 17L12 22L22 17" />
                <path d="M2 12L12 17L22 12" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight text-white leading-none">ADP Portal</h2>
              <span className="text-[10px] text-on-primary-container font-semibold tracking-wider uppercase mt-1 block">GovTech Agency</span>
            </div>
          </div>

          {/* Profile Card */}
          <div className="px-6 py-5 border-b border-white/10 bg-primary-container/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white text-primary font-bold flex items-center justify-center text-sm border border-white/20">
                OT
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Officer Tan</h3>
                <p className="text-xs text-on-primary-container font-medium mt-0.5">Senior Reviewer</p>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="px-4 py-6 flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = activePath === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-default text-sm font-semibold transition-all
                    ${isActive
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-on-primary/80 hover:text-white hover:bg-white/10'}
                  `}
                  onClick={() => setIsOpenMobile(false)}
                >
                  <span className={isActive ? 'text-primary' : 'text-on-primary/70'}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section - Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-default text-sm font-semibold text-red-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};
