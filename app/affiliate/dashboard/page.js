'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zsjmqlsnvkbtdhjbtwkr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzam1xbHNudmtidGRoamJ0d2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMzcxOTYsImV4cCI6MjA3NzYxMzE5Nn0.vsbFj5m6pCaoVpHKpB3SZ2WzF4yRufOd27NlcEPhHGc'
);

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const MARKETING_MATERIALS = {
  emailTemplates: [
    {
      title: 'Introduction Email',
      subject: 'Boost Your Business with Professional Appointment Setting',
      body: `Hi [Name],

I wanted to share something that's been helping businesses like yours generate more qualified leads and close more deals.

Kinect B2B specializes in professional appointment setting services. They handle outreach to decision-makers so you can focus on closing deals.

I'm a partner with them and can get you exclusive pricing. Want to chat about how they could help your business?

Here's a link to learn more: [YOUR_REFERRAL_LINK]

Best,
[Your Name]`
    },
    {
      title: 'Follow-Up Email',
      subject: 'Quick question about your lead generation',
      body: `Hey [Name],

Following up on my last message about appointment setting services. 

Are you currently happy with your lead generation process? Or are you looking to scale up?

Kinect B2B can contact 100-1200+ businesses per month on your behalf. Thought it might be worth a conversation.

[YOUR_REFERRAL_LINK]

Let me know!
[Your Name]`
    }
  ],
  socialPosts: [
    {
      platform: 'LinkedIn',
      text: `🚀 Looking to scale your B2B sales? I've been working with Kinect B2B for appointment setting services and the results speak for themselves.

Professional outreach to decision-makers, qualified appointments booked for your calendar.

DM me for exclusive partner pricing! 

#B2BSales #LeadGeneration #BusinessGrowth`
    },
    {
      platform: 'Facebook',
      text: `Business owners: Are you spending too much time on prospecting instead of closing?

I found an amazing service that handles all the outreach and books qualified appointments for you.

Message me to learn more! 💼`
    },
    {
      platform: 'Twitter',
      text: `Tired of cold calling? Let professionals do it for you. 

Kinect B2B handles appointment setting so you can focus on closing deals. 

DM for details 🎯`
    }
  ],
  graphics: [
    { name: '1200x628 Facebook/LinkedIn Banner', url: '/marketing/fb-banner.png' },
    { name: '1080x1080 Instagram Post', url: '/marketing/ig-post.png' },
    { name: '1500x500 Twitter Header', url: '/marketing/twitter-header.png' },
    { name: 'Email Signature', url: '/marketing/email-sig.png' }
  ]
};

const ACHIEVEMENTS = [
  { id: 'first_referral', name: 'First Steps', description: 'Made your first referral', icon: '🎯', requirement: 1 },
  { id: 'five_referrals', name: 'Getting Started', description: 'Referred 5 clients', icon: '⭐', requirement: 5 },
  { id: 'ten_referrals', name: 'On Fire', description: 'Referred 10 clients', icon: '🔥', requirement: 10 },
  { id: 'first_payout', name: 'First Check', description: 'Received your first payout', icon: '💰', requirement: 1 },
  { id: 'thousand_earned', name: '$1K Club', description: 'Earned $1,000 in commissions', icon: '💵', requirement: 1000 },
  { id: 'five_thousand_earned', name: '$5K Club', description: 'Earned $5,000 in commissions', icon: '💎', requirement: 5000 },
];

export default function AffiliateDashboard() {
  const router = useRouter();
  const [affiliate, setAffiliate] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [isEditingProfile, setIsEditingProfile] = useState(true);
  const [isEditingPayment, setIsEditingPayment] = useState(true);
  
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const [activities, setActivities] = useState([]);
  
  const [payouts, setPayouts] = useState([]);
  const [pendingPayouts, setPendingPayouts] = useState([]);
  const [minimumPayout] = useState(100);
  
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutError, setPayoutError] = useState('');
  
  const [goals, setGoals] = useState({
    monthlyReferrals: 5,
    monthlyEarnings: 500,
    currentReferrals: 0,
    currentEarnings: 0
  });
  
  const [referralSearch, setReferralSearch] = useState('');
  const [referralFilter, setReferralFilter] = useState('all');
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [referralNote, setReferralNote] = useState('');
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  
  const [showSupportWidget, setShowSupportWidget] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [manualReferral, setManualReferral] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientCompany: '',
    proPlan: '',
    websitePackage: 'none',
    automationPackage: 'none',
    portalPackage: 'none'
  });
  
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPosition, setPhotoPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const photoContainerRef = useRef(null);
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    businessName: ''
  });

  const [stateSearch, setStateSearch] = useState('');
  const [showStateDropdown, setShowStateDropdown] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState('');
  const [showAccountNumbers, setShowAccountNumbers] = useState(false);
  const [licensePhoto, setLicensePhoto] = useState(null);
  const [paymentData, setPaymentData] = useState({
    accountNumber: '',
    accountNumberConfirm: '',
    routingNumber: '',
    routingNumberConfirm: '',
    zelleContact: '',
    zelleType: 'phone',
    cashTag: '',
    paypalContact: '',
    paypalType: 'email',
    venmoUsername: '',
    applePayContact: '',
    applePayType: 'phone'
  });

  const [calculatorProPlan, setCalculatorProPlan] = useState('none');
  const [calculatorWebsite, setCalculatorWebsite] = useState('none');
  const [calculatorAutomation, setCalculatorAutomation] = useState('none');
  const [calculatorPortal, setCalculatorPortal] = useState('none');

  useEffect(() => {
    const affiliateData = localStorage.getItem('affiliate');
    
    if (!affiliateData) {
      router.push('/affiliate/login');
      return;
    }

    try {
      const parsedAffiliate = JSON.parse(affiliateData);
      
      // Verify required fields
      if (!parsedAffiliate.id || !parsedAffiliate.email) {
        localStorage.removeItem('affiliate');
        router.push('/affiliate/login');
        return;
      }

      const fetchFreshData = async () => {
        try {
          const { data, error } = await supabase
            .from('affiliates')
            .select('*')
            .eq('id', parsedAffiliate.id)
            .single();

          if (error || !data) {
            localStorage.removeItem('affiliate');
            router.push('/affiliate/login');
            return null;
          }

          setAffiliate(data);
          localStorage.setItem('affiliate', JSON.stringify(data));
          
          return data;
        } catch (error) {
          console.error('Error fetching fresh affiliate data:', error);
          localStorage.removeItem('affiliate');
          router.push('/affiliate/login');
          return null;
        }
      };

      fetchFreshData().then((affiliateToUse) => {
        if (!affiliateToUse) return;
        
        setProfileData({
          firstName: affiliateToUse.full_name?.split(' ')[0] || '',
          lastName: affiliateToUse.full_name?.split(' ').slice(1).join(' ') || '',
          phone: affiliateToUse.phone || '',
          email: affiliateToUse.email || '',
          address: affiliateToUse.address || '',
          city: affiliateToUse.city || '',
          state: affiliateToUse.state || '',
          zipCode: affiliateToUse.zip_code || '',
          businessName: affiliateToUse.business_name || ''
        });

        if (affiliateToUse.profile_photo) {
          setProfilePhoto(affiliateToUse.profile_photo);
        }
        if (affiliateToUse.photo_position_x && affiliateToUse.photo_position_y) {
          setPhotoPosition({
            x: affiliateToUse.photo_position_x,
            y: affiliateToUse.photo_position_y
          });
        }

        if (affiliateToUse.license_photo) {
          setLicensePhoto(affiliateToUse.license_photo);
        }

        if (affiliateToUse.payment_method) {
          setPaymentMethod(affiliateToUse.payment_method);
          setIsEditingPayment(false);
        }
        if (affiliateToUse.payment_data) {
          try {
            const savedPaymentData = JSON.parse(affiliateToUse.payment_data);
            setPaymentData(savedPaymentData);
          } catch (e) {
            console.error('Error parsing payment data:', e);
          }
        }
        
        if (affiliateToUse.full_name && affiliateToUse.phone && affiliateToUse.email) {
          setIsEditingProfile(false);
        }

        if (!affiliateToUse.has_completed_onboarding) {
          setShowOnboarding(true);
        }
        
        fetchReferrals(affiliateToUse.id);
        fetchNotifications(affiliateToUse.id);
        fetchActivities(affiliateToUse.id);
        fetchPayouts(affiliateToUse.id);
        fetchGoals(affiliateToUse.id);
      });
    } catch (error) {
      console.error('Auth error:', error);
      localStorage.removeItem('affiliate');
      router.push('/affiliate/login');
    }
  }, [router]);

  const fetchReferrals = async (affiliateId) => {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('affiliate_id', affiliateId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReferrals(data || []);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async (affiliateId) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('affiliate_id', affiliateId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.read).length || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchActivities = async (affiliateId) => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('affiliate_id', affiliateId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const fetchPayouts = async (affiliateId) => {
    try {
      const { data, error } = await supabase
        .from('payouts')
        .select('*')
        .eq('affiliate_id', affiliateId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const paid = data?.filter(p => p.status === 'paid') || [];
      const pending = data?.filter(p => p.status === 'pending') || [];
      
      setPayouts(paid);
      setPendingPayouts(pending);
    } catch (error) {
      console.error('Error fetching payouts:', error);
    }
  };

  const fetchGoals = async (affiliateId) => {
    try {
      const { data, error } = await supabase
        .from('affiliate_goals')
        .select('*')
        .eq('affiliate_id', affiliateId)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setGoals({
          monthlyReferrals: data.monthly_referrals_goal,
          monthlyEarnings: data.monthly_earnings_goal,
          currentReferrals: data.current_month_referrals,
          currentEarnings: data.current_month_earnings
        });
      } else {
        const { data: newGoals, error: insertError } = await supabase
          .from('affiliate_goals')
          .insert([{
            affiliate_id: affiliateId,
            monthly_referrals_goal: 5,
            monthly_earnings_goal: 500,
            current_month_referrals: 0,
            current_month_earnings: 0
          }])
          .select()
          .single();

        if (insertError) throw insertError;
        if (newGoals) {
          setGoals({
            monthlyReferrals: newGoals.monthly_referrals_goal,
            monthlyEarnings: newGoals.monthly_earnings_goal,
            currentReferrals: newGoals.current_month_referrals,
            currentEarnings: newGoals.current_month_earnings
          });
        }
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const markNotificationRead = async (notificationId) => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      fetchNotifications(affiliate.id);
    } catch (error) {
      console.error('Error marking notification read:', error);
    }
  };

  const openPayoutModal = () => {
    setShowPayoutModal(true);
    setPayoutAmount('');
    setPayoutError('');
  };

  const [isRequestingPayout, setIsRequestingPayout] = useState(false);

const requestPayout = async () => {
  if (isRequestingPayout) return; // Prevent duplicate submissions
  
  const amount = parseFloat(payoutAmount);
  const availableBalance = affiliate?.pending_payout || 0;

  if (!payoutAmount || isNaN(amount) || amount <= 0) {
    setPayoutError('Please enter a valid amount');
    return;
  }

  if (amount < minimumPayout) {
    setPayoutError(`Payout must be at least $${minimumPayout} to withdraw`);
    return;
  }

  if (amount > availableBalance) {
    setPayoutError(`You don't have enough credit to withdraw. Available: $${availableBalance.toFixed(2)}`);
    return;
  }

  setIsRequestingPayout(true); // Start loading

  try {
    const { error: payoutError } = await supabase
      .from('payouts')
      .insert([{
        affiliate_id: affiliate.id,
        amount: amount,
        status: 'pending',
        payment_method: paymentMethod,
        requested_at: new Date().toISOString()
      }]);

    if (payoutError) throw payoutError;

    const newPendingPayout = availableBalance - amount;
    
    const { error: updateError } = await supabase
      .from('affiliates')
      .update({ 
        pending_payout: newPendingPayout
      })
      .eq('id', affiliate.id);

    if (updateError) throw updateError;

    const { error: notifError } = await supabase
      .from('admin_notifications')
      .insert([{
        type: 'payout_request',
        affiliate_id: affiliate.id,
        affiliate_name: affiliate.full_name,
        amount: amount,
        payment_method: paymentMethod,
        message: `${affiliate.full_name} is requesting a payout of $${amount.toFixed(2)}`,
        created_at: new Date().toISOString()
      }]);

    if (notifError) throw notifError;

    const updatedAffiliate = {
      ...affiliate,
      pending_payout: newPendingPayout
    };
    setAffiliate(updatedAffiliate);
    localStorage.setItem('affiliate', JSON.stringify(updatedAffiliate));

    setShowPayoutModal(false);
    setPayoutAmount('');
    setPayoutError('');
    alert('Payout requested successfully! You will receive payment within 5-7 business days.');
    fetchPayouts(affiliate.id);
  } catch (error) {
    console.error('Error requesting payout:', error);
    setPayoutError('Error requesting payout. Please try again.');
  } finally {
    setIsRequestingPayout(false); // Stop loading
  }
};

  const saveReferralNote = async (referralId, note) => {
    try {
      const { error } = await supabase
        .from('referral_notes')
        .insert([{
          referral_id: referralId,
          affiliate_id: affiliate.id,
          note: note,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      
      alert('Note saved!');
      setReferralNote('');
      setSelectedReferral(null);
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Error saving note. Please try again.');
    }
  };

  const submitSupportTicket = async () => {
    if (!supportMessage.trim()) {
      alert('Please enter a message');
      return;
    }

    try {
      const { error } = await supabase
        .from('support_tickets')
        .insert([{
          affiliate_id: affiliate.id,
          message: supportMessage,
          status: 'open',
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      alert('Support ticket submitted! We\'ll get back to you within 24 hours.');
      setSupportMessage('');
      setShowSupportWidget(false);
    } catch (error) {
      console.error('Error submitting ticket:', error);
      alert('Error submitting ticket. Please try again.');
    }
  };

  const completeOnboarding = async () => {
    try {
      await supabase
        .from('affiliates')
        .update({ has_completed_onboarding: true })
        .eq('id', affiliate.id);

      setShowOnboarding(false);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('affiliate');
    router.push('/affiliate/login');
  };

  const copyReferralLink = () => {
    const link = `https://kinectb2b.com/referral?ref=${affiliate.referral_code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToSocial = (platform) => {
    const link = `https://kinectb2b.com/referral?ref=${affiliate.referral_code}`;
    const text = 'Check out Kinect B2B - Get exclusive discounts on appointment setting and business services!';
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`,
      email: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(link)}`,
    };

    window.open(urls[platform], '_blank');
  };

  const formatPhoneNumber = (value) => {
    const phone = value.replace(/\D/g, '');
    if (phone.length <= 3) return phone;
    if (phone.length <= 6) return `${phone.slice(0, 3)}-${phone.slice(3)}`;
    return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setProfileData({...profileData, phone: formatted});
  };

  const handleManualReferralPhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setManualReferral({...manualReferral, clientPhone: formatted});
  };

  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result);
        setPhotoPosition({ x: 50, y: 50 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoMouseDown = (e) => {
    if (!profilePhoto) return;
    setIsDragging(true);
    e.preventDefault();
  };

  const handlePhotoMouseMove = (e) => {
    if (!isDragging || !photoContainerRef.current) return;
    
    const rect = photoContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setPhotoPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    });
  };

  const handlePhotoMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handlePhotoMouseMove);
      document.addEventListener('mouseup', handlePhotoMouseUp);
      return () => {
        document.removeEventListener('mousemove', handlePhotoMouseMove);
        document.removeEventListener('mouseup', handlePhotoMouseUp);
      };
    }
  }, [isDragging]);

  const handleLicenseUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLicensePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredStates = US_STATES.filter(state =>
    state.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const handleStateSelect = (state) => {
    setProfileData({...profileData, state});
    setStateSearch('');
    setShowStateDropdown(false);
  };

  const saveProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliates')
        .update({
          full_name: `${profileData.firstName} ${profileData.lastName}`,
          phone: profileData.phone,
          email: profileData.email,
          address: profileData.address,
          city: profileData.city,
          state: profileData.state,
          zip_code: profileData.zipCode,
          business_name: profileData.businessName,
          profile_photo: profilePhoto,
          photo_position_x: photoPosition.x,
          photo_position_y: photoPosition.y
        })
        .eq('id', affiliate.id);

      if (error) throw error;

      const updatedAffiliate = {
        ...affiliate,
        full_name: `${profileData.firstName} ${profileData.lastName}`,
        phone: profileData.phone,
        email: profileData.email,
        address: profileData.address,
        city: profileData.city,
        state: profileData.state,
        zip_code: profileData.zipCode,
        business_name: profileData.businessName
      };
      setAffiliate(updatedAffiliate);
      localStorage.setItem('affiliate', JSON.stringify(updatedAffiliate));

      setIsEditingProfile(false);
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    }
  };

  const savePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setShowPasswordChange(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Error updating password. Please try again.');
    }
  };

  const savePaymentInfo = async () => {
    if (paymentMethod === 'ach') {
      if (paymentData.accountNumber !== paymentData.accountNumberConfirm) {
        alert('Account numbers do not match');
        return;
      }
      if (paymentData.routingNumber !== paymentData.routingNumberConfirm) {
        alert('Routing numbers do not match');
        return;
      }
    }

    try {
      const { data, error } = await supabase
        .from('affiliates')
        .update({
          payment_method: paymentMethod,
          payment_data: JSON.stringify(paymentData),
          license_photo: licensePhoto
        })
        .eq('id', affiliate.id);

      if (error) throw error;

      const updatedAffiliate = {
        ...affiliate,
        payment_method: paymentMethod
      };
      setAffiliate(updatedAffiliate);
      localStorage.setItem('affiliate', JSON.stringify(updatedAffiliate));

      setIsEditingPayment(false);
      alert('Payment information saved successfully!');
    } catch (error) {
      console.error('Error saving payment info:', error);
      alert('Error saving payment information. Please try again.');
    }
  };

  const maskAccountNumber = (num) => {
    if (!num || num.length < 4) return '';
    return '*'.repeat(num.length - 4) + num.slice(-4);
  };

  const submitManualReferral = async () => {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .insert([
          {
            affiliate_id: affiliate.id,
            referral_code: affiliate.referral_code,
            client_name: manualReferral.clientName,
            email: manualReferral.clientEmail,
            phone: manualReferral.clientPhone,
            business_name: manualReferral.clientCompany,
            pro_plan: manualReferral.proPlan,
            website_package: manualReferral.websitePackage,
            automation_package: manualReferral.automationPackage,
            portal_package: manualReferral.portalPackage,
            status: 'pending',
            signup_date: new Date().toISOString(),
            monthly_value: 0,
            commission_earned: 0
          }
        ]);

      if (error) throw error;

      alert('Referral added successfully!');
      const { data: updatedAffiliate, error: updateError } = await supabase
        .from('affiliates')
        .update({ 
          total_referrals: (affiliate.total_referrals || 0) + 1 
        })
        .eq('id', affiliate.id)
        .select()
        .single();

      if (!updateError && updatedAffiliate) {
        setAffiliate(updatedAffiliate);
        localStorage.setItem('affiliate', JSON.stringify(updatedAffiliate));
      }
      setShowReferralModal(false);
      setManualReferral({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        clientCompany: '',
        proPlan: '',
        websitePackage: 'none',
        automationPackage: 'none',
        portalPackage: 'none'
      });
      fetchReferrals(affiliate.id);
    } catch (error) {
      console.error('Error adding referral:', error);
      alert('Error adding referral. Please try again.');
    }
  };

  const calculateCommission = () => {
    let proPlanPrice = 0;
    let monthlyRecurring = 0;
    
    const proPlanPrices = {
      'pro-100': 250, 'pro-200': 425, 'pro-300': 550, 'pro-400': 675,
      'pro-500': 800, 'pro-600': 1000, 'pro-700': 1125, 'pro-800': 1225,
      'pro-900': 1300, 'pro-1000': 1375, 'pro-1100': 1450, 'pro-1200': 1500
    };

    if (calculatorProPlan !== 'none') {
      proPlanPrice = proPlanPrices[calculatorProPlan];
      monthlyRecurring = proPlanPrice * 0.10;
    }

    const websitePrices = { 'website-starter': 500, 'website-professional': 1500, 'website-premium': 3500 };
    const automationPrices = { 'automation-starter': 500, 'automation-professional': 1500, 'automation-enterprise': 3500 };
    const portalPrices = { 'portal-starter': 750, 'portal-professional': 2000, 'portal-enterprise': 4000 };

    const websitePrice = calculatorWebsite !== 'none' ? websitePrices[calculatorWebsite] : 0;
    const automationPrice = calculatorAutomation !== 'none' ? automationPrices[calculatorAutomation] : 0;
    const portalPrice = calculatorPortal !== 'none' ? portalPrices[calculatorPortal] : 0;

    const websiteCommission = (websitePrice * 0.10).toFixed(2);
    const automationCommission = (automationPrice * 0.10).toFixed(2);
    const portalCommission = (portalPrice * 0.10).toFixed(2);

    const totalOneTime = (parseFloat(websiteCommission) + parseFloat(automationCommission) + parseFloat(portalCommission)).toFixed(2);
    const firstMonthTotal = (monthlyRecurring + parseFloat(totalOneTime)).toFixed(2);
    const total12Months = (monthlyRecurring * 12).toFixed(2);
    const year1Total = (parseFloat(total12Months) + parseFloat(totalOneTime)).toFixed(2);

    return {
      proPlanPrice: proPlanPrice.toFixed(2),
      monthlyRecurring: monthlyRecurring.toFixed(2),
      websiteCommission,
      automationCommission,
      portalCommission,
      totalOneTime,
      firstMonthTotal,
      total12Months,
      year1Total,
      websitePrice: websitePrice.toFixed(2),
      automationPrice: automationPrice.toFixed(2),
      portalPrice: portalPrice.toFixed(2)
    };
  };

  const filteredReferrals = referrals.filter(referral => {
    const matchesSearch = referral.client_name?.toLowerCase().includes(referralSearch.toLowerCase()) ||
                         referral.company_name?.toLowerCase().includes(referralSearch.toLowerCase());
    const matchesFilter = referralFilter === 'all' || referral.status === referralFilter;
    return matchesSearch && matchesFilter;
  });

  const getAchievedBadges = () => {
    const totalReferrals = affiliate?.total_referrals || 0;
    const totalEarned = affiliate?.total_earned || 0;
    const totalPayouts = payouts?.filter(p => p.status === 'paid').length || 0;

    return ACHIEVEMENTS.filter(achievement => {
      if (achievement.id === 'first_referral') return totalReferrals >= 1;
      if (achievement.id === 'five_referrals') return totalReferrals >= 5;
      if (achievement.id === 'ten_referrals') return totalReferrals >= 10;
      if (achievement.id === 'first_payout') return totalPayouts >= 1;
      if (achievement.id === 'thousand_earned') return totalEarned >= 1000;
      if (achievement.id === 'five_thousand_earned') return totalEarned >= 5000;
      return false;
    });
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading || !affiliate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const commissionResults = calculateCommission();
  const achievedBadges = getAchievedBadges();
  const totalPendingPayouts = pendingPayouts.reduce((sum, p) => sum + p.amount, 0);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'referrals', label: 'Referrals', icon: '👥' },
    { id: 'payouts', label: 'Payouts', icon: '💰' },
    { id: 'marketing', label: 'Marketing', icon: '📣' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'payment', label: 'Payment', icon: '💳' },
    { id: 'calculator', label: 'Calculator', icon: '🧮' },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 z-50 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <img src="/icon.png" alt="Kinect B2B" className="w-10 h-10 rounded-xl" />
              <div>
                <h1 className="text-white font-bold text-lg">Kinect B2B</h1>
                <p className="text-teal-400 text-xs">Affiliate Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                {item.id === 'referrals' && referrals.filter(r => r.status === 'pending').length > 0 && (
                  <span className="ml-auto bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {referrals.filter(r => r.status === 'pending').length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white font-bold">
                {affiliate.full_name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{affiliate.full_name}</p>
                <p className="text-slate-400 text-xs truncate">{affiliate.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700/50 hover:bg-red-600 text-slate-300 hover:text-white rounded-xl transition-all text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between px-4 md:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition"
              >
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                  {navItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                </h2>
                <p className="text-slate-500 text-sm hidden md:block">
                  Welcome back, {affiliate.full_name?.split(' ')[0]}!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2.5 hover:bg-slate-100 rounded-xl transition relative"
                >
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-slate-100">
                      <h3 className="font-bold text-slate-800">Notifications</h3>
                    </div>
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center">
                        <span className="text-4xl">🔔</span>
                        <p className="text-slate-500 mt-2">No notifications yet</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => markNotificationRead(notif.id)}
                            className={`p-4 hover:bg-slate-50 cursor-pointer ${!notif.read ? 'bg-teal-50' : ''}`}
                          >
                            <p className="text-sm font-semibold text-slate-800">{notif.title}</p>
                            <p className="text-xs text-slate-600 mt-1">{notif.message}</p>
                            <p className="text-xs text-slate-400 mt-1">
                              {new Date(notif.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Add Referral Button */}
              <button
                onClick={() => setShowReferralModal(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl font-medium hover:from-teal-700 hover:to-teal-800 transition shadow-lg shadow-teal-600/20"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Referral
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Referral Link Card */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold mb-1">Your Referral Link</h3>
                  <p className="text-teal-200 text-sm">Share this link to earn commissions</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2.5 flex-1 md:flex-none">
                    <code className="text-sm font-mono truncate block max-w-xs">
                      kinectb2b.com/ref/{affiliate.referral_code}
                    </code>
                  </div>
                  <button
                    onClick={copyReferralLink}
                    className={`px-4 py-2.5 rounded-xl font-medium transition ${
                      copied 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white text-teal-600 hover:bg-teal-50'
                    }`}
                  >
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg">👥</span>
                  </div>
                </div>
                <p className="text-slate-500 text-sm mb-1">Total Referrals</p>
                <p className="text-2xl md:text-3xl font-bold text-slate-800">{affiliate.total_referrals || 0}</p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg">✓</span>
                  </div>
                </div>
                <p className="text-slate-500 text-sm mb-1">Active Clients</p>
                <p className="text-2xl md:text-3xl font-bold text-slate-800">{affiliate.active_clients || 0}</p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg">💵</span>
                  </div>
                </div>
                <p className="text-slate-500 text-sm mb-1">Total Earned</p>
                <p className="text-2xl md:text-3xl font-bold text-slate-800">${(affiliate.total_earned || 0).toLocaleString()}</p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg">💰</span>
                  </div>
                </div>
                <p className="text-slate-500 text-sm mb-1">Available Balance</p>
                <p className="text-2xl md:text-3xl font-bold text-slate-800">${(affiliate.pending_payout || 0).toFixed(2)}</p>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Achievements</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {ACHIEVEMENTS.map((achievement) => {
                  const achieved = achievedBadges.find(b => b.id === achievement.id);
                  return (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-xl border-2 text-center transition ${
                        achieved
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-slate-200 bg-slate-50 opacity-50'
                      }`}
                    >
                      <div className="text-3xl mb-2">{achievement.icon}</div>
                      <p className={`text-xs font-bold ${achieved ? 'text-teal-700' : 'text-slate-500'}`}>
                        {achievement.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
              {activities.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl">📋</span>
                  <p className="text-slate-500 mt-2">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="text-xl">{activity.icon || '📌'}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{activity.description}</p>
                      </div>
                      <p className="text-xs text-slate-400 whitespace-nowrap">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => setShowReferralModal(true)}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-teal-300 hover:shadow-md transition text-left"
              >
                <div className="text-2xl mb-2">➕</div>
                <p className="font-bold text-slate-800">Add Referral</p>
                <p className="text-xs text-slate-500">Submit a new lead</p>
              </button>
              <button 
                onClick={() => setActiveTab('payouts')}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-teal-300 hover:shadow-md transition text-left"
              >
                <div className="text-2xl mb-2">💸</div>
                <p className="font-bold text-slate-800">Request Payout</p>
                <p className="text-xs text-slate-500">Withdraw earnings</p>
              </button>
              <button 
                onClick={() => setActiveTab('marketing')}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-teal-300 hover:shadow-md transition text-left"
              >
                <div className="text-2xl mb-2">📣</div>
                <p className="font-bold text-slate-800">Marketing</p>
                <p className="text-xs text-slate-500">Get promo materials</p>
              </button>
              <button 
                onClick={() => setActiveTab('calculator')}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-teal-300 hover:shadow-md transition text-left"
              >
                <div className="text-2xl mb-2">🧮</div>
                <p className="font-bold text-slate-800">Calculator</p>
                <p className="text-xs text-slate-500">Estimate earnings</p>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'referrals' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Your Referrals</h3>
                <p className="text-slate-500 text-sm">Track all your referred clients</p>
              </div>
              <button
                onClick={() => setShowReferralModal(true)}
                className="sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Referral
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Search referrals..."
                value={referralSearch}
                onChange={(e) => setReferralSearch(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <select
                value={referralFilter}
                onChange={(e) => setReferralFilter(e.target.value)}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Referrals List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {filteredReferrals.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-5xl">👥</span>
                  <p className="text-slate-500 mt-3">No referrals found</p>
                  <button
                    onClick={() => setShowReferralModal(true)}
                    className="mt-4 px-6 py-2.5 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition"
                  >
                    Add Your First Referral
                  </button>
                </div>
              ) : (
                <>
                  {/* Mobile Card View */}
                  <div className="md:hidden divide-y divide-slate-100">
                    {filteredReferrals.map((referral) => (
                      <div key={referral.id} className="p-4 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-bold text-slate-800">{referral.client_name}</p>
                            <p className="text-sm text-slate-500">{referral.business_name}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            referral.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                            referral.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {referral.status}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Commission</span>
                          <span className="font-medium text-slate-800">${referral.commission_earned?.toFixed(2) || '0.00'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Client</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Business</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                          <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                          <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Commission</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredReferrals.map((referral) => (
                          <tr key={referral.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4">
                              <p className="font-medium text-slate-800">{referral.client_name}</p>
                              <p className="text-sm text-slate-500">{referral.email}</p>
                            </td>
                            <td className="px-6 py-4 text-slate-600">{referral.business_name}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                referral.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                                referral.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {referral.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              {new Date(referral.signup_date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right font-medium text-slate-800">
                              ${referral.commission_earned?.toFixed(2) || '0.00'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'payouts' && (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl">
              <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-6">Payout Management</h2>

              <div className="bg-teal-50 rounded-2xl p-6 mb-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-base md:text-xl font-bold text-gray-800">Available Balance</h3>
                    <p className="text-4xl font-black text-teal-600 mt-2">${affiliate.pending_payout?.toFixed(2) || '0.00'}</p>
                    <p className="text-sm text-gray-600 mt-2">Minimum payout: ${minimumPayout}</p>
                  </div>
                  <button
                    onClick={openPayoutModal}
                    className="px-6 md:px-8 py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-teal-600 to-teal-600 text-white hover:from-teal-700 hover:to-teal-700"
                  >
                    Request Payout
                  </button>
                </div>
              </div>

              {pendingPayouts.length > 0 && (
                <div className="bg-yellow-50 rounded-2xl p-6 mb-8 border-2 border-yellow-300">
                  <h3 className="text-base md:text-xl font-bold text-gray-800 mb-4">Pending Payouts</h3>
                  <div className="space-y-3">
                    {pendingPayouts.map((payout) => (
                      <div key={payout.id} className="flex justify-between items-center bg-white rounded-xl p-4">
                        <div>
                          <p className="font-bold text-gray-800">${payout.amount.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">
                            Requested {new Date(payout.requested_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                          Pending
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-yellow-200">
                    <p className="text-sm text-gray-700">
                      <span className="font-bold">Total Pending:</span> ${totalPendingPayouts.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
                <h3 className="text-base md:text-xl font-bold text-gray-800 mb-4">Previous Payouts</h3>
                {payouts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-lg">No previous payouts yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Method</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {payouts.map((payout) => (
                          <tr key={payout.id} className="hover:bg-gray-50 transition-all">
                            <td className="px-6 py-4 text-gray-800">
                              {new Date(payout.requested_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="px-6 py-4 text-gray-800 font-bold">${payout.amount.toFixed(2)}</td>
                            <td className="px-6 py-4 text-gray-600">{payout.payment_method?.toUpperCase()}</td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                                Paid
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'marketing' && (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl">
              <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-6">Marketing Materials</h2>

              <div className="mb-8">
                <h3 className="text-base md:text-xl font-bold text-gray-800 mb-4">📧 Email Templates</h3>
                <div className="space-y-4">
                  {MARKETING_MATERIALS.emailTemplates.map((template, index) => (
                    <div key={index} className="bg-teal-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-800 mb-2">{template.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">Subject: {template.subject}</p>
                      <textarea
                        readOnly
                        value={template.body.replace('[YOUR_REFERRAL_LINK]', `https://kinectb2b.com/referral?ref=${affiliate.referral_code}`)}
                        className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl bg-white h-48 text-sm"
                      ></textarea>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(template.body.replace('[YOUR_REFERRAL_LINK]', `https://kinectb2b.com/referral?ref=${affiliate.referral_code}`));
                          alert('Template copied!');
                        }}
                        className="mt-3 bg-teal-600 text-white px-4 md:px-6 py-2 rounded-xl font-semibold hover:bg-teal-700 transition-all"
                      >
                        Copy Template
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-base md:text-xl font-bold text-gray-800 mb-4">📱 Social Media Posts</h3>
                <div className="space-y-4">
                  {MARKETING_MATERIALS.socialPosts.map((post, index) => (
                    <div key={index} className="bg-teal-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-800 mb-2">{post.platform}</h4>
                      <textarea
                        readOnly
                        value={post.text}
                        className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl bg-white h-32 text-sm"
                      ></textarea>
                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(post.text);
                            alert('Post copied!');
                          }}
                          className="bg-teal-600 text-white px-4 md:px-6 py-2 rounded-xl font-semibold hover:bg-teal-700 transition-all"
                        >
                          Copy Post
                        </button>
                        <button
                          onClick={() => shareToSocial(post.platform.toLowerCase())}
                          className="bg-blue-600 text-white px-4 md:px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all"
                        >
                          Share Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-base md:text-xl font-bold text-gray-800 mb-4">🎨 Downloadable Graphics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MARKETING_MATERIALS.graphics.map((graphic, index) => (
                    <div key={index} className="bg-teal-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-800 mb-2">{graphic.name}</h4>
                      <button className="bg-teal-600 text-white px-4 md:px-6 py-2 rounded-xl font-semibold hover:bg-teal-700 transition-all w-full">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 bg-teal-50 rounded-xl p-6">
                <h3 className="text-base md:text-xl font-bold text-gray-800 mb-4">📱 Your QR Code</h3>
                <div className="flex items-center gap-6">
                  <div className="bg-white p-4 rounded-xl">
                    <div className="w-48 h-48 bg-gray-200 flex items-center justify-center rounded-xl">
                      <p className="text-gray-500 text-center text-sm">QR Code<br/>Would Generate Here</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 mb-4">Print this QR code on business cards, flyers, or display it at events. When scanned, it directs people to your referral link.</p>
                    <button className="bg-teal-600 text-white px-4 md:px-6 py-2 rounded-xl font-semibold hover:bg-teal-700 transition-all">
                      Download QR Code
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-3xl font-bold text-gray-800">Profile Settings</h2>
                {!isEditingProfile && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="bg-teal-600 text-white px-4 md:px-6 py-2 rounded-xl font-semibold hover:bg-teal-700 transition-all"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
              
              {isEditingProfile ? (
                <>
                  <div className="mb-8 text-center">
                    <div className="mb-4">
                      <div 
                        ref={photoContainerRef}
                        className="w-32 h-32 rounded-full mx-auto overflow-hidden border-4 border-teal-600 cursor-move relative"
                        onMouseDown={handlePhotoMouseDown}
                      >
                        {profilePhoto ? (
                          <img 
                            src={profilePhoto} 
                            alt="Profile" 
                            className="absolute w-full h-full object-cover"
                            style={{
                              objectPosition: `${photoPosition.x}% ${photoPosition.y}%`
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-teal-100 flex items-center justify-center text-teal-600 text-2xl md:text-4xl font-bold">
                            {profileData.firstName?.charAt(0)}{profileData.lastName?.charAt(0)}
                          </div>
                        )}
                      </div>
                      {profilePhoto && (
                        <p className="text-xs text-gray-500 mt-2">Click and drag to reposition</p>
                      )}
                    </div>
                    <label className="cursor-pointer bg-teal-600 text-white px-4 md:px-6 py-2 rounded-xl font-semibold hover:bg-teal-700 transition-all inline-block">
                      Upload Photo
                      <input type="file" accept="image/*" onChange={handleProfilePhotoUpload} className="hidden" />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={handlePhoneChange}
                        placeholder="xxx-xxx-xxxx"
                        maxLength="12"
                        className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name (Optional)</label>
                      <input
                        type="text"
                        value={profileData.businessName}
                        onChange={(e) => setProfileData({...profileData, businessName: e.target.value})}
                        className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Mailing Address</label>
                      <input
                        type="text"
                        value={profileData.address}
                        onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                        placeholder="Street Address"
                        className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={profileData.city}
                        onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                        className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                      />
                    </div>

                    <div className="relative">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        value={profileData.state || stateSearch}
                        onChange={(e) => {
                          setStateSearch(e.target.value);
                          setProfileData({...profileData, state: ''});
                          setShowStateDropdown(true);
                        }}
                        onFocus={() => setShowStateDropdown(true)}
                        placeholder="Start typing state name..."
                        className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                      />
                      {showStateDropdown && filteredStates.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                          {filteredStates.map((state) => (
                            <div
                              key={state}
                              onClick={() => handleStateSelect(state)}
                              className="px-4 py-2 hover:bg-teal-50 cursor-pointer"
                            >
                              {state}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP Code</label>
                      <input
                        type="text"
                        value={profileData.zipCode}
                        onChange={(e) => setProfileData({...profileData, zipCode: e.target.value})}
                        className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={saveProfile}
                      className="bg-gradient-to-r from-teal-600 to-teal-600 text-white px-6 md:px-8 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-teal-700 transition-all"
                    >
                      Save Profile
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-teal-600">
                      {profilePhoto ? (
                        <img 
                          src={profilePhoto} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                          style={{
                            objectPosition: `${photoPosition.x}% ${photoPosition.y}%`
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-teal-100 flex items-center justify-center text-teal-600 text-2xl md:text-4xl font-bold">
                          {profileData.firstName?.charAt(0)}{profileData.lastName?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg md:text-2xl font-bold text-gray-800">{profileData.firstName} {profileData.lastName}</h3>
                      {profileData.businessName && <p className="text-gray-600">{profileData.businessName}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-500 mb-1">Phone Number</label>
                      <p className="text-lg text-gray-800">{profileData.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-500 mb-1">Email</label>
                      <p className="text-lg text-gray-800">{profileData.email || 'Not provided'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-500 mb-1">Address</label>
                      <p className="text-lg text-gray-800">
                        {profileData.address && profileData.city && profileData.state
                          ? `${profileData.address}, ${profileData.city}, ${profileData.state} ${profileData.zipCode}`
                          : 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg md:text-2xl font-bold text-gray-800">Password</h3>
                {!showPasswordChange && (
                  <button
                    onClick={() => setShowPasswordChange(true)}
                    className="bg-teal-600 text-white px-4 md:px-6 py-2 rounded-xl font-semibold hover:bg-teal-700 transition-all"
                  >
                    Change Password
                  </button>
                )}
              </div>

              {showPasswordChange ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3"><button
                      onClick={savePassword}
                      className="bg-gradient-to-r from-teal-600 to-teal-600 text-white px-6 md:px-8 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-teal-700 transition-all"
                    >
                      Update Password
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordChange(false);
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                      className="bg-gray-200 text-gray-700 px-6 md:px-8 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Click "Change Password" to update your password</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-3xl font-bold text-gray-800">Payment Information</h2>
                {!isEditingPayment && (
                  <button
                    onClick={() => setIsEditingPayment(true)}
                    className="bg-teal-600 text-white px-4 md:px-6 py-2 rounded-xl font-semibold hover:bg-teal-700 transition-all"
                  >
                    Change Payment Info
                  </button>
                )}
              </div>
              
              {isEditingPayment ? (
                <>
                  <div className="bg-teal-50 rounded-2xl p-6 mb-8">
                    <h3 className="text-base md:text-xl font-bold text-gray-800 mb-4">Identity Verification</h3>
                    <p className="text-gray-600 mb-4">Please upload a photo of your driver's license for verification purposes.</p>
                    
                    {licensePhoto ? (
                      <div className="mb-4">
                        <img src={licensePhoto} alt="License" className="max-w-md rounded-xl border-2 border-teal-600" />
                      </div>
                    ) : null}
                    
                    <label className="cursor-pointer bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-all inline-block">
                      {licensePhoto ? 'Change License Photo' : 'Upload Driver\'s License'}
                      <input type="file" accept="image/*" onChange={handleLicenseUpload} className="hidden" />
                    </label>
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Payment Method</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {['ach', 'zelle', 'cashapp', 'paypal', 'venmo', 'applepay'].map((method) => (
                        <button
                          key={method}
                          onClick={() => setPaymentMethod(method)}
                          className={`p-4 rounded-xl border-2 font-semibold transition-all ${
                            paymentMethod === method
                              ? 'border-teal-600 bg-teal-50 text-teal-600'
                              : 'border-gray-300 hover:border-teal-300'
                          }`}
                        >
                          {method === 'ach' && 'ACH / Bank Transfer'}
                          {method === 'zelle' && 'Zelle'}
                          {method === 'cashapp' && 'Cash App'}
                          {method === 'paypal' && 'PayPal'}
                          {method === 'venmo' && 'Venmo'}
                          {method === 'applepay' && 'Apple Pay'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {paymentMethod === 'ach' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base md:text-xl font-bold text-gray-800">Bank Account Details</h3>
                        <button
                          onClick={() => setShowAccountNumbers(!showAccountNumbers)}
                          className="text-teal-600 font-semibold hover:text-teal-700"
                        >
                          {showAccountNumbers ? 'Hide' : 'Show'} Numbers
                        </button>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number</label>
                        <input
                          type={showAccountNumbers ? "text" : "password"}
                          value={paymentData.accountNumber}
                          onChange={(e) => setPaymentData({...paymentData, accountNumber: e.target.value})}
                          className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Account Number</label>
                        <input
                          type={showAccountNumbers ? "text" : "password"}
                          value={paymentData.accountNumberConfirm}
                          onChange={(e) => setPaymentData({...paymentData, accountNumberConfirm: e.target.value})}
                          className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Routing Number</label>
                        <input
                          type={showAccountNumbers ? "text" : "password"}
                          value={paymentData.routingNumber}
                          onChange={(e) => setPaymentData({...paymentData, routingNumber: e.target.value})}
                          className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Routing Number</label>
                        <input
                          type={showAccountNumbers ? "text" : "password"}
                          value={paymentData.routingNumberConfirm}
                          onChange={(e) => setPaymentData({...paymentData, routingNumberConfirm: e.target.value})}
                          className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'zelle' && (
                    <div className="space-y-4">
                      <h3 className="text-base md:text-xl font-bold text-gray-800 mb-4">Zelle Details</h3>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Type</label>
                        <div className="flex flex-col sm:flex-row gap-3"><button
                            onClick={() => setPaymentData({...paymentData, zelleType: 'phone'})}
                            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                              paymentData.zelleType === 'phone'
                                ? 'bg-teal-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Phone Number
                          </button>
                          <button
                            onClick={() => setPaymentData({...paymentData, zelleType: 'email'})}
                            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                              paymentData.zelleType === 'email'
                                ? 'bg-teal-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Email
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {paymentData.zelleType === 'phone' ? 'Phone Number' : 'Email Address'}
                        </label>
                        <input
                          type={paymentData.zelleType === 'phone' ? 'tel' : 'email'}
                          value={paymentData.zelleContact}
                          onChange={(e) => setPaymentData({...paymentData, zelleContact: e.target.value})}
                          placeholder={paymentData.zelleType === 'phone' ? 'Enter phone number' : 'Enter email address'}
                          className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cashapp' && (
                    <div className="space-y-4">
                      <h3 className="text-base md:text-xl font-bold text-gray-800 mb-4">Cash App Details</h3>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Cash Tag</label>
                        <input
                          type="text"
                          value={paymentData.cashTag}
                          onChange={(e) => setPaymentData({...paymentData, cashTag: e.target.value})}
                          placeholder="$yourcashtag"
                          className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'paypal' && (
                    <div className="space-y-4">
                      <h3 className="text-base md:text-xl font-bold text-gray-800 mb-4">PayPal Details</h3>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Type</label>
                        <div className="flex flex-col sm:flex-row gap-3"><button
                            onClick={() => setPaymentData({...paymentData, paypalType: 'email'})}
                            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                              paymentData.paypalType === 'email'
                                ? 'bg-teal-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Email
                          </button>
                          <button
                            onClick={() => setPaymentData({...paymentData, paypalType: 'username'})}
                            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                              paymentData.paypalType === 'username'
                                ? 'bg-teal-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Username
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {paymentData.paypalType === 'email' ? 'Email Address' : 'Username'}
                        </label>
                        <input
                          type={paymentData.paypalType === 'email' ? 'email' : 'text'}
                          value={paymentData.paypalContact}
                          onChange={(e) => setPaymentData({...paymentData, paypalContact: e.target.value})}
                          placeholder={paymentData.paypalType === 'email' ? 'Enter email address' : 'Enter username'}
                          className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'venmo' && (
                    <div className="space-y-4">
                      <h3 className="text-base md:text-xl font-bold text-gray-800 mb-4">Venmo Details</h3>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Venmo Username</label>
                        <input
                          type="text"
                          value={paymentData.venmoUsername}
                          onChange={(e) => setPaymentData({...paymentData, venmoUsername: e.target.value})}
                          placeholder="@yourusername"
                          className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'applepay' && (
                    <div className="space-y-4">
                      <h3 className="text-base md:text-xl font-bold text-gray-800 mb-4">Apple Pay Details</h3>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Type</label>
                        <div className="flex flex-col sm:flex-row gap-3"><button
                            onClick={() => setPaymentData({...paymentData, applePayType: 'phone'})}
                            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                              paymentData.applePayType === 'phone'
                                ? 'bg-teal-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Phone Number
                          </button>
                          <button
                            onClick={() => setPaymentData({...paymentData, applePayType: 'email'})}
                            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                              paymentData.applePayType === 'email'
                                ? 'bg-teal-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Email
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {paymentData.applePayType === 'phone' ? 'Phone Number' : 'Email Address'}
                        </label>
                        <input
                          type={paymentData.applePayType === 'phone' ? 'tel' : 'email'}
                          value={paymentData.applePayContact}
                          onChange={(e) => setPaymentData({...paymentData, applePayContact: e.target.value})}
                          placeholder={paymentData.applePayType === 'phone' ? 'Enter phone number' : 'Enter email address'}
                          className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod && (
                    <div className="mt-8">
                      <button
                        onClick={savePaymentInfo}
                        className="bg-gradient-to-r from-teal-600 to-teal-600 text-white px-6 md:px-8 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-teal-700 transition-all"
                      >
                        Save Payment Information
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4 md:space-y-6">
                  <div className="bg-teal-50 rounded-2xl p-6">
                    <h3 className="text-base md:text-xl font-bold text-gray-800 mb-4">Preferred Payment Method</h3>
                    <div className="flex items-center gap-4">
                      <div className="bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold">
                        {paymentMethod === 'ach' && 'ACH / Bank Transfer'}
                        {paymentMethod === 'zelle' && 'Zelle'}
                        {paymentMethod === 'cashapp' && 'Cash App'}
                        {paymentMethod === 'paypal' && 'PayPal'}
                        {paymentMethod === 'venmo' && 'Venmo'}
                        {paymentMethod === 'applepay' && 'Apple Pay'}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h4 className="text-lg font-bold text-gray-800 mb-4">Payment Details</h4>
                    {paymentMethod === 'ach' && paymentData.accountNumber && (
                      <div className="space-y-2">
                        <p className="text-gray-700">
                          <span className="font-semibold">Account:</span> {maskAccountNumber(paymentData.accountNumber)}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Routing:</span> {maskAccountNumber(paymentData.routingNumber)}
                        </p>
                      </div>
                    )}
                    {paymentMethod === 'zelle' && paymentData.zelleContact && (
                      <p className="text-gray-700">
                        <span className="font-semibold">{paymentData.zelleType === 'phone' ? 'Phone:' : 'Email:'}</span> {paymentData.zelleContact}
                      </p>
                    )}
                    {paymentMethod === 'cashapp' && paymentData.cashTag && (
                      <p className="text-gray-700">
                        <span className="font-semibold">Cash Tag:</span> {paymentData.cashTag}
                      </p>
                    )}
                    {paymentMethod === 'paypal' && paymentData.paypalContact && (
                      <p className="text-gray-700">
                        <span className="font-semibold">{paymentData.paypalType === 'email' ? 'Email:' : 'Username:'}</span> {paymentData.paypalContact}
                      </p>
                    )}
                    {paymentMethod === 'venmo' && paymentData.venmoUsername && (
                      <p className="text-gray-700">
                        <span className="font-semibold">Username:</span> {paymentData.venmoUsername}
                      </p>
                    )}
                    {paymentMethod === 'applepay' && paymentData.applePayContact && (
                      <p className="text-gray-700">
                        <span className="font-semibold">{paymentData.applePayType === 'phone' ? 'Phone:' : 'Email:'}</span> {paymentData.applePayContact}
                      </p>
                    )}
                  </div>

                  {licensePhoto && (
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h4 className="text-lg font-bold text-gray-800 mb-4">Verification</h4>
                      <p className="text-green-600 font-semibold">✓ Identity verified</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-xl">
              <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-6">Commission Calculator</h2>
              <p className="text-gray-600 mb-8">
                Calculate your potential earnings by selecting the services your referral might purchase.
              </p>

              <div className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Pro Plan (Recurring)</label>
                    <select
                      value={calculatorProPlan}
                      onChange={(e) => setCalculatorProPlan(e.target.value)}
                      className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                    >
                      <option value="none">No Pro Plan</option>
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
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Website Package (One-Time)</label>
                    <select
                      value={calculatorWebsite}
                      onChange={(e) => setCalculatorWebsite(e.target.value)}
                      className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                    >
                      <option value="none">No Website Package</option>
                      <option value="website-starter">Starter Website - $500</option>
                      <option value="website-professional">Professional Website - $1,500</option>
                      <option value="website-premium">Premium Website - $3,500</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Automation Package (One-Time)</label>
                    <select
                      value={calculatorAutomation}
                      onChange={(e) => setCalculatorAutomation(e.target.value)}
                      className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                    >
                      <option value="none">No Automation Package</option>
                      <option value="automation-starter">Starter Automation - $500</option>
                      <option value="automation-professional">Professional Automation - $1,500</option>
                      <option value="automation-enterprise">Enterprise Automation - $3,500</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Portal Package (One-Time)</label>
                    <select
                      value={calculatorPortal}
                      onChange={(e) => setCalculatorPortal(e.target.value)}
                      className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                    >
                      <option value="none">No Portal Package</option>
                      <option value="portal-starter">Starter Portal - $750</option>
                      <option value="portal-professional">Professional Portal - $2,000</option>
                      <option value="portal-enterprise">Enterprise Portal - $4,000</option>
                    </select>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-8">
                  <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-6">Your Commission Breakdown</h3>
                  
                  <div className="space-y-4">
                    {calculatorProPlan !== 'none' && (
                      <div className="bg-white rounded-xl p-4">
                        <div className="text-sm text-gray-600 mb-1">Pro Plan (Recurring)</div>
                        <div className="text-lg md:text-2xl font-bold text-gray-800">${commissionResults.proPlanPrice}/month</div>
                        <div className="text-sm text-teal-600 font-semibold mt-1">
                          Monthly Commission: ${commissionResults.monthlyRecurring}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          Recurring for up to 12 months = ${commissionResults.total12Months} total
                        </div>
                      </div>
                    )}

                    {(calculatorWebsite !== 'none' || calculatorAutomation !== 'none' || calculatorPortal !== 'none') && (
                      <div className="bg-white rounded-xl p-4">
                        <div className="text-sm text-gray-600 mb-3">One-Time Services</div>
                        
                        {calculatorWebsite !== 'none' && (
                          <div className="mb-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-700">Website Package</span>
                              <span className="font-semibold text-teal-600">${commissionResults.websiteCommission}</span>
                            </div>
                          </div>
                        )}

                        {calculatorAutomation !== 'none' && (
                          <div className="mb-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-700">Automation Package</span>
                              <span className="font-semibold text-teal-600">${commissionResults.automationCommission}</span>
                            </div>
                          </div>
                        )}

                        {calculatorPortal !== 'none' && (
                          <div className="mb-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-700">Portal Package</span>
                              <span className="font-semibold text-teal-600">${commissionResults.portalCommission}</span>
                            </div>
                          </div>
                        )}

                        <div className="border-t border-gray-200 mt-3 pt-3">
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-800">One-Time Total</span>
                            <span className="font-bold text-teal-600">${commissionResults.totalOneTime}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-gradient-to-r from-teal-600 to-teal-600 rounded-xl p-6 text-white">
                      <div className="text-sm mb-2">First Month Earnings</div>
                      <div className="text-4xl font-black">${commissionResults.firstMonthTotal}</div>
                      <div className="text-xs mt-1 text-teal-100">
                        (One-time services + First recurring payment)
                      </div>
                    </div>

                    {calculatorProPlan !== 'none' && (
                      <div className="bg-white rounded-xl p-4 border-2 border-teal-600">
                        <div className="text-sm text-gray-600 mb-2">📅 Total Over 12 Months</div>
                        <div className="text-xl md:text-3xl font-bold text-teal-600">${commissionResults.year1Total}</div>
                        <p className="text-xs text-gray-600 mt-2">
                          Includes all recurring payments + one-time commissions
                        </p>
                      </div>
                    )}

                    <div className="bg-white rounded-xl p-4">
                      <div className="text-sm text-gray-600 mb-2">📊 Commission Details</div>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• 10% on all Pro Plans (up to 12 months)</li>
                        <li>• 10% on all service builds (one-time)</li>
                        <li>• Monthly payouts on schedule</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      <button
        onClick={() => setShowSupportWidget(!showSupportWidget)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-teal-600 to-teal-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all z-40"
      >
        <span className="text-2xl">💬</span>
      </button>

      {showSupportWidget && (
        <div className="fixed bottom-24 right-6 w-96 bg-white rounded-3xl shadow-2xl z-50">
          <div className="bg-gradient-to-r from-teal-600 to-teal-600 text-white p-6 rounded-t-3xl">
            <h3 className="text-base md:text-xl font-bold">Need Help?</h3>
            <p className="text-sm text-teal-100">We're here to support you!</p>
          </div>
          <div className="p-6">
            <textarea
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              placeholder="Describe your issue or question..."
              className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 h-32 mb-4 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
            ></textarea>
            <div className="flex gap-3">
              <button
                onClick={submitSupportTicket}
                className="flex-1 bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-all"
              >
                Submit Ticket
              </button>
              <button
                onClick={() => setShowSupportWidget(false)}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                Close
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Or contact us directly:</p>
              <p className="text-sm text-teal-600 font-semibold">📧 support@kinectb2b.com</p>
              <p className="text-sm text-teal-600 font-semibold">📞 1-800-KINECT</p>
            </div>
          </div>
        </div>
      )}

      {showReferralModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-3xl font-bold text-gray-800">Add Manual Referral</h2>
              <button
                onClick={() => setShowReferralModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Client Name</label>
                <input
                  type="text"
                  value={manualReferral.clientName}
                  onChange={(e) => setManualReferral({...manualReferral, clientName: e.target.value})}
                  className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Client Email</label>
                <input
                  type="email"
                  value={manualReferral.clientEmail}
                  onChange={(e) => setManualReferral({...manualReferral, clientEmail: e.target.value})}
                  className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Client Phone</label>
                <input
                  type="tel"
                  value={manualReferral.clientPhone}
                  onChange={handleManualReferralPhoneChange}
                  placeholder="xxx-xxx-xxxx"
                  maxLength="12"
                  className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  value={manualReferral.clientCompany}
                  onChange={(e) => setManualReferral({...manualReferral, clientCompany: e.target.value})}
                  className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pro Plan</label>
                <select
                  value={manualReferral.proPlan}
                  onChange={(e) => setManualReferral({...manualReferral, proPlan: e.target.value})}
                  className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                >
                  <option value="">Select a Pro Plan</option>
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
                  value={manualReferral.websitePackage}
                  onChange={(e) => setManualReferral({...manualReferral, websitePackage: e.target.value})}
                  className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
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
                  value={manualReferral.automationPackage}
                  onChange={(e) => setManualReferral({...manualReferral, automationPackage: e.target.value})}
                  className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
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
                  value={manualReferral.portalPackage}
                  onChange={(e) => setManualReferral({...manualReferral, portalPackage: e.target.value})}
                  className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
                >
                  <option value="none">No Portal Package</option>
                  <option value="portal-starter">Starter Portal - $750</option>
                  <option value="portal-professional">Professional Portal - $2,000</option>
                  <option value="portal-enterprise">Enterprise Portal - $4,000</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-8">
              <button
                onClick={submitManualReferral}
                className="flex-1 bg-gradient-to-r from-teal-600 to-teal-600 text-white px-6 md:px-8 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-teal-700 transition-all"
              >
                Submit Referral
              </button>
              <button
                onClick={() => setShowReferralModal(false)}
                className="w-full sm:flex-1 bg-gray-200 text-gray-700 px-6 md:px-8 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showPayoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-4">Request Payout</h3>
            
            <div className="bg-teal-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Total Available Balance</p>
              <p className="text-xl md:text-3xl font-bold text-teal-600">${affiliate.pending_payout?.toFixed(2) || '0.00'}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Enter Amount to Withdraw</label>
              <input
                type="number"
                value={payoutAmount}
                onChange={(e) => {
                  setPayoutAmount(e.target.value);
                  setPayoutError('');
                }}
                placeholder="Enter amount"
                min="100"
                step="0.01"
                className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-600 text-sm md:text-base text-gray-800 bg-white text-sm md:text-base text-gray-800 bg-white"
              />
              {payoutError && (
                <p className="text-red-600 text-sm mt-2">{payoutError}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">Minimum withdrawal: $100</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3"><button
  onClick={requestPayout}
  disabled={isRequestingPayout}
  className={`flex-1 px-6 md:px-8 py-3 rounded-xl font-semibold transition-all ${
    isRequestingPayout
      ? 'bg-gray-400 cursor-not-allowed text-white'
      : 'bg-gradient-to-r from-teal-600 to-teal-600 text-white hover:from-teal-700 hover:to-teal-700'
  }`}
>
  {isRequestingPayout ? 'Processing...' : 'Confirm Payout'}
</button>
<button
  onClick={() => {
    setShowPayoutModal(false);
    setPayoutError('');
    setPayoutAmount('');
  }}
  className="w-full sm:flex-1 bg-gray-200 text-gray-700 px-6 md:px-8 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
>
  Cancel
</button>
            </div>
          </div>
        </div>
      )}

      {showOnboarding && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-4">Welcome to Your Affiliate Dashboard! 🎉</h2>
            {onboardingStep === 0 && (
              <div>
                <p className="text-gray-700 mb-6">Let's get you started with a quick tour of your new dashboard.</p>
                <button
                  onClick={() => setOnboardingStep(1)}
                  className="bg-gradient-to-r from-teal-600 to-teal-600 text-white px-6 md:px-8 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-teal-700 transition-all"
                >
                  Start Tour
                </button>
              </div>
            )}
            {onboardingStep === 1 && (
              <div>
                <p className="text-gray-700 mb-6">📊 Your Dashboard shows all your stats, goals, and recent activity in one place.</p>
                <button
                  onClick={() => setOnboardingStep(2)}
                  className="bg-gradient-to-r from-teal-600 to-teal-600 text-white px-6 md:px-8 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-teal-700 transition-all"
                >
                  Next
                </button>
              </div>
            )}
            {onboardingStep === 2 && (
              <div>
                <p className="text-gray-700 mb-6">🔗 Share your unique referral link to start earning commissions. It's that simple!</p>
                <button
                  onClick={() => setOnboardingStep(3)}
                  className="bg-gradient-to-r from-teal-600 to-teal-600 text-white px-6 md:px-8 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-teal-700 transition-all"
                >
                  Next
                </button>
              </div>
            )}
            {onboardingStep === 3 && (
              <div>
                <p className="text-gray-700 mb-6">🎯 Set monthly goals and track your progress. Earn achievements as you grow!</p>
                <button
                  onClick={completeOnboarding}
                  className="bg-gradient-to-r from-teal-600 to-teal-600 text-white px-6 md:px-8 py-3 rounded-xl font-semibold hover:from-teal-700 hover:to-teal-700 transition-all"
                >
                  Get Started!
                </button>
              </div>
            )}
          </div>
        </div>
      )}
        </main>

        {/* Footer */}
        <footer className="py-6 text-center border-t border-slate-200 bg-white">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img src="/icon.png" alt="Kinect B2B" className="w-5 h-5 rounded" />
            <span className="text-slate-500 text-sm">Powered by <span className="font-semibold text-slate-700">Kinect B2B</span></span>
          </div>
          <p className="text-slate-400 text-xs">© {new Date().getFullYear()} Kinect B2B. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}