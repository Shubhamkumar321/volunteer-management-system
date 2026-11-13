import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import Navbar from "../../components/Navbar";
import { createEvent } from "../../services/eventService";
import { STATE_CITIES, STATES } from "../../data/locations";

const DURATION_OPTIONS = [30, 60, 90, 120, 180, 240, 300, 360, 480, 600, 720];

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} minutes`;
  const hourLabel = `${hours} hour${hours > 1 ? "s" : ""}`;
  return rest ? `${hourLabel} ${rest} minutes` : hourLabel;
};

const toDateInputValue = (date) => {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 10);
};

// Returns null when the event would run past midnight, which the backend does not support.
const calculateEndTime = (startTime, durationMinutes) => {
  if (!startTime || !durationMinutes) return "";
  const [hours, minutes] = startTime.split(":").map(Number);
  const endMinutes = hours * 60 + minutes + Number(durationMinutes);
  if (endMinutes >= 24 * 60) return null;
  const endHours = String(Math.floor(endMinutes / 60)).padStart(2, "0");
  return `${endHours}:${String(endMinutes % 60).padStart(2, "0")}`;
};

const CreateEvent = () => {

  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    state: "",
    city: "",
    address: "",
    eventDate: "",
    startTime: "",
    durationMinutes: "",
    maxVolunteers: "",
    categoryId: ""
  });

  const today = toDateInputValue(new Date());
  const endTime = calculateEndTime(eventData.startTime, eventData.durationMinutes);

  const handleChange = (e) => {

    const { name, value } = e.target;

    setEventData({
      ...eventData,
      [name]: value,
      ...(name === "state" ? { city: "" } : {})
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (endTime === null) {
      Swal.fire({
        icon: "warning",
        title: "Duration Too Long",
        text: "The event must end before midnight. Choose an earlier start time or a shorter duration."
      });
      return;
    }

    const startsAt = new Date(`${eventData.eventDate}T${eventData.startTime}`);

    if (startsAt <= new Date()) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Start Time",
        text: "The event start time must be in the future."
      });
      return;
    }

    try {

      await createEvent({
        title: eventData.title,
        description: eventData.description,
        city: eventData.city,
        address: eventData.address,
        eventDate: eventData.eventDate,
        startTime: eventData.startTime,
        endTime,
        maxVolunteers: Number(
          eventData.maxVolunteers
        ),
        categoryId: Number(
          eventData.categoryId
        )
      });

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Event Created Successfully"
      });

      navigate("/dashboard");

    } catch (error) {

  console.log(
    "FULL ERROR",
    error
  );

  console.log(
    "RESPONSE",
    error.response
  );

  console.log(
    "DATA",
    error.response?.data
  );

  Swal.fire({

    icon: "error",

    title: "Failed",

    text:

      error.response?.data?.message

      ||

      JSON.stringify(
        error.response?.data
      )

      ||

      "Event Creation Failed"

  });

}

  };

  return (
    <>
      <Navbar />

      <div className="container py-5">

        <div className="card shadow-sm border-0 p-4">

          <h2 className="mb-4">
            Create Event
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">
                Title
              </label>

              <input
                type="text"
                name="title"
                className="form-control"
                value={eventData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Description
              </label>

              <textarea
                name="description"
                className="form-control"
                rows="4"
                value={eventData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">

              <div className="col-md-6 mb-3">
                <label className="form-label" htmlFor="event-state">
                  State
                </label>

                <select
                  id="event-state"
                  name="state"
                  className="form-select"
                  value={eventData.state}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select state</option>
                  {STATES.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label" htmlFor="event-city">
                  City
                </label>

                <select
                  id="event-city"
                  name="city"
                  className="form-select"
                  value={eventData.city}
                  onChange={handleChange}
                  disabled={!eventData.state}
                  required
                >
                  <option value="">
                    {eventData.state ? "Select city" : "Select a state first"}
                  </option>
                  {(STATE_CITIES[eventData.state] || []).map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

            </div>

            <div className="mb-3">
              <label className="form-label">
                Address
              </label>

              <input
                type="text"
                name="address"
                className="form-control"
                value={eventData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Event Date
              </label>

              <input
                type="date"
                name="eventDate"
                className="form-control"
                min={today}
                value={eventData.eventDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">

              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Start Time
                </label>

                <input
                  type="time"
                  name="startTime"
                  className="form-control"
                  value={eventData.startTime}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-md-6 mb-3">

                <label className="form-label" htmlFor="durationMinutes">
                  Duration
                </label>

                <select
                  id="durationMinutes"
                  name="durationMinutes"
                  className="form-select"
                  value={eventData.durationMinutes}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select duration</option>
                  {DURATION_OPTIONS.map((minutes) => (
                    <option key={minutes} value={minutes}>
                      {formatDuration(minutes)}
                    </option>
                  ))}
                </select>

              </div>

            </div>

            {endTime && (
              <div className="alert alert-success py-2">
                Ends at <strong>{endTime}</strong>. The event will be hidden from the public events page after this time.
              </div>
            )}

            {endTime === null && (
              <div className="alert alert-warning py-2">
                This duration runs past midnight. Choose an earlier start time or a shorter duration.
              </div>
            )}

            <div className="mb-3">

              <label className="form-label">
                Max Volunteers
              </label>

              <input
                type="number"
                name="maxVolunteers"
                className="form-control"
                value={eventData.maxVolunteers}
                onChange={handleChange}
                required
              />

            </div>

            <div className="mb-4">

              <label className="form-label">
                Category
              </label>

              <select
                name="categoryId"
                className="form-select"
                value={eventData.categoryId}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Category
                </option>

                <option value="1">
                  Environment
                </option>

                <option value="2">
                  Health
                </option>

                <option value="3">
                  Education
                </option>

                <option value="1">
                  Animal Welfare
                </option>

              </select>

            </div>

            <button
              type="submit"
              className="btn btn-primary"
            >

              Create Event

            </button>

          </form>

        </div>

      </div>

    </>
  );

};

export default CreateEvent;