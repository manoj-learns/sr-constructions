import { useEffect, useState } from 'react';
import { getContacts, getProjects, getOngoing, subscribeLiveViews, getVisitStats } from '../services/db';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ contacts: 0, unread: 0, projects: 0, ongoing: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liveViews, setLiveViews] = useState(0);
  const [hourly, setHourly] = useState(Array(24).fill(0));
  const [daily, setDaily] = useState(Array(7).fill(0));

  useEffect(() => {
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
      .catch((e) => { setError('Could not connect to Firebase: ' + e.message); setLoading(false); });
  }, []);

  useEffect(() => {
    const unsub = subscribeLiveViews(setLiveViews);
    return unsub;
  }, []);

  useEffect(() => {
    getVisitStats(30).then((visits) => {
      const h = Array(24).fill(0);
      const d = Array(7).fill(0);
      visits.forEach((v) => {
        if (v.hour !== undefined) h[v.hour]++;
        if (v.day !== undefined) d[v.day]++;
      });
      setHourly(h);
      setDaily(d);
    }).catch(() => {});
  }, []);

  const maxH = Math.max(...hourly, 1);
  const maxD = Math.max(...daily, 1);

  return (
    <div>
      <h1 style={s.heading}>Dashboard</h1>
      <p style={s.sub}>Welcome back. Here's an overview of your site.</p>

      {error && (
        <div style={s.errorBox}>
          <strong>Firebase connection error</strong><br />{error}<br /><br />
          <strong>Fix:</strong> Go to Firebase Console → Firestore → Rules and set:
          <pre style={s.pre}>{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}</pre>
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

      {/* Live views */}
      <div style={{ ...s.section, display: 'flex', alignItems: 'center', gap: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={s.pulse}></span>
          <div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#7de89a', fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>{liveViews}</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4, letterSpacing: 1 }}>LIVE VISITORS RIGHT NOW</div>
          </div>
        </div>
        <div style={{ color: '#555', fontSize: 13 }}>Updated in real-time · counts unique sessions active in last 5 minutes</div>
      </div>

      {/* Hourly traffic */}
      <div style={{ ...s.section, marginBottom: 20 }}>
        <h2 style={s.sectionTitle}>Traffic by Hour of Day <span style={s.badge}>Last 30 days</span></h2>
        <div style={s.chartWrap}>
          {hourly.map((count, h) => (
            <div key={h} style={s.barCol}>
              <div style={{ ...s.bar, height: `${Math.round((count / maxH) * 100)}%`, background: count === Math.max(...hourly) ? '#b8943f' : '#2a2a2a' }} title={`${count} visits`} />
              <div style={s.barLabel}>{h === 0 ? '12a' : h < 12 ? `${h}a` : h === 12 ? '12p' : `${h - 12}p`}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily traffic */}
      <div style={{ ...s.section, marginBottom: 20 }}>
        <h2 style={s.sectionTitle}>Traffic by Day of Week <span style={s.badge}>Last 30 days</span></h2>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', height: 120, padding: '0 8px' }}>
          {daily.map((count, d) => (
            <div key={d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 6, height: '100%' }}>
              <div style={{ fontSize: 11, color: '#666' }}>{count || ''}</div>
              <div style={{ width: '100%', background: count === Math.max(...daily) ? '#b8943f' : '#2a2a2a', height: `${Math.round((count / maxD) * 80)}%`, minHeight: count > 0 ? 4 : 0, borderRadius: 2 }} title={`${count} visits`} />
              <div style={{ fontSize: 12, color: '#888' }}>{DAYS[d]}</div>
            </div>
          ))}
        </div>
      </div>

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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 20 },
  card: { background: '#1a1a1a', border: '1px solid rgba(255,255,255,.07)', padding: '28px 24px', borderRadius: 4 },
  statValue: { fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 800, color: '#fff', lineHeight: 1 },
  statLabel: { fontSize: 13, color: '#888', marginTop: 6, letterSpacing: 1 },
  section: { background: '#1a1a1a', border: '1px solid rgba(255,255,255,.07)', padding: '24px 28px', marginBottom: 20, borderRadius: 4 },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 20 },
  badge: { fontSize: 11, color: '#666', fontFamily: 'Barlow, sans-serif', fontWeight: 400, letterSpacing: 1, marginLeft: 10 },
  actions: { display: 'flex', gap: 14, flexWrap: 'wrap' },
  actionBtn: { display: 'inline-flex', alignItems: 'center', background: '#111', border: '1px solid rgba(184,148,63,.2)', color: '#c8c0b0', padding: '12px 20px', textDecoration: 'none', fontSize: 14 },
  pulse: {
    display: 'inline-block', width: 12, height: 12, borderRadius: '50%',
    background: '#7de89a', boxShadow: '0 0 0 0 rgba(125,232,154,0.4)',
    animation: 'live-pulse 2s infinite',
  },
  chartWrap: { display: 'flex', gap: 3, alignItems: 'flex-end', height: 120 },
  barCol: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 4, height: '100%' },
  bar: { width: '100%', borderRadius: '2px 2px 0 0', minHeight: 2, transition: 'height 0.3s' },
  barLabel: { fontSize: 9, color: '#555', whiteSpace: 'nowrap' },
};
