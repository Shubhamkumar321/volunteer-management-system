package com.volunteer.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatisticsResponse {

    private Long totalUsers;

    private Long totalEvents;

    private Long approvedEvents;

    private Long pendingEvents;

    private Long rejectedEvents;

    private Long totalRegistrations;

    private String mostPopularEvent;

    private String mostPopularCategory;

    private String mostActiveCity;
}