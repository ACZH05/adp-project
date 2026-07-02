"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { ResubmissionScreen } from '@/src/features/applicant/presentation/ResubmissionScreen';

export default function ResubmitPage() {
  const params = useParams();
  const id = params?.id ? String(params.id) : '';

  return <ResubmissionScreen id={id} />;
}
