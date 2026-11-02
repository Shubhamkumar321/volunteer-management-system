package com.volunteer.controller;

import com.volunteer.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class EmailTestController {

private final EmailService emailService;

@GetMapping("/email")
public String testEmail()
        {

    emailService.sendEmail(
            "ankitakumari2420@gmail.com",
            "VolunteerConnect Test",
            "Email service Working Successfully"
                    );

    return "Email Sent";  }
}