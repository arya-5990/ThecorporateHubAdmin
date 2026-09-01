import React from 'react';
import { FiFileText, FiCheckCircle, FiEdit3, FiMapPin, FiGlobe, FiEye, FiArrowRight } from 'react-icons/fi';

export default function SeoDashboard({ stats, recentPages, onEditPage, onViewAllPages, onCreatePage }) {
  return (
    <div className="seo-dashboard-container">
      {/* Stats Grid Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7', width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
            <FiFileText />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{stats.total}</div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>Total SEO Pages</div>
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
            <FiCheckCircle />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{stats.published}</div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>Published Live</div>
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
            <FiEdit3 />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{stats.drafts}</div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>Drafts / Review</div>
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ background: 'rgba(255, 96, 0, 0.1)', color: '#ff6000', width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
            <FiMapPin />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{stats.locations}</div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>Target Cities</div>
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
            <FiGlobe />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{stats.services}</div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>SEO Services</div>
          </div>
        </div>
      </div>

      {/* Recent SEO Pages Table */}
      <div className="table-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Recent SEO Pages</h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0 0' }}>Pages updated or created recently across all locations</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onCreatePage}
              style={{ background: '#ff6000', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              + Create SEO Page
            </button>
            <button
              onClick={onViewAllPages}
              style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              View All Pages <FiArrowRight />
            </button>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>City / State</th>
              <th>SEO Service</th>
              <th>H1 Heading</th>
              <th style={{ textAlign: 'center' }}>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentPages && recentPages.length > 0 ? (
              recentPages.map((page) => (
                <tr key={page.id || `${page.city_slug}-${page.service_slug}`}>
                  <td>
                    <strong style={{ color: '#0f172a' }}>{page.city_name || page.seo_locations?.city_name}</strong>{' '}
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>({page.state_name || page.seo_locations?.state_name})</span>
                  </td>
                  <td style={{ color: '#334155', fontWeight: 500 }}>{page.service_name || page.seo_services?.service_name}</td>
                  <td style={{ color: '#0f172a', fontWeight: 500 }}>{page.h1}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`status-badge ${page.published ? 'resolved' : 'new'}`} style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>
                      {page.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => onEditPage(page)}
                      style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', padding: '5px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', marginRight: '8px' }}
                    >
                      <FiEdit3 style={{ verticalAlign: 'middle' }} /> Edit
                    </button>
                    {page.published && (
                      <a
                        href={`http://localhost:3000/locations/${page.city_slug || page.seo_locations?.city_slug}/${page.service_slug || page.seo_services?.service_slug}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <FiEye /> View Live
                      </a>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                  No recent SEO pages found. Click <strong>+ Create SEO Page</strong> to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
