import { useState, useRef, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, X, ImageIcon, Loader, CheckCircle, AlertCircle } from 'lucide-react';

const BUCKET = 'challenge-illustrations';
const MAX_SIZE_MB = 5;

/**
 * ImageUploader — uploads a file to Supabase Storage and returns the public URL.
 *
 * Props:
 *   value        {string}   Current image URL (controlled)
 *   onChange     {fn}       Called with the new public URL after upload
 *   folder       {string}   Sub-folder inside the bucket (e.g. city id)
 */
export default function ImageUploader({ value, onChange, folder = 'general' }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const getPublicUrl = (path) => {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  };

  const uploadFile = useCallback(async (file) => {
    setError(null);

    // Validate size
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Fichier trop volumineux. Max ${MAX_SIZE_MB} MB.`);
      return;
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Seules les images sont acceptées (JPG, PNG, WebP, GIF).');
      return;
    }

    setUploading(true);
    setProgress(10);

    try {
      const ext = file.name.split('.').pop().toLowerCase();
      const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      setProgress(30);

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      setProgress(90);

      const publicUrl = getPublicUrl(filename);
      onChange(publicUrl);
      setProgress(100);

    } catch (err) {
      setError('Erreur upload : ' + (err.message || 'inconnue'));
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 800);
    }
  }, [folder, onChange]);

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleRemove = async () => {
    // Optionally delete from storage (extract path from URL)
    if (value) {
      try {
        const url = new URL(value);
        const parts = url.pathname.split(`/object/public/${BUCKET}/`);
        if (parts.length === 2) {
          await supabase.storage.from(BUCKET).remove([parts[1]]);
        }
      } catch (_) {}
    }
    onChange('');
  };

  return (
    <div className="img-uploader">
      {/* Drop zone */}
      <div
        className={`drop-zone ${dragging ? 'drag-over' : ''} ${uploading ? 'uploading' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        {uploading ? (
          <div className="upload-progress-wrap">
            <Loader size={28} className="spin" color="var(--primary-light)" />
            <span className="upload-status-text">Envoi en cours…</span>
            <div className="upload-progress-bar">
              <div className="upload-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{progress}%</span>
          </div>
        ) : (
          <div className="drop-zone-inner">
            <div className="drop-zone-icon">
              <Upload size={28} color="var(--primary-light)" />
            </div>
            <p className="drop-zone-title">Glisser une image ici</p>
            <p className="drop-zone-sub">ou <span className="drop-zone-link">cliquer pour choisir</span></p>
            <p className="drop-zone-hint">JPG · PNG · WebP · GIF — max {MAX_SIZE_MB} MB</p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="upload-error">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {/* Preview */}
      {value && !uploading && (
        <div className="img-preview-wrap">
          <div className="img-preview-badge">
            <CheckCircle size={12} /> Image enregistrée
          </div>
          <img
            src={value}
            alt="Illustration du défi"
            className="img-preview"
            onError={(e) => { e.target.style.opacity = 0.3; }}
          />
          <div className="img-preview-actions">
            <button
              className="img-replace-btn"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            >
              <Upload size={13} /> Remplacer
            </button>
            <button
              className="img-remove-btn"
              onClick={(e) => { e.stopPropagation(); handleRemove(); }}
            >
              <X size={13} /> Supprimer
            </button>
          </div>
          <div className="img-preview-url" title={value}>
            <ImageIcon size={10} />
            <span>{value.split('/').pop()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
