import React, { useState } from 'react';
import {
  FiSave,
  FiEye,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiPlus,
  FiTrash2,
  FiArrowLeft,
  FiLock,
  FiHelpCircle
} from 'react-icons/fi';

export default function SeoPageEditor({ page, onSave, onPublish, onUnpublish, onCancel }) {
  const [formData, setFormData] = useState({
    ...page,
    h1: page.h1 || '',
    meta_title: page.meta_title || '',
    meta_description: page.meta_description || '',
    intro: page.intro || '',
    local_information: page.local_information || '',
    why_choose_service: page.why_choose_service || '',
    process: page.process || '',
    documents: page.documents || '',
    pricing: page.pricing || '',
    timeline: page.timeline || '',
    why_corporate_hub: page.why_corporate_hub || '',
    canonical_url: page.canonical_url || '',
    og_image: page.og_image || '',
    published: page.published || false,
    // Fields that may return null from Supabase — must have '' fallback
    what_is_service: page.what_is_service || '',
    who_should_choose: page.who_should_choose || '',
    key_benefits: page.key_benefits || '',
    eligibility: page.eligibility || '',
    tax_compliance: page.tax_compliance || '',
    comparison: page.comparison || '',
    how_it_helps: page.how_it_helps || '',
    related_services: page.related_services || '',
    call_to_action: page.call_to_action || '',
  });

  const [faqs, setFaqs] = useState(page.faqs || [
    {
      question: `How long does ${page.service_name || page.seo_services?.service_name || 'service'} take in ${page.city_name || page.seo_locations?.city_name || 'city'}?`,
      answer: `Execution typically takes 5 to 7 business days once documents are submitted.`,
      sort_order: 1,
      is_active: true
    }
  ]);

  const [isSaving, setIsSaving] = useState(false);

  const city = page.city_name || page.seo_locations?.city_name || 'City';
  const state = page.state_name || page.seo_locations?.state_name || 'State';
  const service = page.service_name || page.seo_services?.service_name || 'Service';
  const citySlug = page.city_slug || page.seo_locations?.city_slug || 'city';
  const serviceSlug = page.service_slug || page.seo_services?.service_slug || 'service';
  const generatedUrl = `/locations/${citySlug}/${serviceSlug}`;

  // SEO Readiness Validation Checks
  const hasH1 = Boolean(formData.h1.trim());
  const hasMetaTitle = Boolean(formData.meta_title.trim());
  const hasMetaDesc = Boolean(formData.meta_description.trim());
  const hasIntro = Boolean(formData.intro.trim());
  const hasLocalInfo = Boolean(formData.local_information.trim());
  const hasProcess = Boolean(formData.process.trim());
  const hasFaqs = faqs.length > 0;

  const isReady = hasH1 && hasMetaTitle && hasMetaDesc && hasIntro && hasLocalInfo && hasProcess;

  const handleAddFaq = () => {
    setFaqs([
      ...faqs,
      { question: '', answer: '', sort_order: faqs.length + 1, is_active: true }
    ]);
  };

  const handleUpdateFaq = (index, field, value) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const handleDeleteFaq = (index) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    await onSave({ ...formData, faqs, published: false });
    setIsSaving(false);
  };

  const handlePublishClick = async () => {
    if (!isReady) {
      alert("Please fill in required fields (H1, Meta Title, Meta Description, Intro, Local Information, Process) before publishing.");
      return;
    }

    if (window.confirm(`Publish ${city} × ${service} live to search crawlers and public visitors?`)) {
      setIsSaving(true);
      await onPublish({ ...formData, faqs, published: true });
      setIsSaving(false);
    }
  };

  return (
    <div className="seo-editor-container" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
      {/* Editor Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
        <div>
          <button
            onClick={onCancel}
            style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}
          >
            <FiArrowLeft /> Back to SEO Pages List
          </button>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            CMS Editor: {city} × {service}
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', padding: '10px 18px', borderRadius: '8px', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FiSave /> Save Draft
          </button>

          <a
            href={`http://localhost:3000${generatedUrl}${formData.published ? '' : '?preview=true'}`}
            target="_blank"
            rel="noreferrer"
            style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#0284c7', padding: '10px 18px', borderRadius: '8px', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
          >
            <FiEye /> Preview
          </a>

          {formData.published ? (
            <button
              onClick={() => onUnpublish(formData)}
              style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626', padding: '10px 18px', borderRadius: '8px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}
            >
              Unpublish
            </button>
          ) : (
            <button
              onClick={handlePublishClick}
              disabled={isSaving}
              style={{ background: '#ff6000', border: 'none', color: '#ffffff', padding: '10px 22px', borderRadius: '8px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <FiCheckCircle /> Publish Live
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>1. Main Heading *</label>
            <input
              type="text"
              value={formData.h1}
              onChange={(e) => setFormData({ ...formData, h1: e.target.value })}
              placeholder="e.g. Private Limited Company Registration in Ahmedabad"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>2. Hero Introduction *</label>
            <textarea
              rows={4}
              value={formData.intro}
              onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.94rem', color: '#0f172a' }}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>3. What Is the Service?</label>
            <textarea
              rows={3}
              value={formData.what_is_service}
              onChange={(e) => setFormData({ ...formData, what_is_service: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.94rem', color: '#0f172a' }}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>4. Who Should Choose This?</label>
            <textarea
              rows={3}
              value={formData.who_should_choose}
              onChange={(e) => setFormData({ ...formData, who_should_choose: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.94rem', color: '#0f172a' }}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>5. Key Benefits</label>
            <textarea
              rows={3}
              value={formData.key_benefits}
              onChange={(e) => setFormData({ ...formData, key_benefits: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.94rem', color: '#0f172a' }}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>6. Eligibility / Requirements</label>
            <textarea
              rows={3}
              value={formData.eligibility}
              onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.94rem', color: '#0f172a' }}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>7. Documents Required</label>
            <textarea
              rows={3}
              value={formData.documents}
              onChange={(e) => setFormData({ ...formData, documents: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.94rem', color: '#0f172a' }}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>8. Process *</label>
            <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginBottom: '6px' }}>Enter each step on a new line.</span>
            <textarea
              rows={4}
              value={formData.process}
              onChange={(e) => setFormData({ ...formData, process: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.94rem', color: '#0f172a' }}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>9. Timeline</label>
            <input
              type="text"
              value={formData.timeline}
              onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
              placeholder="e.g. 5 to 7 Business Days"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.92rem', color: '#0f172a' }}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>10. Tax & Compliance</label>
            <textarea
              rows={3}
              value={formData.tax_compliance}
              onChange={(e) => setFormData({ ...formData, tax_compliance: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.94rem', color: '#0f172a' }}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>11. Comparison</label>
            <textarea
              rows={3}
              value={formData.comparison}
              onChange={(e) => setFormData({ ...formData, comparison: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.94rem', color: '#0f172a' }}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>12. How It Helps Your Business Grow</label>
            <textarea
              rows={3}
              value={formData.how_it_helps}
              onChange={(e) => setFormData({ ...formData, how_it_helps: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.94rem', color: '#0f172a' }}
            />
          </div>

          <div className="form-group" style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
              13. Local Information *
            </label>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiHelpCircle /> Add genuinely useful information relevant to businesses in {city}. Do not simply replace the city name in generic content.
            </div>
            <textarea
              rows={4}
              value={formData.local_information}
              onChange={(e) => setFormData({ ...formData, local_information: e.target.value })}
              placeholder={`Mention local ROC offices, GIDC hubs, municipal corporation permits, or regional business advantages in ${city}...`}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.94rem', color: '#0f172a' }}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>14. Why The Corporate Hub?</label>
            <textarea
              rows={3}
              value={formData.why_corporate_hub}
              onChange={(e) => setFormData({ ...formData, why_corporate_hub: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.94rem', color: '#0f172a' }}
            />
          </div>

          <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '20px', marginTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>15. Frequently Asked Questions ({faqs.length})</h3>
              <button
                type="button"
                onClick={handleAddFaq}
                style={{ background: '#193563', color: '#ffffff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <FiPlus /> Add FAQ
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {faqs.map((faq, idx) => (
                <div key={idx} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ff6000' }}>FAQ #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteFaq(idx)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      title="Delete FAQ"
                    >
                      <FiTrash2 />
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Enter question..."
                    value={faq.question}
                    onChange={(e) => handleUpdateFaq(idx, 'question', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', marginBottom: '8px', color: '#0f172a', fontWeight: 600 }}
                  />

                  <textarea
                    rows={2}
                    placeholder="Enter answer..."
                    value={faq.answer}
                    onChange={(e) => handleUpdateFaq(idx, 'answer', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem', color: '#334155' }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>16. Related Services</label>
            <textarea
              rows={3}
              value={formData.related_services}
              onChange={(e) => setFormData({ ...formData, related_services: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.94rem', color: '#0f172a' }}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>17. Final Call to Action</label>
            <input
              type="text"
              value={formData.call_to_action}
              onChange={(e) => setFormData({ ...formData, call_to_action: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.94rem', color: '#0f172a' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 12px 0' }}>Page Identity & URL</h4>

            <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '6px' }}>
              <strong>Location:</strong> {city} ({state})
            </div>
            <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '12px' }}>
              <strong>Service:</strong> {service}
            </div>

            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
              READ-ONLY CANONICAL URL
            </label>
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', color: '#ff6000', fontWeight: 700, wordBreak: 'break-all', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FiLock style={{ color: '#64748b' }} /> {generatedUrl}
            </div>
          </div>

          {/* Meta Title */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Meta Title *</label>
              <span style={{ fontSize: '0.78rem', color: formData.meta_title.length > 60 ? '#ef4444' : '#64748b' }}>
                {formData.meta_title.length} / 60 chars
              </span>
            </div>
            <input
              type="text"
              value={formData.meta_title}
              onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
              placeholder="Meta Title..."
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', color: '#0f172a' }}
            />
          </div>

          {/* Meta Description */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Meta Description *</label>
              <span style={{ fontSize: '0.78rem', color: formData.meta_description.length > 160 ? '#ef4444' : '#64748b' }}>
                {formData.meta_description.length} / 160 chars
              </span>
            </div>
            <textarea
              rows={3}
              value={formData.meta_description}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              placeholder="Meta Description..."
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', color: '#0f172a' }}
            />
          </div>

          {/* OG Image URL */}
          <div className="form-group">
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '4px' }}>OG Image Path</label>
            <input
              type="text"
              value={formData.og_image}
              onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
              placeholder="/logo.png"
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', color: '#0f172a' }}
            />
          </div>

          {/* SEO READINESS PANEL */}
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>SEO Readiness Check</h4>
              <span style={{ background: isReady ? '#d1fae5' : '#fef3c7', color: isReady ? '#047857' : '#b45309', padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                {isReady ? 'READY TO PUBLISH' : 'DRAFT REVIEW'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ color: hasH1 ? '#059669' : '#dc2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {hasH1 ? '✓' : '✗'} H1 Heading present
              </div>
              <div style={{ color: hasMetaTitle ? '#059669' : '#dc2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {hasMetaTitle ? '✓' : '✗'} Meta Title present
              </div>
              <div style={{ color: hasMetaDesc ? '#059669' : '#dc2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {hasMetaDesc ? '✓' : '✗'} Meta Description present
              </div>
              <div style={{ color: hasIntro ? '#059669' : '#dc2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {hasIntro ? '✓' : '✗'} Introduction content
              </div>
              <div style={{ color: hasLocalInfo ? '#059669' : '#dc2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {hasLocalInfo ? '✓' : '✗'} Local information content
              </div>
              <div style={{ color: hasProcess ? '#059669' : '#dc2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {hasProcess ? '✓' : '✗'} Registration process steps
              </div>
              <div style={{ color: hasFaqs ? '#059669' : '#b45309', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {hasFaqs ? '✓' : '⚠'} FAQs added ({faqs.length})
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
