import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject } from '../services/db';
import MiniFooter from '../components/MiniFooter';
import useScrollAnimation from '../components/useScrollAnimation';
import BrochureModal from '../components/BrochureModal';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBrochure, setShowBrochure] = useState(false);
  const [activePdf, setActivePdf] = useState(null);
  useScrollAnimation();

  useEffect(() => {
    getProject(id)
      .then((data) => { setP(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: 120, color: 'var(--text-muted)', textAlign: 'center' }}>Loading…</div>;
  if (!p) return <div style={{ padding: 120, color: 'var(--text-muted)' }}>Project not found.</div>;

  return (
    <>
      <div className="detail-hero">
        <div className="detail-hero-bg" style={{ backgroundImage: `url('${p.img}')` }}></div>
        <div className="detail-hero-overlay"></div>
        <div style={{ width: '100%', position: 'relative', zIndex: 2 }}>
          <div className="detail-hero-content">
            <div className="breadcrumb">
              <span className="breadcrumb-link" onClick={() => navigate('/')}>Home</span>
              <i className="fa fa-chevron-right" style={{ fontSize: 9 }}></i>
              <span className="breadcrumb-link" onClick={() => navigate('/projects')}>Projects</span>
              <i className="fa fa-chevron-right" style={{ fontSize: 9 }}></i>
              <span>{p.name}</span>
            </div>
            <div className="detail-tag">{p.tag}</div>
            <h1>{p.name}</h1>
            <div className="detail-meta">
              <div className="meta-item"><i className="fa fa-map-marker-alt"></i> {p.location}</div>
              <div className="meta-item"><i className="fa fa-check-circle"></i> {p.year}</div>
              <div className="meta-item"><i className="fa fa-home"></i> Sold Out</div>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-wrap">
        {p.specs && Object.keys(p.specs).length > 0 && (
          <div className="specs-bar fade-up">
            {Object.entries(p.specs).map(([k, v]) => (
              <div key={k} className="spec-item">
                <span className="spec-label">{k}</span>
                <span className="spec-value">{v}</span>
              </div>
            ))}
          </div>
        )}

        <div className="two-col fade-up">
          <div>
            <div className="section-label">Project Overview</div>
            <div className="gold-bar"></div>
            <h2 className="detail-section-title">About This Project</h2>
            <p className="body-text">{p.overview?.[0]}</p>
            {p.overview?.[1] && <p className="body-text" style={{ marginTop: 16 }}>{p.overview[1]}</p>}
          </div>
          <div>
            <div className="section-label">Location &amp; Area</div>
            <div className="gold-bar"></div>
            <h2 className="detail-section-title">The Neighbourhood</h2>
            <p className="body-text">{p.area?.[0]}</p>
            {p.area?.[1] && <p className="body-text" style={{ marginTop: 16 }}>{p.area[1]}</p>}
          </div>
        </div>

        {p.gallery?.length > 0 && (
          <div className="gallery-section fade-up">
            <div className="section-label">Photo Gallery</div>
            <div className="gold-bar"></div>
            <h2 className="detail-section-title">Visual Walkthrough</h2>
            <div className="gallery-grid">
              {p.gallery.map((g, i) => (
                <div key={i} className="gallery-item">
                  <img src={g} alt={p.name} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        )}

        {p.amenities?.length > 0 && (
          <div className="fade-up" style={{ marginBottom: 80 }}>
            <div className="section-label">Features &amp; Highlights</div>
            <div className="gold-bar"></div>
            <h2 className="detail-section-title">What Was Delivered</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, marginTop: 32 }}>
              <ul className="amenities-list">
                {p.amenities.map((a, i) => (
                  <li key={i}><i className="fa fa-check"></i> {a}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {(() => {
          const pdfs = p.pdfs?.length ? p.pdfs : p.brochureUrl ? [{ name: 'Brochure', url: p.brochureUrl }] : [];
          return pdfs.length > 0 ? (
            <div className="fade-up" style={{ marginBottom: 60 }}>
              <div className="section-label">Documents</div>
              <div className="gold-bar"></div>
              <h2 className="detail-section-title">Downloads</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
                {pdfs.map((pdf, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <i className="fa fa-file-pdf" style={{ color: '#b8943f', fontSize: 20, flexShrink: 0 }}></i>
                    <span style={{ flex: 1, fontSize: 15, color: 'var(--text)' }}>{pdf.name}</span>
                    <a href={pdf.url} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ fontSize: 12, padding: '8px 16px', textDecoration: 'none' }}>
                      <i className="fa fa-eye" style={{ marginRight: 6 }}></i>View
                    </a>
                    <button className="btn-gold" style={{ fontSize: 12, padding: '8px 16px' }} onClick={() => { setActivePdf(pdf); setShowBrochure(true); }}>
                      <i className="fa fa-download" style={{ marginRight: 6 }}></i>Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null;
        })()}

        {p.mapUrl && (
          <div className="fade-up" style={{ marginBottom: 80 }}>
            <div className="section-label">Location</div>
            <div className="gold-bar"></div>
            <h2 className="detail-section-title">Find Us on the Map</h2>
            <iframe
              src={p.mapUrl}
              title="Project Location"
              width="100%"
              height="380"
              style={{ border: 0, display: 'block', marginTop: 24 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}

        <div className="detail-cta fade-up">
          <div>
            <h3>Interested in a similar project?</h3>
            <p>Reach out to our team and let's discuss your vision.</p>
          </div>
          <div className="cta-btns">
            <button className="btn-gold" onClick={() => { navigate('/'); setTimeout(() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' }), 200); }}>
              Contact Us <i className="fa fa-arrow-right"></i>
            </button>
            <button className="btn-outline" onClick={() => navigate('/projects')}>
              <i className="fa fa-th-large"></i> All Projects
            </button>
          </div>
        </div>
      </div>

      {showBrochure && activePdf && (
        <BrochureModal
          projectName={`${p.name} — ${activePdf.name}`}
          brochureUrl={activePdf.url}
          onClose={() => { setShowBrochure(false); setActivePdf(null); }}
        />
      )}

      <MiniFooter />
    </>
  );
}
