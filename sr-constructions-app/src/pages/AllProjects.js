import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PROJECTS } from '../data/projects';
import MiniFooter from '../components/MiniFooter';
import useScrollAnimation from '../components/useScrollAnimation';

const FILTERS = ['all', 'Residential', 'Commercial', 'Plot Layout'];

export default function AllProjects() {
  const [active, setActive] = useState('all');
  const navigate = useNavigate();
  useScrollAnimation();

  const filtered = active === 'all' ? PROJECTS : PROJECTS.filter((p) => p.tag === active);

  return (
    <>
      <div className="page-hero" data-bg-text="PROJECTS">
        <div className="page-hero-inner">
          <div className="section-label">Our Portfolio</div>
          <div className="gold-bar"></div>
          <h1>Every Project,<br /><em style={{ fontStyle: 'italic', color: 'var(--gold-light)' }}>A Promise Kept.</em></h1>
          <p>From residential apartments to plot layouts — explore the full breadth of SR Constructions' completed works across Visakhapatnam.</p>
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
          <div className="listing-grid">
            {filtered.map((p, i) => (
              <div
                key={p.id}
                className="listing-card fade-up"
                style={{ transitionDelay: `${(i % 3) * 0.07}s` }}
                onClick={() => navigate(`/projects/${p.id}`)}
              >
                <div className="listing-card-img-wrap">
                  <img className="listing-card-img" src={p.img} alt={p.name} />
                  <div className="listing-badge">Sold Out</div>
                </div>
                <div className="listing-card-body">
                  <div className="listing-card-tag">{p.tag}</div>
                  <div className="listing-card-name">{p.name}</div>
                  <div className="listing-card-location">
                    <i className="fa fa-map-marker-alt" style={{ color: 'var(--gold)', marginRight: 6 }}></i>
                    {p.location}
                  </div>
                  <div className="listing-card-desc">{p.desc}</div>
                  <div className="listing-card-footer">
                    <span className="listing-card-year">{p.year}</span>
                    <span className="listing-card-link">View Details <i className="fa fa-arrow-right"></i></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MiniFooter />
    </>
  );
}
