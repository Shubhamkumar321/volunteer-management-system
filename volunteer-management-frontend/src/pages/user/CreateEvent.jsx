import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import Navbar from "../../components/Navbar";
import { createEvent } from "../../services/eventService";

const CreateEvent = () => {

  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    city: "",
    address: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    maxVolunteers: "",
    categoryId: ""
  });

  const handleChange = (e) => {

    setEventData({
      ...eventData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await createEvent({
        ...eventData,
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

            <div className="mb-3">
              <label className="form-label">
                City
              </label>

              <input
                type="text"
                name="city"
                className="form-control"
                value={eventData.city}
                onChange={handleChange}
                required
              />
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

                <label className="form-label">
                  End Time
                </label>

                <input
                  type="time"
                  name="endTime"
                  className="form-control"
                  value={eventData.endTime}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

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