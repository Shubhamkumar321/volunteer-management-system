package com.volunteer.controller;

import com.volunteer.dto.RegistrationResponse;
import com.volunteer.service.EventService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(
        name = "Volunteer Registration",
        description = "Join and Manage Event Registrations"
)
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class RegistrationController {

    private final EventService eventService;

    @PostMapping("/events/{eventId}/register")
    public RegistrationResponse register(

            @PathVariable Long eventId,

            Authentication authentication
    ) {

        return eventService.registerForEvent(
                eventId,
                authentication.getName()
        );
    }

    @GetMapping("/registrations")
    public List<RegistrationResponse>
    myRegistrations(
            Authentication authentication
    ) {

        return eventService.getMyRegistrations(
                authentication.getName()
        );
    }

    @DeleteMapping(
            "/registrations/{id}"
    )
    public String cancelRegistration(

            @PathVariable Long id,

            Authentication authentication
    ) {

        return eventService.cancelRegistration(
                id,
                authentication.getName()
        );
    }
}