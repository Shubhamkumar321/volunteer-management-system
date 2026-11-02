package com.volunteer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class EventRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotBlank
    private String city;

    @NotBlank
    private String address;

    @NotNull
    private LocalDate eventDate;

    @NotNull
    private LocalTime startTime;

    @NotNull
    private LocalTime endTime;

    @NotNull
    private Integer maxVolunteers;

    @NotNull
    private Long categoryId;

    private String imageUrl;


}