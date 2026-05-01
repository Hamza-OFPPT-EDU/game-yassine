import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Download, Image as ImageIcon, Search, CheckSquare, Square, 
  Filter, Grid, List as ListIcon, RefreshCw, Trash2, FolderOpen
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
      
      // Add public URL to each file
      const filesWithUrls = data.map(file => ({
        ...file,
        url: supabase.storage.from(currentBucket).getPublicUrl(file.name).data.publicUrl
      }));

      setFiles(filesWithUrls);
    } catch (err) {
      console.error('Error fetching media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [currentBucket]);

  const toggleSelect = (name) => {
    setSelection(prev => 
      prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]
    );
  };

  const selectAll = () => {
    if (selection.length === filteredFiles.length) setSelection([]);
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
        // Small delay to avoid browser blocking multiple downloads
        await new Promise(r => setTimeout(r, 200));
      }
    }
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
          <button className="btn btn-ghost" onClick={fetchFiles}>
            <RefreshCw size={16} />
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
            {filteredFiles.map(file => (
              <div 
                key={file.id} 
                className={`media-card ${selection.includes(file.name) ? 'selected' : ''}`}
                onClick={() => toggleSelect(file.name)}
              >
                <div className="media-preview">
                  <img src={file.url} alt={file.name} loading="lazy" />
                  <div className="media-overlay">
                    <div className="select-indicator">
                      {selection.includes(file.name) ? <CheckSquare size={20} /> : <Square size={20} />}
                    </div>
                  </div>
                </div>
                <div className="media-info">
                  <span className="media-name" title={file.name}>{file.name}</span>
                  <span className="media-size">{(file.metadata?.size / 1024).toFixed(1)} KB</span>
                </div>
              </div>
            ))}
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
                   <th></th>
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
                         <img src={file.url} className="list-thumb" />
                         <span>{file.name}</span>
                       </div>
                     </td>
                     <td>{(file.metadata?.size / 1024).toFixed(1)} KB</td>
                     <td>{file.metadata?.mimetype}</td>
                     <td>{new Date(file.created_at).toLocaleDateString()}</td>
                     <td>
                        <a href={file.url} download className="btn-icon" onClick={e => e.stopPropagation()}>
                          <Download size={14} />
                        </a>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );
}
