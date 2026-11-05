import { Link } from "react-router-dom";
import { FaArrowRight, FaMapMarkerAlt } from "react-icons/fa";

const FeaturedEvents = () => {
  const events = [
    {
      title: "Tree Plantation Drive",
      city: "Pune",
      image: "/event-environment.jpg"
    },
    {
      title: "Blood Donation Camp",
      city: "Mumbai",
      image: "/event-donation.jpg"
    },
    {
      title: "Food Distribution",
      city: "Delhi",
      image: "/event-food.jpg"
    }
  ];

  return (
    <section className="featured-events-section">
      <div className="container">
        <div className="section-heading-row">
          <div>
            <p className="section-eyebrow">Get involved</p>
            <h2 className="home-section-title">Opportunities to show up</h2>
          </div>
          <Link to="/events" className="all-events-link">
            View all events <FaArrowRight aria-hidden="true" />
          </Link>
        </div>
        <div className="event-grid">
          {events.map((event) => (
            <article className="event-card" key={event.title}>
              <img
                className="event-image"
                src={event.image}
                alt={event.title}
                loading="lazy"
                decoding="async"
              />
              <div className="event-card-body">
                <h3>{event.title}</h3>
                <p className="event-location">
                  <FaMapMarkerAlt aria-hidden="true" /> {event.city}
                </p>
                <Link to="/events" className="event-card-link">
                  View opportunity <FaArrowRight aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;