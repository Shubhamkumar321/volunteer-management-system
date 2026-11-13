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
import com.volunteer.enums.Role;
import com.volunteer.exception.BadRequestException;
import com.volunteer.repository.CategoryRepository;
import com.volunteer.repository.EventRegistrationRepository;
import com.volunteer.repository.EventRepository;
import com.volunteer.repository.UserRepository;
import com.volunteer.service.EmailService;
import com.volunteer.service.EventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.MailException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
@Slf4j
@RequiredArgsConstructor
public class EventServiceImpl  implements EventService {

        private static final DateTimeFormatter EMAIL_DATE_FORMAT =
                        DateTimeFormatter.ofPattern("MMMM d, yyyy", Locale.ENGLISH);

    private final EventRepository eventRepository;

    private final UserRepository userRepository;

    private final CategoryRepository categoryRepository;

    private final EventRegistrationRepository registrationRepository;

        private final EmailService emailService;

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

        if(!LocalDateTime.of(
                        request.getEventDate(),
                        request.getStartTime()
                )
                .isAfter(LocalDateTime.now())) {

            throw new BadRequestException(
                    "Start Time Must Be In The Future"
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

        notifyAdminsOfEventCreation(saved);

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

                .rejectionReason(
                        event.getRejectionReason()
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

        event.setRejectionReason(null);

        Event savedEvent =
                eventRepository.save(
                        event
                );

        sendEmailSafely(
                event.getCreatedBy().getEmail(),
                "Your event has been approved: " + event.getTitle(),
                "Your event has been approved.\n\n"
                        + "Event: " + event.getTitle() + "\n"
                        + "Event date: " + formatDate(event.getEventDate())
        );

        return mapToResponse(
                savedEvent
        );
    }

    @Override
    public EventResponse rejectEvent(
            Long eventId,
            String rejectionReason
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

        event.setRejectionReason(rejectionReason.trim());

        Event updated =
                eventRepository.save(event);

        sendEmailSafely(
                event.getCreatedBy().getEmail(),
                "Your event was rejected: " + event.getTitle(),
                "Your event was not approved.\n\n"
                        + "Event: " + event.getTitle() + "\n"
                        + "Event date: " + formatDate(event.getEventDate()) + "\n"
                        + "Reason: " + event.getRejectionReason()
        );

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
                .findUpcomingByCityAndStatus(
                        city.trim(),
                        EventStatus.APPROVED,
                        LocalDate.now(),
                        LocalTime.now()
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

        if(!LocalDateTime.of(
                        event.getEventDate(),
                        event.getEndTime()
                )
                .isAfter(LocalDateTime.now())) {

            throw new BadRequestException(
                    "This event has already ended"
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

        notifyRegistrationParties(saved);

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

                .findUpcomingByStatus(
                        EventStatus.APPROVED,
                        LocalDate.now(),
                        LocalTime.now()
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

        private void notifyAdminsOfEventCreation(Event event) {
                String subject = "New event pending approval: " + event.getTitle();
                String body = "A new event has been submitted for review.\n\n"
                                + "Event: " + event.getTitle() + "\n"
                                + "Organizer: " + event.getCreatedBy().getName() + "\n"
                                + "Organizer email: " + event.getCreatedBy().getEmail() + "\n"
                                + "Event date: " + formatDate(event.getEventDate()) + "\n"
                                + "City: " + event.getCity();

                userRepository.findAllByRole(Role.ADMIN)
                                .forEach(admin -> sendEmailSafely(
                                                admin.getEmail(),
                                                subject,
                                                body
                                ));
        }

        private void notifyRegistrationParties(EventRegistration registration) {
                Event event = registration.getEvent();
                User volunteer = registration.getUser();
                LocalDateTime registeredAt = registration.getCreatedAt() != null
                                ? registration.getCreatedAt()
                                : LocalDateTime.now();
                String registrationDate = formatDate(registeredAt.toLocalDate());
                String eventDate = formatDate(event.getEventDate());

                sendEmailSafely(
                                volunteer.getEmail(),
                                "Registration confirmed: " + event.getTitle(),
                                "Hello " + volunteer.getName() + ",\n\n"
                                                + "You have successfully registered for this event.\n\n"
                                                + "Event: " + event.getTitle() + "\n"
                                                + "Registration date: " + registrationDate + "\n"
                                                + "Event date: " + eventDate + "\n"
                                                + "City: " + event.getCity()
                );

                sendEmailSafely(
                                event.getCreatedBy().getEmail(),
                                "New volunteer registration: " + event.getTitle(),
                                "A volunteer has registered for your event.\n\n"
                                                + "Volunteer: " + volunteer.getName() + "\n"
                                                + "Volunteer email: " + volunteer.getEmail() + "\n"
                                                + "Event: " + event.getTitle() + "\n"
                                                + "Registration date: " + registrationDate + "\n"
                                                + "Event date: " + eventDate
                );
        }

        private String formatDate(LocalDate date) {
                return date.format(EMAIL_DATE_FORMAT);
        }

        private void sendEmailSafely(String to, String subject, String body) {
                try {
                        emailService.sendEmail(to, subject, body);
                } catch (MailException exception) {
                        log.error("Unable to send event notification email", exception);
                }
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