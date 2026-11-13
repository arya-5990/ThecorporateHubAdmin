import { useEffect, useState } from 'react';
import {
  FiPlus, FiSearch, FiX, FiEdit2, FiTrash2, FiCheck, FiUser,
  FiEye, FiEyeOff, FiArrowUp, FiArrowDown, FiRefreshCw, FiAlertTriangle, FiLoader
} from 'react-icons/fi';
import ConfirmModal from '../ConfirmModal';
import EmployeeFormModal from './EmployeeFormModal';
import { optimizedUrl } from './cloudinary';
import {
  isBackendConfigured,
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  setEmployeeActive,
  updateSortOrders
} from './employeeService';
import './Employees.css';

// Demo data shown (read-only) when Supabase is not configured.
// Same fields as the "Our Team" cards on the main website.
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
    ],
    sortOrder: 1,
    isActive: true
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
    ],
    sortOrder: 2,
    isActive: true
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
    ],
    sortOrder: 3,
    isActive: true
  }
];

const DEMO_MODE = !isBackendConfigured();

// "Aarav Shah" -> "AS"
const getInitials = (name) =>
  (name || '')
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0))
    .join('')
    .slice(0, 3)
    .toUpperCase();

const errorMessage = (err, fallback) => err?.message || fallback;

export default function EmployeeManager({ triggerToast }) {
  const [employees, setEmployees] = useState(DEMO_MODE ? SAMPLE_EMPLOYEES : []);
  const [loading, setLoading] = useState(!DEMO_MODE);
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [busyId, setBusyId] = useState(null); // card with a pending toggle / reorder / delete
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = adding new
  const [confirm, setConfirm] = useState({ isOpen: false, employee: null });

  // Load employees from Supabase
  useEffect(() => {
    if (DEMO_MODE) return undefined;
    let cancelled = false;
    fetchEmployees()
      .then((list) => {
        if (!cancelled) setEmployees(list);
      })
      .catch((err) => {
        console.error('Error loading employees from Supabase', err);
        if (!cancelled) setLoadError(errorMessage(err, 'Could not load employees.'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const reload = () => {
    setLoading(true);
    setLoadError('');
    setReloadKey((k) => k + 1);
  };

  const q = search.trim().toLowerCase();
  const filtered = employees.filter(
    (e) => !q || e.name.toLowerCase().includes(q) || e.designation.toLowerCase().includes(q)
  );
  const hiddenCount = employees.filter((e) => !e.isActive).length;

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (employee) => {
    setEditing(employee);
    setFormOpen(true);
  };

  // Called by the form; throwing keeps the form open and shows the error there
  const handleSave = async (data, imageFile) => {
    if (editing) {
      const updated = await updateEmployee(editing, data, imageFile);
      setEmployees((list) => list.map((e) => (e.id === updated.id ? updated : e)));
      triggerToast('Employee updated successfully.');
    } else {
      const nextOrder = employees.reduce((max, e) => Math.max(max, e.sortOrder), 0) + 1;
      const created = await createEmployee(data, imageFile, nextOrder);
      setEmployees((list) => [...list, created]);
      triggerToast('Employee added successfully.');
    }
    setFormOpen(false);
  };

  const handleDelete = async () => {
    const target = confirm.employee;
    setConfirm({ isOpen: false, employee: null });
    setBusyId(target.id);
    try {
      await deleteEmployee(target);
      setEmployees((list) => list.filter((e) => e.id !== target.id));
      triggerToast(`${target.name} removed.`, 'info');
    } catch (err) {
      triggerToast(`Failed to delete: ${errorMessage(err, 'unknown error')}`, 'error');
    } finally {
      setBusyId(null);
    }
  };

  const toggleActive = async (employee) => {
    setBusyId(employee.id);
    try {
      const updated = await setEmployeeActive(employee.id, !employee.isActive);
      setEmployees((list) => list.map((e) => (e.id === updated.id ? updated : e)));
      triggerToast(
        updated.isActive ? `${updated.name} is now visible on the website.` : `${updated.name} is now hidden from the website.`,
        'info'
      );
    } catch (err) {
      triggerToast(`Failed to update visibility: ${errorMessage(err, 'unknown error')}`, 'error');
    } finally {
      setBusyId(null);
    }
  };

  // Swap with the neighbour and renumber 1..n (optimistic, rolled back on failure)
  const move = async (employee, direction) => {
    const index = employees.findIndex((e) => e.id === employee.id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= employees.length) return;

    const previous = employees;
    const reordered = [...employees];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    const renumbered = reordered.map((e, i) => ({ ...e, sortOrder: i + 1 }));
    const changed = renumbered.filter(
      (e) => previous.find((p) => p.id === e.id).sortOrder !== e.sortOrder
    );

    setEmployees(renumbered);
    setBusyId(employee.id);
    try {
      await updateSortOrders(changed.map(({ id, sortOrder }) => ({ id, sortOrder })));
    } catch (err) {
      setEmployees(previous);
      triggerToast(`Failed to reorder: ${errorMessage(err, 'unknown error')}`, 'error');
    } finally {
      setBusyId(null);
    }
  };

  const actionsDisabled = DEMO_MODE || busyId !== null;
  const reorderDisabled = actionsDisabled || Boolean(q); // positions are ambiguous while filtering

  return (
    <div className="employees-view">
      {DEMO_MODE && (
        <div className="emp-notice">
          <FiAlertTriangle /> Supabase is not configured, so sample employees are shown and changes are disabled.
        </div>
      )}

      <div className="table-controls-bar">
        <button className="save-btn" onClick={openAdd} disabled={DEMO_MODE || loading || Boolean(loadError)}>
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

      {!loading && !loadError && employees.length > 0 && (
        <div className="emp-summary">
          {employees.length} employee{employees.length === 1 ? '' : 's'}
          {hiddenCount > 0 && ` · ${hiddenCount} hidden from the website`}
        </div>
      )}

      {loading ? (
        <div className="emp-empty">
          <FiLoader className="spin-icon" /> Loading employees...
        </div>
      ) : loadError ? (
        <div className="emp-empty emp-load-error">
          <p>Could not load employees: {loadError}</p>
          <button className="emp-btn emp-retry-btn" onClick={reload}>
            <FiRefreshCw /> Try again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="emp-empty">
          {employees.length === 0
            ? 'No employees yet. Click "Add employee" to create the first card.'
            : 'No employees match your search.'}
        </div>
      ) : (
        <div className="emp-grid">
          {filtered.map((emp) => {
            const position = employees.findIndex((e) => e.id === emp.id);
            const isBusy = busyId === emp.id;
            return (
              <div key={emp.id} className={`emp-card ${emp.isActive ? '' : 'emp-card-hidden'}`}>
                <div className="emp-photo">
                  {emp.image ? (
                    <img src={optimizedUrl(emp.image)} alt={emp.name} loading="lazy" />
                  ) : (
                    <div className="emp-photo-placeholder">
                      <FiUser />
                    </div>
                  )}
                  {!emp.isActive && (
                    <span className="emp-hidden-badge">
                      <FiEyeOff /> Hidden
                    </span>
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
                  <button className="emp-btn" onClick={() => openEdit(emp)} disabled={actionsDisabled}>
                    {isBusy ? <FiLoader className="spin-icon" /> : <FiEdit2 />} Edit
                  </button>
                  <button
                    className="emp-btn emp-btn-icon"
                    title={emp.isActive ? 'Hide from website' : 'Show on website'}
                    onClick={() => toggleActive(emp)}
                    disabled={actionsDisabled}
                  >
                    {emp.isActive ? <FiEye /> : <FiEyeOff />}
                  </button>
                  <button
                    className="emp-btn emp-btn-icon"
                    title="Move earlier"
                    onClick={() => move(emp, -1)}
                    disabled={reorderDisabled || position === 0}
                  >
                    <FiArrowUp />
                  </button>
                  <button
                    className="emp-btn emp-btn-icon"
                    title="Move later"
                    onClick={() => move(emp, 1)}
                    disabled={reorderDisabled || position === employees.length - 1}
                  >
                    <FiArrowDown />
                  </button>
                  <button
                    className="emp-btn emp-btn-icon emp-btn-delete"
                    title="Delete employee"
                    onClick={() => setConfirm({ isOpen: true, employee: emp })}
                    disabled={actionsDisabled}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            );
          })}
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
        message={`Remove ${confirm.employee ? confirm.employee.name : 'this employee'} from the team? This also deletes their photo and cannot be undone.`}
        confirmText="Yes, Delete"
        type="danger"
        onConfirm={handleDelete}
        onCancel={() => setConfirm({ isOpen: false, employee: null })}
      />
    </div>
  );
}
