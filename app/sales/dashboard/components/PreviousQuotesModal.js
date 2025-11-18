import { useState } from 'react';

export default function PreviousQuotesModal({ isOpen, onClose, quotes, supabase, currentUser, onRefresh, onViewQuote, onEditQuote, onAcceptQuote }) {
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const deleteQuote = async (quoteId) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', quoteId);

      if (error) throw error;

      alert('✅ Quote deleted successfully!');
      setShowDeleteConfirm(null);
      onRefresh();
    } catch (error) {
      console.error('Error deleting quote:', error);
      alert('Failed to delete quote');
    }
  };

  const resendQuote = async (quote) => {
    const subject = encodeURIComponent(`Quote from Kinect B2B - ${quote.quote_number}`);
    const body = encodeURIComponent(
      `Dear ${quote.client_name},\n\n` +
      `Thank you for your interest in Kinect B2B services. Please find your personalized quote attached.\n\n` +
      `Quote Number: ${quote.quote_number}\n` +
      `Total Investment: $${quote.total_amount.toLocaleString()}\n\n` +
      `We look forward to working with you!\n\n` +
      `Best regards,\n${currentUser.username}\nKinect B2B`
    );
    
    window.location.href = `mailto:${quote.email}?subject=${subject}&body=${body}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex justify-between items-center">
          <h3 className="text-2xl font-black">📊 All Quotes</h3>
          <button
            onClick={onClose}
            className="text-3xl hover:bg-white/20 w-10 h-10 rounded-full transition"
          >
            ×
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-100px)] overflow-y-auto">
          {quotes.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">📋</span>
              <p className="text-gray-600 text-lg">No quotes yet. Create your first quote!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-black text-gray-900">Quote #</th>
                    <th className="px-4 py-3 text-left text-sm font-black text-gray-900">Client</th>
                    <th className="px-4 py-3 text-left text-sm font-black text-gray-900">Business</th>
                    <th className="px-4 py-3 text-left text-sm font-black text-gray-900">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-black text-gray-900">Total</th>
                    <th className="px-4 py-3 text-left text-sm font-black text-gray-900">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-black text-gray-900">Status</th>
                    <th className="px-4 py-3 text-center text-sm font-black text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((quote) => (
                    <tr key={quote.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        {quote.quote_number}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{quote.client_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{quote.business_name || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{quote.email}</td>
                      <td className="px-4 py-3 text-sm font-bold text-green-600">
                        ${quote.total_amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(quote.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          quote.status === 'sent' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : quote.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {quote.status || 'sent'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          <button
                            onClick={() => onViewQuote(quote)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700"
                            title="View Quote"
                          >
                            👁️ View
                          </button>
                          <button
                            onClick={() => onEditQuote(quote)}
                            className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700"
                            title="Edit Quote"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => onAcceptQuote(quote)}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700"
                            title="Accept Quote"
                          >
                            ✅ Accept
                          </button>
                          <button
                            onClick={() => resendQuote(quote)}
                            className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700"
                            title="Resend Quote"
                          >
                            📧 Resend
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(quote.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700"
                            title="Delete Quote"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-xl p-6 max-w-md mx-4">
              <h4 className="text-xl font-black text-red-900 mb-4">⚠️ Delete Quote?</h4>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this quote? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => deleteQuote(showDeleteConfirm)}
                  className="flex-1 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}