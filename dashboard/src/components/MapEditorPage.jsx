import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Save, RefreshCw, Map as MapIcon, ChevronRight, 
  Search, Sliders, Type, Image as ImageIcon, 
  MapPin, MousePointer2, Layers, Maximize2, Palette
} from 'lucide-react';

const ICON_OPTIONS = [
  { id: 'city', label: 'Cité', icon: '🏛️' },
  { id: 'nature', label: 'Nature', icon: '🌳' },
  { id: 'water', label: 'Eau', icon: '🌊' },
  { id: 'tower', label: 'Tour', icon: '🗼' },
  { id: 'port', label: 'Port', icon: '⚓' },
  { id: 'star', label: 'Étoile', icon: '⭐' },
  { id: 'mosque', label: 'Mosquée', icon: '🕌' },
  { id: 'mountain', label: 'Montagne', icon: '🏔️' }
];

export default function MapEditorPage({ onNavigate }) {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    city_name_fr: '',
    sort_order: 0,
    map_size: 1.0,
    icon_name: 'city',
    icon_size: 64,
    illustration_url: '',
    city_color: '#8B4513'
  });

  useEffect(() => {
    fetchChallenges();
  }, []);

  async function fetchChallenges() {
    setLoading(true);
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (data) setChallenges(data);
    setLoading(false);
  }

  const handleSelectCity = (city) => {
    setSelectedCity(city);
    setFormData({
      city_name_fr: city.city_name_fr || '',
      sort_order: city.sort_order || 0,
      map_size: city.map_size || 1.0,
      icon_name: city.icon_name || 'city',
      icon_size: city.icon_size || 64,
      illustration_url: city.illustration_url || '',
      city_color: city.city_color || '#8B4513'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'map_size' ? parseFloat(value) : 
              name === 'icon_size' || name === 'sort_order' ? parseInt(value) : value
    }));
  };

  const handleIconSelect = (iconId) => {
    setFormData(prev => ({ ...prev, icon_name: iconId }));
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const bucketName = type === 'icon' ? 'city-icons' : 'city-illustrations';
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        [type === 'icon' ? 'icon_name' : 'illustration_url']: publicUrl
      }));
    } catch (error) {
      alert('Erreur lors du téléchargement : ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedCity) return;
    setSaving(true);
    
    const { error } = await supabase
      .from('challenges')
      .update({
        city_name_fr: formData.city_name_fr,
        sort_order: formData.sort_order,
        map_size: formData.map_size,
        icon_name: formData.icon_name,
        icon_size: formData.icon_size,
        illustration_url: formData.illustration_url,
        city_color: formData.city_color
      })
      .eq('id', selectedCity.id);

    if (!error) {
      await fetchChallenges();
      alert('Modifications enregistrées !');
    } else {
      alert('Erreur : ' + error.message);
    }
    setSaving(false);
  };

  const renderIconPreview = () => {
    const isUrl = formData.icon_name?.startsWith('http');
    const selectedIcon = ICON_OPTIONS.find(o => o.id === formData.icon_name);
    
    return (
      <div 
        className="node-preview-wrapper mb-8"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        <div 
          className="node-preview-container"
          style={{
            width: '100%',
            height: '220px',
            background: `linear-gradient(135deg, ${formData.city_color}22, ${formData.city_color}11)`,
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${formData.city_color}33`,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `inset 0 0 40px ${formData.city_color}11`
          }}
        >
          {formData.illustration_url && (
            <img 
              src={formData.illustration_url} 
              className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale mix-blend-overlay"
              alt="Background"
            />
          )}
          <div className="preview-label" style={{ color: formData.city_color }}>Rendu in-game</div>
          
          <div 
            className="outer-ring"
            style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              background: formData.city_color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 10px 40px ${formData.city_color}44`,
              transform: `scale(${formData.map_size})`,
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            <div 
              className="node-icon-inner"
              style={{
                width: `${formData.icon_size * 1.5}px`,
                height: `${formData.icon_size * 1.5}px`,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: `${formData.icon_size * 0.8}px`,
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              {isUrl ? (
                <img 
                  src={formData.icon_name} 
                  style={{ width: '70%', height: '70%', objectFit: 'contain' }} 
                  alt="Preview"
                />
              ) : (
                selectedIcon ? selectedIcon.icon : '🏛️'
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="map-editor-container h-full flex overflow-hidden">
      {/* City List Sidebar */}
      <div className="w-80 border-r border-white/5 flex flex-col bg-white/[0.02]">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <MapIcon size={18} className="text-amber-500" />
            </div>
            <h2 className="font-bold text-lg">Parcours</h2>
          </div>
          <button onClick={fetchChallenges} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {challenges.map((city, idx) => (
            <button
              key={city.id}
              onClick={() => handleSelectCity(city)}
              className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 border ${
                selectedCity?.id === city.id 
                ? 'bg-amber-500/10 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]' 
                : 'hover:bg-white/5 border-transparent'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-bold text-xs text-white/40">
                {idx + 1}
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold">{city.city_name_fr}</div>
                <div className="text-xs text-white/40 capitalize">{city.icon_name || 'Standard'} • Taille {city.icon_size || 64}</div>
              </div>
              <ChevronRight size={16} className={selectedCity?.id === city.id ? 'text-amber-500' : 'text-white/20'} />
            </button>
          ))}
        </div>
      </div>

      {/* Editor Main Area */}
      <div className="flex-1 overflow-y-auto bg-[#0a0a0c] relative">
        {!selectedCity ? (
          <div className="h-full flex flex-col items-center justify-center text-white/20 p-12">
            <div className="w-24 h-24 rounded-full border-2 border-white/5 flex items-center justify-center mb-6 animate-pulse">
              <MousePointer2 size={40} />
            </div>
            <h3 className="text-xl font-medium mb-2">Sélectionnez une cité</h3>
            <p className="max-w-xs text-center">Choisissez une ville dans la liste pour modifier son apparence et sa position sur la carte.</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto p-8 lg:p-12">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-1">Configuration de la Cité</div>
                <h2 className="text-3xl font-black">{formData.city_name_fr}</h2>
              </div>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-black rounded-2xl shadow-xl shadow-amber-500/20 transition-all active:scale-95"
              >
                {saving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                ENREGISTRER
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Core Identity */}
              <div className="space-y-6">
                <div className="glass-card p-6 rounded-3xl border border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-3 mb-6 text-white/60">
                    <Type size={18} />
                    <span className="font-bold text-sm uppercase tracking-wider">Identité & Ordre</span>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-white/40 mb-2 uppercase ml-1">Nom de la cité</label>
                      <input 
                        name="city_name_fr"
                        value={formData.city_name_fr}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-amber-500/50 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/40 mb-2 uppercase ml-1">Ordre de progression</label>
                      <input 
                        type="number"
                        name="sort_order"
                        value={formData.sort_order}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-amber-500/50 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/40 mb-2 uppercase ml-1">Couleur de la cité</label>
                      <div className="flex gap-3">
                        <div 
                          className="w-14 h-14 rounded-2xl border border-white/10 shadow-inner"
                          style={{ backgroundColor: formData.city_color }}
                        />
                        <input 
                          type="color"
                          name="city_color"
                          value={formData.city_color}
                          onChange={handleInputChange}
                          className="flex-1 h-14 bg-white/5 border border-white/10 rounded-2xl p-1 cursor-pointer outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-3xl border border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-3 mb-6 text-white/60">
                    <Maximize2 size={18} />
                    <span className="font-bold text-sm uppercase tracking-wider">Échelle & Dimensions</span>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-xs font-bold text-white/40 uppercase ml-1">Taille de l'icône (px)</label>
                        <span className="text-xs font-mono text-amber-500">{formData.icon_size}px</span>
                      </div>
                      <input 
                        type="range"
                        name="icon_size"
                        min="32"
                        max="128"
                        step="4"
                        value={formData.icon_size}
                        onChange={handleInputChange}
                        className="w-full accent-amber-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-xs font-bold text-white/40 uppercase ml-1">Échelle de la carte (Scale)</label>
                        <span className="text-xs font-mono text-amber-500">{formData.map_size}x</span>
                      </div>
                      <input 
                        type="range"
                        name="map_size"
                        min="0.5"
                        max="2.5"
                        step="0.1"
                        value={formData.map_size}
                        onChange={handleInputChange}
                        className="w-full accent-amber-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Style */}
              <div className="space-y-6">
                <div className="glass-card p-6 rounded-3xl border border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-3 mb-6 text-white/60">
                    <Layers size={18} />
                    <span className="font-bold text-sm uppercase tracking-wider">Style Visuel</span>
                  </div>

                  {renderIconPreview()}

                  <div className="mb-6">
                    <label className="block text-xs font-bold text-white/40 mb-3 uppercase ml-1">Bibliothèque d'icônes</label>
                    <div className="grid grid-cols-4 gap-3">
                      {ICON_OPTIONS.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => handleIconSelect(opt.id)}
                          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                            formData.icon_name === opt.id 
                            ? 'bg-amber-500/20 border-amber-500 text-white' 
                            : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                          }`}
                        >
                          <span className="text-2xl mb-1">{opt.icon}</span>
                          <span className="text-[10px] font-bold uppercase">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-white/40 mb-3 uppercase ml-1">Icône personnalisée (Image)</label>
                      <div className="flex gap-3">
                        <input 
                          type="text"
                          placeholder="URL de l'icône ou upload..."
                          className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-amber-500/50 outline-none transition-all"
                          value={formData.icon_name?.startsWith('http') ? formData.icon_name : ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, icon_name: e.target.value }))}
                        />
                        <label className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl cursor-pointer transition-all">
                          <ImageIcon size={20} className={uploading ? 'animate-bounce' : ''} />
                          <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'icon')} accept="image/*" />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-white/40 mb-3 uppercase ml-1">Illustration de fond (Ville)</label>
                      <div className="flex gap-3">
                        <input 
                          type="text"
                          placeholder="URL de l'image de fond..."
                          className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-amber-500/50 outline-none transition-all"
                          value={formData.illustration_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, illustration_url: e.target.value }))}
                        />
                        <label className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl cursor-pointer transition-all">
                          <Maximize2 size={20} className={uploading ? 'animate-bounce' : ''} />
                          <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'illustration')} accept="image/*" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .glass-card {
          backdrop-filter: blur(12px);
        }
        .preview-label {
          position: absolute;
          top: 12px;
          left: 12px;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          letter-spacing: 1px;
        }
        input[type=range] {
          height: 6px;
          border-radius: 3px;
          background: rgba(255,255,255,0.1);
          outline: none;
        }
      `}} />
    </div>
  );
}
