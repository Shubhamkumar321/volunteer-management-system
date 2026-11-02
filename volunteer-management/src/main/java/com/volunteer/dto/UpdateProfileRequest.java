package com.volunteer.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {

    private String name;

    private String mobile;

    private String city;
}