import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Draggable Client Card Component
function ClientCard({ client, onClientClick, onCreateQuote }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: client.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-green-400 hover:shadow-lg transition cursor-move"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h5 className="font-bold text-gray-900">{client.client_name}</h5>
          {client.business_name && (
            <p className="text-sm text-gray-600">{client.business_name}</p>
          )}
        </div>
        {client.deal_value > 0 && (
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
            ${client.deal_value}
          </span>
        )}
      </div>

      <div className="text-sm text-gray-600 space-y-1 mb-3">
        <p className="flex items-center gap-2">
          <span>📧</span>
          <span className="truncate">{client.email}</span>
        </p>
        {client.phone_number && (
          <p className="flex items-center gap-2">
            <span>📞</span>
            <span>{client.phone_number}</span>
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClientClick(client);
          }}
          className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
        >
          View
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCreateQuote(client);
          }}
          className="flex-1 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition"
        >
          Quote
        </button>
      </div>
    </div>
  );
}

export default function PipelineBoard({ pipelineClients, onRefresh, onClientClick, currentUser, supabase, onCreateQuote }) {
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [activeClientData, setActiveClientData] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [newClientData, setNewClientData] = useState({
    client_name: '',
    business_name: '',
    email: '',
    phone_number: '',
    industry: '',
    address: '',
    deal_value: 0,
    interested_services: []
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const serviceOptions = [
    { name: 'Appointment Setting', icon: '📞' },
    { name: 'Website Development', icon: '🌐' },
    { name: 'Custom Client Portals', icon: '🔐' },
    { name: 'Business Automations', icon: '⚙️' }
  ];

  const addPipelineClient = async () => {
    if (!newClientData.client_name || !newClientData.email) {
      alert('Client name and email are required');
      return;
    }

    try {
      const { error } = await supabase
        .from('pipeline_clients')
        .insert({
          sales_rep_username: currentUser.username,
          ...newClientData,
          status: 'lead'
        });

      if (error) throw error;

      onRefresh();
      setShowAddClientModal(false);
      setNewClientData({
        client_name: '',
        business_name: '',
        email: '',
        phone_number: '',
        industry: '',
        address: '',
        deal_value: 0,
        interested_services: []
      });
    } catch (error) {
      console.error('Error adding client:', error);
      alert('Failed to add client');
    }
  };

  const updateClientStatus = async (clientId, newStatus) => {
    try {
      // If moving to active, show celebration and service selection
      if (newStatus === 'active') {
        const client = Object.values(pipelineClients)
          .flat()
          .find(c => c.id === clientId);
        
        setActiveClientData(client);
        setShowCelebrationModal(true);
        return;
      }

      const { error } = await supabase
        .from('pipeline_clients')
        .update({ status: newStatus })
        .eq('id', clientId);

      if (error) throw error;
      onRefresh();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const completeActivation = async () => {
    if (selectedServices.length === 0) {
      alert('Please select at least one service');
      return;
    }

    try {
      const { error } = await supabase
        .from('pipeline_clients')
        .update({ 
          status: 'active',
          active_services: selectedServices,
          activation_date: new Date().toISOString()
        })
        .eq('id', activeClientData.id);

      if (error) throw error;

      setShowCelebrationModal(false);
      setShowServicesModal(false);
      setSelectedServices([]);
      setActiveClientData(null);
      onRefresh();
    } catch (error) {
      console.error('Error activating client:', error);
      alert('Failed to activate client');
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    // Find which column the item was dropped in
    const overId = over.id;
    const columns = ['lead', 'quote_sent', 'active', 'inactive'];
    
    // Check if dropped on a column container
    if (columns.includes(overId)) {
      updateClientStatus(active.id, overId);
    }
    
    setActiveId(null);
  };

  const columns = [
    { id: 'lead', title: 'Leads', color: 'blue', icon: '🎯' },
    { id: 'quote_sent', title: 'Quote Sent', color: 'yellow', icon: '📧' },
    { id: 'active', title: 'Active Clients', color: 'green', icon: '✅' },
    { id: 'inactive', title: 'Inactive', color: 'gray', icon: '💤' }
  ];

  const toggleServiceSelection = (serviceName) => {
    setSelectedServices(prev => 
      prev.includes(serviceName)
        ? prev.filter(s => s !== serviceName)
        : [...prev, serviceName]
    );
  };

  const calculatePipelineValue = () => {
    let total = 0;
    if (pipelineClients) {
      Object.values(pipelineClients).flat().forEach(client => {
        if (client && client.deal_value) total += client.deal_value;
      });
    }
    return total;
  };

  // Safety check - ensure pipelineClients is properly structured
  const safeClients = pipelineClients || {
    lead: [],
    quote_sent: [],
    active: [],
    inactive: []
  };

  const activeClient = activeId
    ? Object.values(safeClients).flat().find(c => c.id === activeId)
    : null;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-black text-gray-900">Sales Pipeline</h3>
          <p className="text-sm text-gray-600">
            Total Pipeline Value: <span className="font-bold text-green-600">${calculatePipelineValue().toLocaleString()}</span>
          </p>
        </div>
        <button
          onClick={() => setShowAddClientModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 shadow-lg"
        >
          + Add Client
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid md:grid-cols-4 gap-4">
          {columns.map(column => (
            <div key={column.id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-black text-gray-900 flex items-center gap-2">
                  <span>{column.icon}</span>
                  <span>{column.title}</span>
                </h4>
                <span className={`bg-${column.color}-100 text-${column.color}-800 px-3 py-1 rounded-full text-xs font-bold`}>
                  {safeClients[column.id]?.length || 0}
                </span>
              </div>

              <SortableContext
                items={safeClients[column.id]?.map(c => c.id) || []}
                strategy={verticalListSortingStrategy}
                id={column.id}
              >
                <div className="space-y-3 min-h-[200px]">
                  {safeClients[column.id]?.map(client => (
                    <ClientCard
                      key={client.id}
                      client={client}
                      onClientClick={onClientClick}
                      onCreateQuote={onCreateQuote}
                    />
                  ))}
                </div>
              </SortableContext>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeClient ? (
            <div className="bg-white rounded-xl p-4 border-2 border-green-400 shadow-2xl cursor-grabbing">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h5 className="font-bold text-gray-900">{activeClient.client_name}</h5>
                  {activeClient.business_name && (
                    <p className="text-sm text-gray-600">{activeClient.business_name}</p>
                  )}
                </div>
                {activeClient.deal_value > 0 && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                    ${activeClient.deal_value}
                  </span>
                )}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Add Client Modal */}
      {showAddClientModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 flex justify-between items-center sticky top-0">
              <h3 className="text-2xl font-black">Add New Client</h3>
              <button
                onClick={() => setShowAddClientModal(false)}
                className="text-3xl hover:bg-white/20 w-10 h-10 rounded-full transition"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    value={newClientData.client_name}
                    onChange={(e) =>
                      setNewClientData({ ...newClientData, client_name: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newClientData.email}
                    onChange={(e) =>
                      setNewClientData({ ...newClientData, email: e.target.value })
                    }
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
                    value={newClientData.business_name}
                    onChange={(e) =>
                      setNewClientData({ ...newClientData, business_name: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                    placeholder="ABC Company"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newClientData.phone_number}
                    onChange={(e) =>
                      setNewClientData({ ...newClientData, phone_number: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Industry</label>
                  <input
                    type="text"
                    value={newClientData.industry}
                    onChange={(e) =>
                      setNewClientData({ ...newClientData, industry: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                    placeholder="Technology"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Potential Value ($)
                  </label>
                  <input
                    type="number"
                    value={newClientData.deal_value}
                    onChange={(e) =>
                      setNewClientData({
                        ...newClientData,
                        deal_value: parseFloat(e.target.value) || 0
                      })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                    placeholder="5000"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={newClientData.address}
                  onChange={(e) =>
                    setNewClientData({ ...newClientData, address: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-600 focus:outline-none"
                  placeholder="123 Main St, City, State"
                />
              </div>

              {/* Interested Services */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Interested Services
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {serviceOptions.map(service => (
                    <button
                      key={service.name}
                      onClick={() => {
                        const current = newClientData.interested_services || [];
                        const updated = current.includes(service.name)
                          ? current.filter(s => s !== service.name)
                          : [...current, service.name];
                        setNewClientData({ ...newClientData, interested_services: updated });
                      }}
                      className={`p-3 rounded-lg border-2 transition ${
                        newClientData.interested_services?.includes(service.name)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-green-300'
                      }`}
                    >
                      <span className="text-2xl mb-1 block">{service.icon}</span>
                      <span className="text-xs font-semibold">{service.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={addPipelineClient}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold hover:from-green-700 hover:to-emerald-700"
              >
                Add Client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Celebration Modal */}
      {showCelebrationModal && activeClientData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
            {!showServicesModal ? (
              <>
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8 text-center">
                  <div className="text-6xl mb-4 animate-bounce">🎉</div>
                  <h3 className="text-3xl font-black mb-2">Congratulations!</h3>
                  <p className="text-xl">You have an active client!</p>
                </div>
                <div className="p-8 text-center">
                  <p className="text-2xl font-bold text-gray-900 mb-4">
                    {activeClientData.client_name}
                  </p>
                  {activeClientData.business_name && (
                    <p className="text-lg text-gray-600 mb-6">
                      {activeClientData.business_name}
                    </p>
                  )}
                  <button
                    onClick={() => setShowServicesModal(true)}
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 shadow-lg"
                  >
                    Continue →
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex justify-between items-center">
                  <h3 className="text-2xl font-black">Select Services</h3>
                  <button
                    onClick={() => {
                      setShowCelebrationModal(false);
                      setShowServicesModal(false);
                      setSelectedServices([]);
                      setActiveClientData(null);
                    }}
                    className="text-3xl hover:bg-white/20 w-10 h-10 rounded-full transition"
                  >
                    ×
                  </button>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-4">
                    What services did <strong>{activeClientData.client_name}</strong> select?
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {serviceOptions.map(service => (
                      <button
                        key={service.name}
                        onClick={() => toggleServiceSelection(service.name)}
                        className={`p-4 rounded-xl border-2 transition ${
                          selectedServices.includes(service.name)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 hover:border-green-300'
                        }`}
                      >
                        <span className="text-3xl mb-2 block">{service.icon}</span>
                        <span className="text-sm font-bold">{service.name}</span>
                      </button>
                    ))}
                  </div>

                  {selectedServices.length > 0 && (
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
                      <p className="text-sm font-bold text-green-900 mb-2">Selected Services:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedServices.map(service => (
                          <span key={service} className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={completeActivation}
                    disabled={selectedServices.length === 0}
                    className={`w-full py-3 rounded-lg font-bold ${
                      selectedServices.length === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                    }`}
                  >
                    Activate Client
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}