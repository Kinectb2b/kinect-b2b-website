import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function PipelineBoard({ pipelineClients, onRefresh, onClientClick, currentUser, supabase }) {
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClientData, setNewClientData] = useState({
    client_name: '',
    business_name: '',
    email: '',
    phone_number: '',
    industry: '',
    address: '',
    deal_value: 0
  });

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
        deal_value: 0
      });
    } catch (error) {
      console.error('Error adding client:', error);
      alert('Failed to add client');
    }
  };

  const updateClientStatus = async (clientId, newStatus) => {
    try {
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

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // If dropped in same column, do nothing
    if (source.droppableId === destination.droppableId) return;

    // Update status in database
    updateClientStatus(draggableId, destination.droppableId);
  };

  const columns = [
    { id: 'lead', title: 'Leads', color: 'blue', icon: '🎯' },
    { id: 'quote_sent', title: 'Quote Sent', color: 'yellow', icon: '📧' },
    { id: 'active', title: 'Active Clients', color: 'green', icon: '✅' },
    { id: 'inactive', title: 'Inactive', color: 'gray', icon: '💤' }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-black text-gray-900">Sales Pipeline</h3>
        <button
          onClick={() => setShowAddClientModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 shadow-lg"
        >
          + Add Client
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid md:grid-cols-4 gap-4">
          {columns.map(column => (
            <div key={column.id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-black text-gray-900 flex items-center gap-2">
                  <span>{column.icon}</span>
                  <span>{column.title}</span>
                </h4>
                <span className={`bg-${column.color}-100 text-${column.color}-800 px-3 py-1 rounded-full text-xs font-bold`}>
                  {pipelineClients[column.id]?.length || 0}
                </span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3 min-h-[200px] transition-colors ${
                      snapshot.isDraggingOver ? 'bg-blue-50 rounded-lg p-2' : ''
                    }`}
                  >
                    {pipelineClients[column.id]?.map((client, index) => (
                      <Draggable key={client.id} draggableId={client.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => onClientClick(client)}
                            className={`bg-white p-4 rounded-lg border-2 cursor-pointer hover:shadow-lg transition-all ${
                              snapshot.isDragging
                                ? 'border-blue-500 shadow-2xl rotate-2'
                                : 'border-gray-200'
                            }`}
                          >
                            <p className="font-bold text-gray-900 mb-1">{client.client_name}</p>
                            {client.business_name && (
                              <p className="text-sm text-gray-600 mb-2">{client.business_name}</p>
                            )}
                            {client.deal_value > 0 && (
                              <p className="text-sm font-bold text-green-600">
                                ${client.deal_value.toLocaleString()}
                              </p>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Add Client Modal */}
      {showAddClientModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 flex justify-between items-center rounded-t-2xl">
              <h3 className="text-2xl font-black">Add New Client</h3>
              <button
                onClick={() => setShowAddClientModal(false)}
                className="text-3xl hover:bg-white/20 w-10 h-10 rounded-full transition"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
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
                    Deal Value ($)
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
    </div>
  );
}