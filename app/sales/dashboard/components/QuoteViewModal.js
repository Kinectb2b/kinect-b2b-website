import { useRef, useState } from 'react';
import jsPDF from 'jspdf';

export default function QuoteViewModal({ isOpen, onClose, quote, currentUser }) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const quotePreviewRef = useRef(null);

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      let yPosition = 20;

      // Header
      pdf.setFontSize(24);
      pdf.setTextColor(37, 99, 235);
      pdf.text('Kinect B2B', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 8;
      pdf.setFontSize(14);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Professional Quote', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 6;
      pdf.setFontSize(10);
      pdf.text(`Quote #${quote.quote_number}`, pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 15;
      
      // Client Information
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont(undefined, 'bold');
      pdf.text('Client Information', 20, yPosition);
      
      yPosition += 7;
      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(10);
      pdf.text(quote.client_name, 20, yPosition);
      yPosition += 5;
      
      if (quote.business_name) {
        pdf.text(quote.business_name, 20, yPosition);
        yPosition += 5;
      }
      
      pdf.text(quote.email, 20, yPosition);
      yPosition += 5;
      
      if (quote.phone_number) {
        pdf.text(quote.phone_number, 20, yPosition);
        yPosition += 5;
      }
      
      yPosition += 10;
      
      // Quote Details
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text('Quote Details', 20, yPosition);
      
      yPosition += 7;
      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(10);
      pdf.text(`Date: ${new Date(quote.created_at).toLocaleDateString()}`, 20, yPosition);
      yPosition += 5;
      pdf.text(`Sales Rep: ${currentUser.username}`, 20, yPosition);
      
      yPosition += 15;
      
      // Services
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text('Services', 20, yPosition);
      pdf.line(20, yPosition + 2, pageWidth - 20, yPosition + 2);
      
      yPosition += 10;
      
      quote.services.forEach((service) => {
        pdf.setFontSize(11);
        pdf.setFont(undefined, 'bold');
        pdf.text(service.type, 20, yPosition);
        
        yPosition += 6;
        pdf.setFont(undefined, 'normal');
        pdf.setFontSize(10);
        pdf.text(service.plan.name, 20, yPosition);
        
        yPosition += 10;
      });
      
      // Total
      yPosition += 5;
      pdf.setFillColor(240, 240, 240);
      pdf.rect(20, yPosition - 7, pageWidth - 40, 12, 'F');
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text('First Payment:', 25, yPosition);
      pdf.text(`$${quote.total_amount.toLocaleString()}`, pageWidth - 25, yPosition, { align: 'right' });
      
      if (quote.monthly_recurring && quote.monthly_recurring > 0) {
        yPosition += 10;
        pdf.setFontSize(12);
        pdf.text('Then Monthly:', 25, yPosition);
        pdf.text(`$${quote.monthly_recurring.toLocaleString()}/mo`, pageWidth - 25, yPosition, { align: 'right' });
      }

      return pdf;
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const downloadPDF = async () => {
    try {
      const pdf = await generatePDF();
      pdf.save(`Kinect_B2B_Quote_${quote.quote_number}.pdf`);
    } catch (error) {
      alert('Failed to generate PDF');
    }
  };

  const printPDF = async () => {
    try {
      const pdf = await generatePDF();
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const printWindow = window.open(pdfUrl);
      printWindow.addEventListener('load', () => {
        printWindow.print();
      });
    } catch (error) {
      alert('Failed to print PDF');
    }
  };

  const emailPDF = async () => {
    try {
      await downloadPDF();
      const subject = encodeURIComponent(`Quote from Kinect B2B - ${quote.quote_number}`);
      const body = encodeURIComponent(
        `Dear ${quote.client_name},\n\n` +
        `Thank you for your interest in Kinect B2B services. Please find your personalized quote attached.\n\n` +
        `Quote Number: ${quote.quote_number}\n` +
        `Total Investment: $${quote.total_amount.toLocaleString()}\n\n` +
        `We look forward to working with you!\n\n` +
        `Best regards,\n${currentUser.username}\nKinect B2B`
      );
      
      alert('PDF downloaded! Please attach it to your email manually.');
      window.location.href = `mailto:${quote.email}?subject=${subject}&body=${body}`;
    } catch (error) {
      alert('Failed to prepare email');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex justify-between items-center rounded-t-2xl z-10">
          <h3 className="text-2xl font-black">Quote Preview</h3>
          <button
            onClick={onClose}
            className="text-3xl hover:bg-white/20 w-10 h-10 rounded-full transition"
          >
            ×
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto" ref={quotePreviewRef}>
          <div className="bg-white border-2 border-gray-300 rounded-lg p-8 mb-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Kinect B2B
              </h2>
              <p className="text-gray-600">Professional Quote</p>
              <p className="text-sm text-gray-500">Quote #{quote.quote_number}</p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Client Information</h4>
                <p className="text-gray-700">{quote.client_name}</p>
                {quote.business_name && (
                  <p className="text-gray-700">{quote.business_name}</p>
                )}
                <p className="text-gray-700">{quote.email}</p>
                {quote.phone_number && (
                  <p className="text-gray-700">{quote.phone_number}</p>
                )}
              </div>
              <div className="text-right">
                <h4 className="font-bold text-gray-900 mb-2">Quote Details</h4>
                <p className="text-gray-700">
                  Date: {new Date(quote.created_at).toLocaleDateString()}
                </p>
                <p className="text-gray-700">Sales Rep: {currentUser.username}</p>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
                Services
              </h4>
              {quote.services.map((service, idx) => (
                <div key={idx} className="mb-4 pb-4 border-b border-gray-200">
                  <p className="font-bold text-gray-900">{service.type}</p>
                  <p className="text-gray-700">{service.plan.name}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-900 text-white rounded-lg p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xl font-bold">First Payment:</span>
                <span className="text-3xl font-black">${quote.total_amount.toLocaleString()}</span>
              </div>
              {quote.monthly_recurring > 0 && (
                <div className="flex justify-between items-center border-t border-gray-700 pt-2">
                  <span className="text-lg font-bold">Then Monthly:</span>
                  <span className="text-2xl font-black text-green-400">
                    ${quote.monthly_recurring.toLocaleString()}/month
                  </span>
                </div>
              )}
            </div>

            {quote.notes && (
              <div className="mt-8 bg-gray-50 p-4 rounded-lg">
                <p className="font-bold text-gray-900 mb-2">Notes:</p>
                <p className="text-gray-700">{quote.notes}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={downloadPDF}
              className="py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? '⏳ Generating...' : '📥 Download'}
            </button>
            <button
              onClick={printPDF}
              className="py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700"
              disabled={isGeneratingPDF}
            >
              🖨️ Print
            </button>
            <button
              onClick={emailPDF}
              className="py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700"
              disabled={isGeneratingPDF}
            >
              📧 Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}