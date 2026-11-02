package com.volunteer.controller;

import com.volunteer.dto.EventRequest;
import com.volunteer.dto.EventResponse;
import com.volunteer.service.EventService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(
        name = "Event Management",
        description = "Create, Update and Manage Events"
)
@RestController
@RequestMapping("/api/user/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    public EventResponse createEvent(

            @Valid
            @RequestBody
            EventRequest request,

            Authentication authentication
    ) {

        return eventService.createEvent(
                request,
                authentication.getName()
        );
    }

    @GetMapping("/my-events")
    public List<EventResponse> myEvents(
            Authentication authentication
    ) {

        return eventService.getMyEvents(
                authentication.getName()
        );
    }
}