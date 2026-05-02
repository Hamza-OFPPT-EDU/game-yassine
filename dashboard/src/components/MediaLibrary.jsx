import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Download, Image as ImageIcon, Search, CheckSquare, Square, 
  Grid, List as ListIcon, RefreshCw, Trash2, 
  Upload, Link, Film, Check, ExternalLink
} from 'lucide-react';

const BUCKETS = [
  { id: 'challenge-illustrations', label: 'Défis (Illustrations)', icon: '🗺️' },
  { id: 'badges', label: 'Badges & Récompenses', icon: '🏅' },
  { id: 'app-assets', label: 'Assets Application', icon: '📱' }
];

export default function MediaLibrary() {
  const [currentBucket, setCurrentBucket] = useState(BUCKETS[0].id);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selection, setSelection] = useState([]);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [editingFile, setEditingFile] = useState(null);
  const [assetConfigs, setAssetConfigs] = useState({});
  const [currentConfig, setCurrentConfig] = useState({
    bg_color: '#ffffff',
    opacity: 1,
    border_radius: '0',
    shadow: 'none'
  });

  const fetchConfigs = async () => {
    const { data, error } = await supabase.from('asset_configs').select('*').eq('bucket_id', currentBucket);
    if (!error && data) {
      const configMap = {};
      data.forEach(c => {
        configMap[c.file_name] = c;
      });
      setAssetConfigs(configMap);
    }
  };

  const fetchFiles = async () => {
    setLoading(true);
    setSelection([]);
    try {
      const { data, error } = await supabase
        .storage
        .from(currentBucket)
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (error) throw error;
      
      const filesWithUrls = data.map(file => ({
        ...file,
        url: supabase.storage.from(currentBucket).getPublicUrl(file.name).data.publicUrl
      }));

      setFiles(filesWithUrls);
      await fetchConfigs();
    } catch (err) {
      console.error('Error fetching media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [currentBucket]);

  const openSettings = (file) => {
    const config = assetConfigs[file.name] || {
      bg_color: '#ffffff',
      opacity: 1,
      border_radius: '0',
      shadow: 'none'
    };
    setCurrentConfig(config);
    setEditingFile(file);
  };

  const saveConfig = async () => {
    try {
      const { error } = await supabase.from('asset_configs').upsert({
        bucket_id: currentBucket,
        file_name: editingFile.name,
        ...currentConfig
      }, { onConflict: 'bucket_id, file_name' });

      if (error) throw error;
      await fetchConfigs();
      setEditingFile(null);
    } catch (err) {
      console.error('Error saving config:', err);
      alert('Erreur lors de la sauvegarde : ' + err.message);
    }
  };

  const toggleSelect = (name) => {
    setSelection(prev => 
      prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]
    );
  };

  const selectAll = () => {
    if (selection.length === filteredFiles.length && filteredFiles.length > 0) setSelection([]);
    else setSelection(filteredFiles.map(f => f.name));
  };

  const downloadSelected = async () => {
    for (const name of selection) {
      const file = files.find(f => f.name === name);
      if (file) {
        const link = document.createElement('a');
        link.href = file.url;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        await new Promise(r => setTimeout(r, 200));
      }
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const cleanName = file.name.replace(/[^\x00-\x7F]/g, "").replace(/\s+/g, "_");
      const { error } = await supabase.storage.from(currentBucket).upload(cleanName, file, {
        upsert: true
      });

      if (error) throw error;
      await fetchFiles();
    } catch (err) {
      console.error('Error uploading:', err);
      alert('Erreur lors de l\'envoi : ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (name) => {
    if (!confirm(`Supprimer ${name} définitivement ?`)) return;
    try {
      const { error } = await supabase.storage.from(currentBucket).remove([name]);
      if (error) throw error;
      await supabase.from('asset_configs').delete().eq('bucket_id', currentBucket).eq('file_name', name);
      await fetchFiles();
    } catch (err) {
      console.error('Error deleting:', err);
      alert('Erreur lors de la suppression : ' + err.message);
    }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const isVideo = (name) => {
    return /\.(mp4|webm|ogg|mov)$/i.test(name);
  };

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="media-library fade-in">
      <div className="cms-section-header">
        <div>
          <h2 className="cms-section-title">📂 Bibliothèque Média</h2>
          <p className="cms-section-sub">Gérez et téléchargez les ressources visuelles de l'application</p>
        </div>
        <div className="header-actions">
          {selection.length > 0 && (
            <button className="btn btn-primary" onClick={downloadSelected}>
              <Download size={16} /> Télécharger ({selection.length})
            </button>
          )}
          <label className={`btn btn-primary ${uploading ? 'loading' : ''}`} style={{ cursor: 'pointer' }}>
            <Upload size={16} /> {uploading ? 'Envoi...' : 'Ajouter'}
            <input type="file" hidden onChange={handleUpload} disabled={uploading} accept="image/*,video/*" />
          </label>
          <button className="btn btn-ghost" onClick={fetchFiles}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="media-container">
        {/* Bucket Tabs */}
        <div className="media-tabs">
          {BUCKETS.map(b => (
            <button 
              key={b.id}
              className={`media-tab ${currentBucket === b.id ? 'active' : ''}`}
              onClick={() => setCurrentBucket(b.id)}
            >
              <span>{b.icon}</span>
              {b.label}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="media-toolbar">
          <div className="search-bar" style={{ flex: 1 }}>
            <Search size={14} className="search-icon" />
            <input 
              type="text" 
              placeholder="Rechercher un fichier..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          
          <div className="toolbar-btns">
            <button className="btn-icon" onClick={selectAll} title="Tout sélectionner">
              {selection.length === filteredFiles.length && filteredFiles.length > 0 ? <CheckSquare size={18} /> : <Square size={18} />}
            </button>
            <div className="view-switcher">
              <button className={`btn-icon ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}><Grid size={18} /></button>
              <button className={`btn-icon ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}><ListIcon size={18} /></button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Chargement des ressources...</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="empty-state">
            <ImageIcon size={48} />
            <h3>Aucun fichier trouvé</h3>
            <p>Le dossier est vide ou aucun résultat pour "{search}"</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="media-grid">
            {filteredFiles.map(file => {
              const config = assetConfigs[file.name] || {};
              return (
                <div 
                  key={file.id} 
                  className={`media-card ${selection.includes(file.name) ? 'selected' : ''}`}
                >
                  <div className="media-preview" onClick={() => toggleSelect(file.name)} style={{ 
                      backgroundColor: config.bg_color,
                      opacity: config.opacity ?? 1,
                      borderRadius: config.border_radius
                    }}>
                    {isVideo(file.name) ? (
                      <div className="w-full h-full relative">
                        <video className="w-full h-full object-cover">
                          <source src={file.url} />
                        </video>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Film size={32} className="text-white opacity-50" />
                        </div>
                      </div>
                    ) : (
                      <img src={file.url} alt={file.name} loading="lazy" style={{ borderRadius: config.border_radius }} />
                    )}
                    <div className="media-overlay">
                      <div className="select-indicator">
                        {selection.includes(file.name) ? <CheckSquare size={20} /> : <Square size={20} />}
                      </div>
                    </div>
                  </div>
                  <div className="media-info">
                    <div className="media-name-row">
                      <span className="media-name" title={file.name}>{file.name}</span>
                      <div className="media-actions">
                        <button className="btn-icon-sm" title="Paramètres" onClick={(e) => { e.stopPropagation(); openSettings(file); }}><RefreshCw size={14} /></button>
                        <button 
                          className="btn-icon-sm" 
                          title="Copier le lien" 
                          onClick={(e) => { e.stopPropagation(); copyUrl(file.url); }}
                        >
                          {copiedUrl === file.url ? <Check size={14} className="text-green-500" /> : <Link size={14} />}
                        </button>
                        <button 
                          className="btn-icon-sm text-red-400" 
                          title="Supprimer" 
                          onClick={(e) => { e.stopPropagation(); deleteFile(file.name); }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <span className="media-size">{(file.metadata?.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="media-list">
             <table>
               <thead>
                 <tr>
                   <th width="40"><Square size={14} /></th>
                   <th>Fichier</th>
                   <th>Taille</th>
                   <th>Type</th>
                   <th>Dernière modif.</th>
                   <th className="text-right">Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {filteredFiles.map(file => (
                   <tr 
                     key={file.id} 
                     className={selection.includes(file.name) ? 'selected' : ''}
                     onClick={() => toggleSelect(file.name)}
                   >
                     <td>{selection.includes(file.name) ? <CheckSquare size={16} /> : <Square size={16} />}</td>
                     <td>
                       <div className="list-file-info">
                         <div className="list-thumb">
                           {isVideo(file.name) ? <Film size={14} /> : <img src={file.url} />}
                         </div>
                         <span>{file.name}</span>
                       </div>
                     </td>
                     <td>{(file.metadata?.size / 1024).toFixed(1)} KB</td>
                     <td>{file.metadata?.mimetype || (isVideo(file.name) ? 'video' : 'image')}</td>
                     <td>{new Date(file.created_at).toLocaleDateString()}</td>
                     <td>
                       <div className="row-actions" style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                         <button className="btn-icon" title="Paramètres" onClick={(e) => { e.stopPropagation(); openSettings(file); }}><RefreshCw size={14} /></button>
                         <button 
                           className="btn-icon" 
                           title="Copier le lien" 
                           onClick={(e) => { e.stopPropagation(); copyUrl(file.url); }}
                         >
                           {copiedUrl === file.url ? <Check size={14} className="text-green-500" /> : <Link size={14} />}
                         </button>
                         <a href={file.url} target="_blank" rel="noreferrer" className="btn-icon" onClick={e => e.stopPropagation()}>
                           <ExternalLink size={14} />
                         </a>
                         <button 
                           className="btn-icon text-red-400" 
                           title="Supprimer"
                           onClick={(e) => { e.stopPropagation(); deleteFile(file.name); }}
                         >
                           <Trash2 size={14} />
                         </button>
                       </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}
      </div>

      {/* Settings Panel */}
      {editingFile && (
        <>
          <div className="panel-backdrop open" onClick={() => setEditingFile(null)} />
          <div className="player-panel open" style={{ width: '400px' }}>
            <div className="panel-header">
              <div className="panel-info">
                <div className="flex items-center justify-between w-full">
                  <h3 className="panel-name">Paramètres du média</h3>
                  <button className="btn-icon" onClick={() => setEditingFile(null)}><Trash2 size={16} /></button>
                </div>
                <p className="panel-type truncate w-full">{editingFile.name}</p>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="preview-box mb-6 bg-slate-900/10 rounded-xl p-4 flex items-center justify-center min-h-[220px] border border-border-light"
                   style={{ 
                     backgroundColor: currentConfig.bg_color,
                     opacity: currentConfig.opacity,
                     borderRadius: currentConfig.border_radius,
                     boxShadow: currentConfig.shadow
                   }}>
                 {isVideo(editingFile.name) ? (
                   <video src={editingFile.url} className="max-w-full max-h-[180px] object-contain" autoPlay muted loop />
                 ) : (
                   <img src={editingFile.url} className="max-w-full max-h-[180px] object-contain" style={{ borderRadius: currentConfig.border_radius }} />
                 )}
              </div>

              <div className="space-y-4">
                <div className="input-group">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Couleur de fond</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={currentConfig.bg_color || '#ffffff'} 
                      onChange={(e) => setCurrentConfig({...currentConfig, bg_color: e.target.value})}
                      className="w-12 h-10 rounded border border-border-light cursor-pointer bg-bg-elevated"
                    />
                    <input 
                      type="text" 
                      value={currentConfig.bg_color || '#ffffff'} 
                      onChange={(e) => setCurrentConfig({...currentConfig, bg_color: e.target.value})}
                      className="flex-1 bg-bg-elevated border border-border-light rounded px-3 text-sm text-text-primary"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Opacité</label>
                    <span className="text-sm font-bold text-primary-light">{Math.round(currentConfig.opacity * 100)}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="1" step="0.01"
                    value={currentConfig.opacity ?? 1} 
                    onChange={(e) => setCurrentConfig({...currentConfig, opacity: parseFloat(e.target.value)})}
                    className="w-full accent-primary"
                  />
                </div>

                <div className="input-group">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Arrondi des angles (px/%)</label>
                  <input 
                    type="text" 
                    placeholder="ex: 12px ou 50%"
                    value={currentConfig.border_radius || '0px'} 
                    onChange={(e) => setCurrentConfig({...currentConfig, border_radius: e.target.value})}
                    className="w-full bg-bg-elevated border border-border-light rounded px-3 py-2 text-sm text-text-primary"
                  />
                </div>

                <div className="input-group">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-2">Ombre portée (CSS)</label>
                  <input 
                    type="text" 
                    placeholder="ex: 0 4px 10px rgba(0,0,0,0.3)"
                    value={currentConfig.shadow || 'none'} 
                    onChange={(e) => setCurrentConfig({...currentConfig, shadow: e.target.value})}
                    className="w-full bg-bg-elevated border border-border-light rounded px-3 py-2 text-sm text-text-primary"
                  />
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button className="btn btn-ghost flex-1" onClick={() => setEditingFile(null)}>Annuler</button>
                <button className="btn btn-primary flex-1" onClick={saveConfig}>Enregistrer</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
