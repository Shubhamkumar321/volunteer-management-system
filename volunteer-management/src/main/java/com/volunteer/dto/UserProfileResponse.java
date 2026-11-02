package com.volunteer.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileResponse {

    private Long id;

    private String name;

    private String email;

    private String mobile;

    private String city;

    private String role;
}