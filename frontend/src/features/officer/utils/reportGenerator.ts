import { jsPDF } from 'jspdf';
import { ApplicationDetail } from '../data/mockApplicationDetails';

export const generateOutcomeReportPDF = (application: ApplicationDetail): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  let pageNum = 1;
  let y = 30;

  const drawHeader = (pdfDoc: jsPDF, page: number) => {
    // Pejabat Daerah Kulai Navy Accent Header Bar
    pdfDoc.setFillColor(0, 32, 70); // Deep Navy
    pdfDoc.rect(0, 0, 210, 14, 'F');
    
    pdfDoc.setTextColor(255, 255, 255);
    pdfDoc.setFont('helvetica', 'bold');
    pdfDoc.setFontSize(8);
    pdfDoc.text('PEJABAT DAERAH KULAI | JOHOR, MALAYSIA', 15, 9);
    
    // Top-right text
    pdfDoc.setFont('helvetica', 'normal');
    pdfDoc.text('OFFICIAL OUTCOME RECORD', 195, 9, { align: 'right' });

    // Footer
    pdfDoc.setFillColor(248, 250, 252);
    pdfDoc.rect(0, 282, 210, 15, 'F');
    pdfDoc.setDrawColor(226, 232, 240);
    pdfDoc.line(0, 282, 210, 282);
    
    pdfDoc.setTextColor(100, 116, 139);
    pdfDoc.setFontSize(7.5);
    pdfDoc.setFont('helvetica', 'normal');
    pdfDoc.text('This is a secure, machine-readable official document. Integrity can be verified via the Pejabat Daerah Kulai verification portal.', 15, 290);
    pdfDoc.text(`Page ${page}`, 195, 290, { align: 'right' });
  };

  // Initialize page 1
  drawHeader(doc, pageNum);

  // Check and add page if Y overflows
  const checkPageOverflow = (neededHeight: number) => {
    if (y + neededHeight > 270) {
      doc.addPage();
      pageNum++;
      drawHeader(doc, pageNum);
      y = 30;
      return true;
    }
    return false;
  };

  // Section Title Helper
  const addSectionTitle = (title: string) => {
    checkPageOverflow(15);
    doc.setFillColor(241, 245, 249); // light slate background
    doc.rect(15, y, 180, 8, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(0, 32, 70); // Navy
    doc.text(title.toUpperCase(), 18, y + 5.5);
    y += 13;
  };

  // Two Column Label-Value Helper
  const addTwoColumns = (col1Label: string, col1Value: string, col2Label: string, col2Value: string) => {
    checkPageOverflow(8);
    
    // Col 1
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105); // Slate-600
    doc.text(col1Label, 15, y);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42); // Slate-900
    // Handle potentially long values
    const val1 = col1Value || 'N/A';
    doc.text(val1, 55, y);

    // Col 2
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(col2Label, 110, y);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    const val2 = col2Value || 'N/A';
    doc.text(val2, 145, y);

    y += 7.5;
  };

  // Full Width Wrap-text Field Helper
  const addFullWidthField = (label: string, value: string) => {
    const textVal = value || 'N/A';
    const splitText = doc.splitTextToSize(textVal, 140);
    const height = 4.5 * splitText.length + 3;
    
    checkPageOverflow(height);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(label, 15, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(splitText, 55, y);

    y += height;
  };

  // 1. Report Title & Document Info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(0, 32, 70);
  doc.text('APPLICATION OUTCOME REPORT', 15, y);
  y += 5.5;

  doc.setDrawColor(0, 32, 70);
  doc.setLineWidth(0.8);
  doc.line(15, y, 195, y);
  y += 7;

  // General Summary Row
  addTwoColumns('Application ID:', application.id, 'License Type:', application.licenseType);
  
  // Decide color based on status
  const isApproved = application.status === 'Processed';
  const statusText = isApproved ? 'APPROVED' : application.status === 'Rejected' ? 'REJECTED' : application.status.toUpperCase();
  const statusColor = isApproved ? [22, 101, 52] : application.status === 'Rejected' ? [153, 27, 27] : [180, 83, 9];
  
  checkPageOverflow(8);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Case Status:', 15, y);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.text(statusText, 55, y);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('AI Match Confidence:', 110, y);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${application.aiConfidence}% Match`, 145, y);
  y += 7.5;

  addTwoColumns(
    'Submission Date:', 
    application.submissionDate, 
    'Issue/Decision Date:', 
    new Date().toISOString().slice(0, 10)
  );

  y += 4;

  // 2. Section: Applicant Information
  addSectionTitle('1. Applicant Identity & Registration');
  addTwoColumns('Full Name:', application.applicantName, 'IC/Passport No:', application.icNumber);
  addTwoColumns('Date of Birth:', application.dob, 'Contact Number:', application.phone);
  addTwoColumns('Email Address:', application.email, 'Verification Status:', 'Identity Confirmed');
  addFullWidthField('Residential Address:', application.address);
  y += 3;

  // 3. Section: Business Information
  addSectionTitle('2. Corporate Entity Profile');
  addTwoColumns('Entity Name:', application.businessName, 'UEN Registration No:', application.businessRegNumber);
  addTwoColumns('Applicant Position:', application.businessPosition, 'Office Contact No:', application.businessPhone);
  addTwoColumns('Registration Date:', application.businessRegDate, 'UEN Expiry Date:', application.businessExpiryDate);
  addFullWidthField('Registered Address:', application.businessAddress);
  y += 3;

  // 4. Section: Premise & Entertainment Info
  addSectionTitle('3. Licensed Premises & Operations');
  addTwoColumns('Premises Type:', application.premiseType, 'Floor Level / Unit:', application.premiseFloorLevel);
  addTwoColumns('Postal Code:', application.premisePostcode, 'Zone/City Area:', application.premiseCity);
  addFullWidthField('Premises Address:', application.premiseAddress);
  
  addTwoColumns(
    'Entertainment Type:', 
    application.entertainmentCategory, 
    'Licensed Capacity:', 
    `${application.entertainmentCapacity} ${application.entertainmentCapacityUnit}`
  );
  addTwoColumns(
    'Licence Duration:', 
    `${application.entertainmentDurationMonths} Months`, 
    'Operating Hours:', 
    application.entertainmentOperatingHours
  );
  y += 4;

  // 5. Section: Document Checklist
  addSectionTitle('4. Document Verification Checklist');
  
  // Table Headers
  checkPageOverflow(12);
  doc.setFillColor(248, 250, 252);
  doc.rect(15, y, 180, 6, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('DOCUMENT NAME', 18, y + 4.5);
  doc.text('CATEGORY', 65, y + 4.5);
  doc.text('FILE NAME', 105, y + 4.5);
  doc.text('AI CONF.', 155, y + 4.5);
  doc.text('STATUS', 175, y + 4.5);
  y += 8.5;

  application.documents.forEach((docDetail) => {
    checkPageOverflow(7.5);
    
    // Draw thin bottom divider for row
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.2);
    doc.line(15, y + 4, 195, y + 4);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    // Truncate document name if too long
    const docName = docDetail.name.length > 25 ? docDetail.name.slice(0, 22) + '...' : docDetail.name;
    doc.text(docName, 18, y + 2.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(docDetail.category, 65, y + 2.5);

    // Truncate filename
    const filename = docDetail.fileName.length > 28 ? docDetail.fileName.slice(0, 25) + '...' : docDetail.fileName;
    doc.text(filename, 105, y + 2.5);

    doc.text(`${docDetail.aiConfidence}%`, 155, y + 2.5);

    const isVerified = docDetail.status === 'Verified';
    doc.setFont('helvetica', 'bold');
    if (isVerified) {
      doc.setTextColor(22, 101, 52); // green
    } else if (docDetail.status === 'Low Confidence' || docDetail.status === 'Flagged') {
      doc.setTextColor(180, 83, 9); // amber
    } else {
      doc.setTextColor(100, 116, 139); // slate
    }
    doc.text(docDetail.status.toUpperCase(), 175, y + 2.5);

    y += 6.5;
  });
  y += 5;

  // 6. Section: Audit Log Timeline & Officer Notes
  addSectionTitle('5. Official Review & Audit Trail');

  [...application.auditLogs]
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
    .forEach((log) => {
    const textVal = log.notes || 'No review comments logged.';
    const splitNotes = doc.splitTextToSize(textVal, 140);
    const rowHeight = 4.5 * splitNotes.length + 9;
    
    checkPageOverflow(rowHeight);

    // Draw card background for audit item
    doc.setFillColor(250, 250, 250);
    doc.rect(15, y, 180, rowHeight - 2, 'F');
    doc.setDrawColor(241, 245, 249);
    doc.rect(15, y, 180, rowHeight - 2, 'S');

    // Dot marker
    doc.setFillColor(0, 32, 70);
    doc.circle(20, y + 4.5, 1.2, 'F');

    // Title / Action
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(log.action, 25, y + 5);

    // Timestamp & Officer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`${log.timestamp}  |  By: ${log.user}`, 110, y + 5);

    // Notes content
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(splitNotes, 25, y + 10);

    y += rowHeight;
  });

  // Download PDF
  const safeTitle = application.applicantName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  doc.save(`outcome_report_${application.id}_${safeTitle}.pdf`);
};
