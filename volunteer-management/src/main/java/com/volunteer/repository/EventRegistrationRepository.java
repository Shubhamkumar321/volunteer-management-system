package com.volunteer.repository;

import com.volunteer.entity.Event;
import com.volunteer.entity.EventRegistration;
import com.volunteer.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface EventRegistrationRepository
        extends JpaRepository<EventRegistration, Long> {

    Optional<EventRegistration>
    findByUserAndEvent(
            User user,
            Event event
    );

    List<EventRegistration>
    findByUser(User user);

    long countByEvent(Event event);

    @Query("""
       SELECT er.event.title,
              COUNT(er.id)
       FROM EventRegistration er
       GROUP BY er.event.title
       ORDER BY COUNT(er.id) DESC
       """)
    List<Object[]> getMostPopularEvents();

}

