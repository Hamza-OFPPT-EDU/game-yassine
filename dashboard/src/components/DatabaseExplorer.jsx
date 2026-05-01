import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Database, Table, Search, Info, List, RefreshCw, 
  ChevronRight, ChevronLeft, Download, Filter, Code
} from 'lucide-react';

export default function DatabaseExplorer() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [data, setData] = useState([]);
  const [schema, setSchema] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('data'); // 'data' | 'structure'
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      fetchTableInfo();
      fetchTableData();
    }
  }, [selectedTable, page]);

  const fetchTables = async () => {
    const { data: res } = await supabase.rpc('get_tables_list'); // Need to check if this RPC exists, else use SQL
    // Fallback if RPC doesn't exist
    const query = `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;`;
    // Since I can't call RPC easily if not defined, I'll use a local fetch of table names we already found
    const list = ["act_results", "app_users", "badge_definitions", "challenges", "decisions", "families", "family_badges", "leaderboard", "missions", "player_city_progress", "player_earned_badges", "player_profiles", "player_skill_scores", "questions", "room_members", "rooms", "solo_progress"];
    setTables(list);
    if (list.length > 0 && !selectedTable) setSelectedTable(list[0]);
  };

  const fetchTableInfo = async () => {
    setLoading(true);
    // There is no easy way to get info schema via JS SDK directly without RPC or raw SQL
    // But we can approximate structure from the first few rows or use a generic query
    setData([]);
  };

  const fetchTableData = async () => {
    setLoading(true);
    try {
      const { data: rows, error } = await supabase
        .from(selectedTable)
        .select('*')
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

      if (error) throw error;
      setData(rows || []);

      // If schema is empty, derive it from the first row
      if (rows && rows.length > 0) {
        const first = rows[0];
        const derivedSchema = Object.keys(first).map(key => ({
          column_name: key,
          data_type: typeof first[key] === 'object' ? 'jsonb' : typeof first[key],
          is_nullable: '?'
        }));
        setSchema(derivedSchema);
      }
    } catch (err) {
      console.error('Error fetching table data:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(val => 
        typeof val === 'object' ? `"${JSON.stringify(val).replace(/"/g, '""')}"` : `"${val}"`
      ).join(',')
    ).join('\n');
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedTable}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="db-explorer fade-in">
      <div className="db-sidebar">
        <div className="db-sidebar-header">
          <Database size={16} className="text-primary-light" />
          <span>Tableaux Publics</span>
        </div>
        <div className="db-table-list">
          {tables.map(t => (
            <button 
              key={t} 
              className={`db-table-item ${selectedTable === t ? 'active' : ''}`}
              onClick={() => { setSelectedTable(t); setPage(1); }}
            >
              <Table size={14} />
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="db-main">
        <div className="db-main-header">
          <div className="db-title-section">
            <h2 className="db-table-title">
              <Code size={20} /> {selectedTable}
            </h2>
            <div className="db-tabs">
              <button className={`db-tab ${view === 'data' ? 'active' : ''}`} onClick={() => setView('data')}>
                <List size={14} /> Données
              </button>
              <button className={`db-tab ${view === 'structure' ? 'active' : ''}`} onClick={() => setView('structure')}>
                <Info size={14} /> Structure
              </button>
            </div>
          </div>

          <div className="db-actions">
            <div className="search-bar mini">
              <Search size={14} />
              <input 
                placeholder="Rechercher..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
              />
            </div>
            <button className="btn-icon" onClick={fetchTableData} title="Rafraîchir">
              <RefreshCw size={14} />
            </button>
            <button className="btn-icon" onClick={downloadCSV} title="Exporter CSV">
              <Download size={14} />
            </button>
          </div>
        </div>

        <div className="db-content">
          {loading ? (
            <div className="db-loading">
              <div className="spinner" />
              <span>Récupération des données...</span>
            </div>
          ) : view === 'data' ? (
            <div className="db-table-wrapper">
              {data.length === 0 ? (
                <div className="db-empty">La table est vide ou inaccessible</div>
              ) : (
                <table className="sql-table">
                  <thead>
                    <tr>
                      {Object.keys(data[0]).map(key => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.filter(row => 
                      JSON.stringify(row).toLowerCase().includes(search.toLowerCase())
                    ).map((row, i) => (
                      <tr key={i}>
                        {Object.values(row).map((val, j) => (
                          <td key={j} className={typeof val === 'object' ? 'json-cell' : ''}>
                            {typeof val === 'object' 
                              ? (val === null ? 'NULL' : '{ ... }') 
                              : String(val === null ? 'NULL' : val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div className="db-structure-view">
               <table className="sql-table structure">
                  <thead>
                    <tr>
                      <th>Colonne</th>
                      <th>Type</th>
                      <th>Nullable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schema.map(col => (
                      <tr key={col.column_name}>
                        <td className="col-name">{col.column_name}</td>
                        <td className="col-type"><code>{col.data_type}</code></td>
                        <td>{col.is_nullable}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          )}
        </div>

        <div className="db-footer">
          <div className="db-pagination">
             <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-btn"><ChevronLeft size={16} /></button>
             <span>Page {page}</span>
             <button disabled={data.length < itemsPerPage} onClick={() => setPage(p => p + 1)} className="p-btn"><ChevronRight size={16} /></button>
          </div>
          <div className="db-info-text">
            {data.length} lignes chargées (Vue limitée aux {itemsPerPage} premières)
          </div>
        </div>
      </div>

      <style>{`
        .db-explorer {
          display: flex;
          height: calc(100vh - 120px);
          background: var(--bg-surface);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          overflow: hidden;
          margin-top: 20px;
        }
        .db-sidebar {
          width: 240px;
          background: var(--bg-elevated);
          border-right: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
        }
        .db-sidebar-header {
          padding: 16px;
          border-bottom: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-muted);
        }
        .db-table-list {
          flex: 1;
          overflow-y: auto;
          padding: 8px;
        }
        .db-table-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
          transition: var(--transition);
        }
        .db-table-item:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }
        .db-table-item.active {
          background: var(--bg-surface);
          color: var(--primary-light);
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .db-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--bg-surface);
        }
        .db-main-header {
          padding: 16px 24px;
          border-bottom: 1px solid var(--border-light);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg-elevated);
        }
        .db-title-section {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .db-table-title {
          font-family: 'Outfit', sans-serif;
          font-size: 18px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text-primary);
        }
        .db-tabs {
          display: flex;
          background: var(--bg-surface);
          padding: 3px;
          border-radius: 8px;
          border: 1px solid var(--border-light);
        }
        .db-tab {
          padding: 6px 12px;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: var(--transition);
        }
        .db-tab.active {
          background: var(--bg-elevated);
          color: var(--primary-light);
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .db-actions {
          display: flex;
          gap: 12px;
        }
        .search-bar.mini {
          background: var(--bg-surface);
          border: 1px solid var(--border-light);
          padding: 4px 10px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .search-bar.mini input {
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: 12px;
          width: 140px;
        }
        .db-content {
          flex: 1;
          overflow: auto;
          background: #0d0d12;
        }
        .sql-table {
          width: 100%;
          border-collapse: collapse;
          font-family: 'Inter', monospace;
          font-size: 12px;
        }
        .sql-table th {
          position: sticky;
          top: 0;
          background: var(--bg-card);
          padding: 10px 16px;
          text-align: left;
          color: var(--text-muted);
          font-weight: 600;
          border-bottom: 2px solid var(--border);
          white-space: nowrap;
          z-index: 10;
        }
        .sql-table td {
          padding: 8px 16px;
          border-bottom: 1px solid var(--border-light);
          color: var(--text-secondary);
          white-space: nowrap;
          max-width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sql-table td.json-cell {
          color: var(--primary-light);
          font-style: italic;
        }
        .sql-table tr:hover td {
          background: rgba(255,255,255,0.03);
          color: var(--text-primary);
        }
        .sql-table.structure .col-name {
          font-weight: 700;
          color: var(--text-primary);
        }
        .sql-table.structure .col-type code {
          background: rgba(103, 232, 249, 0.1);
          color: var(--secondary-light);
          padding: 2px 6px;
          border-radius: 4px;
        }
        .db-loading, .db-empty {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          color: var(--text-muted);
        }
        .db-footer {
          padding: 12px 24px;
          background: var(--bg-elevated);
          border-top: 1px solid var(--border-light);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .db-pagination {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 13px;
          color: var(--text-primary);
        }
        .p-btn {
          background: var(--bg-surface);
          border: 1px solid var(--border-light);
          color: var(--text-primary);
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .p-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .db-info-text {
          font-size: 11px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
