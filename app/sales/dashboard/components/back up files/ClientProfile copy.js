import { useState, useEffect } from 'react';

export default function ClientProfile({ isOpen, onClose, client, currentUser, supabase, onUpdate }) {
  const [editingClient, setEditingClient] = useState(false);
  const [clientData, setClientData] = useState(client);
  const [clientActivities, setClientActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({ type: 'note', subject: '', notes: '' });

  useEffect(() => {
    if (client) {
      fetchClientActivities(client.id);
    }
  }, [client]);

  const fetchClientActivities = async (clientId) => {
    try {
      const { data, error } = await supabase
        .from('client_activities')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClientActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const updateClientData = async (updates) => {
    try {
      const { error } = await supabase
        .from('pipeline_clients')
        .update(updates)
        .eq('id', client.id);

      if (error) throw error;

      setClientData({ ...clientData, ...updates });
      setEditingClient(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating client:', error);
      alert('Failed to update client');
    }
  };

  const addClientActivity = async () => {
    if (!newActivity.notes) {
      alert('Please add some notes');
      return;
    }

    try {
      const { error } = await supabase
        .from('client_activities')
        .insert({
          client_id: client.id,
          sales_rep_username: currentUser.username,
          activity_type: newActivity.type,
          subject: newActivity.subject,
          notes: newActivity.notes
        });

      if (error) throw error;

      fetchClientActivities(client.id);
      setNewActivity({ type: 'note', subject: '', notes: '' });
    } catch (error) {
      console.error('Error adding activity:', error);
      alert('Failed to add activity');
    }
  };

  const changeClientStatus = async (newStatus) => {
    if (!confirm(`Move client to ${newStatus}?`)) return;

    try {
      const { error } = await supabase
        .from('pipeline_clients')
        .update({ status: newStatus })
        .eq('id', client.id);

      if (error) throw error;

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error changing status:', error);
      alert('Failed to change status');
    }
  };

  const deleteClient = async () => {
    if (!confirm('Are you sure you want to delete this client? This cannot be undone.')) return;

    try {
      const { error} = await supabase
        .from('pipeline_clients')
        .delete()
        .eq('id', client.id);

      if (error) throw error;

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Failed to delete client');
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'call': return '📞';
      case 'email': return '📧';
      case 'text': return '💬';
      case 'meeting': return '🤝';
      default: return '📝';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'lead': return 'blue';
      case 'quote_sent': return 'yellow';
      case 'active': return 'green';
      case 'inactive': return 'gray';
      default: return 'gray';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black">{clientData.client_name}</h3>
            <p className="text-sm opacity-90">{clientData.business_name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-3xl hover:bg-white/20 w-10 h-10 rounded-full transition"
          >
            ×
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Status Badge */}
          <div className="mb-6">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold bg-${getStatusColor(clientData.status)}-100 text-${getStatusColor(clientData.status)}-800 capitalize`}>
              {clientData.status.replace('_', ' ')}
            </span>
          </div>

          {/* Client Information */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-black text-gray-900">Client Information</h4>
              {!editingClient && (
                <button
                  onClick={() => setEditingClient(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                >
                  Edit
                </button>
              )}
            </div>

            {editingClient ? (
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Client Name</label>
                    <input
                      type="text"
                      value={clientData.client_name}
                      onChange={(e) => setClientData({ ...clientData, client_name: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Business Name</label>
                    <input
                      type="text"
                      value={clientData.business_name || ''}
                      onChange={(e) => setClientData({ ...clientData, business_name: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={clientData.email || ''}
                      onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={clientData.phone_number || ''}
                      onChange={(e) => setClientData({ ...clientData, phone_number: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Industry</label>
                    <input
                      type="text"
                      value={clientData.industry || ''}
                      onChange={(e) => setClientData({ ...clientData, industry: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Deal Value ($)</label>
                    <input
                      type="number"
                      value={clientData.deal_value || 0}
                      onChange={(e) => setClientData({ ...clientData, deal_value: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={clientData.address || ''}
                    onChange={(e) => setClientData({ ...clientData, address: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateClientData({
                      client_name: clientData.client_name,
                      business_name: clientData.business_name,
                      email: clientData.email,
                      phone_number: clientData.phone_number,
                      industry: clientData.industry,
                      address: clientData.address,
                      deal_value: clientData.deal_value
                    })}
                    className="flex-1 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setClientData(client);
                      setEditingClient(false);
                    }}
                    className="flex-1 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{clientData.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-900">{clientData.phone_number || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Industry</p>
                    <p className="font-semibold text-gray-900">{clientData.industry || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Deal Value</p>
                    <p className="font-semibold text-green-600">${clientData.deal_value?.toLocaleString() || '0'}</p>
                  </div>
                </div>
                {clientData.address && (
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-semibold text-gray-900">{clientData.address}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Change Status */}
          <div className="mb-6">
            <h4 className="text-xl font-black text-gray-900 mb-4">Change Status</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['lead', 'quote_sent', 'active', 'inactive'].map((status) => (
                <button
                  key={status}
                  onClick={() => changeClientStatus(status)}
                  disabled={clientData.status === status}
                  className={`py-2 rounded-lg font-bold capitalize transition ${
                    clientData.status === status
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : `bg-${getStatusColor(status)}-100 text-${getStatusColor(status)}-800 hover:bg-${getStatusColor(status)}-200`
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="mb-6">
            <h4 className="text-xl font-black text-gray-900 mb-4">Activity Timeline</h4>
            
            {/* Add Activity */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
              <h5 className="font-bold text-blue-900 mb-3">Add Activity</h5>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Activity Type</label>
                  <select
                    value={newActivity.type}
                    onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                  >
                    <option value="note">Note</option>
                    <option value="call">Call</option>
                    <option value="email">Email</option>
                    <option value="text">Text</option>
                    <option value="meeting">Meeting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Subject (Optional)</label>
                  <input
                    type="text"
                    value={newActivity.subject}
                    onChange={(e) => setNewActivity({ ...newActivity, subject: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                    placeholder="Quick summary..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={newActivity.notes}
                    onChange={(e) => setNewActivity({ ...newActivity, notes: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
                    placeholder="What happened..."
                  />
                </div>
                <button
                  onClick={addClientActivity}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                >
                  Add Activity
                </button>
              </div>
            </div>

            {/* Activity List */}
            {clientActivities.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No activities yet. Add one above!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {clientActivities.map((activity) => (
                  <div key={activity.id} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{getActivityIcon(activity.activity_type)}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <p className="font-bold text-gray-900 capitalize">
                              {activity.activity_type}
                              {activity.subject && `: ${activity.subject}`}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(activity.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{activity.notes}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="border-t-2 border-red-200 pt-6">
            <h4 className="text-xl font-black text-red-900 mb-4">Danger Zone</h4>
            <button
              onClick={deleteClient}
              className="w-full py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
            >
              Delete Client
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}