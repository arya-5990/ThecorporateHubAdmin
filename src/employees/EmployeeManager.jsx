import React, { useState } from 'react';
import { FiPlus, FiSearch, FiX, FiEdit2, FiTrash2, FiCheck, FiUser } from 'react-icons/fi';
import ConfirmModal from '../ConfirmModal';
import EmployeeFormModal from './EmployeeFormModal';
import './employees.css';

// Sample employees (same fields as the "Our Team" cards on the main website)
const SAMPLE_EMPLOYEES = [
  {
    id: 1,
    name: 'employee 1',
    designation: 'Senior Accounts Executive',
    experience: '5+ Years Experience',
    image: '/emp1.png',
    description:
      'With 5+ years of experience, Aarav specializes in accounting operations, financial reporting and bookkeeping, supporting businesses with accurate financial records and compliance.',
    responsibilities: [
      'Accounting & Bookkeeping',
      'Financial Reporting',
      'GST Compliance',
      'Account Reconciliation',
      'Financial Documentation',
      'Business Accounting Support'
    ]
  },
  {
    id: 2,
    name: 'employee 2',
    designation: 'Taxation Executive',
    experience: '4+ Years Experience',
    image: '/emp2.jpg',
    description:
      'With 4+ years of experience, Priya specializes in taxation support, tax return preparation and compliance documentation, assisting clients with their tax-related requirements.',
    responsibilities: [
      'Income Tax Return Preparation',
      'GST Returns & Filings',
      'Tax Documentation',
      'Tax Compliance Support',
      'Financial Record Review',
      'Taxation Assistance'
    ]
  },
  {
    id: 3,
    name: 'employee 3',
    designation: 'Corporate Compliance Executive',
    experience: '4+ Years Experience',
    image: '/emp3.webp',
    description:
      'With 4+ years of experience, Rohan supports corporate compliance, statutory documentation and regulatory filings, helping businesses maintain their compliance requirements.',
    responsibilities: [
      'Corporate Compliance',
      'ROC & MCA Filings',
      'Statutory Documentation',
      'Company Incorporation Support',
      'Annual Compliance',
      'Regulatory Documentation'
    ]
  }
];

// "Aarav Shah" -> "AS"
const getInitials = (name) =>
  (name || '')
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0))
    .join('')
    .slice(0, 3)
    .toUpperCase();

export default function EmployeeManager({ triggerToast }) {
  const [employees, setEmployees] = useState(SAMPLE_EMPLOYEES);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = adding new
  const [confirm, setConfirm] = useState({ isOpen: false, employee: null });

  const filtered = employees.filter((e) => {
    const q = search.toLowerCase();
    return (
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.designation.toLowerCase().includes(q)
    );
  });

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (employee) => {
    setEditing(employee);
    setFormOpen(true);
  };

  const handleSave = (data) => {
    if (editing) {
      setEmployees(employees.map((e) => (e.id === editing.id ? { ...e, ...data } : e)));
      triggerToast('Employee updated successfully.');
    } else {
      setEmployees([...employees, { id: Date.now(), ...data }]);
      triggerToast('Employee added successfully.');
    }
    setFormOpen(false);
  };

  const handleDelete = () => {
    const target = confirm.employee;
    setEmployees(employees.filter((e) => e.id !== target.id));
    setConfirm({ isOpen: false, employee: null });
    triggerToast(`${target.name} removed.`, 'info');
  };

  return (
    <div className="employees-view">
      <div className="table-controls-bar">
        <button className="save-btn" onClick={openAdd}>
          <FiPlus /> Add employee
        </button>

        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-search" onClick={() => setSearch('')}>
              <FiX />
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="emp-empty">
          {employees.length === 0
            ? 'No employees yet. Click "Add employee" to create the first card.'
            : 'No employees match your search.'}
        </div>
      ) : (
        <div className="emp-grid">
          {filtered.map((emp) => (
            <div key={emp.id} className="emp-card">
              <div className="emp-photo">
                {emp.image ? (
                  <img src={emp.image} alt={emp.name} />
                ) : (
                  <div className="emp-photo-placeholder">
                    <FiUser />
                  </div>
                )}
                <span className="emp-initials">{getInitials(emp.name)}</span>
              </div>

              <div className="emp-body">
                <h3 className="emp-name">{emp.name}</h3>
                <div className="emp-designation">{emp.designation}</div>
                {emp.experience && <span className="emp-exp">{emp.experience}</span>}

                <p className="emp-desc">{emp.description}</p>

                {emp.responsibilities.length > 0 && (
                  <div className="emp-expertise">
                    <div className="emp-expertise-label">CORE EXPERTISE</div>
                    <ul>
                      {emp.responsibilities.map((r, i) => (
                        <li key={i}>
                          <FiCheck className="emp-check" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="emp-actions">
                <button className="emp-btn" onClick={() => openEdit(emp)}>
                  <FiEdit2 /> Edit
                </button>
                <button
                  className="emp-btn emp-btn-delete"
                  title="Delete employee"
                  onClick={() => setConfirm({ isOpen: true, employee: emp })}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <EmployeeFormModal
          employee={editing}
          onSave={handleSave}
          onClose={() => setFormOpen(false)}
        />
      )}

      <ConfirmModal
        isOpen={confirm.isOpen}
        title="Delete employee"
        message={`Remove ${confirm.employee ? confirm.employee.name : 'this employee'} from the team? This action cannot be undone.`}
        confirmText="Yes, Delete"
        type="danger"
        onConfirm={handleDelete}
        onCancel={() => setConfirm({ isOpen: false, employee: null })}
      />
    </div>
  );
}