import React, { useState } from 'react';
import { FiPlus, FiMapPin, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function SeoLocationsList({ locations, onToggleActive, onCreateLocation }) {
  const [cityName, setCityName] = useState('');
  const [stateName, setStateName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cityName.trim() || !stateName.trim()) return;

    const citySlug = cityName.toLowerCase().trim().replace(/\s+/g, '-');
    const stateSlug = stateName.toLowerCase().trim().replace(/\s+/g, '-');

    onCreateLocation({
      city_name: cityName,
      state_name: stateName,
      city_slug: citySlug,
      state_slug: stateSlug,
      is_active: true
    });

    setCityName('');
    setStateName('');
    setShowAddForm(false);
  };

  return (
    <div className="seo-locations-container">
      <div className="table-card" style={{ background: '#ffffff', borderRadius: '10px', padding: '20px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showAddForm ? '16px' : '0' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Target Locations Directory</h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0 0' }}>Manage cities and states available for local SEO landing pages</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{ background: '#ff6000', color: '#ffffff', border: 'none', padding: '9px 18px', borderRadius: '6px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FiPlus /> {showAddForm ? 'Cancel' : 'Add Target City'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>City Name *</label>
              <input
                type="text"
                placeholder="e.g. Indore"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                required
              />
            </div>

            <div style={{ flex: 1, minWidth: '180px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>State Name *</label>
              <input
                type="text"
                placeholder="e.g. Madhya Pradesh"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                required
              />
            </div>

            <button
              type="submit"
              style={{ background: '#193563', color: '#ffffff', border: 'none', padding: '9px 18px', borderRadius: '6px', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }}
            >
              Save City
            </button>
          </form>
        )}
      </div>

      <div className="table-card" style={{ background: '#ffffff', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>City Name</th>
              <th>State Name</th>
              <th>City Slug</th>
              <th style={{ textAlign: 'center' }}>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((loc) => (
              <tr key={loc.city_slug}>
                <td style={{ color: '#0f172a', fontWeight: 700 }}>
                  <FiMapPin style={{ color: '#ff6000', marginRight: '6px', verticalAlign: 'middle' }} />
                  {loc.city_name}
                </td>
                <td style={{ color: '#475569' }}>{loc.state_name}</td>
                <td>
                  <code style={{ background: '#f1f5f9', color: '#ff6000', padding: '3px 8px', borderRadius: '6px', fontSize: '0.85rem' }}>{loc.city_slug}</code>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`status-badge ${loc.is_active ? 'resolved' : 'new'}`} style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>
                    {loc.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => onToggleActive(loc)}
                    style={{
                      background: loc.is_active ? '#fef2f2' : '#ecfdf5',
                      color: loc.is_active ? '#dc2626' : '#059669',
                      border: loc.is_active ? '1px solid #fca5a5' : '1px solid #a7f3d0',
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {loc.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
