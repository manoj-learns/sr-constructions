import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, deleteProject, upsertProject } from '../services/db';
import { PROJECTS } from '../data/projects';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    setError('');
    getProjects()
      .then((data) => { setProjects(data); setLoading(false); })
      .catch((e) => { setError('Could not load projects: ' + e.message); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert('Delete failed: ' + e.message);
    }
  };

  const handleExport = async () => {
    setSyncing(true);
    setSyncMsg('');
    try {
      for (const p of PROJECTS) {
        const { id, ...data } = p;
        await upsertProject(id, data);
      }
      setSyncMsg(`✓ Exported ${PROJECTS.length} past projects to Firebase successfully.`);
      load();
    } catch (e) {
      const msg = 'Export failed: ' + e.message;
      setSyncMsg('✗ ' + msg);
      alert(msg + '\n\nMake sure Firestore rules allow read/write in Firebase Console.');
    }
    setSyncing(false);
  };

  return (
    <div>
      <div style={s.header}>
        <h1 style={s.heading}>Past Projects</h1>
        <div style={s.headerBtns}>
          <button style={syncing ? s.syncBtnDisabled : s.syncBtn} onClick={handleExport} disabled={syncing}>
            <i className="fa fa-database" style={{ marginRight: 8 }}></i>
            {syncing ? 'Exporting…' : 'Export to Firebase'}
          </button>
          <button style={s.addBtn} onClick={() => navigate('/admin/projects/new')}>
            <i className="fa fa-plus" style={{ marginRight: 8 }}></i> Add Project
          </button>
        </div>
      </div>

      {syncMsg && (
        <div style={syncMsg.startsWith('✓') ? s.successMsg : s.errorMsg}>{syncMsg}</div>
      )}

      {error && (
        <div style={s.error}>
          <i className="fa fa-exclamation-triangle" style={{ marginRight: 8 }}></i>
          {error}
          <br /><small>Make sure Firestore rules allow read/write in Firebase Console.</small>
        </div>
      )}

      {loading ? (
        <p style={s.muted}>Loading…</p>
      ) : !error && projects.length === 0 ? (
        <div style={s.empty}>
          <i className="fa fa-building" style={{ fontSize: 40, color: '#444', marginBottom: 12 }}></i>
          <p>No projects yet. Add your first one or use "Export to Firebase" to import the default data.</p>
          <button style={s.addBtn} onClick={() => navigate('/admin/projects/new')}>Add Project</button>
        </div>
      ) : (
        <div style={s.grid}>
          {projects.map((p) => (
            <div key={p.id} style={s.card}>
              {p.img && <img src={p.img} alt={p.name} style={s.img} />}
              <div style={s.cardBody}>
                <div style={s.tag}>{p.tag}</div>
                <div style={s.name}>{p.name}</div>
                <div style={s.loc}><i className="fa fa-map-marker-alt" style={{ color: '#b8943f', marginRight: 6 }}></i>{p.location}</div>
                <div style={s.actions}>
                  <button style={s.editBtn} onClick={() => navigate(`/admin/projects/${p.id}`)}>
                    <i className="fa fa-edit" style={{ marginRight: 6 }}></i> Edit
                  </button>
                  <button style={s.delBtn} onClick={() => handleDelete(p.id, p.name)}>
                    <i className="fa fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 12 },
  heading: { fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: '#fff' },
  headerBtns: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  addBtn: { background: '#b8943f', color: '#0e0e0e', border: 'none', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '12px 24px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' },
  syncBtn: { background: 'rgba(184,148,63,.15)', border: '1px solid rgba(184,148,63,.4)', color: '#b8943f', padding: '12px 20px', cursor: 'pointer', fontSize: 13, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 1, textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center' },
  syncBtnDisabled: { background: '#222', border: '1px solid #333', color: '#555', padding: '12px 20px', cursor: 'not-allowed', fontSize: 13, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 1, textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center' },
  successMsg: { background: 'rgba(125,232,154,.08)', border: '1px solid rgba(125,232,154,.3)', color: '#7de89a', padding: '12px 16px', fontSize: 14, marginBottom: 20 },
  errorMsg: { background: 'rgba(232,118,118,.08)', border: '1px solid rgba(232,118,118,.3)', color: '#e87676', padding: '12px 16px', fontSize: 14, marginBottom: 20 },
  error: { background: 'rgba(232,118,118,.1)', border: '1px solid rgba(232,118,118,.4)', color: '#e87676', padding: '16px 20px', marginBottom: 24, fontSize: 14, lineHeight: 1.6 },
  muted: { color: '#888' },
  empty: { textAlign: 'center', padding: '60px 0', color: '#555', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 },
  card: { background: '#1a1a1a', border: '1px solid rgba(255,255,255,.07)', overflow: 'hidden' },
  img: { width: '100%', height: 160, objectFit: 'cover', display: 'block' },
  cardBody: { padding: '16px 20px' },
  tag: { fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#b8943f', marginBottom: 6 },
  name: { fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6 },
  loc: { fontSize: 12, color: '#888', marginBottom: 16 },
  actions: { display: 'flex', gap: 8 },
  editBtn: { flex: 1, background: 'rgba(184,148,63,.1)', border: '1px solid rgba(184,148,63,.25)', color: '#b8943f', padding: '8px 0', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  delBtn: { background: 'rgba(232,118,118,.1)', border: '1px solid rgba(232,118,118,.25)', color: '#e87676', padding: '8px 16px', cursor: 'pointer', fontSize: 13 },
};
