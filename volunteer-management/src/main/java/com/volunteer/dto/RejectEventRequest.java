package com.volunteer.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RejectEventRequest {

    @NotBlank(message = "A rejection reason is required")
    private String reason;
}