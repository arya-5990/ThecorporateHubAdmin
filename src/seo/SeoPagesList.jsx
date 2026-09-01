import React, { useState } from 'react';
import {
  FiSearch,
  FiPlus,
  FiEdit,
  FiEye,
  FiCopy,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiFilter
} from 'react-icons/fi';

export default function SeoPagesList({
  pages,
  locations,
  services,
  onEditPage,
  onCreatePage,
  onDuplicatePage,
  onTogglePublish,
  onDeletePage
}) {
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [filterService, setFilterService] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Unique list of states
  const states = Array.from(new Set(locations.map((l) => l.state_name))).sort();

  // Filtered pages logic
  const filteredPages = pages.filter((page) => {
    const cityName = page.city_name || page.seo_locations?.city_name || '';
    const stateName = page.state_name || page.seo_locations?.state_name || '';
    const serviceName = page.service_name || page.seo_services?.service_name || '';
    const h1Text = page.h1 || '';
    const searchLower = search.toLowerCase();

    const matchesSearch =
      !search ||
      cityName.toLowerCase().includes(searchLower) ||
      stateName.toLowerCase().includes(searchLower) ||
      serviceName.toLowerCase().includes(searchLower) ||
      h1Text.toLowerCase().includes(searchLower);

    const matchesState = filterState === 'all' || stateName === filterState;
    const matchesCity = filterCity === 'all' || cityName === filterCity;
    const matchesService = filterService === 'all' || serviceName === filterService;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'published' && page.published) ||
      (filterStatus === 'draft' && !page.published);

    return matchesSearch && matchesState && matchesCity && matchesService && matchesStatus;
  });

  return (
    <div className="seo-pages-list-container">
      {/* Controls Bar & Filters */}
      <div className="table-card" style={{ background: '#ffffff', borderRadius: '10px', padding: '18px 20px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          {/* Search Box */}
          <div className="search-box" style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0 12px', width: '320px' }}>
            <FiSearch style={{ color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search by City, State, Service or H1..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', padding: '10px 8px', fontSize: '0.88rem', width: '100%' }}
            />
          </div>

          <button
            onClick={onCreatePage}
            style={{ background: '#ff6000', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FiPlus /> Create SEO Page
          </button>
        </div>

        {/* Filters Dropdowns */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
            <FiFilter /> Filter By:
          </div>

          {/* State Filter */}
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            style={{ padding: '7px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.85rem', color: '#334155' }}
          >
            <option value="all">All States</option>
            {states.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          {/* City Filter */}
          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            style={{ padding: '7px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.85rem', color: '#334155' }}
          >
            <option value="all">All Cities</option>
            {locations.map((l) => (
              <option key={l.city_slug} value={l.city_name}>{l.city_name}</option>
            ))}
          </select>

          {/* Service Filter */}
          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            style={{ padding: '7px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.85rem', color: '#334155' }}
          >
            <option value="all">All Services</option>
            {services.map((s) => (
              <option key={s.service_slug} value={s.service_name}>{s.service_name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '7px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.85rem', color: '#334155' }}
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>

          {(filterState !== 'all' || filterCity !== 'all' || filterService !== 'all' || filterStatus !== 'all' || search) && (
            <button
              onClick={() => {
                setSearch('');
                setFilterState('all');
                setFilterCity('all');
                setFilterService('all');
                setFilterStatus('all');
              }}
              style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', marginLeft: 'auto' }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Pages Table Card */}
      <div className="table-card" style={{ background: '#ffffff', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>City</th>
              <th>State</th>
              <th>SEO Service</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPages.length > 0 ? (
              filteredPages.map((page) => (
                <tr key={page.id || `${page.city_slug}-${page.service_slug}`}>
                  <td style={{ color: '#0f172a', fontWeight: 700 }}>
                    {page.city_name || page.seo_locations?.city_name}
                  </td>
                  <td style={{ color: '#475569' }}>
                    {page.state_name || page.seo_locations?.state_name}
                  </td>
                  <td style={{ color: '#334155', fontWeight: 600 }}>
                    {page.service_name || page.seo_services?.service_name}
                  </td>
                  <td>
                    <span className={`status-badge ${page.published ? 'resolved' : 'new'}`} style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>
                      {page.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    {new Date(page.updated_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        onClick={() => onEditPage(page)}
                        style={{ background: '#193563', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
                        title="Edit Page CMS"
                      >
                        <FiEdit style={{ verticalAlign: 'middle' }} /> Edit
                      </button>

                      <button
                        onClick={() => onDuplicatePage(page)}
                        style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
                        title="Duplicate to another location"
                      >
                        <FiCopy style={{ verticalAlign: 'middle' }} /> Duplicate
                      </button>

                      <button
                        onClick={() => onTogglePublish(page)}
                        style={{
                          background: page.published ? '#fef2f2' : '#ecfdf5',
                          color: page.published ? '#dc2626' : '#059669',
                          border: page.published ? '1px solid #fca5a5' : '1px solid #a7f3d0',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {page.published ? 'Unpublish' : 'Publish'}
                      </button>

                      <a
                        href={`http://localhost:3000/locations/${page.city_slug || page.seo_locations?.city_slug}/${page.service_slug || page.seo_services?.service_slug}${page.published ? '' : '?preview=true'}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px', marginLeft: '4px' }}
                      >
                        <FiEye /> {page.published ? 'Live' : 'Preview'}
                      </a>

                      <button
                        onClick={() => onDeletePage(page)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', padding: '4px', cursor: 'pointer', fontSize: '1rem' }}
                        title="Delete SEO Page"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                  No SEO location pages found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
