import api from "./api";

export const getDashboardAnalytics =
() => {

  return api.get(
    "/api/admin/dashboard"
  );

};

export const getAdminReports = () => {
  return api.get("/api/admin/reports");
};

export const getPendingEvents =
() => {

  return api.get(
    "/api/admin/events/pending"
  );

};

export const approveEvent =
(eventId) => {

  return api.put(
    `/api/admin/events/${eventId}/approve`
  );

};

export const rejectEvent =
(eventId, request) => {

  return api.put(
    `/api/admin/events/${eventId}/reject`,
    request
  );

};

export const getApprovedEvents =
() => {

  return api.get(
    "/api/admin/events/approved"
  );

};

export const getRejectedEvents =
() => {

  return api.get(
    "/api/admin/events/rejected"
  );

};