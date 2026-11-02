package com.volunteer.entity;

import com.volunteer.enums.RegistrationStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
        name = "event_registrations",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "event_id",
                                "user_id"
                        }
                )
        }
)
@Getter
@Setter
public class EventRegistration extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private RegistrationStatus status;
}