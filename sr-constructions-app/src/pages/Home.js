import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import useScrollAnimation from '../components/useScrollAnimation';
import { addContact, getProjects, getOngoing } from '../services/db';

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%231a1a1a' width='600' height='400'/%3E%3Ctext x='50%25' y='44%25' text-anchor='middle' fill='%23444' font-size='40' font-family='serif'%3E%F0%9F%8F%97%3C/text%3E%3Ctext x='50%25' y='62%25' text-anchor='middle' fill='%23555' font-size='13' font-family='sans-serif'%3EImage not available%3C/text%3E%3C/svg%3E";

const HERO_SLIDES = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80',
];

export default function Home() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [ongoing, setOngoing] = useState([]);
  const [slide, setSlide] = useState(0);
  useScrollAnimation();

  useEffect(() => {
    getProjects().then(setProjects).catch(() => {});
    getOngoing().then(setOngoing).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  const handleContactSubmit = async (e) => {
    const form = e.target;
    const data = Object.fromEntries(new FormData(form));
    try { await addContact(data); } catch { /* non-blocking */ }
    // Let Formspree handle the actual submission
  };

  return (
    <>
      {/* Hero */}
      <section id="hero-section">
        {HERO_SLIDES.map((src, i) => (
          <div
            key={i}
            className="hero-bg"
            style={{
              backgroundImage: `url('${src}')`,
              opacity: i === slide ? 1 : 0,
              transition: 'opacity 1.5s ease',
            }}
          />
        ))}
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-eyebrow">Est. 2007</div>
          <h1 className="hero-title">
            From Vision to Reality:<em><br />You Dream,</em> We Build.
          </h1>
          <p className="hero-tagline">Quality. Trust. Strength. — Building Spaces Meant to Last.</p>
          <button className="hero-cta" onClick={() => document.getElementById('projects-section')?.scrollIntoView({ behavior: 'smooth' })}>
            <span>Explore Our Work</span><i className="fa fa-arrow-right"></i>
          </button>
        </div>
        <div className="hero-scroll">Scroll</div>
      </section>

      {/* About */}
      <section id="about-section" className="section-pad">
        <div className="about-inner">
          <div className="about-text fade-left">
            <div className="section-label">Company Overview</div>
            <div className="gold-bar"></div>
            <h2 className="section-title">19 years of building dreams</h2>
            <p>At SR Constructions, we believe a home is the most important bridge between a person's dreams and their reality. Founded in 2007, our journey over the last two decades has been defined by a simple philosophy: Start with affection, finish with perfection.</p>
            <p>We have successfully delivered over 15+ projects, ranging from residential apartments to high-value plots. We aren't just selling land; we are offering a footprint in the most promising locations of tomorrow.</p>
          </div>
          <div className="about-stats fade-right">
            <div className="stat-card">
              <div className="stat-number">19</div>
              <div>
                <div className="stat-label">Years of Excellence</div>
                <div className="stat-desc">Trusted since 2007</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-number">15+</div>
              <div>
                <div className="stat-label">Projects Delivered</div>
                <div className="stat-desc">Residential apartments, Layouts</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section id="vision-section" className="section-pad">
        <div className="vision-inner">
          <div className="fade-up">
            <div className="section-label" style={{ textAlign: 'center' }}>Our Philosophy</div>
            <div className="gold-bar center"></div>
            <h2 className="section-title" style={{ textAlign: 'center' }}>Vision &amp; Mission</h2>
          </div>
          <div className="vision-cards">
            <div className="vision-card fade-left">
              <div className="vision-icon"><i className="fa fa-eye"></i></div>
              <h3>Our Vision</h3>
              <p>Our vision is to be the most trusted name in infrastructure, recognized not just for the luxury we build, but for the unwavering promises we keep—ensuring every partner and homeowner knows they've secured their greatest lifetime investment.</p>
              <div className="vision-card-bg">V</div>
            </div>
            <div className="vision-card fade-right">
              <div className="vision-icon"><i className="fa fa-bullseye"></i></div>
              <h3>Our Mission</h3>
              <p>We believe in doing what is best for our clients. We are driven by a relentless pursuit of quality and innovative design, but our true success is measured by the trust we build. We don't just meet deadlines; we empower communities and honor our word, ensuring every infrastructure solution we deliver is grounded in transparency.</p>
              <div className="vision-card-bg">M</div>
            </div>
          </div>
        </div>
      </section>

      {/* Ongoing Projects */}
      <section id="upcoming-section" className="section-pad">
        <div className="upcoming-inner">
          <div className="projects-header">
            <div className="fade-up">
              <div className="section-label">Currently Available</div>
              <div className="gold-bar"></div>
              <h2 className="section-title">Ongoing Projects</h2>
              <p style={{ color: 'var(--text-light)', maxWidth: 560, margin: '16px 0 0', fontSize: 15, lineHeight: 1.7 }}>
                Plots and residences currently available — secure your space in tomorrow's prime locations today.
              </p>
            </div>
            <button className="btn-outline fade-right" onClick={() => navigate('/ongoing')}>
              <i className="fa fa-folder-open"></i> View All Ongoing
            </button>
          </div>
          <div className="upcoming-grid">
            {ongoing.slice(0, 3).map((u, i) => {
              const specs = u.specs ? Object.entries(u.specs).slice(0, 4) : [];
              return (
                <div
                  key={u.id}
                  className="upcoming-card fade-up"
                  style={{ transitionDelay: `${(i % 3) * 0.1}s`, cursor: 'pointer' }}
                  onClick={() => navigate(`/ongoing/${u.id}`)}
                >
                  {/* Image */}
                  <div className="upcoming-card-img-wrap">
                    <img className="upcoming-img" src={u.img || PLACEHOLDER} alt={u.name}
                      onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER; }} />
                    <div className="uc-hint">View Details</div>
                    <div className="upcoming-badge" style={{ position: 'absolute', top: 14, left: 14, margin: 0 }}>{u.badge}</div>
                  </div>

                  {/* Body */}
                  <div className="upcoming-body">
                    {/* Name */}
                    <div className="upcoming-name">{u.name}</div>

                    {/* Location */}
                    <div className="upcoming-location">
                      <i className="fa fa-map-marker-alt" style={{ color: 'var(--gold)', marginRight: 6 }}></i>
                      {u.location}
                    </div>

                    {/* Specs strip */}
                    {specs.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 20px', margin: '14px 0', padding: '12px 0', borderTop: '1px solid rgba(184,148,63,.15)', borderBottom: '1px solid rgba(184,148,63,.15)' }}>
                        {specs.map(([k, v]) => (
                          <div key={k}>
                            <div style={{ fontSize: 10, color: '#b8943f', letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: "'Barlow Condensed', sans-serif" }}>{k}</div>
                            <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600, marginTop: 2, fontFamily: 'Barlow, sans-serif' }}>{v}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Overview snippet */}
                    {u.overview?.[0] && (
                      <p style={{ fontSize: 13, color: '#888', lineHeight: 1.65, margin: '0 0 12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {u.overview[0]}
                      </p>
                    )}

                    {/* Highlights */}
                    {u.highlights?.length > 0 && (
                      <ul style={{ listStyle: 'none', margin: '0 0 14px', padding: 0 }}>
                        {u.highlights.slice(0, 3).map((h, hi) => (
                          <li key={hi} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: '#999', padding: '3px 0' }}>
                            <i className="fa fa-circle" style={{ color: '#b8943f', fontSize: 5, marginTop: 5, flexShrink: 0 }}></i>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Footer */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,.06)', marginTop: 'auto' }}>
                      <div style={{ fontSize: 13, color: '#b8943f', fontWeight: 600, fontFamily: 'Barlow, sans-serif' }}>
                        <i className="fa fa-calendar-alt" style={{ marginRight: 6, opacity: 0.7 }}></i>{u.completion}
                      </div>
                      <span className="btn-outline" style={{ display: 'inline-flex', fontSize: 12, padding: '7px 14px' }}>
                        View Details <i className="fa fa-arrow-right"></i>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Previous Projects */}
      <section id="projects-section" className="section-pad">
        <div className="projects-inner">
          <div className="projects-header">
            <div className="fade-left">
              <div className="section-label">Our Portfolio</div>
              <div className="gold-bar"></div>
              <h2 className="section-title">Previous Ventures</h2>
            </div>
            <button className="btn-outline fade-right" onClick={() => navigate('/projects')}>
              <i className="fa fa-folder-open"></i> View All Projects
            </button>
          </div>
          <div className="hp-projects-grid">
            {projects.slice(0, 4).map((p, i) => (
              <div
                key={p.id}
                className="hp-project-card fade-up"
                style={{ transitionDelay: `${(i % 4) * 0.1}s` }}
                onClick={() => navigate(`/projects/${p.id}`)}
              >
                <img src={p.img} alt={p.name} />
                <div className="hp-card-overlay">
                  <div className="hp-card-hint">View Details</div>
                  <div className="hp-card-tag">{p.tag}</div>
                  <div className="hp-card-name">{p.name}</div>
                  <div className="hp-card-meta">
                    <i className="fa fa-map-marker-alt" style={{ color: 'var(--gold)', marginRight: 6 }}></i>
                    {p.location}
                  </div>
                  <div className="hp-card-desc">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact-section" className="section-pad">
        <div className="contact-inner">
          <div className="contact-info fade-left">
            <div className="section-label">Get In Touch</div>
            <div className="gold-bar"></div>
            <h2 className="section-title">Let's Build<br />Something Great</h2>
            <p>Whether you're planning a residential development, commercial complex, or large-scale infrastructure — we'd love to hear from you. Reach out and one of our associates will connect with you within 24 hours.</p>
            <div className="contact-items">
              <div className="contact-item">
                <div className="contact-item-icon"><i className="fa fa-map-marker-alt"></i></div>
                <div className="contact-item-text">
                  <strong>Office</strong>
                  <span>Shop 5, Vuda Shopping Centre, Sector-7, MVP Colony,<br />Visakhapatnam, Andhra Pradesh — 530017</span>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon"><i className="fa fa-phone-alt"></i></div>
                <div className="contact-item-text"><strong>Phone</strong><span>+91 99088 34499</span></div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon"><i className="fa fa-envelope"></i></div>
                <div className="contact-item-text"><strong>Email</strong><span>srconstructions64@gmail.com</span></div>
              </div>
            </div>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30400.43125390577!2d83.30225211083985!3d17.742098999999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3945001951e543%3A0xf6ad36daa644d8d1!2sSR%20constructions!5e0!3m2!1sen!2sin!4v1772892246396!5m2!1sen!2sin"
                allowFullScreen
                loading="lazy"
                title="SR Constructions Location"
              ></iframe>
            </div>
            <div className="social-links">
              <a href="https://wa.me/9908834499" className="social-link" target="_blank" rel="noreferrer"><i className="fab fa-whatsapp"></i></a>
              <a href="https://www.instagram.com/srconstructions64" className="social-link" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
              <a href="https://www.facebook.com/profile.php?id=61585204748688" className="social-link" target="_blank" rel="noreferrer"><i className="fab fa-facebook-f"></i></a>
              <a href="https://www.youtube.com/@SRConstructions64" className="social-link" target="_blank" rel="noreferrer"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
          <div className="contact-form-wrap fade-right">
            <form action="https://formspree.io/f/mreygnng" method="POST" onSubmit={handleContactSubmit}>
              <h3>Send Us a Message</h3>
              <p>Fill in your details and we'll get back to you promptly.</p>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" name="Name" className="form-input" placeholder="Your full name" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input type="tel" name="Phone number" className="form-input" placeholder="+91 XXXXX XXXXX" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" name="Email" className="form-input" placeholder="you@company.com" required />
              </div>
              <div className="form-group">
                <label className="form-label">Project Type</label>
                <select name="Project Type" className="form-input" required>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Layouts">Layouts</option>
                  <option value="Project development">Project Development</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea name="Message" className="form-textarea" placeholder="Tell us about your project vision…" required></textarea>
              </div>
              <button type="submit" className="btn-gold">
                Send Enquiry <i className="fa fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
