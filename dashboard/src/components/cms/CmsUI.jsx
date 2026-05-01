import { useState } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';

/**
 * Generic modal wrapper
 */
export function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal-box ${wide ? 'modal-wide' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

/**
 * Field wrapper
 */
export function Field({ label, children, hint }) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}

/**
 * Text input
 */
export function Input({ value, onChange, placeholder, type = 'text', ...props }) {
  return (
    <input
      className="cms-input"
      type={type}
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      {...props}
    />
  );
}

/**
 * Textarea
 */
export function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      className="cms-textarea"
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
    />
  );
}

/**
 * Select dropdown
 */
export function Select({ value, onChange, options }) {
  return (
    <select
      className="cms-select"
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

/**
 * Toggle switch
 */
export function Toggle({ value, onChange, label }) {
  return (
    <label className="toggle-wrap">
      <div
        className={`toggle ${value ? 'on' : ''}`}
        onClick={() => onChange(!value)}
      >
        <div className="toggle-knob" />
      </div>
      <span className="toggle-label">{label}</span>
    </label>
  );
}

/**
 * Color input with preview
 */
export function ColorInput({ value, onChange, label }) {
  return (
    <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {label}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="color"
          value={value || '#735c00'}
          onChange={e => onChange(e.target.value)}
          style={{ width: 36, height: 36, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'none' }}
        />
        <Input value={value} onChange={onChange} placeholder="#hex" style={{ width: 100 }} />
      </div>
    </label>
  );
}

/**
 * Toast notification
 */
export function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;
  return (
    <div className={`toast toast-${type}`}>
      {type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
      {message}
      <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
        <X size={14} />
      </button>
    </div>
  );
}

/**
 * Confirm dialog
 */
export function Confirm({ open, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-box" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '28px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 24 }}>{message}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-ghost" onClick={onCancel}>Annuler</button>
            <button className="btn" style={{ background: 'var(--danger)', color: 'white' }} onClick={onConfirm}>Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  );
}
