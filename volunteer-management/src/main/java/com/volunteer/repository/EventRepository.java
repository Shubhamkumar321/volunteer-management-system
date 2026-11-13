package com.volunteer.repository;

import com.volunteer.entity.Event;
import com.volunteer.enums.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.List;

public interface EventRepository
        extends JpaRepository<Event, Long> {

    List<Event> findByStatus(
            EventStatus status
    );

    List<Event> findByCreatedById(
            Long userId
    );

    List<Event> findByCityContainingIgnoreCaseAndStatus(
            String city,
            EventStatus status
    );

    long countByStatus(
            EventStatus status
    );

    @Query("""
            SELECT e.category.name,
                   COUNT(e.id)
            FROM Event e
            GROUP BY e.category.name
            ORDER BY COUNT(e.id) DESC
            """)
    List<Object[]> getMostPopularCategories();

    @Query("""
            SELECT e.city,
                   COUNT(e.id)
            FROM Event e
            GROUP BY e.city
            ORDER BY COUNT(e.id) DESC
            """)
    List<Object[]> getMostActiveCities();

    List<Event> findByCityIgnoreCaseAndStatus(String city, EventStatus eventStatus);

    @Query("""
            SELECT e FROM Event e
            WHERE e.status = :status
              AND (e.eventDate > :today
                   OR (e.eventDate = :today AND e.endTime > :now))
            ORDER BY e.eventDate, e.startTime
            """)
    List<Event> findUpcomingByStatus(
            @Param("status") EventStatus status,
            @Param("today") LocalDate today,
            @Param("now") LocalTime now
    );

    @Query("""
            SELECT e FROM Event e
            WHERE LOWER(e.city) = LOWER(:city)
              AND e.status = :status
              AND (e.eventDate > :today
                   OR (e.eventDate = :today AND e.endTime > :now))
            ORDER BY e.eventDate, e.startTime
            """)
    List<Event> findUpcomingByCityAndStatus(
            @Param("city") String city,
            @Param("status") EventStatus status,
            @Param("today") LocalDate today,
            @Param("now") LocalTime now
    );


}