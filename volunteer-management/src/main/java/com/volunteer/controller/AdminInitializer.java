package com.volunteer.controller;

import com.volunteer.entity.User;
import com.volunteer.enums.Role;
import com.volunteer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        if (!userRepository.existsByEmail("admin@gmail.com")) {

            User admin = new User();

            admin.setName("Admin");
            admin.setEmail("admin@gmail.com");
            admin.setPassword(
                    passwordEncoder.encode("Admin@123")
            );
            admin.setMobile("9999999999");
            admin.setCity("Pune");
            admin.setRole(Role.ADMIN);
            admin.setActive(true);

            userRepository.save(admin);

            System.out.println("Admin Created");
        }
    }
}
