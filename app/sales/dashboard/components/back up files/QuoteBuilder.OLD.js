import { useState, useEffect } from 'react';

export default function QuoteBuilder({ isOpen, onClose, currentUser, supabase, onQuoteGenerated }) {
  const [quoteStep, setQuoteStep] = useState(1);
  const [quoteData, setQuoteData] = useState({
    clientName: '',
    businessName: '',
    industry: '',
    phoneNumber: '',
    email: '',
    address: '',
    services: [],
    notes: ''
  });
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCustomPlan, setShowCustomPlan] = useState(false);
  const [customPlanData, setCustomPlanData] = useState({ name: '', price: 0, billing: 'Monthly' });
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [generatedQuote, setGeneratedQuote] = useState(null);
  const [showPlanDetails, setShowPlanDetails] = useState(null);

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

  const addServiceToQuote = () => {
    if (!selectedPlan && !customPlanData.name) {
      alert('Please select a plan or fill in custom plan details');
      return;
    }

    const plan = selectedPlan || { ...customPlanData, isCustom: true };
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
    setCustomPlanData({ name: '', price: 0, billing: 'Monthly' });
  };

  const removeService = (serviceId) => {
    setQuoteData(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== serviceId)
    }));
  };

  useEffect(() => {
    let total = 0;
    quoteData.services.forEach(service => {
      total += service.setupFee || 0;
      total += service.plan.price || service.plan.setupCost || 0;
    });
    setCalculatedTotal(total);
  }, [quoteData.services]);

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
          total_amount: calculatedTotal,
          notes: quoteData.notes
        })
        .select()
        .single();

      if (error) throw error;

      // Try to find and update pipeline client
      const { data: pipelineClient } = await supabase
        .from('pipeline_clients')
        .select('id')
        .eq('sales_rep_username', currentUser.username)
        .eq('email', quoteData.email)
        .single();

      if (pipelineClient) {
        await supabase
          .from('pipeline_clients')
          .update({ status: 'quote_sent', deal_value: calculatedTotal })
          .eq('id', pipelineClient.id);
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
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 flex justify-between items-center rounded-t-2xl z-10">
          <h3 className="text-2xl font-black">💰 Build a Quote</h3>
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

                  {/* Plan Details */}
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
                          <p className="text-xs text-gray-500">(yearly, businesses ÷ 20)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Team Goal</p>
                          <p className="text-2xl font-black text-blue-600">
                            {showPlanDetails.teamGoal}
                          </p>
                          <p className="text-xs text-gray-500">(yearly, guarantee × 5)</p>
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
                        <p className="text-sm font-bold text-yellow-900">
                          ⚠️ All Pro Plans include a one-time $349 setup fee for the initial
                          research call and client portal build.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            addServiceToQuote();
                            setShowPlanDetails(null);
                          }}
                          className="flex-1 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
                        >
                          Add to Quote
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPlan(null);
                            setShowPlanDetails(null);
                          }}
                          className="flex-1 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700"
                        >
                          Choose Different Plan
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Add service button if plan selected but not Pro */}
                  {selectedPlan && !showPlanDetails && (
                    <button
                      onClick={addServiceToQuote}
                      className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 mb-4"
                    >
                      Add to Quote
                    </button>
                  )}

                  {/* Navigation */}
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
                    <h5 className="font-bold text-green-900 mb-2">Services</h5>
                    {quoteData.services.map((service) => (
                      <div key={service.id} className="mb-2 pb-2 border-b border-green-200 last:border-0">
                        <p className="text-sm font-bold text-gray-900">{service.type}</p>
                        <p className="text-xs text-gray-700">{service.plan.name}</p>
                        <p className="text-xs text-green-600">
                          {service.setupFee > 0 && `Setup: $${service.setupFee} + `}
                          Price: ${service.plan.price || service.plan.setupCost}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="bg-gray-900 text-white rounded-lg p-6 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold">Total Investment:</span>
                      <span className="text-3xl font-black">${calculatedTotal.toLocaleString()}</span>
                    </div>
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
            /* Generated Quote View */
            <div>
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
                      <div className="text-right">
                        {service.setupFee > 0 && (
                          <p className="text-gray-600">Setup Fee: ${service.setupFee}</p>
                        )}
                        <p className="text-gray-600">
                          Price: ${service.plan.price || service.plan.setupCost}
                        </p>
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

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      window.location.origin + '/quote/' + generatedQuote.quote_number
                    );
                    alert('Quote link copied!');
                  }}
                  className="py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                >
                  📋 Copy Link
                </button>
                <button
                  onClick={() => window.print()}
                  className="py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
                >
                  🖨️ Print
                </button>
                <button
                  onClick={() => {
                    const mailtoLink = `mailto:${generatedQuote.email}?subject=Quote from Kinect B2B&body=Please find your quote at: ${window.location.origin}/quote/${generatedQuote.quote_number}`;
                    window.location.href = mailtoLink;
                  }}
                  className="py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700"
                >
                  📧 Email
                </button>
                <button
                  onClick={resetQuote}
                  className="py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700"
                >
                  ✨ New Quote
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}