package com.volunteer.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegistrationResponse {

    private Long registrationId;

    private String eventTitle;

    private String city;

    private String registrationStatus;

    private String volunteerName;
}