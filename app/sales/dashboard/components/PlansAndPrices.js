'use client';
import { useState, useMemo } from 'react';
import PlanDetailModal from './PlanDetailModal';

// Plan data from CSV
const plansData = [
  { tier: "Starter", planName: "Pro Plan 100", monthly: 250, contacts: 100, calls: 300, emails: 900, sms: 900, pointsOfContact: 2700, guaranteedAppts: 5, apptGoal: 25, salesReps: 1, acctManagers: 1, territorySpecific: true, leadList: false, websiteDiscount: "", automationsDiscount: "", portalDiscount: "", strategyCall: "", businessReview: "", salesMeeting: "", whiteGlove: false },
  { tier: "Starter", planName: "Pro Plan 200", monthly: 500, contacts: 200, calls: 600, emails: 1800, sms: 1800, pointsOfContact: 5400, guaranteedAppts: 10, apptGoal: 50, salesReps: 1, acctManagers: 1, territorySpecific: true, leadList: false, websiteDiscount: "", automationsDiscount: "", portalDiscount: "", strategyCall: "", businessReview: "", salesMeeting: "", whiteGlove: false },
  { tier: "Starter", planName: "Pro Plan 300", monthly: 750, contacts: 300, calls: 900, emails: 2700, sms: 2700, pointsOfContact: 8100, guaranteedAppts: 15, apptGoal: 75, salesReps: 1, acctManagers: 1, territorySpecific: true, leadList: false, websiteDiscount: "", automationsDiscount: "", portalDiscount: "", strategyCall: "", businessReview: "", salesMeeting: "", whiteGlove: false },
  { tier: "Starter", planName: "Pro Plan 400", monthly: 1000, contacts: 400, calls: 1200, emails: 3600, sms: 3600, pointsOfContact: 10800, guaranteedAppts: 20, apptGoal: 100, salesReps: 1, acctManagers: 1, territorySpecific: true, leadList: false, websiteDiscount: "", automationsDiscount: "", portalDiscount: "", strategyCall: "", businessReview: "", salesMeeting: "", whiteGlove: false },
  { tier: "Starter", planName: "Pro Plan 500", monthly: 1250, contacts: 500, calls: 1500, emails: 4500, sms: 4500, pointsOfContact: 13500, guaranteedAppts: 25, apptGoal: 125, salesReps: 1, acctManagers: 1, territorySpecific: true, leadList: false, websiteDiscount: "", automationsDiscount: "", portalDiscount: "", strategyCall: "", businessReview: "", salesMeeting: "", whiteGlove: false },
  { tier: "Starter", planName: "Pro Plan 600", monthly: 1500, contacts: 600, calls: 1800, emails: 5400, sms: 5400, pointsOfContact: 16200, guaranteedAppts: 30, apptGoal: 150, salesReps: 1, acctManagers: 1, territorySpecific: true, leadList: false, websiteDiscount: "", automationsDiscount: "", portalDiscount: "", strategyCall: "", businessReview: "", salesMeeting: "", whiteGlove: false },
  { tier: "Starter", planName: "Pro Plan 700", monthly: 1750, contacts: 700, calls: 2100, emails: 6300, sms: 6300, pointsOfContact: 18900, guaranteedAppts: 35, apptGoal: 175, salesReps: 2, acctManagers: 1, territorySpecific: true, leadList: false, websiteDiscount: "", automationsDiscount: "", portalDiscount: "", strategyCall: "", businessReview: "", salesMeeting: "", whiteGlove: false },
  { tier: "Starter", planName: "Pro Plan 800", monthly: 2000, contacts: 800, calls: 2400, emails: 7200, sms: 7200, pointsOfContact: 21600, guaranteedAppts: 40, apptGoal: 200, salesReps: 2, acctManagers: 1, territorySpecific: true, leadList: false, websiteDiscount: "", automationsDiscount: "", portalDiscount: "", strategyCall: "", businessReview: "", salesMeeting: "", whiteGlove: false },
  { tier: "Starter", planName: "Pro Plan 900", monthly: 2250, contacts: 900, calls: 2700, emails: 8100, sms: 8100, pointsOfContact: 24300, guaranteedAppts: 45, apptGoal: 225, salesReps: 2, acctManagers: 1, territorySpecific: true, leadList: false, websiteDiscount: "", automationsDiscount: "", portalDiscount: "", strategyCall: "", businessReview: "", salesMeeting: "", whiteGlove: false },
  { tier: "Starter", planName: "Pro Plan 1000", monthly: 2500, contacts: 1000, calls: 3000, emails: 9000, sms: 9000, pointsOfContact: 27000, guaranteedAppts: 50, apptGoal: 250, salesReps: 2, acctManagers: 1, territorySpecific: true, leadList: false, websiteDiscount: "", automationsDiscount: "", portalDiscount: "", strategyCall: "", businessReview: "", salesMeeting: "", whiteGlove: false },
  { tier: "Starter", planName: "Pro Plan 1100", monthly: 2750, contacts: 1100, calls: 3300, emails: 9900, sms: 9900, pointsOfContact: 29700, guaranteedAppts: 55, apptGoal: 275, salesReps: 2, acctManagers: 1, territorySpecific: true, leadList: false, websiteDiscount: "", automationsDiscount: "", portalDiscount: "", strategyCall: "", businessReview: "", salesMeeting: "", whiteGlove: false },
  { tier: "Starter", planName: "Pro Plan 1200", monthly: 3000, contacts: 1200, calls: 3600, emails: 10800, sms: 10800, pointsOfContact: 32400, guaranteedAppts: 60, apptGoal: 300, salesReps: 2, acctManagers: 1, territorySpecific: true, leadList: false, websiteDiscount: "", automationsDiscount: "", portalDiscount: "", strategyCall: "", businessReview: "", salesMeeting: "", whiteGlove: false },
  { tier: "Starter", planName: "Pro Plan 1300", monthly: 3250, contacts: 1300, calls: 3900, emails: 11700, sms: 11700, pointsOfContact: 35100, guaranteedAppts: 65, apptGoal: 325, salesReps: 2, acctManagers: 1, territorySpecific: true, leadList: false, websiteDiscount: "", automationsDiscount: "", portalDiscount: "", strategyCall: "", businessReview: "", salesMeeting: "", whiteGlove: false },
  // Growth Tier
  { tier: "Growth", planName: "Pro Plan 1400", monthly: 3500, contacts: 1400, calls: 4200, emails: 12600, sms: 12600, pointsOfContact: 37800, guaranteedAppts: 70, apptGoal: 350, salesReps: 3, acctManagers: 1, territorySpecific: true, leadList: true, websiteDiscount: "10%", automationsDiscount: "10%", portalDiscount: "", strategyCall: "MONTHLY", businessReview: "", salesMeeting: "", whiteGlove: false },
  { tier: "Growth", planName: "Pro Plan 1500", monthly: 3750, contacts: 1500, calls: 4500, emails: 13500, sms: 13500, pointsOfContact: 40500, guaranteedAppts: 75, apptGoal: 375, salesReps: 3, acctManagers: 1, territorySpecific: true, leadList: true, websiteDiscount: "10%", automationsDiscount: "10%", portalDiscount: "", strategyCall: "MONTHLY", businessReview: "", salesMeeting: "", whiteGlove: false },
  { tier: "Growth", planName: "Pro Plan 1600", monthly: 4000, contacts: 1600, calls: 4800, emails: 14400, sms: 14400, pointsOfContact: 43200, guaranteedAppts: 80, apptGoal: 400, salesReps: 3, acctManagers: 1, territorySpecific: true, leadList: true, websiteDiscount: "10%", automationsDiscount: "10%", portalDiscount: "", strategyCall: "MONTHLY", businessReview: "", salesMeeting: "", whiteGlove: false },
  { tier: "Growth", planName: "Pro Plan 1700", monthly: 4250, contacts: 1700, calls: 5100, emails: 15300, sms: 15300, pointsOfContact: 45900, guaranteedAppts: 85, apptGoal: 425, salesReps: 3, acctManagers: 1, territorySpecific: true, leadList: true, websiteDiscount: "10%", automationsDiscount: "10%", portalDiscount: "", strategyCall: "MONTHLY", businessReview: "", salesMeeting: "", whiteGlove: false },
  { tier: "Growth", planName: "Pro Plan 1800", monthly: 4500, contacts: 1800, calls: 5400, emails: 16200, sms: 16200, pointsOfContact: 48600, guaranteedAppts: 90, apptGoal: 450, salesReps: 3, acctManagers: 1, territorySpecific: true, leadList: true, websiteDiscount: "10%", automationsDiscount: "10%", portalDiscount: "", strategyCall: "MONTHLY", businessReview: "", salesMeeting: "", whiteGlove: false },
  { tier: "Growth", planName: "Pro Plan 1900", monthly: 4750, contacts: 1900, calls: 5700, emails: 17100, sms: 17100, pointsOfContact: 51300, guaranteedAppts: 95, apptGoal: 475, salesReps: 3, acctManagers: 1, territorySpecific: true, leadList: true, websiteDiscount: "10%", automationsDiscount: "10%", portalDiscount: "", strategyCall: "MONTHLY", businessReview: "", salesMeeting: "", whiteGlove: false },
  { tier: "Growth", planName: "Pro Plan 2000", monthly: 5000, contacts: 2000, calls: 6000, emails: 18000, sms: 18000, pointsOfContact: 54000, guaranteedAppts: 100, apptGoal: 500, salesReps: 3, acctManagers: 1, territorySpecific: true, leadList: true, websiteDiscount: "10%", automationsDiscount: "10%", portalDiscount: "", strategyCall: "MONTHLY", businessReview: "", salesMeeting: "", whiteGlove: false },
  { tier: "Growth", planName: "Pro Plan 2500", monthly: 6250, contacts: 2500, calls: 7500, emails: 22500, sms: 22500, pointsOfContact: 67500, guaranteedAppts: 125, apptGoal: 625, salesReps: 3, acctManagers: 1, territorySpecific: true, leadList: true, websiteDiscount: "10%", automationsDiscount: "10%", portalDiscount: "", strategyCall: "MONTHLY", businessReview: "", salesMeeting: "", whiteGlove: false },
  { tier: "Growth", planName: "Pro Plan 3000", monthly: 7500, contacts: 3000, calls: 9000, emails: 27000, sms: 27000, pointsOfContact: 81000, guaranteedAppts: 150, apptGoal: 750, salesReps: 3, acctManagers: 1, territorySpecific: true, leadList: true, websiteDiscount: "10%", automationsDiscount: "10%", portalDiscount: "", strategyCall: "MONTHLY", businessReview: "", salesMeeting: "", whiteGlove: false },
  { tier: "Growth", planName: "Pro Plan 3500", monthly: 8750, contacts: 3500, calls: 10500, emails: 31500, sms: 31500, pointsOfContact: 94500, guaranteedAppts: 175, apptGoal: 875, salesReps: 4, acctManagers: 1, territorySpecific: true, leadList: true, websiteDiscount: "10%", automationsDiscount: "10%", portalDiscount: "", strategyCall: "MONTHLY", businessReview: "", salesMeeting: "", whiteGlove: false },
  { tier: "Growth", planName: "Pro Plan 4000", monthly: 10000, contacts: 4000, calls: 12000, emails: 36000, sms: 36000, pointsOfContact: 108000, guaranteedAppts: 200, apptGoal: 1000, salesReps: 4, acctManagers: 1, territorySpecific: true, leadList: true, websiteDiscount: "10%", automationsDiscount: "10%", portalDiscount: "", strategyCall: "MONTHLY", businessReview: "", salesMeeting: "", whiteGlove: false },
  { tier: "Growth", planName: "Pro Plan 4500", monthly: 11250, contacts: 4500, calls: 13500, emails: 40500, sms: 40500, pointsOfContact: 121500, guaranteedAppts: 225, apptGoal: 1125, salesReps: 4, acctManagers: 1, territorySpecific: true, leadList: true, websiteDiscount: "10%", automationsDiscount: "10%", portalDiscount: "", strategyCall: "MONTHLY", businessReview: "", salesMeeting: "", whiteGlove: false },
  // Scale Tier
  { tier: "Scale", planName: "Pro Plan 5000", monthly: 12500, contacts: 5000, calls: 15000, emails: 45000, sms: 45000, pointsOfContact: 135000, guaranteedAppts: 250, apptGoal: 1250, salesReps: 5, acctManagers: 2, territorySpecific: true, leadList: true, websiteDiscount: "15%", automationsDiscount: "15%", portalDiscount: "10%", strategyCall: "BI-WEEKLY", businessReview: "", salesMeeting: "", whiteGlove: true },
  { tier: "Scale", planName: "Pro Plan 5500", monthly: 13750, contacts: 5500, calls: 16500, emails: 49500, sms: 49500, pointsOfContact: 148500, guaranteedAppts: 275, apptGoal: 1375, salesReps: 5, acctManagers: 2, territorySpecific: true, leadList: true, websiteDiscount: "15%", automationsDiscount: "15%", portalDiscount: "10%", strategyCall: "BI-WEEKLY", businessReview: "", salesMeeting: "", whiteGlove: true },
  { tier: "Scale", planName: "Pro Plan 6000", monthly: 15000, contacts: 6000, calls: 18000, emails: 54000, sms: 54000, pointsOfContact: 162000, guaranteedAppts: 300, apptGoal: 1500, salesReps: 5, acctManagers: 2, territorySpecific: true, leadList: true, websiteDiscount: "15%", automationsDiscount: "15%", portalDiscount: "10%", strategyCall: "BI-WEEKLY", businessReview: "", salesMeeting: "", whiteGlove: true },
  { tier: "Scale", planName: "Pro Plan 7000", monthly: 17500, contacts: 7000, calls: 21000, emails: 63000, sms: 63000, pointsOfContact: 189000, guaranteedAppts: 350, apptGoal: 1750, salesReps: 5, acctManagers: 2, territorySpecific: true, leadList: true, websiteDiscount: "15%", automationsDiscount: "15%", portalDiscount: "10%", strategyCall: "BI-WEEKLY", businessReview: "", salesMeeting: "", whiteGlove: true },
  { tier: "Scale", planName: "Pro Plan 8000", monthly: 20000, contacts: 8000, calls: 24000, emails: 72000, sms: 72000, pointsOfContact: 216000, guaranteedAppts: 400, apptGoal: 2000, salesReps: 5, acctManagers: 2, territorySpecific: true, leadList: true, websiteDiscount: "15%", automationsDiscount: "15%", portalDiscount: "10%", strategyCall: "BI-WEEKLY", businessReview: "", salesMeeting: "", whiteGlove: true },
  { tier: "Scale", planName: "Pro Plan 9000", monthly: 22500, contacts: 9000, calls: 27000, emails: 81000, sms: 81000, pointsOfContact: 243000, guaranteedAppts: 450, apptGoal: 2250, salesReps: 6, acctManagers: 2, territorySpecific: true, leadList: true, websiteDiscount: "15%", automationsDiscount: "15%", portalDiscount: "10%", strategyCall: "BI-WEEKLY", businessReview: "", salesMeeting: "", whiteGlove: true },
  { tier: "Scale", planName: "Pro Plan 10000", monthly: 25000, contacts: 10000, calls: 30000, emails: 90000, sms: 90000, pointsOfContact: 270000, guaranteedAppts: 500, apptGoal: 2500, salesReps: 6, acctManagers: 2, territorySpecific: true, leadList: true, websiteDiscount: "15%", automationsDiscount: "15%", portalDiscount: "10%", strategyCall: "BI-WEEKLY", businessReview: "", salesMeeting: "", whiteGlove: true },
  { tier: "Scale", planName: "Pro Plan 11000", monthly: 27500, contacts: 11000, calls: 33000, emails: 99000, sms: 99000, pointsOfContact: 297000, guaranteedAppts: 550, apptGoal: 2750, salesReps: 6, acctManagers: 2, territorySpecific: true, leadList: true, websiteDiscount: "15%", automationsDiscount: "15%", portalDiscount: "10%", strategyCall: "BI-WEEKLY", businessReview: "", salesMeeting: "", whiteGlove: true },
  { tier: "Scale", planName: "Pro Plan 12000", monthly: 30000, contacts: 12000, calls: 36000, emails: 108000, sms: 108000, pointsOfContact: 324000, guaranteedAppts: 600, apptGoal: 3000, salesReps: 6, acctManagers: 2, territorySpecific: true, leadList: true, websiteDiscount: "15%", automationsDiscount: "15%", portalDiscount: "10%", strategyCall: "BI-WEEKLY", businessReview: "", salesMeeting: "", whiteGlove: true },
  { tier: "Scale", planName: "Pro Plan 13000", monthly: 32500, contacts: 13000, calls: 39000, emails: 117000, sms: 117000, pointsOfContact: 351000, guaranteedAppts: 650, apptGoal: 3250, salesReps: 6, acctManagers: 2, territorySpecific: true, leadList: true, websiteDiscount: "15%", automationsDiscount: "15%", portalDiscount: "10%", strategyCall: "BI-WEEKLY", businessReview: "", salesMeeting: "", whiteGlove: true },
  // Premier Tier
  { tier: "Premier", planName: "Pro Plan 14000", monthly: 35000, contacts: 14000, calls: 42000, emails: 126000, sms: 126000, pointsOfContact: 378000, guaranteedAppts: 700, apptGoal: 3500, salesReps: 7, acctManagers: 3, territorySpecific: true, leadList: true, websiteDiscount: "25%", automationsDiscount: "25%", portalDiscount: "25%", strategyCall: "BI-WEEKLY", businessReview: "QUARTERLY", salesMeeting: "MONTHLY", whiteGlove: true },
  { tier: "Premier", planName: "Pro Plan 15000", monthly: 37500, contacts: 15000, calls: 45000, emails: 135000, sms: 135000, pointsOfContact: 405000, guaranteedAppts: 750, apptGoal: 3750, salesReps: 7, acctManagers: 3, territorySpecific: true, leadList: true, websiteDiscount: "25%", automationsDiscount: "25%", portalDiscount: "25%", strategyCall: "BI-WEEKLY", businessReview: "QUARTERLY", salesMeeting: "MONTHLY", whiteGlove: true },
  { tier: "Premier", planName: "Pro Plan 16000", monthly: 40000, contacts: 16000, calls: 48000, emails: 144000, sms: 144000, pointsOfContact: 432000, guaranteedAppts: 800, apptGoal: 4000, salesReps: 7, acctManagers: 3, territorySpecific: true, leadList: true, websiteDiscount: "25%", automationsDiscount: "25%", portalDiscount: "25%", strategyCall: "BI-WEEKLY", businessReview: "QUARTERLY", salesMeeting: "MONTHLY", whiteGlove: true },
  { tier: "Premier", planName: "Pro Plan 17000", monthly: 42500, contacts: 17000, calls: 51000, emails: 153000, sms: 153000, pointsOfContact: 459000, guaranteedAppts: 850, apptGoal: 4250, salesReps: 7, acctManagers: 3, territorySpecific: true, leadList: true, websiteDiscount: "25%", automationsDiscount: "25%", portalDiscount: "25%", strategyCall: "BI-WEEKLY", businessReview: "QUARTERLY", salesMeeting: "MONTHLY", whiteGlove: true },
  { tier: "Premier", planName: "Pro Plan 18000", monthly: 45000, contacts: 18000, calls: 54000, emails: 162000, sms: 162000, pointsOfContact: 486000, guaranteedAppts: 900, apptGoal: 4500, salesReps: 7, acctManagers: 3, territorySpecific: true, leadList: true, websiteDiscount: "25%", automationsDiscount: "25%", portalDiscount: "25%", strategyCall: "BI-WEEKLY", businessReview: "QUARTERLY", salesMeeting: "MONTHLY", whiteGlove: true },
  { tier: "Premier", planName: "Pro Plan 19000", monthly: 47500, contacts: 19000, calls: 57000, emails: 171000, sms: 171000, pointsOfContact: 513000, guaranteedAppts: 950, apptGoal: 4750, salesReps: 7, acctManagers: 3, territorySpecific: true, leadList: true, websiteDiscount: "25%", automationsDiscount: "25%", portalDiscount: "25%", strategyCall: "BI-WEEKLY", businessReview: "QUARTERLY", salesMeeting: "MONTHLY", whiteGlove: true },
  { tier: "Premier", planName: "Pro Plan 20000", monthly: 50000, contacts: 20000, calls: 60000, emails: 180000, sms: 180000, pointsOfContact: 540000, guaranteedAppts: 1000, apptGoal: 5000, salesReps: 8, acctManagers: 3, territorySpecific: true, leadList: true, websiteDiscount: "25%", automationsDiscount: "25%", portalDiscount: "25%", strategyCall: "BI-WEEKLY", businessReview: "QUARTERLY", salesMeeting: "MONTHLY", whiteGlove: true },
];

const tierColors = {
  Starter: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-600' },
  Growth: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-600' },
  Scale: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-600' },
  Premier: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-600' },
};

export default function PlansAndPrices() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const [minAppts, setMinAppts] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedBenefits, setSelectedBenefits] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const benefitOptions = [
    { key: 'leadList', label: 'Lead List' },
    { key: 'whiteGlove', label: 'White Glove Service' },
    { key: 'strategyCall', label: 'Strategy Calls' },
    { key: 'businessReview', label: 'Business Review' },
    { key: 'salesMeeting', label: 'Sales Meetings' },
    { key: 'websiteDiscount', label: 'Website Discount' },
    { key: 'automationsDiscount', label: 'Automations Discount' },
    { key: 'portalDiscount', label: 'Portal Discount' },
  ];

  const toggleBenefit = (key) => {
    setSelectedBenefits(prev => 
      prev.includes(key) ? prev.filter(b => b !== key) : [...prev, key]
    );
  };

  const filteredPlans = useMemo(() => {
    return plansData.filter(plan => {
      if (searchTerm && !plan.planName.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (selectedTier !== 'all' && plan.tier !== selectedTier) {
        return false;
      }
      if (minAppts && plan.guaranteedAppts < parseInt(minAppts)) {
        return false;
      }
      if (maxPrice && plan.monthly > parseInt(maxPrice)) {
        return false;
      }
      for (const benefit of selectedBenefits) {
        if (benefit === 'leadList' && !plan.leadList) return false;
        if (benefit === 'whiteGlove' && !plan.whiteGlove) return false;
        if (benefit === 'strategyCall' && !plan.strategyCall) return false;
        if (benefit === 'businessReview' && !plan.businessReview) return false;
        if (benefit === 'salesMeeting' && !plan.salesMeeting) return false;
        if (benefit === 'websiteDiscount' && !plan.websiteDiscount) return false;
        if (benefit === 'automationsDiscount' && !plan.automationsDiscount) return false;
        if (benefit === 'portalDiscount' && !plan.portalDiscount) return false;
      }
      return true;
    });
  }, [searchTerm, selectedTier, minAppts, maxPrice, selectedBenefits]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTier('all');
    setMinAppts('');
    setMaxPrice('');
    setSelectedBenefits([]);
  };

  const hasActiveFilters = searchTerm || selectedTier !== 'all' || minAppts || maxPrice || selectedBenefits.length > 0;

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">🔍</span>
              <input
                type="text"
                placeholder="Search plans (e.g., Pro Plan 500)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 font-medium"
              />
            </div>
          </div>

          {/* Tier Dropdown */}
          <div className="w-full lg:w-48">
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 appearance-none cursor-pointer"
            >
              <option value="all">All Tiers</option>
              <option value="Starter">🌱 Starter</option>
              <option value="Growth">📈 Growth</option>
              <option value="Scale">🚀 Scale</option>
              <option value="Premier">👑 Premier</option>
            </select>
          </div>

          {/* More Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 ${
              showFilters || hasActiveFilters
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ⚙️ Filters
            {hasActiveFilters && (
              <span className="bg-white text-green-600 text-xs px-2 py-0.5 rounded-full font-black">
                {selectedBenefits.length + (minAppts ? 1 : 0) + (maxPrice ? 1 : 0) + (selectedTier !== 'all' ? 1 : 0) + (searchTerm ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Extended Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Min Appointments */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Min. Guaranteed Appointments</label>
                <input
                  type="number"
                  placeholder="e.g., 50"
                  value={minAppts}
                  onChange={(e) => setMinAppts(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Max Monthly Price</label>
                <input
                  type="number"
                  placeholder="e.g., 5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-500"
                />
              </div>
            </div>

            {/* Benefit Filters */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Required Benefits</label>
              <div className="flex flex-wrap gap-2">
                {benefitOptions.map(benefit => (
                  <button
                    key={benefit.key}
                    onClick={() => toggleBenefit(benefit.key)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                      selectedBenefits.includes(benefit.key)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {benefit.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-700 font-bold flex items-center gap-1"
              >
                ✕ Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600 font-medium">
          Showing <span className="text-gray-900 font-black">{filteredPlans.length}</span> of {plansData.length} plans
        </p>
        {/* Quick tier stats */}
        <div className="hidden md:flex items-center gap-4 text-sm font-bold">
          {['Starter', 'Growth', 'Scale', 'Premier'].map(tier => {
            const count = filteredPlans.filter(p => p.tier === tier).length;
            return (
              <span key={tier} className={tierColors[tier].text}>
                {tier}: {count}
              </span>
            );
          })}
        </div>
      </div>

      {/* Plans Grid */}
      {filteredPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPlans.map((plan, index) => (
            <div
              key={index}
              onClick={() => setSelectedPlan(plan)}
              className={`bg-white rounded-2xl shadow-lg p-5 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-xl border-2 ${tierColors[plan.tier].border}`}
            >
              {/* Tier Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className={`${tierColors[plan.tier].badge} text-white text-xs font-black px-3 py-1 rounded-full`}>
                  {plan.tier}
                </span>
                {plan.whiteGlove && (
                  <span className="text-amber-500 text-lg" title="White Glove Service">⭐</span>
                )}
              </div>

              {/* Plan Name */}
              <h3 className="text-gray-900 font-black text-lg mb-1">{plan.planName}</h3>

              {/* Price */}
              <div className="mb-4">
                <span className="text-2xl font-black text-green-600">${plan.monthly.toLocaleString()}</span>
                <span className="text-gray-500 text-sm font-medium">/month</span>
              </div>

              {/* Key Stats */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Guaranteed Appts</span>
                  <span className="text-gray-900 font-bold">{plan.guaranteedAppts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Contacts</span>
                  <span className="text-gray-900 font-medium">{plan.contacts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Points of Contact</span>
                  <span className="text-gray-900 font-medium">{plan.pointsOfContact.toLocaleString()}</span>
                </div>
              </div>

              {/* View Details Link */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <span className={`${tierColors[plan.tier].text} text-sm font-bold flex items-center gap-1`}>
                  View full details →
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-600 text-lg font-medium">No plans match your filters</p>
          <button
            onClick={clearFilters}
            className="mt-4 text-green-600 hover:text-green-700 font-bold"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Plan Detail Modal */}
      {selectedPlan && (
        <PlanDetailModal
          plan={selectedPlan}
          tierColors={tierColors}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  );
}