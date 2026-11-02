package com.volunteer.repository;

import com.volunteer.entity.Event;
import com.volunteer.enums.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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


}