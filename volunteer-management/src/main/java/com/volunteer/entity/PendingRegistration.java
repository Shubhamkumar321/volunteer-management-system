package com.volunteer.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "pending_registrations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PendingRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private String password;

    private String mobile;

    private String city;

    private String otp;

    private LocalDateTime expiresAt;

    private LocalDateTime lastOtpSentAt;

    private Integer otpRequestCount;
}