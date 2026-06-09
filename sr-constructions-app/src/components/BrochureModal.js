import { useState } from 'react';
import { addContact, cloudinaryUrl } from '../services/db';

export default function BrochureModal({ projectName, brochureUrl, onClose }) {
  const [form, setForm] = useState({ Name: '', 'Phone number': '', Email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Must call window.open synchronously inside the click handler — browsers
    // block popups opened after an await (user-gesture context is lost).
    window.open(cloudinaryUrl(brochureUrl, 'fl_attachment'), '_blank', 'noopener,noreferrer');

    // Save contact in background — non-blocking, doesn't gate the download
    addContact({
      ...form,
      'Project Type': 'Brochure Download',
      Message: `Requested brochure for: ${projectName}`,
      source: 'brochure',
    }).catch(() => {});

    setDone(true);
    setSubmitting(false);
    setTimeout(onClose, 2500);
  };

  return (
    <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <button style={s.closeBtn} onClick={onClose}><i className="fa fa-times"></i></button>

        <div style={s.icon}><i className="fa fa-file-pdf" style={{ color: '#b8943f', fontSize: 28 }}></i></div>
        <h3 style={s.title}>Download Brochure</h3>
        <p style={s.sub}>Share your details to download the <strong style={{ color: '#b8943f' }}>{projectName}</strong> brochure.</p>

        {done ? (
          <div style={s.success}>
            <i className="fa fa-check-circle" style={{ fontSize: 28, color: '#7de89a', marginBottom: 8 }}></i>
            <div>Your brochure download has started!</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={s.form}>
            <input style={s.input} placeholder="Full Name" value={form.Name} onChange={set('Name')} required />
            <input style={s.input} placeholder="Phone Number" type="tel" value={form['Phone number']} onChange={set('Phone number')} required />
            <input style={s.input} placeholder="Email Address (optional)" type="email" value={form.Email} onChange={set('Email')} />
            <button type="submit" style={s.submit} disabled={submitting}>
              {submitting ? 'Processing…' : <><i className="fa fa-download" style={{ marginRight: 8 }}></i>Download Brochure</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const s = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
    zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
  },
  modal: {
    background: '#0e0e0e', border: '1px solid rgba(184,148,63,.3)', borderRadius: 4,
    padding: '40px 36px 32px', maxWidth: 400, width: '100%', position: 'relative',
    boxShadow: '0 20px 60px rgba(0,0,0,.7)', textAlign: 'center',
  },
  closeBtn: {
    position: 'absolute', top: 14, right: 16, background: 'none',
    border: 'none', color: '#666', fontSize: 16, cursor: 'pointer', padding: 4,
  },
  icon: { marginBottom: 16 },
  title: {
    fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700,
    color: '#f5f0e8', margin: '0 0 10px',
  },
  sub: { color: '#888', fontSize: 14, lineHeight: 1.6, marginBottom: 24 },
  form: { display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' },
  input: {
    background: '#1a1a1a', border: '1px solid rgba(255,255,255,.1)', color: '#f5f0e8',
    padding: '12px 16px', fontSize: 14, outline: 'none', fontFamily: 'Barlow, sans-serif', borderRadius: 2,
  },
  submit: {
    background: '#b8943f', color: '#0e0e0e', border: 'none',
    fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
    fontSize: 13, letterSpacing: 2, textTransform: 'uppercase',
    padding: '14px 24px', cursor: 'pointer', marginTop: 4,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  success: {
    textAlign: 'center', color: '#c8c0b0', fontSize: 14,
    display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
};
