import React, { useState, useEffect } from 'react';
import './App.css';
import { servicesData as defaultServicesData } from './data/servicesData';
import { supabase } from './supabase';
import LoginPage from './LoginPage';
import SeoManager from './SeoManager';
import ConfirmModal from './ConfirmModal';
import {
  FiGrid,
  FiInbox,
  FiUsers,
  FiGlobe,
  FiSearch,
  FiCheckCircle,
  FiClock,
  FiTrash2,
  FiRefreshCw,
  FiX,
  FiEye,
  FiPhone,
  FiMail,
  FiUser,
  FiLayers,
  FiFileText,
  FiCheck,
  FiArrowRight,
  FiChevronRight,
  FiSliders,
  FiAlertCircle,
  FiCalendar,
  FiHash,
  FiSave,
  FiLogOut,
  FiCompass
} from 'react-icons/fi';

// Fallback Initial Mock Contacts if database is empty/offline
const INITIAL_CONTACTS = [
  {
    id: "SUB-849201",
    fullName: "Alexander Wright",
    email: "a.wright@nexusventures.co",
    phone: "+1 (555) 234-8901",
    service: "business-registration",
    subject: "Private Limited Incorporation Inquiry",
    message: "We are incorporating a venture-backed tech startup with 3 co-founders. Need assistance with SPICe+ Part B, cap table MOA drafting, and fast-track DSC.",
    date: "Aug 11, 2026, 02:45 PM",
    status: "New"
  },
  {
    id: "SUB-739102",
    fullName: "Sophia Chen",
    email: "sophia.chen@biolabs.org",
    phone: "+1 (555) 876-5432",
    service: "intellectual-property",
    subject: "Provisional Patent & Trademark Registration",
    message: "Looking for patent novelty search for a biomedical device, plus trademark registration for our core brand mark in Class 10 and 42.",
    date: "Aug 11, 2026, 11:15 AM",
    status: "In Progress"
  }
];

export default function App() {
  // Auth State
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'contacts' | 'users' | 'editor'
  
  // Contacts State
  const [contacts, setContacts] = useState([]);
  const [contactFilter, setContactFilter] = useState('all');
  const [contactSearch, setContactSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [loadingContacts, setLoadingContacts] = useState(true);

  // Users State
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  // Services Accordion State
  const [services, setServices] = useState(defaultServicesData);
  const [selectedSlug, setSelectedSlug] = useState('business-registration');
  const [editorSection, setEditorSection] = useState('about'); // 'about' | 'servicesWeProvide' | 'onClickServices' | 'terms'

  // Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', confirmText: 'Delete', type: 'danger', onConfirm: null });

  // Auth Check on Mount
  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load Contacts & Services from LocalStorage
  // Load Contacts from Supabase
  const fetchContacts = async () => {
    setLoadingContacts(true);
    try {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        console.warn("Supabase not configured, using mock data");
        setContacts(INITIAL_CONTACTS);
        return;
      }

      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setContacts(data);
      } else {
        setContacts([]);
      }
    } catch (e) {
      console.error("Error loading contacts from Supabase", e);
      setContacts(INITIAL_CONTACTS);
    } finally {
      setLoadingContacts(false);
    }
  };

  // Load Registered Users from Supabase profiles table
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        console.warn("Supabase not configured, skipping user fetch");
        setUsersLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('email', { ascending: true });

      if (error) throw error;
      setUsers(data || []);
    } catch (e) {
      console.error("Error loading users from Supabase", e);
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch on auth session change
  useEffect(() => {
    if (!session) return;
    fetchContacts();
    fetchUsers();
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0b172a 0%, #193563 100%)',
        color: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏛️</div>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid rgba(255,255,255,0.2)',
            borderTopColor: '#ff6000',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
            margin: '0 auto'
          }} />
        </div>
      </div>
    );
  }

  // Show Login Page if not authenticated
  if (!session) {
    return <LoginPage onLoginSuccess={(s) => setSession(s)} />;
  }

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  // Contact Handlers
  const handleUpdateContactStatus = async (id, newStatus) => {
    // Optimistic UI update
    const updated = contacts.map(c => c.id === id ? { ...c, status: newStatus } : c);
    setContacts(updated);
    if (selectedContact && selectedContact.id === id) {
      setSelectedContact({ ...selectedContact, status: newStatus });
    }

    try {
      if (import.meta.env.VITE_SUPABASE_URL) {
        const { error } = await supabase
          .from('contact_submissions')
          .update({ status: newStatus })
          .eq('id', id);
          
        if (error) throw error;
      }
      triggerToast(`Inquiry ${id} status updated to ${newStatus}`);
    } catch (e) {
      console.error("Error updating status in Supabase", e);
      triggerToast(`Failed to update ${id}`, 'error');
    }
  };


  const handleDeleteContact = async (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Submission',
      message: `Are you sure you want to delete inquiry ${id}? This action cannot be undone.`,
      confirmText: 'Yes, Delete',
      type: 'danger',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          const updated = contacts.filter(c => c.id !== id);
          setContacts(updated);
          if (selectedContact && selectedContact.id === id) {
            setSelectedContact(null);
          }

          const { error } = await supabase
            .from('contact_submissions')
            .delete()
            .eq('id', id);

          if (error) {
            console.error('Error deleting submission from Supabase:', error);
            triggerToast(`Failed to delete: ${error.message}`, 'error');
          } else {
            triggerToast(`Inquiry ${id} deleted successfully.`, 'info');
          }
        } catch (e) {
          console.error("Delete submission error", e);
        }
      }
    });
  };

  // Filtered Contacts
  const filteredContacts = contacts.filter(c => {
    const matchesFilter = contactFilter === 'all' || c.status === contactFilter;
    const searchLower = contactSearch.toLowerCase();
    const matchesSearch = !contactSearch ||
      (c.fullName && c.fullName.toLowerCase().includes(searchLower)) ||
      (c.email && c.email.toLowerCase().includes(searchLower)) ||
      (c.phone && c.phone.toLowerCase().includes(searchLower)) ||
      (c.subject && c.subject.toLowerCase().includes(searchLower)) ||
      (c.id && c.id.toLowerCase().includes(searchLower));
    return matchesFilter && matchesSearch;
  });

  // Filtered Users
  const filteredUsers = users.filter(u => {
    if (!userSearch) return true;
    const searchLower = userSearch.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(searchLower)) ||
      (u.email && u.email.toLowerCase().includes(searchLower)) ||
      (u.phone_number && u.phone_number.toLowerCase().includes(searchLower)) ||
      (u.id && u.id.toLowerCase().includes(searchLower))
    );
  });

  // User Handlers
  const handleDeleteUser = async (userId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete User Profile',
      message: 'Are you sure you want to delete this user profile? This action cannot be undone.',
      confirmText: 'Yes, Delete User',
      type: 'danger',
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        const updated = users.filter(u => u.id !== userId);
        setUsers(updated);
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser(null);
        }

        try {
          if (import.meta.env.VITE_SUPABASE_URL) {
            const { error } = await supabase
              .from('profiles')
              .delete()
              .eq('id', userId);
              
            if (error) throw error;
          }
          triggerToast('User profile deleted successfully.', 'info');
        } catch (e) {
          console.error("Error deleting user from Supabase", e);
          triggerToast('Failed to delete user profile.', 'error');
        }
      }
    });
  };

  const handleRefreshContacts = async () => {
    await fetchContacts();
    triggerToast('Contacts refreshed successfully.');
  };

  const handleRefreshUsers = async () => {
    await fetchUsers();
    triggerToast('Users list refreshed successfully.');
  };

  const handleRefreshAll = async () => {
    await Promise.all([fetchContacts(), fetchUsers()]);
    triggerToast('Dashboard data refreshed successfully.');
  };

  // Service Accordion Handlers
  const handleResetServices = () => {
    setConfirmModal({
      isOpen: true,
      title: "Reset Service Defaults?",
      message: "Are you sure you want to reset all service accordion configurations back to default settings? Any local unsaved edits will be cleared.",
      confirmText: "Reset Defaults",
      type: "warning",
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        setServices(defaultServicesData);
        localStorage.removeItem("corporatehub_services_data");
        triggerToast("Service configuration reset to defaults.");
      }
    });
  };

  const handleSaveServices = () => {
    try {
      localStorage.setItem("corporatehub_services_data", JSON.stringify(services));
      triggerToast("Service accordion changes published successfully!");
    } catch (e) {
      console.error("Error saving services", e);
      triggerToast("Failed to save service configuration.", "error");
    }
  };

  const newCount = contacts.filter(c => c.status === 'New').length;
  const inProgressCount = contacts.filter(c => c.status === 'In Progress').length;

  return (
    <div className="admin-app">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          <FiCheckCircle className="toast-icon" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Admin Sidebar */}
      <aside className="admin-sidebar">
        <div className="brand-header">
          <img src="/logo.png" alt="Corporate Hub Logo" className="brand-logo" />
          <div className="brand-titles">
            <h2>CorporateHub</h2>
            <span className="brand-badge">ADMIN PANEL</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FiGrid /> Dashboard Overview
          </button>

          <button
            className={`nav-btn ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            <FiInbox /> Incoming Contacts
            {newCount > 0 && <span className="unread-badge">{newCount}</span>}
          </button>

          <button
            className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <FiUsers /> Registered Users
            {users.length > 0 && <span className="users-count-badge">{users.length}</span>}
          </button>

          <button
            className={`nav-btn ${activeTab === 'seo' ? 'active' : ''}`}
            onClick={() => setActiveTab('seo')}
          >
            <FiGlobe /> SEO Management
          </button>

          <button
            className={`nav-btn ${activeTab === 'sitemap' ? 'active' : ''}`}
            onClick={() => setActiveTab('sitemap')}
          >
            <FiCompass /> Dynamic Sitemap
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-info">
            <div className="sidebar-user-avatar">
              {session?.user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="sidebar-user-meta">
              <span className="sidebar-user-email">{session?.user?.email || 'Admin'}</span>
              <span className="sidebar-user-role">Administrator</span>
            </div>
          </div>
          <button className="sidebar-logout-btn" onClick={handleLogout} title="Sign Out">
            <FiLogOut /> Sign Out
          </button>
          <div className="live-status">
            <span className="pulse-dot"></span>
            <span>Supabase Live Sync</span>
          </div>
          <p>© 2026 CorporateHub</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Top Bar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <h1 className="page-title">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'contacts' && 'Incoming Contact Inquiries'}
              {activeTab === 'users' && 'Registered Users'}
              {activeTab === 'seo' && 'Location × Service SEO Manager'}
            </h1>
            <p className="page-subtitle">
              {activeTab === 'dashboard' && 'Monitor real-time client inquiries and service accordion configurations'}
              {activeTab === 'contacts' && 'Watch and manage incoming customer messages submitted from the contact page'}
              {activeTab === 'users' && 'View and manage all users registered on The Corporate Hub platform'}
              {activeTab === 'seo' && 'Manage target cities, service taxonomies, metadata and publishing status for /locations/[city]/[service]'}
            </p>
          </div>

          <div className="topbar-right">
            {activeTab === 'dashboard' && (
              <div className="action-button-group">
                <button className="reset-btn" onClick={handleRefreshAll} disabled={loadingContacts || usersLoading}>
                  <FiRefreshCw className={(loadingContacts || usersLoading) ? 'spin-icon' : ''} /> {(loadingContacts || usersLoading) ? 'Refreshing...' : 'Refresh Data'}
                </button>
              </div>
            )}
            {activeTab === 'contacts' && (
              <div className="action-button-group">
                <button className="reset-btn" onClick={handleRefreshContacts} disabled={loadingContacts}>
                  <FiRefreshCw className={loadingContacts ? 'spin-icon' : ''} /> {loadingContacts ? 'Refreshing...' : 'Refresh Contacts'}
                </button>
              </div>
            )}
            {activeTab === 'users' && (
              <div className="action-button-group">
                <button className="reset-btn" onClick={handleRefreshUsers} disabled={usersLoading}>
                  <FiRefreshCw className={usersLoading ? 'spin-icon' : ''} /> {usersLoading ? 'Refreshing...' : 'Refresh Users'}
                </button>
              </div>
            )}
            {activeTab === 'editor' && (
              <div className="action-button-group">
                <button className="reset-btn" onClick={handleResetServices}>
                  <FiRefreshCw /> Reset Defaults
                </button>
                <button className="save-btn" onClick={handleSaveServices}>
                  <FiSave /> Save & Publish Live
                </button>
              </div>
            )}
          </div>
        </header>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-view">
            {/* Stat Cards */}
            <div className="stat-cards-grid">
              <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('contacts')}>
                <div className="stat-icon new-icon">
                  <FiInbox />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Total Inquiries</span>
                  <span className="stat-value">{contacts.length}</span>
                </div>
              </div>

              <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('contacts')}>
                <div className="stat-icon alert-icon">
                  <FiAlertCircle />
                </div>
                <div className="stat-info">
                  <span className="stat-label">New Unread Contacts</span>
                  <span className="stat-value">{newCount}</span>
                </div>
              </div>

              <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('users')}>
                <div className="stat-icon users-icon">
                  <FiUsers />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Registered Website Users</span>
                  <span className="stat-value">{users.length}</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon users-icon">
                  <FiUsers />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Registered Users</span>
                  <span className="stat-value">{users.length}</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon services-icon">
                  <FiLayers />
                </div>
                <div className="stat-info">
                  <span className="stat-label">In Progress</span>
                  <span className="stat-value">{inProgressCount}</span>
                </div>
              </div>
            </div>

            {/* Quick Recent Submissions & Registered Users Grid */}
            <div className="dashboard-split-grid">
              <div className="dash-section-card">
                <div className="section-card-header">
                  <h3>Recent Client Inquiries</h3>
                  <button className="text-link-btn" onClick={() => setActiveTab('contacts')}>
                    View All <FiArrowRight />
                  </button>
                </div>

                <div className="recent-contacts-list">
                  {contacts.slice(0, 5).map((contact) => (
                    <div key={contact.id} className="recent-contact-item" onClick={() => { setSelectedContact(contact); setActiveTab('contacts'); }}>
                      <div className="contact-item-left">
                        <div className="user-avatar">
                          {contact.fullName ? contact.fullName.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div className="user-meta">
                          <h4>{contact.fullName || 'Anonymous Client'}</h4>
                          <p>{contact.subject || contact.message}</p>
                        </div>
                      </div>
                      <div className="contact-item-right">
                        <span className={`status-badge ${contact.status ? contact.status.toLowerCase().replace(' ', '-') : 'new'}`}>
                          {contact.status || 'New'}
                        </span>
                        <span className="item-date">{new Date(contact.date || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}

                  {contacts.length === 0 && (
                    <p style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>
                      No contact submissions in database.
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Registered Users Summary */}
              <div className="dash-section-card">
                <div className="section-card-header">
                  <h3>New Registered Users</h3>
                  <button className="text-link-btn" onClick={() => setActiveTab('users')}>
                    View All <FiArrowRight />
                  </button>
                </div>

                <div className="recent-contacts-list">
                  {users.slice(0, 5).map((u) => (
                    <div key={u.id} className="recent-contact-item" onClick={() => setActiveTab('users')}>
                      <div className="contact-item-left">
                        <div className="user-avatar" style={{ background: '#193563' }}>
                          {u.name ? u.name.charAt(0).toUpperCase() : <FiUser />}
                        </div>
                        <div className="user-meta">
                          <h4>{u.name || 'Registered Member'}</h4>
                          <p>{u.email}</p>
                        </div>
                      </div>
                      <div className="contact-item-right">
                        <span className="status-badge resolved">Active</span>
                      </div>
                    </div>
                  ))}

                  {users.length === 0 && (
                    <p style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>
                      No registered users in database.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INCOMING CONTACTS MANAGER */}
        {activeTab === 'contacts' && (
          <div className="contacts-view">
            {/* Filter & Search Bar */}
            <div className="table-controls-bar">
              <div className="filter-tabs">
                {['all', 'New', 'In Progress', 'Contacted', 'Resolved'].map((filterKey) => (
                  <button
                    key={filterKey}
                    className={`filter-btn ${contactFilter === filterKey ? 'active' : ''}`}
                    onClick={() => setContactFilter(filterKey)}
                  >
                    {filterKey === 'all' ? 'All Inquiries' : filterKey}
                    <span className="count-pill">
                      {filterKey === 'all'
                        ? contacts.length
                        : contacts.filter(c => c.status === filterKey).length}
                    </span>
                  </button>
                ))}
              </div>

              <div className="search-box">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by client name, email, phone, ID, subject..."
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                />
                {contactSearch && (
                  <button className="clear-search" onClick={() => setContactSearch('')}>
                    <FiX />
                  </button>
                )}
              </div>
            </div>

            {/* Submissions Table */}
            <div className="table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID & Client</th>
                    <th>Contact Info</th>
                    <th>Service & Subject</th>
                    <th>Date Submitted</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className={contact.status === 'New' ? 'row-unread' : ''}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <td>
                        <div className="table-user-flex">
                          <div className="table-avatar">
                            {contact.fullName ? contact.fullName.charAt(0).toUpperCase() : 'C'}
                          </div>
                          <div>
                            <strong>{contact.fullName || 'Anonymous'}</strong>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{contact.id}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
                            <FiMail style={{ color: '#64748b' }} /> {contact.email}
                          </span>
                          {contact.phone && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#64748b' }}>
                              <FiPhone style={{ color: '#64748b' }} /> {contact.phone}
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <span className="status-badge" style={{ background: '#e2e8f0', color: '#334155', textTransform: 'none', display: 'inline-block', width: 'fit-content' }}>
                            {contact.service || 'General'}
                          </span>
                          <strong style={{ fontSize: '0.9rem' }}>{contact.subject}</strong>
                        </div>
                      </td>

                      <td>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                          {new Date(contact.date || Date.now()).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td>
                        <div className="table-status-pills">
                          {['New', 'In Progress', 'Contacted', 'Resolved'].map((st) => {
                            const isCurrent = (contact.status || 'New') === st;
                            const statusKey = st.toLowerCase().replace(' ', '-');
                            return (
                              <button
                                key={st}
                                type="button"
                                title={`Set status to ${st}`}
                                className={`table-status-pill ${statusKey} ${isCurrent ? 'active' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateContactStatus(contact.id, st);
                                }}
                              >
                                {isCurrent && <FiCheck style={{ fontSize: '0.75rem', marginRight: '2px' }} />}
                                {st}
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      <td>
                        <div className="col-actions">
                          <button
                            className="icon-action-btn view-btn"
                            title="View Details"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedContact(contact);
                            }}
                          >
                            <FiEye />
                          </button>
                          <button
                            className="icon-action-btn delete-btn"
                            title="Delete Submission"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteContact(contact.id);
                            }}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredContacts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="empty-table-td">
                        No contact submissions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: REGISTERED USERS */}
        {activeTab === 'users' && (
          <div className="users-view">
            {/* Search Bar */}
            <div className="table-controls-bar">
              <div className="users-summary-pills">
                <div className="summary-pill">
                  <FiUsers className="pill-icon" />
                  <span>{users.length} Total Users</span>
                </div>
              </div>

              <div className="search-box">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search name, email, phone, ID..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
                {userSearch && (
                  <button className="clear-search" onClick={() => setUserSearch('')}>
                    <FiX />
                  </button>
                )}
              </div>
            </div>

            {/* Users Table */}
            <div className="table-card">
              {usersLoading ? (
                <div className="users-loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading registered users...</p>
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>User</th>
                      <th>Email Address</th>
                      <th>Phone Number</th>
                      <th>User ID</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="empty-table-td">
                          {users.length === 0
                            ? 'No registered users found. Users will appear here once they sign up on the platform.'
                            : 'No users matching your search criteria.'}
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u, idx) => (
                        <tr key={u.id}>
                          <td className="col-num">{idx + 1}</td>
                          <td className="col-user">
                            <div className="table-user-flex">
                              <div className="table-avatar user-avatar-gradient">
                                {u.name ? u.name.charAt(0).toUpperCase() : '?'}
                              </div>
                              <span>{u.name || 'Unnamed User'}</span>
                            </div>
                          </td>
                          <td className="col-email">
                            <a href={`mailto:${u.email}`} className="email-link">{u.email || '—'}</a>
                          </td>
                          <td className="col-phone">
                            {u.phone_number ? (
                              <a href={`tel:${u.phone_number}`} className="phone-link">{u.phone_number}</a>
                            ) : (
                              <span className="no-data">Not provided</span>
                            )}
                          </td>
                          <td className="col-id">
                            <code className="user-id-code">{u.id ? u.id.slice(0, 8) + '...' : '—'}</code>
                          </td>
                          <td className="col-actions">
                            <button
                              className="icon-action-btn view-btn"
                              title="View User Details"
                              onClick={() => setSelectedUser(u)}
                            >
                              <FiEye />
                            </button>
                            <button
                              className="icon-action-btn delete-btn"
                              title="Delete User Profile"
                              onClick={() => handleDeleteUser(u.id)}
                            >
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Selected User Modal */}
            {selectedUser && (
              <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
                <div className="contact-modal-card user-modal-card" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header user-modal-header">
                    <div>
                      <h2>User Profile</h2>
                      <p>Registered platform user details</p>
                    </div>
                    <button className="modal-close" onClick={() => setSelectedUser(null)}>
                      <FiX />
                    </button>
                  </div>

                  <div className="modal-body">
                    <div className="user-profile-header">
                      <div className="user-profile-avatar">
                        {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div className="user-profile-name">
                        <h3>{selectedUser.name || 'Unnamed User'}</h3>
                        <span className="user-role-badge">Registered User</span>
                      </div>
                    </div>

                    <div className="modal-info-grid">
                      <div className="modal-info-item">
                        <label><FiMail /> Email Address</label>
                        <div>
                          <a href={`mailto:${selectedUser.email}`}>{selectedUser.email || '—'}</a>
                        </div>
                      </div>

                      <div className="modal-info-item">
                        <label><FiPhone /> Phone Number</label>
                        <div>
                          {selectedUser.phone_number ? (
                            <a href={`tel:${selectedUser.phone_number}`}>{selectedUser.phone_number}</a>
                          ) : (
                            <span className="no-data">Not provided</span>
                          )}
                        </div>
                      </div>

                      <div className="modal-info-item full-width">
                        <label><FiHash /> User ID</label>
                        <div>
                          <code className="user-id-code-full">{selectedUser.id}</code>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button className="btn-secondary" onClick={() => setSelectedUser(null)}>
                      Close
                    </button>
                    <button className="btn-danger" onClick={() => handleDeleteUser(selectedUser.id)}>
                      <FiTrash2 /> Delete User
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: LOCATION x SERVICE SEO MANAGER */}
        {activeTab === 'seo' && (
          <SeoManager triggerToast={triggerToast} />
        )}

        {/* TAB 5: DYNAMIC SITEMAP MANAGER */}
        {activeTab === 'sitemap' && (
          <SeoManager triggerToast={triggerToast} initialSubTab="sitemap" />
        )}

        {/* Submission Details Modal */}
        {selectedContact && (
          <div className="modal-overlay" onClick={() => setSelectedContact(null)}>
            <div className="contact-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h2>{selectedContact.subject || 'Inquiry Details'}</h2>
                  <p>Tracking ID: <strong>{selectedContact.id}</strong> • Submitted: {new Date(selectedContact.date || Date.now()).toLocaleString()}</p>
                </div>
                <button className="modal-close" onClick={() => setSelectedContact(null)}>
                  <FiX />
                </button>
              </div>

              <div className="modal-body">
                <div className="modal-info-grid">
                  <div className="modal-info-item">
                    <label><FiUser /> Full Name</label>
                    <div>{selectedContact.fullName || 'N/A'}</div>
                  </div>

                  <div className="modal-info-item">
                    <label><FiMail /> Email Address</label>
                    <div>
                      <a href={`mailto:${selectedContact.email}`} style={{ color: '#0284c7', textDecoration: 'none' }}>
                        {selectedContact.email}
                      </a>
                    </div>
                  </div>

                  <div className="modal-info-item">
                    <label><FiPhone /> Phone Number</label>
                    <div>
                      {selectedContact.phone ? (
                        <a href={`tel:${selectedContact.phone}`} style={{ color: '#0284c7', textDecoration: 'none' }}>
                          {selectedContact.phone}
                        </a>
                      ) : 'Not Provided'}
                    </div>
                  </div>

                  <div className="modal-info-item">
                    <label><FiInbox /> Service Area</label>
                    <div>
                      <span className="status-badge" style={{ background: '#e2e8f0', color: '#334155', textTransform: 'none' }}>
                        {selectedContact.service || 'General'}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>
                    Client Requirement Message
                  </label>
                  <div className="modal-message-box">
                    <p style={{ whiteSpace: 'pre-wrap', margin: 0, fontSize: '0.95rem', lineHeight: '1.6', color: '#1e293b' }}>
                      {selectedContact.message}
                    </p>
                  </div>
                </div>

                {/* Quick 1-Click Status Action Buttons */}
                <div className="modal-status-section">
                  <div className="status-section-header">
                    <span className="status-section-title">Change Inquiry Status:</span>
                    <button
                      className="delete-action-btn"
                      onClick={() => handleDeleteContact(selectedContact.id)}
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>

                  <div className="status-btn-group">
                    {['New', 'In Progress', 'Contacted', 'Resolved'].map((st) => {
                      const isCurrent = (selectedContact.status || 'New') === st;
                      const statusKey = st.toLowerCase().replace(' ', '-');
                      return (
                        <button
                          key={st}
                          type="button"
                          className={`modal-status-btn ${statusKey} ${isCurrent ? 'active' : ''}`}
                          onClick={() => handleUpdateContactStatus(selectedContact.id, st)}
                        >
                          {isCurrent && <FiCheck className="btn-check-icon" />}
                          {st}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        type={confirmModal.type}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
