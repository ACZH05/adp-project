import React from 'react';
import { OfficerAppointment } from '../../data/mockAppointments';
import { StatusBadge } from '@/src/shared/components/StatusBadge';
import { Button } from '@/src/shared/components/Button';

interface AppointmentTableProps {
  appointments: OfficerAppointment[];
  onApprove: (id: string) => void;
  onReschedule: (id: string) => void;
}

export const AppointmentTable: React.FC<AppointmentTableProps> = ({ appointments, onApprove, onReschedule }) => {
  return (
    <div className="w-full flex flex-col h-full gap-4">
      <div className="border-b border-slate-200 pb-2">
        <h3 className="font-bold text-primary">Pending Appointments</h3>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-border-muted text-xs font-bold text-text-muted uppercase tracking-wider">
              <th className="px-5 py-3">Applicant</th>
              <th className="px-5 py-3">Date & Time</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-text-muted font-medium">
                  No appointments found.
                </td>
              </tr>
            ) : (
              appointments.map((app) => (
                <tr key={app.id} className="even:bg-slate-50 hover:bg-slate-100 transition-colors">
                  <td className="px-5 py-3">
                    <div className="font-semibold text-text-main">{app.applicantName}</div>
                    <div className="text-xs text-text-muted mt-0.5 font-mono">{app.applicationId}</div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="font-medium text-text-main">{app.date}</div>
                    <div className="text-xs text-text-muted mt-0.5">{app.time}</div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-text-main">{app.type}</span>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="primary"
                        onClick={() => onApprove(app.id)}
                        disabled={app.status !== 'Pending' && app.status !== 'Conflicted'}
                        className="px-3 py-1.5 text-xs h-8"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => onReschedule(app.id)}
                        className="px-3 py-1.5 text-xs h-8"
                      >
                        Reschedule
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
