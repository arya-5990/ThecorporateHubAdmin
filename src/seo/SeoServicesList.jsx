import React, { useState } from 'react';
import { FiPlus, FiGlobe, FiCheckCircle, FiXCircle, FiTrash2 } from 'react-icons/fi';

export default function SeoServicesList({ services, onToggleActive, onCreateService, onDeleteService }) {
  const [serviceName, setServiceName] = useState('');
  const [parentCategory, setParentCategory] = useState('business-registration');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!serviceName.trim()) return;

    const serviceSlug = serviceName.toLowerCase().trim().replace(/\s+/g, '-');

    onCreateService({
      service_name: serviceName,
      service_slug: serviceSlug,
      parent_service: parentCategory,
      is_active: true
    });

    setServiceName('');
    setShowAddForm(false);
  };

  return (
    <div className="seo-services-container">
      <div className="table-card" style={{ background: '#ffffff', borderRadius: '10px', padding: '20px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showAddForm ? '16px' : '0' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>SEO Services Taxonomy</h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0 0' }}>Manage services available for location landing pages and parent categories</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{ background: '#ff6000', color: '#ffffff', border: 'none', padding: '9px 18px', borderRadius: '6px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FiPlus /> {showAddForm ? 'Cancel' : 'Add SEO Service'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Service Name *</label>
              <input
                type="text"
                placeholder="e.g. FSSAI License Registration"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                required
              />
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>Parent Category</label>
              <select
                value={parentCategory}
                onChange={(e) => setParentCategory(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              >
                <option value="business-registration">Business Registration</option>
                <option value="intellectual-property">Intellectual Property</option>
                <option value="accounting-taxation">Accounting & Taxation</option>
                <option value="corporate-compliance">Corporate Compliance</option>
                <option value="licenses-certifications">Licenses & Certifications</option>
              </select>
            </div>

            <button
              type="submit"
              style={{ background: '#193563', color: '#ffffff', border: 'none', padding: '9px 18px', borderRadius: '6px', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }}
            >
              Save Service
            </button>
          </form>
        )}
      </div>

      <div className="table-card" style={{ background: '#ffffff', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Service Slug</th>
              <th>Parent Category</th>
              <th style={{ textAlign: 'center' }}>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((srv) => (
              <tr key={srv.service_slug}>
                <td style={{ color: '#0f172a', fontWeight: 700 }}>
                  <FiGlobe style={{ color: '#ff6000', marginRight: '6px', verticalAlign: 'middle' }} />
                  {srv.service_name}
                </td>
                <td>
                  <code style={{ background: '#f1f5f9', color: '#ff6000', padding: '3px 8px', borderRadius: '6px', fontSize: '0.85rem' }}>{srv.service_slug}</code>
                </td>
                <td style={{ color: '#64748b' }}>{srv.parent_service || 'N/A'}</td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`status-badge ${srv.is_active ? 'resolved' : 'new'}`} style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>
                    {srv.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <button
                      onClick={() => onToggleActive(srv)}
                      style={{
                        background: srv.is_active ? '#fef2f2' : '#ecfdf5',
                        color: srv.is_active ? '#dc2626' : '#059669',
                        border: srv.is_active ? '1px solid #fca5a5' : '1px solid #a7f3d0',
                        padding: '5px 12px',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {srv.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    {onDeleteService && (
                      <button
                        onClick={() => onDeleteService(srv)}
                        title="Delete Service"
                        style={{
                          background: '#fef2f2',
                          color: '#dc2626',
                          border: '1px solid #fca5a5',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
