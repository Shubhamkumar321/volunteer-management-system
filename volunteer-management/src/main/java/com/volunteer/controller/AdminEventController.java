package com.volunteer.controller;

import com.volunteer.dto.EventResponse;
import com.volunteer.service.EventService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Admin Event Management",
description = "Approve, Reject and Manage Events"
)
@RestController
@RequestMapping("/api/admin/events")
@RequiredArgsConstructor
public class AdminEventController {

//    private final EventService eventService;
//
//    @GetMapping("/pending")
//    public List<EventResponse> pendingEvents() {
//
//        return eventService.getPendingEvents();
//    }
//
//    @PutMapping("/{id}/approve")
//    public EventResponse approve(
//            @PathVariable Long id
//    ) {
//
//        return eventService.approveEvent(id);
//    }
//
//    @PutMapping("/{id}/reject")
//    public EventResponse reject(
//            @PathVariable Long id
//    ) {
//
//        return eventService.rejectEvent(id);
//    }
}