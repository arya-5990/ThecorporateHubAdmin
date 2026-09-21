import React, { useState } from 'react';
import {
  FiLayers,
  FiEdit2,
  FiCheckCircle,
  FiDatabase,
  FiFileText,
  FiInfo,
  FiSearch
} from 'react-icons/fi';
import SeoTemplateEditor from './SeoTemplateEditor';

export default function SeoTemplatesList({
  templates,
  services,
  onSaveTemplate,
  triggerToast
}) {
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  if (editingTemplate) {
    return (
      <SeoTemplateEditor
        template={editingTemplate}
        services={services}
        onSave={async (updated) => {
          await onSaveTemplate(updated);
          setEditingTemplate(null);
        }}
        onBack={() => setEditingTemplate(null)}
        triggerToast={triggerToast}
      />
    );
  }

  const filtered = templates.filter((t) => {
    const q = searchTerm.toLowerCase();
    return (
      (t.template_name && t.template_name.toLowerCase().includes(q)) ||
      (t.service_slug && t.service_slug.toLowerCase().includes(q)) ||
      (t.service_name && t.service_name.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Informational Hero Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          borderRadius: '14px',
          padding: '24px 28px',
          marginBottom: '24px',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff8a3d', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            <FiDatabase /> Database-Backed Content Templates
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 10px 0' }}>
            Master SEO Content Templates
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0, maxWidth: '780px', lineHeight: '1.6' }}>
            Templates contain pre-written, high-quality content across all 17 CMS sections and FAQs.
            When you create a new landing page for a location, the system automatically replaces{' '}
            <code style={{ background: '#334155', padding: '2px 6px', borderRadius: '4px', color: '#f8fafc' }}>{'{{CITY}}'}</code> and{' '}
            <code style={{ background: '#334155', padding: '2px 6px', borderRadius: '4px', color: '#f8fafc' }}>{'{{STATE}}'}</code> with the target location.
            You can modify the master templates below anytime.
          </p>
        </div>
      </div>

      {/* Search and stats bar */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '16px 20px',
          border: '1px solid #e2e8f0',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
          <FiSearch style={{ color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search templates by service or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              fontSize: '0.92rem',
              width: '100%',
              color: '#0f172a'
            }}
          />
        </div>

        <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
          Showing {filtered.length} of {templates.length} templates
        </div>
      </div>

      {/* Templates List Table / Cards */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2.5fr 1.5fr 1fr 1fr 1.2fr',
            padding: '14px 20px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}
        >
          <div>Template / Service Name</div>
          <div>Service Slug</div>
          <div>CMS Sections</div>
          <div>Template FAQs</div>
          <div style={{ textAlign: 'right' }}>Actions</div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
            <FiInfo style={{ fontSize: '1.8rem', color: '#94a3b8', marginBottom: '8px' }} />
            <p style={{ margin: 0, fontSize: '0.95rem' }}>No templates matched your search query.</p>
          </div>
        ) : (
          filtered.map((t) => {
            const isFromDb = Boolean(t.id && !t.id.startsWith('seed-'));
            const faqsCount = Array.isArray(t.faqs) ? t.faqs.length : 0;

            return (
              <div
                key={t.service_slug || t.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2.5fr 1.5fr 1fr 1fr 1.2fr',
                  padding: '16px 20px',
                  borderBottom: '1px solid #f1f5f9',
                  alignItems: 'center',
                  transition: 'background 0.15s ease'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                    {t.template_name || t.service_name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '12px',
                        background: isFromDb ? '#ecfdf5' : '#eff6ff',
                        color: isFromDb ? '#059669' : '#2563eb',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <FiCheckCircle /> {isFromDb ? 'Supabase DB' : 'Master Seed'}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Ready for auto-fill
                    </span>
                  </div>
                </div>

                <div>
                  <code style={{ fontSize: '0.82rem', background: '#f1f5f9', padding: '3px 6px', borderRadius: '4px', color: '#334155' }}>
                    {t.service_slug}
                  </code>
                </div>

                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                  17 Sections
                </div>

                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ff6000' }}>
                  {faqsCount} FAQs
                </div>

                <div style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => setEditingTemplate(t)}
                    style={{
                      background: '#fff7ed',
                      color: '#ea580c',
                      border: '1px solid #ffedd5',
                      padding: '7px 14px',
                      borderRadius: '6px',
                      fontWeight: 600,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <FiEdit2 /> Edit Master
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
