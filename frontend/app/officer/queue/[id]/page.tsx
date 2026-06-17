import React from 'react';
import { ReviewApplicationScreen } from '@/src/features/officer/presentation/ReviewApplicationScreen';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return {
    title: `Review Application ${id} | Officer Portal`,
    description: `Detailed case audit for application ${id}.`,
  };
}

export default async function OfficerReviewPage({ params }: PageProps) {
  const { id } = await params;
  return <ReviewApplicationScreen id={id} />;
}
