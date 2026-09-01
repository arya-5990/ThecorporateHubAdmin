import React, { useState } from 'react';
import { FiX, FiCopy, FiAlertCircle } from 'react-icons/fi';

export default function DuplicatePageModal({ sourcePage, locations, existingPages, onClose, onDuplicate }) {
  const [targetLocId, setTargetLocId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Filter locations to exclude source location
  const availableLocations = locations.filter(
    (l) => l.id !== sourcePage.location_id && l.city_slug !== sourcePage.city_slug
  );

  const targetLoc = locations.find((l) => l.id === targetLocId || l.city_slug === targetLocId);

  const calculatedUrl = targetLoc && sourcePage
    ? `/locations/${targetLoc.city_slug}/${sourcePage.service_slug || sourcePage.seo_services?.service_slug}`
    : '';

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!targetLoc) {
      setErrorMsg('Please select a target city to duplicate this page to.');
      return;
    }

    const serviceSlug = sourcePage.service_slug || sourcePage.seo_services?.service_slug;

    // Check if target page already exists
    const isDuplicate = existingPages.some(
      (p) =>
        (p.location_id === targetLoc.id || p.city_slug === targetLoc.city_slug) &&
        (p.service_slug === serviceSlug || p.seo_services?.service_slug === serviceSlug)
    );

    if (isDuplicate) {
      setErrorMsg(`An SEO page for ${targetLoc.city_name} × ${sourcePage.service_name || sourcePage.seo_services?.service_name} already exists.`);
      return;
    }

    const serviceName = sourcePage.service_name || sourcePage.seo_services?.service_name;

    // Create cloned draft page payload
    onDuplicate({
      location: targetLoc,
      service_id: sourcePage.service_id,
      service_slug: serviceSlug,
      service_name: serviceName,
      h1: `${serviceName} in ${targetLoc.city_name}`,
      meta_title: `${serviceName} in ${targetLoc.city_name} | Corporate Hub`,
      meta_description: `Professional ${serviceName} in ${targetLoc.city_name}, ${targetLoc.state_name}. 100% online registration, expert CA support, and fast execution.`,
      intro: `${targetLoc.city_name} is a key business destination in ${targetLoc.state_name}. ${sourcePage.intro ? sourcePage.intro.replace(new RegExp(sourcePage.city_name || "Ahmedabad", "gi"), targetLoc.city_name) : ""}`,
      local_information: `Detailed statutory information and legal requirements for businesses operating in ${targetLoc.city_name}, ${targetLoc.state_name}.`,
      why_choose_service: sourcePage.why_choose_service ? sourcePage.why_choose_service.replace(new RegExp(sourcePage.city_name || "Ahmedabad", "gi"), targetLoc.city_name) : "",
      process: sourcePage.process || "",
      documents: sourcePage.documents || "",
      pricing: sourcePage.pricing || "",
      timeline: sourcePage.timeline || "",
      why_corporate_hub: sourcePage.why_corporate_hub || "",
      published: false,
      faqs: (sourcePage.faqs || []).map((faq) => ({
        question: faq.question ? faq.question.replace(new RegExp(sourcePage.city_name || "Ahmedabad", "gi"), targetLoc.city_name) : "",
        answer: faq.answer ? faq.answer.replace(new RegExp(sourcePage.city_name || "Ahmedabad", "gi"), targetLoc.city_name) : "",
        sort_order: faq.sort_order || 0,
        is_active: true
      }))
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

        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiCopy style={{ color: '#ff6000' }} /> Duplicate SEO Page
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 16px 0' }}>
          Cloning: <strong>{sourcePage.city_name} × {sourcePage.service_name || sourcePage.seo_services?.service_name}</strong>
        </p>

        <div style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '20px' }}>
          ⚠️ <strong>Content Review Required:</strong> Duplicating creates a new <strong>Draft (published = false)</strong> page. You must review and customize the local information for the new city before publishing.
        </div>

        {errorMsg && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiAlertCircle /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Select Target City *</label>
            <select
              value={targetLocId}
              onChange={(e) => setTargetLocId(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.92rem' }}
              required
            >
              <option value="">-- Choose Target City --</option>
              {availableLocations.map((l) => (
                <option key={l.id || l.city_slug} value={l.id || l.city_slug}>
                  {l.city_name} ({l.state_name})
                </option>
              ))}
            </select>
          </div>

          {calculatedUrl && (
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px 14px', borderRadius: '8px', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '4px' }}>NEW GENERATED URL PATH</span>
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
              Duplicate as Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
