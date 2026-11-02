package com.volunteer.service.impl;

import com.volunteer.dto.DashboardStatisticsResponse;
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
}