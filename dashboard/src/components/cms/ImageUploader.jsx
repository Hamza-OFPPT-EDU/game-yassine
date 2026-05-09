import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, X, ImageIcon, Loader, CheckCircle, AlertCircle, Link, Search, RefreshCw } from 'lucide-react';

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
export default function ImageUploader({ value, onChange, folder = 'general', bucket = 'challenge-illustrations' }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [mode, setMode] = useState('upload'); // 'upload' | 'url' | 'library'
  const [urlValue, setUrlValue] = useState('');
  const [libraryFiles, setLibraryFiles] = useState([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [librarySearch, setLibrarySearch] = useState('');
  const inputRef = useRef(null);

  const getPublicUrl = (path) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  };

  const fetchLibraryFiles = useCallback(async () => {
    setLoadingLibrary(true);
    try {
      const { data, error } = await supabase.storage.from(bucket).list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' }
      });
      if (error) throw error;
      
      // Filter out non-image files if needed
      const filesWithUrls = data
        .filter(f => !f.name.startsWith('.')) // hide hidden files
        .map(file => ({
          ...file,
          url: getPublicUrl(file.name)
        }));

      setLibraryFiles(filesWithUrls);
    } catch (err) {
      console.error('Error fetching library:', err);
      setError('Erreur lors du chargement de la bibliothèque');
    } finally {
      setLoadingLibrary(false);
    }
  }, [bucket]);

  useEffect(() => {
    if (mode === 'library') {
      fetchLibraryFiles();
    }
  }, [mode, fetchLibraryFiles]);

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
        .from(bucket)
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      setProgress(90);

      const publicUrl = getPublicUrl(filename);
      onChange(publicUrl);
      setProgress(100);
      setMode('upload');

    } catch (err) {
      setError('Erreur upload : ' + (err.message || 'inconnue'));
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 800);
    }
  }, [folder, onChange, bucket]);

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
        const parts = url.pathname.split(`/object/public/${bucket}/`);
        if (parts.length === 2) {
          await supabase.storage.from(bucket).remove([parts[1]]);
        }
      } catch (_) {}
    }
    onChange('');
  };

  const handleUrlSubmit = () => {
    if (urlValue) {
      onChange(urlValue);
      setUrlValue('');
      setMode('upload');
    }
  };

  const filteredLibrary = libraryFiles.filter(f => 
    f.name.toLowerCase().includes(librarySearch.toLowerCase())
  );

  return (
    <div className="img-uploader">
      {/* Tabs for switching between Upload, URL and Library */}
      {!value && !uploading && (
        <div className="uploader-tabs" style={{ 
          display: 'flex', 
          gap: '4px', 
          marginBottom: '12px',
          background: 'var(--bg-elevated)',
          padding: '4px',
          borderRadius: '24px',
          width: 'fit-content'
        }}>
          {[
            { id: 'upload', label: 'Upload', icon: Upload },
            { id: 'url', label: 'Lien URL', icon: Link },
            { id: 'library', label: 'Bibliothèque', icon: ImageIcon }
          ].map(tab => (
            <button 
              key={tab.id}
              type="button"
              className={`btn-tab ${mode === tab.id ? 'active' : ''}`}
              onClick={() => setMode(tab.id)}
              style={{ 
                fontSize: '11px', 
                padding: '6px 14px', 
                borderRadius: '20px',
                background: mode === tab.id ? 'var(--primary)' : 'transparent',
                color: mode === tab.id ? 'white' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'var(--transition)'
              }}
            >
              <tab.icon size={12} />
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Content based on mode */}
      {!value && !uploading && (
        <div className="uploader-content">
          {mode === 'url' && (
            <div className="url-input-zone" style={{
              padding: '24px',
              border: '2px dashed var(--border-light)',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: 'rgba(255,255,255,0.02)'
            }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                 <Link size={18} className="text-primary-light" />
                 <input 
                   type="text" 
                   placeholder="https://exemple.com/image.png" 
                   value={urlValue}
                   onChange={e => setUrlValue(e.target.value)}
                   style={{ 
                     flex: 1, 
                     background: 'transparent', 
                     border: 'none', 
                     borderBottom: '1px solid var(--border-light)', 
                     fontSize: '13px',
                     color: 'var(--text-primary)',
                     outline: 'none',
                     padding: '4px 0'
                   }}
                   onKeyDown={e => e.key === 'Enter' && handleUrlSubmit()}
                 />
              </div>
              <button 
                type="button"
                className="btn btn-primary btn-sm" 
                disabled={!urlValue}
                onClick={handleUrlSubmit}
                style={{ alignSelf: 'flex-end', marginTop: '4px' }}
              >
                Confirmer le lien
              </button>
            </div>
          )}

          {mode === 'library' && (
            <div className="library-zone" style={{
              border: '2px dashed var(--border-light)',
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.02)'
            }}>
              <div style={{ padding: '10px', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Search size={14} className="text-text-muted" />
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  className="flex-1 bg-transparent border-none outline-none text-xs text-text-primary"
                  value={librarySearch}
                  onChange={e => setLibrarySearch(e.target.value)}
                />
                <button type="button" className="btn-icon-sm" onClick={fetchLibraryFiles} disabled={loadingLibrary}>
                   <RefreshCw size={12} className={loadingLibrary ? 'animate-spin' : ''} />
                </button>
              </div>
              <div style={{ 
                height: '180px', 
                overflowY: 'auto', 
                padding: '10px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))',
                gap: '8px'
              }}>
                {loadingLibrary ? (
                  <div style={{ gridColumn: '1/-1', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Loader size={20} className="spin text-primary-light" />
                  </div>
                ) : filteredLibrary.length === 0 ? (
                  <div style={{ gridColumn: '1/-1', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                    <ImageIcon size={24} />
                    <span style={{ fontSize: '10px', marginTop: '4px' }}>Aucun fichier</span>
                  </div>
                ) : filteredLibrary.map(file => (
                  <div 
                    key={file.name} 
                    className="library-item"
                    onClick={() => onChange(file.url)}
                    style={{ 
                      aspectRatio: '1', 
                      borderRadius: '8px', 
                      overflow: 'hidden', 
                      cursor: 'pointer',
                      border: '1px solid var(--border-light)',
                      position: 'relative'
                    }}
                    title={file.name}
                  >
                    <img src={file.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {mode === 'upload' && (
            <div
              className={`drop-zone ${dragging ? 'drag-over' : ''} ${uploading ? 'uploading' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => !uploading && inputRef.current?.click()}
            >
              <div className="drop-zone-inner">
                <div className="drop-zone-icon">
                  <Upload size={28} color="var(--primary-light)" />
                </div>
                <p className="drop-zone-title">Glisser une image ici</p>
                <p className="drop-zone-sub">ou <span className="drop-zone-link">cliquer pour choisir</span></p>
                <p className="drop-zone-hint">JPG · PNG · WebP · GIF — max {MAX_SIZE_MB} MB</p>
              </div>

              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                style={{ display: 'none' }}
              />
            </div>
          )}
        </div>
      )}

      {/* Uploading state */}
      {uploading && (
        <div className="drop-zone uploading" style={{ height: '140px' }}>
          <div className="upload-progress-wrap">
            <Loader size={28} className="spin" color="var(--primary-light)" />
            <span className="upload-status-text">Envoi en cours…</span>
            <div className="upload-progress-bar">
              <div className="upload-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{progress}%</span>
          </div>
        </div>
      )}

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
            alt="Illustration"
            className="img-preview"
            onError={(e) => { e.target.style.opacity = 0.3; }}
          />
          <div className="img-preview-actions">
            <button
              type="button"
              className="img-replace-btn"
              onClick={(e) => { e.stopPropagation(); setMode('upload'); inputRef.current?.click(); }}
            >
              <Upload size={13} /> Remplacer
            </button>
            <button
              type="button"
              className="img-remove-btn"
              onClick={(e) => { e.stopPropagation(); handleRemove(); }}
            >
              <X size={13} /> Supprimer
            </button>
          </div>
          <div className="img-preview-url" title={value}>
            <ImageIcon size={10} />
            <span>{value.split('/').pop() || 'Lien externe'}</span>
          </div>
        </div>
      )}
    </div>
  );
}
