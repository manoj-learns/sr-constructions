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
      <header style={s.topbar}>
        <div style={s.brand}>
          <div style={s.brandIcon}><span style={s.brandText}>SR</span></div>
          <div>
            <div style={s.brandName}>SR Constructions</div>
            <div style={s.brandSub}>Admin Panel</div>
          </div>
        </div>

        <nav style={s.nav}>
          {NAV.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              style={{ ...s.navItem, ...(pathname.startsWith(to) ? s.navActive : {}) }}
            >
              <i className={`fa ${icon}`}></i>
              {label}
            </Link>
          ))}
        </nav>

        <button onClick={logout} style={s.logout}>
          <i className="fa fa-sign-out-alt" style={{ marginRight: 6 }}></i> Logout
        </button>
      </header>

      <main style={s.main}>
        <Outlet />
      </main>
    </div>
  );
}

const s = {
  shell: { minHeight: '100vh', background: '#141414', fontFamily: 'Barlow, sans-serif' },
  topbar: {
    position: 'fixed', top: 0, left: 0, right: 0, height: 62, zIndex: 200,
    background: '#0e0e0e', borderBottom: '1px solid rgba(184,148,63,.2)',
    display: 'flex', alignItems: 'center', padding: '0 28px', gap: 24,
    boxShadow: '0 2px 12px rgba(0,0,0,.4)',
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
    paddingRight: 24, borderRight: '1px solid rgba(255,255,255,.07)',
  },
  brandIcon: {
    width: 34, height: 34, background: '#b8943f', display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
  },
  brandText: { fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 14, color: '#0e0e0e' },
  brandName: { fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, color: '#f5f0e8', lineHeight: 1.2 },
  brandSub: { fontSize: 10, color: '#666', letterSpacing: 1.5, textTransform: 'uppercase' },
  nav: { display: 'flex', alignItems: 'center', gap: 2, flex: 1 },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px',
    color: '#888', textDecoration: 'none', fontSize: 13,
    fontFamily: 'Barlow, sans-serif', borderRadius: 4, transition: 'all .15s',
    whiteSpace: 'nowrap',
  },
  navActive: { background: 'rgba(184,148,63,.12)', color: '#b8943f' },
  logout: {
    flexShrink: 0, background: 'none', border: '1px solid rgba(255,255,255,.1)',
    color: '#888', fontSize: 12, cursor: 'pointer', padding: '7px 16px',
    borderRadius: 4, display: 'flex', alignItems: 'center',
    fontFamily: 'Barlow, sans-serif', transition: 'all .15s',
  },
  main: { minHeight: '100vh', padding: '102px 40px 40px', background: '#141414' },
};
