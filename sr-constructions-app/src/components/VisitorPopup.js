import { useState, useEffect } from 'react';
import { addContact } from '../services/db';

export default function VisitorPopup() {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ Name: '', 'Phone number': '', Email: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('popup_shown')) return;
    const t = setTimeout(() => setShow(true), 2500);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    sessionStorage.setItem('popup_shown', '1');
    setShow(false);
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addContact({ ...form, 'Project Type': 'General Enquiry', Message: 'Popup enquiry', source: 'popup' });
    } catch { /* non-blocking */ }
    setSubmitted(true);
    setSubmitting(false);
    sessionStorage.setItem('popup_shown', '1');
    setTimeout(close, 2200);
  };

  if (!show) return null;

  return (
    <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && close()}>
      <div style={s.modal}>
        <button style={s.closeBtn} onClick={close} aria-label="Close"><i className="fa fa-times"></i></button>

        <div style={s.badge}><i className="fa fa-hard-hat" style={{ marginRight: 6 }}></i> SR Constructions</div>
        <h2 style={s.title}>Find Your Perfect Property</h2>
        <p style={s.sub}>Leave your details and our team will reach out with the latest projects, plots, and exclusive offers.</p>

        {submitted ? (
          <div style={s.success}>
            <i className="fa fa-check-circle" style={{ fontSize: 32, color: '#7de89a', marginBottom: 10 }}></i>
            <div>Thank you! We'll be in touch shortly.</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={s.form}>
            <input
              style={s.input}
              placeholder="Full Name"
              value={form.Name}
              onChange={set('Name')}
              required
            />
            <input
              style={s.input}
              placeholder="Phone Number"
              type="tel"
              value={form['Phone number']}
              onChange={set('Phone number')}
              required
            />
            <input
              style={s.input}
              placeholder="Email Address (optional)"
              type="email"
              value={form.Email}
              onChange={set('Email')}
            />
            <button type="submit" style={s.submit} disabled={submitting}>
              {submitting ? 'Submitting…' : 'Get Project Updates'}
              <i className="fa fa-arrow-right" style={{ marginLeft: 8 }}></i>
            </button>
            <button type="button" style={s.skip} onClick={close}>No thanks, I'll browse on my own</button>
          </form>
        )}
      </div>
    </div>
  );
}

const s = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
    zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
  },
  modal: {
    background: '#0e0e0e', border: '1px solid rgba(184,148,63,.3)', borderRadius: 4,
    padding: '44px 40px 36px', maxWidth: 460, width: '100%', position: 'relative',
    boxShadow: '0 20px 60px rgba(0,0,0,.7)',
  },
  closeBtn: {
    position: 'absolute', top: 14, right: 16, background: 'none', border: 'none',
    color: '#666', fontSize: 16, cursor: 'pointer', padding: 4,
  },
  badge: {
    display: 'inline-flex', alignItems: 'center',
    background: 'rgba(184,148,63,.1)', border: '1px solid rgba(184,148,63,.25)',
    color: '#b8943f', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
    padding: '4px 12px', marginBottom: 16,
  },
  title: {
    fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700,
    color: '#f5f0e8', margin: '0 0 10px', lineHeight: 1.3,
  },
  sub: { color: '#888', fontSize: 14, lineHeight: 1.6, marginBottom: 24 },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  input: {
    background: '#1a1a1a', border: '1px solid rgba(255,255,255,.1)', color: '#f5f0e8',
    padding: '12px 16px', fontSize: 14, outline: 'none', fontFamily: 'Barlow, sans-serif',
    borderRadius: 2,
  },
  submit: {
    background: '#b8943f', color: '#0e0e0e', border: 'none',
    fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
    fontSize: 13, letterSpacing: 2, textTransform: 'uppercase',
    padding: '14px 24px', cursor: 'pointer', marginTop: 4,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  skip: {
    background: 'none', border: 'none', color: '#555', fontSize: 12,
    cursor: 'pointer', textAlign: 'center', padding: '4px 0',
  },
  success: {
    textAlign: 'center', color: '#c8c0b0', fontSize: 15,
    padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
};
