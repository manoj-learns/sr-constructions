import { useNavigate } from 'react-router-dom';

export default function MiniFooter() {
  const navigate = useNavigate();

  const goToContact = () => {
    navigate('/');
    setTimeout(() => {
      document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  };

  return (
    <footer className="mini-footer">
      <div className="mini-footer-inner">
        <p>&copy; 2025 <span>SR Constructions &amp; Trisandhya</span>. All rights reserved.</p>
        <button className="btn-gold-sm" onClick={goToContact}>
          Enquire Now <i className="fa fa-arrow-right"></i>
        </button>
      </div>
    </footer>
  );
}
