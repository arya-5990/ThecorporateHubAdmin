import React, { useState } from 'react';
import {
  FiSave,
  FiArrowLeft,
  FiPlus,
  FiTrash2,
  FiEye,
  FiEdit3,
  FiCheckCircle,
  FiHelpCircle,
  FiLayers
} from 'react-icons/fi';
import { applyTemplatePlaceholders } from '../data/seoServiceTemplates';

export default function SeoTemplateEditor({
  template,
  services,
  onSave,
  onBack,
  triggerToast
}) {
  const [formData, setFormData] = useState({ ...template });
  const [faqs, setFaqs] = useState(template.faqs || []);
  const [previewCity, setPreviewCity] = useState('Ahmedabad');
  const [previewState, setPreviewState] = useState('Gujarat');
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('core'); // core, content, faqs, preview
  const [saving, setSaving] = useState(false);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFaqChange = (index, field, value) => {
    const next = [...faqs];
    next[index] = { ...next[index], [field]: value };
    setFaqs(next);
  };

  const handleAddFaq = () => {
    setFaqs([
      ...faqs,
      {
        question: 'New Question regarding {{CITY}}',
        answer: 'Detailed answer with relevant information.',
        sort_order: faqs.length + 1,
        is_active: true
      }
    ]);
  };

  const handleDeleteFaq = (index) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        faqs,
        updated_at: new Date().toISOString()
      };
      await onSave(payload);
    } catch (err) {
      console.error('Error saving template:', err);
    } finally {
      setSaving(false);
    }
  };

  const previewData = applyTemplatePlaceholders(
    { ...formData, faqs },
    previewCity,
    previewState
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Top action header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#ffffff',
          padding: '16px 24px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onBack}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#334155',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 600
            }}
          >
            <FiArrowLeft /> Back to Templates
          </button>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {formData.template_name || 'Service Template'}
            </h2>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Service Slug: <code>{formData.service_slug}</code>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            style={{
              background: showPreview ? '#0f172a' : '#f8fafc',
              color: showPreview ? '#ffffff' : '#334155',
              border: '1px solid #cbd5e1',
              padding: '9px 16px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FiEye /> {showPreview ? 'Hide City Preview' : 'Preview with City'}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            style={{
              background: '#ff6000',
              color: '#ffffff',
              border: 'none',
              padding: '9px 20px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 4px rgba(255, 96, 0, 0.25)'
            }}
          >
            <FiSave /> {saving ? 'Saving...' : 'Save Master Template'}
          </button>
        </div>
      </div>

      {/* Placeholder info alert */}
      <div
        style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          color: '#1e40af',
          padding: '12px 18px',
          borderRadius: '10px',
          marginBottom: '20px',
          fontSize: '0.86rem',
          lineHeight: '1.5'
        }}
      >
        <strong>💡 Dynamic Placeholders:</strong> Use <code>{'{{CITY}}'}</code> and{' '}
        <code>{'{{STATE}}'}</code> anywhere in these fields. When an admin creates a new SEO page for a
        specific location (like <em>Ahmedabad, Gujarat</em>), these placeholders will be automatically
        replaced. You can also edit the pre-filled text on any page individually without affecting this master template.
      </div>

      {/* Live City Preview Box (if enabled) */}
      {showPreview && (
        <div
          style={{
            background: '#ffffff',
            border: '2px solid #3b82f6',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <h4 style={{ margin: 0, color: '#1e3a8a', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiEye /> Live Dynamic Replacement Preview
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', color: '#475569' }}>Simulate City:</span>
              <input
                type="text"
                value={previewCity}
                onChange={(e) => setPreviewCity(e.target.value)}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', width: '120px' }}
                placeholder="City"
              />
              <input
                type="text"
                value={previewState}
                onChange={(e) => setPreviewState(e.target.value)}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', width: '120px' }}
                placeholder="State"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', background: '#f8fafc', padding: '14px', borderRadius: '8px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>H1 HEADLINE</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a' }}>{previewData.h1}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>META TITLE</div>
              <div style={{ fontSize: '0.85rem', color: '#334155' }}>{previewData.meta_title}</div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>META DESCRIPTION</div>
              <div style={{ fontSize: '0.82rem', color: '#475569' }}>{previewData.meta_description}</div>
            </div>
          </div>
        </div>
      )}

      {/* Editor Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('core')}
          style={{
            background: activeTab === 'core' ? '#ff6000' : 'transparent',
            color: activeTab === 'core' ? '#ffffff' : '#64748b',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          1. Headings & Meta
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('content')}
          style={{
            background: activeTab === 'content' ? '#ff6000' : 'transparent',
            color: activeTab === 'content' ? '#ffffff' : '#64748b',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          2. CMS Content Sections (14)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('faqs')}
          style={{
            background: activeTab === 'faqs' ? '#ff6000' : 'transparent',
            color: activeTab === 'faqs' ? '#ffffff' : '#64748b',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          3. Template FAQs ({faqs.length})
        </button>
      </div>

      {/* Tab 1: Core SEO */}
      {activeTab === 'core' && (
        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Template Name
            </label>
            <input
              type="text"
              value={formData.template_name || ''}
              onChange={(e) => handleFieldChange('template_name', e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Primary H1 Heading
            </label>
            <input
              type="text"
              value={formData.h1 || ''}
              onChange={(e) => handleFieldChange('h1', e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Meta Title
              </label>
              <input
                type="text"
                value={formData.meta_title || ''}
                onChange={(e) => handleFieldChange('meta_title', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Pricing String
              </label>
              <input
                type="text"
                value={formData.pricing || ''}
                onChange={(e) => handleFieldChange('pricing', e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Meta Description
            </label>
            <textarea
              rows={3}
              value={formData.meta_description || ''}
              onChange={(e) => handleFieldChange('meta_description', e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
            />
          </div>
        </div>
      )}

      {/* Tab 2: CMS Content Sections */}
      {activeTab === 'content' && (
        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[
            { key: 'intro', label: 'Section 2: Hero Introduction', rows: 4 },
            { key: 'what_is_service', label: 'Section 3: What is This Service?', rows: 4 },
            { key: 'who_should_choose', label: 'Section 4: Who Should Choose This Service?', rows: 4 },
            { key: 'key_benefits', label: 'Section 5: Key Benefits', rows: 5 },
            { key: 'eligibility', label: 'Section 6: Eligibility / Minimum Requirements', rows: 4 },
            { key: 'documents', label: 'Section 7: Documents Required', rows: 4 },
            { key: 'process', label: 'Section 8: Registration Process Steps', rows: 5 },
            { key: 'timeline', label: 'Section 9: Timeline & Expectations', rows: 3 },
            { key: 'tax_compliance', label: 'Section 10: Tax & Statutory Compliance', rows: 4 },
            { key: 'comparison', label: 'Section 11: Comparison vs Other Structures', rows: 4 },
            { key: 'how_it_helps', label: 'Section 12: How This Service Helps Business Grow', rows: 4 },
            { key: 'local_information', label: 'Section 13: Serving Gujarat & Pan-India Info', rows: 4 },
            { key: 'why_corporate_hub', label: 'Section 14: Why The Corporate Hub?', rows: 4 },
            { key: 'why_choose_service', label: 'Local Value Proposition / Service Summary', rows: 3 },
            { key: 'related_services', label: 'Section 16: Related Services', rows: 3 },
            { key: 'call_to_action', label: 'Section 17: Ready to Start / Call to Action', rows: 4 }
          ].map((field) => (
            <div key={field.key}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                {field.label}
              </label>
              <textarea
                rows={field.rows}
                value={formData[field.key] || ''}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                  fontFamily: 'inherit',
                  lineHeight: '1.5'
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Template FAQs */}
      {activeTab === 'faqs' && (
        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Service FAQs ({faqs.length})
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0 0' }}>
                These FAQs will be automatically created and attached whenever a page is generated with this template.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddFaq}
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '8px 14px',
                fontWeight: 600,
                fontSize: '0.85rem',
                color: '#0f172a',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <FiPlus /> Add FAQ Item
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((faq, index) => (
              <div
                key={index}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ff6000' }}>
                    FAQ #{index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteFaq(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <FiTrash2 /> Remove
                  </button>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Question
                  </label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Answer
                  </label>
                  <textarea
                    rows={3}
                    value={faq.answer}
                    onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
