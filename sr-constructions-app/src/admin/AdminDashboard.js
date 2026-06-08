import { useEffect, useState } from 'react';
import { getContacts, getProjects, getOngoing } from '../services/db';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ contacts: 0, unread: 0, projects: 0, ongoing: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    Promise.all([getContacts(), getProjects(), getOngoing()])
      .then(([contacts, projects, ongoing]) => {
        setStats({
          contacts: contacts.length,
          unread: contacts.filter((c) => !c.read).length,
          projects: projects.length,
          ongoing: ongoing.length,
        });
        setLoading(false);
      })
      .catch((e) => {
        setError('Could not connect to Firebase: ' + e.message);
        setLoading(false);
      });
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h1 style={s.heading}>Dashboard</h1>
      <p style={s.sub}>Welcome back. Here's an overview of your site.</p>

      {error && (
        <div style={s.errorBox}>
          <strong>Firebase connection error</strong><br />
          {error}<br /><br />
          <strong>Fix:</strong> Go to Firebase Console → Firestore → Rules and set:
          <pre style={s.pre}>{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}</pre>
          Do the same for Storage rules. Then refresh this page.
        </div>
      )}

      {!loading && !error && (
        <div style={s.grid}>
          <StatCard icon="fa-envelope" label="Total Enquiries" value={stats.contacts} accent="#b8943f" />
          <StatCard icon="fa-bell" label="Unread Enquiries" value={stats.unread} accent="#e87676" />
          <StatCard icon="fa-building" label="Past Projects" value={stats.projects} accent="#7de89a" />
          <StatCard icon="fa-hard-hat" label="Ongoing Projects" value={stats.ongoing} accent="#7bb8f0" />
        </div>
      )}

      {!error && (
        <div style={s.section}>
          <h2 style={s.sectionTitle}>Quick Actions</h2>
          <div style={s.actions}>
            <ActionBtn to="/admin/contacts" icon="fa-envelope" label="View Enquiries" />
            <ActionBtn to="/admin/projects/new" icon="fa-plus" label="Add Past Project" />
            <ActionBtn to="/admin/ongoing/new" icon="fa-plus" label="Add Ongoing Project" />
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, accent }) {
  return (
    <div style={{ ...s.card, borderTop: `3px solid ${accent}` }}>
      <i className={`fa ${icon}`} style={{ fontSize: 28, color: accent, marginBottom: 16 }}></i>
      <div style={s.statValue}>{value}</div>
      <div style={s.statLabel}>{label}</div>
    </div>
  );
}

function ActionBtn({ to, icon, label }) {
  return (
    <a href={to} style={s.actionBtn}>
      <i className={`fa ${icon}`} style={{ marginRight: 8, color: '#b8943f' }}></i>
      {label}
    </a>
  );
}

const s = {
  heading: { fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 8 },
  sub: { color: '#888', fontSize: 15, marginBottom: 32 },
  errorBox: { background: 'rgba(232,118,118,.08)', border: '1px solid rgba(232,118,118,.3)', color: '#e87676', padding: '20px 24px', marginBottom: 32, fontSize: 14, lineHeight: 1.7 },
  pre: { background: '#111', padding: '12px 16px', marginTop: 12, fontSize: 12, color: '#c8c0b0', overflowX: 'auto', fontFamily: 'monospace' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 40 },
  card: { background: '#1a1a1a', border: '1px solid rgba(255,255,255,.07)', padding: '28px 24px', borderRadius: 4 },
  statValue: { fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 800, color: '#fff', lineHeight: 1 },
  statLabel: { fontSize: 13, color: '#888', marginTop: 6, letterSpacing: 1 },
  section: { background: '#1a1a1a', border: '1px solid rgba(255,255,255,.07)', padding: '28px 32px', marginBottom: 20 },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 10 },
  hint: { color: '#888', fontSize: 14, lineHeight: 1.6, marginBottom: 20 },
  actions: { display: 'flex', gap: 14, flexWrap: 'wrap' },
  actionBtn: { display: 'inline-flex', alignItems: 'center', background: '#111', border: '1px solid rgba(184,148,63,.2)', color: '#c8c0b0', padding: '12px 20px', textDecoration: 'none', fontSize: 14 },
};
