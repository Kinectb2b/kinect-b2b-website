'use client';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import PipelineBoard from './components/PipelineBoard';
import QuoteBuilder from './components/QuoteBuilder';
import SalesScripts from './components/SalesScripts';
import ClientProfile from './components/ClientProfile';
import ProfileModal from './components/ProfileModal';
import PreviousQuotesModal from './components/PreviousQuotesModal';
import CelebrationModal from './components/CelebrationModal';
import QuoteViewModal from './components/QuoteViewModal';

export default function SalesDashboard() {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Profile states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [profileData, setProfileData] = useState(null);
  
  // Pipeline states
  const [pipelineClients, setPipelineClients] = useState({
    lead: [],
    quote_sent: [],
    active: [],
    inactive: []
  });
  const [showClientProfileModal, setShowClientProfileModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  
  // Quote states
  const [showQuoteBuilder, setShowQuoteBuilder] = useState(false);
  const [previousQuotes, setPreviousQuotes] = useState([]);
  const [showPreviousQuotes, setShowPreviousQuotes] = useState(false);
  const [prefilledClientData, setPrefilledClientData] = useState(null); // NEW!
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationClient, setCelebrationClient] = useState('');
  const [showQuoteView, setShowQuoteView] = useState(false);
  const [viewingQuote, setViewingQuote] = useState(null);
  const [editingQuote, setEditingQuote] = useState(null);
  
  // Scripts states
  const [showScriptsModal, setShowScriptsModal] = useState(false);
  
  const supabase = createClientComponentClient();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch('/api/sales/verify');
        const data = await response.json();

        if (!data.authenticated || !data.salesUser) {
          localStorage.removeItem('sales_user');
          window.location.href = '/sales';
          return;
        }

        // Set user from verified server data
        setCurrentUser(data.salesUser);
        fetchProfileData(data.salesUser.username);
        fetchPipelineClients(data.salesUser.username);
        fetchPreviousQuotes(data.salesUser.username);
      } catch (error) {
        console.error('Auth verification failed:', error);
        localStorage.removeItem('sales_user');
        window.location.href = '/sales';
      }
    };

    verifyAuth();
  }, []);

  const fetchProfileData = async (username) => {
    try {
      const { data } = await supabase
        .from('sales_reps')
        .select('*')
        .eq('username', username)
        .single();
      if (data) setProfileData(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPipelineClients = async (username) => {
    try {
      const { data } = await supabase
        .from('pipeline_clients')
        .select('*')
        .eq('sales_rep_username', username)
        .order('position');
      
      const grouped = { lead: [], quote_sent: [], active: [], inactive: [] };
      data?.forEach(client => {
        if (grouped[client.status]) grouped[client.status].push(client);
      });
      setPipelineClients(grouped);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchPreviousQuotes = async (username) => {
    try {
      const { data } = await supabase
        .from('quotes')
        .select('*')
        .eq('sales_rep_username', username)
        .order('created_at', { ascending: false });
      setPreviousQuotes(data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  };

  // NEW HANDLER: Creates quote from client profile
  const handleCreateQuoteFromClient = (clientData) => {
    setPrefilledClientData({
      clientName: clientData.client_name,
      businessName: clientData.business_name || '',
      email: clientData.email,
      phoneNumber: clientData.phone_number || '',
      industry: clientData.industry || '',
      address: clientData.address || '',
      services: [],
      notes: ''
    });
    setShowClientProfileModal(false);
    setShowQuoteBuilder(true);
  };

  // NEW HANDLER: View quote from previous quotes (opens QuoteBuilder in view mode)
  const handleViewQuote = (quote) => {
    setViewingQuote(quote);
    setShowQuoteView(true);
    setShowPreviousQuotes(false);
  };

  // NEW HANDLER: Edit quote
  const handleEditQuote = (quote) => {
    // Convert quote back to form data
    setPrefilledClientData({
      clientName: quote.client_name,
      businessName: quote.business_name || '',
      email: quote.email,
      phoneNumber: quote.phone_number || '',
      industry: quote.industry || '',
      address: quote.address || '',
      services: quote.services || [],
      notes: quote.notes || ''
    });
    setEditingQuote(quote);
    setShowPreviousQuotes(false);
    setShowQuoteBuilder(true);
  };

  // NEW HANDLER: Accept quote (move to active + celebrate!)
  const handleAcceptQuote = async (quote) => {
    try {
      // Find pipeline client
      const { data: pipelineClient } = await supabase
        .from('pipeline_clients')
        .select('id')
        .eq('sales_rep_username', currentUser.username)
        .eq('email', quote.email)
        .single();

      if (pipelineClient) {
        // Move to active
        await supabase
          .from('pipeline_clients')
          .update({ status: 'active' })
          .eq('id', pipelineClient.id);

        // Update quote status
        await supabase
          .from('quotes')
          .update({ status: 'accepted' })
          .eq('id', quote.id);

        // Show celebration!
        setCelebrationClient(quote.client_name);
        setShowCelebration(true);
        setShowPreviousQuotes(false);
        
        // Refresh pipeline
        fetchPipelineClients(currentUser.username);
        fetchPreviousQuotes(currentUser.username);
      } else {
        alert('Client not found in pipeline');
      }
    } catch (error) {
      console.error('Error accepting quote:', error);
      alert('Failed to accept quote');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/sales/logout', { method: 'POST' });
    window.location.href = '/sales';
  };

  const totalPipelineValue = Object.values(pipelineClients)
    .flat()
    .reduce((sum, c) => sum + parseFloat(c.deal_value || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <span className="text-2xl">🚀</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Kinect B2B
                </h1>
                <p className="text-sm text-gray-600">Sales Dashboard</p>
              </div>
            </div>

            {/* Right Side - Profile & Tools */}
            <div className="flex items-center gap-3">
              {/* Tools Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowToolsDropdown(!showToolsDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  <span className="text-xl">🛠️</span>
                  <span className="hidden sm:inline">Tools</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showToolsDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border-2 border-indigo-100 overflow-hidden z-50">
                    <button
                      onClick={() => {
                        window.open('/research-form', '_blank');
                        setShowToolsDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-indigo-50 flex items-center gap-3 transition-colors"
                    >
                      <span className="text-xl">📋</span>
                      <span className="font-semibold text-gray-800">Research Form</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowScriptsModal(true);
                        setShowToolsDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-indigo-50 flex items-center gap-3 transition-colors border-t border-gray-100"
                    >
                      <span className="text-xl">📞</span>
                      <span className="font-semibold text-gray-800">Sales Scripts</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowQuoteBuilder(true);
                        setShowToolsDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-indigo-50 flex items-center gap-3 transition-colors border-t border-gray-100"
                    >
                      <span className="text-xl">💰</span>
                      <span className="font-semibold text-gray-800">Build Quote</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowPreviousQuotes(true);
                        setShowToolsDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-indigo-50 flex items-center gap-3 transition-colors border-t border-gray-100"
                    >
                      <span className="text-xl">📊</span>
                      <span className="font-semibold text-gray-800">Previous Quotes</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Button */}
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
              >
                {profileData?.profile_picture_url ? (
                  <img
                    src={profileData.profile_picture_url}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-white"
                  />
                ) : (
                  <span className="text-xl">👤</span>
                )}
                <span className="hidden sm:inline">
                  {profileData?.first_name || currentUser?.username}
                </span>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white p-2 rounded-2xl shadow-lg border-2 border-gray-200">
          {['pipeline', 'services', 'process'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-6 rounded-xl font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6">
          <div>
            {/* Pipeline Tab */}
            {activeTab === 'pipeline' && (
              <PipelineBoard
                pipelineClients={pipelineClients}
                onRefresh={() => fetchPipelineClients(currentUser.username)}
                onClientClick={(client) => {
                  setSelectedClient(client);
                  setShowClientProfileModal(true);
                }}
                currentUser={currentUser}
                supabase={supabase}
                onCreateQuote={() => setShowQuoteBuilder(true)}
              />
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-6">💼 Our Services</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
                    <h4 className="text-xl font-black text-blue-900 mb-2">📞 Appointment Setting</h4>
                    <p className="text-gray-700 mb-4">
                      Pro Plans from $250 - $3,000/mo with guaranteed appointments
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Multi-channel outreach</li>
                      <li>• Qualified lead generation</li>
                      <li>• Calendar integration</li>
                      <li>• Performance tracking</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
                    <h4 className="text-xl font-black text-purple-900 mb-2">🌐 Website Development</h4>
                    <p className="text-gray-700 mb-4">
                      Custom websites from $2,500 - $10,000 with monthly maintenance
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Responsive design</li>
                      <li>• SEO optimization</li>
                      <li>• CMS integration</li>
                      <li>• Ongoing support</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6">
                    <h4 className="text-xl font-black text-yellow-900 mb-2">🔐 Custom Client Portals</h4>
                    <p className="text-gray-700 mb-4">
                      Secure portals from $3,000 - $12,000 with full customization
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• User authentication</li>
                      <li>• Custom integrations</li>
                      <li>• Reporting & analytics</li>
                      <li>• White-label options</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                    <h4 className="text-xl font-black text-green-900 mb-2">⚡ Business Automations</h4>
                    <p className="text-gray-700 mb-4">
                      Save time with automated workflows from $500 - $2,000
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Email automation</li>
                      <li>• CRM integration</li>
                      <li>• Social media scheduling</li>
                      <li>• Custom workflows</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Process Tab */}
            {activeTab === 'process' && (
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-6">📊 Kinect B2B Process</h3>
                <div className="space-y-4">
                  {[
                    {
                      stage: 'Stage 1: Setup Call ($349)',
                      color: 'purple',
                      content: 'We collect the $349 setup fee and dive deep into the client\'s company, needs, ideal clients, and target locations. We also build them a fully functional client-facing portal during this phase.'
                    },
                    {
                      stage: 'Stage 2: Research',
                      color: 'yellow',
                      content: 'Our research team finds all potential businesses that match the client\'s criteria. We build comprehensive lists of target companies with contact information for decision-makers.'
                    },
                    {
                      stage: 'Stage 3: Discovery',
                      color: 'blue',
                      content: 'We identify and qualify the best prospects from our research. We verify contact information and ensure these businesses align with the client\'s ideal customer profile.'
                    },
                    {
                      stage: 'Stage 4: Engagement',
                      color: 'orange',
                      content: 'We begin multi-channel outreach (calls, emails, SMS) to the target companies. We contact 3 decision-makers at each business to maximize our chances of getting through.'
                    },
                    {
                      stage: 'Stage 5: Appointment Setting',
                      color: 'green',
                      content: 'We successfully book qualified appointments with interested prospects and schedule them directly into the client\'s calendar. These are warm, qualified leads ready to discuss business.'
                    },
                    {
                      stage: 'Stage 6: Follow-Up',
                      color: 'pink',
                      content: 'After appointments are set, we check with the client to see how it went. If unsuccessful, we contact the prospect directly. After 2-3 months, we circle back to check satisfaction and look for upsell opportunities.'
                    }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className={`bg-gradient-to-r from-${item.color}-50 to-${item.color}-100 border-l-4 border-${item.color}-500 p-6 rounded-lg shadow-lg`}
                    >
                      <h4 className={`text-xl font-black text-${item.color}-900 mb-2`}>
                        {item.stage}
                      </h4>
                      <p className="text-gray-700">{item.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showProfileModal && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          profileData={profileData}
          currentUser={currentUser}
          supabase={supabase}
          onUpdate={(data) => setProfileData(data)}
        />
      )}

      {showQuoteBuilder && (
        <QuoteBuilder
          isOpen={showQuoteBuilder}
          onClose={() => {
            setShowQuoteBuilder(false);
            setPrefilledClientData(null); // NEW: Reset prefilled data
          }}
          currentUser={currentUser}
          supabase={supabase}
          onQuoteGenerated={() => {
            fetchPreviousQuotes(currentUser.username);
            fetchPipelineClients(currentUser.username);
          }}
          prefilledData={prefilledClientData} // NEW: Pass prefilled data
          pipelineLeads={pipelineClients.lead || []} // NEW: Pass pipeline leads
        />
      )}

      {showPreviousQuotes && (
        <PreviousQuotesModal
          isOpen={showPreviousQuotes}
          onClose={() => setShowPreviousQuotes(false)}
          quotes={previousQuotes}
          supabase={supabase}
          currentUser={currentUser}
          onRefresh={() => fetchPreviousQuotes(currentUser.username)}
          onViewQuote={handleViewQuote}
          onEditQuote={handleEditQuote}
          onAcceptQuote={handleAcceptQuote}
        />
      )}

      {showQuoteView && viewingQuote && (
        <QuoteViewModal
          isOpen={showQuoteView}
          onClose={() => {
            setShowQuoteView(false);
            setViewingQuote(null);
          }}
          quote={viewingQuote}
          currentUser={currentUser}
        />
      )}

      {showCelebration && (
        <CelebrationModal
          isOpen={showCelebration}
          onClose={() => setShowCelebration(false)}
          clientName={celebrationClient}
        />
      )}

      {showScriptsModal && (
        <SalesScripts
          isOpen={showScriptsModal}
          onClose={() => setShowScriptsModal(false)}
        />
      )}

      {showClientProfileModal && selectedClient && (
        <ClientProfile
          isOpen={showClientProfileModal}
          onClose={() => {
            setShowClientProfileModal(false);
            setSelectedClient(null);
          }}
          client={selectedClient}
          currentUser={currentUser}
          supabase={supabase}
          onUpdate={() => fetchPipelineClients(currentUser.username)}
          onCreateQuote={handleCreateQuoteFromClient}
          onAcceptQuote={handleAcceptQuote}
        />
      )}
    </div>
  );
}