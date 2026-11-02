import api from "./api";

export const createEvent = (eventData) => {

  return api.post(
    "/api/user/events",
    eventData
  );

};

export const getMyEvents = () => {

  return api.get(
    "/api/user/events/my-events"
  );

};

export const searchEvents = (city) => {

  return api.get(
    `/api/public/events/search?city=${city}`
  );

};

export const registerForEvent = (
  eventId
) => {

  return api.post(
    `/api/user/events/${eventId}/register`
  );

};

export const getMyRegistrations =
() => {

  return api.get(
    "/api/user/registrations"
  );

};