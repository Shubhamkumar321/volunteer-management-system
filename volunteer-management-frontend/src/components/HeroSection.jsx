import { useNavigate }
from "react-router-dom";


const HeroSection = () => {

const navigate =
  useNavigate();


  return (

    <section
      className="
      text-center
      py-5
      "
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center"
      }}
    >

      <div className="container">

        <h1
          className="
          display-2
          fw-bold
          "
          style={{
            color: "#2563eb"
          }}
        >

          VolunteerConnect

        </h1>

        <p
          className="
          lead
          mt-4
          "
        >

          Discover meaningful volunteer
          opportunities and create
          positive impact in society.

        </p>

        <div
          className="
          mt-5
          "
        >

       <button

        className="
        primary-btn
        "

        onClick={() =>

          navigate("/events")

        }

      >

        Explore Events

      </button>

        </div>

      </div>

    </section>
  );
};

export default HeroSection;