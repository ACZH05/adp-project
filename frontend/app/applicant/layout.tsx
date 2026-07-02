import React from 'react';
import { ApplicantTopNav } from '@/src/shared/components/ApplicantTopNav';
import { ChatbotWidget } from '@/src/shared/components/ChatbotWidget';

export default function ApplicantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ApplicantTopNav />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <ChatbotWidget />
    </div>
  );
}
