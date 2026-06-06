import { useEffect } from 'react';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: 'fa-home' },
  { to: '/admin/contacts', label: 'Contacts', icon: 'fa-envelope' },
  { to: '/admin/projects', label: 'Projects', icon: 'fa-building' },
  { to: '/admin/ongoing', label: 'Ongoing', icon: 'fa-hard-hat' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!sessionStorage.getItem('admin_auth')) navigate('/admin');
  }, [navigate]);

  const logout = () => {
    sessionStorage.removeItem('admin_auth');
    navigate('/admin');
  };

  return (
    <div style={s.shell}>
      <aside style={s.sidebar}>
        <div style={s.brand}>
          <div style={s.brandIcon}><span style={s.brandText}>SR</span></div>
          <div>
            <div style={s.brandName}>SR Constructions</div>
            <div style={s.brandSub}>Admin Panel</div>
          </div>
        </div>
        <nav style={s.nav}>
          {NAV.map(({ to, label, icon }) => (
            <Link key={to} to={to} style={{ ...s.navItem, ...(pathname === to ? s.navActive : {}) }}>
              <i className={`fa ${icon}`} style={s.navIcon}></i>
              {label}
            </Link>
          ))}
        </nav>
        <button onClick={logout} style={s.logout}>
          <i className="fa fa-sign-out-alt" style={{ marginRight: 8 }}></i> Logout
        </button>
      </aside>
      <main style={s.main}>
        <Outlet />
      </main>
    </div>
  );
}

const s = {
  shell: { display: 'flex', minHeight: '100vh', background: '#111', fontFamily: 'Barlow, sans-serif' },
  sidebar: { width: 240, background: '#0e0e0e', borderRight: '1px solid rgba(184,148,63,.15)', display: 'flex', flexDirection: 'column', padding: '32px 0', flexShrink: 0, position: 'fixed', left: 0, top: 0, height: '100vh', zIndex: 100, overflowY: 'auto' },
  brand: { display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px 32px', borderBottom: '1px solid rgba(184,148,63,.1)', marginBottom: 24 },
  brandIcon: { width: 40, height: 40, background: '#b8943f', display: 'flex', alignItems: 'center', justifyContent: 'center', clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)', flexShrink: 0 },
  brandText: { fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 16, color: '#0e0e0e' },
  brandName: { fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: '#fff' },
  brandSub: { fontSize: 11, color: '#888', letterSpacing: 1 },
  nav: { display: 'flex', flexDirection: 'column', gap: 4, padding: '0 12px', flex: 1 },
  navItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', color: '#888880', textDecoration: 'none', fontSize: 14, borderRadius: 4, transition: 'all .2s' },
  navActive: { background: 'rgba(184,148,63,.12)', color: '#b8943f' },
  navIcon: { width: 16, textAlign: 'center' },
  logout: { margin: '0 12px', padding: '10px 12px', background: 'none', border: '1px solid rgba(255,255,255,.08)', color: '#888', fontSize: 13, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center' },
  main: { flex: 1, padding: 40, overflowY: 'auto', background: '#141414', marginLeft: 240, minHeight: '100vh' },
};
