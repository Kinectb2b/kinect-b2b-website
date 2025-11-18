import { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function QuoteBuilder({ isOpen, onClose, currentUser, supabase, onQuoteGenerated, prefilledData, pipelineLeads }) {
  const [quoteStep, setQuoteStep] = useState(1);
  const [selectedLeadId, setSelectedLeadId] = useState(''); // NEW!
  const [quoteData, setQuoteData] = useState(
    prefilledData || {
      clientName: '',
      businessName: '',
      industry: '',
      phoneNumber: '',
      email: '',
      address: '',
      services: [],
      notes: ''
    }
  );
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCustomPlan, setShowCustomPlan] = useState(false);
  const [customPlanData, setCustomPlanData] = useState({ name: '', price: 0, billing: 'Monthly' });
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [generatedQuote, setGeneratedQuote] = useState(null);
  const [showPlanDetails, setShowPlanDetails] = useState(null);
  const [showViewQuoteModal, setShowViewQuoteModal] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [selectedBillingFrequency, setSelectedBillingFrequency] = useState('monthly'); // NEW!
  const quotePreviewRef = useRef(null);

  // Generate Pro Plans 100-1200
  const generateProPlans = () => {
    const plans = [];
    for (let i = 100; i <= 1200; i += 100) {
      const monthlyPrice = i * 2.5;
      const annualPrice = monthlyPrice * 11; // Save 1 month
      const monthlySavings = monthlyPrice;
      plans.push({
        name: `Pro Plan ${i}`,
        price: monthlyPrice,
        annualPrice: annualPrice,
        monthlySavings: monthlySavings,
        businesses: i,
        peopleContacted: i * 3,
        totalContactPoints: i * 3 * 9,
        guaranteedAppointments: Math.floor(i / 20),
        teamGoal: Math.floor(i / 20) * 5,
        billing: 'Monthly',
        isPro: true
      });
    }
    return plans;
  };

  const proPlanDetails = generateProPlans();

  const websitePackages = [
    { name: 'Basic Website', setupCost: 2500, monthlyCost: 50 },
    { name: 'Professional Website', setupCost: 5000, monthlyCost: 100 },
    { name: 'Enterprise Website', setupCost: 10000, monthlyCost: 200 }
  ];

  const portalPackages = [
    { name: 'Basic Portal', setupCost: 3000, monthlyCost: 75 },
    { name: 'Professional Portal', setupCost: 6000, monthlyCost: 150 },
    { name: 'Enterprise Portal', setupCost: 12000, monthlyCost: 300 }
  ];

  const automationPackages = [
    { name: 'Email Automation', setupCost: 500, monthlyCost: 50 },
    { name: 'CRM Automation', setupCost: 1000, monthlyCost: 100 },
    { name: 'Social Media Automation', setupCost: 750, monthlyCost: 75 },
    { name: 'Custom Workflow', setupCost: 2000, monthlyCost: 150 }
  ];

  const allServicePlans = {
    'Appointment Setting': proPlanDetails,
    'Website Development': websitePackages,
    'Custom Client Portals': portalPackages,
    'Business Automations': automationPackages
  };

  // Service detail descriptions for PDF
  const serviceDetails = {
    'Appointment Setting': {
      description: 'Our proven appointment setting service connects you with qualified prospects through systematic outreach campaigns.',
      benefits: [
        'Multi-channel outreach (Email, Phone, LinkedIn)',
        'Dedicated account manager',
        'Real-time campaign tracking',
        'Qualified lead verification',
        'Calendar integration',
        'Monthly performance reports'
      ],
      process: [
        'Campaign Strategy Development',
        'Target List Creation & Verification',
        'Multi-touch Outreach Sequence',
        'Lead Qualification & Nurturing',
        'Appointment Scheduling & Confirmation'
      ]
    },
    'Website Development': {
      description: 'Custom-designed, conversion-optimized websites built to elevate your brand and drive business growth.',
      benefits: [
        'Mobile-responsive design',
        'SEO optimization',
        'Fast loading speeds',
        'Custom CMS integration',
        'Analytics setup',
        'Ongoing maintenance & support'
      ],
      process: [
        'Discovery & Strategy Session',
        'Wireframe & Design Mockups',
        'Development & Integration',
        'Content Migration & SEO Setup',
        'Testing & Launch'
      ]
    },
    'Custom Client Portals': {
      description: 'Secure, branded client portals that streamline communication and enhance the customer experience.',
      benefits: [
        'Secure login & authentication',
        'Document sharing & storage',
        'Real-time project tracking',
        'Messaging & notifications',
        'Custom branding',
        'Mobile accessibility'
      ],
      process: [
        'Requirements Gathering',
        'Portal Design & Architecture',
        'Development & Testing',
        'Security Implementation',
        'Training & Deployment'
      ]
    },
    'Business Automations': {
      description: 'Intelligent automation solutions that eliminate repetitive tasks and increase operational efficiency.',
      benefits: [
        'Time savings & efficiency',
        'Error reduction',
        'Seamless integrations',
        'Scalable workflows',
        'Real-time monitoring',
        'ROI tracking'
      ],
      process: [
        'Process Analysis & Mapping',
        'Automation Design',
        'Integration & Development',
        'Testing & Refinement',
        'Deployment & Training'
      ]
    }
  };

  const addServiceToQuote = () => {
    if (!selectedPlan && !customPlanData.name) {
      alert('Please select a plan or fill in custom plan details');
      return;
    }

    const plan = selectedPlan || { ...customPlanData, isCustom: true };
    
    // Add billing frequency to Pro Plans
    if (plan.isPro) {
      plan.billingFrequency = selectedBillingFrequency;
    }
    
    const service = {
      id: Date.now(),
      type: selectedServiceType,
      plan: plan,
      setupFee: selectedServiceType === 'Appointment Setting' ? 349 : 0
    };

    setQuoteData(prev => ({ ...prev, services: [...prev.services, service] }));
    setSelectedServiceType('');
    setSelectedPlan(null);
    setShowCustomPlan(false);
    setShowPlanDetails(null); // Reset plan details
    setSelectedBillingFrequency('monthly'); // Reset to monthly
    setCustomPlanData({ name: '', price: 0, billing: 'Monthly' });
  };

  const removeService = (serviceId) => {
    setQuoteData(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== serviceId)
    }));
  };

  useEffect(() => {
    let firstPayment = 0;
    let monthlyRecurring = 0;
    
    quoteData.services.forEach(service => {
      // Setup fees (one-time)
      firstPayment += service.setupFee || 0;
      
      // Pro Plans (Appointment Setting)
      if (service.plan.isPro) {
        if (service.plan.billingFrequency === 'annual') {
          firstPayment += service.plan.annualPrice; // Full year upfront
          monthlyRecurring += 0; // No monthly after annual payment
        } else {
          firstPayment += service.plan.price; // First month
          monthlyRecurring += service.plan.price; // Ongoing monthly
        }
      }
      // One-time services (Website, Portal, Automation setup)
      else if (service.plan.setupCost) {
        firstPayment += service.plan.setupCost; // One-time setup
        if (service.plan.monthlyCost) {
          firstPayment += service.plan.monthlyCost; // First month
          monthlyRecurring += service.plan.monthlyCost; // Ongoing monthly
        }
      }
      // Custom plans
      else if (service.plan.price) {
        firstPayment += service.plan.price;
        monthlyRecurring += service.plan.price;
      }
    });
    
    setCalculatedTotal({ firstPayment, monthlyRecurring });
  }, [quoteData.services]);

  // Generate professional PDF with service detail sheets
  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // PAGE 1: Quote Summary
      pdf.setFontSize(24);
      pdf.setTextColor(37, 99, 235);
      pdf.text('Kinect B2B', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 8;
      pdf.setFontSize(14);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Professional Quote', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 6;
      pdf.setFontSize(10);
      pdf.text(`Quote #${generatedQuote.quote_number}`, pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 15;
      
      // Client Information
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont(undefined, 'bold');
      pdf.text('Client Information', 20, yPosition);
      
      yPosition += 7;
      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(10);
      pdf.text(generatedQuote.client_name, 20, yPosition);
      yPosition += 5;
      
      if (generatedQuote.business_name) {
        pdf.text(generatedQuote.business_name, 20, yPosition);
        yPosition += 5;
      }
      
      pdf.text(generatedQuote.email, 20, yPosition);
      yPosition += 5;
      
      if (generatedQuote.phone_number) {
        pdf.text(generatedQuote.phone_number, 20, yPosition);
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
      pdf.text(`Date: ${new Date(generatedQuote.created_at).toLocaleDateString()}`, 20, yPosition);
      yPosition += 5;
      pdf.text(`Sales Rep: ${currentUser.username}`, 20, yPosition);
      
      yPosition += 15;
      
      // Services Summary
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text('Services Summary', 20, yPosition);
      pdf.line(20, yPosition + 2, pageWidth - 20, yPosition + 2);
      
      yPosition += 10;
      
      generatedQuote.services.forEach((service, idx) => {
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFontSize(11);
        pdf.setFont(undefined, 'bold');
        pdf.text(service.type, 20, yPosition);
        
        yPosition += 6;
        pdf.setFont(undefined, 'normal');
        pdf.setFontSize(10);
        pdf.text(service.plan.name, 20, yPosition);
        
        yPosition += 5;
        
        // Pricing display with monthly and annual options
        if (service.plan.isPro) {
          const isMonthly = service.plan.billingFrequency === 'monthly';
          const isAnnual = service.plan.billingFrequency === 'annual';
          
          pdf.setTextColor(34, 197, 94);
          pdf.setFont(undefined, isMonthly ? 'bold' : 'normal');
          pdf.text(`${isMonthly ? '✓ ' : ''}Monthly: $${service.plan.price}/month`, 20, yPosition);
          
          yPosition += 5;
          pdf.setFont(undefined, isAnnual ? 'bold' : 'normal');
          pdf.text(`${isAnnual ? '✓ ' : ''}Annual: $${service.plan.annualPrice}/year (Save $${service.plan.monthlySavings} - 1 Month FREE!)`, 20, yPosition);
          pdf.setFont(undefined, 'normal');
        } else if (service.plan.setupCost) {
          pdf.setTextColor(34, 197, 94);
          pdf.text(`Setup: $${service.plan.setupCost}`, 20, yPosition);
          if (service.plan.monthlyCost) {
            yPosition += 5;
            pdf.text(`Monthly: $${service.plan.monthlyCost}/month`, 20, yPosition);
          }
        } else {
          pdf.setTextColor(34, 197, 94);
          pdf.text(`$${service.plan.price}`, 20, yPosition);
        }
        
        pdf.setTextColor(0, 0, 0);
        
        if (service.setupFee > 0) {
          yPosition += 5;
          pdf.setTextColor(147, 51, 234);
          pdf.text(`+ Setup Fee: $${service.setupFee}`, 20, yPosition);
          pdf.setTextColor(0, 0, 0);
        }
        
        yPosition += 10;
      });
      
      // Total
      yPosition += 5;
      pdf.setFillColor(240, 240, 240);
      pdf.rect(20, yPosition - 7, pageWidth - 40, 12, 'F');
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text('Total Investment:', 25, yPosition);
      pdf.text(`$${generatedQuote.total_amount.toLocaleString()}`, pageWidth - 25, yPosition, { align: 'right' });
      
      // Notes
      if (generatedQuote.notes) {
        yPosition += 20;
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text('Additional Notes:', 20, yPosition);
        yPosition += 7;
        pdf.setFont(undefined, 'normal');
        pdf.setFontSize(10);
        const splitNotes = pdf.splitTextToSize(generatedQuote.notes, pageWidth - 40);
        pdf.text(splitNotes, 20, yPosition);
      }
      
      // PAGE 2+: Service Detail Sheets
      for (const service of generatedQuote.services) {
        pdf.addPage();
        yPosition = 20;
        
        const details = serviceDetails[service.type];
        
        // Service Name Header
        pdf.setFontSize(20);
        pdf.setTextColor(37, 99, 235);
        pdf.text(service.type, pageWidth / 2, yPosition, { align: 'center' });
        
        yPosition += 8;
        pdf.setFontSize(14);
        pdf.setTextColor(100, 100, 100);
        pdf.text(service.plan.name, pageWidth / 2, yPosition, { align: 'center' });
        
        yPosition += 15;
        
        // Description
        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont(undefined, 'normal');
        const splitDesc = pdf.splitTextToSize(details.description, pageWidth - 40);
        pdf.text(splitDesc, 20, yPosition);
        yPosition += splitDesc.length * 6 + 10;
        
        // Benefits
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text('Key Benefits:', 20, yPosition);
        yPosition += 8;
        
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        details.benefits.forEach(benefit => {
          pdf.text('• ' + benefit, 25, yPosition);
          yPosition += 6;
        });
        
        yPosition += 10;
        
        // Process
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text('Our Process:', 20, yPosition);
        yPosition += 8;
        
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        details.process.forEach((step, idx) => {
          pdf.text(`${idx + 1}. ${step}`, 25, yPosition);
          yPosition += 6;
        });
        
        yPosition += 15;
        
        // Pricing Details Box
        pdf.setFillColor(245, 251, 255);
        pdf.rect(20, yPosition - 5, pageWidth - 40, 35, 'F');
        pdf.setDrawColor(59, 130, 246);
        pdf.rect(20, yPosition - 5, pageWidth - 40, 35);
        
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.setTextColor(37, 99, 235);
        pdf.text('Investment Details', 25, yPosition + 2);
        
        yPosition += 10;
        pdf.setFont(undefined, 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        
        if (service.plan.isPro) {
          const isMonthly = service.plan.billingFrequency === 'monthly';
          const isAnnual = service.plan.billingFrequency === 'annual';
          
          pdf.setFont(undefined, isMonthly ? 'bold' : 'normal');
          pdf.text(`${isMonthly ? '✓ SELECTED: ' : ''}Monthly Plan: $${service.plan.price}/month`, 25, yPosition);
          yPosition += 6;
          
          pdf.setFont(undefined, isAnnual ? 'bold' : 'normal');
          pdf.text(`${isAnnual ? '✓ SELECTED: ' : ''}Annual Plan: $${service.plan.annualPrice}/year (Save $${service.plan.monthlySavings} - 1 Month FREE!)`, 25, yPosition);
          pdf.setFont(undefined, 'normal');
          yPosition += 6;
          if (service.setupFee > 0) {
            pdf.text(`One-time Setup Fee: $${service.setupFee}`, 25, yPosition);
          }
        } else if (service.plan.setupCost) {
          pdf.text(`Setup Cost: $${service.plan.setupCost}`, 25, yPosition);
          if (service.plan.monthlyCost) {
            yPosition += 6;
            pdf.text(`Monthly Maintenance: $${service.plan.monthlyCost}/month`, 25, yPosition);
          }
        }
        
        // Pro Plan specific details
        if (service.plan.isPro) {
          yPosition += 20;
          pdf.setFontSize(12);
          pdf.setFont(undefined, 'bold');
          pdf.text('Plan Specifications:', 20, yPosition);
          yPosition += 8;
          
          pdf.setFontSize(10);
          pdf.setFont(undefined, 'normal');
          pdf.text(`• Businesses Targeted: ${service.plan.businesses} (over 12 months)`, 25, yPosition);
          yPosition += 6;
          pdf.text(`• People Contacted: ${service.plan.peopleContacted} (3 per business)`, 25, yPosition);
          yPosition += 6;
          pdf.text(`• Total Contact Points: ${service.plan.totalContactPoints.toLocaleString()} (9 touches per person)`, 25, yPosition);
          yPosition += 6;
          pdf.text(`• Guaranteed Appointments: ${service.plan.guaranteedAppointments} per year`, 25, yPosition);
          yPosition += 6;
          pdf.text(`• Team Goal: ${service.plan.teamGoal} appointments per year`, 25, yPosition);
        }
      }
      
      // Return the PDF
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
      pdf.save(`Kinect_B2B_Quote_${generatedQuote.quote_number}.pdf`);
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
      const pdf = await generatePDF();
      const pdfBlob = pdf.output('blob');
      
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(pdfBlob);
      reader.onloadend = async () => {
        const base64data = reader.result.split(',')[1];
        
        // Here you would send to your email service
        // For now, we'll create a mailto link with instructions
        const subject = encodeURIComponent(`Quote from Kinect B2B - ${generatedQuote.quote_number}`);
        const body = encodeURIComponent(
          `Dear ${generatedQuote.client_name},\n\n` +
          `Thank you for your interest in Kinect B2B services. Please find your personalized quote attached.\n\n` +
          `Quote Number: ${generatedQuote.quote_number}\n` +
          `Total Investment: $${generatedQuote.total_amount.toLocaleString()}\n\n` +
          `We look forward to working with you!\n\n` +
          `Best regards,\n${currentUser.username}\nKinect B2B`
        );
        
        // Open email client (note: attachments won't work with mailto, so we download it for them)
        await downloadPDF();
        alert('PDF downloaded! Please attach it to your email manually. We\'ve prepared a draft email for you.');
        window.location.href = `mailto:${generatedQuote.email}?subject=${subject}&body=${body}`;
      };
      
    } catch (error) {
      console.error('Error emailing PDF:', error);
      alert('Failed to prepare email');
    }
  };

  const markQuoteSent = async () => {
    try {
      // Find pipeline client by email
      const { data: pipelineClient } = await supabase
        .from('pipeline_clients')
        .select('id')
        .eq('sales_rep_username', currentUser.username)
        .eq('email', generatedQuote.email)
        .single();

      if (pipelineClient) {
        await supabase
          .from('pipeline_clients')
          .update({ status: 'quote_sent' })
          .eq('id', pipelineClient.id);
        
        alert('✅ Client moved to "Quote Sent" in pipeline!');
        onQuoteGenerated(); // Refresh pipeline
      } else {
        alert('Client not found in pipeline');
      }
    } catch (error) {
      console.error('Error marking quote sent:', error);
      alert('Failed to mark quote as sent');
    }
  };

  const handleLeadSelection = (leadId) => {
    setSelectedLeadId(leadId);
    if (leadId) {
      const lead = pipelineLeads.find(l => l.id === leadId);
      if (lead) {
        setQuoteData({
          clientName: lead.client_name,
          businessName: lead.business_name || '',
          email: lead.email,
          phoneNumber: lead.phone_number || '',
          industry: lead.industry || '',
          address: lead.address || '',
          services: [],
          notes: ''
        });
      }
    } else {
      // Clear form if "New Client" selected
      setQuoteData({
        clientName: '',
        businessName: '',
        industry: '',
        phoneNumber: '',
        email: '',
        address: '',
        services: [],
        notes: ''
      });
    }
  };

  const generateQuote = async () => {
    if (!quoteData.clientName || !quoteData.email) {
      alert('Client name and email are required');
      return;
    }

    if (quoteData.services.length === 0) {
      alert('Please add at least one service');
      return;
    }

    const quoteNumber = `Q-${Date.now()}`;

    try {
      const { data, error } = await supabase
        .from('quotes')
        .insert({
          quote_number: quoteNumber,
          sales_rep_username: currentUser.username,
          client_name: quoteData.clientName,
          business_name: quoteData.businessName,
          industry: quoteData.industry,
          phone_number: quoteData.phoneNumber,
          email: quoteData.email,
          address: quoteData.address,
          services: quoteData.services,
          total_amount: calculatedTotal.firstPayment,
          monthly_recurring: calculatedTotal.monthlyRecurring,
          notes: quoteData.notes,
          status: 'sent'
        })
        .select()
        .single();

      if (error) throw error;

      // Try to find and update pipeline client OR create new one
      const { data: pipelineClient } = await supabase
        .from('pipeline_clients')
        .select('id')
        .eq('sales_rep_username', currentUser.username)
        .eq('email', quoteData.email)
        .single();

      if (pipelineClient) {
        // Update existing client
        await supabase
          .from('pipeline_clients')
          .update({ 
            status: 'lead', // Keep in lead for now, Mark Quote Sent will move it
            deal_value: calculatedTotal.firstPayment,
            quote_number: quoteNumber
          })
          .eq('id', pipelineClient.id);
      } else {
        // Create new pipeline client
        await supabase
          .from('pipeline_clients')
          .insert({
            sales_rep_username: currentUser.username,
            client_name: quoteData.clientName,
            business_name: quoteData.businessName,
            email: quoteData.email,
            phone_number: quoteData.phoneNumber,
            industry: quoteData.industry,
            address: quoteData.address,
            deal_value: calculatedTotal.firstPayment,
            quote_number: quoteNumber,
            status: 'lead'
          });
      }

      setGeneratedQuote(data);
      onQuoteGenerated();
    } catch (error) {
      console.error('Error generating quote:', error);
      alert('Failed to generate quote');
    }
  };

  const resetQuote = () => {
    setQuoteStep(1);
    setQuoteData({
      clientName: '',
      businessName: '',
      industry: '',
      phoneNumber: '',
      email: '',
      address: '',
      services: [],
      notes: ''
    });
    setGeneratedQuote(null);
    setCalculatedTotal(0);
    setShowViewQuoteModal(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 flex justify-between items-center rounded-t-2xl z-10">
          <h3 className="text-2xl font-black">
            {generatedQuote ? '✅ Quote Generated' : '💰 Build a Quote'}
          </h3>
          <div className="flex items-center gap-3">
            {generatedQuote && (
              <button
                onClick={markQuoteSent}
                className="px-4 py-2 bg-yellow-500 text-white rounded-xl font-bold hover:bg-yellow-600 shadow-lg flex items-center gap-2"
              >
                📧 Mark Quote Sent
              </button>
            )}
            <button
              onClick={() => {
                onClose();
                resetQuote();
              }}
              className="text-3xl hover:bg-white/20 w-10 h-10 rounded-full transition"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {!generatedQuote ? (
            <>
              {/* Step Indicator */}
              <div className="flex items-center justify-center mb-8">
                {[1, 2, 3].map(step => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        quoteStep >= step
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step}
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-20 h-1 ${
                          quoteStep > step ? 'bg-green-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Client Info */}
              {quoteStep === 1 && (
                <div>
                  <h4 className="text-xl font-black text-gray-900 mb-4">Client Information</h4>
                  
                  {/* Lead Selector */}
                  {pipelineLeads && pipelineLeads.length > 0 && (
                    <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                      <label className="block text-sm font-bold text-blue-900 mb-2">
                        📋 Select Lead from Pipeline (Optional)
                      </label>
                      <select
                        value={selectedLeadId}
                        onChange={(e) => handleLeadSelection(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-blue-300 rounded-lg focus:border-green-600 focus:outline-none font-semibold"
                      >
                        <option value="">-- New Client (Enter Manually) --</option>
                        {pipelineLeads.map(lead => (
                          <option key={lead.id} value={lead.id}>
                            {lead.client_name} - {lead.email}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-blue-700 mt-2">
                        Select an existing lead to auto-fill their information
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Client Name *
                      </label>
                      <input
                        type="text"
                        value={quoteData.clientName}
                        onChange={(e) => setQuoteData({ ...quoteData, clientName: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        value={quoteData.email}
                        onChange={(e) => setQuoteData({ ...quoteData, email: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Business Name
                      </label>
                      <input
                        type="text"
                        value={quoteData.businessName}
                        onChange={(e) =>
                          setQuoteData({ ...quoteData, businessName: e.target.value })
                        }
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                        placeholder="ABC Company"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Industry</label>
                      <input
                        type="text"
                        value={quoteData.industry}
                        onChange={(e) => setQuoteData({ ...quoteData, industry: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                        placeholder="Technology"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={quoteData.phoneNumber}
                        onChange={(e) =>
                          setQuoteData({ ...quoteData, phoneNumber: e.target.value })
                        }
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        value={quoteData.address}
                        onChange={(e) => setQuoteData({ ...quoteData, address: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                        placeholder="123 Main St, City, State"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!quoteData.clientName || !quoteData.email) {
                        alert('Client name and email are required');
                        return;
                      }
                      setQuoteStep(2);
                    }}
                    className="w-full mt-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold hover:from-green-700 hover:to-emerald-700"
                  >
                    Next: Add Services →
                  </button>
                </div>
              )}

              {/* Step 2: Add Services */}
              {quoteStep === 2 && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-black text-gray-900">Services</h4>
                    <span className="text-sm text-gray-600">
                      {quoteData.services.length}/10 services added
                    </span>
                  </div>

                  {/* Added Services */}
                  {quoteData.services.length > 0 && (
                    <div className="space-y-3 mb-6">
                      {quoteData.services.map((service) => (
                        <div
                          key={service.id}
                          className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex justify-between items-start"
                        >
                          <div>
                            <p className="font-bold text-gray-900">{service.type}</p>
                            <p className="text-sm text-gray-700">{service.plan.name}</p>
                            <p className="text-sm text-green-600 font-semibold">
                              {service.setupFee > 0 && `Setup: $${service.setupFee} + `}
                              Price: ${service.plan.price || service.plan.setupCost}
                              {service.plan.monthlyCost && ` + $${service.plan.monthlyCost}/mo`}
                            </p>
                          </div>
                          <button
                            onClick={() => removeService(service.id)}
                            className="text-red-600 hover:bg-red-100 w-8 h-8 rounded-full font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Service */}
                  {quoteData.services.length < 10 && !selectedServiceType && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Select Service Type
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {['Appointment Setting', 'Website Development', 'Custom Client Portals', 'Business Automations'].map(
                          (type) => (
                            <button
                              key={type}
                              onClick={() => setSelectedServiceType(type)}
                              className="p-4 border-2 border-gray-300 rounded-lg hover:border-green-600 hover:bg-green-50 text-left transition"
                            >
                              <p className="font-bold text-gray-900">{type}</p>
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Select Plan */}
                  {selectedServiceType && !selectedPlan && !showCustomPlan && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h5 className="font-bold text-gray-900">Select Plan</h5>
                        <button
                          onClick={() => setSelectedServiceType('')}
                          className="text-sm text-gray-600 hover:text-gray-900"
                        >
                          ← Back
                        </button>
                      </div>

                      {selectedServiceType === 'Appointment Setting' && (
                        <button
                          onClick={() => setShowCustomPlan(true)}
                          className="w-full mb-4 p-4 border-2 border-dashed border-blue-400 rounded-lg hover:bg-blue-50 font-bold text-blue-600"
                        >
                          + Custom Plan
                        </button>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                        {allServicePlans[selectedServiceType]?.map((plan, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedPlan(plan);
                              if (plan.isPro) setShowPlanDetails(plan);
                            }}
                            className="text-left p-4 rounded-lg border-2 border-gray-300 hover:border-green-600 hover:bg-green-50 transition"
                          >
                            <p className="font-bold text-gray-900 mb-1">{plan.name}</p>
                            {plan.price && (
                              <p className="text-sm text-gray-700">
                                ${plan.price}/mo
                                {plan.annualPrice && ` or $${plan.annualPrice}/year`}
                              </p>
                            )}
                            {plan.setupCost && (
                              <p className="text-sm text-gray-700">
                                Setup: ${plan.setupCost}
                                {plan.monthlyCost && ` + $${plan.monthlyCost}/mo`}
                              </p>
                            )}
                            {plan.isPro && selectedServiceType === 'Appointment Setting' && (
                              <p className="text-xs text-purple-600 font-semibold mt-1">
                                + $349 setup fee
                              </p>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom Plan */}
                  {showCustomPlan && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h5 className="font-bold text-gray-900">Custom Plan</h5>
                        <button
                          onClick={() => setShowCustomPlan(false)}
                          className="text-sm text-gray-600 hover:text-gray-900"
                        >
                          ← Back
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Plan Name
                          </label>
                          <input
                            type="text"
                            value={customPlanData.name}
                            onChange={(e) =>
                              setCustomPlanData({ ...customPlanData, name: e.target.value })
                            }
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                            placeholder="Custom Pro Plan"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Monthly Price ($)
                          </label>
                          <input
                            type="number"
                            value={customPlanData.price}
                            onChange={(e) =>
                              setCustomPlanData({
                                ...customPlanData,
                                price: parseFloat(e.target.value) || 0
                              })
                            }
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                            placeholder="500"
                          />
                        </div>
                        <button
                          onClick={() => {
                            if (!customPlanData.name || customPlanData.price <= 0) {
                              alert('Please fill in plan name and price');
                              return;
                            }
                            setSelectedPlan(customPlanData);
                          }}
                          className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                        >
                          Use Custom Plan
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Plan Details - FIXED: Removed gray text under Guaranteed Appointments and Team Goal */}
                  {showPlanDetails && selectedPlan && (
                    <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-6 mb-4">
                      <h5 className="text-xl font-black text-purple-900 mb-4">
                        {showPlanDetails.name} Details
                      </h5>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Businesses Targeted</p>
                          <p className="text-2xl font-black text-gray-900">
                            {showPlanDetails.businesses}
                          </p>
                          <p className="text-xs text-gray-500">(over 12 months)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">People Contacted</p>
                          <p className="text-2xl font-black text-gray-900">
                            {showPlanDetails.peopleContacted}
                          </p>
                          <p className="text-xs text-gray-500">(businesses × 3)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Contact Points</p>
                          <p className="text-2xl font-black text-gray-900">
                            {showPlanDetails.totalContactPoints.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">(people × 9)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Guaranteed Appointments</p>
                          <p className="text-2xl font-black text-green-600">
                            {showPlanDetails.guaranteedAppointments}
                          </p>
                          {/* REMOVED GRAY TEXT */}
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Team Goal</p>
                          <p className="text-2xl font-black text-blue-600">
                            {showPlanDetails.teamGoal}
                          </p>
                          {/* REMOVED GRAY TEXT */}
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Annual Savings</p>
                          <p className="text-2xl font-black text-orange-600">
                            ${showPlanDetails.monthlySavings}
                          </p>
                          <p className="text-xs text-gray-500">(pay yearly, save 1 month)</p>
                        </div>
                      </div>
                      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
                        <p className="text-sm font-bold text-yellow-900 mb-3">
                          💡 Select Billing Frequency:
                        </p>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <button
                            onClick={() => setSelectedBillingFrequency('monthly')}
                            className={`p-3 rounded-lg border-2 transition ${
                              selectedBillingFrequency === 'monthly'
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-300 hover:border-green-300'
                            }`}
                          >
                            <p className="font-bold text-gray-900">Monthly</p>
                            <p className="text-lg font-black text-green-600">${showPlanDetails.price}/mo</p>
                          </button>
                          <button
                            onClick={() => setSelectedBillingFrequency('annual')}
                            className={`p-3 rounded-lg border-2 transition ${
                              selectedBillingFrequency === 'annual'
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-300 hover:border-green-300'
                            }`}
                          >
                            <p className="font-bold text-gray-900">Annual</p>
                            <p className="text-lg font-black text-green-600">${showPlanDetails.annualPrice}/yr</p>
                            <p className="text-xs text-orange-600 font-semibold">Save ${showPlanDetails.monthlySavings}!</p>
                          </button>
                        </div>
                        <p className="text-xs text-yellow-800">
                          {selectedBillingFrequency === 'annual' 
                            ? '✅ Annual billing selected - client gets 1 month FREE!' 
                            : 'Monthly billing selected'}
                        </p>
                      </div>
                      <button
                        onClick={addServiceToQuote}
                        className="w-full py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
                      >
                        Add to Quote
                      </button>
                    </div>
                  )}

                  {/* Add Service Button (non-Pro plans) */}
                  {selectedPlan && !showPlanDetails && (
                    <button
                      onClick={addServiceToQuote}
                      className="w-full py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 mt-4"
                    >
                      Add to Quote
                    </button>
                  )}

                  {/* Navigation */}
                  {quoteData.services.length > 0 && (
                    <div className="flex gap-2 mt-6">
                      <button
                        onClick={() => setQuoteStep(1)}
                        className="flex-1 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={() => {
                          if (quoteData.services.length === 0) {
                            alert('Please add at least one service');
                            return;
                          }
                          setQuoteStep(3);
                        }}
                        className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold hover:from-green-700 hover:to-emerald-700"
                      >
                        Review & Generate →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Review & Generate */}
              {quoteStep === 3 && (
                <div>
                  <h4 className="text-xl font-black text-gray-900 mb-4">Review Quote</h4>

                  {/* Client Info Summary */}
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
                    <h5 className="font-bold text-blue-900 mb-2">Client Information</h5>
                    <p className="text-sm text-gray-700">
                      <strong>Name:</strong> {quoteData.clientName}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Email:</strong> {quoteData.email}
                    </p>
                    {quoteData.businessName && (
                      <p className="text-sm text-gray-700">
                        <strong>Business:</strong> {quoteData.businessName}
                      </p>
                    )}
                  </div>

                  {/* Services Summary */}
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
                    <h5 className="font-bold text-green-900 mb-3">Services Breakdown</h5>
                    {quoteData.services.map((service) => {
                      const isProPlan = service.plan.isPro;
                      const hasSetup = service.setupFee > 0 || service.plan.setupCost > 0;
                      const monthlyAmount = service.plan.monthlyCost || (isProPlan && service.plan.billingFrequency === 'monthly' ? service.plan.price : 0);
                      
                      return (
                        <div key={service.id} className="mb-3 pb-3 border-b border-green-200 last:border-0 bg-white rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-sm font-bold text-gray-900">{service.type}</p>
                              <p className="text-xs text-gray-600">{service.plan.name}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-1 text-xs">
                            {/* Setup/One-time Fees */}
                            {service.setupFee > 0 && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">• Setup Fee:</span>
                                <span className="font-semibold text-purple-600">${service.setupFee}</span>
                              </div>
                            )}
                            
                            {/* Pro Plan Pricing */}
                            {isProPlan && (
                              <>
                                {service.plan.billingFrequency === 'monthly' ? (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">• First Month:</span>
                                    <span className="font-semibold text-green-600">${service.plan.price}</span>
                                  </div>
                                ) : (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">• Annual (Prepaid):</span>
                                    <span className="font-semibold text-green-600">${service.plan.annualPrice}</span>
                                  </div>
                                )}
                              </>
                            )}
                            
                            {/* One-time Services */}
                            {service.plan.setupCost && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">• Setup:</span>
                                <span className="font-semibold text-green-600">${service.plan.setupCost}</span>
                              </div>
                            )}
                            
                            {service.plan.monthlyCost && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">• First Month Maintenance:</span>
                                <span className="font-semibold text-green-600">${service.plan.monthlyCost}</span>
                              </div>
                            )}
                            
                            {/* Show monthly recurring if applicable */}
                            {monthlyAmount > 0 && (
                              <div className="flex justify-between bg-blue-50 rounded px-2 py-1 mt-2">
                                <span className="text-blue-800 font-semibold">→ Then Monthly:</span>
                                <span className="font-bold text-blue-600">${monthlyAmount}/mo</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Total */}
                  <div className="bg-gray-900 text-white rounded-lg p-6 mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xl font-bold">First Payment Due:</span>
                      <span className="text-3xl font-black">${calculatedTotal.firstPayment?.toLocaleString() || 0}</span>
                    </div>
                    {calculatedTotal.monthlyRecurring > 0 && (
                      <div className="flex justify-between items-center border-t border-gray-700 pt-3">
                        <span className="text-lg font-bold">Then Monthly:</span>
                        <span className="text-2xl font-black text-green-400">${calculatedTotal.monthlyRecurring?.toLocaleString() || 0}/month</span>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={quoteData.notes}
                      onChange={(e) => setQuoteData({ ...quoteData, notes: e.target.value })}
                      rows="4"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                      placeholder="Any special terms or conditions..."
                    />
                  </div>

                  {/* Navigation */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setQuoteStep(2)}
                      className="flex-1 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={generateQuote}
                      className="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold hover:from-green-700 hover:to-emerald-700"
                    >
                      Generate Quote 🎉
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Quote Generated Success View */
            <div>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Quote Generated Successfully!</h3>
                <p className="text-gray-600">Quote #{generatedQuote.quote_number}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Client has been moved to "Quote Sent" in your pipeline
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Client</p>
                    <p className="text-lg font-bold text-gray-900">{generatedQuote.client_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-black text-green-600">
                      ${generatedQuote.total_amount.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-700">
                  <p><strong>Services:</strong> {generatedQuote.services.length} service(s)</p>
                  <p><strong>Email:</strong> {generatedQuote.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => setShowViewQuoteModal(true)}
                  className="py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center gap-2"
                  disabled={isGeneratingPDF}
                >
                  👁️ View Quote
                </button>
                <button
                  onClick={downloadPDF}
                  className="py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 flex items-center justify-center gap-2"
                  disabled={isGeneratingPDF}
                >
                  {isGeneratingPDF ? '⏳ Generating...' : '📥 Download PDF'}
                </button>
                <button
                  onClick={printPDF}
                  className="py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 flex items-center justify-center gap-2"
                  disabled={isGeneratingPDF}
                >
                  🖨️ Print PDF
                </button>
                <button
                  onClick={emailPDF}
                  className="py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 flex items-center justify-center gap-2"
                  disabled={isGeneratingPDF}
                >
                  📧 Email PDF
                </button>
              </div>

              <button
                onClick={resetQuote}
                className="w-full py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700"
              >
                ✨ Create New Quote
              </button>
            </div>
          )}
        </div>
      </div>

      {/* View Quote Modal */}
      {showViewQuoteModal && generatedQuote && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex justify-between items-center rounded-t-2xl z-10">
              <h3 className="text-2xl font-black">Quote Preview</h3>
              <button
                onClick={() => setShowViewQuoteModal(false)}
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
                  <p className="text-sm text-gray-500">Quote #{generatedQuote.quote_number}</p>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Client Information</h4>
                    <p className="text-gray-700">{generatedQuote.client_name}</p>
                    {generatedQuote.business_name && (
                      <p className="text-gray-700">{generatedQuote.business_name}</p>
                    )}
                    <p className="text-gray-700">{generatedQuote.email}</p>
                    {generatedQuote.phone_number && (
                      <p className="text-gray-700">{generatedQuote.phone_number}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <h4 className="font-bold text-gray-900 mb-2">Quote Details</h4>
                    <p className="text-gray-700">
                      Date: {new Date(generatedQuote.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700">Sales Rep: {currentUser.username}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
                    Services
                  </h4>
                  {generatedQuote.services.map((service, idx) => (
                    <div key={idx} className="mb-4 pb-4 border-b border-gray-200">
                      <p className="font-bold text-gray-900">{service.type}</p>
                      <p className="text-gray-700">{service.plan.name}</p>
                      <div className="mt-2 text-gray-600">
                        {service.plan.isPro && (
                          <>
                            <p className={`${service.plan.billingFrequency === 'monthly' ? 'text-green-600 font-semibold' : ''}`}>
                              {service.plan.billingFrequency === 'monthly' ? '✓ ' : ''}Monthly: ${service.plan.price}/month
                            </p>
                            <p className={`text-sm ${service.plan.billingFrequency === 'annual' ? 'text-green-600 font-semibold' : ''}`}>
                              {service.plan.billingFrequency === 'annual' ? '✓ ' : ''}Annual: ${service.plan.annualPrice}/year (Save ${service.plan.monthlySavings} - Get 1 Month FREE!)
                            </p>
                          </>
                        )}
                        {service.setupFee > 0 && (
                          <p className="text-purple-600">Setup Fee: ${service.setupFee}</p>
                        )}
                        {service.plan.setupCost && (
                          <p>Setup: ${service.plan.setupCost}</p>
                        )}
                        {service.plan.monthlyCost && (
                          <p>Monthly: ${service.plan.monthlyCost}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-right">
                  <p className="text-2xl font-black text-gray-900">
                    Total: ${generatedQuote.total_amount.toLocaleString()}
                  </p>
                </div>

                {generatedQuote.notes && (
                  <div className="mt-8 bg-gray-50 p-4 rounded-lg">
                    <p className="font-bold text-gray-900 mb-2">Notes:</p>
                    <p className="text-gray-700">{generatedQuote.notes}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={downloadPDF}
                  className="py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
                  disabled={isGeneratingPDF}
                >
                  📥 Download
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
      )}
    </div>
  );
}