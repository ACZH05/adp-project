import React from 'react';
import { OfficerAppointment } from '../../data/mockAppointments';

interface AppointmentTableProps {
  appointments: OfficerAppointment[];
  onApprove: (id: string) => void;
  onReschedule: (id: string) => void;
}

export const AppointmentTable: React.FC<AppointmentTableProps> = ({ appointments, onApprove, onReschedule }) => {
  const renderStatusBadge = (status: OfficerAppointment['status']) => {
    if (status === 'Approved') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/10 text-success">Approved</span>;
    }
    if (status === 'Conflicted') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-error/10 text-error">Conflicted</span>;
    }
    if (status === 'Completed') {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-container text-text-muted">Completed</span>;
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-info/10 text-info">Pending</span>;
  };

  return (
    <div className="bg-white border border-border-muted rounded-lg shadow-sm overflow-hidden w-full flex flex-col h-full">
      <div className="px-5 py-4 border-b border-border-muted bg-surface-container-low">
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
                    {renderStatusBadge(app.status)}
                  </td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onApprove(app.id)}
                        disabled={app.status !== 'Pending' && app.status !== 'Conflicted'}
                        className="px-3 py-1.5 text-xs font-bold bg-primary text-white rounded hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => onReschedule(app.id)}
                        className="px-3 py-1.5 text-xs font-bold border border-border-muted text-text-main rounded hover:bg-slate-100 transition-colors"
                      >
                        Reschedule
                      </button>
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
