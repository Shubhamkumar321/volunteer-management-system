package com.volunteer.dto;

import lombok.Data;

@Data
public class VerifyRegistrationOtpRequest {

    private String email;

    private String otp;
}