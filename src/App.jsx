import React, { useState, useEffect } from 'react';
import './App.css';
import { supabase } from './supabaseClient';
import {
  FiGrid,
  FiInbox,
  FiUsers,
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
  FiAlertCircle,
  FiArrowRight,
  FiCheck
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
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'contacts' | 'users'

  // Contacts State
  const [contacts, setContacts] = useState([]);
  const [contactFilter, setContactFilter] = useState('all');
  const [contactSearch, setContactSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [loadingContacts, setLoadingContacts] = useState(true);

  // Users State (public.profiles)
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  // Fetch Contacts from Supabase
  const fetchContacts = async () => {
    try {
      setLoadingContacts(true);
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching contact submissions from Supabase:', error);
        const saved = localStorage.getItem('corporate_hub_contact_submissions');
        setContacts(saved ? JSON.parse(saved) : INITIAL_CONTACTS);
      } else if (data) {
        setContacts(data);
      }
    } catch (e) {
      console.error("Error connecting to Supabase contact_submissions", e);
    } finally {
      setLoadingContacts(false);
    }
  };

  // Fetch Registered Users from Supabase (public.profiles)
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) {
        console.error('Error fetching registered profiles from Supabase:', error);
      } else if (data) {
        setUsers(data);
      }
    } catch (e) {
      console.error("Error connecting to Supabase profiles", e);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Initial Load & Realtime Subscriptions
  useEffect(() => {
    fetchContacts();
    fetchUsers();

    // Subscribe to Realtime Contact Submissions
    const contactsChannel = supabase
      .channel('realtime_contacts_admin_v2')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contact_submissions' },
        (payload) => {
          fetchContacts();
          if (payload.eventType === 'INSERT') {
            triggerToast(`🔔 New submission received from ${payload.new.fullName || 'a client'}!`, 'info');
          }
        }
      )
      .subscribe();

    // Subscribe to Realtime Registered User Profiles
    const profilesChannel = supabase
      .channel('realtime_profiles_admin_v2')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          fetchUsers();
          if (payload.eventType === 'INSERT') {
            triggerToast(`🎉 New user account registered: ${payload.new.name || payload.new.email}`, 'info');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(contactsChannel);
      supabase.removeChannel(profilesChannel);
    };
  }, []);

  // Contact Handlers
  const handleUpdateContactStatus = async (id, newStatus) => {
    try {
      const updated = contacts.map(c => c.id === id ? { ...c, status: newStatus } : c);
      setContacts(updated);
      if (selectedContact && selectedContact.id === id) {
        setSelectedContact({ ...selectedContact, status: newStatus });
      }

      const { error } = await supabase
        .from('contact_submissions')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        console.error('Error updating status in Supabase:', error);
        triggerToast(`Failed to update status: ${error.message}`, 'error');
        fetchContacts();
      } else {
        triggerToast(`Inquiry ${id} status updated to ${newStatus}`);
      }
    } catch (e) {
      console.error("Status update error", e);
    }
  };

  const handleDeleteContact = async (id) => {
    if (window.confirm(`Are you sure you want to delete submission ${id}?`)) {
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
          fetchContacts();
        } else {
          triggerToast(`Inquiry ${id} deleted successfully.`, 'info');
        }
      } catch (e) {
        console.error("Delete submission error", e);
      }
    }
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
    const searchLower = userSearch.toLowerCase();
    return !userSearch ||
      (u.name && u.name.toLowerCase().includes(searchLower)) ||
      (u.email && u.email.toLowerCase().includes(searchLower)) ||
      (u.phone_number && u.phone_number.toLowerCase().includes(searchLower)) ||
      (u.id && u.id.toLowerCase().includes(searchLower));
  });

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
            <span className="count-badge">{users.length}</span>
          </button>
        </nav>

        <div className="sidebar-footer">
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
              {activeTab === 'users' && 'Registered Users Directory'}
            </h1>
            <p className="page-subtitle">
              {activeTab === 'dashboard' && 'Monitor real-time client inquiries, contact statuses, and registered users'}
              {activeTab === 'contacts' && 'View, update, and manage customer inquiries submitted from the website contact page'}
              {activeTab === 'users' && 'Directory of all users registered on the website via Supabase Authentication'}
            </p>
          </div>

          <div className="topbar-right">
            <button className="reset-btn" onClick={() => { fetchContacts(); fetchUsers(); triggerToast("Data refreshed from Supabase"); }}>
              <FiRefreshCw /> Sync Data
            </button>
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

              <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('contacts')}>
                <div className="stat-icon progress-icon">
                  <FiClock />
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

        {/* TAB 3: REGISTERED USERS DIRECTORY */}
        {activeTab === 'users' && (
          <div className="users-view">
            {/* Search Toolbar */}
            <div className="table-controls-bar">
              <div className="search-box" style={{ width: '100%' }}>
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search registered users by name, email, phone, or User ID..."
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

            {/* Users Directory Table */}
            <div className="table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User Profile</th>
                    <th>Email Address</th>
                    <th>Phone Number</th>
                    <th>User UUID</th>
                    <th>Account Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="table-user-flex">
                          <div className="user-avatar-circle">
                            {user.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
                          </div>
                          <div>
                            <strong>{user.name || 'Registered Member'}</strong>
                            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Standard Account</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <a href={`mailto:${user.email}`} className="user-email-link">
                          <FiMail /> {user.email}
                        </a>
                      </td>

                      <td>
                        {user.phone_number ? (
                          <a href={`tel:${user.phone_number}`} className="user-phone-link">
                            <FiPhone /> {user.phone_number}
                          </a>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Not Provided</span>
                        )}
                      </td>

                      <td>
                        <code className="uuid-badge">{user.id}</code>
                      </td>

                      <td>
                        <span className="status-badge resolved">
                          Active Member
                        </span>
                      </td>
                    </tr>
                  ))}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="empty-table-td">
                        No registered users found matching search filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
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
    </div>
  );
}
