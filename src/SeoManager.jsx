import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import {
  FiGrid,
  FiFileText,
  FiMapPin,
  FiGlobe,
  FiRefreshCw
} from 'react-icons/fi';

import SeoDashboard from './seo/SeoDashboard';
import SeoPagesList from './seo/SeoPagesList';
import SeoPageEditor from './seo/SeoPageEditor';
import CreatePageModal from './seo/CreatePageModal';
import DuplicatePageModal from './seo/DuplicatePageModal';
import SeoLocationsList from './seo/SeoLocationsList';
import SeoServicesList from './seo/SeoServicesList';

const INITIAL_LOCATIONS = [
  { id: 'loc-1', city_name: 'Ahmedabad', state_name: 'Gujarat', city_slug: 'ahmedabad', state_slug: 'gujarat', is_active: true },
  { id: 'loc-2', city_name: 'Surat', state_name: 'Gujarat', city_slug: 'surat', state_slug: 'gujarat', is_active: true },
  { id: 'loc-3', city_name: 'Vadodara', state_name: 'Gujarat', city_slug: 'vadodara', state_slug: 'gujarat', is_active: true },
  { id: 'loc-4', city_name: 'Rajkot', state_name: 'Gujarat', city_slug: 'rajkot', state_slug: 'gujarat', is_active: true },
  { id: 'loc-5', city_name: 'Mumbai', state_name: 'Maharashtra', city_slug: 'mumbai', state_slug: 'maharashtra', is_active: true },
  { id: 'loc-6', city_name: 'Pune', state_name: 'Maharashtra', city_slug: 'pune', state_slug: 'maharashtra', is_active: true },
  { id: 'loc-7', city_name: 'Thane', state_name: 'Maharashtra', city_slug: 'thane', state_slug: 'maharashtra', is_active: true },
  { id: 'loc-8', city_name: 'Nagpur', state_name: 'Maharashtra', city_slug: 'nagpur', state_slug: 'maharashtra', is_active: true },
  { id: 'loc-9', city_name: 'Nashik', state_name: 'Maharashtra', city_slug: 'nashik', state_slug: 'maharashtra', is_active: true },
  { id: 'loc-10', city_name: 'Bengaluru', state_name: 'Karnataka', city_slug: 'bengaluru', state_slug: 'karnataka', is_active: true },
  { id: 'loc-11', city_name: 'Hyderabad', state_name: 'Telangana', city_slug: 'hyderabad', state_slug: 'telangana', is_active: true },
  { id: 'loc-12', city_name: 'Chennai', state_name: 'Tamil Nadu', city_slug: 'chennai', state_slug: 'tamil-nadu', is_active: true }
];

const INITIAL_SERVICES = [
  { id: 'srv-1', service_name: 'Company Registration', service_slug: 'company-registration', parent_service: 'business-registration', is_active: true },
  { id: 'srv-2', service_name: 'Trademark Registration', service_slug: 'trademark-registration', parent_service: 'intellectual-property', is_active: true },
  { id: 'srv-3', service_name: 'GST Compliance', service_slug: 'gst-compliance', parent_service: 'accounting-taxation', is_active: true },
  { id: 'srv-4', service_name: 'Copyright Registration', service_slug: 'copyright-registration', parent_service: 'intellectual-property', is_active: true }
];

const INITIAL_PAGES = [
  {
    id: 'page-1',
    location_id: 'loc-1',
    service_id: 'srv-1',
    city_name: 'Ahmedabad',
    state_name: 'Gujarat',
    city_slug: 'ahmedabad',
    service_name: 'Company Registration',
    service_slug: 'company-registration',
    published: true,
    h1: 'Private Limited Company Registration in Ahmedabad',
    meta_title: 'Private Limited Company Registration in Ahmedabad | Corporate Hub',
    meta_description: 'Register your Private Limited Company in Ahmedabad with Corporate Hub. Fast-track MCA SPICe+ filing, DSC, DIN, PAN, TAN & GST in 5-7 business days.',
    intro: 'Ahmedabad is Gujarat\'s commercial powerhouse, thriving with industrial manufacturing, textiles, tech startups, and GIFT City financial innovation.',
    local_information: 'The Registrar of Companies (ROC) Gujarat is located at ROC Bhavan, Ahmedabad. Business owners in industrial hubs like SG Highway, Prahlad Nagar, Ashram Road, and GIDC Sanand choose Corporate Hub for seamless MCA digital filing.',
    why_choose_service: 'A Private Limited Company is the gold standard for ventures looking to raise equity funds, secure venture capital, or scale across India with separate legal entity status.',
    process: '1. Digital Signature Certificate (DSC) & Director Identification Number (DIN) allotment\n2. Name Reservation via RUN / SPICe+ Part A portal\n3. Drafting Memorandum of Association (MOA) & Articles of Association (AOA)\n4. Filing SPICe+ Part B form with MCA ROC Gujarat\n5. Receiving Certificate of Incorporation (COI) with PAN, TAN, EPFO & ESIC',
    documents: '• PAN Card & Aadhaar Card of Directors\n• Passport-size photos of Directors\n• Address Proof & Rent NOC from landlord',
    pricing: 'Starting from ₹6,999 (Inclusive of Govt fees, DSC & Incorporation filing)',
    timeline: '5 to 7 Business Days',
    why_corporate_hub: 'Over 10,000+ businesses registered across India. Dedicated chartered accountant & legal experts assigned to your case.',
    canonical_url: 'https://www.thecorporatehub.in/locations/ahmedabad/company-registration',
    og_image: '/logo.png',
    updated_at: new Date().toISOString(),
    faqs: [
      { question: 'How long does company registration in Ahmedabad take?', answer: 'Company incorporation in Ahmedabad typically takes 5 to 7 business days once documents are verified.', sort_order: 1, is_active: true }
    ]
  },
  {
    id: 'page-2',
    location_id: 'loc-5',
    service_id: 'srv-2',
    city_name: 'Mumbai',
    state_name: 'Maharashtra',
    city_slug: 'mumbai',
    service_name: 'Trademark Registration',
    service_slug: 'trademark-registration',
    published: true,
    h1: 'Trademark Registration in Mumbai',
    meta_title: 'Trademark Registration in Mumbai | Protect Brand & Logo | Corporate Hub',
    meta_description: 'Protect your brand name, logo, and slogan in Mumbai with official Trademark Registration. File TM application with IPO Mumbai trademark registry in 24 hours.',
    intro: 'Mumbai is India\'s financial capital and home to thousands of brands, media enterprises, and retail powerhouses.',
    local_information: 'The Trade Marks Registry Mumbai office covers Maharashtra, MP, and Goa. Filing your TM application with expert IP attorneys ensures complete protection against brand infringement.',
    why_choose_service: 'Trademark registration gives you the ® symbol, deters competitors from copying your identity, and creates an intangible corporate asset.',
    process: '1. Brand & Logo Trademark Search\n2. Selecting NICE Trademark Class\n3. Drafting & Filing Form TM-A with IPO Mumbai Registry\n4. Allotment of ™ Application Number within 24 Hours',
    documents: '• Applicant Identity Proof\n• Brand Logo artwork in JPEG format\n• Signed Form TM-48',
    pricing: 'Starting from ₹1,499 + Govt filing fees',
    timeline: '24 Hours for TM Number',
    why_corporate_hub: 'Experienced IP attorneys and comprehensive pre-filing search reports.',
    canonical_url: 'https://www.thecorporatehub.in/locations/mumbai/trademark-registration',
    og_image: '/logo.png',
    updated_at: new Date().toISOString(),
    faqs: [
      { question: 'When can I use the ™ symbol in Mumbai?', answer: 'You can start using the ™ symbol immediately after receiving your TM Application Number (within 24 hours).', sort_order: 1, is_active: true }
    ]
  }
];

export default function SeoManager({ triggerToast }) {
  const [subTab, setSubTab] = useState('overview');
  const [locations, setLocations] = useState(INITIAL_LOCATIONS);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [pages, setPages] = useState(INITIAL_PAGES);
  const [loading, setLoading] = useState(false);

  const [activeEditingPage, setActiveEditingPage] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(null);

  useEffect(() => {
    fetchSeoData();
  }, []);

  const fetchSeoData = async () => {
    setLoading(true);
    try {
      if (import.meta.env.VITE_SUPABASE_URL) {
        const { data: locs } = await supabase.from('seo_locations').select('*').order('city_name');
        if (locs && locs.length > 0) setLocations(locs);

        const { data: srvs } = await supabase.from('seo_services').select('*').order('service_name');
        if (srvs && srvs.length > 0) setServices(srvs);

        const { data: pgs } = await supabase.from('seo_location_pages').select('*, seo_locations(*), seo_services(*), seo_faqs(*)').order('updated_at', { ascending: false });
        if (pgs && pgs.length > 0) {
          const formatted = pgs.map((p) => ({
            ...p,
            city_name: p.seo_locations?.city_name || p.city_name,
            state_name: p.seo_locations?.state_name || p.state_name,
            city_slug: p.seo_locations?.city_slug || p.city_slug,
            service_name: p.seo_services?.service_name || p.service_name,
            service_slug: p.seo_services?.service_slug || p.service_slug,
            faqs: p.seo_faqs || []
          }));
          setPages(formatted);
        }
      }
    } catch (err) {
      console.error("Error fetching SEO data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePageSubmit = async (newPageData) => {
    try {
      let createdRecord = { ...newPageData, id: `page-${Date.now()}`, updated_at: new Date().toISOString() };

      if (import.meta.env.VITE_SUPABASE_URL) {
        const { data, error } = await supabase
          .from('seo_location_pages')
          .insert({
            location_id: newPageData.location.id,
            service_id: newPageData.service.id,
            h1: newPageData.h1,
            meta_title: newPageData.meta_title,
            meta_description: newPageData.meta_description,
            intro: newPageData.intro,
            local_information: newPageData.local_information,
            why_choose_service: newPageData.why_choose_service,
            process: newPageData.process,
            documents: newPageData.documents,
            pricing: newPageData.pricing,
            timeline: newPageData.timeline,
            why_corporate_hub: newPageData.why_corporate_hub,
            what_is_service: newPageData.what_is_service || null,
            who_should_choose: newPageData.who_should_choose || null,
            key_benefits: newPageData.key_benefits || null,
            eligibility: newPageData.eligibility || null,
            tax_compliance: newPageData.tax_compliance || null,
            comparison: newPageData.comparison || null,
            how_it_helps: newPageData.how_it_helps || null,
            related_services: newPageData.related_services || null,
            call_to_action: newPageData.call_to_action || null,
            og_image: newPageData.og_image || null,
            canonical_url: newPageData.canonical_url || null,
            published: false
          })
          .select('*')
          .single();

        if (error) throw error;
        if (data) createdRecord = data;
      }

      setPages([createdRecord, ...pages]);
      setShowCreateModal(false);
      triggerToast(`Draft page created for ${newPageData.location.city_name} × ${newPageData.service.service_name}`);
      setActiveEditingPage(createdRecord);
      setSubTab('editor');
    } catch (err) {
      console.error("Error creating SEO page:", err);
      triggerToast(err.message || "Failed to create SEO page.", "error");
    }
  };

  const handleDuplicateSubmit = async (dupData) => {
    try {
      let duplicatedRecord = { ...dupData, id: `page-${Date.now()}`, updated_at: new Date().toISOString() };

      if (import.meta.env.VITE_SUPABASE_URL) {
        const { data, error } = await supabase
          .from('seo_location_pages')
          .insert({
            location_id: dupData.location.id,
            service_id: dupData.service_id,
            h1: dupData.h1,
            meta_title: dupData.meta_title,
            meta_description: dupData.meta_description,
            intro: dupData.intro,
            local_information: dupData.local_information,
            why_choose_service: dupData.why_choose_service,
            process: dupData.process,
            documents: dupData.documents,
            pricing: dupData.pricing,
            timeline: dupData.timeline,
            why_corporate_hub: dupData.why_corporate_hub,
            what_is_service: dupData.what_is_service || null,
            who_should_choose: dupData.who_should_choose || null,
            key_benefits: dupData.key_benefits || null,
            eligibility: dupData.eligibility || null,
            tax_compliance: dupData.tax_compliance || null,
            comparison: dupData.comparison || null,
            how_it_helps: dupData.how_it_helps || null,
            related_services: dupData.related_services || null,
            call_to_action: dupData.call_to_action || null,
            og_image: dupData.og_image || null,
            canonical_url: dupData.canonical_url || null,
            published: false
          })
          .select('*')
          .single();

        if (error) throw error;
        if (data) duplicatedRecord = data;

        if (dupData.faqs && dupData.faqs.length > 0) {
          const faqRows = dupData.faqs.map((f, i) => ({
            page_id: duplicatedRecord.id,
            question: f.question,
            answer: f.answer,
            sort_order: f.sort_order ?? i + 1,
            is_active: f.is_active ?? true
          }));
          await supabase.from('seo_faqs').insert(faqRows);
        }
      }

      setPages([duplicatedRecord, ...pages]);
      setShowDuplicateModal(null);
      triggerToast(`Duplicated draft page created for ${dupData.location.city_name}. Content review required.`);
      setActiveEditingPage(duplicatedRecord);
      setSubTab('editor');
    } catch (err) {
      console.error("Error duplicating SEO page:", err);
      triggerToast(err.message || "Failed to duplicate SEO page.", "error");
    }
  };

  const handleSavePage = async (updatedPage) => {
    try {
      if (import.meta.env.VITE_SUPABASE_URL && updatedPage.id) {
        const { error } = await supabase
          .from('seo_location_pages')
          .update({
            h1: updatedPage.h1,
            meta_title: updatedPage.meta_title,
            meta_description: updatedPage.meta_description,
            intro: updatedPage.intro,
            local_information: updatedPage.local_information,
            why_choose_service: updatedPage.why_choose_service,
            process: updatedPage.process,
            documents: updatedPage.documents,
            pricing: updatedPage.pricing,
            timeline: updatedPage.timeline,
            why_corporate_hub: updatedPage.why_corporate_hub,
            what_is_service: updatedPage.what_is_service || null,
            who_should_choose: updatedPage.who_should_choose || null,
            key_benefits: updatedPage.key_benefits || null,
            eligibility: updatedPage.eligibility || null,
            tax_compliance: updatedPage.tax_compliance || null,
            comparison: updatedPage.comparison || null,
            how_it_helps: updatedPage.how_it_helps || null,
            related_services: updatedPage.related_services || null,
            call_to_action: updatedPage.call_to_action || null,
            og_image: updatedPage.og_image || null,
            canonical_url: updatedPage.canonical_url || null,
            published: updatedPage.published,
            updated_at: new Date().toISOString()
          })
          .eq('id', updatedPage.id);

        if (error) throw error;

        // Upsert FAQs: delete existing then re-insert current set
        await supabase.from('seo_faqs').delete().eq('page_id', updatedPage.id);
        if (updatedPage.faqs && updatedPage.faqs.length > 0) {
          const faqRows = updatedPage.faqs.map((f, i) => ({
            page_id: updatedPage.id,
            question: f.question,
            answer: f.answer,
            sort_order: f.sort_order ?? i + 1,
            is_active: f.is_active ?? true
          }));
          const { error: faqError } = await supabase.from('seo_faqs').insert(faqRows);
          if (faqError) console.error('FAQ save error:', faqError);
        }
      }

      const nextPages = pages.map((p) => (p.id === updatedPage.id ? { ...p, ...updatedPage, updated_at: new Date().toISOString() } : p));
      setPages(nextPages);
      triggerToast(`Draft saved for ${updatedPage.city_name || 'page'}.`);
    } catch (err) {
      console.error("Error saving page:", err);
      triggerToast("Failed to save draft.", "error");
    }
  };

  const handlePublishPage = async (updatedPage) => {
    try {
      if (import.meta.env.VITE_SUPABASE_URL && updatedPage.id) {
        const { error } = await supabase
          .from('seo_location_pages')
          .update({
            h1: updatedPage.h1,
            meta_title: updatedPage.meta_title,
            meta_description: updatedPage.meta_description,
            intro: updatedPage.intro,
            local_information: updatedPage.local_information,
            why_choose_service: updatedPage.why_choose_service,
            process: updatedPage.process,
            documents: updatedPage.documents,
            pricing: updatedPage.pricing,
            timeline: updatedPage.timeline,
            why_corporate_hub: updatedPage.why_corporate_hub,
            what_is_service: updatedPage.what_is_service || null,
            who_should_choose: updatedPage.who_should_choose || null,
            key_benefits: updatedPage.key_benefits || null,
            eligibility: updatedPage.eligibility || null,
            tax_compliance: updatedPage.tax_compliance || null,
            comparison: updatedPage.comparison || null,
            how_it_helps: updatedPage.how_it_helps || null,
            related_services: updatedPage.related_services || null,
            call_to_action: updatedPage.call_to_action || null,
            og_image: updatedPage.og_image || null,
            canonical_url: updatedPage.canonical_url || null,
            published: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', updatedPage.id);

        if (error) throw error;

        // Upsert FAQs: delete existing then re-insert current set
        await supabase.from('seo_faqs').delete().eq('page_id', updatedPage.id);
        if (updatedPage.faqs && updatedPage.faqs.length > 0) {
          const faqRows = updatedPage.faqs.map((f, i) => ({
            page_id: updatedPage.id,
            question: f.question,
            answer: f.answer,
            sort_order: f.sort_order ?? i + 1,
            is_active: f.is_active ?? true
          }));
          const { error: faqError } = await supabase.from('seo_faqs').insert(faqRows);
          if (faqError) console.error('FAQ publish error:', faqError);
        }
      }

      const nextPages = pages.map((p) => (p.id === updatedPage.id ? { ...p, ...updatedPage, published: true, updated_at: new Date().toISOString() } : p));
      setPages(nextPages);
      triggerToast(`Page published live for ${updatedPage.city_name || 'location'}!`);
      setSubTab('pages');
    } catch (err) {
      console.error("Error publishing page:", err);
      triggerToast("Failed to publish page.", "error");
    }
  };

  const handleUnpublishPage = async (pageToUnpublish) => {
    try {
      if (import.meta.env.VITE_SUPABASE_URL && pageToUnpublish.id) {
        const { error } = await supabase
          .from('seo_location_pages')
          .update({ published: false, updated_at: new Date().toISOString() })
          .eq('id', pageToUnpublish.id);
        if (error) throw error;
      }

      const nextPages = pages.map((p) => (p.id === pageToUnpublish.id ? { ...p, published: false } : p));
      setPages(nextPages);
      triggerToast("Page unpublished. Removed from live sitemap.");
      setSubTab('pages');
    } catch (err) {
      console.error("Error unpublishing page:", err);
      triggerToast("Failed to unpublish page.", "error");
    }
  };

  const handleDeletePage = async (pageToDelete) => {
    const cityName = pageToDelete.city_name || pageToDelete.seo_locations?.city_name;
    const serviceName = pageToDelete.service_name || pageToDelete.seo_services?.service_name;

    if (window.confirm(`Are you sure you want to delete ${cityName} × ${serviceName}? This will also delete associated FAQs.`)) {
      try {
        if (import.meta.env.VITE_SUPABASE_URL && pageToDelete.id) {
          const { error } = await supabase.from('seo_location_pages').delete().eq('id', pageToDelete.id);
          if (error) throw error;
        }

        setPages(pages.filter((p) => p.id !== pageToDelete.id));
        triggerToast("SEO page deleted successfully.", "info");
      } catch (err) {
        console.error("Error deleting page:", err);
        triggerToast("Failed to delete SEO page.", "error");
      }
    }
  };

  const handleCreateLocation = async (newLocData) => {
    try {
      let created = { ...newLocData, id: `loc-${Date.now()}` };
      if (import.meta.env.VITE_SUPABASE_URL) {
        const { data, error } = await supabase.from('seo_locations').insert(newLocData).select('*').single();
        if (error) throw error;
        if (data) created = data;
      }
      setLocations([...locations, created]);
      triggerToast(`City ${newLocData.city_name} added successfully!`);
    } catch (err) {
      console.error("Error creating location:", err);
      triggerToast("Failed to add location.", "error");
    }
  };

  const handleCreateService = async (newSrvData) => {
    try {
      let created = { ...newSrvData, id: `srv-${Date.now()}` };
      if (import.meta.env.VITE_SUPABASE_URL) {
        const { data, error } = await supabase.from('seo_services').insert(newSrvData).select('*').single();
        if (error) throw error;
        if (data) created = data;
      }
      setServices([...services, created]);
      triggerToast(`Service ${newSrvData.service_name} added successfully!`);
    } catch (err) {
      console.error("Error creating service:", err);
      triggerToast("Failed to add service.", "error");
    }
  };

  const publishedCount = pages.filter((p) => p.published).length;
  const draftCount = pages.filter((p) => !p.published).length;
  const stats = {
    total: pages.length,
    published: publishedCount,
    drafts: draftCount,
    locations: locations.length,
    services: services.length
  };

  return (
    <div style={{ padding: '0 0 24px 0' }}>
      {/* Sub Navigation Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '8px', background: '#e2e8f0', padding: '4px', borderRadius: '8px' }}>
          <button
            style={{
              background: subTab === 'overview' ? '#ff6000' : 'transparent',
              color: subTab === 'overview' ? '#ffffff' : '#64748b',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setSubTab('overview')}
          >
            <FiGrid /> Overview
          </button>

          <button
            style={{
              background: subTab === 'pages' || subTab === 'editor' ? '#ff6000' : 'transparent',
              color: subTab === 'pages' || subTab === 'editor' ? '#ffffff' : '#64748b',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setSubTab('pages')}
          >
            <FiFileText /> SEO Pages ({pages.length})
          </button>

          <button
            style={{
              background: subTab === 'locations' ? '#ff6000' : 'transparent',
              color: subTab === 'locations' ? '#ffffff' : '#64748b',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setSubTab('locations')}
          >
            <FiMapPin /> Locations ({locations.length})
          </button>

          <button
            style={{
              background: subTab === 'services' ? '#ff6000' : 'transparent',
              color: subTab === 'services' ? '#ffffff' : '#64748b',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setSubTab('services')}
          >
            <FiGlobe /> Services ({services.length})
          </button>
        </div>

        <button
          className="reset-btn"
          onClick={fetchSeoData}
          style={{ background: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a', padding: '8px 16px', borderRadius: '6px', fontWeight: 500, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <FiRefreshCw className={loading ? 'spin-icon' : ''} /> Refresh Sync
        </button>
      </div>

      {subTab === 'overview' && (
        <SeoDashboard
          stats={stats}
          recentPages={pages.slice(0, 5)}
          onEditPage={(page) => {
            setActiveEditingPage(page);
            setSubTab('editor');
          }}
          onViewAllPages={() => setSubTab('pages')}
          onCreatePage={() => setShowCreateModal(true)}
        />
      )}

      {subTab === 'pages' && (
        <SeoPagesList
          pages={pages}
          locations={locations}
          services={services}
          onEditPage={(page) => {
            setActiveEditingPage(page);
            setSubTab('editor');
          }}
          onCreatePage={() => setShowCreateModal(true)}
          onDuplicatePage={(page) => setShowDuplicateModal(page)}
          onTogglePublish={(page) => (page.published ? handleUnpublishPage(page) : handlePublishPage(page))}
          onDeletePage={handleDeletePage}
        />
      )}

      {subTab === 'editor' && activeEditingPage && (
        <SeoPageEditor
          page={activeEditingPage}
          onSave={handleSavePage}
          onPublish={handlePublishPage}
          onUnpublish={handleUnpublishPage}
          onCancel={() => setSubTab('pages')}
        />
      )}

      {subTab === 'locations' && (
        <SeoLocationsList
          locations={locations}
          onToggleActive={(loc) => triggerToast(`Location ${loc.city_name} toggled.`)}
          onCreateLocation={handleCreateLocation}
        />
      )}

      {subTab === 'services' && (
        <SeoServicesList
          services={services}
          onToggleActive={(srv) => triggerToast(`Service ${srv.service_name} toggled.`)}
          onCreateService={handleCreateService}
        />
      )}

      {showCreateModal && (
        <CreatePageModal
          locations={locations}
          services={services}
          existingPages={pages}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreatePageSubmit}
        />
      )}

      {showDuplicateModal && (
        <DuplicatePageModal
          sourcePage={showDuplicateModal}
          locations={locations}
          existingPages={pages}
          onClose={() => setShowDuplicateModal(null)}
          onDuplicate={handleDuplicateSubmit}
        />
      )}
    </div>
  );
}
