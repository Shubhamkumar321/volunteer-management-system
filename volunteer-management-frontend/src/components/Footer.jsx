import { Link } from "react-router-dom";
import { FaArrowRight, FaHandsHelping, FaHeart } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand-column">
            <Link to="/" className="footer-brand">
              <span className="footer-brand-icon" aria-hidden="true"><FaHandsHelping /></span>
              VolunteerConnect
            </Link>
            <p>
              Bringing caring people and local causes together, one meaningful moment at a time.
            </p>
            <Link to="/events" className="footer-action">
              Find an opportunity <FaArrowRight aria-hidden="true" />
            </Link>
          </div>
          <div className="footer-link-group">
            <h2>Explore</h2>
            <Link to="/">Home</Link>
            <Link to="/events">Browse events</Link>
          </div>
          <div className="footer-link-group">
            <h2>Get involved</h2>
            <Link to="/register">Create an account</Link>
            <Link to="/login">Volunteer sign in</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} VolunteerConnect</span>
          <span className="footer-made-with">
            Made for people who care <FaHeart aria-hidden="true" />
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;