import React from 'react';
import { AuthCard } from '@/src/features/auth/presentation/AuthCard';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E6F0F2] to-[#F5F9FA] p-4">
      <AuthCard />
    </div>
  );
}
