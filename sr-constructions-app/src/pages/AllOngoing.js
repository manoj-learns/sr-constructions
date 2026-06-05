import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOngoing } from '../services/db';
import MiniFooter from '../components/MiniFooter';
import useScrollAnimation from '../components/useScrollAnimation';

const FILTERS = ['all', 'Available', 'Residential', 'Plot Layout'];

export default function AllOngoing() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('all');
  const navigate = useNavigate();
  useScrollAnimation();

  useEffect(() => {
    getOngoing()
      .then((data) => { setItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = items.filter((u) => {
    if (active === 'all') return true;
    if (active === 'Available') return u.badge === 'Available';
    return u.type === active;
  });

  return (
    <>
      <div className="page-hero" data-bg-text="ONGOING">
        <div className="page-hero-inner">
          <div className="live-indicator">
            <div className="pulse-dot"></div> Currently Available
          </div>
          <div className="section-label">Now Available</div>
          <div className="gold-bar"></div>
          <h1>Ongoing Projects.<br /><em style={{ fontStyle: 'italic', color: 'var(--gold-light)' }}>Available Now.</em></h1>
          <p>Plots and residences currently available across Visakhapatnam — your opportunity to secure a piece of tomorrow's prime locations.</p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-bar-inner">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-btn${active === f ? ' active' : ''}`}
              onClick={() => setActive(f)}
            >
              {f === 'all' ? 'All Projects' : f === 'Plot Layout' ? 'Plot Layouts' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="listing-section">
        <div className="listing-inner">
          {loading ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '60px 0' }}>Loading projects…</p>
          ) : (
            <div className="listing-grid">
              {filtered.map((u, i) => (
                <div
                  key={u.id}
                  className="listing-card fade-up"
                  style={{ transitionDelay: `${(i % 3) * 0.07}s` }}
                  onClick={() => navigate(`/ongoing/${u.id}`)}
                >
                  <div className="listing-card-img-wrap">
                    <img className="listing-card-img" src={u.img} alt={u.name} />
                    <div className="listing-badge badge-available">
                      <span className="bdot"></span>{u.badge}
                    </div>
                  </div>
                  <div className="listing-card-body">
                    <div className="listing-card-name">{u.name}</div>
                    <div className="listing-card-location">
                      <i className="fa fa-map-marker-alt" style={{ color: 'var(--gold)', marginRight: 6 }}></i>
                      {u.location}
                    </div>
                    <div className="listing-card-completion"><strong>{u.completion}</strong></div>
                    <div className="listing-card-desc">{u.desc}</div>
                    <div className="listing-card-footer">
                      <span className="register-pill">Enquire Now</span>
                      <span className="listing-card-link">View Details <i className="fa fa-arrow-right"></i></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <MiniFooter />
    </>
  );
}
