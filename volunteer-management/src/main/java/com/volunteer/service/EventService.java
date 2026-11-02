package com.volunteer.service;

import com.volunteer.dto.EventRequest;
import com.volunteer.dto.EventResponse;
import com.volunteer.dto.RegistrationResponse;

import java.util.List;

public interface EventService {

    EventResponse createEvent(
            EventRequest request,
            String email
    );

    List<EventResponse> getMyEvents(
            String email
    );

    EventResponse approveEvent(
            Long eventId
    );

    EventResponse rejectEvent(
            Long eventId
    );

    List<EventResponse> getPendingEvents();

    List<EventResponse> searchApprovedEvents(
            String city
    );

    RegistrationResponse registerForEvent(
            Long eventId,
            String email
    );

    List<RegistrationResponse> getMyRegistrations(
            String email
    );

    String cancelRegistration(
            Long registrationId,
            String email
    );

    List<EventResponse>
    getApprovedEvents();

    EventResponse
    getEventById(
            Long eventId
    );

    List<EventResponse>
    getApprovedEventsForAdmin();

    List<EventResponse>
    getRejectedEvents();
}