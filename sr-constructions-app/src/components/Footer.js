import { useNavigate } from 'react-router-dom';

const btnStyle = { all: 'unset', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 14, transition: 'color .3s' };

export default function Footer() {
  const navigate = useNavigate();

  const scrollToContact = () => {
    navigate('/');
    setTimeout(() => {
      document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  };

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="nav-logo" onClick={() => navigate('/')} style={{ marginBottom: 16, display: 'inline-flex', cursor: 'pointer' }}>
            <div className="nav-logo-icon"><span>SR</span></div>
            <div className="nav-logo-text">SR <span>Constructions</span></div>
          </div>
          <p>Building India's future with precision engineering, sustainable practices, and an unshakeable commitment to quality — since 2007.</p>
          <div className="social-links" style={{ marginTop: 24 }}>
            <a href="https://wa.me/9908834499" className="social-link" target="_blank" rel="noreferrer"><i className="fab fa-whatsapp"></i></a>
            <a href="https://www.instagram.com/srconstructions64" className="social-link" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
            <a href="https://www.facebook.com/profile.php?id=61585204748688" className="social-link" target="_blank" rel="noreferrer"><i className="fab fa-facebook-f"></i></a>
            <a href="https://www.youtube.com/@SRConstructions64" className="social-link" target="_blank" rel="noreferrer"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><button style={btnStyle} onClick={() => { navigate('/'); setTimeout(() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' }), 200); }}>About Us</button></li>
            <li><button style={btnStyle} onClick={() => { navigate('/'); setTimeout(() => document.getElementById('vision-section')?.scrollIntoView({ behavior: 'smooth' }), 200); }}>Vision &amp; Mission</button></li>
            <li><button style={btnStyle} onClick={() => navigate('/projects')}>Our Projects</button></li>
            <li><button style={btnStyle} onClick={() => navigate('/ongoing')}>Ongoing Projects</button></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Services</h4>
          <ul>
            <li><button style={btnStyle} onClick={scrollToContact}>Residential Projects</button></li>
            <li><button style={btnStyle} onClick={scrollToContact}>Commercial Construction</button></li>
            <li><button style={btnStyle} onClick={scrollToContact}>Plot Layouts</button></li>
            <li><button style={btnStyle} onClick={scrollToContact}>Project Development</button></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <ul>
            <li><a href="tel:+919908834499">+91 99088 34499</a></li>
            <li><a href="mailto:srconstructions64@gmail.com">srconstructions64@gmail.com</a></li>
            <li><button style={btnStyle} onClick={scrollToContact}>MVP, Visakhapatnam</button></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 <span>SR Constructions &amp; Trisandhya</span> All rights reserved.</p>
        <p>Built with <span>&#9829;</span> in Visakhapatnam, India</p>
      </div>
    </footer>
  );
}
