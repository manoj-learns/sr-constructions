import { useState } from 'react';
import { uploadImage, uploadFile, cloudinaryUrl } from '../services/db';

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
  });
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(initial.img || '');
  const [imgUrl, setImgUrl] = useState(initial.img || '');
  const [uploading, setUploading] = useState(false);
  const [coverProgress, setCoverProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  const [mapUrl, setMapUrl] = useState(initial.mapUrl || '');

  const [pdfs, setPdfs] = useState(
    initial.pdfs?.length ? initial.pdfs
    : initial.brochureUrl ? [{ name: 'Brochure', url: initial.brochureUrl }]
    : []
  );
  const [pdfName, setPdfName] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfUploading, setPdfUploading] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);

  const onPdfFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPdfUploading(true);
    setPdfProgress(0);
    try {
      const url = await uploadFile(file, 'brochures', setPdfProgress);
      const name = pdfName.trim() || file.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ');
      setPdfs((p) => [...p, { name, url }]);
      setPdfName('');
    } catch (err) {
      setUploadError('PDF upload failed: ' + err.message);
    }
    setPdfUploading(false);
    setPdfProgress(0);
    e.target.value = '';
  };

  const addPdfUrl = () => {
    const url = pdfUrl.trim();
    if (!url) return;
    setPdfs((p) => [...p, { name: pdfName.trim() || 'Document', url }]);
    setPdfUrl('');
    setPdfName('');
  };

  const removePdf = (idx) => setPdfs((p) => p.filter((_, i) => i !== idx));

  const [specs, setSpecs] = useState(
    Object.entries(initial.specs || {}).map(([k, v]) => ({ k, v }))
  );

  const addSpec = () => setSpecs((s) => [...s, { k: '', v: '' }]);
  const removeSpec = (idx) => setSpecs((s) => s.filter((_, i) => i !== idx));
  const updateSpec = (idx, field, val) =>
    setSpecs((s) => s.map((item, i) => (i === idx ? { ...item, [field]: val } : item)));

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

    const specsObj = specs.reduce((obj, { k, v }) => {
      if (k.trim()) obj[k.trim()] = v.trim();
      return obj;
    }, {});

    const finalGallery = gallery.length ? gallery : (img ? [img] : []);

    const data = {
      name: form.name, tag: form.tag, location: form.location,
      year: form.year, desc: form.desc, img,
      overview: [form.overview0, form.overview1].filter(Boolean),
      area: [form.area0, form.area1].filter(Boolean),
      amenities: form.amenities.split('\n').filter(Boolean),
      specs: specsObj,
      gallery: finalGallery,
      mapUrl: mapUrl.trim() || '',
      pdfs,
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
        {specs.map((spec, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'center' }}>
            <input
              style={{ ...fs.input, flex: 1 }}
              value={spec.k}
              onChange={(e) => updateSpec(i, 'k', e.target.value)}
              placeholder="Label (e.g. Total Area)"
            />
            <input
              style={{ ...fs.input, flex: 1 }}
              value={spec.v}
              onChange={(e) => updateSpec(i, 'v', e.target.value)}
              placeholder="Value (e.g. 5 Acres)"
            />
            <button type="button" onClick={() => removeSpec(i)} style={{ background: 'rgba(232,118,118,.12)', border: '1px solid rgba(232,118,118,.25)', color: '#e87676', padding: '12px 14px', cursor: 'pointer', fontSize: 12, flexShrink: 0 }}>
              <i className="fa fa-times"></i>
            </button>
          </div>
        ))}
        <button type="button" onClick={addSpec} style={{ ...fs.addBtn, marginTop: 4 }}>
          <i className="fa fa-plus" style={{ marginRight: 8 }}></i>Add Specification
        </button>

        {specs.some((s) => s.k.trim()) && (
          <div style={{ marginTop: 20 }}>
            <p style={{ ...fs.hint, marginBottom: 8 }}>Preview (how it looks on the project page):</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', background: '#0e0e0e', border: '1px solid rgba(184,148,63,.2)', borderTop: '3px solid #b8943f' }}>
              {specs.filter((s) => s.k.trim()).map((s, i) => (
                <div key={i} style={{ flex: '1 1 140px', padding: '16px 20px', borderRight: '1px solid rgba(255,255,255,.06)' }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: '#888', marginBottom: 4 }}>{s.k}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#f5f0e8' }}>{s.v || '—'}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>

      <Section title="Google Maps Location">
        <Field label="Google Maps Embed Code or URL">
          <textarea
            style={{ ...fs.input, minHeight: 80, resize: 'vertical', fontFamily: 'monospace', fontSize: 12 }}
            value={mapUrl}
            onChange={(e) => {
              const val = e.target.value;
              const match = val.match(/src="([^"]+)"/);
              setMapUrl(match ? match[1].replace(/&amp;/g, '&') : val);
            }}
            placeholder={'Paste the full <iframe> embed code or just the src URL'}
          />
        </Field>
        {mapUrl && (
          <iframe src={mapUrl} width="100%" height="200" style={{ border: 0, display: 'block', marginTop: 8 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map preview" />
        )}
        <p style={fs.hint}>Google Maps → Share → Embed a map → copy the entire iframe code or just the src URL. Both work.</p>
      </Section>

      <Section title="Documents & Brochures (PDF)">
        {pdfs.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            {pdfs.map((pdf, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#111', border: '1px solid rgba(255,255,255,.07)', marginBottom: 8 }}>
                <i className="fa fa-file-pdf" style={{ color: '#b8943f', fontSize: 18, flexShrink: 0 }}></i>
                <span style={{ flex: 1, color: '#f5f0e8', fontSize: 14, fontFamily: 'Barlow, sans-serif' }}>{pdf.name}</span>
                <button type="button" onClick={() => window.open(cloudinaryUrl(pdf.url, 'fl_inline'), '_blank', 'noopener,noreferrer')} style={{ color: '#7bb8f0', fontSize: 12, background: 'none', padding: '5px 10px', border: '1px solid rgba(123,184,240,.3)', marginRight: 4, cursor: 'pointer' }}>
                  <i className="fa fa-eye" style={{ marginRight: 4 }}></i>View
                </button>
                <button type="button" onClick={() => window.open(cloudinaryUrl(pdf.url, 'fl_attachment'), '_blank', 'noopener,noreferrer')} style={{ color: '#7de89a', fontSize: 12, background: 'none', padding: '5px 10px', border: '1px solid rgba(125,232,154,.3)', marginRight: 4, cursor: 'pointer' }}>
                  <i className="fa fa-download" style={{ marginRight: 4 }}></i>Download
                </button>
                <button type="button" onClick={() => removePdf(i)} style={{ background: 'rgba(232,118,118,.12)', border: '1px solid rgba(232,118,118,.25)', color: '#e87676', padding: '5px 10px', cursor: 'pointer', fontSize: 12 }}>
                  <i className="fa fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        )}

        <Field label="PDF Label (optional)">
          <input
            style={fs.input}
            value={pdfName}
            onChange={(e) => setPdfName(e.target.value)}
            placeholder="e.g. Floor Plan, Price List, Brochure"
          />
        </Field>
        <div style={fs.imgRow}>
          <label style={pdfUploading ? fs.uploadBtnDisabled : fs.uploadBtn}>
            <i className="fa fa-file-pdf" style={{ marginRight: 8 }}></i>
            {pdfUploading ? `Uploading ${pdfProgress}%…` : 'Upload PDF'}
            <input type="file" accept=".pdf" onChange={onPdfFile} style={{ display: 'none' }} disabled={pdfUploading} />
          </label>
          <span style={fs.orText}>or</span>
          <div style={fs.galleryInputRow}>
            <input
              style={{ ...fs.input, flex: 1 }}
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              placeholder="Paste PDF URL"
            />
            <button type="button" onClick={addPdfUrl} style={fs.addBtn}>Add</button>
          </div>
        </div>
        {pdfUploading && <ProgressBar pct={pdfProgress} />}
        <p style={fs.hint}>Add multiple PDFs (brochure, floor plan, price list). Visitors submit an enquiry to download them.</p>
      </Section>

      <div style={fs.footer}>
        <button type="button" onClick={onCancel} style={fs.cancel}>Cancel</button>
        <button type="submit" style={fs.submit} disabled={saving || uploading || galleryUploading || pdfUploading}>
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
