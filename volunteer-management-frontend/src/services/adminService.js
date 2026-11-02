import api from "./api";

export const getDashboardAnalytics =
() => {

  return api.get(
    "/api/admin/dashboard"
  );

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
(eventId) => {

  return api.put(
    `/api/admin/events/${eventId}/reject`
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