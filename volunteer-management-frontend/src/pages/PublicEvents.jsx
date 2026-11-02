import { useState } from "react";
import Swal from "sweetalert2";

import Navbar from "../components/Navbar";

import {
  searchEvents,
  registerForEvent
} from "../services/eventService";

const PublicEvents = () => {

  const [city, setCity] =
    useState("");

  const [events, setEvents] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const handleRegister =
    async (eventId) => {

      try {

        await registerForEvent(
          eventId
        );

        await Swal.fire({
          icon: "success",
          title:
            "Registration Successful",
          text:
            "You have successfully registered for this event."
        });

      } catch (error) {

        Swal.fire({
          icon: "error",
          title:
            "Registration Failed",
          text:
            error.response?.data?.message ||
            "Unable to register"
        });

      }

    };

  const handleSearch =
    async () => {

      if (!city.trim()) {

        Swal.fire({
          icon: "warning",
          title: "City Required",
          text:
            "Please enter a city."
        });

        return;

      }

      try {

        setLoading(true);

        const response =
          await searchEvents(city);

        setEvents(
          response.data
        );

      } catch (error) {

        console.log(error);

        Swal.fire({
          icon: "error",
          title:
            "Search Failed",
          text:
            "Unable to fetch events."
        });

      } finally {

        setLoading(false);

      }

    };

  return (
    <>
      <Navbar />

      <div className="container py-5">

        <h2 className="mb-2">
          Explore Events
        </h2>

        <p className="text-muted mb-4">
          Search volunteer opportunities by city.
        </p>

        <div className="row mb-4">

          <div className="col-md-8">

            <input
              type="text"
              className="form-control"
              placeholder="Enter City"
              value={city}
              onChange={(e) =>
                setCity(
                  e.target.value
                )
              }
            />

          </div>

          <div className="col-md-4">

            <button
              onClick={
                handleSearch
              }
              className="
              btn
              btn-primary
              w-100
              "
            >

              Search

            </button>

          </div>

        </div>

        {loading && (

          <div className="alert alert-info">

            Loading Events...

          </div>

        )}

        {!loading &&
          events.length === 0 && (

          <div className="alert alert-secondary">

            Search a city to view events.

          </div>

        )}

        <div className="row">

          {events.map((event) => (

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

                <div className="card-body">

                  <h4>
                    {event.title}
                  </h4>

                  <p>
                    {event.description}
                  </p>

                  <p>
                    <strong>City:</strong>{" "}
                    {event.city}
                  </p>

                  <p>
                    <strong>Category:</strong>{" "}
                    {event.category}
                  </p>

                  <p>
                    <strong>Organizer:</strong>{" "}
                    {event.organizer}
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {event.eventDate}
                  </p>

                  <div
                    className="
                    d-flex
                    justify-content-between
                    align-items-center
                    mt-3
                    "
                  >

                    <span
                      className="
                      badge
                      bg-success
                      "
                    >

                      {event.status}

                    </span>

                    <button
                      onClick={() =>
                        handleRegister(
                          event.id
                        )
                      }
                      className="
                      btn
                      btn-primary
                      btn-sm
                      "
                    >

                      Register

                    </button>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </>
  );

};

export default PublicEvents;