import React, { useState, useEffect } from 'react';
import './App.css';
// CMS Disabled - commented out servicesData import
// import { servicesData as defaultServicesData } from './data/servicesData';
import {
  FiGrid,
  FiInbox,
  FiEdit3,
  FiSearch,
  FiCheckCircle,
  FiClock,
  FiTrash2,
  FiSave,
  FiRefreshCw,
  FiPlus,
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
  FiAlertCircle
} from 'react-icons/fi';
import { IoDocumentOutline } from 'react-icons/io5';
import { LuBrain } from 'react-icons/lu';
import { MdAttachMoney } from 'react-icons/md';
import { GrGroup } from 'react-icons/gr';
import { BsGraphUpArrow } from 'react-icons/bs';
import { RiCertificate2Line } from 'react-icons/ri';

// Initial Mock Contacts if LocalStorage is Empty
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
  },
  {
    id: "SUB-610482",
    fullName: "Marcus Sterling",
    email: "marcus@sterlingfintech.io",
    phone: "+1 (555) 345-6789",
    service: "accounting-taxation",
    subject: "Annual Corporate Tax & Virtual CFO Retainer",
    message: "Requesting a quote for monthly bookkeeping, GSTR-1 & 3B filings, and quarterly advance tax audit representation for our fintech entity.",
    date: "Aug 10, 2026, 05:30 PM",
    status: "Contacted"
  },
  {
    id: "SUB-509312",
    fullName: "Elena Rostova",
    email: "elena@globaltrade.de",
    phone: "+49 30 123456",
    service: "licenses-certifications",
    subject: "Import Export Code (IEC) & ISO 9001 Certification",
    message: "Expanding our European distribution branch into domestic markets. Need rapid IEC code allotment and ISO quality accreditation.",
    date: "Aug 09, 2026, 04:10 PM",
    status: "Resolved"
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'contacts' | 'editor'

  // Contacts State
  const [contacts, setContacts] = useState([]);
  const [contactFilter, setContactFilter] = useState('all');
  const [contactSearch, setContactSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);

  // CMS Disabled - Services Accordion State
  // const [services, setServices] = useState(defaultServicesData);
  // const [selectedSlug, setSelectedSlug] = useState('business-registration');
  // const [editorSection, setEditorSection] = useState('about'); // 'about' | 'servicesWeProvide' | 'onClickServices' | 'terms'

  // Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Load Contacts & Services from LocalStorage
  useEffect(() => {
    // Load Contacts
    try {
      const savedContacts = localStorage.getItem('corporate_hub_contact_submissions');
      if (savedContacts) {
        setContacts(JSON.parse(savedContacts));
      } else {
        setContacts(INITIAL_CONTACTS);
        localStorage.setItem('corporate_hub_contact_submissions', JSON.stringify(INITIAL_CONTACTS));
      }
    } catch (e) {
      console.error("Error loading contacts from localStorage", e);
      setContacts(INITIAL_CONTACTS);
    }

    // CMS Disabled - Load Services from LocalStorage
    /*
    try {
      const savedServices = localStorage.getItem('corporate_hub_services_data');
      if (savedServices) {
        setServices(JSON.parse(savedServices));
      }
    } catch (e) {
      console.error("Error loading services data from localStorage", e);
    }
    */
  }, []);

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  // Contact Handlers
  const handleUpdateContactStatus = (id, newStatus) => {
    const updated = contacts.map(c => c.id === id ? { ...c, status: newStatus } : c);
    setContacts(updated);
    localStorage.setItem('corporate_hub_contact_submissions', JSON.stringify(updated));
    if (selectedContact && selectedContact.id === id) {
      setSelectedContact({ ...selectedContact, status: newStatus });
    }
    triggerToast(`Inquiry ${id} status updated to ${newStatus}`);
  };

  const handleDeleteContact = (id) => {
    if (window.confirm("Are you sure you want to delete this submission?")) {
      const updated = contacts.filter(c => c.id !== id);
      setContacts(updated);
      localStorage.setItem('corporate_hub_contact_submissions', JSON.stringify(updated));
      if (selectedContact && selectedContact.id === id) {
        setSelectedContact(null);
      }
      triggerToast(`Inquiry ${id} deleted successfully.`, 'info');
    }
  };

  /*
  // CMS Disabled - Service Accordion Data Handlers
  const activeService = services.find(s => s.slug === selectedSlug) || services[0];

  const updateActiveServiceField = (path, value) => {
    const updatedServices = services.map(s => {
      if (s.slug !== selectedSlug) return s;
      
      const newService = JSON.parse(JSON.stringify(s));
      if (path === 'title') newService.title = value;
      else if (path === 'shortDescription') newService.shortDescription = value;
      else if (path === 'about.title') newService.accordionData.about.title = value;
      else if (path === 'about.content') newService.accordionData.about.content = value;
      else if (path === 'servicesWeProvide.title') newService.accordionData.servicesWeProvide.title = value;
      else if (path === 'onClickServices.title') newService.accordionData.onClickServices.title = value;
      else if (path === 'termsAndConditions.title') newService.accordionData.termsAndConditions.title = value;
      
      return newService;
    });

    setServices(updatedServices);
  };

  const handleProvideCardChange = (idx, field, val) => {
    const updatedServices = services.map(s => {
      if (s.slug !== selectedSlug) return s;
      const newService = JSON.parse(JSON.stringify(s));
      newService.accordionData.servicesWeProvide.items[idx][field] = val;
      return newService;
    });
    setServices(updatedServices);
  };

  const handleAddProvideCard = () => {
    const updatedServices = services.map(s => {
      if (s.slug !== selectedSlug) return s;
      const newService = JSON.parse(JSON.stringify(s));
      newService.accordionData.servicesWeProvide.items.push({
        name: "New Service Provision",
        desc: "Detailed description of the newly offered service feature."
      });
      return newService;
    });
    setServices(updatedServices);
    triggerToast("Added new service provision item.");
  };

  const handleDeleteProvideCard = (idx) => {
    const updatedServices = services.map(s => {
      if (s.slug !== selectedSlug) return s;
      const newService = JSON.parse(JSON.stringify(s));
      newService.accordionData.servicesWeProvide.items.splice(idx, 1);
      return newService;
    });
    setServices(updatedServices);
    triggerToast("Service provision item removed.", "info");
  };

  const handleSubServiceChange = (subId, field, val) => {
    const updatedServices = services.map(s => {
      if (s.slug !== selectedSlug) return s;
      const newService = JSON.parse(JSON.stringify(s));
      const sub = newService.accordionData.onClickServices.subServices.find(subItem => subItem.id === subId);
      if (sub) {
        sub[field] = val;
      }
      return newService;
    });
    setServices(updatedServices);
  };

  const handleSubServiceListArrayChange = (subId, listField, idx, val) => {
    const updatedServices = services.map(s => {
      if (s.slug !== selectedSlug) return s;
      const newService = JSON.parse(JSON.stringify(s));
      const sub = newService.accordionData.onClickServices.subServices.find(subItem => subItem.id === subId);
      if (sub && sub[listField]) {
        sub[listField][idx] = val;
      }
      return newService;
    });
    setServices(updatedServices);
  };

  const handleAddSubServiceArrayItem = (subId, listField) => {
    const updatedServices = services.map(s => {
      if (s.slug !== selectedSlug) return s;
      const newService = JSON.parse(JSON.stringify(s));
      const sub = newService.accordionData.onClickServices.subServices.find(subItem => subItem.id === subId);
      if (sub) {
        sub[listField].push(listField === 'process' ? 'New Process Step' : 'New Document Item');
      }
      return newService;
    });
    setServices(updatedServices);
  };

  const handleDeleteSubServiceArrayItem = (subId, listField, idx) => {
    const updatedServices = services.map(s => {
      if (s.slug !== selectedSlug) return s;
      const newService = JSON.parse(JSON.stringify(s));
      const sub = newService.accordionData.onClickServices.subServices.find(subItem => subItem.id === subId);
      if (sub && sub[listField]) {
        sub[listField].splice(idx, 1);
      }
      return newService;
    });
    setServices(updatedServices);
  };

  const handleAddSubService = () => {
    const updatedServices = services.map(s => {
      if (s.slug !== selectedSlug) return s;
      const newService = JSON.parse(JSON.stringify(s));
      const newId = "sub-" + Date.now().toString().slice(-4);
      newService.accordionData.onClickServices.subServices.push({
        id: newId,
        name: "New Sub-Service Registration",
        tagline: "Brief catchphrase or eligibility summary",
        process: ["Step 1: Document Filing", "Step 2: Approval & Certificate"],
        turnaround: "3 - 5 Business Days",
        documentsNeeded: ["Government ID Proof", "Address Verification"]
      });
      return newService;
    });
    setServices(updatedServices);
    triggerToast("Added new sub-service accordion card.");
  };

  const handleDeleteSubService = (subId) => {
    const updatedServices = services.map(s => {
      if (s.slug !== selectedSlug) return s;
      const newService = JSON.parse(JSON.stringify(s));
      newService.accordionData.onClickServices.subServices = newService.accordionData.onClickServices.subServices.filter(sub => sub.id !== subId);
      return newService;
    });
    setServices(updatedServices);
    triggerToast("Sub-service card removed.", "info");
  };

  const handleTermChange = (idx, val) => {
    const updatedServices = services.map(s => {
      if (s.slug !== selectedSlug) return s;
      const newService = JSON.parse(JSON.stringify(s));
      newService.accordionData.termsAndConditions.items[idx] = val;
      return newService;
    });
    setServices(updatedServices);
  };

  const handleAddTerm = () => {
    const updatedServices = services.map(s => {
      if (s.slug !== selectedSlug) return s;
      const newService = JSON.parse(JSON.stringify(s));
      newService.accordionData.termsAndConditions.items.push("New statutory policy or fee condition.");
      return newService;
    });
    setServices(updatedServices);
  };

  const handleDeleteTerm = (idx) => {
    const updatedServices = services.map(s => {
      if (s.slug !== selectedSlug) return s;
      const newService = JSON.parse(JSON.stringify(s));
      newService.accordionData.termsAndConditions.items.splice(idx, 1);
      return newService;
    });
    setServices(updatedServices);
  };

  const handleSaveServices = () => {
    try {
      localStorage.setItem('corporate_hub_services_data', JSON.stringify(services));
      triggerToast("Service Accordion data saved & live synced successfully!");
    } catch (e) {
      console.error("Save error", e);
      triggerToast("Error saving data.", "error");
    }
  };

  const handleResetServices = () => {
    if (window.confirm("Reset all services data back to defaults?")) {
      localStorage.removeItem('corporate_hub_services_data');
      setServices(defaultServicesData);
      triggerToast("Services data restored to factory defaults.", "info");
    }
  };
  */

  // Filtered Contacts
  const filteredContacts = contacts.filter(c => {
    const matchesFilter = contactFilter === 'all' || c.status === contactFilter;
    const searchLower = contactSearch.toLowerCase();
    const matchesSearch = !contactSearch ||
      c.fullName.toLowerCase().includes(searchLower) ||
      c.email.toLowerCase().includes(searchLower) ||
      c.phone.toLowerCase().includes(searchLower) ||
      c.subject.toLowerCase().includes(searchLower) ||
      c.id.toLowerCase().includes(searchLower);
    return matchesFilter && matchesSearch;
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

          {/* CMS Disabled - Service Accordion Editor Nav Button
          <button
            className={`nav-btn ${activeTab === 'editor' ? 'active' : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            <FiEdit3 /> Service Accordion Editor
          </button>
          */}
        </nav>

        <div className="sidebar-footer">
          <div className="live-status">
            <span className="pulse-dot"></span>
            <span>Live Sync Active</span>
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
              {/* {activeTab === 'editor' && 'Service Accordion Data Manager'} */}
            </h1>
            <p className="page-subtitle">
              {activeTab === 'dashboard' && 'Monitor real-time client inquiries and contact status'}
              {activeTab === 'contacts' && 'Watch and manage incoming customer messages submitted from the contact page'}
              {/* {activeTab === 'editor' && 'Live edit content, registration steps, and requirements on ServiceAccordion'} */}
            </p>
          </div>

          <div className="topbar-right">
            {/* CMS Disabled - Topbar Save/Reset Actions
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
            */}
          </div>
        </header>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-view">
            {/* Stat Cards */}
            <div className="stat-cards-grid">
              <div className="stat-card">
                <div className="stat-icon new-icon">
                  <FiInbox />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Total Inquiries</span>
                  <span className="stat-value">{contacts.length}</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon alert-icon">
                  <FiAlertCircle />
                </div>
                <div className="stat-info">
                  <span className="stat-label">New Unread Contacts</span>
                  <span className="stat-value">{newCount}</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon progress-icon">
                  <FiClock />
                </div>
                <div className="stat-info">
                  <span className="stat-label">In Progress</span>
                  <span className="stat-value">{inProgressCount}</span>
                </div>
              </div>

              {/* CMS Disabled - Active Service Categories Stat Card
              <div className="stat-card">
                <div className="stat-icon services-icon">
                  <FiLayers />
                </div>
                <div className="stat-info">
                  <span className="stat-label">Active Service Categories</span>
                  <span className="stat-value">{services.length}</span>
                </div>
              </div>
              */}
            </div>

            {/* Quick Recent Submissions & Service Overview */}
            <div className="dashboard-split-grid">
              {/* Recent Inquiries Preview */}
              <div className="dash-section-card">
                <div className="section-card-header">
                  <h3>Recent Incoming Inquiries</h3>
                  <button className="text-link-btn" onClick={() => setActiveTab('contacts')}>
                    View All <FiArrowRight />
                  </button>
                </div>

                <div className="recent-contacts-list">
                  {contacts.slice(0, 4).map(c => (
                    <div
                      key={c.id}
                      className="recent-contact-item"
                      onClick={() => {
                        setSelectedContact(c);
                        setActiveTab('contacts');
                      }}
                    >
                      <div className="contact-item-left">
                        <div className="user-avatar">{c.fullName.charAt(0)}</div>
                        <div className="user-meta">
                          <h4>{c.fullName}</h4>
                          <p>{c.subject}</p>
                        </div>
                      </div>

                      <div className="contact-item-right">
                        <span className={`status-badge ${c.status.toLowerCase().replace(' ', '-')}`}>
                          {c.status}
                        </span>
                        <span className="item-date">{c.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Categories Overview */}
              {/* CMS Disabled - Configured Accordion Categories Card
              <div className="dash-section-card">
                <div className="section-card-header">
                  <h3>Configured Accordion Categories</h3>
                  <button className="text-link-btn" onClick={() => setActiveTab('editor')}>
                    Manage Services <FiEdit3 />
                  </button>
                </div>

                <div className="services-summary-list">
                  {services.map(s => (
                    <div
                      key={s.slug}
                      className="service-summary-item"
                      onClick={() => {
                        setSelectedSlug(s.slug);
                        setActiveTab('editor');
                      }}
                    >
                      <div className="service-item-info">
                        <h4>{s.title}</h4>
                        <p>{s.accordionData.onClickServices.subServices.length} Sub-Service Accordions</p>
                      </div>
                      <FiChevronRight className="arrow-icon" />
                    </div>
                  ))}
                </div>
              </div>
              */}
            </div>
          </div>
        )}

        {/* TAB 2: INCOMING CONTACTS */}
        {activeTab === 'contacts' && (
          <div className="contacts-view">
            {/* Filter and Search Bar */}
            <div className="table-controls-bar">
              <div className="filter-tabs">
                {['all', 'New', 'Contacted', 'In Progress', 'Resolved'].map(filter => (
                  <button
                    key={filter}
                    className={`filter-btn ${contactFilter === filter ? 'active' : ''}`}
                    onClick={() => setContactFilter(filter)}
                  >
                    {filter === 'all' ? 'All Inquiries' : filter}
                    {filter === 'New' && newCount > 0 && <span className="count-pill">{newCount}</span>}
                  </button>
                ))}
              </div>

              <div className="search-box">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search name, email, subject, ID..."
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

            {/* Contacts Table */}
            <div className="table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ref ID</th>
                    <th>Client Name</th>
                    <th>Contact Info</th>
                    <th>Inquiry Subject</th>
                    <th>Submitted Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="empty-table-td">
                        No contact inquiries found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredContacts.map(c => (
                      <tr key={c.id} className={c.status === 'New' ? 'row-unread' : ''}>
                        <td className="col-id"><strong>{c.id}</strong></td>
                        <td className="col-user">
                          <div className="table-user-flex">
                            <div className="table-avatar">{c.fullName.charAt(0)}</div>
                            <span>{c.fullName}</span>
                          </div>
                        </td>
                        <td className="col-contact">
                          <div>{c.email}</div>
                          <small>{c.phone}</small>
                        </td>
                        <td className="col-subject">{c.subject}</td>
                        <td className="col-date">{c.date}</td>
                        <td>
                          <select
                            className={`status-select ${c.status.toLowerCase().replace(' ', '-')}`}
                            value={c.status}
                            onChange={(e) => handleUpdateContactStatus(c.id, e.target.value)}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </td>
                        <td className="col-actions">
                          <button
                            className="icon-action-btn view-btn"
                            title="View Full Submission"
                            onClick={() => setSelectedContact(c)}
                          >
                            <FiEye />
                          </button>
                          <button
                            className="icon-action-btn delete-btn"
                            title="Delete Entry"
                            onClick={() => handleDeleteContact(c.id)}
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Selected Contact Modal */}
            {selectedContact && (
              <div className="modal-overlay" onClick={() => setSelectedContact(null)}>
                <div className="contact-modal-card" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <div>
                      <h2>Contact Submission #{selectedContact.id}</h2>
                      <p>Submitted on {selectedContact.date}</p>
                    </div>
                    <button className="modal-close" onClick={() => setSelectedContact(null)}>
                      <FiX />
                    </button>
                  </div>

                  <div className="modal-body">
                    <div className="modal-info-grid">
                      <div className="modal-info-item">
                        <label><FiUser /> Full Name</label>
                        <div>{selectedContact.fullName}</div>
                      </div>

                      <div className="modal-info-item">
                        <label><FiMail /> Email Address</label>
                        <div><a href={`mailto:${selectedContact.email}`}>{selectedContact.email}</a></div>
                      </div>

                      <div className="modal-info-item">
                        <label><FiPhone /> Phone Number</label>
                        <div><a href={`tel:${selectedContact.phone}`}>{selectedContact.phone}</a></div>
                      </div>

                      <div className="modal-info-item">
                        <label><FiSliders /> Status</label>
                        <select
                          className={`status-select ${selectedContact.status.toLowerCase().replace(' ', '-')}`}
                          value={selectedContact.status}
                          onChange={(e) => handleUpdateContactStatus(selectedContact.id, e.target.value)}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>
                    </div>

                    <div className="modal-message-box">
                      <label><FiFileText /> Inquiry Subject</label>
                      <h4 className="modal-subject-text">{selectedContact.subject}</h4>

                      <label style={{ marginTop: '14px', display: 'block' }}>Message Body</label>
                      <p className="modal-message-body">{selectedContact.message}</p>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button className="btn-secondary" onClick={() => setSelectedContact(null)}>
                      Close
                    </button>
                    <button className="btn-danger" onClick={() => handleDeleteContact(selectedContact.id)}>
                      <FiTrash2 /> Delete Record
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CMS Disabled - TAB 3: SERVICE ACCORDION DATA MANAGER
        {activeTab === 'editor' && (
          <div className="editor-view">
            ...
          </div>
        )}
        */}
      </main>
    </div>
  );
}
