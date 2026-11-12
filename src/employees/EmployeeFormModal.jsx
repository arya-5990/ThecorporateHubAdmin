import { useEffect, useState } from 'react';
import { FiX, FiSave, FiUpload, FiTrash2, FiLoader } from 'react-icons/fi';
import { MAX_PHOTO_BYTES, ALLOWED_PHOTO_TYPES, optimizedUrl } from './cloudinary';

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
  // image = saved / pasted URL, imageFile = new photo picked from the computer
  const [image, setImage] = useState(employee?.image || '');
  const [imageFile, setImageFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Release the local preview URL when it is replaced or the modal closes
  useEffect(() => {
    if (!filePreview) return undefined;
    return () => URL.revokeObjectURL(filePreview);
  }, [filePreview]);

  const pickFile = (file) => {
    setImageFile(file);
    setFilePreview(file ? URL.createObjectURL(file) : '');
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    e.target.value = ''; // allow picking the same file again
    if (!file) return;
    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      setError('Please choose a JPG, PNG or WEBP image.');
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setError(`Image is too large. Maximum size is ${MAX_PHOTO_BYTES / (1024 * 1024)} MB.`);
      return;
    }
    pickFile(file);
    setError('');
  };

  const handleUrlChange = (value) => {
    pickFile(null);
    setImage(value);
  };

  const removePhoto = () => {
    pickFile(null);
    setImage('');
  };

  const handleClose = () => {
    if (!saving) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    if (!name.trim() || !designation.trim()) {
      setError('Name and designation are required.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await onSave(
        {
          name: name.trim(),
          designation: designation.trim(),
          experience: experience.trim(),
          description: description.trim(),
          responsibilities: responsibilities
            .split('\n')
            .map((r) => r.trim())
            .filter(Boolean),
          image: image.trim()
        },
        imageFile
      );
    } catch (err) {
      setError(err?.message || 'Could not save the employee. Please try again.');
      setSaving(false);
    }
  };

  const previewSrc = filePreview || optimizedUrl(image, 200, 200);
  const hasPhoto = Boolean(filePreview || image);

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="contact-modal-card emp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{isEdit ? 'Edit employee' : 'Add employee'}</h2>
            <p>This card appears in the team section of the main website.</p>
          </div>
          <button type="button" className="modal-close" onClick={handleClose} disabled={saving}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <fieldset className="modal-body emp-form" disabled={saving}>
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
                  {hasPhoto ? <img src={previewSrc} alt="Preview" /> : <span>No photo</span>}
                </div>
                <div className="emp-image-inputs">
                  <div className="emp-image-buttons">
                    <label className="emp-upload-btn">
                      <FiUpload /> {hasPhoto ? 'Replace image' : 'Upload image'}
                      <input
                        type="file"
                        accept={ALLOWED_PHOTO_TYPES.join(',')}
                        onChange={handleFile}
                        hidden
                      />
                    </label>
                    {hasPhoto && (
                      <button type="button" className="emp-remove-photo-btn" onClick={removePhoto}>
                        <FiTrash2 /> Remove
                      </button>
                    )}
                  </div>
                  {imageFile ? (
                    <div className="emp-image-hint">
                      {imageFile.name} will be uploaded to Cloudinary when you save.
                    </div>
                  ) : (
                    <input
                      value={image}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      placeholder="or paste an image URL (https://...)"
                    />
                  )}
                  <div className="emp-image-hint">JPG, PNG or WEBP, up to 5 MB.</div>
                </div>
              </div>
            </div>

            {error && <div className="emp-error">{error}</div>}
          </fieldset>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={handleClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? (
                <>
                  <FiLoader className="spin-icon" /> {imageFile ? 'Uploading...' : 'Saving...'}
                </>
              ) : (
                <>
                  <FiSave /> {isEdit ? 'Save changes' : 'Add employee'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
