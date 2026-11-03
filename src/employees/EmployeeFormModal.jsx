import React, { useState } from 'react';
import { FiX, FiSave, FiUpload } from 'react-icons/fi';

export default function EmployeeFormModal({ employee, onSave, onClose }) {
  const isEdit = Boolean(employee);

  const [name, setName] = useState(employee?.name || '');
  const [designation, setDesignation] = useState(employee?.designation || '');
  const [experience, setExperience] = useState(employee?.experience || '');
  const [description, setDescription] = useState(employee?.description || '');
  // one responsibility per line
  const [responsibilities, setResponsibilities] = useState(
    employee ? employee.responsibilities.join('\n') : ''
  );
  const [image, setImage] = useState(employee?.image || '');
  const [error, setError] = useState('');

  // Upload an image from the computer and show it as a preview
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (JPG, PNG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !designation.trim()) {
      setError('Name and designation are required.');
      return;
    }
    onSave({
      name: name.trim(),
      designation: designation.trim(),
      experience: experience.trim(),
      description: description.trim(),
      responsibilities: responsibilities
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean),
      image: image.trim()
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="contact-modal-card emp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{isEdit ? 'Edit employee' : 'Add employee'}</h2>
            <p>This card appears in the team section of the main website.</p>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body emp-form">
            <div className="emp-form-row">
              <div className="form-group">
                <label>Name *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aarav Shah" />
              </div>
              <div className="form-group">
                <label>Designation *</label>
                <input
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Senior Accounts Executive"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Experience</label>
              <input
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="e.g. 5+ Years Experience"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short introduction shown under the name"
              />
            </div>

            <div className="form-group">
              <label>Responsibilities (one per line)</label>
              <textarea
                rows={6}
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                placeholder={'Accounting & Bookkeeping\nGST Compliance\nFinancial Reporting'}
              />
            </div>

            <div className="form-group">
              <label>Photo</label>
              <div className="emp-image-row">
                <div className="emp-image-preview">
                  {image ? <img src={image} alt="Preview" /> : <span>No photo</span>}
                </div>
                <div className="emp-image-inputs">
                  <label className="emp-upload-btn">
                    <FiUpload /> Upload image
                    <input type="file" accept="image/*" onChange={handleFile} hidden />
                  </label>
                  <input
                    value={image.startsWith('data:') ? '' : image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="or paste an image URL (https://...)"
                  />
                </div>
              </div>
            </div>

            {error && <div className="emp-error">{error}</div>}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              <FiSave /> {isEdit ? 'Save changes' : 'Add employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}