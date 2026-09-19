import React, { useState } from 'react';
import { FiX, FiCheck, FiAlertCircle, FiLayers } from 'react-icons/fi';
import { getServiceTemplate, applyTemplatePlaceholders } from '../data/seoServiceTemplates';

export default function CreatePageModal({
  locations,
  services,
  existingPages,
  onClose,
  onCreate,
  templates = []
}) {
  const [selectedLocId, setSelectedLocId] = useState('');
  const [selectedSrvId, setSelectedSrvId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const selectedLoc = locations.find((l) => l.id === selectedLocId || l.city_slug === selectedLocId);
  const selectedSrv = services.find((s) => s.id === selectedSrvId || s.service_slug === selectedSrvId);

  const calculatedUrl = selectedLoc && selectedSrv
    ? `/locations/${selectedLoc.city_slug}/${selectedSrv.service_slug}`
    : '';

  // Find matching template: DB template first, then local fallback
  const getActiveTemplate = () => {
    if (!selectedSrv) return null;
    const cityName = selectedLoc?.city_name || 'City';
    const stateName = selectedLoc?.state_name || 'State';

    // 1. Check DB templates
    const dbMatch = templates?.find(
      (t) => t.service_id === selectedSrv.id || t.service_slug === selectedSrv.service_slug
    );
    if (dbMatch) {
      return applyTemplatePlaceholders(dbMatch, cityName, stateName);
    }

    // 2. Check local seed templates
    return getServiceTemplate(selectedSrv.service_slug, cityName, stateName);
  };

  const template = getActiveTemplate();
  const hasTemplate = Boolean(template);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedLoc || !selectedSrv) {
      setErrorMsg('Please select both a target location and an SEO service.');
      return;
    }

    // Check if page already exists
    const isDuplicate = existingPages.some(
      (p) =>
        (p.location_id === selectedLoc.id || p.city_slug === selectedLoc.city_slug) &&
        (p.service_id === selectedSrv.id || p.service_slug === selectedSrv.service_slug)
    );

    if (isDuplicate) {
      setErrorMsg(`An SEO page for ${selectedLoc.city_name} × ${selectedSrv.service_name} already exists.`);
      return;
    }

    if (template) {
      // Template found — use rich pre-filled content from the template
      onCreate({
        location: selectedLoc,
        service: selectedSrv,
        h1: template.h1,
        meta_title: template.meta_title,
        meta_description: template.meta_description,
        intro: template.intro,
        what_is_service: template.what_is_service || '',
        who_should_choose: template.who_should_choose || '',
        key_benefits: template.key_benefits || '',
        eligibility: template.eligibility || '',
        local_information: template.local_information,
        why_choose_service: template.why_choose_service,
        process: template.process,
        documents: template.documents,
        pricing: template.pricing,
        timeline: template.timeline,
        tax_compliance: template.tax_compliance || '',
        comparison: template.comparison || '',
        how_it_helps: template.how_it_helps || '',
        why_corporate_hub: template.why_corporate_hub,
        related_services: template.related_services || '',
        call_to_action: template.call_to_action || '',
        og_image: template.og_image || '/logo.png',
        canonical_url: `https://www.thecorporatehub.in${calculatedUrl}`,
        faqs: template.faqs || [],
        published: false
      });
    } else {
      // No template — use generic fallback placeholders
      onCreate({
        location: selectedLoc,
        service: selectedSrv,
        h1: `${selectedSrv.service_name} in ${selectedLoc.city_name}`,
        meta_title: `${selectedSrv.service_name} in ${selectedLoc.city_name} | Corporate Hub`,
        meta_description: `Professional ${selectedSrv.service_name} in ${selectedLoc.city_name}, ${selectedLoc.state_name}. 100% online registration, expert CA support, and fast execution.`,
        intro: `${selectedLoc.city_name} is a major hub of business and economic growth in ${selectedLoc.state_name}. Getting ${selectedSrv.service_name} ensures compliance and unlocks key financial benefits.`,
        local_information: `Detailed statutory information and legal requirements for businesses operating in ${selectedLoc.city_name}, ${selectedLoc.state_name}.`,
        why_choose_service: `Why businesses in ${selectedLoc.city_name} choose ${selectedSrv.service_name}.`,
        process: `1. Document Submission\n2. Verification & Portal Filing\n3. Approval & License Allotment`,
        documents: `• Applicant Identity & Address Proof\n• Business Property Documents`,
        pricing: `Starting from ₹1,499`,
        timeline: `5 to 7 Business Days`,
        why_corporate_hub: `100% online process with dedicated legal and chartered accountant support.`,
        published: false
      });
    }
  };

  return (
    <div
      className="seo-modal-backdrop"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        zIndex: 3000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          width: '100%',
          maxWidth: '540px',
          padding: '28px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            color: '#64748b',
            cursor: 'pointer'
          }}
        >
          <FiX />
        </button>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
          + Create New SEO Page
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 20px 0' }}>
          Select a target location and service to generate a comprehensive landing page with pre-filled content.
        </p>

        {errorMsg && (
          <div
            style={{
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              color: '#dc2626',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FiAlertCircle /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Select Location *
            </label>
            <select
              value={selectedLocId}
              onChange={(e) => setSelectedLocId(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.92rem' }}
              required
            >
              <option value="">-- Choose a city --</option>
              {locations
                .filter((l) => l.is_active !== false)
                .map((loc) => (
                  <option key={loc.id || loc.city_slug} value={loc.id || loc.city_slug}>
                    {loc.city_name}, {loc.state_name}
                  </option>
                ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Select SEO Service *
            </label>
            <select
              value={selectedSrvId}
              onChange={(e) => setSelectedSrvId(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.92rem' }}
              required
            >
              <option value="">-- Choose a service --</option>
              {services
                .filter((s) => s.is_active !== false)
                .map((srv) => (
                  <option key={srv.id || srv.service_slug} value={srv.id || srv.service_slug}>
                    {srv.service_name}
                  </option>
                ))}
            </select>
          </div>

          {/* Template notification badge */}
          {selectedLoc && selectedSrv && (
            hasTemplate ? (
              <div
                style={{
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  color: '#065f46',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  lineHeight: '1.45'
                }}
              >
                <FiCheck style={{ marginTop: '2px', color: '#059669', flexShrink: 0, fontSize: '1rem' }} />
                <div>
                  <strong>Content Auto-Fill Active:</strong> All 17 CMS sections and {template.faqs?.length || 10} FAQs will be auto-filled for <strong>{selectedLoc.city_name}, {selectedLoc.state_name}</strong>. You can freely edit everything right after creation.
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#64748b',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  marginBottom: '16px'
                }}
              >
                ℹ Generic placeholder content will be generated. You can customize all fields in the editor.
              </div>
            )
          )}

          {calculatedUrl && (
            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                Generated URL Slug
              </div>
              <div style={{ fontSize: '0.88rem', color: '#0f172a', fontWeight: 600, wordBreak: 'break-all' }}>
                {calculatedUrl}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ background: '#f1f5f9', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 600, fontSize: '0.88rem', color: '#475569', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedLocId || !selectedSrvId}
              style={{
                background: (!selectedLocId || !selectedSrvId) ? '#94a3b8' : '#ff6000',
                color: '#ffffff',
                border: 'none',
                padding: '10px 22px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: (!selectedLocId || !selectedSrvId) ? 'not-allowed' : 'pointer',
                boxShadow: (!selectedLocId || !selectedSrvId) ? 'none' : '0 2px 4px rgba(255, 96, 0, 0.25)'
              }}
            >
              Create Draft Page
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
