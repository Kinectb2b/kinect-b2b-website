'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zsjmqlsnvkbtdhjbtwkr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzam1xbHNudmtidGRoamJ0d2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMzcxOTYsImV4cCI6MjA3NzYxMzE5Nn0.vsbFj5m6pCaoVpHKpB3SZ2WzF4yRufOd27NlcEPhHGc'
);

export default function AffiliateAdminDashboard() {
  const [activeView, setActiveView] = useState('affiliates');
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAffiliate, setSelectedAffiliate] = useState(null);
  const [affiliateReferrals, setAffiliateReferrals] = useState([]);
  const [activeClients, setActiveClients] = useState([]);
  
  // Payout states
  const [pendingPayouts, setPendingPayouts] = useState([]);
  const [completedPayouts, setCompletedPayouts] = useState([]);
  const [unreadPayoutCount, setUnreadPayoutCount] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [processingPayout, setProcessingPayout] = useState(null);
  
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [activationData, setActivationData] = useState({
    proPlan: '',
    websitePackage: 'none',
    automationPackage: 'none',
    portalPackage: 'none'
  });

  const [showClientModal, setShowClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientPayments, setClientPayments] = useState([]);
  const [isEditingServices, setIsEditingServices] = useState(false);

  const [showClientPaymentHistory, setShowClientPaymentHistory] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showEditPaymentModal, setShowEditPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [newPayment, setNewPayment] = useState({
    serviceType: 'pro_plan',
    paymentNumber: 1,
    amount: 0
  });

 useEffect(() => {
    // Check admin authentication first
    const affiliateData = localStorage.getItem('affiliate');
    
    if (!affiliateData) {
      window.location.href = '/affiliate/admin/login';
      return;
    }

    try {
      const affiliate = JSON.parse(affiliateData);
      
      if (affiliate.role !== 'admin') {
        window.location.href = '/affiliate/login';
        return;
      }
    } catch (error) {
      window.location.href = '/affiliate/admin/login';
      return;
    }

    // If auth passes, fetch data
    fetchAllAffiliates();
    fetchPayouts();
  }, []);

  const handleLogout = () => {
  localStorage.removeItem('affiliate');
  window.location.href = '/affiliate/admin/login';
};

  const fetchAllAffiliates = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAffiliates(data || []);
    } catch (error) {
      console.error('Error fetching affiliates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayouts = async () => {
    try {
      const { data, error } = await supabase
        .from('payouts')
        .select(`
          *,
          affiliates (
            full_name,
            email,
            phone,
            payment_method,
            payment_data
          )
        `)
        .order('requested_at', { ascending: false });

      if (error) throw error;

      const pending = data?.filter(p => p.status === 'pending') || [];
      const completed = data?.filter(p => p.status === 'paid') || [];

      setPendingPayouts(pending);
      setCompletedPayouts(completed);
      setUnreadPayoutCount(pending.length);
    } catch (error) {
      console.error('Error fetching payouts:', error);
    }
  };

  const markAsPaid = async (payout) => {
  if (!confirm(`Mark $${payout.amount.toFixed(2)} payout to ${payout.affiliates.full_name} as PAID?`)) {
    return;
  }

  setProcessingPayout(payout.id);

  try {
    // Mark payout as paid
    const { error: payoutError } = await supabase
      .from('payouts')
      .update({ 
        status: 'paid',
        paid_at: new Date().toISOString()
      })
      .eq('id', payout.id);

    if (payoutError) throw payoutError;

    // IMPORTANT: Reduce the affiliate's pending_payout by the amount paid
    const { data: currentAffiliate, error: fetchError } = await supabase
      .from('affiliates')
      .select('pending_payout')
      .eq('id', payout.affiliate_id)
      .single();

    if (fetchError) throw fetchError;

    const newPendingPayout = Math.max(0, (currentAffiliate.pending_payout || 0) - payout.amount);

    const { error: affiliateError } = await supabase
      .from('affiliates')
      .update({ 
        pending_payout: newPendingPayout
      })
      .eq('id', payout.affiliate_id);

    if (affiliateError) throw affiliateError;

    // Mark admin notification as read
    const { error: notifError } = await supabase
      .from('admin_notifications')
      .update({ read: true })
      .eq('affiliate_id', payout.affiliate_id)
      .eq('amount', payout.amount)
      .eq('type', 'payout_request');

    if (notifError) throw notifError;

    // Send notification to affiliate
    await supabase
      .from('notifications')
      .insert([{
        affiliate_id: payout.affiliate_id,
        title: 'Payment Processed! 💰',
        message: `Your $${payout.amount.toFixed(2)} payout has been processed and sent!`,
        icon: '✅',
        read: false
      }]);

    alert('Payout marked as paid successfully!');
    fetchPayouts();
    fetchAllAffiliates();
  } catch (error) {
    console.error('Error marking payout as paid:', error);
    alert('Error processing payout. Please try again.');
  } finally {
    setProcessingPayout(null);
  }
};

  const getPaymentDetails = (payout) => {
    try {
      const paymentData = JSON.parse(payout.affiliates.payment_data || '{}');
      const method = payout.payment_method || payout.affiliates.payment_method;

      switch(method) {
        case 'ach':
          return `ACH: ****${paymentData.accountNumber?.slice(-4) || 'N/A'}`;
        case 'zelle':
          return `Zelle: ${paymentData.zelleContact || 'N/A'}`;
        case 'cashapp':
          return `Cash App: ${paymentData.cashTag || 'N/A'}`;
        case 'paypal':
          return `PayPal: ${paymentData.paypalContact || 'N/A'}`;
        case 'venmo':
          return `Venmo: ${paymentData.venmoUsername || 'N/A'}`;
        case 'applepay':
          return `Apple Pay: ${paymentData.applePayContact || 'N/A'}`;
        default:
          return 'Payment info not available';
      }
    } catch (e) {
      return 'Payment info error';
    }
  };

  const fetchAffiliateReferrals = async (affiliateId) => {
    try {
      const { data: pendingData, error: pendingError } = await supabase
        .from('referrals')
        .select('*')
        .eq('affiliate_id', affiliateId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (pendingError) throw pendingError;
      setAffiliateReferrals(pendingData || []);

      const { data: activeData, error: activeError } = await supabase
        .from('referrals')
        .select('*')
        .eq('affiliate_id', affiliateId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (activeError) throw activeError;
      setActiveClients(activeData || []);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      setAffiliateReferrals([]);
      setActiveClients([]);
    }
  };

  const autoRecalculateCommissions = async (clientId, affiliateId) => {
  try {
    // Calculate client's commission
    const { data: clientPaidPayments, error: clientError } = await supabase
      .from('client_payments')
      .select('amount')
      .eq('referral_id', clientId)
      .eq('status', 'paid');

    if (clientError) throw clientError;

    const clientTotal = clientPaidPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

    await supabase
      .from('referrals')
      .update({ commission_earned: clientTotal })
      .eq('id', clientId);

    // Calculate affiliate's total earned
    const { data: affiliatePaidPayments, error: affiliateError } = await supabase
      .from('client_payments')
      .select('amount')
      .eq('affiliate_id', affiliateId)
      .eq('status', 'paid');

    if (affiliateError) throw affiliateError;

    const affiliateTotal = affiliatePaidPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

    // Calculate total payouts already paid to affiliate
    const { data: paidPayouts, error: payoutsError } = await supabase
      .from('payouts')
      .select('amount')
      .eq('affiliate_id', affiliateId)
      .eq('status', 'paid');

    if (payoutsError) throw payoutsError;

    const totalPaidOut = paidPayouts.reduce((sum, p) => sum + parseFloat(p.amount), 0);

    // Pending payout = total earned - total already paid out
    const pendingPayout = Math.max(0, affiliateTotal - totalPaidOut);

    // Update affiliate's totals
    await supabase
      .from('affiliates')
      .update({ 
        total_earned: affiliateTotal,
        pending_payout: pendingPayout
      })
      .eq('id', affiliateId);

    // Refresh all displays
    await fetchAffiliateReferrals(affiliateId);
    await fetchAllAffiliates();
    
    // Refresh client data if we're viewing a client
    if (selectedClient && selectedClient.id === clientId) {
      const { data: updatedClient } = await supabase
        .from('referrals')
        .select('*')
        .eq('id', clientId)
        .single();
      setSelectedClient(updatedClient);
    }
  } catch (error) {
    console.error('Error auto-recalculating:', error);
  }
};
  const fetchClientPayments = async (referralId) => {
    try {
      const { data, error } = await supabase
        .from('client_payments')
        .select('*')
        .eq('referral_id', referralId)
        .order('payment_number', { ascending: true });

      if (error) throw error;
      setClientPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setClientPayments([]);
    }
  };

  const handleAddPayment = async () => {
    if (!selectedClient || !newPayment.amount) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('client_payments')
        .insert([{
          referral_id: selectedClient.id,
          affiliate_id: selectedClient.affiliate_id,
          service_type: newPayment.serviceType,
          payment_number: newPayment.paymentNumber,
          amount: parseFloat(newPayment.amount),
          status: 'pending'
        }]);

      if (error) throw error;

      await autoRecalculateCommissions(selectedClient.id, selectedClient.affiliate_id);

      alert('Payment added successfully!');
      setShowAddPaymentModal(false);
      setNewPayment({
        serviceType: 'pro_plan',
        paymentNumber: 1,
        amount: 0
      });
      await fetchClientPayments(selectedClient.id);
      setShowClientPaymentHistory(true);
    } catch (error) {
      console.error('Error adding payment:', error);
      alert('Error adding payment. Please try again.');
    }
  };

  const handleUpdatePayment = async () => {
    if (!selectedPayment || !selectedPayment.amount) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const { error } = await supabase
        .from('client_payments')
        .update({
          amount: parseFloat(selectedPayment.amount),
          service_type: selectedPayment.service_type,
          payment_number: selectedPayment.payment_number
        })
        .eq('id', selectedPayment.id);

      if (error) throw error;

      await autoRecalculateCommissions(selectedClient.id, selectedClient.affiliate_id);

      alert('Payment updated successfully!');
      setShowEditPaymentModal(false);
      setSelectedPayment(null);
      await fetchClientPayments(selectedClient.id);
      setShowClientPaymentHistory(true);
    } catch (error) {
      console.error('Error updating payment:', error);
      alert('Error updating payment. Please try again.');
    }
  };

  const handleDeletePayment = async (paymentId) => {
    if (!confirm('Are you sure you want to delete this payment?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('client_payments')
        .delete()
        .eq('id', paymentId);

      if (error) throw error;

      await autoRecalculateCommissions(selectedClient.id, selectedClient.affiliate_id);

      alert('Payment deleted successfully!');
      await fetchClientPayments(selectedClient.id);
    } catch (error) {
      console.error('Error deleting payment:', error);
      alert('Error deleting payment. Please try again.');
    }
  };

  const calculateServicePrice = (serviceType, serviceName) => {
    const proPlanPrices = {
      'pro-100': 250, 'pro-200': 425, 'pro-300': 550, 'pro-400': 675,
      'pro-500': 800, 'pro-600': 1000, 'pro-700': 1125, 'pro-800': 1225,
      'pro-900': 1300, 'pro-1000': 1375, 'pro-1100': 1450, 'pro-1200': 1500
    };
    const websitePrices = { 'website-starter': 500, 'website-professional': 1500, 'website-premium': 3500 };
    const automationPrices = { 'automation-starter': 500, 'automation-professional': 1500, 'automation-enterprise': 3500 };
    const portalPrices = { 'portal-starter': 750, 'portal-professional': 2000, 'portal-enterprise': 4000 };

    if (serviceType === 'pro_plan') return proPlanPrices[serviceName] || 0;
    if (serviceType === 'website') return websitePrices[serviceName] || 0;
    if (serviceType === 'automation') return automationPrices[serviceName] || 0;
    if (serviceType === 'portal') return portalPrices[serviceName] || 0;
    return 0;
  };

  const createPaymentSchedule = async (referralId, affiliateId, services) => {
    const payments = [];

    if (services.proPlan && services.proPlan !== 'none' && services.proPlan !== '') {
      const monthlyPrice = calculateServicePrice('pro_plan', services.proPlan);
      const monthlyCommission = (monthlyPrice * 0.10).toFixed(2);
      
      for (let i = 1; i <= 12; i++) {
        payments.push({
          referral_id: referralId,
          affiliate_id: affiliateId,
          service_type: 'pro_plan',
          payment_number: i,
          amount: parseFloat(monthlyCommission),
          status: 'pending'
        });
      }
    }

    if (services.websitePackage && services.websitePackage !== 'none') {
      const price = calculateServicePrice('website', services.websitePackage);
      const commission = (price * 0.10).toFixed(2);
      payments.push({
        referral_id: referralId,
        affiliate_id: affiliateId,
        service_type: 'website',
        payment_number: 1,
        amount: parseFloat(commission),
        status: 'pending'
      });
    }

    if (services.automationPackage && services.automationPackage !== 'none') {
      const price = calculateServicePrice('automation', services.automationPackage);
      const commission = (price * 0.10).toFixed(2);
      payments.push({
        referral_id: referralId,
        affiliate_id: affiliateId,
        service_type: 'automation',
        payment_number: 1,
        amount: parseFloat(commission),
        status: 'pending'
      });
    }

    if (services.portalPackage && services.portalPackage !== 'none') {
      const price = calculateServicePrice('portal', services.portalPackage);
      const commission = (price * 0.10).toFixed(2);
      payments.push({
        referral_id: referralId,
        affiliate_id: affiliateId,
        service_type: 'portal',
        payment_number: 1,
        amount: parseFloat(commission),
        status: 'pending'
      });
    }

    if (payments.length > 0) {
      const { error } = await supabase
        .from('client_payments')
        .insert(payments);

      if (error) throw error;
    }
  };

  const activateClient = async () => {
    if (!activationData.proPlan && activationData.websitePackage === 'none' && 
        activationData.automationPackage === 'none' && activationData.portalPackage === 'none') {
      alert('Please select at least one service');
      return;
    }

    try {
      let monthlyValue = 0;
      if (activationData.proPlan && activationData.proPlan !== 'none') {
        monthlyValue = calculateServicePrice('pro_plan', activationData.proPlan);
      }

      const { error: updateError } = await supabase
        .from('referrals')
        .update({
          status: 'active',
          pro_plan: activationData.proPlan || null,
          website_package: activationData.websitePackage,
          automation_package: activationData.automationPackage,
          portal_package: activationData.portalPackage,
          monthly_value: monthlyValue
        })
        .eq('id', selectedReferral.id);

      if (updateError) throw updateError;

      await createPaymentSchedule(
        selectedReferral.id, 
        selectedReferral.affiliate_id,
        activationData
      );

      const { error: affiliateError } = await supabase
        .from('affiliates')
        .update({ 
          active_clients: (selectedAffiliate.active_clients || 0) + 1 
        })
        .eq('id', selectedReferral.affiliate_id);

      if (affiliateError) throw affiliateError;

      await supabase
        .from('notifications')
        .insert([{
          affiliate_id: selectedReferral.affiliate_id,
          title: 'New Active Client! 🎉',
          message: `${selectedReferral.client_name} is now an active client!`,
          icon: '✅',
          read: false
        }]);

      alert('Client activated successfully!');
      setShowActivateModal(false);
      setActivationData({
        proPlan: '',
        websitePackage: 'none',
        automationPackage: 'none',
        portalPackage: 'none'
      });
      
      fetchAffiliateReferrals(selectedReferral.affiliate_id);
      fetchAllAffiliates();
    } catch (error) {
      console.error('Error activating client:', error);
      alert('Error activating client. Please try again.');
    }
  };

  const markPaymentSent = async (payment) => {
    try {
      const { error: paymentError } = await supabase
        .from('client_payments')
        .update({
          status: 'paid',
          sent_date: new Date().toISOString()
        })
        .eq('id', payment.id);

      if (paymentError) throw paymentError;

      await autoRecalculateCommissions(payment.referral_id, payment.affiliate_id);

      await supabase
        .from('notifications')
        .insert([{
          affiliate_id: payment.affiliate_id,
          title: 'Payment Sent! 💰',
          message: `Your $${payment.amount.toFixed(2)} commission payment is on the way!`,
          icon: '💸',
          read: false
        }]);

      alert('Payment marked as sent!');
      await fetchClientPayments(payment.referral_id);
    } catch (error) {
      console.error('Error marking payment:', error);
      alert('Error marking payment. Please try again.');
    }
  };

  const markClientInactive = async (client) => {
    if (!confirm(`Are you sure you want to mark ${client.client_name} as inactive?`)) {
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from('referrals')
        .update({ status: 'inactive' })
        .eq('id', client.id);

      if (updateError) throw updateError;

      const { error: affiliateError } = await supabase
        .from('affiliates')
        .update({ 
          active_clients: Math.max(0, (selectedAffiliate.active_clients || 0) - 1)
        })
        .eq('id', client.affiliate_id);

      if (affiliateError) throw affiliateError;

      alert('Client marked as inactive');
      setShowClientModal(false);
      fetchAffiliateReferrals(client.affiliate_id);
      fetchAllAffiliates();
    } catch (error) {
      console.error('Error marking client inactive:', error);
      alert('Error updating client. Please try again.');
    }
  };

  const updateClientServices = async () => {
    try {
      let monthlyValue = 0;
      if (activationData.proPlan && activationData.proPlan !== 'none') {
        monthlyValue = calculateServicePrice('pro_plan', activationData.proPlan);
      }

      const { error: updateError } = await supabase
        .from('referrals')
        .update({
          pro_plan: activationData.proPlan || null,
          website_package: activationData.websitePackage,
          automation_package: activationData.automationPackage,
          portal_package: activationData.portalPackage,
          monthly_value: monthlyValue
        })
        .eq('id', selectedClient.id);

      if (updateError) throw updateError;

      await supabase
        .from('client_payments')
        .delete()
        .eq('referral_id', selectedClient.id);

      await createPaymentSchedule(
        selectedClient.id,
        selectedClient.affiliate_id,
        activationData
      );

      alert('Services updated successfully!');
      setIsEditingServices(false);
      fetchClientPayments(selectedClient.id);
      
      const { data: updatedClient } = await supabase
        .from('referrals')
        .select('*')
        .eq('id', selectedClient.id)
        .single();
      
      setSelectedClient(updatedClient);
    } catch (error) {
      console.error('Error updating services:', error);
      alert('Error updating services. Please try again.');
    }
  };

  const handleViewDetails = async (affiliate) => {
    setSelectedAffiliate(affiliate);
    await fetchAffiliateReferrals(affiliate.id);
  };

  const handleBackToList = () => {
    setSelectedAffiliate(null);
    setAffiliateReferrals([]);
    setActiveClients([]);
  };

  const handleViewClient = async (client) => {
    setSelectedClient(client);
    setActivationData({
      proPlan: client.pro_plan || '',
      websitePackage: client.website_package || 'none',
      automationPackage: client.automation_package || 'none',
      portalPackage: client.portal_package || 'none'
    });
    await fetchClientPayments(client.id);
    setShowClientModal(true);
  };

  const getServiceLabel = (serviceType, serviceValue) => {
    if (!serviceValue || serviceValue === 'none') return null;

    const labels = {
      'pro-100': 'Pro 100 - $250/mo',
      'pro-200': 'Pro 200 - $425/mo',
      'pro-300': 'Pro 300 - $550/mo',
      'pro-400': 'Pro 400 - $675/mo',
      'pro-500': 'Pro 500 - $800/mo',
      'pro-600': 'Pro 600 - $1,000/mo',
      'pro-700': 'Pro 700 - $1,125/mo',
      'pro-800': 'Pro 800 - $1,225/mo',
      'pro-900': 'Pro 900 - $1,300/mo',
      'pro-1000': 'Pro 1000 - $1,375/mo',
      'pro-1100': 'Pro 1100 - $1,450/mo',
      'pro-1200': 'Pro 1200 - $1,500/mo',
      'website-starter': 'Starter Website - $500',
      'website-professional': 'Professional Website - $1,500',
      'website-premium': 'Premium Website - $3,500',
      'automation-starter': 'Starter Automation - $500',
      'automation-professional': 'Professional Automation - $1,500',
      'automation-enterprise': 'Enterprise Automation - $3,500',
      'portal-starter': 'Starter Portal - $750',
      'portal-professional': 'Professional Portal - $2,000',
      'portal-enterprise': 'Enterprise Portal - $4,000'
    };

    return labels[serviceValue] || serviceValue;
  };

  const getTotalPaidForClient = () => {
    return clientPayments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  // Add Payment Modal
  if (showAddPaymentModal && selectedClient) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-lg w-full">
          <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">Add Manual Payment</h2>
          <p className="text-gray-600 mb-6">For {selectedClient.client_name}</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Service Type</label>
              <select
                value={newPayment.serviceType}
                onChange={(e) => setNewPayment({...newPayment, serviceType: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
              >
                <option value="pro_plan">Pro Plan</option>
                <option value="website">Website</option>
                <option value="automation">Automation</option>
                <option value="portal">Portal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Number</label>
              <input
                type="number"
                min="1"
                value={newPayment.paymentNumber}
                onChange={(e) => setNewPayment({...newPayment, paymentNumber: parseInt(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={newPayment.amount}
                onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleAddPayment}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all"
            >
              Add Payment
            </button>
            <button
              onClick={() => {
                setShowAddPaymentModal(false);
                setNewPayment({
                  serviceType: 'pro_plan',
                  paymentNumber: 1,
                  amount: 0
                });
                setShowClientPaymentHistory(true);
              }}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Edit Payment Modal
  if (showEditPaymentModal && selectedPayment) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-lg w-full">
          <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-6">Edit Payment</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Service Type</label>
              <select
                value={selectedPayment.service_type}
                onChange={(e) => setSelectedPayment({...selectedPayment, service_type: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
              >
                <option value="pro_plan">Pro Plan</option>
                <option value="website">Website</option>
                <option value="automation">Automation</option>
                <option value="portal">Portal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Number</label>
              <input
                type="number"
                min="1"
                value={selectedPayment.payment_number}
                onChange={(e) => setSelectedPayment({...selectedPayment, payment_number: parseInt(e.target.value)})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={selectedPayment.amount}
                onChange={(e) => setSelectedPayment({...selectedPayment, amount: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <div className="px-4 py-3 bg-gray-100 rounded-xl">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  selectedPayment.status === 'paid' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {selectedPayment.status === 'paid' ? '✓ Paid' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleUpdatePayment}
              className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setShowEditPaymentModal(false);
                setSelectedPayment(null);
                setShowClientPaymentHistory(true);
              }}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Client Detail Modal
  if (showClientModal && selectedClient) {
    const nextPendingPayment = clientPayments.find(p => p.status === 'pending');
    const paidPayments = clientPayments.filter(p => p.status === 'paid');
    const totalPayments = clientPayments.length;

    const serviceLabels = {
      'pro_plan': '📊 Pro Plan',
      'website': '🌐 Website',
      'automation': '⚡ Automation',
      'portal': '🚪 Portal'
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg md:text-2xl font-bold text-gray-800">{selectedClient.client_name}</h2>
              <p className="text-gray-600 text-sm">{selectedClient.business_name}</p>
              <p className="text-xs text-gray-500">{selectedClient.email} • {selectedClient.phone}</p>
            </div>
            <button
              onClick={() => {
                setShowClientModal(false);
                setIsEditingServices(false);
                setShowClientPaymentHistory(false);
              }}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>

          {!isEditingServices ? (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 mb-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1 flex-1">
                  {selectedClient.pro_plan && selectedClient.pro_plan !== 'none' && (
                    <div className="text-sm">📊 {getServiceLabel('pro_plan', selectedClient.pro_plan)}</div>
                  )}
                  {selectedClient.website_package && selectedClient.website_package !== 'none' && (
                    <div className="text-sm">🌐 {getServiceLabel('website', selectedClient.website_package)}</div>
                  )}
                  {selectedClient.automation_package && selectedClient.automation_package !== 'none' && (
                    <div className="text-sm">⚡ {getServiceLabel('automation', selectedClient.automation_package)}</div>
                  )}
                  {selectedClient.portal_package && selectedClient.portal_package !== 'none' && (
                    <div className="text-sm">🚪 {getServiceLabel('portal', selectedClient.portal_package)}</div>
                  )}
                </div>
                <button
                  onClick={() => setIsEditingServices(true)}
                  className="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition-all text-sm"
                >
                  Modify
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 mb-4">
              <h3 className="font-bold text-gray-800 mb-3">Modify Services</h3>
              <div className="space-y-3">
                <select
                  value={activationData.proPlan}
                  onChange={(e) => setActivationData({...activationData, proPlan: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">No Pro Plan</option>
                  <option value="pro-100">Pro 100 - $250/mo</option>
                  <option value="pro-200">Pro 200 - $425/mo</option>
                  <option value="pro-300">Pro 300 - $550/mo</option>
                  <option value="pro-400">Pro 400 - $675/mo</option>
                  <option value="pro-500">Pro 500 - $800/mo</option>
                  <option value="pro-600">Pro 600 - $1,000/mo</option>
                  <option value="pro-700">Pro 700 - $1,125/mo</option>
                  <option value="pro-800">Pro 800 - $1,225/mo</option>
                  <option value="pro-900">Pro 900 - $1,300/mo</option>
                  <option value="pro-1000">Pro 1000 - $1,375/mo</option>
                  <option value="pro-1100">Pro 1100 - $1,450/mo</option>
                  <option value="pro-1200">Pro 1200 - $1,500/mo</option>
                </select>

                <select
                  value={activationData.websitePackage}
                  onChange={(e) => setActivationData({...activationData, websitePackage: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="none">No Website</option>
                  <option value="website-starter">Starter - $500</option>
                  <option value="website-professional">Professional - $1,500</option>
                  <option value="website-premium">Premium - $3,500</option>
                </select>

                <select
                  value={activationData.automationPackage}
                  onChange={(e) => setActivationData({...activationData, automationPackage: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="none">No Automation</option>
                  <option value="automation-starter">Starter - $500</option>
                  <option value="automation-professional">Professional - $1,500</option>
                  <option value="automation-enterprise">Enterprise - $3,500</option>
                </select>

                <select
                  value={activationData.portalPackage}
                  onChange={(e) => setActivationData({...activationData, portalPackage: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="none">No Portal</option>
                  <option value="portal-starter">Starter - $750</option>
                  <option value="portal-professional">Professional - $2,000</option>
                  <option value="portal-enterprise">Enterprise - $4,000</option>
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={updateClientServices}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all text-sm font-semibold"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingServices(false);
                      setActivationData({
                        proPlan: selectedClient.pro_plan || '',
                        websitePackage: selectedClient.website_package || 'none',
                        automationPackage: selectedClient.automation_package || 'none',
                        portalPackage: selectedClient.portal_package || 'none'
                      });
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all text-sm font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mb-4">
            <button
              onClick={() => setShowClientPaymentHistory(!showClientPaymentHistory)}
              className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all"
            >
              {showClientPaymentHistory ? '📊 Show Next Payment' : '📜 View Full Payment History'}
            </button>
          </div>

          {!showClientPaymentHistory ? (
            <>
              {nextPendingPayment ? (
                <div className="bg-white border-2 border-purple-200 rounded-2xl p-6 mb-4">
                  <div className="text-center mb-4">
                    <div className="text-xs md:text-sm text-gray-500 mb-1">Next Payment</div>
                    <div className="text-2xl md:text-3xl font-bold text-purple-600">
                      {serviceLabels[nextPendingPayment.service_type]}
                    </div>
                    <div className="text-lg text-gray-700 mt-1">
                      {nextPendingPayment.service_type === 'pro_plan' 
                        ? `Payment ${nextPendingPayment.payment_number}/12` 
                        : 'One-time Payment'}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Commission Amount:</span>
                      <span className="text-2xl font-bold text-purple-600">${nextPendingPayment.amount.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => markPaymentSent(nextPendingPayment)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    Mark Payment as Sent
                  </button>
                </div>
              ) : (
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-4 text-center">
                  <div className="text-3xl mb-2">✅</div>
                  <div className="font-bold text-green-700">All Payments Complete!</div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Payment History</h3>
                  <button
                    onClick={() => {
                      setShowClientPaymentHistory(false);
                      setShowAddPaymentModal(true);
                    }}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-all text-sm"
                  >
                    + Add
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {clientPayments.map((payment) => (
                    <div key={payment.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold text-sm text-gray-800">
                            {serviceLabels[payment.service_type]} 
                            {payment.service_type === 'pro_plan' ? ` ${payment.payment_number}/12` : ''}
                          </div>
                          <div className="text-lg font-bold text-purple-600">
                            ${payment.amount.toFixed(2)}
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          payment.status === 'paid' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {payment.status === 'paid' ? '✓ Paid' : 'Pending'}
                        </span>
                      </div>
                      {payment.status === 'paid' && payment.sent_date && (
                        <div className="text-xs text-gray-500 mb-2">
                          Sent: {new Date(payment.sent_date).toLocaleDateString()}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowClientPaymentHistory(false);
                            setShowEditPaymentModal(true);
                          }}
                          className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePayment(payment.id)}
                          className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {(() => {
                  const calculatedTotal = clientPayments
                    .filter(p => p.status === 'paid')
                    .reduce((sum, p) => sum + parseFloat(p.amount), 0);
                  const clientTotal = selectedClient.commission_earned || 0;
                  const mismatch = Math.abs(calculatedTotal - clientTotal) > 0.01;
                  
                  return mismatch ? (
                    <div className="mt-3 bg-yellow-100 border border-yellow-400 rounded-lg p-3">
                      <div className="text-sm font-semibold text-yellow-800">⚠️ Mismatch Detected</div>
                      <div className="text-xs text-yellow-700">
                        Payments: ${calculatedTotal.toFixed(2)} • Client shows: ${clientTotal.toFixed(2)}
                      </div>
                      <div className="text-xs text-yellow-600 mt-1">Auto-recalculating on next payment action...</div>
                    </div>
                  ) : null;
                })()}
              </div>
            </>
          )}

          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-4 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm opacity-90">Total Paid to Affiliate</div>
                <div className="text-2xl font-bold">${getTotalPaidForClient().toFixed(2)}</div>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">Progress</div>
                <div className="text-2xl font-bold">{paidPayments.length}/{totalPayments}</div>
              </div>
            </div>
            <div className="mt-3 bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all"
                style={{ width: `${(paidPayments.length / totalPayments) * 100}%` }}
              ></div>
            </div>
          </div>

          <button
            onClick={() => markClientInactive(selectedClient)}
            className="w-full bg-red-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-red-700 transition-all"
          >
            Mark Client as Inactive
          </button>
        </div>
      </div>
    );
  }

  // Activate Client Modal
  if (showActivateModal && selectedReferral) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-2xl w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Activate Client</h2>
          <p className="text-gray-600 mb-6">{selectedReferral.client_name} - {selectedReferral.business_name}</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Pro Plan</label>
              <select
                value={activationData.proPlan}
                onChange={(e) => setActivationData({...activationData, proPlan: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
              >
                <option value="">Select a Pro Plan (Optional)</option>
                <option value="pro-100">Pro 100 - $250/month</option>
                <option value="pro-200">Pro 200 - $425/month</option>
                <option value="pro-300">Pro 300 - $550/month</option>
                <option value="pro-400">Pro 400 - $675/month</option>
                <option value="pro-500">Pro 500 - $800/month</option>
                <option value="pro-600">Pro 600 - $1,000/month</option>
                <option value="pro-700">Pro 700 - $1,125/month</option>
                <option value="pro-800">Pro 800 - $1,225/month</option>
                <option value="pro-900">Pro 900 - $1,300/month</option>
                <option value="pro-1000">Pro 1000 - $1,375/month</option>
                <option value="pro-1100">Pro 1100 - $1,450/month</option>
                <option value="pro-1200">Pro 1200 - $1,500/month</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Website Package (Optional)</label>
              <select
                value={activationData.websitePackage}
                onChange={(e) => setActivationData({...activationData, websitePackage: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
              >
                <option value="none">No Website Package</option>
                <option value="website-starter">Starter Website - $500</option>
                <option value="website-professional">Professional Website - $1,500</option>
                <option value="website-premium">Premium Website - $3,500</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Automation Package (Optional)</label>
              <select
                value={activationData.automationPackage}
                onChange={(e) => setActivationData({...activationData, automationPackage: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
              >
                <option value="none">No Automation Package</option>
                <option value="automation-starter">Starter Automation - $500</option>
                <option value="automation-professional">Professional Automation - $1,500</option>
                <option value="automation-enterprise">Enterprise Automation - $3,500</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Portal Package (Optional)</label>
              <select
                value={activationData.portalPackage}
                onChange={(e) => setActivationData({...activationData, portalPackage: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
              >
                <option value="none">No Portal Package</option>
                <option value="portal-starter">Starter Portal - $750</option>
                <option value="portal-professional">Professional Portal - $2,000</option>
                <option value="portal-enterprise">Enterprise Portal - $4,000</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={activateClient}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Activate Client
            </button>
            <button
              onClick={() => {
                setShowActivateModal(false);
                setActivationData({
                  proPlan: '',
                  websitePackage: 'none',
                  automationPackage: 'none',
                  portalPackage: 'none'
                });
              }}
              className="flex-1 bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Detailed Affiliate View
  if (selectedAffiliate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={handleBackToList}
              className="mb-4 bg-white text-purple-600 px-4 py-2 rounded-xl font-semibold hover:bg-purple-50 transition-all"
            >
              ← Back to All Affiliates
            </button>
            <h1 className="text-3xl font-bold">Affiliate Details</h1>
            <p className="text-purple-100">Viewing {selectedAffiliate.full_name}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {selectedAffiliate.full_name.charAt(0)}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-800">{selectedAffiliate.full_name}</h2>
                <p className="text-gray-600">{selectedAffiliate.email}</p>
                <p className="text-sm text-gray-500">Referral Code: {selectedAffiliate.referral_code}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                selectedAffiliate.status === 'active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {selectedAffiliate.status.charAt(0).toUpperCase() + selectedAffiliate.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                <div className="text-sm text-gray-600 mb-1">Total Referrals</div>
                <div className="text-2xl md:text-3xl font-bold text-purple-600">{selectedAffiliate.total_referrals || 0}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                <div className="text-sm text-gray-600 mb-1">Active Clients</div>
                <div className="text-2xl md:text-3xl font-bold text-green-600">{selectedAffiliate.active_clients || 0}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                <div className="text-sm text-gray-600 mb-1">Total Earned</div>
                <div className="text-2xl md:text-3xl font-bold text-purple-600">${selectedAffiliate.total_earned?.toFixed(2) || '0.00'}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                <div className="text-sm text-gray-600 mb-1">Pending Payout</div>
                <div className="text-2xl md:text-3xl font-bold text-orange-600">${selectedAffiliate.pending_payout?.toFixed(2) || '0.00'}</div>
              </div>
            </div>
          </div>

          {activeClients.length > 0 && (
            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl">
              <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-6">Active Clients</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeClients.map((client) => (
                  <div key={client.id} className="border border-green-200 bg-green-50 rounded-2xl p-6 hover:shadow-lg transition-all">
                    <h4 className="text-lg font-bold text-gray-800 mb-2">{client.client_name}</h4>
                    <p className="text-sm text-gray-600 mb-1">{client.business_name}</p>
                    <p className="text-sm text-gray-500 mb-4">{client.email}</p>
                    <div className="space-y-1 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Value:</span>
                        <span className="font-bold text-green-600">${client.monthly_value?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Commission Earned:</span>
                        <span className="font-bold text-purple-600">${client.commission_earned?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewClient(client)}
                      className="w-full bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700 transition-all"
                    >
                      View Client
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl">
            <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-6">Pending Referrals</h3>
            
            {affiliateReferrals.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No pending referrals.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="overflow-x-auto"><table className="w-full min-w-[640px]">
                  <thead className="bg-purple-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Client Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Company</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Signup Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {affiliateReferrals.map((referral) => (
                      <tr key={referral.id} className="hover:bg-purple-50 transition-all">
                        <td className="px-6 py-4 text-gray-800 font-medium">{referral.client_name}</td>
                        <td className="px-6 py-4 text-gray-600">{referral.business_name}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">{referral.email}</div>
                          <div className="text-sm text-gray-500">{referral.phone}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(referral.signup_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedReferral(referral);
                              setShowActivateModal(true);
                            }}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all font-semibold"
                          >
                            Activate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table></div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // All Affiliates List View
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <Image
                src="/logo.png"
                alt="Kinect B2B"
                width={40}
                height={40}
                className="w-8 h-8 md:w-10 md:h-10"
              />
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-purple-600">Kinect B2B Admin</h1>
                <p className="text-xs md:text-sm text-gray-600 hidden sm:block">Affiliate Management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 text-gray-600 hover:text-purple-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={handleLogout}
                className="hidden md:block bg-red-500 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-red-600 transition-all text-sm md:text-base"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {showMobileMenu && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setActiveView('affiliates');
                  setShowMobileMenu(false);
                }}
                className={`px-4 py-3 rounded-lg font-semibold text-left transition-all ${
                  activeView === 'affiliates'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Affiliates
              </button>
              <button
                onClick={() => {
                  setActiveView('payouts');
                  setShowMobileMenu(false);
                }}
                className={`px-4 py-3 rounded-lg font-semibold text-left transition-all relative ${
                  activeView === 'payouts'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Payouts
                {unreadPayoutCount > 0 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {unreadPayoutCount}
                  </span>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      )}

      <div className="hidden lg:block bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-3">
            <button
              onClick={() => setActiveView('affiliates')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                activeView === 'affiliates'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Affiliates
            </button>
            <button
              onClick={() => setActiveView('payouts')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all relative ${
                activeView === 'payouts'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Payouts
              {unreadPayoutCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {unreadPayoutCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {activeView === 'affiliates' ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl">
                <div className="text-xs md:text-sm text-gray-500 mb-1">Total Affiliates</div>
                <div className="text-2xl md:text-3xl font-bold text-purple-600">{affiliates.length}</div>
              </div>
              <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl">
                <div className="text-xs md:text-sm text-gray-500 mb-1">Active Clients</div>
                <div className="text-2xl md:text-3xl font-bold text-green-600">
                  {affiliates.reduce((sum, a) => sum + (a.active_clients || 0), 0)}
                </div>
              </div>
              <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl">
                <div className="text-xs md:text-sm text-gray-500 mb-1">Total Commissions Paid</div>
                <div className="text-2xl md:text-3xl font-bold text-purple-600">
                  ${affiliates.reduce((sum, a) => sum + (parseFloat(a.total_earned) || 0), 0).toFixed(2)}
                </div>
              </div>
              <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl">
                <div className="text-xs md:text-sm text-gray-500 mb-1">Pending Payouts</div>
                <div className="text-2xl md:text-3xl font-bold text-orange-600">
                  ${affiliates.reduce((sum, a) => sum + (parseFloat(a.pending_payout) || 0), 0).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl">
              <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-6">All Affiliates</h2>

              {affiliates.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">No affiliates found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {affiliates.map((affiliate) => (
                    <div key={affiliate.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                          {affiliate.full_name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800">{affiliate.full_name}</h3>
                          <p className="text-sm text-gray-600">{affiliate.email}</p>
                          <p className="text-xs text-gray-500">
                            Joined {new Date(affiliate.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Referrals:</span>
                          <span className="font-bold text-purple-600">{affiliate.total_referrals || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Active Clients:</span>
                          <span className="font-bold text-green-600">{affiliate.active_clients || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Earned:</span>
                          <span className="font-bold text-purple-600">${affiliate.total_earned?.toFixed(2) || '0.00'}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleViewDetails(affiliate)}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {unreadPayoutCount > 0 && (
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🔔</span>
                  <div>
                    <p className="font-bold text-yellow-900">
                      {unreadPayoutCount} New Payout Request{unreadPayoutCount !== 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-yellow-700">Review and process pending payouts below</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-sm text-gray-500 mb-2">Pending Payouts</div>
                <div className="text-2xl md:text-3xl font-bold text-orange-600">{pendingPayouts.length}</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-sm text-gray-500 mb-2">Total Pending Amount</div>
                <div className="text-2xl md:text-3xl font-bold text-orange-600">
                  ${pendingPayouts.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-sm text-gray-500 mb-2">Completed This Month</div>
                <div className="text-2xl md:text-3xl font-bold text-green-600">{completedPayouts.length}</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-6">Pending Payout Requests</h2>
              
              {pendingPayouts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">No pending payout requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingPayouts.map((payout) => (
                    <div key={payout.id} className="border-2 border-orange-200 rounded-xl p-6 bg-orange-50">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {payout.affiliates.full_name}
                          </h3>
                          <p className="text-sm text-gray-600">{payout.affiliates.email}</p>
                          {payout.affiliates.phone && (
                            <p className="text-sm text-gray-600">{payout.affiliates.phone}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl md:text-3xl font-bold text-orange-600">
                            ${payout.amount.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-600">
                            Requested {new Date(payout.requested_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Payment Details:</p>
                        <p className="text-gray-800">{getPaymentDetails(payout)}</p>
                      </div>

                      <button
                        onClick={() => markAsPaid(payout)}
                        disabled={processingPayout === payout.id}
                        className={`w-full py-3 rounded-xl font-semibold transition-all ${
                          processingPayout === payout.id
                            ? 'bg-gray-400 cursor-not-allowed text-white'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {processingPayout === payout.id ? 'Processing...' : '✓ Mark as Paid'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-6">Completed Payouts</h2>
              
              {completedPayouts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">No completed payouts yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="overflow-x-auto"><table className="w-full min-w-[640px]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Affiliate</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Payment Method</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Requested</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Paid</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {completedPayouts.map((payout) => (
                        <tr key={payout.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-800">{payout.affiliates.full_name}</div>
                            <div className="text-sm text-gray-600">{payout.affiliates.email}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-800 font-bold">
                            ${payout.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {getPaymentDetails(payout)}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {new Date(payout.requested_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                              {payout.paid_at ? new Date(payout.paid_at).toLocaleDateString() : 'Paid'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table></div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}