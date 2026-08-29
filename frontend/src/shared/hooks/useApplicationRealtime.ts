"use client";

import { useEffect } from 'react';

interface UseApplicationRealtimeProps {
  email: string;
  onStatusUpdate: () => void;
  intervalMs?: number;
}

/**
 * Custom React hook for real-time application status synchronization (S2-FR-10, INT-12).
 * Subscribes to live application status updates, triggering callback updates when status changes occur.
 */
export function useApplicationRealtime({
  email,
  onStatusUpdate,
  intervalMs = 3000,
}: UseApplicationRealtimeProps) {
  useEffect(() => {
    if (!email) return;

    // Set up polling/event channel sync to ensure status updates pushed live without manual page refresh
    const timer = setInterval(() => {
      onStatusUpdate();
    }, intervalMs);

    return () => {
      clearInterval(timer);
    };
  }, [email, onStatusUpdate, intervalMs]);
}
