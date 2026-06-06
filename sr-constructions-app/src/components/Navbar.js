import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  const scrollTo = (id) => {
    if (!isHome) {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMenuOpen(false);
  };

  const navClass = isHome ? (scrolled ? 'scrolled' : '') : 'solid';

  const backLabel = {
    '/projects': 'All Projects',
    '/ongoing': 'All Ongoing',
  }[location.pathname] || 'Back';

  return (
    <>
      <nav className={navClass}>
        <div className="nav-logo" onClick={() => navigate('/')}>
          <div className="nav-logo-icon"><span>SR</span></div>
          <div className="nav-logo-text">SR <span>Constructions</span></div>
        </div>

        {isHome ? (
          <ul className="nav-links" id="mainNavLinks">
            <li><button onClick={() => scrollTo('about-section')} style={{all:'unset',cursor:'pointer',fontFamily:'inherit'}}>About</button></li>
            <li><button onClick={() => scrollTo('vision-section')} style={{all:'unset',cursor:'pointer',fontFamily:'inherit'}}>Vision</button></li>
            <li><button onClick={() => scrollTo('projects-section')} style={{all:'unset',cursor:'pointer',fontFamily:'inherit'}}>Projects</button></li>
            <li><button onClick={() => scrollTo('upcoming-section')} style={{all:'unset',cursor:'pointer',fontFamily:'inherit'}}>Ongoing Projects</button></li>
            <li><button onClick={() => scrollTo('contact-section')} className="nav-cta" style={{cursor:'pointer'}}>Book a site visit</button></li>
            <li>
              <a href="https://wa.me/9908834499" className="social-link" target="_blank" rel="noreferrer">
                <i className="fab fa-whatsapp"></i>
              </a>
            </li>
          </ul>
        ) : (
          <button className="nav-back-btn" onClick={() => navigate(-1)}>
            <i className="fa fa-arrow-left"></i> <span>{backLabel}</span>
          </button>
        )}

        <div className="hamburger" onClick={() => setMenuOpen(true)}>
          <span /><span /><span />
        </div>
      </nav>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <button className="mobile-close" onClick={() => setMenuOpen(false)}>
          <i className="fa fa-times"></i>
        </button>
        <button onClick={() => scrollTo('about-section')} style={{all:'unset',cursor:'pointer',fontFamily:"'Playfair Display',serif",fontSize:36,fontWeight:700,color:'var(--text)'}}>About</button>
        <button onClick={() => scrollTo('vision-section')} style={{all:'unset',cursor:'pointer',fontFamily:"'Playfair Display',serif",fontSize:36,fontWeight:700,color:'var(--text)'}}>Vision</button>
        <button onClick={() => scrollTo('projects-section')} style={{all:'unset',cursor:'pointer',fontFamily:"'Playfair Display',serif",fontSize:36,fontWeight:700,color:'var(--text)'}}>Projects</button>
        <button onClick={() => scrollTo('upcoming-section')} style={{all:'unset',cursor:'pointer',fontFamily:"'Playfair Display',serif",fontSize:36,fontWeight:700,color:'var(--text)'}}>Ongoing Projects</button>
        <button onClick={() => scrollTo('contact-section')} style={{all:'unset',cursor:'pointer',fontFamily:"'Playfair Display',serif",fontSize:36,fontWeight:700,color:'var(--text)'}}>Contact</button>
      </div>
    </>
  );
}
