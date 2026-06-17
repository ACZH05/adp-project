"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/src/shared/components/Card';
import { Button } from '@/src/shared/components/Button';
import { TextInput } from '@/src/shared/components/TextInput';

export const AuthCard: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email address format.');
    } else {
      setError(undefined);
      // Simulating successful login redirect to Officer Portal Queue
      router.push('/officer/queue');
    }
  };

  return (
    <Card className="w-full max-w-[440px] shadow-sm">
      <div className="flex flex-col items-center gap-8">
        {/* Branding Icon */}
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary tracking-tight">Entertainment Portal</h1>
          <p className="text-sm text-text-muted mt-2">Manage your event licenses and permits.</p>
        </div>

        {/* Tab Switcher */}
        <div className="w-full grid grid-cols-2 p-1 bg-surface-container rounded-lg">
          <button
            onClick={() => setActiveTab('login')}
            className={`
              py-2 text-sm font-semibold rounded-md transition-all
              ${activeTab === 'login' ? 'bg-white text-primary shadow-sm' : 'text-text-muted hover:text-text-main'}
            `}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`
              py-2 text-sm font-semibold rounded-md transition-all
              ${activeTab === 'register' ? 'bg-white text-primary shadow-sm' : 'text-text-muted hover:text-text-main'}
            `}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAuth} className="w-full flex flex-col gap-6">
          <TextInput
            label="Email Address"
            id="email"
            type="email"
            placeholder="applicant@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            }
          />

          <TextInput
            label="Password"
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rightIcon={
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            }
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            }
          />

          {activeTab === 'login' && (
            <div className="flex justify-end -mt-3">
              <button type="button" className="text-sm font-semibold text-info hover:underline">
                Forgot Password?
              </button>
            </div>
          )}

          <Button type="submit" className="w-full py-3 mt-2 flex gap-2">
            {activeTab === 'login' ? 'Sign In' : 'Register'}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </Button>
        </form>

        <div className="text-sm text-text-muted">
          Need technical support?{' '}
          <a href="#" className="font-semibold text-info hover:underline">
            Contact Help Desk
          </a>
        </div>
      </div>
    </Card>
  );
};
