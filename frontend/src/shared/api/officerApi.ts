const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

export interface OfficerDecisionPayload {
  decisionType: 'approved' | 'rejected' | 'correction_required';
  reasonCode?: string;
  reason?: string;
  officerNote?: string;
  officerUserId?: string;
}

/**
 * Fetches review queue applications from the backend.
 */
export async function fetchOfficerQueue(params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const queryParams = new URLSearchParams();
  if (params?.status && params.status !== 'all') {
    queryParams.append('status', params.status);
  }
  if (params?.search) {
    queryParams.append('search', params.search);
  }
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }

  const url = `${API_BASE_URL}/officer/applications?${queryParams.toString()}`;
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(`Failed to fetch officer queue: ${res.statusText}`);
  }

  return await res.json();
}

/**
 * Fetches detailed application case information by ID.
 */
export async function fetchApplicationDetail(id: string) {
  const url = `${API_BASE_URL}/officer/applications/${id}`;
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(`Failed to fetch application detail: ${res.statusText}`);
  }

  return await res.json();
}

/**
 * Submits an officer review decision (Approve, Reject, Request Correction).
 */
export async function submitOfficerDecision(id: string, payload: OfficerDecisionPayload) {
  const url = `${API_BASE_URL}/officer/applications/${id}/decision`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `Failed to submit officer decision: ${res.statusText}`);
  }

  return await res.json();
}

/**
 * Fetches decision audit history for an application case.
 */
export async function fetchDecisionHistory(id: string) {
  const url = `${API_BASE_URL}/officer/applications/${id}/decisions`;
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(`Failed to fetch decision history: ${res.statusText}`);
  }

  return await res.json();
}

/**
 * Fetches status distribution dashboard analytics summary.
 */
export async function fetchAnalyticsDashboard(startDate?: string, endDate?: string) {
  const queryParams = new URLSearchParams();
  if (startDate) queryParams.append('startDate', startDate);
  if (endDate) queryParams.append('endDate', endDate);

  const url = `${API_BASE_URL}/analytics/dashboard?${queryParams.toString()}`;
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(`Failed to fetch analytics dashboard: ${res.statusText}`);
  }

  return await res.json();
}

/**
 * Fetches KPI target metrics (incomplete rate reduction and cycle processing times).
 */
export async function fetchKpiMetrics(startDate?: string, endDate?: string) {
  const queryParams = new URLSearchParams();
  if (startDate) queryParams.append('startDate', startDate);
  if (endDate) queryParams.append('endDate', endDate);

  const url = `${API_BASE_URL}/analytics/kpis?${queryParams.toString()}`;
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(`Failed to fetch KPI metrics: ${res.statusText}`);
  }

  return await res.json();
}

/**
 * Fetches queue performance metrics (queue wait time, AI processing time, retries, dead-letter rate).
 */
export async function fetchQueueMetrics(startDate?: string, endDate?: string) {
  const queryParams = new URLSearchParams();
  if (startDate) queryParams.append('startDate', startDate);
  if (endDate) queryParams.append('endDate', endDate);

  const url = `${API_BASE_URL}/analytics/queue-metrics?${queryParams.toString()}`;
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(`Failed to fetch queue performance metrics: ${res.statusText}`);
  }

  return await res.json();
}

/**
 * Exports operational analytics report.
 */
export async function exportAnalyticsReport() {
  const url = `${API_BASE_URL}/analytics/export`;
  const res = await fetch(url, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error(`Failed to export analytics report: ${res.statusText}`);
  }

  return await res.json();
}
