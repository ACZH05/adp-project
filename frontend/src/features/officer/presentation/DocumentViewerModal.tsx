import React from 'react';
import { DocumentDetail } from '../data/mockApplicationDetails';

interface DocumentViewerModalProps {
  document: DocumentDetail;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({ document, onClose }) => {
  // Helper to render dynamic visual representation of different documents
  const renderVisualPreview = () => {
    const name = document.name.toLowerCase();

    if (name.includes('card') || name.includes('identity') || name.includes('nric') || name.includes('ic_')) {
      // Draw a Malaysian Identity Card (MyKad)
      return (
        <div className="w-full max-w-[380px] aspect-[1.58] border border-sky-200 bg-sky-50/40 rounded-xl p-4 flex flex-col justify-between shadow-md relative overflow-hidden font-sans mx-auto my-6 select-none">
          {/* Card background watermarks/designs */}
          <div className="absolute right-0 top-0 w-24 h-24 bg-sky-200/20 rounded-full blur-xl pointer-events-none"></div>
          <div className="absolute left-10 bottom-0 w-32 h-10 bg-red-200/10 rounded-full blur-xl pointer-events-none"></div>
          
          {/* Header */}
          <div className="flex items-start justify-between border-b border-sky-200 pb-2">
            <div>
              <h4 className="text-[10px] font-bold text-sky-900 tracking-wider">KERAJAAN MALAYSIA</h4>
              <p className="text-[8px] font-bold text-sky-800/60 uppercase">KAD PENGENALAN</p>
            </div>
            <span className="text-[10px] font-mono font-bold text-sky-900 bg-white px-1.5 py-0.5 rounded border border-sky-100">
              900412-01-5678
            </span>
          </div>

          {/* Body */}
          <div className="flex-1 flex gap-4 mt-3">
            {/* Photo Avatar */}
            <div className="w-16 h-20 bg-slate-200 border border-slate-300 rounded flex items-center justify-center shrink-0 overflow-hidden relative">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {/* ID photo watermark */}
              <div className="absolute inset-0 bg-sky-900/5 mix-blend-overlay"></div>
            </div>

            {/* Fields details */}
            <div className="flex-1 flex flex-col gap-1.5 text-[10px]">
              <div>
                <span className="text-[8px] text-sky-900/60 font-bold block uppercase leading-none">Name</span>
                <span className="font-bold text-slate-800 leading-snug">SARAH LIM MIN</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[8px] text-sky-900/60 font-bold block uppercase leading-none">DOB</span>
                  <span className="font-semibold text-slate-700">12-04-1990</span>
                </div>
                <div>
                  <span className="text-[8px] text-sky-900/60 font-bold block uppercase leading-none">Sex</span>
                  <span className="font-semibold text-slate-700">P</span>
                </div>
              </div>
              <div>
                <span className="text-[8px] text-sky-900/60 font-bold block uppercase leading-none">Address</span>
                <span className="font-semibold text-slate-700 text-[9px] leading-tight block">
                  NO. 15, JALAN KEMBOJA 3,<br />TAMAN KEMBOJA, 81000 KULAI, JOHOR
                </span>
              </div>
            </div>
          </div>

          {/* Footer watermark details */}
          <div className="text-[7px] text-sky-800/40 font-mono font-semibold flex items-center justify-between mt-1 pt-1.5 border-t border-sky-100">
            <span>JPN MALAYSIA REGISTRY</span>
            <span>VERIFIED SECURE BY ADP AI</span>
          </div>
        </div>
      );
    }

    if (name.includes('acra') || name.includes('ssm') || name.includes('business') || name.includes('corporate')) {
      // Draw an SSM corporate profile mockup
      return (
        <div className="w-full max-w-[380px] bg-white border border-red-200 rounded-lg p-5 flex flex-col gap-4 shadow-md font-sans mx-auto my-3 relative overflow-hidden select-none">
          {/* Top SSM Header */}
          <div className="flex items-center gap-2.5 border-b border-red-100 pb-3">
            <div className="w-9 h-9 rounded-full bg-red-800/10 flex items-center justify-center text-red-800 shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-red-900 leading-none">SSM BUSINESS PROFILE</h4>
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block mt-1">
                Suruhanjaya Syarikat Malaysia
              </span>
            </div>
          </div>

          {/* Profile fields */}
          <div className="flex flex-col gap-2.5 text-[10px]">
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400 font-bold">Registration No (SSM)</span>
              <span className="font-mono font-bold text-slate-800">202001012345</span>
            </div>
            <div className="flex flex-col py-1 border-b border-slate-100 gap-0.5">
              <span className="text-slate-400 font-bold">Entity Name</span>
              <span className="font-bold text-red-950 uppercase leading-snug">
                LIM & TAN ENTERTAINMENT GROUP SDN. BHD.
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 py-1 border-b border-slate-100">
              <div>
                <span className="text-slate-400 font-bold block">Incorporation Date</span>
                <span className="font-semibold text-slate-700">15/05/2020</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Entity Status</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-success/10 text-success text-[8px] font-bold uppercase tracking-wide">
                  Active Company
                </span>
              </div>
            </div>
            <div className="flex flex-col py-1 border-b border-slate-100 gap-0.5">
              <span className="text-slate-400 font-bold">Principal Activities</span>
              <span className="font-semibold text-slate-700 leading-tight">
                BARS, PUBS, CABARETS AND NIGHTCLUBS (56130)
              </span>
            </div>
            <div className="flex flex-col py-1 gap-0.5">
              <span className="text-slate-400 font-bold">Registered Office Address</span>
              <span className="font-semibold text-slate-700 leading-tight">
                NO. 8A, JALAN KULAI-KOTA TINGGI, TAMAN PERINDUSTRIAN KULAI, 81000 KULAI, JOHOR
              </span>
            </div>
          </div>

          {/* Stamp */}
          <div className="absolute right-4 bottom-4 w-16 h-16 border-2 border-red-500/20 rounded-full flex items-center justify-center -rotate-12 pointer-events-none text-[8px] text-red-500/30 font-bold tracking-wider text-center">
            SSM<br />ELECTRONIC<br />PROFILE
          </div>
        </div>
      );
    }

    // Default: Tenancy agreement or generic document representation
    return (
      <div className="w-full max-w-[360px] bg-white border border-slate-200 rounded shadow-md p-6 flex flex-col gap-4 font-serif mx-auto my-3 relative select-none leading-relaxed text-[9px] text-slate-700">
        <h4 className="text-center font-bold text-[11px] text-slate-800 border-b border-slate-200 pb-2 mb-2 font-sans tracking-wide uppercase">
          TENANCY AGREEMENT
        </h4>
        <p>
          This Agreement is entered into on <strong>1st January 2025</strong> between:
        </p>
        <p className="pl-2 border-l border-slate-200 italic font-sans text-[8px]">
          <strong>LANDLORD:</strong> IOI MALL KULAI SDN. BHD.<br />
          <strong>TENANT:</strong> LIM & TAN ENTERTAINMENT GROUP SDN. BHD.
        </p>
        <p>
          <strong>WHEREAS:</strong> The Landlord is the legal owner of the premises located at:
          <span className="block font-sans font-bold text-slate-800 text-[8px] mt-1 pl-2 border-l border-primary/20">
            LOT 123, JALAN IOI 4, BANDAR PUTRA, 81000 KULAI, JOHOR
          </span>
        </p>
        <p>
          <strong>LEASE TERM:</strong> The tenancy shall commence on 01/01/2025 and continue for a term of 3 years, expiring on 31/12/2027.
        </p>
        <div className="flex justify-between border-t border-slate-200 pt-4 mt-4 font-sans text-[8px] text-slate-400">
          <div>
            <div className="h-6 border-b border-slate-200 w-24 mb-1"></div>
            <span>Authorized Signature</span>
          </div>
          <div>
            <div className="h-6 border-b border-slate-200 w-24 mb-1"></div>
            <span>Tenant Stamp & Sign</span>
          </div>
        </div>
      </div>
    );
  };

  const getStatusBadge = (status: DocumentDetail['status']) => {
    switch (status) {
      case 'Verified':
        return 'bg-success/10 text-success border-success/20';
      case 'Flagged':
        return 'bg-error/10 text-error border-error/20';
      case 'Low Confidence':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-info/10 text-info border-info/20';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="bg-slate-100 border border-border-muted rounded-xl shadow-2xl max-w-4xl w-full z-10 overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[80vh] animate-scale-up">
        {/* Left Side: Document Visualizer */}
        <div className="flex-1 bg-slate-200/50 p-6 flex flex-col justify-center items-center overflow-y-auto border-r border-slate-200">
          <div className="w-full flex items-center justify-between text-xs font-bold text-text-muted mb-3 max-w-[380px]">
            <span>DOCUMENT SCAN / VISUALIZER</span>
            <span className="font-mono text-[10px] font-semibold bg-white border px-1.5 py-0.5 rounded text-text-main">
              100% Zoom
            </span>
          </div>
          {renderVisualPreview()}
          <span className="text-[10px] text-text-muted mt-2 text-center max-w-[280px] font-medium leading-normal">
            Simulated visual rendering of document fields extracted by OCR scanner.
          </span>
        </div>

        {/* Right Side: Document Information Panel */}
        <div className="w-full md:w-[380px] bg-white flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-surface-container">
            <div>
              <h3 className="font-bold text-primary text-base leading-tight">{document.name}</h3>
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-wide mt-1">
                {document.category}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-main p-1 hover:bg-slate-200/50 rounded transition-colors"
              aria-label="Close document viewer"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Info Details List */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-5">
            {/* Status Section */}
            <div className="flex items-center justify-between border-b pb-4 border-slate-100">
              <span className="text-xs font-bold text-text-muted uppercase">Verification Status</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(document.status)}`}>
                {document.status}
              </span>
            </div>

            {/* Confidence Score Gauge */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-text-muted uppercase">AI Extraction Confidence</span>
                <span className={`font-mono font-bold ${
                  document.aiConfidence >= 80 ? 'text-success' : document.aiConfidence >= 50 ? 'text-warning' : 'text-error'
                }`}>
                  {document.aiConfidence}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    document.aiConfidence >= 80 ? 'bg-success' : document.aiConfidence >= 50 ? 'bg-warning' : 'bg-error'
                  }`}
                  style={{ width: `${document.aiConfidence}%` }}
                ></div>
              </div>
            </div>

            {/* File info */}
            <div className="flex flex-col gap-1 text-xs">
              <span className="font-bold text-text-muted uppercase tracking-wider text-[10px]">File Details</span>
              <div className="bg-slate-50 border border-slate-100 rounded p-3 flex flex-col gap-1.5 font-medium text-text-muted leading-tight">
                <div>Filename: <span className="font-mono text-text-main font-semibold text-[11px]">{document.fileName}</span></div>
                <div>Size: <span className="text-text-main font-semibold">{document.fileSize}</span></div>
                <div>Uploaded: <span className="text-text-main font-semibold">{document.uploadedDate}</span></div>
              </div>
            </div>

            {/* OCR text data block */}
            {document.contentPreview && (
              <div className="flex flex-col gap-2 flex-1">
                <span className="font-bold text-text-muted uppercase tracking-wider text-[10px]">Extracted Text (OCR)</span>
                <div className="bg-slate-900 text-slate-300 font-mono text-[11px] p-4 rounded border border-slate-800 overflow-y-auto leading-relaxed max-h-[160px] whitespace-pre-wrap">
                  {document.contentPreview}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] text-text-muted font-bold tracking-wider uppercase">Document ID: {document.id}</span>
            <button
              onClick={() => {}}
              className="px-4 py-2 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-default cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
