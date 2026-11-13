import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { STATE_CITIES, STATES } from "../data/locations";

import {
  searchEvents,
  registerForEvent
} from "../services/eventService";

const PublicEvents = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [state, setState] =
    useState("");

  const [city, setCity] =
    useState("");

  const [events, setEvents] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const handleRegister =
    async (eventId) => {
      if (!user || !localStorage.getItem("token")) {
        const result = await Swal.fire({
          icon: "info",
          title: "Create an account to join",
          text: "Sign up before registering for a volunteer event, or sign in if you already have an account.",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "Create account",
          denyButtonText: "Sign in",
          cancelButtonText: "Not now"
        });

        if (result.isConfirmed) {
          navigate("/register");
        } else if (result.isDenied) {
          navigate("/login");
        }

        return;
      }

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
            "Please select a state and city."
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

        <div className="row g-3 mb-4">

          <div className="col-md-4">

            <label className="form-label" htmlFor="search-state">
              State
            </label>

            <select
              id="search-state"
              className="form-select"
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setCity("");
              }}
            >
              <option value="">Select state</option>
              {STATES.map((stateName) => (
                <option key={stateName} value={stateName}>{stateName}</option>
              ))}
            </select>

          </div>

          <div className="col-md-4">

            <label className="form-label" htmlFor="search-city">
              City
            </label>

            <select
              id="search-city"
              className="form-select"
              value={city}
              onChange={(e) =>
                setCity(
                  e.target.value
                )
              }
              disabled={!state}
            >
              <option value="">
                {state ? "Select city" : "Select a state first"}
              </option>
              {(STATE_CITIES[state] || []).map((cityName) => (
                <option key={cityName} value={cityName}>{cityName}</option>
              ))}
            </select>

          </div>

          <div className="col-md-4 d-flex align-items-end">

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

            Select a state and city to view events.

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

                  <p>
                    <strong>Time:</strong>{" "}
                    {event.startTime?.slice(0, 5)} – {event.endTime?.slice(0, 5)}
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