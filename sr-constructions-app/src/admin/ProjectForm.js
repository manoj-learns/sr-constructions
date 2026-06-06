import { useState } from 'react';
import { uploadImage, uploadFile } from '../services/db';

export default function ProjectForm({ initial = {}, onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    name: initial.name || '',
    tag: initial.tag || 'Residential',
    location: initial.location || '',
    year: initial.year || 'Completed',
    desc: initial.desc || '',
    overview0: initial.overview?.[0] || '',
    overview1: initial.overview?.[1] || '',
    area0: initial.area?.[0] || '',
    area1: initial.area?.[1] || '',
    amenities: (initial.amenities || []).join('\n'),
    specs: Object.entries(initial.specs || {}).map(([k, v]) => `${k}: ${v}`).join('\n'),
  });
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(initial.img || '');
  const [imgUrl, setImgUrl] = useState(initial.img || '');
  const [uploading, setUploading] = useState(false);
  const [coverProgress, setCoverProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  const [mapUrl, setMapUrl] = useState(initial.mapUrl || '');
  const [brochureUrl, setBrochureUrl] = useState(initial.brochureUrl || '');
  const [brochureFile, setBrochureFile] = useState(null);
  const [brochureUploading, setBrochureUploading] = useState(false);
  const [brochureProgress, setBrochureProgress] = useState(0);

  const onBrochureFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBrochureUploading(true);
    setBrochureProgress(0);
    try {
      const url = await uploadFile(file, 'brochures', setBrochureProgress);
      setBrochureUrl(url);
      setBrochureFile(file.name);
    } catch (err) {
      setUploadError('Brochure upload failed: ' + err.message);
    }
    setBrochureUploading(false);
    setBrochureProgress(0);
    e.target.value = '';
  };

  const [gallery, setGallery] = useState(initial.gallery || []);
  const [galleryInput, setGalleryInput] = useState('');
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryProgress, setGalleryProgress] = useState(0);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgFile(file);
    setImgUrl('');
    setUploadError('');
    setCoverProgress(0);
    setImgPreview(URL.createObjectURL(file));
  };

  const addGalleryUrl = () => {
    const url = galleryInput.trim();
    if (!url) return;
    setGallery((g) => [...g, url]);
    setGalleryInput('');
  };

  const onGalleryFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setGalleryUploading(true);
    setGalleryProgress(0);
    try {
      const url = await uploadImage(file, 'projects/gallery', setGalleryProgress);
      setGallery((g) => [...g, url]);
    } catch (err) {
      setUploadError('Gallery upload failed: ' + err.message);
    }
    setGalleryUploading(false);
    setGalleryProgress(0);
    e.target.value = '';
  };

  const removeGallery = (idx) => setGallery((g) => g.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadError('');
    let img = imgUrl || initial.img || '';

    if (imgFile) {
      setUploading(true);
      setCoverProgress(0);
      try {
        img = await uploadImage(imgFile, 'projects', setCoverProgress);
      } catch (err) {
        setUploading(false);
        setCoverProgress(0);
        setUploadError('Image upload failed: ' + err.message + '. Check Firebase Storage rules or use the "Paste Image URL" field instead.');
        return;
      }
      setUploading(false);
      setCoverProgress(0);
    }

    const specs = {};
    form.specs.split('\n').filter(Boolean).forEach((line) => {
      const [k, ...rest] = line.split(':');
      if (k) specs[k.trim()] = rest.join(':').trim();
    });

    const finalGallery = gallery.length ? gallery : (img ? [img] : []);

    const data = {
      name: form.name, tag: form.tag, location: form.location,
      year: form.year, desc: form.desc, img,
      overview: [form.overview0, form.overview1].filter(Boolean),
      area: [form.area0, form.area1].filter(Boolean),
      amenities: form.amenities.split('\n').filter(Boolean),
      specs,
      gallery: finalGallery,
      mapUrl: mapUrl.trim() || '',
      brochureUrl: brochureUrl.trim() || '',
    };
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} style={fs.form}>
      <Section title="Basic Info">
        <Row>
          <Field label="Project Name" required>
            <input style={fs.input} value={form.name} onChange={set('name')} placeholder="e.g. Vijaya Enclave" required />
          </Field>
          <Field label="Category">
            <select style={fs.input} value={form.tag} onChange={set('tag')}>
              <option>Residential</option>
              <option>Commercial</option>
              <option>Plot Layout</option>
            </select>
          </Field>
        </Row>
        <Row>
          <Field label="Location" required>
            <input style={fs.input} value={form.location} onChange={set('location')} placeholder="e.g. MVP Colony, Visakhapatnam, AP" required />
          </Field>
          <Field label="Status">
            <select style={fs.input} value={form.year} onChange={set('year')}>
              <option>Completed</option>
              <option>Ongoing</option>
            </select>
          </Field>
        </Row>
        <Field label="Short Description" required>
          <textarea style={{ ...fs.input, minHeight: 80, resize: 'vertical' }} value={form.desc} onChange={set('desc')} required />
        </Field>
      </Section>

      <Section title="Cover Image">
        {imgPreview && <img src={imgPreview} alt="preview" style={fs.preview} />}

        <div style={fs.imgRow}>
          <label style={uploading ? fs.uploadBtnDisabled : fs.uploadBtn}>
            <i className="fa fa-upload" style={{ marginRight: 8 }}></i>
            {uploading ? `Uploading ${coverProgress}%…` : imgFile ? 'Change File' : 'Upload from Device'}
            <input type="file" accept="image/*" onChange={onImg} style={{ display: 'none' }} disabled={uploading} />
          </label>
          <span style={fs.orText}>or</span>
          <Field label="Paste Image URL">
            <input
              style={{ ...fs.input, minWidth: 320 }}
              value={imgUrl}
              onChange={(e) => { setImgUrl(e.target.value); setImgPreview(e.target.value); setImgFile(null); }}
              placeholder="https://images.unsplash.com/..."
            />
          </Field>
        </div>

        {uploading && <ProgressBar pct={coverProgress} />}
        {uploadError && <div style={fs.uploadErr}><i className="fa fa-exclamation-triangle" style={{ marginRight: 6 }}></i>{uploadError}</div>}
        <p style={fs.hint}>Upload a file OR paste a URL. Recommended size: 1200×800px.</p>
      </Section>

      <Section title="Gallery Photos">
        {gallery.length > 0 && (
          <div style={fs.galleryGrid}>
            {gallery.map((url, i) => (
              <div key={i} style={fs.galleryItem}>
                <img src={url} alt={`Gallery ${i + 1}`} style={fs.galleryThumb} />
                <button type="button" onClick={() => removeGallery(i)} style={fs.removeBtn}>
                  <i className="fa fa-times"></i> Remove
                </button>
              </div>
            ))}
          </div>
        )}
        <div style={fs.imgRow}>
          <label style={galleryUploading ? fs.uploadBtnDisabled : fs.uploadBtn}>
            <i className="fa fa-plus" style={{ marginRight: 8 }}></i>
            {galleryUploading ? `Uploading ${galleryProgress}%…` : 'Upload Photo'}
            <input type="file" accept="image/*" onChange={onGalleryFile} style={{ display: 'none' }} disabled={galleryUploading} />
          </label>
          <span style={fs.orText}>or</span>
          <div style={fs.galleryInputRow}>
            <input
              style={{ ...fs.input, flex: 1 }}
              value={galleryInput}
              onChange={(e) => setGalleryInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGalleryUrl())}
              placeholder="Paste image URL and press Add"
            />
            <button type="button" onClick={addGalleryUrl} style={fs.addBtn}>Add</button>
          </div>
        </div>
        {galleryUploading && <ProgressBar pct={galleryProgress} />}
        <p style={fs.hint}>Add multiple photos for the project gallery. The cover image is separate.</p>
      </Section>

      <Section title="Project Overview">
        <Field label="Paragraph 1">
          <textarea style={{ ...fs.input, minHeight: 100, resize: 'vertical' }} value={form.overview0} onChange={set('overview0')} />
        </Field>
        <Field label="Paragraph 2">
          <textarea style={{ ...fs.input, minHeight: 100, resize: 'vertical' }} value={form.overview1} onChange={set('overview1')} />
        </Field>
      </Section>

      <Section title="Location / Neighbourhood">
        <Field label="Paragraph 1">
          <textarea style={{ ...fs.input, minHeight: 100, resize: 'vertical' }} value={form.area0} onChange={set('area0')} />
        </Field>
        <Field label="Paragraph 2">
          <textarea style={{ ...fs.input, minHeight: 100, resize: 'vertical' }} value={form.area1} onChange={set('area1')} />
        </Field>
      </Section>

      <Section title="Amenities / Features">
        <Field label="One feature per line">
          <textarea style={{ ...fs.input, minHeight: 140, resize: 'vertical', fontFamily: 'monospace' }} value={form.amenities} onChange={set('amenities')} placeholder={'2 BHK units — 950 sqft\n24×7 security\nCovered car parking'} />
        </Field>
      </Section>

      <Section title="Specifications">
        <Field label="One spec per line — format: Label: Value">
          <textarea style={{ ...fs.input, minHeight: 120, resize: 'vertical', fontFamily: 'monospace' }} value={form.specs} onChange={set('specs')} placeholder={'Configuration: 2 BHK & 3 BHK\nArea: 950 & 1350 sqft\nStatus: Sold Out'} />
        </Field>
      </Section>

      <Section title="Google Maps Location">
        <Field label="Google Maps Embed Code or URL">
          <textarea
            style={{ ...fs.input, minHeight: 80, resize: 'vertical', fontFamily: 'monospace', fontSize: 12 }}
            value={mapUrl}
            onChange={(e) => {
              const val = e.target.value;
              const match = val.match(/src="([^"]+)"/);
              setMapUrl(match ? match[1] : val);
            }}
            placeholder={'Paste the full <iframe> embed code or just the src URL'}
          />
        </Field>
        {mapUrl && (
          <iframe src={mapUrl} width="100%" height="200" style={{ border: 0, display: 'block', marginTop: 8 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map preview" />
        )}
        <p style={fs.hint}>Google Maps → Share → Embed a map → copy the entire iframe code or just the src URL. Both work.</p>
      </Section>

      <Section title="Project Brochure (PDF)">
        <div style={fs.imgRow}>
          <label style={brochureUploading ? fs.uploadBtnDisabled : fs.uploadBtn}>
            <i className="fa fa-file-pdf" style={{ marginRight: 8 }}></i>
            {brochureUploading ? `Uploading ${brochureProgress}%…` : brochureFile ? 'Change PDF' : 'Upload PDF'}
            <input type="file" accept=".pdf" onChange={onBrochureFile} style={{ display: 'none' }} disabled={brochureUploading} />
          </label>
          <span style={fs.orText}>or</span>
          <Field label="Paste PDF URL">
            <input
              style={{ ...fs.input, minWidth: 320 }}
              value={brochureUrl}
              onChange={(e) => { setBrochureUrl(e.target.value); setBrochureFile(null); }}
              placeholder="https://drive.google.com/..."
            />
          </Field>
        </div>
        {brochureUploading && <ProgressBar pct={brochureProgress} />}
        {brochureUrl && !brochureUploading && (
          <div style={{ fontSize: 12, color: '#7de89a', marginTop: 6 }}>
            <i className="fa fa-check-circle" style={{ marginRight: 6 }}></i>
            Brochure set — visitors will need to submit an enquiry to download it.
          </div>
        )}
        <p style={fs.hint}>Upload a PDF brochure. Visitors must submit their contact details before downloading.</p>
      </Section>

      <div style={fs.footer}>
        <button type="button" onClick={onCancel} style={fs.cancel}>Cancel</button>
        <button type="submit" style={fs.submit} disabled={saving || uploading || galleryUploading || brochureUploading}>
          {saving ? 'Saving…' : 'Save Project'}
        </button>
      </div>
    </form>
  );
}

function ProgressBar({ pct }) {
  return (
    <div style={fs.progressWrap}>
      <div style={{ ...fs.progressFill, width: `${pct}%` }}></div>
      <span style={fs.progressLabel}>{pct}%</span>
    </div>
  );
}

function Section({ title, children }) {
  return <div style={fs.section}><h3 style={fs.sectionTitle}>{title}</h3>{children}</div>;
}
function Row({ children }) { return <div style={fs.row}>{children}</div>; }
function Field({ label, children, required }) {
  return (
    <div style={fs.field}>
      <label style={fs.label}>{label}{required && <span style={{ color: '#b8943f' }}> *</span>}</label>
      {children}
    </div>
  );
}

const fs = {
  form: { display: 'flex', flexDirection: 'column', gap: 0 },
  section: { background: '#1a1a1a', border: '1px solid rgba(255,255,255,.07)', padding: '28px 32px', marginBottom: 20 },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#b8943f', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid rgba(184,148,63,.15)' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  field: { marginBottom: 16 },
  label: { display: 'block', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#888', marginBottom: 8 },
  input: { width: '100%', background: '#111', border: '1px solid rgba(255,255,255,.08)', color: '#f5f0e8', fontFamily: 'Barlow, sans-serif', fontSize: 14, padding: '12px 16px', outline: 'none', boxSizing: 'border-box', borderRadius: 0 },
  preview: { width: '100%', maxHeight: 220, objectFit: 'cover', marginBottom: 16, display: 'block' },
  imgRow: { display: 'flex', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap', marginBottom: 8 },
  uploadBtn: { display: 'inline-flex', alignItems: 'center', background: 'rgba(184,148,63,.1)', border: '1px solid rgba(184,148,63,.3)', color: '#b8943f', padding: '12px 20px', cursor: 'pointer', fontSize: 13, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 1, textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0 },
  uploadBtnDisabled: { display: 'inline-flex', alignItems: 'center', background: 'rgba(184,148,63,.05)', border: '1px solid rgba(184,148,63,.15)', color: '#666', padding: '12px 20px', cursor: 'not-allowed', fontSize: 13, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 1, textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0 },
  orText: { color: '#555', fontSize: 13, paddingBottom: 16 },
  uploadErr: { background: 'rgba(232,118,118,.08)', border: '1px solid rgba(232,118,118,.3)', color: '#e87676', padding: '12px 16px', fontSize: 13, marginBottom: 8, lineHeight: 1.5 },
  hint: { fontSize: 12, color: '#555' },
  progressWrap: { position: 'relative', height: 28, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)', marginBottom: 10, display: 'flex', alignItems: 'center' },
  progressFill: { position: 'absolute', left: 0, top: 0, bottom: 0, background: 'linear-gradient(90deg, #7a6128, #b8943f)', transition: 'width 0.25s ease' },
  progressLabel: { position: 'relative', zIndex: 1, fontSize: 12, color: '#f5f0e8', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 1, paddingLeft: 12 },
  galleryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 20 },
  galleryItem: { position: 'relative' },
  galleryThumb: { width: '100%', height: 110, objectFit: 'cover', display: 'block', border: '1px solid rgba(255,255,255,.08)' },
  removeBtn: { width: '100%', background: 'rgba(232,118,118,.12)', border: '1px solid rgba(232,118,118,.25)', color: '#e87676', padding: '6px 0', cursor: 'pointer', fontSize: 12, marginTop: 4 },
  galleryInputRow: { display: 'flex', flex: 1, gap: 8, alignItems: 'flex-end', minWidth: 0 },
  addBtn: { background: 'rgba(184,148,63,.15)', border: '1px solid rgba(184,148,63,.3)', color: '#b8943f', padding: '12px 20px', cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap', flexShrink: 0 },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 },
  cancel: { background: 'none', border: '1px solid rgba(255,255,255,.1)', color: '#888', padding: '12px 28px', cursor: 'pointer', fontSize: 14 },
  submit: { background: '#b8943f', color: '#0e0e0e', border: 'none', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '12px 32px', cursor: 'pointer' },
};
