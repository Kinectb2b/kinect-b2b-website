'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zsjmqlsnvkbtdhjbtwkr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzam1xbHNudmtidGRoamJ0d2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMzcxOTYsImV4cCI6MjA3NzYxMzE5Nn0.vsbFj5m6pCaoVpHKpB3SZ2WzF4yRufOd27NlcEPhHGc'
);

export default function Profile({ currentUser, setCurrentUser }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: 'Sales Representative',
    profile_photo_url: '',
    password: '',
    first_month_commission: 50,
    recurring_commission: 10,
    payment_method: '',
    routing_number: '',
    account_number: '',
    zelle_contact: '',
    mailing_address: '',
    // Tax info
    tax_legal_name: '',
    tax_id_type: '',
    tax_id_number: '',
    tax_business_name: '',
    tax_street1: '',
    tax_street2: '',
    tax_suite: '',
    tax_city: '',
    tax_state: '',
    tax_zip: '',
    tax_info_completed: false,
    drivers_license_front_url: '',
    drivers_license_back_url: '',
    drivers_license_uploaded: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Password fields
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  
  // Payment editing
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPayment, setEditingPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    payment_method: '',
    routing_number: '',
    account_number: '',
    confirm_account_number: '',
    zelle_contact: '',
    mailing_address: '',
  });
  
  // Tax info
  const [editingTax, setEditingTax] = useState(false);
  const [taxForm, setTaxForm] = useState({
    tax_legal_name: '',
    tax_id_type: 'ssn',
    tax_id_number: '',
    tax_business_name: '',
    tax_street1: '',
    tax_street2: '',
    tax_suite: '',
    tax_city: '',
    tax_state: '',
    tax_zip: '',
  });
  const [stateSearch, setStateSearch] = useState('');
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [uploadingLicenseFront, setUploadingLicenseFront] = useState(false);
  const [uploadingLicenseBack, setUploadingLicenseBack] = useState(false);
  
  const US_STATES = [
    { code: 'AL', name: 'Alabama' },
    { code: 'AK', name: 'Alaska' },
    { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' },
    { code: 'CA', name: 'California' },
    { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' },
    { code: 'DE', name: 'Delaware' },
    { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' },
    { code: 'HI', name: 'Hawaii' },
    { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' },
    { code: 'IN', name: 'Indiana' },
    { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' },
    { code: 'KY', name: 'Kentucky' },
    { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' },
    { code: 'MD', name: 'Maryland' },
    { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' },
    { code: 'MN', name: 'Minnesota' },
    { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' },
    { code: 'MT', name: 'Montana' },
    { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' },
    { code: 'NH', name: 'New Hampshire' },
    { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' },
    { code: 'NY', name: 'New York' },
    { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' },
    { code: 'OH', name: 'Ohio' },
    { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' },
    { code: 'PA', name: 'Pennsylvania' },
    { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' },
    { code: 'SD', name: 'South Dakota' },
    { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' },
    { code: 'UT', name: 'Utah' },
    { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' },
    { code: 'WA', name: 'Washington' },
    { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' },
    { code: 'WY', name: 'Wyoming' },
    { code: 'DC', name: 'Washington DC' },
  ];
  
  const filteredStates = US_STATES.filter(state => 
    state.name.toLowerCase().includes(stateSearch.toLowerCase()) ||
    state.code.toLowerCase().includes(stateSearch.toLowerCase())
  );
  
  const fileInputRef = useRef(null);
  const licenseFrontRef = useRef(null);
  const licenseBackRef = useRef(null);

  useEffect(() => {
    if (currentUser?.email) {
      fetchProfile();
    }
  }, [currentUser]);

  // Close state dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showStateDropdown && !e.target.closest('.state-dropdown-container')) {
        setShowStateDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showStateDropdown]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('sales_users')
        .select('*')
        .ilike('email', currentUser.email)
        .single();

      if (data) {
        setProfile({
          full_name: data.full_name || data.username || '',
          email: data.email || '',
          phone: data.phone || '',
          role: data.role || 'Sales Representative',
          profile_photo_url: data.profile_photo_url || '',
          password: data.password || '',
          first_month_commission: data.first_month_commission || 50,
          recurring_commission: data.recurring_commission || 10,
          payment_method: data.payment_method || '',
          routing_number: data.routing_number || '',
          account_number: data.account_number || '',
          zelle_contact: data.zelle_contact || '',
          mailing_address: data.mailing_address || '',
          // Tax info
          tax_legal_name: data.tax_legal_name || '',
          tax_id_type: data.tax_id_type || '',
          tax_id_number: data.tax_id_number || '',
          tax_business_name: data.tax_business_name || '',
          tax_street1: data.tax_street1 || '',
          tax_street2: data.tax_street2 || '',
          tax_suite: data.tax_suite || '',
          tax_city: data.tax_city || '',
          tax_state: data.tax_state || '',
          tax_zip: data.tax_zip || '',
          tax_info_completed: data.tax_info_completed || false,
          drivers_license_front_url: data.drivers_license_front_url || '',
          drivers_license_back_url: data.drivers_license_back_url || '',
          drivers_license_uploaded: data.drivers_license_uploaded || false,
        });
        
        setPaymentForm({
          payment_method: data.payment_method || '',
          routing_number: data.routing_number || '',
          account_number: data.account_number || '',
          confirm_account_number: data.account_number || '',
          zelle_contact: data.zelle_contact || '',
          mailing_address: data.mailing_address || '',
        });
        
        setTaxForm({
          tax_legal_name: data.tax_legal_name || '',
          tax_id_type: data.tax_id_type || 'ssn',
          tax_id_number: data.tax_id_number || '',
          tax_business_name: data.tax_business_name || '',
          tax_street1: data.tax_street1 || '',
          tax_street2: data.tax_street2 || '',
          tax_suite: data.tax_suite || '',
          tax_city: data.tax_city || '',
          tax_state: data.tax_state || '',
          tax_zip: data.tax_zip || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase
        .from('sales_users')
        .update({
          phone: profile.phone,
        })
        .ilike('email', currentUser.email);

      if (error) throw error;

      setCurrentUser(prev => ({
        ...prev,
        phone: profile.phone,
      }));

      setEditingProfile(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: 'Failed to save profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'Please enter both password fields.' });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setChangingPassword(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase
        .from('sales_users')
        .update({ password: newPassword })
        .ilike('email', currentUser.email);

      if (error) throw error;

      setProfile(prev => ({ ...prev, password: newPassword }));
      setNewPassword('');
      setConfirmPassword('');
      setMessage({ type: 'success', text: 'Password updated successfully!' });
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage({ type: 'error', text: 'Failed to update password.' });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file.' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be less than 5MB.' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser.email.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.${fileExt}`;
      const filePath = `profile-photos/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('sales-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('sales-assets')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      const { error: updateError } = await supabase
        .from('sales_users')
        .update({ profile_photo_url: publicUrl })
        .ilike('email', currentUser.email);

      if (updateError) throw updateError;

      setProfile(prev => ({ ...prev, profile_photo_url: publicUrl }));
      setCurrentUser(prev => ({ ...prev, profile_photo_url: publicUrl }));
      setMessage({ type: 'success', text: 'Photo uploaded successfully!' });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      setMessage({ type: 'error', text: `Failed to upload: ${error.message}` });
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!profile.profile_photo_url) return;
    if (!confirm('Are you sure you want to remove your profile photo?')) return;

    try {
      const urlParts = profile.profile_photo_url.split('/profile-photos/');
      if (urlParts.length > 1) {
        const fileName = urlParts[1];
        await supabase.storage.from('sales-assets').remove([`profile-photos/${fileName}`]);
      }

      await supabase
        .from('sales_users')
        .update({ profile_photo_url: null })
        .ilike('email', currentUser.email);

      setProfile(prev => ({ ...prev, profile_photo_url: '' }));
      setCurrentUser(prev => ({ ...prev, profile_photo_url: '' }));
      setMessage({ type: 'success', text: 'Photo removed successfully!' });
    } catch (error) {
      console.error('Error removing photo:', error);
      setMessage({ type: 'error', text: 'Failed to remove photo.' });
    }
  };

  const handleSavePayment = async () => {
    // Validate ACH
    if (paymentForm.payment_method === 'ach') {
      if (!paymentForm.routing_number || !paymentForm.account_number) {
        setMessage({ type: 'error', text: 'Please enter routing and account numbers.' });
        return;
      }
      if (paymentForm.account_number !== paymentForm.confirm_account_number) {
        setMessage({ type: 'error', text: 'Account numbers do not match.' });
        return;
      }
    }
    
    // Validate Zelle
    if (paymentForm.payment_method === 'zelle' && !paymentForm.zelle_contact) {
      setMessage({ type: 'error', text: 'Please enter your Zelle phone or email.' });
      return;
    }
    
    // Validate Check
    if (paymentForm.payment_method === 'check' && !paymentForm.mailing_address) {
      setMessage({ type: 'error', text: 'Please enter your mailing address.' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase
        .from('sales_users')
        .update({
          payment_method: paymentForm.payment_method,
          routing_number: paymentForm.payment_method === 'ach' ? paymentForm.routing_number : null,
          account_number: paymentForm.payment_method === 'ach' ? paymentForm.account_number : null,
          zelle_contact: paymentForm.payment_method === 'zelle' ? paymentForm.zelle_contact : null,
          mailing_address: paymentForm.payment_method === 'check' ? paymentForm.mailing_address : null,
        })
        .ilike('email', currentUser.email);

      if (error) throw error;

      setProfile(prev => ({
        ...prev,
        payment_method: paymentForm.payment_method,
        routing_number: paymentForm.payment_method === 'ach' ? paymentForm.routing_number : '',
        account_number: paymentForm.payment_method === 'ach' ? paymentForm.account_number : '',
        zelle_contact: paymentForm.payment_method === 'zelle' ? paymentForm.zelle_contact : '',
        mailing_address: paymentForm.payment_method === 'check' ? paymentForm.mailing_address : '',
      }));

      setEditingPayment(false);
      setMessage({ type: 'success', text: 'Payment info saved successfully!' });
    } catch (error) {
      console.error('Error saving payment info:', error);
      setMessage({ type: 'error', text: 'Failed to save payment info.' });
    } finally {
      setSaving(false);
    }
  };

  const maskAccountNumber = (num) => {
    if (!num || num.length < 4) return num;
    return '••••••' + num.slice(-4);
  };

  const maskTaxId = (num) => {
    if (!num || num.length < 4) return num;
    return '•••-••-' + num.slice(-4);
  };

  const handleSaveTaxInfo = async () => {
    if (!taxForm.tax_legal_name) {
      setMessage({ type: 'error', text: 'Please enter your legal name.' });
      return;
    }
    if (!taxForm.tax_id_number) {
      setMessage({ type: 'error', text: 'Please enter your SSN or EIN.' });
      return;
    }
    if (!taxForm.tax_street1) {
      setMessage({ type: 'error', text: 'Please enter your street address.' });
      return;
    }
    if (!taxForm.tax_city) {
      setMessage({ type: 'error', text: 'Please enter your city.' });
      return;
    }
    if (!taxForm.tax_state) {
      setMessage({ type: 'error', text: 'Please select your state.' });
      return;
    }
    if (!taxForm.tax_zip) {
      setMessage({ type: 'error', text: 'Please enter your ZIP code.' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase
        .from('sales_users')
        .update({
          tax_legal_name: taxForm.tax_legal_name,
          tax_id_type: taxForm.tax_id_type,
          tax_id_number: taxForm.tax_id_number,
          tax_business_name: taxForm.tax_business_name,
          tax_street1: taxForm.tax_street1,
          tax_street2: taxForm.tax_street2,
          tax_suite: taxForm.tax_suite,
          tax_city: taxForm.tax_city,
          tax_state: taxForm.tax_state,
          tax_zip: taxForm.tax_zip,
          tax_info_completed: true,
        })
        .ilike('email', currentUser.email);

      if (error) throw error;

      setProfile(prev => ({
        ...prev,
        tax_legal_name: taxForm.tax_legal_name,
        tax_id_type: taxForm.tax_id_type,
        tax_id_number: taxForm.tax_id_number,
        tax_business_name: taxForm.tax_business_name,
        tax_street1: taxForm.tax_street1,
        tax_street2: taxForm.tax_street2,
        tax_suite: taxForm.tax_suite,
        tax_city: taxForm.tax_city,
        tax_state: taxForm.tax_state,
        tax_zip: taxForm.tax_zip,
        tax_info_completed: true,
      }));

      setEditingTax(false);
      setMessage({ type: 'success', text: 'Tax information saved successfully!' });
    } catch (error) {
      console.error('Error saving tax info:', error);
      setMessage({ type: 'error', text: 'Failed to save tax information.' });
    } finally {
      setSaving(false);
    }
  };

  const handleUploadLicense = async (e, side) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file.' });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be less than 10MB.' });
      return;
    }

    if (side === 'front') {
      setUploadingLicenseFront(true);
    } else {
      setUploadingLicenseBack(true);
    }
    setMessage({ type: '', text: '' });

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${currentUser.email.replace(/[^a-zA-Z0-9]/g, '-')}-license-${side}-${Date.now()}.${fileExt}`;
      const filePath = `drivers-licenses/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('sales-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('sales-assets')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      const updateField = side === 'front' ? 'drivers_license_front_url' : 'drivers_license_back_url';
      
      // Check if both sides will be uploaded after this
      const willHaveBoth = side === 'front' 
        ? (profile.drivers_license_back_url || false)
        : (profile.drivers_license_front_url || false);

      const { error: updateError } = await supabase
        .from('sales_users')
        .update({ 
          [updateField]: publicUrl,
          drivers_license_uploaded: side === 'front' ? !!profile.drivers_license_back_url : true,
        })
        .ilike('email', currentUser.email);

      if (updateError) throw updateError;

      setProfile(prev => ({ 
        ...prev, 
        [updateField]: publicUrl,
        drivers_license_uploaded: side === 'front' ? !!prev.drivers_license_back_url : true,
      }));
      
      setMessage({ type: 'success', text: `License ${side} uploaded successfully!` });

      if (side === 'front' && licenseFrontRef.current) {
        licenseFrontRef.current.value = '';
      }
      if (side === 'back' && licenseBackRef.current) {
        licenseBackRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading license:', error);
      setMessage({ type: 'error', text: `Failed to upload: ${error.message}` });
    } finally {
      if (side === 'front') {
        setUploadingLicenseFront(false);
      } else {
        setUploadingLicenseBack(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="text-2xl font-bold text-gray-400">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              👤 My Profile
            </h2>
            <p className="text-gray-500 mt-1">Manage your personal information and payment settings</p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 -mb-6 mt-4">
          <button
            onClick={() => { setActiveTab('profile'); setMessage({ type: '', text: '' }); }}
            className={`px-6 py-3 font-bold text-sm transition-colors relative ${
              activeTab === 'profile'
                ? 'text-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Profile
            {activeTab === 'profile' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-600 rounded-t-full"></div>
            )}
          </button>
          <button
            onClick={() => { setActiveTab('payments'); setMessage({ type: '', text: '' }); }}
            className={`px-6 py-3 font-bold text-sm transition-colors relative ${
              activeTab === 'payments'
                ? 'text-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Payments
            {activeTab === 'payments' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-600 rounded-t-full"></div>
            )}
          </button>
          <button
            onClick={() => { setActiveTab('tax'); setMessage({ type: '', text: '' }); }}
            className={`px-6 py-3 font-bold text-sm transition-colors relative ${
              activeTab === 'tax'
                ? 'text-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Tax Info
            {activeTab === 'tax' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-600 rounded-t-full"></div>
            )}
          </button>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-xl font-medium ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Photo Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-6 text-center">Profile Photo</h3>
            
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-40 h-40 rounded-full overflow-hidden bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                  {profile.profile_photo_url ? (
                    <img 
                      src={profile.profile_photo_url} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl font-black text-white">
                      {profile.full_name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  )}
                </div>
                
                {uploading && (
                  <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold">Uploading...</span>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div className="mt-6 flex flex-col gap-2 w-full">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50"
                >
                  {uploading ? '⏳ Uploading...' : '📷 Upload Photo'}
                </button>
                
                {profile.profile_photo_url && (
                  <button
                    onClick={handleRemovePhoto}
                    className="w-full py-3 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 transition"
                  >
                    🗑️ Remove Photo
                  </button>
                )}
              </div>

              <p className="text-gray-400 text-xs text-center mt-4">
                JPG, PNG or GIF. Max 5MB.
              </p>
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Profile Information</h3>
                {!editingProfile && (
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition"
                  >
                    ✏️ Edit
                  </button>
                )}
              </div>
              
              {/* View Mode */}
              {!editingProfile ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500 font-medium">Full Name</p>
                      <p className="text-xl font-bold text-gray-900">{profile.full_name || '—'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500 font-medium">Email</p>
                      <p className="text-xl font-bold text-gray-900">{profile.email || '—'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500 font-medium">Phone Number</p>
                      <p className="text-xl font-bold text-gray-900">{profile.phone || '—'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500 font-medium">Role</p>
                      <p className="text-xl font-bold text-gray-900">{profile.role || '—'}</p>
                    </div>
                  </div>

                  {/* Commission Rates */}
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-bold text-gray-700 mb-4">Commission Rates</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 rounded-xl p-4">
                        <p className="text-green-700 text-sm font-medium">First Month</p>
                        <p className="text-2xl font-black text-green-600">
                          {profile.first_month_commission}%
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-blue-700 text-sm font-medium">Recurring</p>
                        <p className="text-2xl font-black text-blue-600">
                          {profile.recurring_commission}%
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Commission rates are set by management.
                    </p>
                  </div>
                </div>
              ) : (
                /* Edit Mode */
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profile.full_name}
                        disabled
                        className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-500 font-medium cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-400 mt-1">Contact admin to change</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-500 font-medium cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 font-medium"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
                      <input
                        type="text"
                        value={profile.role}
                        disabled
                        className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-500 font-medium cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-400 mt-1">Contact admin to change</p>
                    </div>
                  </div>

                  {/* Commission Rates */}
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-bold text-gray-700 mb-4">Commission Rates</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 rounded-xl p-4">
                        <p className="text-green-700 text-sm font-medium">First Month</p>
                        <p className="text-2xl font-black text-green-600">
                          {profile.first_month_commission}%
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-blue-700 text-sm font-medium">Recurring</p>
                        <p className="text-2xl font-black text-blue-600">
                          {profile.recurring_commission}%
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Commission rates are set by management.
                    </p>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      onClick={() => setEditingProfile(false)}
                      className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex-1 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : '💾 Save Changes'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Password Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 text-lg mb-6">Password</h3>
              
              {/* Current Password Display */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                <div className="flex items-center gap-2">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={profile.password}
                    disabled
                    className="flex-1 px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-700 font-medium cursor-not-allowed"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="px-4 py-3 bg-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-300 transition"
                  >
                    {showPassword ? '🙈 Hide' : '👁️ Show'}
                  </button>
                </div>
              </div>

              {/* Change Password */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-bold text-gray-700 mb-4">Change Password</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 font-medium"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 font-medium"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-red-500 text-sm mb-4">⚠️ Passwords do not match</p>
                )}
                <button
                  onClick={handleChangePassword}
                  disabled={changingPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {changingPassword ? 'Updating...' : '🔐 Update Password'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Payment Information</h3>
              <p className="text-gray-500 text-sm">How you'll receive your commission payments</p>
            </div>
            {!editingPayment && profile.payment_method && (
              <button
                onClick={() => setEditingPayment(true)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition"
              >
                ✏️ Edit
              </button>
            )}
          </div>

          {/* View Mode */}
          {!editingPayment && profile.payment_method ? (
            <div className="space-y-6">
              {/* Payment Method Badge */}
              <div className="flex items-center gap-3">
                <div className={`px-4 py-2 rounded-full font-bold text-sm ${
                  profile.payment_method === 'ach' 
                    ? 'bg-blue-100 text-blue-800' 
                    : profile.payment_method === 'zelle'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {profile.payment_method === 'ach' && '🏦 ACH Transfer'}
                  {profile.payment_method === 'zelle' && '💸 Zelle'}
                  {profile.payment_method === 'check' && '📬 Check'}
                </div>
              </div>

              {/* ACH Details */}
              {profile.payment_method === 'ach' && (
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Routing Number</p>
                      <p className="text-xl font-bold text-gray-900">{profile.routing_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Account Number</p>
                      <p className="text-xl font-bold text-gray-900">{maskAccountNumber(profile.account_number)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Zelle Details */}
              {profile.payment_method === 'zelle' && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-sm text-gray-500 font-medium">Zelle Phone/Email</p>
                  <p className="text-xl font-bold text-gray-900">{profile.zelle_contact}</p>
                </div>
              )}

              {/* Check Details */}
              {profile.payment_method === 'check' && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-sm text-gray-500 font-medium">Mailing Address</p>
                  <p className="text-xl font-bold text-gray-900 whitespace-pre-line">{profile.mailing_address}</p>
                </div>
              )}
            </div>
          ) : (
            /* Edit Mode / No Payment Set */
            <div className="space-y-6">
              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Select Payment Method</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setPaymentForm(prev => ({ ...prev, payment_method: 'ach' }))}
                    className={`p-4 rounded-xl border-2 transition text-left ${
                      paymentForm.payment_method === 'ach'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">🏦</div>
                    <div className="font-bold text-gray-900">ACH Transfer</div>
                    <div className="text-sm text-gray-500">Direct deposit to your bank</div>
                  </button>
                  
                  <button
                    onClick={() => setPaymentForm(prev => ({ ...prev, payment_method: 'zelle' }))}
                    className={`p-4 rounded-xl border-2 transition text-left ${
                      paymentForm.payment_method === 'zelle'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">💸</div>
                    <div className="font-bold text-gray-900">Zelle</div>
                    <div className="text-sm text-gray-500">Instant transfer via Zelle</div>
                  </button>
                  
                  <button
                    onClick={() => setPaymentForm(prev => ({ ...prev, payment_method: 'check' }))}
                    className={`p-4 rounded-xl border-2 transition text-left ${
                      paymentForm.payment_method === 'check'
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">📬</div>
                    <div className="font-bold text-gray-900">Check</div>
                    <div className="text-sm text-gray-500">Mailed to your address</div>
                  </button>
                </div>
              </div>

              {/* ACH Form */}
              {paymentForm.payment_method === 'ach' && (
                <div className="bg-blue-50 rounded-xl p-6 space-y-4">
                  <h4 className="font-bold text-blue-900">Bank Account Details</h4>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Routing Number</label>
                    <input
                      type="text"
                      value={paymentForm.routing_number}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, routing_number: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                      placeholder="9 digits"
                      maxLength={9}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Account Number</label>
                    <input
                      type="text"
                      value={paymentForm.account_number}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, account_number: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                      placeholder="Enter account number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Account Number</label>
                    <input
                      type="text"
                      value={paymentForm.confirm_account_number}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, confirm_account_number: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                      placeholder="Re-enter account number"
                    />
                    {paymentForm.account_number && paymentForm.confirm_account_number && 
                     paymentForm.account_number !== paymentForm.confirm_account_number && (
                      <p className="text-red-500 text-sm mt-2">⚠️ Account numbers do not match</p>
                    )}
                  </div>
                </div>
              )}

              {/* Zelle Form */}
              {paymentForm.payment_method === 'zelle' && (
                <div className="bg-purple-50 rounded-xl p-6 space-y-4">
                  <h4 className="font-bold text-purple-900">Zelle Details</h4>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number or Email</label>
                    <input
                      type="text"
                      value={paymentForm.zelle_contact}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, zelle_contact: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 font-medium"
                      placeholder="Enter phone or email registered with Zelle"
                    />
                  </div>
                </div>
              )}

              {/* Check Form */}
              {paymentForm.payment_method === 'check' && (
                <div className="bg-amber-50 rounded-xl p-6 space-y-4">
                  <h4 className="font-bold text-amber-900">Mailing Address</h4>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Address</label>
                    <textarea
                      value={paymentForm.mailing_address}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, mailing_address: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 font-medium"
                      placeholder="123 Main St&#10;Apt 4B&#10;City, State 12345"
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Save / Cancel Buttons */}
              {paymentForm.payment_method && (
                <div className="flex gap-3">
                  {editingPayment && (
                    <button
                      onClick={() => {
                        setEditingPayment(false);
                        setPaymentForm({
                          payment_method: profile.payment_method,
                          routing_number: profile.routing_number,
                          account_number: profile.account_number,
                          confirm_account_number: profile.account_number,
                          zelle_contact: profile.zelle_contact,
                          mailing_address: profile.mailing_address,
                        });
                      }}
                      className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={handleSavePayment}
                    disabled={saving}
                    className="flex-1 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : '💾 Save Payment Info'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tax Info Tab */}
      {activeTab === 'tax' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tax Information Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Tax Information</h3>
                <p className="text-gray-500 text-sm">Required for 1099 reporting</p>
              </div>
              {!editingTax && profile.tax_info_completed && (
                <button
                  onClick={() => setEditingTax(true)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition"
                >
                  ✏️ Edit
                </button>
              )}
            </div>

            {/* Completed View */}
            {profile.tax_info_completed && !editingTax ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                  <div className="text-3xl">✅</div>
                  <div>
                    <p className="font-bold text-green-800">Tax Information Submitted</p>
                    <p className="text-green-700 text-sm">Your W-9 information is on file.</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 font-medium">Legal Name</p>
                    <p className="text-lg font-bold text-gray-900">{profile.tax_legal_name}</p>
                  </div>
                  
                  {profile.tax_business_name && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-500 font-medium">Business Name</p>
                      <p className="text-lg font-bold text-gray-900">{profile.tax_business_name}</p>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 font-medium">{profile.tax_id_type === 'ein' ? 'EIN' : 'SSN'}</p>
                    <p className="text-lg font-bold text-gray-900">{maskTaxId(profile.tax_id_number)}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 font-medium">Address</p>
                    <p className="text-lg font-bold text-gray-900">
                      {profile.tax_street1}
                      {profile.tax_street2 && <>, {profile.tax_street2}</>}
                      {profile.tax_suite && <>, {profile.tax_suite}</>}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {profile.tax_city}, {profile.tax_state} {profile.tax_zip}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Edit/Initial Form */
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Legal Full Name *</label>
                  <input
                    type="text"
                    value={taxForm.tax_legal_name}
                    onChange={(e) => setTaxForm(prev => ({ ...prev, tax_legal_name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 font-medium"
                    placeholder="As it appears on your tax return"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Business Name (if applicable)</label>
                  <input
                    type="text"
                    value={taxForm.tax_business_name}
                    onChange={(e) => setTaxForm(prev => ({ ...prev, tax_business_name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 font-medium"
                    placeholder="LLC or DBA name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tax ID Type *</label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setTaxForm(prev => ({ ...prev, tax_id_type: 'ssn' }))}
                      className={`flex-1 py-3 rounded-xl font-bold transition ${
                        taxForm.tax_id_type === 'ssn'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      SSN (Individual)
                    </button>
                    <button
                      onClick={() => setTaxForm(prev => ({ ...prev, tax_id_type: 'ein' }))}
                      className={`flex-1 py-3 rounded-xl font-bold transition ${
                        taxForm.tax_id_type === 'ein'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      EIN (Business)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {taxForm.tax_id_type === 'ein' ? 'EIN' : 'Social Security Number'} *
                  </label>
                  <input
                    type="text"
                    value={taxForm.tax_id_number}
                    onChange={(e) => setTaxForm(prev => ({ ...prev, tax_id_number: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 font-medium"
                    placeholder={taxForm.tax_id_type === 'ein' ? 'XX-XXXXXXX' : 'XXX-XX-XXXX'}
                  />
                  <p className="text-xs text-gray-400 mt-1">🔒 This information is encrypted and secure.</p>
                </div>

                {/* Address Section */}
                <div className="border-t border-gray-200 pt-5 mt-5">
                  <h4 className="font-bold text-gray-700 mb-4">Address</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Street Address *</label>
                      <input
                        type="text"
                        value={taxForm.tax_street1}
                        onChange={(e) => setTaxForm(prev => ({ ...prev, tax_street1: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 font-medium"
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Street Address 2 <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input
                        type="text"
                        value={taxForm.tax_street2}
                        onChange={(e) => setTaxForm(prev => ({ ...prev, tax_street2: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 font-medium"
                        placeholder="Building, Floor, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Suite / Apt # <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input
                        type="text"
                        value={taxForm.tax_suite}
                        onChange={(e) => setTaxForm(prev => ({ ...prev, tax_suite: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 font-medium"
                        placeholder="Suite 100 or Apt 4B"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">City *</label>
                        <input
                          type="text"
                          value={taxForm.tax_city}
                          onChange={(e) => setTaxForm(prev => ({ ...prev, tax_city: e.target.value }))}
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 font-medium"
                          placeholder="City"
                        />
                      </div>
                      
                      <div className="relative state-dropdown-container">
                        <label className="block text-sm font-bold text-gray-700 mb-2">State *</label>
                        <input
                          type="text"
                          value={stateSearch || taxForm.tax_state}
                          onChange={(e) => {
                            setStateSearch(e.target.value);
                            setShowStateDropdown(true);
                          }}
                          onFocus={() => setShowStateDropdown(true)}
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 font-medium"
                          placeholder="State"
                        />
                        {showStateDropdown && (
                          <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                            {filteredStates.length > 0 ? (
                              filteredStates.map((state) => (
                                <button
                                  key={state.code}
                                  onClick={() => {
                                    setTaxForm(prev => ({ ...prev, tax_state: state.code }));
                                    setStateSearch('');
                                    setShowStateDropdown(false);
                                  }}
                                  className="w-full px-4 py-2 text-left hover:bg-green-50 font-medium flex justify-between items-center"
                                >
                                  <span>{state.name}</span>
                                  <span className="text-gray-400 text-sm">{state.code}</span>
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-2 text-gray-500">No states found</div>
                            )}
                          </div>
                        )}
                        {taxForm.tax_state && !showStateDropdown && (
                          <div className="absolute right-3 top-10 text-green-600 font-bold">
                            {taxForm.tax_state}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="w-1/2 pr-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">ZIP Code *</label>
                      <input
                        type="text"
                        value={taxForm.tax_zip}
                        onChange={(e) => setTaxForm(prev => ({ ...prev, tax_zip: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 font-medium"
                        placeholder="12345"
                        maxLength={10}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  {editingTax && (
                    <button
                      onClick={() => {
                        setEditingTax(false);
                        setTaxForm({
                          tax_legal_name: profile.tax_legal_name,
                          tax_id_type: profile.tax_id_type || 'ssn',
                          tax_id_number: profile.tax_id_number,
                          tax_business_name: profile.tax_business_name,
                          tax_street1: profile.tax_street1,
                          tax_street2: profile.tax_street2,
                          tax_suite: profile.tax_suite,
                          tax_city: profile.tax_city,
                          tax_state: profile.tax_state,
                          tax_zip: profile.tax_zip,
                        });
                        setStateSearch('');
                      }}
                      className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={handleSaveTaxInfo}
                    disabled={saving}
                    className="flex-1 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : '💾 Save Tax Information'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Driver's License Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 text-lg">Driver's License</h3>
              <p className="text-gray-500 text-sm">Upload photos of your ID for verification</p>
            </div>

            {/* Both uploaded - show success */}
            {profile.drivers_license_front_url && profile.drivers_license_back_url ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                  <div className="text-3xl">✅</div>
                  <div>
                    <p className="font-bold text-green-800">Driver's License Uploaded</p>
                    <p className="text-green-700 text-sm">Your ID has been submitted for verification.</p>
                  </div>
                </div>

                {/* Preview thumbnails */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <p className="text-sm font-bold text-gray-700 mb-2">Front</p>
                    <div className="aspect-[1.6/1] rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200">
                      <img 
                        src={profile.drivers_license_front_url} 
                        alt="License Front" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <p className="text-sm font-bold text-gray-700 mb-2">Back</p>
                    <div className="aspect-[1.6/1] rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200">
                      <img 
                        src={profile.drivers_license_back_url} 
                        alt="License Back" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                <p className="text-gray-500 text-sm text-center">
                  Need to update? Contact admin to re-upload.
                </p>
              </div>
            ) : (
              /* Upload Form */
              <div className="space-y-6">
                {/* Front of License */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Front of License *</label>
                  
                  {profile.drivers_license_front_url ? (
                    <div className="relative">
                      <div className="aspect-[1.6/1] rounded-xl overflow-hidden bg-gray-100 border-2 border-green-500">
                        <img 
                          src={profile.drivers_license_front_url} 
                          alt="License Front" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                        ✓ Uploaded
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => licenseFrontRef.current?.click()}
                      className="aspect-[1.6/1] rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition"
                    >
                      {uploadingLicenseFront ? (
                        <div className="text-center">
                          <div className="text-2xl mb-2">⏳</div>
                          <p className="text-gray-600 font-medium">Uploading...</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="text-4xl mb-2">📷</div>
                          <p className="text-gray-600 font-medium">Click to upload front</p>
                          <p className="text-gray-400 text-sm">or drag and drop</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <input
                    ref={licenseFrontRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUploadLicense(e, 'front')}
                    className="hidden"
                  />
                </div>

                {/* Back of License */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Back of License *</label>
                  
                  {profile.drivers_license_back_url ? (
                    <div className="relative">
                      <div className="aspect-[1.6/1] rounded-xl overflow-hidden bg-gray-100 border-2 border-green-500">
                        <img 
                          src={profile.drivers_license_back_url} 
                          alt="License Back" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                        ✓ Uploaded
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => licenseBackRef.current?.click()}
                      className="aspect-[1.6/1] rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition"
                    >
                      {uploadingLicenseBack ? (
                        <div className="text-center">
                          <div className="text-2xl mb-2">⏳</div>
                          <p className="text-gray-600 font-medium">Uploading...</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="text-4xl mb-2">📷</div>
                          <p className="text-gray-600 font-medium">Click to upload back</p>
                          <p className="text-gray-400 text-sm">or drag and drop</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <input
                    ref={licenseBackRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUploadLicense(e, 'back')}
                    className="hidden"
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-xl">💡</div>
                    <div>
                      <p className="font-bold text-yellow-800 text-sm">Tips for a good photo:</p>
                      <ul className="text-yellow-700 text-sm mt-1 space-y-1">
                        <li>• Make sure all text is readable</li>
                        <li>• Avoid glare and shadows</li>
                        <li>• Include all 4 corners of the ID</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}