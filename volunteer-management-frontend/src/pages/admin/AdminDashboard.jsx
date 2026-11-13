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
  FaTrophy,
  FaDownload
}
from "react-icons/fa"; 

import Navbar from "../../components/Navbar";

import {
  getApprovedEvents,
  getRejectedEvents,
  getDashboardAnalytics,
  getAdminReports,
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
  const [reportData, setReportData] = useState(null);
  const [reportAction, setReportAction] = useState("");

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

      setReportData(null);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {
    Promise.all([
      getDashboardAnalytics(),
      getPendingEvents()
    ]).then(([analyticsResponse, pendingResponse]) => {
      setAnalytics(analyticsResponse.data);
      setPendingEvents(pendingResponse.data);
    }).catch((error) => {
      console.log(error);
    });
  }, []);

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

  const loadReports = async () => {
    if (reportData) {
      return reportData;
    }

    const response = await getAdminReports();
    setReportData(response.data);
    return response.data;
  };

  const showReport = async (reportType) => {
    setReportAction("loading");

    try {
      await loadReports();
      setSelectedType(reportType);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unable to load report",
        text: error.response?.data?.message || "Please try again."
      });
    } finally {
      setReportAction("");
    }
  };

  const exportAllReports = async () => {
    setReportAction("exporting");

    try {
      const reports = await loadReports();
      const rows = [
        ["Report type", "ID", "Name", "Email", "Mobile", "City", "Event", "Category", "Event date", "Registration date", "Status", "Role", "Active", "Rejection reason"],
        ...reports.users.map((user) => [
          "User", user.id, user.name, user.email, user.mobile, user.city,
          "", "", "", user.createdAt, "", user.role,
          user.active ? "Yes" : "No", ""
        ]),
        ...reports.events.map((event) => [
          "Event", event.id, event.organizer, "", "", event.city,
          event.title, event.category, event.eventDate, "", event.status,
          "", "", event.rejectionReason
        ]),
        ...reports.registrations.map((registration) => [
          "Registration", registration.registrationId,
          registration.volunteerName, registration.volunteerEmail, "",
          registration.city, registration.eventTitle, "",
          registration.eventDate, registration.registrationDate,
          registration.registrationStatus, "", "", ""
        ])
      ];
      const csv = rows.map((row) => row.map((value) => {
        let text = value == null ? "" : String(value);
        if (/^[\t\r ]*[=+\-@]/.test(text)) {
          text = `'${text}`;
        }
        return `"${text.replaceAll('"', '""')}"`;
      }).join(",")).join("\r\n");
      const blob = new Blob([`\uFEFF${csv}`], {
        type: "text/csv;charset=utf-8"
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `volunteerconnect-reports-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unable to export reports",
        text: error.response?.data?.message || "Please try again."
      });
    } finally {
      setReportAction("");
    }
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

      const { value: reason, isConfirmed } = await Swal.fire({
        title: "Reject event",
        text: "The organizer will receive this reason by email.",
        input: "textarea",
        inputPlaceholder: "Reason for rejection",
        inputAttributes: {
          "aria-label": "Reason for rejection"
        },
        inputValidator: (value) => {
          if (!value?.trim()) {
            return "A rejection reason is required.";
          }
        },
        showCancelButton: true,
        confirmButtonText: "Reject event",
        confirmButtonColor: "#dc3545"
      });

      if (!isConfirmed) {
        return;
      }

      try {

        await rejectEvent(
          eventId,
          { reason: reason.trim() }
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

  const eventsToDisplay = selectedType === "ALL_EVENTS"
    ? reportData?.events || []
    : pendingEvents;

  return (

    <>
      <Navbar />

      <div className="container py-5">

        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <h2 className="mb-0">Admin Dashboard</h2>
          <button
            type="button"
            className="btn btn-outline-success d-inline-flex align-items-center gap-2"
            onClick={exportAllReports}
            disabled={Boolean(reportAction)}
          >
            <FaDownload aria-hidden="true" />
            {reportAction === "exporting" ? "Preparing CSV..." : "Export all reports (CSV)"}
          </button>
        </div>

        {analytics && (

          <div className="row admin-dashboard-stat-grid">

            <div className="col-md-4 mb-3">

              <button
                type="button"
                className="card shadow-sm border-0 p-3 text-start w-100"
                onClick={() => showReport("USERS")}
                disabled={Boolean(reportAction)}
                aria-label={`View all ${analytics.totalUsers} users`}
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

              </button>

            </div>

            <div className="col-md-4 mb-3">

              <button
                type="button"
                className="card shadow-sm border-0 p-3 text-start w-100"
                onClick={() => showReport("ALL_EVENTS")}
                disabled={Boolean(reportAction)}
                aria-label={`View all ${analytics.totalEvents} events`}
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

              </button>

            </div>

            <div className="col-md-4 mb-3">

              <button
                type="button"
                className="card shadow-sm border-0 p-3 text-start w-100"
                onClick={() => showReport("REGISTRATIONS")}
                disabled={Boolean(reportAction)}
                aria-label={`View all ${analytics.totalRegistrations} registrations`}
              >

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <h6>
                      Volunteer Registrations
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

              </button>

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

  <div className="row mb-4 admin-dashboard-insight-grid">

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
        {selectedType === "USERS" && reportData && (
          <div className="card shadow-sm border-0 p-4">
            <h4 className="mb-3">Users</h4>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>City</th>
                    <th>Role</th>
                    <th>Active</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.users.length === 0 ? (
                    <tr><td colSpan={7} className="text-center text-muted">No users found.</td></tr>
                  ) : reportData.users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.mobile || "-"}</td>
                      <td>{user.city || "-"}</td>
                      <td>{user.role}</td>
                      <td>{user.active ? "Yes" : "No"}</td>
                      <td>{user.createdAt?.slice(0, 10) || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedType === "REGISTRATIONS" && reportData && (
          <div className="card shadow-sm border-0 p-4">
            <h4 className="mb-3">Volunteer Registrations</h4>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Volunteer</th>
                    <th>Email</th>
                    <th>Event</th>
                    <th>City</th>
                    <th>Event date</th>
                    <th>Registration date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.registrations.length === 0 ? (
                    <tr><td colSpan={7} className="text-center text-muted">No registrations found.</td></tr>
                  ) : reportData.registrations.map((registration) => (
                    <tr key={registration.registrationId}>
                      <td>{registration.volunteerName}</td>
                      <td>{registration.volunteerEmail}</td>
                      <td>{registration.eventTitle}</td>
                      <td>{registration.city}</td>
                      <td>{registration.eventDate}</td>
                      <td>{registration.registrationDate?.slice(0, 10) || "-"}</td>
                      <td>{registration.registrationStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedType !== "USERS" && selectedType !== "REGISTRATIONS" && (
        <div className="card shadow-sm border-0 p-4">

          <h4 className="mb-3">

            {selectedType === "ALL_EVENTS" ? "All Events" : `${selectedType} Events`}

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

                eventsToDisplay.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-muted">No events found.</td></tr>
                ) : eventsToDisplay.map((event) => (

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
        )}

      </div>

    </>

  );

};

export default AdminDashboard;