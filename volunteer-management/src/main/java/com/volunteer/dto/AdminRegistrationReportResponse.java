package com.volunteer.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class AdminRegistrationReportResponse {

    private Long registrationId;
    private String volunteerName;
    private String volunteerEmail;
    private String city;
    private String eventTitle;
    private LocalDate eventDate;
    private LocalDateTime registrationDate;
    private String registrationStatus;
}