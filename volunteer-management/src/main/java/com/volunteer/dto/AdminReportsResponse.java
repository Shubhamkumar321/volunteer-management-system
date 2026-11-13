package com.volunteer.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AdminReportsResponse {

    private List<AdminUserReportResponse> users;
    private List<EventResponse> events;
    private List<AdminRegistrationReportResponse> registrations;
}