import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import {
  FaUsers,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaClipboardList,
  FaMapMarkerAlt,
  FaTags,
  FaTrophy
}
from "react-icons/fa"; 

import Navbar from "../../components/Navbar";

import {
  getApprovedEvents,
  getRejectedEvents,
  getDashboardAnalytics,
  getPendingEvents,
  approveEvent,
  rejectEvent
} from "../../services/adminService";

const AdminDashboard = () => {

  const [analytics, setAnalytics] =
    useState(null);

  const [pendingEvents, setPendingEvents] =
    useState([]);

  const [selectedType, setSelectedType] =
    useState("PENDING");

  useEffect(() => {

    loadDashboard();

  }, []);

  const loadDashboard = async () => {

    try {

      const analyticsResponse =
        await getDashboardAnalytics();

      const pendingResponse =
        await getPendingEvents();

      setAnalytics(
        analyticsResponse.data
      );

      setPendingEvents(
        pendingResponse.data
      );

    } catch (error) {

      console.log(error);

    }

  };

  const loadPending = async () => {

    const response =
      await getPendingEvents();

    setPendingEvents(
      response.data
    );

    setSelectedType(
      "PENDING"
    );

  };

  const loadApproved = async () => {

    const response =
      await getApprovedEvents();

    setPendingEvents(
      response.data
    );

    setSelectedType(
      "APPROVED"
    );

  };

  const loadRejected = async () => {

    const response =
      await getRejectedEvents();

    setPendingEvents(
      response.data
    );

    setSelectedType(
      "REJECTED"
    );

  };

  const handleApprove =
    async (eventId) => {

      try {

        await approveEvent(
          eventId
        );

        Swal.fire({
          icon: "success",
          title: "Event Approved"
        });

        loadDashboard();

      } catch (error) {

        console.log(error);

      }

    };

  const handleReject =
    async (eventId) => {

      try {

        await rejectEvent(
          eventId
        );

        Swal.fire({
          icon: "success",
          title: "Event Rejected"
        });

        loadDashboard();

      } catch (error) {

        console.log(error);

      }

    };

  return (

    <>
      <Navbar />

      <div className="container py-5">

        <h2 className="mb-4">
          Admin Dashboard
        </h2>

        {analytics && (

          <div className="row">

            <div className="col-md-4 mb-3">

              <div
                className="
                card
                shadow-sm
                border-0
                p-3
                "
              >

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <h6>
                      Total Users
                    </h6>

                    <h3>
                      {analytics.totalUsers}
                    </h3>

                  </div>

                  <FaUsers
                    size={35}
                    color="#0d6efd"
                  />

                </div>

              </div>

            </div>

            <div className="col-md-4 mb-3">

              <div
                className="
                card
                shadow-sm
                border-0
                p-3
                "
              >

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <h6>
                      Total Events
                    </h6>

                    <h3>
                      {analytics.totalEvents}
                    </h3>

                  </div>

                  <FaCalendarAlt
                    size={35}
                    color="#6f42c1"
                  />

                </div>

              </div>

            </div>

            <div className="col-md-4 mb-3">

              <div
                className="
                card
                shadow-sm
                border-0
                p-3
                "
              >

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <h6>
                      Registrations
                    </h6>

                    <h3>
                      {analytics.totalRegistrations}
                    </h3>

                  </div>

                  <FaClipboardList
                    size={35}
                    color="#20c997"
                  />

                </div>

              </div>

            </div>

            <div className="col-md-4 mb-3">

              <div
                className="
                card
                shadow-sm
                border-0
                p-3
                "
                style={{
                  cursor: "pointer"
                }}
                onClick={loadPending}
              >

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <h6>
                      Pending
                    </h6>

                    <h3>
                      {analytics.pendingEvents}
                    </h3>

                  </div>

                  <FaClock
                    size={35}
                    color="#ffc107"
                  />

                </div>

              </div>

            </div>

            <div className="col-md-4 mb-3">

              <div
                className="
                card
                shadow-sm
                border-0
                p-3
                "
                style={{
                  cursor: "pointer"
                }}
                onClick={loadApproved}
              >

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <h6>
                      Approved
                    </h6>

                    <h3>
                      {analytics.approvedEvents}
                    </h3>

                  </div>

                  <FaCheckCircle
                    size={35}
                    color="#198754"
                  />

                </div>

              </div>

            </div>

            <div className="col-md-4 mb-3">

              <div
                className="
                card
                shadow-sm
                border-0
                p-3
                "
                style={{
                  cursor: "pointer"
                }}
                onClick={loadRejected}
              >

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <h6>
                      Rejected
                    </h6>

                    <h3>
                      {analytics.rejectedEvents}
                    </h3>

                  </div>

                  <FaTimesCircle
                    size={35}
                    color="#dc3545"
                  />

                </div>

              </div>

            </div>

          </div>

        )}

        {analytics && (

  <div className="row mb-4">

    <div className="col-md-4 mb-3">

      <div
        className="
        card
        shadow-sm
        border-0
        p-3
        h-100
        "
      >

        <div
          className="
          d-flex
          justify-content-between
          align-items-center
          "
        >

          <div>

            <h6>

              Most Active City

            </h6>

            <h4>

              {analytics.mostActiveCity}

            </h4>

          </div>

          <FaMapMarkerAlt
            size={35}
            color="#0dcaf0"
          />

        </div>

      </div>

    </div>

    <div className="col-md-4 mb-3">

      <div
        className="
        card
        shadow-sm
        border-0
        p-3
        h-100
        "
      >

        <div
          className="
          d-flex
          justify-content-between
          align-items-center
          "
        >

          <div>

            <h6>

              Most Popular Category

            </h6>

            <h4>

              {analytics.mostPopularCategory}

            </h4>

          </div>

          <FaTags
            size={35}
            color="#fd7e14"
          />

        </div>

      </div>

    </div>

    <div className="col-md-4 mb-3">

      <div
        className="
        card
        shadow-sm
        border-0
        p-3
        h-100
        "
      >

        <div
          className="
          d-flex
          justify-content-between
          align-items-center
          "
        >

          <div>

            <h6>

              Most Popular Event

            </h6>

            <h4>

              {analytics.mostPopularEvent}

            </h4>

          </div>

          <FaTrophy
            size={35}
            color="#ffc107"
          />

        </div>

      </div>

    </div>

  </div>

)}
        <div className="card shadow-sm border-0 p-4">

          <h4 className="mb-3">

            {selectedType}
            {" "}
            Events

          </h4>

          <table className="table table-hover">

            <thead>

              <tr>

                <th>Title</th>

                <th>City</th>

                <th>Category</th>

                <th>Date</th>

                <th>Status</th>

                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {

                pendingEvents.map((event) => (

                  <tr key={event.id}>

                    <td>
                      {event.title}
                    </td>

                    <td>
                      {event.city}
                    </td>

                    <td>
                      {event.category}
                    </td>

                    <td>
                      {event.eventDate}
                    </td>

                    <td>

                      {event.status === "APPROVED" && (

                        <span className="badge bg-success">
                          APPROVED
                        </span>

                      )}

                      {event.status === "PENDING" && (

                        <span className="badge bg-warning text-dark">
                          PENDING
                        </span>

                      )}

                      {event.status === "REJECTED" && (

                        <span className="badge bg-danger">
                          REJECTED
                        </span>

                      )}

                    </td>

                    <td>

                      {event.status === "PENDING" && (

                        <>

                          <button
                            onClick={() =>
                              handleApprove(
                                event.id
                              )
                            }
                            className="
                            btn
                            btn-success
                            btn-sm
                            me-2
                            "
                          >

                            Approve

                          </button>

                          <button
                            onClick={() =>
                              handleReject(
                                event.id
                              )
                            }
                            className="
                            btn
                            btn-danger
                            btn-sm
                            "
                          >

                            Reject

                          </button>

                        </>

                      )}

                    </td>

                  </tr>

                ))

              }

            </tbody>

          </table>

        </div>

      </div>

    </>

  );

};

export default AdminDashboard;