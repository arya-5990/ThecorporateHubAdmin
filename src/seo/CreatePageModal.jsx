import React, { useState } from 'react';
import { FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';

export default function CreatePageModal({ locations, services, existingPages, onClose, onCreate }) {
  const [selectedLocId, setSelectedLocId] = useState('');
  const [selectedSrvId, setSelectedSrvId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const selectedLoc = locations.find((l) => l.id === selectedLocId || l.city_slug === selectedLocId);
  const selectedSrv = services.find((s) => s.id === selectedSrvId || s.service_slug === selectedSrvId);

  const calculatedUrl = selectedLoc && selectedSrv
    ? `/locations/${selectedLoc.city_slug}/${selectedSrv.service_slug}`
    : '';

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
  };

  return (
    <div className="seo-modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.75)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#ffffff', borderRadius: '14px', width: '100%', maxWidth: '520px', padding: '28px', border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', border: 'none', fontSize: '1.2rem', color: '#64748b', cursor: 'pointer' }}
        >
          <FiX />
        </button>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>+ Create New SEO Page</h3>
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 20px 0' }}>Select a target location and service to generate a new SEO landing page.</p>

        {errorMsg && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiAlertCircle /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Select Location *</label>
            <select
              value={selectedLocId}
              onChange={(e) => setSelectedLocId(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.92rem' }}
              required
            >
              <option value="">-- Choose Target City --</option>
              {locations.map((l) => (
                <option key={l.id || l.city_slug} value={l.id || l.city_slug}>
                  {l.city_name} ({l.state_name})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Select SEO Service *</label>
            <select
              value={selectedSrvId}
              onChange={(e) => setSelectedSrvId(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.92rem' }}
              required
            >
              <option value="">-- Choose SEO Service --</option>
              {services.map((s) => (
                <option key={s.id || s.service_slug} value={s.id || s.service_slug}>
                  {s.service_name}
                </option>
              ))}
            </select>
          </div>

          {calculatedUrl && (
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px 14px', borderRadius: '8px', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '4px' }}>GENERATED URL PATH (READ-ONLY)</span>
              <code style={{ fontSize: '0.9rem', color: '#ff6000', fontWeight: 700 }}>{calculatedUrl}</code>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#334155', padding: '10px 18px', borderRadius: '8px', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ background: '#ff6000', border: 'none', color: '#ffffff', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}
            >
              Create Draft Page
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
