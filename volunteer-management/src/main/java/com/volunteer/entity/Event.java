package com.volunteer.entity;

import com.volunteer.enums.EventStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "events")
@Getter
@Setter
public class Event extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String city;

    private String address;

    private LocalDate eventDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private Integer maxVolunteers;

    private String imageUrl;

    private String approvedBy;

    private LocalDateTime approvedAt;

    @Enumerated(EnumType.STRING)
    private EventStatus status;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}