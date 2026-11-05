import { FaCalendarCheck, FaCity, FaUsers } from "react-icons/fa";

const Statistics = () => {
  const statistics = [
    { value: "500+", label: "Events", icon: <FaCalendarCheck /> },
    { value: "1000+", label: "Volunteers", icon: <FaUsers /> },
    { value: "50+", label: "Cities", icon: <FaCity /> }
  ];

  return (
    <section className="impact-stats" aria-label="VolunteerConnect community impact">
      <div className="container">
        <div className="impact-grid">
          {statistics.map((statistic) => (
            <div className="impact-stat" key={statistic.label}>
              <span className="impact-icon" aria-hidden="true">{statistic.icon}</span>
              <div>
                <p className="impact-value">{statistic.value}</p>
                <p className="impact-label">{statistic.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;