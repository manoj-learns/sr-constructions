import { useEffect, useState } from 'react';
import { getContacts, markContactRead, deleteContact } from '../services/db';

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = () => {
    setLoading(true);
    getContacts().then((data) => { setContacts(data); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleRead = async (id) => {
    await markContactRead(id);
    setContacts((prev) => prev.map((c) => c.id === id ? { ...c, read: true } : c));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    await deleteContact(id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const filtered = filter === 'unread' ? contacts.filter((c) => !c.read) : contacts;

  return (
    <div>
      <h1 style={s.heading}>Enquiries</h1>
      <div style={s.toolbar}>
        <div style={s.filters}>
          {['all', 'unread'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{ ...s.filterBtn, ...(filter === f ? s.filterActive : {}) }}>
              {f === 'all' ? `All (${contacts.length})` : `Unread (${contacts.filter((c) => !c.read).length})`}
            </button>
          ))}
        </div>
      </div>

      {loading ? <p style={s.muted}>Loading…</p> : filtered.length === 0 ? (
        <div style={s.empty}>
          <i className="fa fa-inbox" style={{ fontSize: 40, color: '#444', marginBottom: 12 }}></i>
          <p>No enquiries yet.</p>
        </div>
      ) : (
        <div style={s.list}>
          {filtered.map((c) => (
            <div key={c.id} style={{ ...s.card, ...(c.read ? {} : s.cardUnread) }}>
              <div style={s.cardHeader}>
                <div>
                  <span style={s.name}>{c.Name || c.name || '—'}</span>
                  {!c.read && <span style={s.badge}>New</span>}
                </div>
                <div style={s.meta}>{c.createdAt?.toDate ? c.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}</div>
              </div>
              <div style={s.details}>
                <Detail icon="fa-phone" label={c['Phone number'] || c.phone || '—'} />
                <Detail icon="fa-envelope" label={c.Email || c.email || '—'} />
                <Detail icon="fa-tag" label={c['Project Type'] || c.projectType || '—'} />
              </div>
              {(c.Message || c.message) && (
                <div style={s.message}>{c.Message || c.message}</div>
              )}
              <div style={s.actions}>
                {!c.read && (
                  <button onClick={() => handleRead(c.id)} style={s.btnSecondary}>
                    <i className="fa fa-check" style={{ marginRight: 6 }}></i> Mark as Read
                  </button>
                )}
                <button onClick={() => handleDelete(c.id)} style={s.btnDanger}>
                  <i className="fa fa-trash" style={{ marginRight: 6 }}></i> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Detail({ icon, label }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#888', marginRight: 20 }}>
      <i className={`fa ${icon}`} style={{ color: '#b8943f', fontSize: 12 }}></i> {label}
    </span>
  );
}

const s = {
  heading: { fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 24 },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  filters: { display: 'flex', gap: 8 },
  filterBtn: { background: '#1a1a1a', border: '1px solid rgba(255,255,255,.08)', color: '#888', padding: '8px 16px', cursor: 'pointer', fontSize: 13 },
  filterActive: { background: 'rgba(184,148,63,.15)', border: '1px solid #b8943f', color: '#b8943f' },
  muted: { color: '#888' },
  empty: { textAlign: 'center', padding: '80px 0', color: '#555' },
  list: { display: 'flex', flexDirection: 'column', gap: 16 },
  card: { background: '#1a1a1a', border: '1px solid rgba(255,255,255,.07)', padding: '24px 28px' },
  cardUnread: { borderLeft: '3px solid #b8943f' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  name: { fontSize: 18, fontWeight: 600, color: '#fff', fontFamily: "'Playfair Display', serif" },
  badge: { marginLeft: 10, background: '#b8943f', color: '#0e0e0e', fontSize: 10, fontWeight: 700, letterSpacing: 1, padding: '2px 8px', textTransform: 'uppercase', verticalAlign: 'middle' },
  meta: { fontSize: 12, color: '#555' },
  details: { marginBottom: 12 },
  message: { background: '#111', border: '1px solid rgba(255,255,255,.05)', padding: '12px 16px', fontSize: 14, color: '#c8c0b0', lineHeight: 1.6, marginBottom: 16 },
  actions: { display: 'flex', gap: 10 },
  btnSecondary: { background: 'none', border: '1px solid rgba(184,148,63,.4)', color: '#b8943f', padding: '8px 16px', cursor: 'pointer', fontSize: 13 },
  btnDanger: { background: 'none', border: '1px solid rgba(232,118,118,.4)', color: '#e87676', padding: '8px 16px', cursor: 'pointer', fontSize: 13 },
};
