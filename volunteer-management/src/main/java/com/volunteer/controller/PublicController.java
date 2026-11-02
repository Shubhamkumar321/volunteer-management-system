package com.volunteer.controller;

import com.volunteer.dto.EventResponse;
import com.volunteer.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final EventService eventService;

    @GetMapping("/events/search")
    public List<EventResponse> search(
            @RequestParam String city
    ) {

        return eventService.searchApprovedEvents(
                city
        );
    }

    @GetMapping("/events")
    public ResponseEntity<List<EventResponse>> getApprovedEvents() {

        return ResponseEntity.ok(
                eventService.getApprovedEvents()

        );
    }

    @GetMapping("/events/{id}")
    public ResponseEntity<EventResponse>
    getEventById(@PathVariable Long id)
    {
        return ResponseEntity.ok(eventService.getEventById(id)
        );
    }
}