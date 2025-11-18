'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zsjmqlsnvkbtdhjbtwkr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzam1xbHNudmtidGRoamJ0d2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMzcxOTYsImV4cCI6MjA3NzYxMzE5Nn0.vsbFj5m6pCaoVpHKpB3SZ2WzF4yRufOd27NlcEPhHGc'
);

export default function ClientDashboard() {
  const router = useRouter();
  const [client, setClient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Recent Activities
  const [recentActivities, setRecentActivities] = useState([]);

  // Personal Profile States
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [personalProfile, setPersonalProfile] = useState({
    photo_url: '',
    name: '',
    phone: '',
    email: '',
    job_title: '',
    mailing_address: '',
    city: '',
    state: '',
    zip_code: ''
  });
  const [personalPhotoFile, setPersonalPhotoFile] = useState(null);
  const [personalPhotoPreview, setPersonalPhotoPreview] = useState(null);
  const personalFileInputRef = useRef(null);

  // Company Profile States
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [companyProfile, setCompanyProfile] = useState({
    logo_url: '',
    company_name: '',
    company_email: '',
    company_phone: '',
    company_address: '',
    company_city: '',
    company_state: '',
    company_zip: '',
    number_of_employees: '',
    ein_number: '',
    employees: []
  });
  const [companyLogoFile, setCompanyLogoFile] = useState(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState(null);
  const [showEIN, setShowEIN] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', job_title: '' });
  const companyFileInputRef = useRef(null);

  useEffect(() => {
    const clientData = localStorage.getItem('client');
    if (!clientData) {
      router.push('/portal');
      return;
    }

    const parsedClient = JSON.parse(clientData);
    setClient(parsedClient);
    fetchAppointments(parsedClient.id);
    fetchPersonalProfile(parsedClient.id);
    fetchCompanyProfile(parsedClient.id);
    fetchRecentActivities(parsedClient.id);
  }, [router]);

  const fetchAppointments = async (clientId) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('client_id', clientId)
        .order('appointment_date', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivities = async (clientId) => {
    try {
      // Get appointments from the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('client_id', clientId)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      const activities = (data || []).map(appointment => ({
        id: appointment.id,
        message: `🎉 Congratulations! Check your appointments section to view your new appointment with ${appointment.company_name}`,
        date: new Date(appointment.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      }));

      setRecentActivities(activities);
    } catch (error) {
      console.error('Error fetching recent activities:', error);
    }
  };

  const fetchPersonalProfile = async (clientId) => {
    try {
      const { data, error } = await supabase
        .from('client_personal_profiles')
        .select('*')
        .eq('client_id', clientId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching personal profile:', error);
        return;
      }

      if (data) {
        console.log('Fetched personal profile:', data);
        setPersonalProfile(data);
      }
    } catch (error) {
      console.error('Error fetching personal profile:', error);
    }
  };

  const fetchCompanyProfile = async (clientId) => {
    try {
      const { data, error } = await supabase
        .from('client_company_profiles')
        .select('*')
        .eq('client_id', clientId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching company profile:', error);
        return;
      }

      if (data) {
        console.log('Fetched company profile:', data);
        setCompanyProfile(data);
      }
    } catch (error) {
      console.error('Error fetching company profile:', error);
    }
  };

  const handlePersonalPhotoUpload = async (file) => {
    if (!file) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${client.id}-${Date.now()}.${fileExt}`;
    const filePath = `personal-photos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('client-photos')
      .upload(filePath, file, {
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading photo:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('client-photos')
      .getPublicUrl(filePath);

    console.log('Generated public URL:', data.publicUrl);
    return data.publicUrl;
  };

  const handlePersonalPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPersonalPhotoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPersonalPhotoPreview(previewUrl);
    }
  };

  const handleCompanyLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCompanyLogoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setCompanyLogoPreview(previewUrl);
    }
  };

  const handleCompanyLogoUpload = async (file) => {
    if (!file) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${client.id}-${Date.now()}.${fileExt}`;
    const filePath = `company-logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('client-photos')
      .upload(filePath, file, {
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading logo:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('client-photos')
      .getPublicUrl(filePath);

    console.log('Generated public URL:', data.publicUrl);
    return data.publicUrl;
  };

  const savePersonalProfile = async () => {
    try {
      let photoUrl = personalProfile.photo_url || '';

      if (personalPhotoFile) {
        console.log('Uploading personal photo...');
        const uploadedUrl = await handlePersonalPhotoUpload(personalPhotoFile);
        console.log('Upload result:', uploadedUrl);
        if (uploadedUrl) {
          photoUrl = uploadedUrl;
          console.log('Setting photo URL to:', photoUrl);
        } else {
          console.error('Upload failed - no URL returned');
        }
      }

      const profileData = {
        client_id: client.id,
        photo_url: photoUrl,
        name: personalProfile.name || '',
        phone: personalProfile.phone || '',
        email: personalProfile.email || '',
        job_title: personalProfile.job_title || '',
        mailing_address: personalProfile.mailing_address || '',
        city: personalProfile.city || '',
        state: personalProfile.state || '',
        zip_code: personalProfile.zip_code || ''
      };

      console.log('Saving personal profile data:', profileData);

      const { data, error } = await supabase
        .from('client_personal_profiles')
        .upsert(profileData, { onConflict: 'client_id' })
        .select();

      if (error) throw error;

      console.log('Personal profile saved, returned data:', data);

      // Clean up previews
      setPersonalPhotoFile(null);
      if (personalPhotoPreview) {
        URL.revokeObjectURL(personalPhotoPreview);
        setPersonalPhotoPreview(null);
      }

      // Re-fetch the profile to get the updated data
      await fetchPersonalProfile(client.id);
      
      setIsEditingPersonal(false);
      alert('Personal profile saved successfully!');
    } catch (error) {
      console.error('Error saving personal profile:', error);
      alert('Failed to save personal profile: ' + error.message);
    }
  };

  const saveCompanyProfile = async () => {
    try {
      let logoUrl = companyProfile.logo_url || '';

      if (companyLogoFile) {
        console.log('Uploading company logo...');
        const uploadedUrl = await handleCompanyLogoUpload(companyLogoFile);
        console.log('Upload result:', uploadedUrl);
        if (uploadedUrl) {
          logoUrl = uploadedUrl;
          console.log('Setting logo URL to:', logoUrl);
        } else {
          console.error('Upload failed - no URL returned');
        }
      }

      const profileData = {
        client_id: client.id,
        logo_url: logoUrl,
        company_name: companyProfile.company_name || '',
        company_email: companyProfile.company_email || '',
        company_phone: companyProfile.company_phone || '',
        company_address: companyProfile.company_address || '',
        company_city: companyProfile.company_city || '',
        company_state: companyProfile.company_state || '',
        company_zip: companyProfile.company_zip || '',
        number_of_employees: companyProfile.number_of_employees || '',
        ein_number: companyProfile.ein_number || '',
        employees: companyProfile.employees || []
      };

      console.log('Saving company profile data:', profileData);

      const { data, error } = await supabase
        .from('client_company_profiles')
        .upsert(profileData, { onConflict: 'client_id' })
        .select();

      if (error) throw error;

      console.log('Company profile saved, returned data:', data);

      // Clean up previews
      setCompanyLogoFile(null);
      if (companyLogoPreview) {
        URL.revokeObjectURL(companyLogoPreview);
        setCompanyLogoPreview(null);
      }

      // Re-fetch the profile to get the updated data
      await fetchCompanyProfile(client.id);

      setIsEditingCompany(false);
      alert('Company profile saved successfully!');
    } catch (error) {
      console.error('Error saving company profile:', error);
      alert('Failed to save company profile: ' + error.message);
    }
  };

  const addEmployee = () => {
    if (newEmployee.name && newEmployee.job_title) {
      setCompanyProfile({
        ...companyProfile,
        employees: [...companyProfile.employees, { ...newEmployee, id: Date.now() }]
      });
      setNewEmployee({ name: '', job_title: '' });
    }
  };

  const removeEmployee = (employeeId) => {
    setCompanyProfile({
      ...companyProfile,
      employees: companyProfile.employees.filter(emp => emp.id !== employeeId)
    });
  };

  const maskEIN = (ein) => {
    if (!ein || ein.length < 2) return '';
    const lastTwo = ein.slice(-2);
    return `**-*****${lastTwo}`;
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (error) throw error;
      fetchAppointments(client.id);
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('client');
    router.push('/portal');
  };

  if (loading || !client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-2xl text-white font-bold">Loading...</div>
      </div>
    );
  }

  const proPlanOptions = [
    { name: 'Pro Plan 100', price: 250, businesses: 100 },
    { name: 'Pro Plan 200', price: 500, businesses: 200 },
    { name: 'Pro Plan 300', price: 750, businesses: 300 },
    { name: 'Pro Plan 400', price: 1000, businesses: 400 },
    { name: 'Pro Plan 500', price: 1250, businesses: 500 },
    { name: 'Pro Plan 600', price: 1500, businesses: 600 },
    { name: 'Pro Plan 700', price: 1750, businesses: 700 },
    { name: 'Pro Plan 800', price: 2000, businesses: 800 },
    { name: 'Pro Plan 900', price: 2250, businesses: 900 },
    { name: 'Pro Plan 1000', price: 2500, businesses: 1000 },
    { name: 'Pro Plan 1100', price: 2750, businesses: 1100 },
    { name: 'Pro Plan 1200', price: 3000, businesses: 1200 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative bg-gradient-to-r from-slate-900 to-blue-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black text-white">KinectB2B Client Portal</h1>
              <p className="text-blue-300 mt-1">Welcome back, {client.name}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-white/20 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="relative bg-slate-900/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-4 font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'text-white border-b-2 border-blue-500 bg-blue-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-6 py-4 font-bold transition-all ${
                activeTab === 'personal'
                  ? 'text-white border-b-2 border-green-500 bg-green-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              👤 Personal Profile
            </button>
            <button
              onClick={() => setActiveTab('company')}
              className={`px-6 py-4 font-bold transition-all ${
                activeTab === 'company'
                  ? 'text-white border-b-2 border-orange-500 bg-orange-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              🏢 Company Profile
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-6 py-4 font-bold transition-all ${
                activeTab === 'appointments'
                  ? 'text-white border-b-2 border-purple-500 bg-purple-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              📅 Appointments
            </button>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto p-6 space-y-6">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            {/* Welcome Banner */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-cyan-600/30 rounded-3xl blur-2xl group-hover:blur-3xl transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-2xl border-2 border-blue-500/50 rounded-3xl p-8">
                <h2 className="text-5xl font-black mb-2">
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Welcome Back,
                  </span>
                </h2>
                <h3 className="text-4xl font-bold text-white">{client.name}!</h3>
                <p className="text-blue-300 text-lg mt-2">Here's what's happening with your account</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Current Plan Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-2xl border border-blue-500/30 p-6 rounded-3xl transform hover:scale-105 transition-all duration-300">
                  <div className="text-sm text-blue-300 mb-2 font-semibold">Current Plan</div>
                  <div className="text-3xl font-black text-white mb-1">{client.plan_name}</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                    ${client.plan_price}/month
                  </div>
                  <button
                    onClick={() => setShowPlanModal(true)}
                    className="mt-4 w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105"
                  >
                    Change Plan
                  </button>
                </div>
              </div>

              {/* Total Appointments Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-2xl border border-purple-500/30 p-6 rounded-3xl transform hover:scale-105 transition-all duration-300">
                  <div className="text-sm text-purple-300 mb-2 font-semibold">Total Appointments</div>
                  <div className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    {client.total_appointments || 0}
                  </div>
                  <div className="text-sm text-gray-400 mt-2">All time appointments</div>
                </div>
              </div>

              {/* Account Manager Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-2xl border border-cyan-500/30 p-6 rounded-3xl transform hover:scale-105 transition-all duration-300">
                  <div className="text-sm text-cyan-300 mb-2 font-semibold">Account Manager</div>
                  <div className="text-xl font-bold text-white mb-3">{client.account_manager || 'Robert Cole'}</div>
                  <div className="space-y-2 text-sm">
                    <a href="tel:2192707863" className="text-cyan-400 hover:text-cyan-300 block transition font-medium">
                      📞 (219) 270-7863
                    </a>
                    <a href="mailto:Robert@kinectb2b.com" className="text-cyan-400 hover:text-cyan-300 block transition font-medium">
                      ✉️ Robert@kinectb2b.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-2xl border-2 border-green-500/50 p-8 rounded-3xl">
                <h3 className="text-3xl font-black text-white mb-6">
                  Recent <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Activities</span>
                </h3>
                
                {recentActivities.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-xl text-gray-400 font-bold">No recent activities</p>
                    <p className="text-gray-500 mt-2">Check back soon for updates!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-green-500/30 rounded-xl p-4 hover:border-green-500/50 transition-all">
                        <div className="flex justify-between items-start">
                          <p className="text-white font-medium flex-1">{activity.message}</p>
                          <span className="text-gray-400 text-sm ml-4">{activity.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Affiliate Program CTA */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8">
                <h3 className="text-3xl font-black text-white mb-2">Join Our Affiliate Program 🚀</h3>
                <p className="text-purple-100 text-lg mb-4">Earn 10% recurring commissions for every referral!</p>
                <a 
                  href="/affiliate" 
                  className="inline-block bg-white text-purple-600 px-8 py-4 rounded-xl font-black text-lg hover:bg-purple-50 transition-all transform hover:scale-105"
                >
                  Learn More →
                </a>
              </div>
            </div>
          </>
        )}

        {/* Personal Profile Tab */}
        {activeTab === 'personal' && (
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-2xl border-2 border-green-500/50 p-8 rounded-3xl">
              <h3 className="text-3xl font-black text-white mb-6">
                Personal <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Profile</span>
              </h3>

              <div className="grid md:grid-cols-4 gap-6">
                {/* Photo Section */}
                <div className="md:col-span-1">
                  <div className="bg-slate-950/30 rounded-xl p-4 border border-white/10 text-center">
                    {personalPhotoPreview || personalProfile.photo_url ? (
                      <img 
                        src={personalPhotoPreview || personalProfile.photo_url} 
                        alt="Profile" 
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-green-500/50" 
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-slate-700 flex items-center justify-center text-4xl border-4 border-green-500/50">
                        👤
                      </div>
                    )}
                    {isEditingPersonal && (
                      <div>
                        <input
                          type="file"
                          ref={personalFileInputRef}
                          onChange={handlePersonalPhotoChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          onClick={() => personalFileInputRef.current?.click()}
                          className="text-sm text-green-400 hover:text-green-300 font-semibold"
                        >
                          Change Photo
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Personal Info */}
                <div className="md:col-span-3 grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-950/30 rounded-xl p-4 border border-white/10">
                    <div className="text-sm text-gray-400 mb-1">Full Name</div>
                    {isEditingPersonal ? (
                      <input
                        type="text"
                        value={personalProfile.name}
                        onChange={(e) => setPersonalProfile({...personalProfile, name: e.target.value})}
                        className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-white/20 focus:border-green-500 focus:outline-none"
                      />
                    ) : (
                      <div className="text-lg font-bold text-white">{personalProfile.name || 'N/A'}</div>
                    )}
                  </div>

                  <div className="bg-slate-950/30 rounded-xl p-4 border border-white/10">
                    <div className="text-sm text-gray-400 mb-1">Email</div>
                    {isEditingPersonal ? (
                      <input
                        type="email"
                        value={personalProfile.email}
                        onChange={(e) => setPersonalProfile({...personalProfile, email: e.target.value})}
                        className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-white/20 focus:border-green-500 focus:outline-none"
                      />
                    ) : (
                      <div className="text-lg font-bold text-white">{personalProfile.email || 'N/A'}</div>
                    )}
                  </div>

                  <div className="bg-slate-950/30 rounded-xl p-4 border border-white/10">
                    <div className="text-sm text-gray-400 mb-1">Phone</div>
                    {isEditingPersonal ? (
                      <input
                        type="tel"
                        value={personalProfile.phone}
                        onChange={(e) => setPersonalProfile({...personalProfile, phone: e.target.value})}
                        className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-white/20 focus:border-green-500 focus:outline-none"
                      />
                    ) : (
                      <div className="text-lg font-bold text-white">{personalProfile.phone || 'N/A'}</div>
                    )}
                  </div>

                  <div className="bg-slate-950/30 rounded-xl p-4 border border-white/10">
                    <div className="text-sm text-gray-400 mb-1">Job Title</div>
                    {isEditingPersonal ? (
                      <input
                        type="text"
                        value={personalProfile.job_title}
                        onChange={(e) => setPersonalProfile({...personalProfile, job_title: e.target.value})}
                        className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-white/20 focus:border-green-500 focus:outline-none"
                      />
                    ) : (
                      <div className="text-lg font-bold text-white">{personalProfile.job_title || 'N/A'}</div>
                    )}
                  </div>

                  <div className="bg-slate-950/30 rounded-xl p-4 border border-white/10 md:col-span-2">
                    <div className="text-sm text-gray-400 mb-1">Mailing Address</div>
                    {isEditingPersonal ? (
                      <input
                        type="text"
                        value={personalProfile.mailing_address}
                        onChange={(e) => setPersonalProfile({...personalProfile, mailing_address: e.target.value})}
                        className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-white/20 focus:border-green-500 focus:outline-none"
                        placeholder="Street Address"
                      />
                    ) : (
                      <div className="text-lg font-bold text-white">{personalProfile.mailing_address || 'N/A'}</div>
                    )}
                  </div>

                  <div className="bg-slate-950/30 rounded-xl p-4 border border-white/10">
                    <div className="text-sm text-gray-400 mb-1">City</div>
                    {isEditingPersonal ? (
                      <input
                        type="text"
                        value={personalProfile.city}
                        onChange={(e) => setPersonalProfile({...personalProfile, city: e.target.value})}
                        className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-white/20 focus:border-green-500 focus:outline-none"
                      />
                    ) : (
                      <div className="text-lg font-bold text-white">{personalProfile.city || 'N/A'}</div>
                    )}
                  </div>

                  <div className="bg-slate-950/30 rounded-xl p-4 border border-white/10">
                    <div className="text-sm text-gray-400 mb-1">State</div>
                    {isEditingPersonal ? (
                      <input
                        type="text"
                        value={personalProfile.state}
                        onChange={(e) => setPersonalProfile({...personalProfile, state: e.target.value})}
                        className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-white/20 focus:border-green-500 focus:outline-none"
                      />
                    ) : (
                      <div className="text-lg font-bold text-white">{personalProfile.state || 'N/A'}</div>
                    )}
                  </div>

                  <div className="bg-slate-950/30 rounded-xl p-4 border border-white/10">
                    <div className="text-sm text-gray-400 mb-1">Zip Code</div>
                    {isEditingPersonal ? (
                      <input
                        type="text"
                        value={personalProfile.zip_code}
                        onChange={(e) => setPersonalProfile({...personalProfile, zip_code: e.target.value})}
                        className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-white/20 focus:border-green-500 focus:outline-none"
                      />
                    ) : (
                      <div className="text-lg font-bold text-white">{personalProfile.zip_code || 'N/A'}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                {isEditingPersonal ? (
                  <>
                    <button
                      onClick={savePersonalProfile}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingPersonal(false);
                        setPersonalPhotoFile(null);
                        if (personalPhotoPreview) {
                          URL.revokeObjectURL(personalPhotoPreview);
                          setPersonalPhotoPreview(null);
                        }
                      }}
                      className="flex-1 bg-slate-700 text-white py-3 rounded-xl font-bold hover:bg-slate-600 transition-all"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditingPersonal(true)}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Company Profile Tab */}
        {activeTab === 'company' && (
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-2xl border-2 border-orange-500/50 p-8 rounded-3xl">
              <h3 className="text-3xl font-black text-white mb-6">
                Company <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Profile</span>
              </h3>

              <div className="grid md:grid-cols-4 gap-6 mb-6">
                {/* Logo Section */}
                <div className="md:col-span-1">
                  <div className="bg-slate-950/30 rounded-xl p-4 border border-white/10 text-center">
                    {companyLogoPreview || companyProfile.logo_url ? (
                      <img 
                        src={companyLogoPreview || companyProfile.logo_url} 
                        alt="Company Logo" 
                        className="w-32 h-32 rounded-lg mx-auto mb-4 object-cover border-4 border-orange-500/50" 
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-lg mx-auto mb-4 bg-slate-700 flex items-center justify-center text-4xl border-4 border-orange-500/50">
                        🏢
                      </div>
                    )}
                    {isEditingCompany && (
                      <div>
                        <input
                          type="file"
                          ref={companyFileInputRef}
                          onChange={handleCompanyLogoChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          onClick={() => companyFileInputRef.current?.click()}
                          className="text-sm text-orange-400 hover:text-orange-300 font-semibold"
                        >
                          Change Logo
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Company Info */}
                <div className="md:col-span-3 grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-950/30 rounded-xl p-4 border border-white/10">
                    <div className="text-sm text-gray-400 mb-1">Company Name</div>
                    {isEditingCompany ? (
                      <input
                        type="text"
                        value={companyProfile.company_name}
                        onChange={(e) => setCompanyProfile({...companyProfile, company_name: e.target.value})}
                        className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-white/20 focus:border-orange-500 focus:outline-none"
                      />
                    ) : (
                      <div className="text-lg font-bold text-white">{companyProfile.company_name || 'N/A'}</div>
                    )}
                  </div>

                  <div className="bg-slate-950/30 rounded-xl p-4 border border-white/10">
                    <div className="text-sm text-gray-400 mb-1">Company Email</div>
                    {isEditingCompany ? (
                      <input
                        type="email"
                        value={companyProfile.company_email}
                        onChange={(e) => setCompanyProfile({...companyProfile, company_email: e.target.value})}
                        className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-white/20 focus:border-orange-500 focus:outline-none"
                      />
                    ) : (
                      <div className="text-lg font-bold text-white">{companyProfile.company_email || 'N/A'}</div>
                    )}
                  </div>

                  <div className="bg-slate-950/30 rounded-xl p-4 border border-white/10">
                    <div className="text-sm text-gray-400 mb-1">Company Phone</div>
                    {isEditingCompany ? (
                      <input
                        type="tel"
                        value={companyProfile.company_phone}
                        onChange={(e) => setCompanyProfile({...companyProfile, company_phone: e.target.value})}
                        className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-white/20 focus:border-orange-500 focus:outline-none"
                      />
                    ) : (
                      <div className="text-lg font-bold text-white">{companyProfile.company_phone || 'N/A'}</div>
                    )}
                  </div>

                  <div className="bg-slate-950/30 rounded-xl p-4 border border-white/10">
                    <div className="text-sm text-gray-400 mb-1">Number of Employees</div>
                    {isEditingCompany ? (
                      <input
                        type="number"
                        value={companyProfile.number_of_employees}
                        onChange={(e) => setCompanyProfile({...companyProfile, number_of_employees: e.target.value})}
                        className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-white/20 focus:border-orange-500 focus:outline-none"
                      />
                    ) : (
                      <div className="text-lg font-bold text-white">{companyProfile.number_of_employees || 'N/A'}</div>
                    )}
                  </div>

                  <div className="bg-slate-950/30 rounded-xl p-4 border border-white/10 md:col-span-2">
                    <div className="text-sm text-gray-400 mb-1">Company Address</div>
                    {isEditingCompany ? (
                      <input
                        type="text"
                        value={companyProfile.company_address}
                        onChange={(e) => setCompanyProfile({...companyProfile, company_address: e.target.value})}
                        className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-white/20 focus:border-orange-500 focus:outline-none"
                        placeholder="Street Address"
                      />
                    ) : (
                      <div className="text-lg font-bold text-white">{companyProfile.company_address || 'N/A'}</div>
                    )}
                  </div>

                  <div className="bg-slate-950/30 rounded-xl p-4 border border-white/10">
                    <div className="text-sm text-gray-400 mb-1">City</div>
                    {isEditingCompany ? (
                      <input
                        type="text"
                        value={companyProfile.company_city}
                        onChange={(e) => setCompanyProfile({...companyProfile, company_city: e.target.value})}
                        className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-white/20 focus:border-orange-500 focus:outline-none"
                      />
                    ) : (
                      <div className="text-lg font-bold text-white">{companyProfile.company_city || 'N/A'}</div>
                    )}
                  </div>

                  <div className="bg-slate-950/30 rounded-xl p-4 border border-white/10">
                    <div className="text-sm text-gray-400 mb-1">State</div>
                    {isEditingCompany ? (
                      <input
                        type="text"
                        value={companyProfile.company_state}
                        onChange={(e) => setCompanyProfile({...companyProfile, company_state: e.target.value})}
                        className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-white/20 focus:border-orange-500 focus:outline-none"
                      />
                    ) : (
                      <div className="text-lg font-bold text-white">{companyProfile.company_state || 'N/A'}</div>
                    )}
                  </div>

                  <div className="bg-slate-950/30 rounded-xl p-4 border border-white/10">
                    <div className="text-sm text-gray-400 mb-1">Zip Code</div>
                    {isEditingCompany ? (
                      <input
                        type="text"
                        value={companyProfile.company_zip}
                        onChange={(e) => setCompanyProfile({...companyProfile, company_zip: e.target.value})}
                        className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg border border-white/20 focus:border-orange-500 focus:outline-none"
                      />
                    ) : (
                      <div className="text-lg font-bold text-white">{companyProfile.company_zip || 'N/A'}</div>
                    )}
                  </div>

                  <div className="bg-slate-950/30 rounded-xl p-4 border border-white/10">
                    <div className="text-sm text-gray-400 mb-1">EIN Number</div>
                    <div className="flex items-center gap-2">
                      {isEditingCompany ? (
                        <input
                          type="text"
                          value={companyProfile.ein_number}
                          onChange={(e) => setCompanyProfile({...companyProfile, ein_number: e.target.value})}
                          className="flex-1 bg-slate-800 text-white px-3 py-2 rounded-lg border border-white/20 focus:border-orange-500 focus:outline-none"
                          placeholder="XX-XXXXXXX"
                        />
                      ) : (
                        <>
                          <div className="text-lg font-bold text-white flex-1">
                            {companyProfile.ein_number ? (showEIN ? companyProfile.ein_number : maskEIN(companyProfile.ein_number)) : 'N/A'}
                          </div>
                          {companyProfile.ein_number && (
                            <button
                              onClick={() => setShowEIN(!showEIN)}
                              className="text-sm text-orange-400 hover:text-orange-300 font-semibold"
                            >
                              {showEIN ? '👁️ Hide' : '👁️ Show'}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Employees Section */}
              <div className="bg-slate-950/30 rounded-xl p-6 border border-white/10 mb-6">
                <h4 className="text-xl font-bold text-white mb-4">Employees</h4>
                
                {companyProfile.employees && companyProfile.employees.length > 0 ? (
                  <div className="space-y-3 mb-4">
                    {companyProfile.employees.map((employee) => (
                      <div key={employee.id} className="flex justify-between items-center bg-slate-800/50 rounded-lg p-3">
                        <div>
                          <div className="text-white font-semibold">{employee.name}</div>
                          <div className="text-gray-400 text-sm">{employee.job_title}</div>
                        </div>
                        {isEditingCompany && (
                          <button
                            onClick={() => removeEmployee(employee.id)}
                            className="text-red-400 hover:text-red-300 font-bold"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm mb-4">No employees added yet.</p>
                )}

                {isEditingCompany && (
                  <div className="grid md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                      placeholder="Employee Name"
                      className="bg-slate-800 text-white px-3 py-2 rounded-lg border border-white/20 focus:border-orange-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={newEmployee.job_title}
                      onChange={(e) => setNewEmployee({...newEmployee, job_title: e.target.value})}
                      placeholder="Job Title"
                      className="bg-slate-800 text-white px-3 py-2 rounded-lg border border-white/20 focus:border-orange-500 focus:outline-none"
                    />
                    <button
                      onClick={addEmployee}
                      className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-2 rounded-lg font-bold hover:from-orange-700 hover:to-red-700 transition-all"
                    >
                      Add Employee
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                {isEditingCompany ? (
                  <>
                    <button
                      onClick={saveCompanyProfile}
                      className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingCompany(false);
                        setCompanyLogoFile(null);
                        if (companyLogoPreview) {
                          URL.revokeObjectURL(companyLogoPreview);
                          setCompanyLogoPreview(null);
                        }
                      }}
                      className="flex-1 bg-slate-700 text-white py-3 rounded-xl font-bold hover:bg-slate-600 transition-all"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditingCompany(true)}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105"
                  >
                    Edit Company Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-2xl border-2 border-blue-500/50 p-8 rounded-3xl">
              <h3 className="text-3xl font-black text-white mb-6">
                Your <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Appointments</span>
              </h3>
              
              {appointments.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📅</div>
                  <p className="text-xl text-gray-400 font-bold">No appointments scheduled yet.</p>
                  <p className="text-gray-500 mt-2">Check back soon for new opportunities!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="group/card relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover/card:opacity-100 transition duration-500"></div>
                      <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-2xl font-bold text-white">{appointment.company_name}</h4>
                            <p className="text-gray-400 mt-1">{appointment.contact_person}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-cyan-400">
                              {new Date(appointment.appointment_date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                            <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold mt-2 ${
                              appointment.status === 'completed' 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                            }`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300 mb-4">
                          <div><strong className="text-blue-400">Type:</strong> {appointment.appointment_type || 'N/A'}</div>
                          <div><strong className="text-blue-400">Address:</strong> {appointment.address || 'N/A'}</div>
                          <div><strong className="text-blue-400">Email:</strong> {appointment.email || 'N/A'}</div>
                          <div><strong className="text-blue-400">Phone:</strong> {appointment.phone || 'N/A'}</div>
                        </div>

                        {appointment.notes && (
                          <div className="bg-slate-950/50 border border-white/10 rounded-xl p-4 mb-4">
                            <strong className="text-cyan-400">Notes:</strong>
                            <p className="text-gray-300 mt-2">{appointment.notes}</p>
                          </div>
                        )}

                        <div className="flex gap-3">
                          {appointment.status === 'pending' ? (
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105"
                            >
                              ✓ Mark as Completed
                            </button>
                          ) : (
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 'pending')}
                              className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl font-bold hover:from-yellow-700 hover:to-orange-700 transition-all transform hover:scale-105"
                            >
                              ⟲ Mark as Pending
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Plan Change Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-blue-500/50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-black text-white">
                Change Your <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Plan</span>
              </h3>
              <button 
                onClick={() => setShowPlanModal(false)} 
                className="text-gray-400 hover:text-white text-3xl transition"
              >
                ×
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {proPlanOptions.map((plan) => (
                <div key={plan.name} className="group/plan relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover/plan:opacity-100 transition duration-500"></div>
                  <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border-2 border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
                    <div className="mb-4">
                      <h4 className="text-xl font-bold text-white">{plan.name}</h4>
                      <p className="text-gray-400 mt-1 text-sm">{plan.businesses} businesses contacted</p>
                    </div>
                    <div className="mb-4">
                      <div className="text-3xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                        ${plan.price}
                      </div>
                      <div className="text-sm text-gray-400">/month</div>
                    </div>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105">
                      Select Plan
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-400 mt-6 text-center">Contact your account manager to finalize your plan change</p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}