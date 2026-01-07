'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zsjmqlsnvkbtdhjbtwkr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzam1xbHNudmtidGRoamJ0d2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMzcxOTYsImV4cCI6MjA3NzYxMzE5Nn0.vsbFj5m6pCaoVpHKpB3SZ2WzF4yRufOd27NlcEPhHGc'
);

const STAGES = [
  { id: 'new', label: 'New', color: 'bg-blue-500', probability: 20 },
  { id: 'confirmed', label: 'Confirmed', color: 'bg-amber-500', probability: 40 },
  { id: 'proposal', label: 'Proposal', color: 'bg-purple-500', probability: 60 },
  { id: 'won', label: 'Won', color: 'bg-emerald-500', probability: 100 },
  { id: 'lost', label: 'Lost', color: 'bg-red-500', probability: 0 },
];

const FREQUENCIES = [
  { value: 'one_time', label: 'One Time' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'bi_weekly', label: 'Bi-Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'bi_monthly', label: 'Bi-Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'semi_annual', label: 'Semi-Annual' },
  { value: 'annually', label: 'Annually' },
];

const LOST_REASONS = ['Price', 'Timing', 'Competitor', 'No Response', 'Not a Fit', 'Other'];

export default function ClientDashboard() {
  const router = useRouter();
  const [client, setClient] = useState(null);
  const [features, setFeatures] = useState({ dashboard: true, pipeline: true, crm: true, personal_profile: true, company_profile: true });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [crmSearchQuery, setCrmSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date'); // date, value, probability, name
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  const [selectedOrg, setSelectedOrg] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);

  const [orgLocations, setOrgLocations] = useState([]);
  const [orgContacts, setOrgContacts] = useState([]);
  const [orgActivities, setOrgActivities] = useState([]);
  const [orgAppointments, setOrgAppointments] = useState([]);
  const [locationContacts, setLocationContacts] = useState([]);
  const [locationActivities, setLocationActivities] = useState([]);
  const [contactActivities, setContactActivities] = useState([]);

  const [selectedDeal, setSelectedDeal] = useState(null);
  const [dealProducts, setDealProducts] = useState([]);
  const [dealServices, setDealServices] = useState([]);
  const [dealActivities, setDealActivities] = useState([]);
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [editingDeal, setEditingDeal] = useState(false);

  const [showAddOrg, setShowAddOrg] = useState(false);
  const [createOrgFromDeal, setCreateOrgFromDeal] = useState(null); // holds deal id when creating org from pipeline
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [showLostReasonModal, setShowLostReasonModal] = useState(false);
  const [showAddContactPrompt, setShowAddContactPrompt] = useState(false);
  const [showAddLocationPrompt, setShowAddLocationPrompt] = useState(false);
  const [pendingContactAdd, setPendingContactAdd] = useState(null);
  const [pendingLocationAdd, setPendingLocationAdd] = useState(null);
  const [linkedOrgId, setLinkedOrgId] = useState(null);
  const [pendingLostDeal, setPendingLostDeal] = useState(null);
  const [selectedLostReason, setSelectedLostReason] = useState('');

  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgIndustry, setNewOrgIndustry] = useState('');
  const [newOrgWebsite, setNewOrgWebsite] = useState('');
  const [newOrgNotes, setNewOrgNotes] = useState('');
  const [newLocName, setNewLocName] = useState('');
  const [newLocAddress, setNewLocAddress] = useState('');
  const [newLocCity, setNewLocCity] = useState('');
  const [newLocState, setNewLocState] = useState('');
  const [newLocZip, setNewLocZip] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [newContactRole, setNewContactRole] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  // Enhanced contact fields
  const [newContactFirstName, setNewContactFirstName] = useState('');
  const [newContactLastName, setNewContactLastName] = useState('');
  const [newContactJobTitle, setNewContactJobTitle] = useState('');
  const [newContactWorkPhone, setNewContactWorkPhone] = useState('');
  const [newContactMobile, setNewContactMobile] = useState('');
  const [newContactAddress, setNewContactAddress] = useState('');
  const [newContactCity, setNewContactCity] = useState('');
  const [newContactState, setNewContactState] = useState('');
  const [newContactZip, setNewContactZip] = useState('');
  const [newContactLinkedin, setNewContactLinkedin] = useState('');
  const [newContactBirthday, setNewContactBirthday] = useState('');
  const [newContactNotes, setNewContactNotes] = useState('');
  const [newContactIsPrimary, setNewContactIsPrimary] = useState(false);
  // Enhanced org fields
  const [newOrgPhone, setNewOrgPhone] = useState('');
  const [newOrgAddress, setNewOrgAddress] = useState('');
  const [newOrgCity, setNewOrgCity] = useState('');
  const [newOrgState, setNewOrgState] = useState('');
  const [newOrgZip, setNewOrgZip] = useState('');
  const [newOrgEmployeeCount, setNewOrgEmployeeCount] = useState('');
  const [newOrgRevenueRange, setNewOrgRevenueRange] = useState('');
  const [newOrgFoundedYear, setNewOrgFoundedYear] = useState('');
  const [newOrgLinkedin, setNewOrgLinkedin] = useState('');
  const [newOrgDescription, setNewOrgDescription] = useState('');
  // Deal source tracking
  const [newDealSource, setNewDealSource] = useState('');
  const [newDealSourceDetails, setNewDealSourceDetails] = useState('');
  // Activity tabs
  const [activityTab, setActivityTab] = useState('all');
  // Changelog
  const [changelog, setChangelog] = useState([]);
  const [showChangelog, setShowChangelog] = useState(false);
  
  const [newActivityType, setNewActivityType] = useState('note');
  const [newActivityContent, setNewActivityContent] = useState('');
  const [newDealCompany, setNewDealCompany] = useState('');
  const [newDealContact, setNewDealContact] = useState('');
  const [newDealEmail, setNewDealEmail] = useState('');
  const [newDealPhone, setNewDealPhone] = useState('');
  const [newDealAddress, setNewDealAddress] = useState('');
  const [newDealDate, setNewDealDate] = useState('');
  const [newDealNotes, setNewDealNotes] = useState('');
  const [newDealOrgId, setNewDealOrgId] = useState('');
  const [newDealLocationId, setNewDealLocationId] = useState('');
  const [newDealContactId, setNewDealContactId] = useState('');
  const [newDealCreateNewContact, setNewDealCreateNewContact] = useState(false);
  const [newDealStage, setNewDealStage] = useState('new');
  const [dealOrgContacts, setDealOrgContacts] = useState([]);
  const [dealOrgLocations, setDealOrgLocations] = useState([]);
  const [newProduct, setNewProduct] = useState({ product_name: '', description: '', quantity: 1, price: 0 });
  const [newService, setNewService] = useState({ service_name: '', description: '', frequency: 'one_time', price: 0 });

  const [editingOrg, setEditingOrg] = useState(false);
  const [editingLocation, setEditingLocation] = useState(false);
  const [editingContact, setEditingContact] = useState(false);

  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [personalProfile, setPersonalProfile] = useState({ photo_url: '', name: '', phone: '', email: '', job_title: '', mailing_address: '', city: '', state: '', zip_code: '' });
  const [personalPhotoFile, setPersonalPhotoFile] = useState(null);
  const [personalPhotoPreview, setPersonalPhotoPreview] = useState(null);
  const personalFileInputRef = useRef(null);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [companyProfile, setCompanyProfile] = useState({ logo_url: '', company_name: '', company_email: '', company_phone: '', company_address: '', company_city: '', company_state: '', company_zip: '', number_of_employees: '', ein_number: '', employees: [] });
  const [companyLogoFile, setCompanyLogoFile] = useState(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState(null);
  const [showEIN, setShowEIN] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', job_title: '' });
  const companyFileInputRef = useRef(null);

  useEffect(() => {
    const clientData = localStorage.getItem('client') || sessionStorage.getItem('client');
    if (!clientData) { router.push('/portal'); return; }
    const parsedClient = JSON.parse(clientData);
    setClient(parsedClient);
    // Load features from client data or fetch fresh
    if (parsedClient.features) {
      setFeatures(parsedClient.features);
    }
    fetchAllData(parsedClient.id, parsedClient);
  }, [router]);

  // Redirect to dashboard if current tab is disabled
  useEffect(() => {
    const featureMap = { dashboard: 'dashboard', pipeline: 'pipeline', crm: 'crm', personal: 'personal_profile', company: 'company_profile' };
    const requiredFeature = featureMap[activeTab];
    if (requiredFeature && features[requiredFeature] === false) {
      setActiveTab('dashboard');
    }
  }, [features, activeTab]);

  const fetchAllData = async (clientId, clientData) => {
    // Fetch fresh client data to get latest features
    try {
      const { data: freshClient } = await supabase.from('active_clients').select('features').eq('id', clientId).single();
      if (freshClient?.features && typeof freshClient.features === 'object') {
        // Merge with defaults to ensure all features exist
        setFeatures(prev => ({ ...prev, ...freshClient.features }));
      }
    } catch (e) {
      // features column might not exist yet, use defaults
      console.log('Features not loaded, using defaults');
    }
    await Promise.all([fetchAppointments(clientId), fetchOrganizations(clientId), fetchRecentActivities(clientId), fetchPersonalProfile(clientId, clientData), fetchCompanyProfile(clientId, clientData)]);
    setLoading(false);
  };

  const fetchAppointments = async (clientId) => {
    const { data } = await supabase.from('appointments').select('*, organizations(name)').eq('client_id', clientId).order('created_at', { ascending: false });
    if (data) {
      // Sync deal values from products/services for any deals missing values
      const updatedAppointments = await Promise.all(data.map(async (appt) => {
        const [products, services] = await Promise.all([
          supabase.from('deal_products').select('*').eq('appointment_id', appt.id),
          supabase.from('deal_services').select('*').eq('appointment_id', appt.id)
        ]);
        const productTotal = (products.data || []).reduce((sum, p) => sum + ((p.quantity || 1) * (parseFloat(p.price) || 0)), 0);
        const serviceTotal = (services.data || []).reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);
        const calculatedValue = productTotal + serviceTotal;
        
        // If calculated value differs from stored value, update the database
        if (calculatedValue > 0 && calculatedValue !== parseFloat(appt.deal_value || 0)) {
          await supabase.from('appointments').update({ deal_value: calculatedValue }).eq('id', appt.id);
          return { ...appt, deal_value: calculatedValue };
        }
        return appt;
      }));
      setAppointments(updatedAppointments);
    } else {
      setAppointments([]);
    }
  };

  const fetchOrganizations = async (clientId) => {
    const { data } = await supabase.from('organizations').select('*').eq('client_id', clientId).order('name');
    setOrganizations(data || []);
  };

  const fetchRecentActivities = async (clientId) => {
    const { data } = await supabase.from('activities').select('*').eq('client_id', clientId).order('created_at', { ascending: false }).limit(10);
    setRecentActivities(data || []);
  };

  const fetchPersonalProfile = async (clientId, clientData) => {
    const { data } = await supabase.from('client_personal_profiles').select('*').eq('client_id', clientId).single();
    if (data) setPersonalProfile(data);
    else setPersonalProfile({ photo_url: '', name: clientData?.full_name || clientData?.name || '', email: clientData?.email || '', phone: clientData?.phone || '', job_title: '', mailing_address: '', city: '', state: '', zip_code: '' });
  };

  const fetchCompanyProfile = async (clientId, clientData) => {
    const { data } = await supabase.from('client_company_profiles').select('*').eq('client_id', clientId).single();
    if (data) setCompanyProfile(data);
    else setCompanyProfile({ logo_url: '', company_name: clientData?.name || '', company_email: '', company_phone: clientData?.phone || '', company_address: '', company_city: '', company_state: '', company_zip: '', number_of_employees: '', ein_number: '', employees: [] });
  };

  const openOrg = async (org) => {
    setSelectedOrg(org); setSelectedLocation(null); setSelectedContact(null);
    const [locations, contacts, activities, appts] = await Promise.all([
      supabase.from('locations').select('*').eq('organization_id', org.id).order('name'),
      supabase.from('contacts').select('*').eq('organization_id', org.id).is('location_id', null).order('name'),
      supabase.from('activities').select('*').eq('organization_id', org.id).is('location_id', null).is('contact_id', null).order('created_at', { ascending: false }),
      supabase.from('appointments').select('*').eq('organization_id', org.id).order('created_at', { ascending: false })
    ]);
    setOrgLocations(locations.data || []); setOrgContacts(contacts.data || []); setOrgActivities(activities.data || []); setOrgAppointments(appts.data || []);
  };

  // Open the create org form pre-filled from a deal
  const startCreateOrgFromDeal = (deal) => {
    setNewOrgName(deal.company_name || '');
    setNewOrgIndustry('');
    setNewOrgWebsite('');
    setNewOrgNotes(`Created from deal. Contact: ${deal.contact_person || 'N/A'}, Email: ${deal.email || 'N/A'}, Phone: ${deal.phone || 'N/A'}`);
    setCreateOrgFromDeal(deal.id);
    setShowAddOrg(true);
  };

  const createOrg = async () => {
    if (!newOrgName.trim()) return;
    const orgData = { 
      name: newOrgName, 
      industry: newOrgIndustry, 
      website: newOrgWebsite, 
      notes: newOrgNotes, 
      phone: newOrgPhone,
      address: newOrgAddress,
      city: newOrgCity,
      state: newOrgState,
      zip: newOrgZip,
      employee_count: newOrgEmployeeCount,
      revenue_range: newOrgRevenueRange,
      founded_year: newOrgFoundedYear ? parseInt(newOrgFoundedYear) : null,
      linkedin: newOrgLinkedin,
      description: newOrgDescription,
      client_id: client.id 
    };
    const { data, error } = await supabase.from('organizations').insert([orgData]).select();
    if (!error && data) { 
      const newOrg = data[0];
      setOrganizations([...organizations, newOrg]); 
      
      // If creating from a deal, link the deal to this new org and prompt to add contact/location
      if (createOrgFromDeal) {
        const deal = appointments.find(a => a.id === createOrgFromDeal) || selectedDeal;
        await supabase.from('appointments').update({ organization_id: newOrg.id }).eq('id', createOrgFromDeal);
        setAppointments(appointments.map(a => a.id === createOrgFromDeal ? {...a, organization_id: newOrg.id} : a));
        if (selectedDeal?.id === createOrgFromDeal) {
          setSelectedDeal({...selectedDeal, organization_id: newOrg.id});
        }
        setLinkedOrgId(newOrg.id);
        
        // Check if deal has contact info to add
        if (deal?.contact_person) {
          setPendingContactAdd({ name: deal.contact_person, email: deal.email, phone: deal.phone });
          setShowAddContactPrompt(true);
        } else if (deal?.address) {
          // No contact but has address
          setPendingLocationAdd({ address: deal.address });
          setShowAddLocationPrompt(true);
        }
        
        setCreateOrgFromDeal(null);
      }
      
      resetOrgForm();
    }
  };

  const resetOrgForm = () => {
    setNewOrgName(''); setNewOrgIndustry(''); setNewOrgWebsite(''); setNewOrgNotes('');
    setNewOrgPhone(''); setNewOrgAddress(''); setNewOrgCity(''); setNewOrgState(''); setNewOrgZip('');
    setNewOrgEmployeeCount(''); setNewOrgRevenueRange(''); setNewOrgFoundedYear('');
    setNewOrgLinkedin(''); setNewOrgDescription(''); setShowAddOrg(false);
  };

  // Handle adding contact after org link
  const confirmAddContact = async () => {
    if (pendingContactAdd && linkedOrgId) {
      await supabase.from('contacts').insert([{
        name: pendingContactAdd.name,
        email: pendingContactAdd.email || null,
        phone: pendingContactAdd.phone || null,
        organization_id: linkedOrgId
      }]);
    }
    setShowAddContactPrompt(false);
    setPendingContactAdd(null);
    
    // Now check for location
    const deal = selectedDeal;
    if (deal?.address) {
      setPendingLocationAdd({ address: deal.address });
      setShowAddLocationPrompt(true);
    } else {
      setLinkedOrgId(null);
    }
  };

  const skipAddContact = () => {
    setShowAddContactPrompt(false);
    setPendingContactAdd(null);
    
    // Check for location
    const deal = selectedDeal;
    if (deal?.address) {
      setPendingLocationAdd({ address: deal.address });
      setShowAddLocationPrompt(true);
    } else {
      setLinkedOrgId(null);
    }
  };

  const confirmAddLocation = async () => {
    if (pendingLocationAdd && linkedOrgId) {
      // Parse address if possible
      const addrParts = pendingLocationAdd.address.split(',').map(s => s.trim());
      await supabase.from('locations').insert([{
        name: 'Main Location',
        address: addrParts[0] || pendingLocationAdd.address,
        city: addrParts[1] || '',
        state: addrParts[2] || '',
        organization_id: linkedOrgId
      }]);
    }
    setShowAddLocationPrompt(false);
    setPendingLocationAdd(null);
    setLinkedOrgId(null);
  };

  const skipAddLocation = () => {
    setShowAddLocationPrompt(false);
    setPendingLocationAdd(null);
    setLinkedOrgId(null);
  };

  // Function to link existing org and prompt for contact/location
  const linkDealToOrg = async (dealId, orgId) => {
    const deal = appointments.find(a => a.id === dealId) || selectedDeal;
    await supabase.from('appointments').update({ organization_id: orgId }).eq('id', dealId);
    setAppointments(appointments.map(a => a.id === dealId ? {...a, organization_id: orgId} : a));
    if (selectedDeal?.id === dealId) {
      setSelectedDeal({...selectedDeal, organization_id: orgId});
    }
    setLinkedOrgId(orgId);
    
    // Check if deal has contact info to add
    if (deal?.contact_person) {
      setPendingContactAdd({ name: deal.contact_person, email: deal.email, phone: deal.phone });
      setShowAddContactPrompt(true);
    } else if (deal?.address) {
      setPendingLocationAdd({ address: deal.address });
      setShowAddLocationPrompt(true);
    }
  };

  const cancelCreateOrg = () => {
    resetOrgForm();
    setCreateOrgFromDeal(null);
  };

  const updateOrg = async () => {
    const updateData = { 
      name: selectedOrg.name, 
      industry: selectedOrg.industry, 
      website: selectedOrg.website, 
      notes: selectedOrg.notes,
      phone: selectedOrg.phone,
      address: selectedOrg.address,
      city: selectedOrg.city,
      state: selectedOrg.state,
      zip: selectedOrg.zip,
      employee_count: selectedOrg.employee_count,
      revenue_range: selectedOrg.revenue_range,
      founded_year: selectedOrg.founded_year,
      linkedin: selectedOrg.linkedin,
      description: selectedOrg.description
    };
    await supabase.from('organizations').update(updateData).eq('id', selectedOrg.id);
    setOrganizations(organizations.map(o => o.id === selectedOrg.id ? selectedOrg : o)); 
    setEditingOrg(false);
  };

  const deleteOrg = async () => {
    if (!confirm('Delete this organization?')) return;
    await supabase.from('organizations').delete().eq('id', selectedOrg.id);
    setOrganizations(organizations.filter(o => o.id !== selectedOrg.id)); setSelectedOrg(null);
  };

  const openLocation = async (location) => {
    setSelectedLocation(location); setSelectedContact(null);
    const [contacts, activities] = await Promise.all([
      supabase.from('contacts').select('*').eq('location_id', location.id).order('name'),
      supabase.from('activities').select('*').eq('location_id', location.id).is('contact_id', null).order('created_at', { ascending: false })
    ]);
    setLocationContacts(contacts.data || []); setLocationActivities(activities.data || []);
  };

  const createLocation = async () => {
    if (!newLocName.trim() || !selectedOrg) return;
    const { data, error } = await supabase.from('locations').insert([{ name: newLocName, address: newLocAddress, city: newLocCity, state: newLocState, zip: newLocZip, organization_id: selectedOrg.id }]).select();
    if (!error && data) { setOrgLocations([...orgLocations, data[0]]); setNewLocName(''); setNewLocAddress(''); setNewLocCity(''); setNewLocState(''); setNewLocZip(''); setShowAddLocation(false); }
  };

  const deleteLocation = async () => {
    if (!confirm('Delete this location?')) return;
    await supabase.from('locations').delete().eq('id', selectedLocation.id);
    setOrgLocations(orgLocations.filter(l => l.id !== selectedLocation.id)); setSelectedLocation(null);
  };

  const openContact = async (contact) => {
    setSelectedContact(contact);
    const { data } = await supabase.from('activities').select('*').eq('contact_id', contact.id).order('created_at', { ascending: false });
    setContactActivities(data || []);
  };

  const createContact = async () => {
    if (!newContactName.trim() && !newContactFirstName.trim()) return;
    const contactData = { 
      name: newContactName || `${newContactFirstName} ${newContactLastName}`.trim(),
      first_name: newContactFirstName,
      last_name: newContactLastName,
      role: newContactRole, 
      job_title: newContactJobTitle,
      email: newContactEmail, 
      phone: newContactPhone,
      work_phone: newContactWorkPhone,
      mobile_phone: newContactMobile,
      address: newContactAddress,
      city: newContactCity,
      state: newContactState,
      zip: newContactZip,
      linkedin: newContactLinkedin,
      birthday: newContactBirthday || null,
      notes: newContactNotes,
      is_primary: newContactIsPrimary,
      organization_id: selectedOrg?.id, 
      location_id: selectedLocation?.id || null 
    };
    const { data, error } = await supabase.from('contacts').insert([contactData]).select();
    if (!error && data) {
      if (selectedLocation) setLocationContacts([...locationContacts, data[0]]);
      else setOrgContacts([...orgContacts, data[0]]);
      resetContactForm();
    }
  };

  const resetContactForm = () => {
    setNewContactName(''); setNewContactRole(''); setNewContactEmail(''); setNewContactPhone('');
    setNewContactFirstName(''); setNewContactLastName(''); setNewContactJobTitle('');
    setNewContactWorkPhone(''); setNewContactMobile(''); setNewContactAddress('');
    setNewContactCity(''); setNewContactState(''); setNewContactZip('');
    setNewContactLinkedin(''); setNewContactBirthday(''); setNewContactNotes('');
    setNewContactIsPrimary(false); setShowAddContact(false);
  };

  const deleteContact = async () => {
    if (!confirm('Delete this contact?')) return;
    await supabase.from('contacts').delete().eq('id', selectedContact.id);
    if (selectedLocation) setLocationContacts(locationContacts.filter(c => c.id !== selectedContact.id));
    else setOrgContacts(orgContacts.filter(c => c.id !== selectedContact.id));
    setSelectedContact(null);
  };

  const addActivity = async () => {
    if (!newActivityContent.trim()) return;
    const activityData = { type: newActivityType, content: newActivityContent, client_id: client.id, organization_id: selectedOrg?.id || null, location_id: selectedLocation?.id || null, contact_id: selectedContact?.id || null, appointment_id: selectedDeal?.id || null, author: client.name };
    const { data, error } = await supabase.from('activities').insert([activityData]).select();
    if (!error && data) {
      if (selectedDeal) setDealActivities([data[0], ...dealActivities]);
      else if (selectedContact) setContactActivities([data[0], ...contactActivities]);
      else if (selectedLocation) setLocationActivities([data[0], ...locationActivities]);
      else if (selectedOrg) setOrgActivities([data[0], ...orgActivities]);
      setNewActivityType('note'); setNewActivityContent('');
    }
  };

  const deleteActivity = async (activityId, source) => {
    await supabase.from('activities').delete().eq('id', activityId);
    if (source === 'deal') setDealActivities(dealActivities.filter(a => a.id !== activityId));
    else if (source === 'contact') setContactActivities(contactActivities.filter(a => a.id !== activityId));
    else if (source === 'location') setLocationActivities(locationActivities.filter(a => a.id !== activityId));
    else if (source === 'org') setOrgActivities(orgActivities.filter(a => a.id !== activityId));
  };

  const openDeal = async (deal) => {
    setSelectedDeal(deal);
    const [products, services, activities] = await Promise.all([
      supabase.from('deal_products').select('*').eq('appointment_id', deal.id),
      supabase.from('deal_services').select('*').eq('appointment_id', deal.id),
      supabase.from('activities').select('*').eq('appointment_id', deal.id).order('created_at', { ascending: false })
    ]);
    setDealProducts(products.data || []); setDealServices(services.data || []); setDealActivities(activities.data || []);
  };

  const closeDeal = () => { setSelectedDeal(null); setDealProducts([]); setDealServices([]); setDealActivities([]); setEditingDeal(false); };

  // Open deal modal - optionally with org data pre-filled
  const openDealModal = async (org = null) => {
    if (org) {
      // Pre-fill from organization
      setNewDealCompany(org.name);
      setNewDealOrgId(org.id);
      // Fetch org's contacts and locations for dropdowns
      const [contacts, locations] = await Promise.all([
        supabase.from('contacts').select('*').eq('organization_id', org.id).order('name'),
        supabase.from('locations').select('*').eq('organization_id', org.id).order('name')
      ]);
      setDealOrgContacts(contacts.data || []);
      setDealOrgLocations(locations.data || []);
    } else {
      setDealOrgContacts([]);
      setDealOrgLocations([]);
    }
    setNewDealContactId('');
    setNewDealLocationId('');
    setNewDealCreateNewContact(false);
    setNewDealStage('new');
    setShowAddDeal(true);
  };

  // When contact is selected from dropdown, fill in their info
  const handleDealContactSelect = (contactId) => {
    setNewDealContactId(contactId);
    if (contactId === 'new') {
      setNewDealCreateNewContact(true);
      setNewDealContact('');
      setNewDealEmail('');
      setNewDealPhone('');
    } else if (contactId) {
      setNewDealCreateNewContact(false);
      const contact = dealOrgContacts.find(c => c.id === contactId);
      if (contact) {
        setNewDealContact(contact.name);
        setNewDealEmail(contact.email || '');
        setNewDealPhone(contact.phone || '');
      }
    } else {
      setNewDealCreateNewContact(false);
      setNewDealContact('');
      setNewDealEmail('');
      setNewDealPhone('');
    }
  };

  // When location is selected, fill address
  const handleDealLocationSelect = (locationId) => {
    setNewDealLocationId(locationId);
    if (locationId) {
      const location = dealOrgLocations.find(l => l.id === locationId);
      if (location) {
        const addr = [location.address, location.city, location.state, location.zip].filter(Boolean).join(', ');
        setNewDealAddress(addr);
      }
    } else {
      setNewDealAddress('');
    }
  };

  const resetDealModal = () => {
    setShowAddDeal(false);
    setNewDealCompany(''); setNewDealContact(''); setNewDealEmail(''); setNewDealPhone('');
    setNewDealAddress(''); setNewDealDate(''); setNewDealNotes(''); setNewDealOrgId('');
    setNewDealLocationId(''); setNewDealContactId(''); setNewDealCreateNewContact(false);
    setNewDealStage('new');
    setDealOrgContacts([]); setDealOrgLocations([]);
  };

  const createDeal = async () => {
    if (!newDealCompany.trim()) return;
    const stageInfo = STAGES.find(s => s.id === newDealStage) || STAGES[0];
    const dealData = { 
      company_name: newDealCompany, 
      contact_person: newDealContact, 
      email: newDealEmail, 
      phone: newDealPhone, 
      address: newDealAddress, 
      appointment_date: newDealDate || null, 
      notes: newDealNotes, 
      organization_id: newDealOrgId || null,
      location_id: newDealLocationId || null,
      contact_id: newDealContactId && newDealContactId !== 'new' ? newDealContactId : null,
      client_id: client.id, 
      stage: newDealStage, 
      probability: stageInfo.probability, 
      deal_value: 0,
      status: 'pending' 
    };
    const { data, error } = await supabase.from('appointments').insert([dealData]).select();
    if (!error && data) { 
      setAppointments([data[0], ...appointments]); 
      // Also add to orgAppointments if this deal is linked to the currently selected org
      if (newDealOrgId && selectedOrg && newDealOrgId === selectedOrg.id) {
        setOrgAppointments([data[0], ...orgAppointments]);
      }
      resetDealModal(); 
    }
  };

  const updateDeal = async () => {
    const dealValue = calculateDealValue();
    await supabase.from('appointments').update({ company_name: selectedDeal.company_name, contact_person: selectedDeal.contact_person, email: selectedDeal.email, phone: selectedDeal.phone, address: selectedDeal.address, appointment_date: selectedDeal.appointment_date, notes: selectedDeal.notes, expected_close_date: selectedDeal.expected_close_date, next_action: selectedDeal.next_action, next_action_date: selectedDeal.next_action_date, deal_value: dealValue }).eq('id', selectedDeal.id);
    const updatedDeal = { ...selectedDeal, deal_value: dealValue };
    setAppointments(appointments.map(a => a.id === selectedDeal.id ? updatedDeal : a)); setSelectedDeal(updatedDeal); setEditingDeal(false);
  };

  const updateDealStage = async (dealId, newStage, lostReason = null) => {
    const stageInfo = STAGES.find(s => s.id === newStage);
    const updateData = { stage: newStage, probability: stageInfo?.probability || 20 };
    if (lostReason) updateData.lost_reason = lostReason;
    await supabase.from('appointments').update(updateData).eq('id', dealId);
    setAppointments(appointments.map(a => a.id === dealId ? { ...a, ...updateData } : a));
    if (selectedDeal?.id === dealId) setSelectedDeal({ ...selectedDeal, ...updateData });
  };

  const handleDragStart = (e, deal) => { setDraggedDeal(deal); e.dataTransfer.effectAllowed = 'move'; };
  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
  const handleDrop = async (e, targetStage) => {
    e.preventDefault();
    if (!draggedDeal || draggedDeal.stage === targetStage) { setDraggedDeal(null); return; }
    if (targetStage === 'lost') { setPendingLostDeal(draggedDeal); setShowLostReasonModal(true); }
    else { await updateDealStage(draggedDeal.id, targetStage); }
    setDraggedDeal(null);
  };

  const confirmLostDeal = async () => {
    if (pendingLostDeal && selectedLostReason) {
      await updateDealStage(pendingLostDeal.id, 'lost', selectedLostReason);
      setShowLostReasonModal(false); setPendingLostDeal(null); setSelectedLostReason('');
    }
  };

  const addProduct = async () => {
    if (!newProduct.product_name.trim() || !selectedDeal) return;
    const { data, error } = await supabase.from('deal_products').insert([{ ...newProduct, appointment_id: selectedDeal.id }]).select();
    if (!error && data) { 
      const updatedProducts = [...dealProducts, data[0]];
      setDealProducts(updatedProducts); 
      setNewProduct({ product_name: '', description: '', quantity: 1, price: 0 }); 
      setShowAddProduct(false); 
      // Calculate and update deal value immediately
      const productTotal = updatedProducts.reduce((sum, p) => sum + ((p.quantity || 1) * (parseFloat(p.price) || 0)), 0);
      const serviceTotal = dealServices.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);
      const newValue = productTotal + serviceTotal;
      await supabase.from('appointments').update({ deal_value: newValue }).eq('id', selectedDeal.id);
      setSelectedDeal(prev => ({ ...prev, deal_value: newValue }));
      setAppointments(prev => prev.map(a => a.id === selectedDeal.id ? { ...a, deal_value: newValue } : a));
    }
  };

  const deleteProduct = async (productId) => {
    await supabase.from('deal_products').delete().eq('id', productId);
    const updatedProducts = dealProducts.filter(p => p.id !== productId);
    setDealProducts(updatedProducts);
    // Recalculate deal value
    const productTotal = updatedProducts.reduce((sum, p) => sum + ((p.quantity || 1) * (parseFloat(p.price) || 0)), 0);
    const serviceTotal = dealServices.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);
    const newValue = productTotal + serviceTotal;
    await supabase.from('appointments').update({ deal_value: newValue }).eq('id', selectedDeal.id);
    setSelectedDeal(prev => ({ ...prev, deal_value: newValue }));
    setAppointments(prev => prev.map(a => a.id === selectedDeal.id ? { ...a, deal_value: newValue } : a));
  };

  const addService = async () => {
    if (!newService.service_name.trim() || !selectedDeal) return;
    const { data, error } = await supabase.from('deal_services').insert([{ ...newService, appointment_id: selectedDeal.id }]).select();
    if (!error && data) { 
      const updatedServices = [...dealServices, data[0]];
      setDealServices(updatedServices); 
      setNewService({ service_name: '', description: '', frequency: 'one_time', price: 0 }); 
      setShowAddService(false); 
      // Calculate and update deal value immediately
      const productTotal = dealProducts.reduce((sum, p) => sum + ((p.quantity || 1) * (parseFloat(p.price) || 0)), 0);
      const serviceTotal = updatedServices.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);
      const newValue = productTotal + serviceTotal;
      await supabase.from('appointments').update({ deal_value: newValue }).eq('id', selectedDeal.id);
      setSelectedDeal(prev => ({ ...prev, deal_value: newValue }));
      setAppointments(prev => prev.map(a => a.id === selectedDeal.id ? { ...a, deal_value: newValue } : a));
    }
  };

  const deleteService = async (serviceId) => {
    await supabase.from('deal_services').delete().eq('id', serviceId);
    const updatedServices = dealServices.filter(s => s.id !== serviceId);
    setDealServices(updatedServices);
    // Recalculate deal value
    const productTotal = dealProducts.reduce((sum, p) => sum + ((p.quantity || 1) * (parseFloat(p.price) || 0)), 0);
    const serviceTotal = updatedServices.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);
    const newValue = productTotal + serviceTotal;
    await supabase.from('appointments').update({ deal_value: newValue }).eq('id', selectedDeal.id);
    setSelectedDeal(prev => ({ ...prev, deal_value: newValue }));
    setAppointments(prev => prev.map(a => a.id === selectedDeal.id ? { ...a, deal_value: newValue } : a));
  };

  const calculateDealValue = () => {
    const productTotal = dealProducts.reduce((sum, p) => sum + ((p.quantity || 1) * (parseFloat(p.price) || 0)), 0);
    const serviceTotal = dealServices.reduce((sum, s) => sum + (parseFloat(s.price) || 0), 0);
    return productTotal + serviceTotal;
  };

  const handlePhotoUpload = async (file, folder) => {
    if (!file) return null;
    const filePath = folder + '/' + client.id + '-' + Date.now() + '.' + file.name.split('.').pop();
    const { error } = await supabase.storage.from('client-photos').upload(filePath, file, { upsert: true });
    if (error) return null;
    return supabase.storage.from('client-photos').getPublicUrl(filePath).data.publicUrl;
  };

  const savePersonalProfile = async () => {
    let photoUrl = personalProfile.photo_url;
    if (personalPhotoFile) { const url = await handlePhotoUpload(personalPhotoFile, 'personal-photos'); if (url) photoUrl = url; }
    await supabase.from('client_personal_profiles').upsert({ client_id: client.id, ...personalProfile, photo_url: photoUrl }, { onConflict: 'client_id' });
    setPersonalPhotoFile(null); setPersonalPhotoPreview(null); setIsEditingPersonal(false);
  };

  const saveCompanyProfile = async () => {
    let logoUrl = companyProfile.logo_url;
    if (companyLogoFile) { const url = await handlePhotoUpload(companyLogoFile, 'company-logos'); if (url) logoUrl = url; }
    await supabase.from('client_company_profiles').upsert({ client_id: client.id, ...companyProfile, logo_url: logoUrl }, { onConflict: 'client_id' });
    setCompanyLogoFile(null); setCompanyLogoPreview(null); setIsEditingCompany(false);
  };

  const handleLogout = () => { localStorage.removeItem('client'); sessionStorage.removeItem('client'); router.push('/portal'); };
  const maskEIN = (ein) => !ein ? '' : '**-*****' + ein.slice(-2);
  const getStageColor = (stage) => STAGES.find(s => s.id === stage)?.color || 'bg-slate-500';
  const getActivityIcon = (type) => { switch(type) { case 'call': return '📞'; case 'email': return '✉️'; case 'meeting': return '🤝'; case 'task': return '✓'; default: return '📝'; } };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', feature: 'dashboard' },
    { id: 'pipeline', label: 'Pipeline', icon: '🎯', badge: appointments.filter(a => a.stage !== 'won' && a.stage !== 'lost').length, feature: 'pipeline' },
    { id: 'crm', label: 'CRM', icon: '🏢', badge: organizations.length, feature: 'crm' },
    { id: 'personal', label: 'Personal', icon: '👤', feature: 'personal_profile' },
    { id: 'company', label: 'Company', icon: '🏛️', feature: 'company_profile' },
  ];

  if (loading || !client) return (<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"><div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div></div>);

  const renderBreadcrumb = () => (
    <div className="flex items-center text-sm mb-4 flex-wrap gap-1">
      <button onClick={() => { setSelectedOrg(null); setSelectedLocation(null); setSelectedContact(null); }} className="text-teal-600 hover:underline">Organizations</button>
      {selectedOrg && <><span className="mx-2 text-slate-400">/</span><button onClick={() => { setSelectedLocation(null); setSelectedContact(null); openOrg(selectedOrg); }} className="text-teal-600 hover:underline">{selectedOrg.name}</button></>}
      {selectedLocation && <><span className="mx-2 text-slate-400">/</span><button onClick={() => { setSelectedContact(null); openLocation(selectedLocation); }} className="text-teal-600 hover:underline">{selectedLocation.name}</button></>}
      {selectedContact && <><span className="mx-2 text-slate-400">/</span><span className="text-slate-700">{selectedContact.name}</span></>}
    </div>
  );

  const ActivityList = ({ activities, onDelete, source }) => (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {activities.length === 0 ? <p className="text-slate-400 text-center py-4 text-sm">No activities yet</p> : activities.map(activity => (
        <div key={activity.id} className="p-3 bg-slate-50 rounded-xl group">
          <div className="flex justify-between items-start">
            <div className="flex gap-2"><span>{getActivityIcon(activity.type)}</span><div><p className="text-slate-700 text-sm">{activity.content}</p><p className="text-xs text-slate-400 mt-1">{activity.author} • {new Date(activity.created_at).toLocaleString()}</p></div></div>
            <button onClick={() => onDelete(activity.id, source)} className="text-red-500 opacity-0 group-hover:opacity-100 transition text-sm">×</button>
          </div>
        </div>
      ))}
    </div>
  );

  const DealCard = ({ deal }) => (
    <div draggable onDragStart={(e) => handleDragStart(e, deal)} onClick={() => openDeal(deal)} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer mb-3">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-slate-800 text-sm">{deal.company_name}</h4>
        {deal.deal_value > 0 && <span className="text-emerald-600 font-bold text-sm">${parseFloat(deal.deal_value).toLocaleString()}</span>}
      </div>
      <p className="text-xs text-slate-500 mb-2">{deal.contact_person || 'No contact'}</p>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">{deal.appointment_date ? new Date(deal.appointment_date).toLocaleDateString() : 'No date'}</span>
        <span className="px-2 py-0.5 bg-slate-100 rounded-full">{deal.probability || 20}%</span>
      </div>
      {deal.next_action && <div className="mt-2 pt-2 border-t border-slate-100"><p className="text-xs text-amber-600">📌 {deal.next_action}</p></div>}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      
      <aside className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-slate-700/50 flex items-center gap-3">
            <img src="/icon.png" alt="Kinect B2B" className="w-10 h-10 rounded-xl" />
            <div><h1 className="text-white font-bold">Kinect B2B</h1><p className="text-teal-400 text-xs">Client Portal</p></div>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navItems.filter(item => features[item.feature] !== false).map(item => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); setSelectedOrg(null); setSelectedLocation(null); setSelectedContact(null); setSelectedDeal(null); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${activeTab === item.id ? 'bg-teal-600 text-white' : 'text-slate-300 hover:bg-slate-700/50'}`}>
                <span className="flex items-center gap-3"><span>{item.icon}</span>{item.label}</span>
                {item.badge > 0 && <span className="px-2 py-0.5 rounded-full text-xs bg-teal-500 text-white">{item.badge}</span>}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white font-bold">{client.name?.charAt(0)}</div>
              <div><p className="text-white text-sm truncate">{client.name}</p><p className="text-slate-400 text-xs truncate">{client.email}</p></div>
            </div>
            <button onClick={handleLogout} className="w-full py-2 bg-slate-700/50 hover:bg-red-600 text-slate-300 hover:text-white rounded-xl text-sm">Sign Out</button>
          </div>
        </div>
      </aside>

      <div className="lg:ml-64 min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>
            <h2 className="text-xl font-bold text-slate-800">{selectedDeal ? 'Deal Details' : navItems.find(n => n.id === activeTab)?.label}</h2>
          </div>
          <span className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-sm"><span className="w-2 h-2 bg-teal-500 rounded-full"></span>{client.plan}</span>
        </header>

        <main className="flex-1 p-4 md:p-8">

          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-6 text-white">
                <h3 className="text-2xl font-bold">Welcome back, {client.name}! 👋</h3>
                <p className="text-teal-100">Here's your pipeline at a glance.</p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200">
                  <p className="text-slate-500 text-sm">Total Pipeline Value</p>
                  <p className="text-3xl font-bold text-slate-800">${appointments.reduce((sum, a) => sum + (parseFloat(a.deal_value) || 0), 0).toLocaleString()}</p>
                  <p className="text-xs text-teal-600 mt-1">Across {appointments.length} deals</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-200">
                  <p className="text-slate-500 text-sm">New Deals (30 days)</p>
                  <p className="text-3xl font-bold text-blue-600">{appointments.filter(a => new Date(a.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}</p>
                  <p className="text-xs text-blue-600 mt-1">${appointments.filter(a => new Date(a.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).reduce((sum, a) => sum + (parseFloat(a.deal_value) || 0), 0).toLocaleString()} value</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-200">
                  <p className="text-slate-500 text-sm">Won Deals</p>
                  <p className="text-3xl font-bold text-emerald-600">{appointments.filter(a => a.stage === 'won').length}</p>
                  <p className="text-xs text-emerald-600 mt-1">${appointments.filter(a => a.stage === 'won').reduce((sum, a) => sum + (parseFloat(a.deal_value) || 0), 0).toLocaleString()} closed</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-200">
                  <p className="text-slate-500 text-sm">Win Rate</p>
                  <p className="text-3xl font-bold text-slate-800">{appointments.filter(a => a.stage === 'won' || a.stage === 'lost').length > 0 ? Math.round((appointments.filter(a => a.stage === 'won').length / appointments.filter(a => a.stage === 'won' || a.stage === 'lost').length) * 100) : 0}%</p>
                  <p className="text-xs text-slate-500 mt-1">Won vs Lost</p>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Pipeline by Stage - CSS Bar Chart */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200">
                  <h4 className="font-bold text-slate-800 mb-4">Pipeline by Stage</h4>
                  <div className="space-y-4">
                    {(() => {
                      const maxValue = Math.max(...STAGES.map(s => appointments.filter(a => (a.stage || 'new') === s.id).reduce((sum, a) => sum + (parseFloat(a.deal_value) || 0), 0)), 1);
                      return STAGES.map(stage => {
                        const value = appointments.filter(a => (a.stage || 'new') === stage.id).reduce((sum, a) => sum + (parseFloat(a.deal_value) || 0), 0);
                        const percentage = (value / maxValue) * 100;
                        const bgColor = stage.id === 'new' ? 'bg-blue-500' : stage.id === 'confirmed' ? 'bg-amber-500' : stage.id === 'proposal' ? 'bg-purple-500' : stage.id === 'won' ? 'bg-emerald-500' : 'bg-red-500';
                        return (
                          <div key={stage.id}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-slate-600">{stage.label}</span>
                              <span className="font-medium">${value.toLocaleString()}</span>
                            </div>
                            <div className="h-6 bg-slate-100 rounded-lg overflow-hidden">
                              <div className={`h-full ${bgColor} rounded-lg transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Deal Count by Stage - CSS Donut Chart */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200">
                  <h4 className="font-bold text-slate-800 mb-4">Deals by Stage</h4>
                  <div className="flex items-center gap-6">
                    {/* Donut Chart */}
                    <div className="relative w-40 h-40 flex-shrink-0">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        {(() => {
                          const total = appointments.length || 1;
                          let cumulative = 0;
                          return STAGES.map(stage => {
                            const count = appointments.filter(a => (a.stage || 'new') === stage.id).length;
                            const percentage = (count / total) * 100;
                            const strokeColor = stage.id === 'new' ? '#3b82f6' : stage.id === 'confirmed' ? '#f59e0b' : stage.id === 'proposal' ? '#8b5cf6' : stage.id === 'won' ? '#10b981' : '#ef4444';
                            const dashArray = `${percentage} ${100 - percentage}`;
                            const dashOffset = -cumulative;
                            cumulative += percentage;
                            return count > 0 ? (
                              <circle key={stage.id} cx="18" cy="18" r="15.915" fill="none" stroke={strokeColor} strokeWidth="3" strokeDasharray={dashArray} strokeDashoffset={dashOffset} strokeLinecap="round" />
                            ) : null;
                          });
                        })()}
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-slate-800">{appointments.length}</p>
                          <p className="text-xs text-slate-500">Total Deals</p>
                        </div>
                      </div>
                    </div>
                    {/* Legend */}
                    <div className="flex-1 space-y-2">
                      {STAGES.map(stage => {
                        const count = appointments.filter(a => (a.stage || 'new') === stage.id).length;
                        const bgColor = stage.id === 'new' ? 'bg-blue-500' : stage.id === 'confirmed' ? 'bg-amber-500' : stage.id === 'proposal' ? 'bg-purple-500' : stage.id === 'won' ? 'bg-emerald-500' : 'bg-red-500';
                        return (
                          <div key={stage.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 ${bgColor} rounded-full`}></div>
                              <span className="text-sm text-slate-600">{stage.label}</span>
                            </div>
                            <span className="text-sm font-medium">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stage Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {STAGES.map(stage => {
                  const count = appointments.filter(a => (a.stage || 'new') === stage.id).length;
                  const value = appointments.filter(a => (a.stage || 'new') === stage.id).reduce((sum, a) => sum + (parseFloat(a.deal_value) || 0), 0);
                  return (
                    <div key={stage.id} onClick={() => setActiveTab('pipeline')} className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-teal-300 hover:shadow-lg transition cursor-pointer">
                      <div className={`w-10 h-10 ${stage.color} rounded-xl flex items-center justify-center mb-3 text-white text-lg font-bold`}>{count}</div>
                      <p className="font-medium text-slate-800">{stage.label}</p>
                      <p className="text-lg font-bold text-slate-800">${value.toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Row */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Account Manager */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200">
                  <h4 className="font-bold text-slate-800 mb-4">Your Account Manager</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">RC</div>
                    <div>
                      <p className="font-bold text-lg">Robert Cole</p>
                      <a href="mailto:Robert@kinectb2b.com" className="text-teal-600 text-sm hover:underline">Robert@kinectb2b.com</a>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200">
                  <h4 className="font-bold text-slate-800 mb-4">Recent Activity</h4>
                  {recentActivities.length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-4">No recent activity</p>
                  ) : (
                    <div className="space-y-3">
                      {recentActivities.slice(0, 5).map(a => (
                        <div key={a.id} className="flex items-center gap-3 text-sm">
                          <span className="text-lg">{getActivityIcon(a.type)}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-700 truncate">{a.content?.substring(0, 40)}{a.content?.length > 40 ? '...' : ''}</p>
                            <p className="text-xs text-slate-400">{new Date(a.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Pipeline - Kanban Board */}
          {activeTab === 'pipeline' && !selectedDeal && (
            <div className="space-y-4">
              {/* Search and Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative flex-1 max-w-xs">
                    <input
                      type="text"
                      placeholder="Search deals..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500"
                    />
                    <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-xl text-sm">
                    <option value="date">Sort: Date</option>
                    <option value="value">Sort: Value</option>
                    <option value="probability">Sort: Probability</option>
                    <option value="name">Sort: Name</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-slate-500 text-sm">{appointments.filter(a => !searchQuery || a.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) || a.contact_person?.toLowerCase().includes(searchQuery.toLowerCase())).length} deals • ${appointments.filter(a => !searchQuery || a.company_name?.toLowerCase().includes(searchQuery.toLowerCase())).reduce((sum, a) => sum + (parseFloat(a.deal_value) || 0), 0).toLocaleString()}</p>
                  <button onClick={() => openDealModal(null)} className="px-4 py-2 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700">+ New Deal</button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {STAGES.map(stage => {
                  let stageDeals = appointments.filter(a => (a.stage || 'new') === stage.id);
                  // Apply search filter
                  if (searchQuery) {
                    stageDeals = stageDeals.filter(a => 
                      a.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      a.contact_person?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      a.email?.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                  }
                  // Apply sort
                  stageDeals = [...stageDeals].sort((a, b) => {
                    if (sortBy === 'value') return (parseFloat(b.deal_value) || 0) - (parseFloat(a.deal_value) || 0);
                    if (sortBy === 'probability') return (b.probability || 20) - (a.probability || 20);
                    if (sortBy === 'name') return (a.company_name || '').localeCompare(b.company_name || '');
                    return new Date(b.created_at || 0) - new Date(a.created_at || 0); // date default
                  });
                  const stageValue = stageDeals.reduce((sum, a) => sum + (parseFloat(a.deal_value) || 0), 0);
                  return (
                    <div key={stage.id} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, stage.id)} className={`bg-slate-50 rounded-2xl p-4 min-h-[400px] ${draggedDeal ? 'border-2 border-dashed border-slate-300' : ''}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2"><div className={`w-3 h-3 ${stage.color} rounded-full`}></div><h3 className="font-bold text-slate-700">{stage.label}</h3><span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full">{stageDeals.length}</span></div>
                      </div>
                      <p className="text-sm text-slate-500 mb-4">${stageValue.toLocaleString()}</p>
                      <div className="space-y-3">{stageDeals.map(deal => <DealCard key={deal.id} deal={deal} />)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Deal Detail View */}
          {activeTab === 'pipeline' && selectedDeal && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <button onClick={closeDeal} className="flex items-center gap-2 text-slate-600 hover:text-slate-800"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>Back to Pipeline</button>
                <div className="flex items-center gap-3">
                  <select value={selectedDeal.stage || 'new'} onChange={(e) => { if (e.target.value === 'lost') { setPendingLostDeal(selectedDeal); setShowLostReasonModal(true); } else { updateDealStage(selectedDeal.id, e.target.value); }}} className={`px-4 py-2 rounded-xl font-medium ${getStageColor(selectedDeal.stage || 'new')} text-white border-0`}>
                    {STAGES.map(s => <option key={s.id} value={s.id} className="text-slate-800 bg-white">{s.label}</option>)}
                  </select>
                  {editingDeal ? <button onClick={updateDeal} className="px-4 py-2 bg-teal-600 text-white rounded-xl font-medium">Save</button> : <button onClick={() => setEditingDeal(true)} className="px-4 py-2 bg-slate-200 rounded-xl font-medium">Edit</button>}
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-2xl p-6 border border-slate-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>{editingDeal ? <input type="text" value={selectedDeal.company_name} onChange={(e) => setSelectedDeal({...selectedDeal, company_name: e.target.value})} className="text-2xl font-bold border-b border-teal-500 focus:outline-none w-full" /> : <h2 className="text-2xl font-bold text-slate-800">{selectedDeal.company_name}</h2>}<p className="text-slate-500">{selectedDeal.contact_person}</p></div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-emerald-600">${calculateDealValue().toLocaleString()}</p>
                        <div className="flex items-center justify-end gap-2 mt-1">
                          <input 
                            type="number" 
                            min="0" 
                            max="100" 
                            value={selectedDeal.probability || 20} 
                            onChange={async (e) => {
                              const newProb = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                              await supabase.from('appointments').update({ probability: newProb }).eq('id', selectedDeal.id);
                              setSelectedDeal({...selectedDeal, probability: newProb});
                              setAppointments(appointments.map(a => a.id === selectedDeal.id ? {...a, probability: newProb} : a));
                            }}
                            className="w-16 px-2 py-1 text-right border border-slate-200 rounded-lg text-sm font-medium"
                          />
                          <span className="text-sm text-slate-500">% probability</span>
                        </div>
                      </div>
                    </div>
                    {editingDeal ? (
                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <input type="text" placeholder="Contact Person" value={selectedDeal.contact_person || ''} onChange={(e) => setSelectedDeal({...selectedDeal, contact_person: e.target.value})} className="px-4 py-2.5 border border-slate-200 rounded-xl" />
                        <input type="email" placeholder="Email" value={selectedDeal.email || ''} onChange={(e) => setSelectedDeal({...selectedDeal, email: e.target.value})} className="px-4 py-2.5 border border-slate-200 rounded-xl" />
                        <input type="tel" placeholder="Phone" value={selectedDeal.phone || ''} onChange={(e) => setSelectedDeal({...selectedDeal, phone: e.target.value})} className="px-4 py-2.5 border border-slate-200 rounded-xl" />
                        <input type="text" placeholder="Address" value={selectedDeal.address || ''} onChange={(e) => setSelectedDeal({...selectedDeal, address: e.target.value})} className="px-4 py-2.5 border border-slate-200 rounded-xl" />
                        <div><label className="text-xs text-slate-500">Appointment Date</label><input type="date" value={selectedDeal.appointment_date?.split('T')[0] || ''} onChange={(e) => setSelectedDeal({...selectedDeal, appointment_date: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl" /></div>
                        <div><label className="text-xs text-slate-500">Expected Close</label><input type="date" value={selectedDeal.expected_close_date || ''} onChange={(e) => setSelectedDeal({...selectedDeal, expected_close_date: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl" /></div>
                        <input type="text" placeholder="Next Action" value={selectedDeal.next_action || ''} onChange={(e) => setSelectedDeal({...selectedDeal, next_action: e.target.value})} className="px-4 py-2.5 border border-slate-200 rounded-xl" />
                        <div><label className="text-xs text-slate-500">Next Action Date</label><input type="date" value={selectedDeal.next_action_date || ''} onChange={(e) => setSelectedDeal({...selectedDeal, next_action_date: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl" /></div>
                        <textarea placeholder="Notes" value={selectedDeal.notes || ''} onChange={(e) => setSelectedDeal({...selectedDeal, notes: e.target.value})} className="px-4 py-2.5 border border-slate-200 rounded-xl md:col-span-2 h-20" />
                      </div>
                    ) : (
                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div><p className="text-slate-500">Contact</p><p className="font-medium">{selectedDeal.contact_person || 'N/A'}</p></div>
                          <div><p className="text-slate-500">Email</p><p className="font-medium">{selectedDeal.email || 'N/A'}</p></div>
                          <div><p className="text-slate-500">Phone</p><p className="font-medium">{selectedDeal.phone || 'N/A'}</p></div>
                          <div><p className="text-slate-500">Address</p><p className="font-medium">{selectedDeal.address || 'N/A'}</p></div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div><p className="text-slate-500">Appointment Date</p><p className="font-medium">{selectedDeal.appointment_date ? new Date(selectedDeal.appointment_date).toLocaleDateString() : 'N/A'}</p></div>
                          <div><p className="text-slate-500">Expected Close</p><p className="font-medium">{selectedDeal.expected_close_date ? new Date(selectedDeal.expected_close_date).toLocaleDateString() : 'N/A'}</p></div>
                          <div><p className="text-slate-500">Next Action</p><p className="font-medium">{selectedDeal.next_action || 'N/A'}</p></div>
                          <div><p className="text-slate-500">Next Action Date</p><p className="font-medium">{selectedDeal.next_action_date ? new Date(selectedDeal.next_action_date).toLocaleDateString() : 'N/A'}</p></div>
                        </div>
                        {selectedDeal.notes && (
                          <div className="text-sm"><p className="text-slate-500">Notes</p><p className="font-medium bg-slate-50 p-3 rounded-xl mt-1">{selectedDeal.notes}</p></div>
                        )}
                      </div>
                    )}
                    {selectedDeal.next_action && !editingDeal && <div className="mt-4 p-3 bg-amber-50 rounded-xl"><p className="text-amber-800 font-medium">📌 Next: {selectedDeal.next_action}</p>{selectedDeal.next_action_date && <p className="text-amber-600 text-sm">Due: {new Date(selectedDeal.next_action_date).toLocaleDateString()}</p>}</div>}
                    {selectedDeal.lost_reason && <div className="mt-4 p-3 bg-red-50 rounded-xl"><p className="text-red-800 font-medium">❌ Lost Reason: {selectedDeal.lost_reason}</p></div>}
                  </div>

                  {/* Products */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200">
                    <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-slate-800">Products</h3><button onClick={() => setShowAddProduct(true)} className="text-teal-600 font-medium text-sm">+ Add Product</button></div>
                    {showAddProduct && (
                      <div className="p-4 bg-teal-50 rounded-xl mb-4 space-y-3">
                        <input type="text" placeholder="Product Name *" value={newProduct.product_name} onChange={(e) => setNewProduct({...newProduct, product_name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
                        <input type="text" placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
                        <div className="grid grid-cols-2 gap-2">
                          <input type="number" placeholder="Quantity" value={newProduct.quantity} onChange={(e) => setNewProduct({...newProduct, quantity: parseInt(e.target.value) || 1})} className="px-3 py-2 border border-slate-200 rounded-lg" min="1" />
                          <input type="number" placeholder="Price" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})} className="px-3 py-2 border border-slate-200 rounded-lg" min="0" step="0.01" />
                        </div>
                        <div className="flex gap-2"><button onClick={addProduct} className="flex-1 py-2 bg-teal-600 text-white rounded-lg font-medium">Add</button><button onClick={() => setShowAddProduct(false)} className="flex-1 py-2 bg-slate-200 rounded-lg">Cancel</button></div>
                      </div>
                    )}
                    {dealProducts.length === 0 ? <p className="text-slate-400 text-center py-4 text-sm">No products added</p> : (
                      <div className="space-y-2">
                        {dealProducts.map(product => (
                          <div key={product.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group">
                            <div><p className="font-medium text-slate-800">{product.product_name}</p>{product.description && <p className="text-sm text-slate-500">{product.description}</p>}</div>
                            <div className="flex items-center gap-4"><div className="text-right"><p className="text-sm text-slate-500">{product.quantity} × ${parseFloat(product.price).toFixed(2)}</p><p className="font-bold text-slate-800">${((product.quantity || 1) * parseFloat(product.price || 0)).toFixed(2)}</p></div><button onClick={() => deleteProduct(product.id)} className="text-red-500 opacity-0 group-hover:opacity-100">🗑️</button></div>
                          </div>
                        ))}
                        <div className="pt-3 border-t flex justify-between"><span className="font-medium">Products Total:</span><span className="font-bold text-emerald-600">${dealProducts.reduce((sum, p) => sum + ((p.quantity || 1) * parseFloat(p.price || 0)), 0).toFixed(2)}</span></div>
                      </div>
                    )}
                  </div>

                  {/* Services */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200">
                    <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-slate-800">Services</h3><button onClick={() => setShowAddService(true)} className="text-teal-600 font-medium text-sm">+ Add Service</button></div>
                    {showAddService && (
                      <div className="p-4 bg-teal-50 rounded-xl mb-4 space-y-3">
                        <input type="text" placeholder="Service Name *" value={newService.service_name} onChange={(e) => setNewService({...newService, service_name: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
                        <input type="text" placeholder="Description" value={newService.description} onChange={(e) => setNewService({...newService, description: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
                        <div className="grid grid-cols-2 gap-2">
                          <select value={newService.frequency} onChange={(e) => setNewService({...newService, frequency: e.target.value})} className="px-3 py-2 border border-slate-200 rounded-lg">{FREQUENCIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}</select>
                          <input type="number" placeholder="Price" value={newService.price} onChange={(e) => setNewService({...newService, price: parseFloat(e.target.value) || 0})} className="px-3 py-2 border border-slate-200 rounded-lg" min="0" step="0.01" />
                        </div>
                        <div className="flex gap-2"><button onClick={addService} className="flex-1 py-2 bg-teal-600 text-white rounded-lg font-medium">Add</button><button onClick={() => setShowAddService(false)} className="flex-1 py-2 bg-slate-200 rounded-lg">Cancel</button></div>
                      </div>
                    )}
                    {dealServices.length === 0 ? <p className="text-slate-400 text-center py-4 text-sm">No services added</p> : (
                      <div className="space-y-2">
                        {dealServices.map(service => (
                          <div key={service.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group">
                            <div><p className="font-medium text-slate-800">{service.service_name}</p>{service.description && <p className="text-sm text-slate-500">{service.description}</p>}<span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full">{FREQUENCIES.find(f => f.value === service.frequency)?.label || 'One Time'}</span></div>
                            <div className="flex items-center gap-4"><p className="font-bold text-slate-800">${parseFloat(service.price || 0).toFixed(2)}</p><button onClick={() => deleteService(service.id)} className="text-red-500 opacity-0 group-hover:opacity-100">🗑️</button></div>
                          </div>
                        ))}
                        <div className="pt-3 border-t flex justify-between"><span className="font-medium">Services Total:</span><span className="font-bold text-emerald-600">${dealServices.reduce((sum, s) => sum + parseFloat(s.price || 0), 0).toFixed(2)}</span></div>
                      </div>
                    )}
                  </div>
                  {/* Activity Section - Inline form, no separate component */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4">Activity</h3>
                    <div className="mb-4 space-y-3">
                      <select value={newActivityType} onChange={(e) => setNewActivityType(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                        <option value="note">📝 Note</option><option value="call">📞 Call</option><option value="email">✉️ Email</option><option value="meeting">🤝 Meeting</option><option value="task">✓ Task</option>
                      </select>
                      <textarea value={newActivityContent} onChange={(e) => setNewActivityContent(e.target.value)} placeholder="What happened?" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm h-16" />
                      <button onClick={addActivity} disabled={!newActivityContent.trim()} className="w-full py-2 bg-teal-600 text-white rounded-lg text-sm font-medium disabled:opacity-50">Add Activity</button>
                    </div>
                    {dealActivities.length === 0 ? <p className="text-slate-400 text-center py-2 text-sm">No activity yet</p> : (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {dealActivities.map(activity => (
                          <div key={activity.id} className="p-3 bg-slate-50 rounded-lg group">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-xs text-slate-500">{activity.type === 'note' ? '📝' : activity.type === 'call' ? '📞' : activity.type === 'email' ? '✉️' : activity.type === 'meeting' ? '🤝' : '✓'} {activity.author} • {new Date(activity.created_at).toLocaleDateString()}</p>
                                <p className="text-sm text-slate-700 mt-1">{activity.content}</p>
                              </div>
                              <button onClick={() => deleteActivity(activity.id, 'deal')} className="text-red-400 text-xs opacity-0 group-hover:opacity-100">✕</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      {selectedDeal.phone && <a href={`tel:${selectedDeal.phone}`} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100">📞 Call</a>}
                      {selectedDeal.email && <a href={`mailto:${selectedDeal.email}`} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100">✉️ Email</a>}
                      {selectedDeal.address && <a href={`https://maps.google.com/?q=${encodeURIComponent(selectedDeal.address)}`} target="_blank" className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100">📍 Directions</a>}
                    </div>
                  </div>

                  {/* Organization Link Section */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-4">Organization</h3>
                    {selectedDeal.organization_id ? (
                      <div>
                        <div className="p-3 bg-teal-50 rounded-xl mb-3">
                          <p className="font-medium text-teal-800">{organizations.find(o => o.id === selectedDeal.organization_id)?.name || 'Linked Organization'}</p>
                        </div>
                        <button onClick={() => { const org = organizations.find(o => o.id === selectedDeal.organization_id); if(org) { closeDeal(); setActiveTab('crm'); openOrg(org); }}} className="w-full py-2 bg-teal-600 text-white rounded-xl text-sm font-medium mb-2">View Organization in CRM</button>
                        <button onClick={async () => { await supabase.from('appointments').update({ organization_id: null }).eq('id', selectedDeal.id); setSelectedDeal({...selectedDeal, organization_id: null}); setAppointments(appointments.map(a => a.id === selectedDeal.id ? {...a, organization_id: null} : a)); }} className="w-full py-2 bg-slate-100 text-slate-600 rounded-xl text-sm">Change Organization</button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-slate-500 text-sm mb-3">This deal is not linked to an organization</p>
                        <select onChange={(e) => { if(e.target.value) linkDealToOrg(selectedDeal.id, e.target.value); }} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm mb-3">
                          <option value="">Link to Existing Organization...</option>
                          {organizations.map(org => <option key={org.id} value={org.id}>{org.name}</option>)}
                        </select>
                        <button onClick={() => startCreateOrgFromDeal(selectedDeal)} className="w-full py-2 bg-teal-600 text-white rounded-xl text-sm font-medium">+ Create New Organization</button>
                        <p className="text-xs text-slate-400 text-center mt-2">Pre-fills with deal info & auto-links</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CRM Tab */}
          {activeTab === 'crm' && (
            <div className="space-y-4">
              {renderBreadcrumb()}
              {!selectedOrg && (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div className="relative flex-1 max-w-xs">
                      <input
                        type="text"
                        placeholder="Search organizations..."
                        value={crmSearchQuery}
                        onChange={(e) => setCrmSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500"
                      />
                      <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-slate-500 text-sm">{organizations.filter(o => !crmSearchQuery || o.name?.toLowerCase().includes(crmSearchQuery.toLowerCase()) || o.industry?.toLowerCase().includes(crmSearchQuery.toLowerCase())).length} organizations</p>
                      <button onClick={() => setShowAddOrg(true)} className="px-4 py-2 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700">+ Add Organization</button>
                    </div>
                  </div>
                  {showAddOrg && (
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-4">
                      <h3 className="font-bold mb-4">New Organization</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Organization Name *" value={newOrgName} onChange={(e) => setNewOrgName(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl" />
                        <input type="text" placeholder="Industry" value={newOrgIndustry} onChange={(e) => setNewOrgIndustry(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl" />
                        <input type="text" placeholder="Phone" value={newOrgPhone} onChange={(e) => setNewOrgPhone(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl" />
                        <input type="text" placeholder="Website" value={newOrgWebsite} onChange={(e) => setNewOrgWebsite(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl" />
                        <input type="text" placeholder="Address" value={newOrgAddress} onChange={(e) => setNewOrgAddress(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl" />
                        <div className="grid grid-cols-3 gap-2">
                          <input type="text" placeholder="City" value={newOrgCity} onChange={(e) => setNewOrgCity(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-xl" />
                          <input type="text" placeholder="State" value={newOrgState} onChange={(e) => setNewOrgState(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-xl" />
                          <input type="text" placeholder="ZIP" value={newOrgZip} onChange={(e) => setNewOrgZip(e.target.value)} className="px-3 py-2.5 border border-slate-200 rounded-xl" />
                        </div>
                        <select value={newOrgEmployeeCount} onChange={(e) => setNewOrgEmployeeCount(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600">
                          <option value="">Employee Count</option>
                          <option value="1-10">1-10</option>
                          <option value="11-50">11-50</option>
                          <option value="51-200">51-200</option>
                          <option value="201-500">201-500</option>
                          <option value="501-1000">501-1000</option>
                          <option value="1000+">1000+</option>
                        </select>
                        <select value={newOrgRevenueRange} onChange={(e) => setNewOrgRevenueRange(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600">
                          <option value="">Revenue Range</option>
                          <option value="$0-100K">$0-100K</option>
                          <option value="$100K-500K">$100K-500K</option>
                          <option value="$500K-1M">$500K-1M</option>
                          <option value="$1M-5M">$1M-5M</option>
                          <option value="$5M-10M">$5M-10M</option>
                          <option value="$10M+">$10M+</option>
                        </select>
                        <input type="number" placeholder="Founded Year" value={newOrgFoundedYear} onChange={(e) => setNewOrgFoundedYear(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl" />
                        <input type="text" placeholder="LinkedIn URL" value={newOrgLinkedin} onChange={(e) => setNewOrgLinkedin(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl" />
                        <textarea placeholder="Description" value={newOrgDescription} onChange={(e) => setNewOrgDescription(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl md:col-span-2" rows={2} />
                        <textarea placeholder="Notes" value={newOrgNotes} onChange={(e) => setNewOrgNotes(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl md:col-span-2" rows={2} />
                      </div>
                      <div className="flex gap-3 mt-4"><button onClick={createOrg} className="px-6 py-2 bg-teal-600 text-white rounded-xl font-medium">Create</button><button onClick={resetOrgForm} className="px-6 py-2 bg-slate-200 rounded-xl">Cancel</button></div>
                    </div>
                  )}
                  {organizations.filter(o => !crmSearchQuery || o.name?.toLowerCase().includes(crmSearchQuery.toLowerCase()) || o.industry?.toLowerCase().includes(crmSearchQuery.toLowerCase())).length === 0 ? <div className="bg-white rounded-2xl border border-slate-200 text-center py-16"><span className="text-5xl">🏢</span><p className="text-slate-500 mt-3">{crmSearchQuery ? 'No matching organizations' : 'No organizations yet'}</p></div> : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{organizations.filter(o => !crmSearchQuery || o.name?.toLowerCase().includes(crmSearchQuery.toLowerCase()) || o.industry?.toLowerCase().includes(crmSearchQuery.toLowerCase())).map(org => (
                      <div key={org.id} onClick={() => openOrg(org)} className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-teal-300 hover:shadow-lg transition cursor-pointer">
                        <div className="flex items-center gap-3"><div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 font-bold text-lg">{org.name?.charAt(0)}</div><div><h4 className="font-bold text-slate-800">{org.name}</h4>{org.industry && <p className="text-sm text-slate-500">{org.industry}</p>}</div></div>
                      </div>
                    ))}</div>
                  )}
                </div>
              )}

              {selectedOrg && !selectedLocation && !selectedContact && (
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Organization Header */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 font-bold text-2xl">{selectedOrg.name?.charAt(0)}</div>
                          <div>
                            <h2 className="text-2xl font-bold text-slate-800">{selectedOrg.name}</h2>
                            {selectedOrg.industry && <p className="text-slate-500">{selectedOrg.industry}</p>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingOrg(true)} className="px-4 py-2 bg-teal-600 text-white rounded-xl">Edit</button>
                          <button onClick={deleteOrg} className="px-4 py-2 bg-red-100 text-red-600 rounded-xl">Delete</button>
                        </div>
                      </div>
                      {/* Organization Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div><p className="text-slate-500">Phone</p><p className="font-medium">{selectedOrg.phone || '—'}</p></div>
                        <div><p className="text-slate-500">Website</p>{selectedOrg.website ? <a href={selectedOrg.website.startsWith('http') ? selectedOrg.website : `https://${selectedOrg.website}`} target="_blank" className="font-medium text-teal-600 hover:underline">{selectedOrg.website}</a> : <p className="font-medium">—</p>}</div>
                        <div><p className="text-slate-500">LinkedIn</p>{selectedOrg.linkedin ? <a href={selectedOrg.linkedin} target="_blank" className="font-medium text-teal-600 hover:underline">View Profile</a> : <p className="font-medium">—</p>}</div>
                        <div><p className="text-slate-500">Address</p><p className="font-medium">{selectedOrg.address || '—'}</p></div>
                        <div><p className="text-slate-500">City, State</p><p className="font-medium">{[selectedOrg.city, selectedOrg.state].filter(Boolean).join(', ') || '—'}</p></div>
                        <div><p className="text-slate-500">ZIP</p><p className="font-medium">{selectedOrg.zip || '—'}</p></div>
                        <div><p className="text-slate-500">Employees</p><p className="font-medium">{selectedOrg.employee_count || '—'}</p></div>
                        <div><p className="text-slate-500">Revenue</p><p className="font-medium">{selectedOrg.revenue_range || '—'}</p></div>
                        <div><p className="text-slate-500">Founded</p><p className="font-medium">{selectedOrg.founded_year || '—'}</p></div>
                      </div>
                      {selectedOrg.description && <div className="mt-4 pt-4 border-t"><p className="text-slate-500 text-sm">Description</p><p className="text-slate-700">{selectedOrg.description}</p></div>}
                      {selectedOrg.notes && <div className="mt-4 pt-4 border-t"><p className="text-slate-500 text-sm">Notes</p><p className="text-slate-700">{selectedOrg.notes}</p></div>}
                    </div>

                    {/* Locations */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200">
                      <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-slate-800">Locations ({orgLocations.length})</h3><button onClick={() => setShowAddLocation(true)} className="text-teal-600 font-medium text-sm">+ Add</button></div>
                      {showAddLocation && (
                        <div className="p-4 bg-teal-50 rounded-xl mb-4 space-y-3">
                          <input type="text" placeholder="Location Name *" value={newLocName} onChange={(e) => setNewLocName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
                          <input type="text" placeholder="Address" value={newLocAddress} onChange={(e) => setNewLocAddress(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
                          <div className="grid grid-cols-3 gap-2">
                            <input type="text" placeholder="City" value={newLocCity} onChange={(e) => setNewLocCity(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg" />
                            <input type="text" placeholder="State" value={newLocState} onChange={(e) => setNewLocState(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg" />
                            <input type="text" placeholder="ZIP" value={newLocZip} onChange={(e) => setNewLocZip(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg" />
                          </div>
                          <div className="flex gap-2"><button onClick={createLocation} className="flex-1 py-2 bg-teal-600 text-white rounded-lg">Add</button><button onClick={() => { setShowAddLocation(false); setNewLocName(''); setNewLocAddress(''); setNewLocCity(''); setNewLocState(''); setNewLocZip(''); }} className="flex-1 py-2 bg-slate-200 rounded-lg">Cancel</button></div>
                        </div>
                      )}
                      {orgLocations.length === 0 ? <p className="text-slate-400 text-center py-4">No locations</p> : (<div className="space-y-2">{orgLocations.map(loc => (<div key={loc.id} onClick={() => openLocation(loc)} className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 cursor-pointer"><p className="font-medium text-slate-800">{loc.name}</p>{loc.address && <p className="text-sm text-slate-500">{loc.address}, {loc.city}</p>}</div>))}</div>)}
                    </div>

                    {/* Contacts */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200">
                      <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-slate-800">Contacts ({orgContacts.length})</h3><button onClick={() => setShowAddContact(true)} className="text-teal-600 font-medium text-sm">+ Add</button></div>
                      {showAddContact && (
                        <div className="p-4 bg-teal-50 rounded-xl mb-4 space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="First Name *" value={newContactFirstName} onChange={(e) => setNewContactFirstName(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg" />
                            <input type="text" placeholder="Last Name" value={newContactLastName} onChange={(e) => setNewContactLastName(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="Job Title" value={newContactJobTitle} onChange={(e) => setNewContactJobTitle(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg" />
                            <input type="text" placeholder="Role (e.g., Decision Maker)" value={newContactRole} onChange={(e) => setNewContactRole(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input type="email" placeholder="Email" value={newContactEmail} onChange={(e) => setNewContactEmail(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg" />
                            <input type="tel" placeholder="Direct Phone" value={newContactPhone} onChange={(e) => setNewContactPhone(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input type="tel" placeholder="Work Phone" value={newContactWorkPhone} onChange={(e) => setNewContactWorkPhone(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg" />
                            <input type="tel" placeholder="Mobile" value={newContactMobile} onChange={(e) => setNewContactMobile(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg" />
                          </div>
                          <input type="text" placeholder="LinkedIn URL" value={newContactLinkedin} onChange={(e) => setNewContactLinkedin(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={newContactIsPrimary} onChange={(e) => setNewContactIsPrimary(e.target.checked)} className="rounded" />
                            <span>Primary Contact</span>
                          </label>
                          <div className="flex gap-2"><button onClick={createContact} className="flex-1 py-2 bg-teal-600 text-white rounded-lg">Add Contact</button><button onClick={resetContactForm} className="flex-1 py-2 bg-slate-200 rounded-lg">Cancel</button></div>
                        </div>
                      )}
                      {orgContacts.length === 0 ? <p className="text-slate-400 text-center py-4">No contacts</p> : (
                        <div className="space-y-2">{orgContacts.map(contact => (
                          <div key={contact.id} onClick={() => openContact(contact)} className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 cursor-pointer">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-slate-800">{contact.name || `${contact.first_name} ${contact.last_name}`}{contact.is_primary && <span className="ml-2 px-2 py-0.5 bg-teal-100 text-teal-700 text-xs rounded-full">Primary</span>}</p>
                                {contact.job_title && <p className="text-sm text-slate-500">{contact.job_title}</p>}
                                {contact.role && <p className="text-xs text-slate-400">{contact.role}</p>}
                              </div>
                              <div className="text-right text-sm text-slate-500">
                                {contact.email && <p>{contact.email}</p>}
                                {contact.phone && <p>{contact.phone}</p>}
                              </div>
                            </div>
                          </div>
                        ))}</div>
                      )}
                    </div>

                    {/* Deals */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200">
                      <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-slate-800">Deals ({orgAppointments.length})</h3><button onClick={() => openDealModal(selectedOrg)} className="text-teal-600 font-medium text-sm">+ Create Deal</button></div>
                      {orgAppointments.length === 0 ? <p className="text-slate-400 text-center py-4">No deals yet</p> : (
                        <div className="space-y-2">{orgAppointments.map(deal => {
                          const stageInfo = STAGES.find(s => s.id === (deal.stage || 'new')) || STAGES[0];
                          return (
                            <div key={deal.id} onClick={() => { setActiveTab('pipeline'); setTimeout(() => openDeal(deal), 100); }} className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 cursor-pointer">
                              <div className="flex justify-between items-start">
                                <div><p className="font-medium text-slate-800">{deal.company_name}</p><p className="text-sm text-slate-500">{deal.contact_person || 'No contact'}</p></div>
                                <div className="text-right"><span className={`px-2 py-0.5 rounded-full text-xs text-white ${stageInfo.color}`}>{stageInfo.label}</span>{deal.deal_value > 0 && <p className="text-emerald-600 font-bold text-sm mt-1">${parseFloat(deal.deal_value).toLocaleString()}</p>}</div>
                              </div>
                            </div>
                          );
                        })}</div>
                      )}
                    </div>
                  </div>

                  {/* Sidebar - Activity */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-slate-200">
                      <h3 className="font-bold text-slate-800 mb-4">Activity</h3>
                      {/* Activity Tabs */}
                      <div className="flex gap-1 mb-4 overflow-x-auto">
                        {[{id: 'all', label: 'All'}, {id: 'note', label: '📝'}, {id: 'call', label: '📞'}, {id: 'email', label: '✉️'}, {id: 'meeting', label: '🤝'}, {id: 'task', label: '✓'}].map(tab => (
                          <button key={tab.id} onClick={() => setActivityTab(tab.id)} className={`px-3 py-1 rounded-lg text-sm ${activityTab === tab.id ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{tab.label}</button>
                        ))}
                      </div>
                      <div className="mb-4 space-y-3">
                        <select value={newActivityType} onChange={(e) => setNewActivityType(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                          <option value="note">📝 Note</option><option value="call">📞 Call</option><option value="email">✉️ Email</option><option value="meeting">🤝 Meeting</option><option value="task">✓ Task</option>
                        </select>
                        <textarea value={newActivityContent} onChange={(e) => setNewActivityContent(e.target.value)} placeholder="What happened?" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm h-16" />
                        <button onClick={addActivity} disabled={!newActivityContent.trim()} className="w-full py-2 bg-teal-600 text-white rounded-lg text-sm font-medium disabled:opacity-50">Add Activity</button>
                      </div>
                      {orgActivities.filter(a => activityTab === 'all' || a.type === activityTab).length === 0 ? <p className="text-slate-400 text-center py-2 text-sm">No activity yet</p> : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {orgActivities.filter(a => activityTab === 'all' || a.type === activityTab).map(activity => (
                            <div key={activity.id} className="p-3 bg-slate-50 rounded-lg group">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-xs text-slate-500">{activity.type === 'note' ? '📝' : activity.type === 'call' ? '📞' : activity.type === 'email' ? '✉️' : activity.type === 'meeting' ? '🤝' : '✓'} {activity.author} • {new Date(activity.created_at).toLocaleDateString()}</p>
                                  <p className="text-sm text-slate-700 mt-1">{activity.content}</p>
                                </div>
                                <button onClick={() => deleteActivity(activity.id, 'org')} className="text-red-400 text-xs opacity-0 group-hover:opacity-100">✕</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200">
                      <h3 className="font-bold text-slate-800 mb-4">Overview</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between"><span className="text-slate-500">Locations</span><span className="font-medium">{orgLocations.length}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Contacts</span><span className="font-medium">{orgContacts.length}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Open Deals</span><span className="font-medium">{orgAppointments.filter(d => d.stage !== 'won' && d.stage !== 'lost').length}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Won Deals</span><span className="font-medium text-emerald-600">{orgAppointments.filter(d => d.stage === 'won').length}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Total Value</span><span className="font-bold text-emerald-600">${orgAppointments.reduce((sum, d) => sum + (parseFloat(d.deal_value) || 0), 0).toLocaleString()}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedLocation && !selectedContact && (
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-slate-200"><div className="flex justify-between items-start"><div><h2 className="text-2xl font-bold text-slate-800">{selectedLocation.name}</h2><p className="text-slate-500">{selectedOrg.name}</p>{selectedLocation.address && <p className="text-slate-600 mt-2">{selectedLocation.address}, {selectedLocation.city}, {selectedLocation.state}</p>}</div><div className="flex gap-2"><button onClick={deleteLocation} className="px-4 py-2 bg-red-100 text-red-600 rounded-xl">Delete</button></div></div></div>
                    <div className="bg-white rounded-2xl p-6 border border-slate-200">
                      <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-slate-800">Contacts ({locationContacts.length})</h3><button onClick={() => setShowAddContact(true)} className="text-teal-600 font-medium text-sm">+ Add</button></div>
                      {showAddContact && (
                        <div className="p-4 bg-teal-50 rounded-xl mb-4 space-y-3">
                          <input type="text" placeholder="Name *" value={newContactName} onChange={(e) => setNewContactName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
                          <input type="text" placeholder="Role" value={newContactRole} onChange={(e) => setNewContactRole(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
                          <div className="flex gap-2"><button onClick={createContact} className="flex-1 py-2 bg-teal-600 text-white rounded-lg">Add</button><button onClick={() => setShowAddContact(false)} className="flex-1 py-2 bg-slate-200 rounded-lg">Cancel</button></div>
                        </div>
                      )}
                      {locationContacts.length === 0 ? <p className="text-slate-400 text-center py-4">No contacts</p> : (<div className="space-y-2">{locationContacts.map(contact => (<div key={contact.id} onClick={() => openContact(contact)} className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 cursor-pointer"><p className="font-medium">{contact.name}</p>{contact.role && <p className="text-sm text-slate-500">{contact.role}</p>}</div>))}</div>)}
                    </div>
                  </div>
                  <div>
                    <div className="bg-white rounded-2xl p-6 border border-slate-200">
                      <h3 className="font-bold text-slate-800 mb-4">Activity</h3>
                      <div className="mb-4 space-y-3">
                        <select value={newActivityType} onChange={(e) => setNewActivityType(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                          <option value="note">📝 Note</option><option value="call">📞 Call</option><option value="email">✉️ Email</option><option value="meeting">🤝 Meeting</option><option value="task">✓ Task</option>
                        </select>
                        <textarea value={newActivityContent} onChange={(e) => setNewActivityContent(e.target.value)} placeholder="What happened?" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm h-16" />
                        <button onClick={addActivity} disabled={!newActivityContent.trim()} className="w-full py-2 bg-teal-600 text-white rounded-lg text-sm font-medium disabled:opacity-50">Add Activity</button>
                      </div>
                      {locationActivities.length === 0 ? <p className="text-slate-400 text-center py-2 text-sm">No activity yet</p> : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {locationActivities.map(activity => (
                            <div key={activity.id} className="p-3 bg-slate-50 rounded-lg group">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-xs text-slate-500">{activity.type === 'note' ? '📝' : activity.type === 'call' ? '📞' : activity.type === 'email' ? '✉️' : activity.type === 'meeting' ? '🤝' : '✓'} {activity.author} • {new Date(activity.created_at).toLocaleDateString()}</p>
                                  <p className="text-sm text-slate-700 mt-1">{activity.content}</p>
                                </div>
                                <button onClick={() => deleteActivity(activity.id, 'location')} className="text-red-400 text-xs opacity-0 group-hover:opacity-100">✕</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {selectedContact && (
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2"><div className="bg-white rounded-2xl p-6 border border-slate-200"><div className="flex justify-between items-start mb-4"><div className="flex items-center gap-4"><div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-2xl">{selectedContact.name?.charAt(0)}</div><div><h2 className="text-2xl font-bold text-slate-800">{selectedContact.name}</h2>{selectedContact.role && <p className="text-slate-500">{selectedContact.role}</p>}</div></div><div className="flex gap-2"><button onClick={deleteContact} className="px-4 py-2 bg-red-100 text-red-600 rounded-xl">Delete</button></div></div><div className="grid grid-cols-2 gap-4 text-sm">{selectedContact.email && <div><p className="text-slate-500">Email</p><p className="font-medium">{selectedContact.email}</p></div>}{selectedContact.phone && <div><p className="text-slate-500">Phone</p><p className="font-medium">{selectedContact.phone}</p></div>}</div><div className="flex gap-2 mt-4 pt-4 border-t">{selectedContact.phone && <a href={`tel:${selectedContact.phone}`} className="px-4 py-2 bg-slate-100 rounded-xl text-sm">📞 Call</a>}{selectedContact.email && <a href={`mailto:${selectedContact.email}`} className="px-4 py-2 bg-slate-100 rounded-xl text-sm">✉️ Email</a>}</div></div></div>
                  <div>
                    <div className="bg-white rounded-2xl p-6 border border-slate-200">
                      <h3 className="font-bold text-slate-800 mb-4">Activity</h3>
                      <div className="mb-4 space-y-3">
                        <select value={newActivityType} onChange={(e) => setNewActivityType(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm">
                          <option value="note">📝 Note</option><option value="call">📞 Call</option><option value="email">✉️ Email</option><option value="meeting">🤝 Meeting</option><option value="task">✓ Task</option>
                        </select>
                        <textarea value={newActivityContent} onChange={(e) => setNewActivityContent(e.target.value)} placeholder="What happened?" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm h-16" />
                        <button onClick={addActivity} disabled={!newActivityContent.trim()} className="w-full py-2 bg-teal-600 text-white rounded-lg text-sm font-medium disabled:opacity-50">Add Activity</button>
                      </div>
                      {contactActivities.length === 0 ? <p className="text-slate-400 text-center py-2 text-sm">No activity yet</p> : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {contactActivities.map(activity => (
                            <div key={activity.id} className="p-3 bg-slate-50 rounded-lg group">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-xs text-slate-500">{activity.type === 'note' ? '📝' : activity.type === 'call' ? '📞' : activity.type === 'email' ? '✉️' : activity.type === 'meeting' ? '🤝' : '✓'} {activity.author} • {new Date(activity.created_at).toLocaleDateString()}</p>
                                  <p className="text-sm text-slate-700 mt-1">{activity.content}</p>
                                </div>
                                <button onClick={() => deleteActivity(activity.id, 'contact')} className="text-red-400 text-xs opacity-0 group-hover:opacity-100">✕</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Personal Profile Tab */}
          {activeTab === 'personal' && (
            <div className="max-w-3xl bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex justify-between mb-6">
                <h3 className="text-lg font-bold">Personal Information</h3>
                {!isEditingPersonal && <button onClick={() => setIsEditingPersonal(true)} className="px-4 py-2 bg-teal-600 text-white rounded-xl">Edit</button>}
              </div>
              <div className="flex items-center gap-4 mb-6">
                {personalPhotoPreview || personalProfile.photo_url ? <img src={personalPhotoPreview || personalProfile.photo_url} className="w-20 h-20 rounded-2xl object-cover" alt="" /> : <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl">👤</div>}
                {isEditingPersonal && <><input type="file" ref={personalFileInputRef} onChange={(e) => { if(e.target.files[0]) { setPersonalPhotoFile(e.target.files[0]); setPersonalPhotoPreview(URL.createObjectURL(e.target.files[0])); }}} className="hidden" accept="image/*" /><button onClick={() => personalFileInputRef.current?.click()} className="text-teal-600 text-sm">Change Photo</button></>}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {['name', 'job_title', 'email', 'phone', 'mailing_address', 'city', 'state', 'zip_code'].map(field => (
                  <div key={field} className={field === 'mailing_address' ? 'md:col-span-2' : ''}><label className="block text-sm font-medium text-slate-700 mb-1 capitalize">{field.replace(/_/g, ' ')}</label><input type="text" value={personalProfile[field] || ''} onChange={(e) => setPersonalProfile({...personalProfile, [field]: e.target.value})} disabled={!isEditingPersonal} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl disabled:bg-slate-50" /></div>
                ))}
              </div>
              {isEditingPersonal && <div className="flex gap-3 mt-6"><button onClick={savePersonalProfile} className="flex-1 py-2.5 bg-teal-600 text-white rounded-xl">Save</button><button onClick={() => setIsEditingPersonal(false)} className="flex-1 py-2.5 bg-slate-200 rounded-xl">Cancel</button></div>}
            </div>
          )}

          {/* Company Profile Tab */}
          {activeTab === 'company' && (
            <div className="max-w-3xl bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex justify-between mb-6">
                <h3 className="text-lg font-bold">Company Information</h3>
                {!isEditingCompany && <button onClick={() => setIsEditingCompany(true)} className="px-4 py-2 bg-teal-600 text-white rounded-xl">Edit</button>}
              </div>
              <div className="flex items-center gap-4 mb-6">
                {companyLogoPreview || companyProfile.logo_url ? <img src={companyLogoPreview || companyProfile.logo_url} className="w-20 h-20 rounded-2xl object-cover" alt="" /> : <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl">🏢</div>}
                {isEditingCompany && <><input type="file" ref={companyFileInputRef} onChange={(e) => { if(e.target.files[0]) { setCompanyLogoFile(e.target.files[0]); setCompanyLogoPreview(URL.createObjectURL(e.target.files[0])); }}} className="hidden" accept="image/*" /><button onClick={() => companyFileInputRef.current?.click()} className="text-teal-600 text-sm">Change Logo</button></>}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {['company_name', 'number_of_employees', 'company_email', 'company_phone', 'company_address', 'company_city', 'company_state', 'company_zip'].map(field => (
                  <div key={field} className={field === 'company_address' ? 'md:col-span-2' : ''}><label className="block text-sm font-medium text-slate-700 mb-1 capitalize">{field.replace('company_', '').replace(/_/g, ' ')}</label><input type="text" value={companyProfile[field] || ''} onChange={(e) => setCompanyProfile({...companyProfile, [field]: e.target.value})} disabled={!isEditingCompany} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl disabled:bg-slate-50" /></div>
                ))}
                <div className="md:col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1">EIN Number</label><div className="flex gap-2"><input type={showEIN ? 'text' : 'password'} value={isEditingCompany ? (companyProfile.ein_number || '') : maskEIN(companyProfile.ein_number)} onChange={(e) => setCompanyProfile({...companyProfile, ein_number: e.target.value})} disabled={!isEditingCompany} className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl disabled:bg-slate-50" />{!isEditingCompany && companyProfile.ein_number && <button onClick={() => setShowEIN(!showEIN)} className="px-3">{showEIN ? '🙈' : '👁️'}</button>}</div></div>
              </div>
              {isEditingCompany && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-4">Team Members</h4>
                  <div className="flex gap-2 mb-4">
                    <input placeholder="Name" value={newEmployeeName} onChange={(e) => setNewEmployeeName(e.target.value)} className="flex-1 px-4 py-2 border rounded-xl" />
                    <input placeholder="Title" value={newEmployeeTitle} onChange={(e) => setNewEmployeeTitle(e.target.value)} className="flex-1 px-4 py-2 border rounded-xl" />
                    <button onClick={addEmployee} className="px-4 py-2 bg-teal-600 text-white rounded-xl">Add</button>
                  </div>
                  {companyProfile.employees?.map(emp => <div key={emp.id} className="flex justify-between p-3 bg-slate-50 rounded-xl mb-2"><div><p className="font-medium">{emp.name}</p><p className="text-sm text-slate-500">{emp.job_title}</p></div><button onClick={() => removeEmployee(emp.id)} className="text-red-500">×</button></div>)}
                </div>
              )}
              {isEditingCompany && <div className="flex gap-3 mt-6"><button onClick={saveCompanyProfile} className="flex-1 py-2.5 bg-teal-600 text-white rounded-xl">Save</button><button onClick={() => setIsEditingCompany(false)} className="flex-1 py-2.5 bg-slate-200 rounded-xl">Cancel</button></div>}
            </div>
          )}
        </main>

        <footer className="py-6 text-center border-t border-slate-200 bg-white">
          <div className="flex items-center justify-center gap-2 mb-2"><img src="/icon.png" className="w-5 h-5 rounded" alt="" /><span className="text-slate-500 text-sm">Powered by <span className="font-semibold">Kinect B2B</span></span></div>
          <p className="text-slate-400 text-xs">© {new Date().getFullYear()} Kinect B2B. All rights reserved.</p>
        </footer>
      </div>

      {/* Add Deal Modal */}
      {showAddDeal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">New Deal</h3>
            <div className="space-y-4">
              {/* Company Name - pre-filled if from org */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name *</label>
                <input type="text" value={newDealCompany} onChange={(e) => setNewDealCompany(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl" />
              </div>

              {/* Organization selector - only show if not pre-selected */}
              {!newDealOrgId && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Link to Organization</label>
                  <select value={newDealOrgId} onChange={(e) => setNewDealOrgId(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl">
                    <option value="">None</option>
                    {organizations.map(org => <option key={org.id} value={org.id}>{org.name}</option>)}
                  </select>
                </div>
              )}

              {/* Location dropdown - only if org has locations */}
              {dealOrgLocations.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <select value={newDealLocationId} onChange={(e) => handleDealLocationSelect(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl">
                    <option value="">Select Location</option>
                    {dealOrgLocations.map(loc => <option key={loc.id} value={loc.id}>{loc.name} {loc.city && `- ${loc.city}`}</option>)}
                  </select>
                </div>
              )}

              {/* Contact dropdown - only if org has contacts */}
              {dealOrgContacts.length > 0 && !newDealCreateNewContact && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person</label>
                  <select value={newDealContactId} onChange={(e) => handleDealContactSelect(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl">
                    <option value="">Select Contact</option>
                    {dealOrgContacts.map(c => <option key={c.id} value={c.id}>{c.name} {c.role && `(${c.role})`}</option>)}
                    <option value="new">+ Create New Contact</option>
                  </select>
                </div>
              )}

              {/* Manual contact entry - show if no org contacts OR creating new */}
              {(dealOrgContacts.length === 0 || newDealCreateNewContact) && (
                <>
                  {newDealCreateNewContact && (
                    <div className="flex items-center justify-between bg-teal-50 p-2 rounded-lg">
                      <span className="text-sm text-teal-700">Creating new contact</span>
                      <button onClick={() => { setNewDealCreateNewContact(false); setNewDealContactId(''); }} className="text-teal-600 text-sm">← Back to list</button>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Contact Name</label>
                    <input type="text" value={newDealContact} onChange={(e) => setNewDealContact(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl" placeholder="Enter contact name" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                      <input type="email" value={newDealEmail} onChange={(e) => setNewDealEmail(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                      <input type="tel" value={newDealPhone} onChange={(e) => setNewDealPhone(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl" />
                    </div>
                  </div>
                </>
              )}

              {/* Show selected contact info if picked from dropdown */}
              {newDealContactId && newDealContactId !== 'new' && (newDealEmail || newDealPhone) && (
                <div className="bg-slate-50 p-3 rounded-xl text-sm">
                  <p className="font-medium text-slate-700">{newDealContact}</p>
                  {newDealEmail && <p className="text-slate-500">{newDealEmail}</p>}
                  {newDealPhone && <p className="text-slate-500">{newDealPhone}</p>}
                </div>
              )}

              {/* Address - auto-filled from location or manual */}
              {!newDealLocationId && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                  <input type="text" value={newDealAddress} onChange={(e) => setNewDealAddress(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Appointment Date</label>
                  <input type="date" value={newDealDate} onChange={(e) => setNewDealDate(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stage</label>
                  <select value={newDealStage} onChange={(e) => setNewDealStage(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl">
                    {STAGES.filter(s => s.id !== 'lost').map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea value={newDealNotes} onChange={(e) => setNewDealNotes(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl h-20" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={createDeal} className="flex-1 py-2.5 bg-teal-600 text-white rounded-xl font-medium">Create Deal</button>
              <button onClick={resetDealModal} className="flex-1 py-2.5 bg-slate-200 rounded-xl">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Organization from Deal Modal */}
      {showAddOrg && createOrgFromDeal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold mb-2">Create New Organization</h3>
            <p className="text-slate-500 text-sm mb-4">This will create an organization and link it to the current deal</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name *</label>
                <input type="text" value={newOrgName} onChange={(e) => setNewOrgName(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                <input type="text" value={newOrgIndustry} onChange={(e) => setNewOrgIndustry(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                <input type="text" value={newOrgWebsite} onChange={(e) => setNewOrgWebsite(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea value={newOrgNotes} onChange={(e) => setNewOrgNotes(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl h-20" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={createOrg} className="flex-1 py-2.5 bg-teal-600 text-white rounded-xl font-medium">Create & Link</button>
              <button onClick={cancelCreateOrg} className="flex-1 py-2.5 bg-slate-200 rounded-xl">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Contact Prompt Modal */}
      {showAddContactPrompt && pendingContactAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-2">Add Contact to Organization?</h3>
            <p className="text-slate-500 text-sm mb-4">Would you like to add this contact to your organization's CRM?</p>
            <div className="bg-slate-50 p-4 rounded-xl mb-4">
              <p className="font-medium text-slate-800">{pendingContactAdd.name}</p>
              {pendingContactAdd.email && <p className="text-sm text-slate-500">{pendingContactAdd.email}</p>}
              {pendingContactAdd.phone && <p className="text-sm text-slate-500">{pendingContactAdd.phone}</p>}
            </div>
            <div className="flex gap-3">
              <button onClick={confirmAddContact} className="flex-1 py-2.5 bg-teal-600 text-white rounded-xl font-medium">Yes, Add Contact</button>
              <button onClick={skipAddContact} className="flex-1 py-2.5 bg-slate-200 rounded-xl">No, Skip</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Location Prompt Modal */}
      {showAddLocationPrompt && pendingLocationAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-2">Add Location to Organization?</h3>
            <p className="text-slate-500 text-sm mb-4">Would you like to add this address as a location?</p>
            <div className="bg-slate-50 p-4 rounded-xl mb-4">
              <p className="font-medium text-slate-800">📍 {pendingLocationAdd.address}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={confirmAddLocation} className="flex-1 py-2.5 bg-teal-600 text-white rounded-xl font-medium">Yes, Add Location</button>
              <button onClick={skipAddLocation} className="flex-1 py-2.5 bg-slate-200 rounded-xl">No, Skip</button>
            </div>
          </div>
        </div>
      )}

      {/* Lost Reason Modal */}
      {showLostReasonModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Why was this deal lost?</h3>
            <div className="space-y-2 mb-6">
              {LOST_REASONS.map(reason => (
                <button key={reason} onClick={() => setSelectedLostReason(reason)} className={`w-full p-3 rounded-xl text-left transition ${selectedLostReason === reason ? 'bg-red-100 border-2 border-red-500' : 'bg-slate-50 hover:bg-slate-100'}`}>{reason}</button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={confirmLostDeal} disabled={!selectedLostReason} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-medium disabled:opacity-50">Mark as Lost</button>
              <button onClick={() => { setShowLostReasonModal(false); setPendingLostDeal(null); setSelectedLostReason(''); }} className="flex-1 py-2.5 bg-slate-200 rounded-xl">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}