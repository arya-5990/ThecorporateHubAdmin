import React, { useState, useEffect } from 'react';
import {
  FiCompass,
  FiRefreshCw,
  FiCopy,
  FiExternalLink,
  FiCheck,
  FiFileText,
  FiGlobe,
  FiMapPin,
  FiDownload,
  FiSearch,
  FiCheckCircle,
  FiAlertTriangle,
  FiInfo,
  FiCode,
  FiList
} from 'react-icons/fi';
import {
  DEFAULT_SITE_URL,
  compileAllSitemapRoutes,
  buildSitemapXml,
  syncSitemapToDb,
  fetchCurrentSitemapFromDb
} from './sitemapSync';

export default function SeoSitemapView({ triggerToast }) {
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [xmlContent, setXmlContent] = useState('');
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [tableMissing, setTableMissing] = useState(false);
  const [stats, setStats] = useState({ total: 0, seoPages: 0, locations: 0, services: 0 });

  // UI View state
  const [activeTab, setActiveTab] = useState('urls'); // 'urls' | 'xml'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedXml, setCopiedXml] = useState(false);
  const [copiedRowUrl, setCopiedRowUrl] = useState(null);

  const sitemapUrl = `${DEFAULT_SITE_URL}/sitemap.xml`;

  useEffect(() => {
    loadSitemapData();
  }, []);

  const loadSitemapData = async () => {
    setLoading(true);
    try {
      // 1. Try to load existing record from database
      const dbRes = await fetchCurrentSitemapFromDb();
      if (dbRes.tableMissing) {
        setTableMissing(true);
      }

      if (dbRes.record && dbRes.record.routes_json && dbRes.record.routes_json.length > 0) {
        const dbRoutes = dbRes.record.routes_json;
        setRoutes(dbRoutes);
        setXmlContent(dbRes.record.xml_content || buildSitemapXml(dbRoutes));
        setLastSyncTime(dbRes.record.last_generated_at || dbRes.record.updated_at);
        updateStatsFromRoutes(dbRoutes);
        setTableMissing(false);
      } else {
        // If not stored in DB yet, compile fresh from current tables
        const compiled = await compileAllSitemapRoutes(DEFAULT_SITE_URL);
        const compiledXml = buildSitemapXml(compiled.routes);
        setRoutes(compiled.routes);
        setXmlContent(compiledXml);
        setLastSyncTime(new Date().toISOString());
        updateStatsFromRoutes(compiled.routes);

        // Try to save to DB in background
        if (!dbRes.tableMissing) {
          const syncRes = await syncSitemapToDb(DEFAULT_SITE_URL);
          if (syncRes.tableMissing) setTableMissing(true);
        }
      }
    } catch (err) {
      console.error('Error loading sitemap data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatsFromRoutes = (routeList) => {
    const total = routeList.length;
    const seoPages = routeList.filter((r) => r.category === 'Dynamic SEO Page').length;
    const locations = routeList.filter((r) => r.category === 'Location Hub').length;
    const services = routeList.filter((r) => r.category === 'Service Hub' || r.category === 'Sub-Service').length;
    setStats({ total, seoPages, locations, services });
  };

  const handleManualSync = async () => {
    setSyncing(true);
    try {
      const res = await syncSitemapToDb(DEFAULT_SITE_URL);
      if (res.tableMissing) {
        setTableMissing(true);
        setRoutes(res.routes || []);
        setXmlContent(res.xml || '');
        setLastSyncTime(res.lastGeneratedAt);
        updateStatsFromRoutes(res.routes || []);
        if (triggerToast) {
          triggerToast('Sitemap compiled locally! Run SQL migration to persist in database.', 'info');
        }
      } else if (res.success) {
        setTableMissing(false);
        setRoutes(res.routes);
        setXmlContent(res.xml);
        setLastSyncTime(res.lastGeneratedAt);
        updateStatsFromRoutes(res.routes);
        if (triggerToast) {
          triggerToast(`Sitemap updated & stored in DB! (${res.count} URLs indexed)`);
        }
      } else {
        throw new Error(res.error || 'Failed to sync');
      }
    } catch (err) {
      console.error('Sitemap sync error:', err);
      if (triggerToast) triggerToast(err.message || 'Error syncing sitemap', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleCopySitemapUrl = () => {
    navigator.clipboard.writeText(sitemapUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
    if (triggerToast) triggerToast('Sitemap URL copied to clipboard!');
  };

  const handleCopyXml = () => {
    navigator.clipboard.writeText(xmlContent);
    setCopiedXml(true);
    setTimeout(() => setCopiedXml(false), 2500);
    if (triggerToast) triggerToast('Sitemap XML copied to clipboard!');
  };

  const handleCopyRow = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedRowUrl(url);
    setTimeout(() => setCopiedRowUrl(null), 2000);
  };

  const handleDownloadXml = () => {
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (triggerToast) triggerToast('sitemap.xml downloaded!');
  };

  // Filter routes
  const filteredRoutes = routes.filter((r) => {
    const matchesSearch =
      r.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.title && r.title.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'seo') return r.category === 'Dynamic SEO Page';
    if (categoryFilter === 'locations') return r.category === 'Location Hub';
    if (categoryFilter === 'services') return r.category === 'Service Hub' || r.category === 'Sub-Service';
    if (categoryFilter === 'core') return r.category === 'Core' || r.category === 'Navigation' || r.category === 'Legal';
    return true;
  });

  const categories = [
    { id: 'all', label: 'All URLs', count: routes.length },
    { id: 'seo', label: 'Dynamic SEO Pages', count: stats.seoPages },
    { id: 'locations', label: 'City Hubs', count: stats.locations },
    { id: 'services', label: 'Services', count: stats.services },
    { id: 'core', label: 'Core / Static', count: routes.length - stats.seoPages - stats.locations - stats.services }
  ];

  return (
    <div className="sitemap-view-container">
      {/* Top Banner / Hero Header */}
      <div className="sitemap-hero-card">
        <div className="sitemap-hero-header">
          <div className="sitemap-hero-title-group">
            <div className="sitemap-icon-badge">
              <FiCompass />
            </div>
            <div>
              <div className="sitemap-badge-row">
                <h2>Dynamic XML Sitemap Engine</h2>
                <span className={`live-sync-badge ${tableMissing ? 'warning' : 'synced'}`}>
                  <span className="live-dot" />
                  {tableMissing ? 'Local Fallback' : 'DB Stored & Auto-Synced'}
                </span>
              </div>
              <p className="sitemap-subtitle">
                Automated index generator that syncs every new SEO page directly to the Supabase database for Google Search Console crawler ingestion.
              </p>
            </div>
          </div>

          <div className="sitemap-hero-actions">
            <button
              className="sitemap-btn-primary"
              onClick={handleManualSync}
              disabled={syncing}
              title="Recompile all routes and write directly to public.seo_sitemaps"
            >
              <FiRefreshCw className={syncing ? 'spin-icon' : ''} />
              {syncing ? 'Syncing to DB...' : 'Rebuild & Sync Sitemap'}
            </button>

            <button className="sitemap-btn-secondary" onClick={handleCopySitemapUrl}>
              {copiedUrl ? <FiCheck style={{ color: '#10b981' }} /> : <FiCopy />}
              {copiedUrl ? 'Copied URL!' : 'Copy Sitemap URL'}
            </button>

            <a
              href={sitemapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sitemap-btn-ghost"
              title="View live production sitemap"
            >
              <FiExternalLink /> Live XML
            </a>

            <button className="sitemap-btn-ghost" onClick={handleDownloadXml} title="Download sitemap.xml">
              <FiDownload /> Download
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="sitemap-metrics-grid">
          <div className="metric-card">
            <span className="metric-label">Total Indexed URLs</span>
            <span className="metric-val">{stats.total}</span>
            <span className="metric-sub">Served to Search Engines</span>
          </div>

          <div className="metric-card">
            <span className="metric-label">Published SEO Pages</span>
            <span className="metric-val highlight">{stats.seoPages}</span>
            <span className="metric-sub">City × Service combinations</span>
          </div>

          <div className="metric-card">
            <span className="metric-label">Active City Hubs</span>
            <span className="metric-val">{stats.locations}</span>
            <span className="metric-sub">High-intent regional hubs</span>
          </div>

          <div className="metric-card">
            <span className="metric-label">Last Database Sync</span>
            <span className="metric-val text-sm">
              {lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Never'}
            </span>
            <span className="metric-sub">
              {lastSyncTime ? new Date(lastSyncTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Pending sync'}
            </span>
          </div>
        </div>
      </div>

      {/* SQL Missing Notice if Table Hasn't Been Created Yet */}
      {tableMissing && (
        <div className="sitemap-sql-notice">
          <div className="notice-icon">
            <FiAlertTriangle />
          </div>
          <div className="notice-content">
            <h4>One-Time Database Setup Required for Database Caching</h4>
            <p>
              The table <code>public.seo_sitemaps</code> is not yet created in your Supabase database. The sitemap is currently compiling dynamically in-memory.
              To enable permanent database caching for Search Console, copy and execute the SQL migration in your Supabase SQL Editor.
            </p>
            <button
              className="copy-sql-btn"
              onClick={() => {
                const sql = `CREATE TABLE IF NOT EXISTS public.seo_sitemaps (
  id text PRIMARY KEY DEFAULT 'default',
  xml_content text NOT NULL,
  urls_count integer NOT NULL DEFAULT 0,
  routes_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  last_generated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.seo_sitemaps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read seo_sitemaps" ON public.seo_sitemaps FOR SELECT USING (true);
CREATE POLICY "Anyone can insert seo_sitemaps" ON public.seo_sitemaps FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update seo_sitemaps" ON public.seo_sitemaps FOR UPDATE USING (true);`;
                navigator.clipboard.writeText(sql);
                if (triggerToast) triggerToast('SQL migration copied to clipboard! Paste into Supabase SQL Editor.');
              }}
            >
              <FiCopy /> Copy SQL Migration Script
            </button>
          </div>
        </div>
      )}

      {/* Google Search Console Connection Guide */}
      <div className="sitemap-gsc-card">
        <div className="gsc-card-left">
          <div className="gsc-badge">
            <FiGlobe /> Google Search Console Verified
          </div>
          <h3>How Google Search Console Crawls Your Dynamic Sitemap</h3>
          <p>
            Your production sitemap is served at <code>https://www.thecorporatehub.in/sitemap.xml</code>. When submitted once to Google Search Console, Googlebot routinely checks this endpoint. Because every new SEO page is automatically stored in Supabase, your latest city and service URLs appear in search index results without needing manual resubmissions.
          </p>
          <div className="gsc-steps">
            <div className="gsc-step">
              <span className="step-num">1</span>
              <span>Open GSC Sitemaps tool</span>
            </div>
            <div className="gsc-step">
              <span className="step-num">2</span>
              <span>Submit <code>sitemap.xml</code></span>
            </div>
            <div className="gsc-step">
              <span className="step-num">3</span>
              <span>Automatic continuous crawl</span>
            </div>
          </div>
        </div>
        <div className="gsc-card-right">
          <a
            href="https://search.google.com/search-console/sitemaps"
            target="_blank"
            rel="noopener noreferrer"
            className="gsc-link-btn"
          >
            <FiExternalLink /> Open Google Search Console
          </a>
        </div>
      </div>

      {/* Content View: Toggle between URL Explorer and Raw XML */}
      <div className="sitemap-content-wrapper">
        <div className="sitemap-toolbar">
          <div className="toolbar-tabs">
            <button
              className={`view-tab-btn ${activeTab === 'urls' ? 'active' : ''}`}
              onClick={() => setActiveTab('urls')}
            >
              <FiList /> Indexed URL Registry ({routes.length})
            </button>
            <button
              className={`view-tab-btn ${activeTab === 'xml' ? 'active' : ''}`}
              onClick={() => setActiveTab('xml')}
            >
              <FiCode /> Raw XML Inspector
            </button>
          </div>

          {activeTab === 'urls' && (
            <div className="toolbar-search">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search URLs, cities, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                  ×
                </button>
              )}
            </div>
          )}

          {activeTab === 'xml' && (
            <button className="copy-xml-btn" onClick={handleCopyXml}>
              {copiedXml ? <FiCheck style={{ color: '#10b981' }} /> : <FiCopy />}
              {copiedXml ? 'Copied XML' : 'Copy All XML'}
            </button>
          )}
        </div>

        {/* Tab 1: URL Registry Table */}
        {activeTab === 'urls' && (
          <div className="sitemap-table-container">
            {/* Category Filter Pills */}
            <div className="category-pills">
              {categories.map((c) => (
                <button
                  key={c.id}
                  className={`pill-btn ${categoryFilter === c.id ? 'active' : ''}`}
                  onClick={() => setCategoryFilter(c.id)}
                >
                  {c.label} <span className="pill-count">({c.count})</span>
                </button>
              ))}
            </div>

            <table className="sitemap-table">
              <thead>
                <tr>
                  <th style={{ width: '40%' }}>URL / Path</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Change Frequency</th>
                  <th>Last Modified</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoutes.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-table">
                      No URLs found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRoutes.map((route, idx) => (
                    <tr key={route.url || idx}>
                      <td>
                        <div className="url-cell">
                          <span className="url-title">{route.title || route.path}</span>
                          <span className="url-path">{route.url}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`cat-badge ${route.category?.toLowerCase().replace(/\s+/g, '-')}`}>
                          {route.category}
                        </span>
                      </td>
                      <td>
                        <span className="priority-tag">
                          {Number(route.priority || 0.8).toFixed(1)}
                        </span>
                      </td>
                      <td>
                        <span className="changefreq-text">{route.changefreq}</span>
                      </td>
                      <td>
                        <span className="lastmod-text">
                          {route.lastmod ? new Date(route.lastmod).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Live'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="row-actions">
                          <button
                            className="row-copy-btn"
                            onClick={() => handleCopyRow(route.url)}
                            title="Copy URL"
                          >
                            {copiedRowUrl === route.url ? <FiCheck style={{ color: '#10b981' }} /> : <FiCopy />}
                          </button>
                          <a
                            href={route.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="row-open-btn"
                            title="Open Link in New Tab"
                          >
                            <FiExternalLink />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Raw XML Inspector */}
        {activeTab === 'xml' && (
          <div className="sitemap-xml-wrapper">
            <div className="xml-header-bar">
              <span className="xml-meta">
                Standard sitemaps.org 0.9 XML — {routes.length} total &lt;url&gt; nodes
              </span>
              <button className="copy-xml-btn-sm" onClick={handleCopyXml}>
                {copiedXml ? <FiCheck /> : <FiCopy />} {copiedXml ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="xml-code-block">
              <code>{xmlContent}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
