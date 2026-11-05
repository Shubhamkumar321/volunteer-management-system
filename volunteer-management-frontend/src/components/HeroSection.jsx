import { Link } from "react-router-dom";
import { FaArrowRight, FaHandsHelping, FaMapMarkerAlt } from "react-icons/fa";

const HeroSection = () => {
  return (
    <section className="home-hero">
      <div className="container home-hero-inner">
        <div className="home-hero-copy">
          <p className="hero-eyebrow">
            <FaHandsHelping aria-hidden="true" />
            Find your way to make a difference
          </p>
          <h1 className="hero-title">
            <span className="hero-title-first">Volunteer</span><span>Connect</span>
          </h1>
          <p className="hero-description">
            Find local opportunities, meet people who care, and turn your time into lasting impact.
          </p>
          <div className="hero-actions">
            <Link to="/events" className="hero-primary-action">
              Explore opportunities
              <FaArrowRight aria-hidden="true" />
            </Link>
            <Link to="/register" className="hero-secondary-action">
              Join the community
            </Link>
          </div>
          <p className="hero-location-note">
            <FaMapMarkerAlt aria-hidden="true" />
            Good things happen close to home
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;