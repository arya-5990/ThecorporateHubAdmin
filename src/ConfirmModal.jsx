import React from 'react';
import { FiAlertTriangle, FiX, FiTrash2 } from 'react-icons/fi';

export default function ConfirmModal({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to perform this action? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "danger", // 'danger' | 'warning' | 'primary'
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null;

  const isDanger = type === 'danger';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '460px',
          padding: '28px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          animation: 'scaleUp 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon */}
        <button
          onClick={onCancel}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            color: '#64748b',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          title="Close"
        >
          <FiX />
        </button>

        {/* Top Warning Icon Header */}
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: isDanger ? '#fef2f2' : '#fff7ed',
            color: isDanger ? '#dc2626' : '#ea580c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            marginBottom: '18px',
            border: isDanger ? '1px solid #fecaca' : '1px solid #ffedd5'
          }}
        >
          {isDanger ? <FiTrash2 /> : <FiAlertTriangle />}
        </div>

        {/* Content */}
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.92rem', color: '#475569', margin: '0 0 24px 0', lineHeight: '1.5' }}>
          {message}
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#334155',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              background: isDanger ? '#dc2626' : '#ff6000',
              border: 'none',
              color: '#ffffff',
              padding: '10px 22px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: isDanger ? '0 4px 12px rgba(220, 38, 38, 0.3)' : '0 4px 12px rgba(255, 96, 0, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
