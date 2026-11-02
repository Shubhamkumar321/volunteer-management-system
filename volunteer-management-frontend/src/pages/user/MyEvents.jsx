import {
  useEffect,
  useState
} from "react";

import Navbar
from "../../components/Navbar";

import {
  getMyEvents
}
from "../../services/eventService";

const MyEvents = () => {

  const [events,
          setEvents] =

    useState([]);

  useEffect(() => {

    loadEvents();

  }, []);

  const loadEvents =
    async () => {

      try {

        const response =
          await getMyEvents();

        setEvents(
          response.data
        );

      }

      catch (error) {

        console.log(error);

      }

    };

  const getBadgeColor =
  (status) => {

    switch(status) {

      case "APPROVED":
        return "success";

      case "REJECTED":
        return "danger";

      default:
        return "warning";
    }

  };

  return (

    <>

      <Navbar />

      <div
        className="
        container
        py-5
        "
      >

        <h2
          className="
          mb-4
          "
        >

          My Events

        </h2>

        {

          events.length === 0 ?

          (

            <div
              className="
              alert
              alert-info
              "
            >

              No Events Found

            </div>

          )

          :

          (

            <div className="row">

              {

                events.map(

                  (event) => (

                    <div
                      key={event.id}
                      className="
                      col-md-6
                      mb-4
                      "
                    >

                      <div
                        className="
                        card
                        shadow-sm
                        border-0
                        h-100
                        "
                      >

                        <div
                          className="
                          card-body
                          "
                        >

                          <h4>

                            {event.title}

                          </h4>

                          <p>

                            {event.description}

                          </p>

                          <p>

                            <strong>

                              City:

                            </strong>

                            {" "}

                            {event.city}

                          </p>

                          <p>

                            <strong>

                              Category:

                            </strong>

                            {" "}

                            {event.category}

                          </p>

                          <p>

                            <strong>

                              Date:

                            </strong>

                            {" "}

                            {event.eventDate}

                          </p>

                          <span

                            className={
                              `badge bg-${getBadgeColor(
                                event.status
                              )}`
                            }

                          >

                            {event.status}

                          </span>

                        </div>

                      </div>

                    </div>

                  )

                )

              }

            </div>

          )

        }

      </div>

    </>

  );

};

export default MyEvents;