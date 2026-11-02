const FeaturedEvents = () => {

  const events = [
  {
    title: "Tree Plantation Drive",
    city: "Pune",
    image:
      "https://picsum.photos/600/400?random=1"
  },
  {
    title: "Blood Donation Camp",
    city: "Mumbai",
    image:
      "https://picsum.photos/600/400?random=2"
  },
  {
    title: "Food Distribution",
    city: "Delhi",
    image:
      "https://picsum.photos/600/400?random=3"
  }
];

  return (

    <section className="py-5">

      <div className="container">

        <h2
          className="
          text-center
          fw-bold
          mb-5
          "
        >
          Featured Events
        </h2>

        <div className="row">

          {
            events.map(
              (event, index) => (

                <div
                  key={index}
                  className="
                  col-md-4
                  mb-4
                  "
                >

                  <div
                    className="
                    card
                    border-0
                    shadow-sm
                    h-100
                    "
                    style={{
                      borderRadius: "20px",
                      overflow: "hidden"
                    }}
                  >

                    {event.image}

                    <div className="card-body">

                      <h5
                        className="
                        fw-bold
                        "
                      >
                        {event.title}
                      </h5>

                      <p
                        className="
                        text-muted
                        "
                      >
                        📍 {event.city}
                      </p>

                      <button
                        className="
                        btn
                        btn-primary
                        rounded-pill
                        px-4
                        "
                      >
                        View Details
                      </button>

                    </div>

                  </div>

                </div>

              )
            )
          }

        </div>

      </div>

    </section>

  );
};

export default FeaturedEvents;