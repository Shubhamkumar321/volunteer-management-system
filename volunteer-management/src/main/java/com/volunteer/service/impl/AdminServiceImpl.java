package com.volunteer.service.impl;

import com.volunteer.dto.DashboardStatisticsResponse;
import com.volunteer.dto.AdminRegistrationReportResponse;
import com.volunteer.dto.AdminReportsResponse;
import com.volunteer.dto.AdminUserReportResponse;
import com.volunteer.dto.EventResponse;
import com.volunteer.entity.Event;
import com.volunteer.entity.EventRegistration;
import com.volunteer.entity.User;
import com.volunteer.enums.EventStatus;
import com.volunteer.repository.EventRegistrationRepository;
import com.volunteer.repository.EventRepository;
import com.volunteer.repository.UserRepository;
import com.volunteer.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;

    private final EventRepository eventRepository;

    private final EventRegistrationRepository registrationRepository;

    @Override
    public DashboardStatisticsResponse getDashboard() {

        String popularEvent = "N/A";
        String popularCategory = "N/A";
        String activeCity = "N/A";

        List<Object[]> eventData =
                registrationRepository.getMostPopularEvents();

        if (!eventData.isEmpty()) {
            popularEvent =
                    eventData.get(0)[0].toString();
        }

        List<Object[]> categoryData =
                eventRepository.getMostPopularCategories();

        if (!categoryData.isEmpty()) {
            popularCategory =
                    categoryData.get(0)[0].toString();
        }

        List<Object[]> cityData =
                eventRepository.getMostActiveCities();

        if (!cityData.isEmpty()) {
            activeCity =
                    cityData.get(0)[0].toString();
        }

        return DashboardStatisticsResponse.builder()

                .totalUsers(
                        userRepository.count()
                )

                .totalEvents(
                        eventRepository.count()
                )

                .approvedEvents(
                        eventRepository.countByStatus(
                                EventStatus.APPROVED
                        )
                )

                .pendingEvents(
                        eventRepository.countByStatus(
                                EventStatus.PENDING
                        )
                )

                .rejectedEvents(
                        eventRepository.countByStatus(
                                EventStatus.REJECTED
                        )
                )

                .totalRegistrations(
                        registrationRepository.count()
                )

                .mostPopularEvent(
                        popularEvent
                )

                .mostPopularCategory(
                        popularCategory
                )

                .mostActiveCity(
                        activeCity
                )

                .build();
    }

    @Override
    public AdminReportsResponse getReports() {
        List<AdminUserReportResponse> users = userRepository.findAll()
                .stream()
                .map(this::mapUserReport)
                .toList();

        List<EventResponse> events = eventRepository.findAll()
                .stream()
                .map(this::mapEventReport)
                .toList();

        List<AdminRegistrationReportResponse> registrations =
                registrationRepository.findAll()
                        .stream()
                        .map(this::mapRegistrationReport)
                        .toList();

        return AdminReportsResponse.builder()
                .users(users)
                .events(events)
                .registrations(registrations)
                .build();
    }

    private AdminUserReportResponse mapUserReport(User user) {
        return AdminUserReportResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .city(user.getCity())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .active(user.getActive())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private EventResponse mapEventReport(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .city(event.getCity())
                .address(event.getAddress())
                .eventDate(event.getEventDate())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .maxVolunteers(event.getMaxVolunteers())
                .category(event.getCategory() != null
                        ? event.getCategory().getName()
                        : null)
                .organizer(event.getCreatedBy() != null
                        ? event.getCreatedBy().getName()
                        : null)
                .status(event.getStatus() != null
                        ? event.getStatus().name()
                        : null)
                .approvedBy(event.getApprovedBy())
                .approvedAt(event.getApprovedAt())
                .imageUrl(event.getImageUrl())
                .rejectionReason(event.getRejectionReason())
                .build();
    }

    private AdminRegistrationReportResponse mapRegistrationReport(
            EventRegistration registration
    ) {
        User volunteer = registration.getUser();
        Event event = registration.getEvent();

        return AdminRegistrationReportResponse.builder()
                .registrationId(registration.getId())
                .volunteerName(volunteer.getName())
                .volunteerEmail(volunteer.getEmail())
                .city(event.getCity())
                .eventTitle(event.getTitle())
                .eventDate(event.getEventDate())
                .registrationDate(registration.getCreatedAt())
                .registrationStatus(registration.getStatus().name())
                .build();
    }
}