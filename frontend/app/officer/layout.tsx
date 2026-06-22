"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { SideNav } from '@/src/features/officer/presentation/SideNav';

export default function OfficerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Determine active path for the SideNav based on URL
  let activePath = '/officer/queue';
  if (pathname.includes('/officer/appointments')) {
    activePath = '/officer/appointments';
  } else if (pathname.includes('/officer/analytics')) {
    activePath = '/officer/analytics';
  } else if (pathname.includes('/officer/review')) {
    activePath = '/officer/queue'; // Officer review falls under queue navigation item
  } else if (pathname.includes('/officer/settings')) {
    activePath = '/officer/settings';
  } else if (pathname.includes('/officer/dashboard')) {
    activePath = '/officer/dashboard';
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background text-foreground font-sans">
      {/* Sidebar Navigation */}
      <SideNav activePath={activePath} />

      {/* Spacer to prevent main content from sliding under the fixed sidebar on desktop */}
      <div className="hidden lg:block w-64 shrink-0" />

      {/* Main Content Area wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
