package com.volunteer.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
public class EventResponse {

    private Long id;

    private String title;

    private String description;

    private String city;

    private String address;

    private LocalDate eventDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private Integer maxVolunteers;

    private String category;

    private String organizer;

    private String status;

    private String approvedBy;

    private LocalDateTime approvedAt;

    private String imageUrl;

}