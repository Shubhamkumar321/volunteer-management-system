package com.volunteer.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminUserReportResponse {

    private Long id;
    private String name;
    private String email;
    private String mobile;
    private String city;
    private String role;
    private Boolean active;
    private LocalDateTime createdAt;
}