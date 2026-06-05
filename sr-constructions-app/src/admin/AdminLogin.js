import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ADMIN_PASSWORD = 'srconstructions2007';

export default function AdminLogin() {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', '1');
      navigate('/admin/dashboard');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}><span style={styles.logoText}>SR</span></div>
        </div>
        <h1 style={styles.title}>Admin Panel</h1>
        <p style={styles.subtitle}>SR Constructions — Internal Dashboard</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setError(''); }}
            style={styles.input}
            placeholder="Enter admin password"
            autoFocus
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.btn}>Sign In</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0e0e0e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { background: '#1a1a1a', border: '1px solid rgba(184,148,63,.2)', padding: '52px 48px', width: '100%', maxWidth: 420, textAlign: 'center' },
  logo: { display: 'flex', justifyContent: 'center', marginBottom: 24 },
  logoIcon: { width: 56, height: 56, background: '#b8943f', display: 'flex', alignItems: 'center', justifyContent: 'center', clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' },
  logoText: { fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 20, color: '#0e0e0e' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 8 },
  subtitle: { color: '#888880', fontSize: 14, marginBottom: 36 },
  form: { textAlign: 'left' },
  label: { display: 'block', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#b8943f', marginBottom: 8 },
  input: { width: '100%', background: '#2c2c2c', border: '1px solid rgba(255,255,255,.1)', color: '#f5f0e8', fontFamily: 'Barlow, sans-serif', fontSize: 15, padding: '14px 18px', outline: 'none', boxSizing: 'border-box', borderRadius: 0 },
  error: { color: '#e87676', fontSize: 13, marginTop: 8 },
  btn: { marginTop: 20, width: '100%', background: '#b8943f', color: '#0e0e0e', border: 'none', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', padding: '16px 0', cursor: 'pointer' },
};
