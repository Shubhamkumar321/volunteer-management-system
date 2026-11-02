package com.volunteer.service.impl;

import com.volunteer.dto.EventRequest;
import com.volunteer.dto.EventResponse;
import com.volunteer.dto.RegistrationResponse;
import com.volunteer.entity.Category;
import com.volunteer.entity.Event;
import com.volunteer.entity.EventRegistration;
import com.volunteer.entity.User;
import com.volunteer.enums.EventStatus;
import com.volunteer.enums.RegistrationStatus;
import com.volunteer.exception.BadRequestException;
import com.volunteer.repository.CategoryRepository;
import com.volunteer.repository.EventRegistrationRepository;
import com.volunteer.repository.EventRepository;
import com.volunteer.repository.UserRepository;
import com.volunteer.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventServiceImpl  implements EventService {

    private final EventRepository eventRepository;

    private final UserRepository userRepository;

    private final CategoryRepository categoryRepository;

    private final EventRegistrationRepository registrationRepository;

    @Override
    public EventResponse createEvent(
            EventRequest request,
            String email
    ) {

        if(request.getEventDate()
                .isBefore(LocalDate.now())) {

            throw new BadRequestException(
                    "Past Date Not Allowed"
            );
        }

        if(!request.getEndTime()
                .isAfter(request.getStartTime())) {

            throw new BadRequestException(
                    "End Time Must Be Greater Than Start Time"
            );
        }

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new BadRequestException(
                                        "User Not Found"
                                ));

        Category category =
                categoryRepository.findById(
                                request.getCategoryId()
                        )
                        .orElseThrow(() ->
                                new BadRequestException(
                                        "Category Not Found"
                                ));

        Event event = new Event();



        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setCity(request.getCity());
        event.setAddress(request.getAddress());
        event.setEventDate(request.getEventDate());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setMaxVolunteers(
                request.getMaxVolunteers()
        );

        event.setStatus(
                EventStatus.PENDING
        );

        event.setCreatedBy(user);

        event.setCategory(category);

        event.setImageUrl(
                request.getImageUrl()
        );

        Event saved =
                eventRepository.save(event);

        return EventResponse.builder()
                .id(saved.getId())
                .title(saved.getTitle())
                .city(saved.getCity())
                .category(
                        saved.getCategory()
                                .getName()
                )
                .status(
                        saved.getStatus()
                                .name()
                )
                .organizer(
                        saved.getCreatedBy()
                                .getName()
                )
                .build();
    }



    private EventResponse mapToResponse(
            Event event
    ) {

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
                .category(event.getCategory().getName())
                .organizer(event.getCreatedBy().getName())
                .status(event.getStatus().name())
                .approvedBy(
                        event.getApprovedBy()
                )
                .approvedAt(
                        event.getApprovedAt()
                )

                .imageUrl(
                        event.getImageUrl()
                )

                .build();
    }

    @Override
    public List<EventResponse> getMyEvents(
            String email
    ) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new BadRequestException(
                                        "User Not Found"
                                ));

        return eventRepository
                .findByCreatedById(
                        user.getId()
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public EventResponse
    approveEvent(
            Long eventId
    ) {

        Event event =

                eventRepository

                        .findById(
                                eventId
                        )

                        .orElseThrow(

                                () ->
                                        new RuntimeException(
                                                "Event Not Found"
                                        )
                        );

        event.setStatus(
                EventStatus.APPROVED
        );

        Event savedEvent =
                eventRepository.save(
                        event
                );

        return mapToResponse(
                savedEvent
        );
    }

    @Override
    public EventResponse rejectEvent(
            Long eventId
    ) {

        Event event =
                eventRepository.findById(eventId)
                        .orElseThrow(() ->
                                new BadRequestException(
                                        "Event Not Found"
                                ));

        event.setStatus(
                EventStatus.REJECTED
        );

        Event updated =
                eventRepository.save(event);

        return mapToResponse(updated);
    }

    @Override
    public List<EventResponse> getPendingEvents() {

        return eventRepository
                .findByStatus(
                        EventStatus.PENDING
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }





    @Override
    public List<EventResponse> searchApprovedEvents(
            String city
    ) {

        return eventRepository
                .findByCityIgnoreCaseAndStatus(
                        city,
                        EventStatus.APPROVED
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private RegistrationResponse mapRegistration(
            EventRegistration registration
    ) {

        return RegistrationResponse.builder()
                .registrationId(
                        registration.getId()
                )
                .eventTitle(
                        registration.getEvent()
                                .getTitle()
                )
                .city(
                        registration.getEvent()
                                .getCity()
                )
                .registrationStatus(
                        registration.getStatus()
                                .name()
                )
                .volunteerName(
                        registration.getUser()
                                .getName()
                )
                .build();
    }

    @Override
    public RegistrationResponse registerForEvent(
            Long eventId,
            String email
    ) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new BadRequestException(
                                        "User Not Found"
                                ));



        Event event =
                eventRepository.findById(eventId)
                        .orElseThrow(() ->
                                new BadRequestException(
                                        "Event Not Found"
                                ));

        // Organizer cannot join own event
        if(user.getId().equals(
                event.getCreatedBy().getId()
        )) {

            throw new BadRequestException(
                    "Organizer cannot register for own event"
            );
        }

        if(event.getStatus()
                != EventStatus.APPROVED) {

            throw new BadRequestException(
                    "Only approved events can be joined"
            );
        }

        if(event.getStatus()
                != EventStatus.APPROVED) {

            throw new BadRequestException(
                    "Only approved events can be joined"
            );
        }

        if(registrationRepository
                .findByUserAndEvent(
                        user,
                        event
                )
                .isPresent()) {

            throw new BadRequestException(
                    "Already registered"
            );
        }

        long currentRegistrations =
                registrationRepository
                        .countByEvent(event);

        if(currentRegistrations >=
                event.getMaxVolunteers()) {

            throw new BadRequestException(
                    "Event Capacity Full"
            );
        }

        EventRegistration registration =
                new EventRegistration();

        registration.setUser(user);

        registration.setEvent(event);

        registration.setStatus(
                RegistrationStatus.REGISTERED
        );

        EventRegistration saved =
                registrationRepository.save(
                        registration
                );

        return mapRegistration(saved);
    }

    @Override
    public List<RegistrationResponse>
    getMyRegistrations(
            String email
    ) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new BadRequestException(
                                        "User Not Found"
                                ));

        return registrationRepository
                .findByUser(user)
                .stream()
                .map(this::mapRegistration)
                .toList();
    }
    @Override
    public String cancelRegistration(
            Long registrationId,
            String email
    ) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new BadRequestException(
                                        "User Not Found"
                                ));

        EventRegistration registration =
                registrationRepository
                        .findById(
                                registrationId
                        )
                        .orElseThrow(() ->
                                new BadRequestException(
                                        "Registration Not Found"
                                ));

        if(!registration.getUser()
                .getId()
                .equals(user.getId())) {

            throw new BadRequestException(
                    "Not Your Registration"
            );
        }

        registration.setStatus(
                RegistrationStatus.CANCELLED
        );

        registrationRepository.save(
                registration
        );

        return "Registration Cancelled Successfully";
    }
    @Override
    public List<EventResponse>
    getApprovedEvents() {

        return eventRepository

                .findByStatus(
                        EventStatus.APPROVED
                )

                .stream()

                .map(
                        this::mapToResponse
                )

                .toList();
    }

    @Override
    public EventResponse
    getEventById(
            Long eventId
    ) {

        Event event =

                eventRepository

                        .findById(
                                eventId
                        )

                        .orElseThrow(

                                () ->
                                        new RuntimeException(
                                                "Event Not Found"
                                        )
                        );

        return mapToResponse(
                event
        );
    }

    @Override
    public List<EventResponse>
    getApprovedEventsForAdmin() {

        return eventRepository

                .findByStatus(
                        EventStatus.APPROVED
                )

                .stream()

                .map(this::mapToResponse)

                .toList();
    }

    @Override
    public List<EventResponse>
    getRejectedEvents() {

        return eventRepository

                .findByStatus(
                        EventStatus.REJECTED
                )

                .stream()

                .map(this::mapToResponse)

                .toList();
    }
}