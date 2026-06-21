import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOngoingById, cloudinaryUrl } from '../services/db';
const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%231a1a1a' width='600' height='400'/%3E%3Ctext x='50%25' y='44%25' text-anchor='middle' fill='%23444' font-size='40' font-family='serif'%3E%F0%9F%8F%97%3C/text%3E%3Ctext x='50%25' y='62%25' text-anchor='middle' fill='%23555' font-size='13' font-family='sans-serif'%3EImage not available%3C/text%3E%3C/svg%3E";
import MiniFooter from '../components/MiniFooter';
import useScrollAnimation from '../components/useScrollAnimation';
import BrochureModal from '../components/BrochureModal';

export default function OngoingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [u, setU] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBrochure, setShowBrochure] = useState(false);
  const [activePdf, setActivePdf] = useState(null);
  useScrollAnimation();

  useEffect(() => {
    getOngoingById(id)
      .then((data) => { setU(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const goToContact = () => {
    navigate('/');
    setTimeout(() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' }), 200);
  };

  if (loading) return <div style={{ padding: 120, color: 'var(--text-muted)', textAlign: 'center' }}>Loading…</div>;
  if (!u) return <div style={{ padding: 120, color: 'var(--text-muted)' }}>Project not found.</div>;

  return (
    <>
      <div className="detail-hero">
        <div className="detail-hero-bg" style={{ backgroundImage: `url('${u.img}')` }}></div>
        <div className="detail-hero-overlay"></div>
        <div style={{ width: '100%', position: 'relative', zIndex: 2 }}>
          <div className="detail-hero-content">
            <div className="breadcrumb">
              <span className="breadcrumb-link" onClick={() => navigate('/')}>Home</span>
              <i className="fa fa-chevron-right" style={{ fontSize: 9 }}></i>
              <span className="breadcrumb-link" onClick={() => navigate('/ongoing')}>Ongoing Projects</span>
              <i className="fa fa-chevron-right" style={{ fontSize: 9 }}></i>
              <span>{u.name}</span>
            </div>
            <div className="upcoming-pulse">
              <div className="pulse-dot"></div>
              <span>{u.badge}</span>
            </div>
            <h1>{u.name}</h1>
            <div className="detail-meta">
              <div className="meta-item"><i className="fa fa-map-marker-alt"></i> {u.location}</div>
              <div className="meta-item"><i className="fa fa-home"></i> {u.completion}</div>
              <div className="meta-item"><i className="fa fa-hard-hat"></i> {u.badge}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-wrap">
        <div className="countdown-strip fade-up">
          <div>
            <div className="countdown-label">Status</div>
            <div className="countdown-value">{u.badge}</div>
          </div>
          <div className="countdown-divider"></div>
          <div>
            <div className="countdown-label">Availability</div>
            <div className="countdown-value">{u.completion}</div>
          </div>
          <div className="countdown-divider"></div>
          <div>
            <div className="countdown-label">Location</div>
            <div className="countdown-value" style={{ fontSize: 20 }}>{u.location}</div>
          </div>
          <button className="register-btn" onClick={goToContact}>
            Enquire Now <i className="fa fa-arrow-right"></i>
          </button>
        </div>

        {u.specs && Object.keys(u.specs).length > 0 && (
          <div className="specs-bar fade-up">
            {Object.entries(u.specs).map(([k, v]) => (
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
            <p className="body-text">{u.overview?.[0]}</p>
            {u.overview?.[1] && <p className="body-text" style={{ marginTop: 16 }}>{u.overview[1]}</p>}
          </div>
          <div>
            <div className="section-label">Location &amp; Neighbourhood</div>
            <div className="gold-bar"></div>
            <h2 className="detail-section-title">Where It Is</h2>
            <p className="body-text">{u.area?.[0]}</p>
            {u.area?.[1] && <p className="body-text" style={{ marginTop: 16 }}>{u.area[1]}</p>}
          </div>
        </div>

        {u.gallery?.length > 0 && (
          <div className="gallery-section fade-up">
            <div className="section-label">Photo Gallery</div>
            <div className="gold-bar"></div>
            <h2 className="detail-section-title">Visual Walkthrough</h2>
            <div className="gallery-grid">
              {u.gallery.map((g, i) => (
                <div key={i} className="gallery-item">
                  <img src={g || PLACEHOLDER} alt={u.name} loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER; }} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="interest-section fade-up">
          <div className="interest-inner">
            <div className="interest-text">
              <h3>Register Your Interest</h3>
              <p>Be among the first to receive detailed plot maps, pricing, and availability updates. Fill in your details and our team will contact you promptly.</p>
            </div>
            <form className="interest-form" action="https://formspree.io/f/mreygnng" method="POST">
              <input type="hidden" name="Project" value={u.name} />
              <input type="text" name="Name" className="form-input" placeholder="Full Name" required />
              <input type="tel" name="Phone" className="form-input" placeholder="Phone Number" required />
              <input type="email" name="Email" className="form-input" placeholder="Email Address" />
              <button type="submit" className="register-btn" style={{ width: 'fit-content' }}>
                Register Interest <i className="fa fa-arrow-right"></i>
              </button>
            </form>
          </div>
        </div>

        {u.highlights?.length > 0 && (
          <div className="fade-up" style={{ marginBottom: 80 }}>
            <div className="section-label">Features &amp; Highlights</div>
            <div className="gold-bar"></div>
            <h2 className="detail-section-title">Key Highlights</h2>
            <ul style={{ listStyle: 'none', marginTop: 32 }}>
              {u.highlights.map((h, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 15, color: 'var(--text-light)', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <i className="fa fa-circle" style={{ color: 'var(--gold)', fontSize: 7, marginTop: 6, flexShrink: 0 }}></i>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}

        {(() => {
          const pdfs = u.pdfs?.length ? u.pdfs : u.brochureUrl ? [{ name: 'Brochure', url: u.brochureUrl }] : [];
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
                    <button className="btn-outline" style={{ fontSize: 12, padding: '8px 16px' }}
                      onClick={() => window.open(cloudinaryUrl(pdf.url, 'fl_inline'), '_blank', 'noopener,noreferrer')}>
                      <i className="fa fa-eye" style={{ marginRight: 6 }}></i>View
                    </button>
                    <button className="btn-gold" style={{ fontSize: 12, padding: '8px 16px' }} onClick={() => { setActivePdf(pdf); setShowBrochure(true); }}>
                      <i className="fa fa-download" style={{ marginRight: 6 }}></i>Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null;
        })()}

        {u.mapUrl && (
          <div className="fade-up" style={{ marginBottom: 80 }}>
            <div className="section-label">Location</div>
            <div className="gold-bar"></div>
            <h2 className="detail-section-title">Find Us on the Map</h2>
            <iframe
              src={u.mapUrl}
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
            <h3>Ready to secure your plot?</h3>
            <p>Contact our team today and we'll guide you through the process.</p>
          </div>
          <div className="cta-btns">
            <button className="btn-gold" onClick={goToContact}>
              Contact Us <i className="fa fa-arrow-right"></i>
            </button>
            <button className="btn-outline" onClick={() => navigate('/ongoing')}>
              <i className="fa fa-th-large"></i> All Ongoing
            </button>
          </div>
        </div>
      </div>

      {showBrochure && activePdf && (
        <BrochureModal
          projectName={`${u.name} — ${activePdf.name}`}
          brochureUrl={activePdf.url}
          onClose={() => { setShowBrochure(false); setActivePdf(null); }}
        />
      )}

      <MiniFooter />
    </>
  );
}
