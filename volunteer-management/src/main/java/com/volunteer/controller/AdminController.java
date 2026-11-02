package com.volunteer.controller;

import com.volunteer.dto.DashboardStatisticsResponse;
import com.volunteer.dto.EventResponse;
import com.volunteer.service.AdminService;
import com.volunteer.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final EventService eventService;

    @GetMapping("/dashboard")
    public DashboardStatisticsResponse dashboard() {

        return adminService.getDashboard();
    }

    @GetMapping("/events/pending")
    public ResponseEntity<
            List<EventResponse>
            >

    getPendingEvents() {

        return ResponseEntity.ok(

                eventService
                        .getPendingEvents()

        );
    }

    @PutMapping("/events/{id}/approve")
    public ResponseEntity<EventResponse>
    approveEvent(@PathVariable Long id)
    {
        return ResponseEntity.ok(
                eventService.approveEvent(id)

        );
    }

    @PutMapping("/events/{id}/reject")
    public ResponseEntity<EventResponse>
    rejectEvent(@PathVariable Long id
    ) {

        return ResponseEntity.ok(
                eventService.rejectEvent(id)

        );
    }

    @GetMapping("/events/approved")
    public ResponseEntity<
            List<EventResponse>
            >

    getApprovedEvents() {

        return ResponseEntity.ok(

                eventService
                        .getApprovedEventsForAdmin()

        );
    }

    @GetMapping("/events/rejected")
    public ResponseEntity<
            List<EventResponse>
            >

    getRejectedEvents() {

        return ResponseEntity.ok(

                eventService
                        .getRejectedEvents()

        );
    }
}