package com.volunteer.controller;

import com.volunteer.dto.*;
import com.volunteer.service.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(
        name = "Authentication",
        description = "Register and Login APIs"
)
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(
            @Valid @RequestBody RegisterRequest request
    ) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @Valid @RequestBody LoginRequest request
    ) {
        return authService.login(request);
    }

    @PostMapping("/forgot-password")
    public String forgotPassword(

            @RequestBody
            ForgotPasswordRequest request
    ) {

        authService.forgotPassword(
                request.getEmail()
        );

        return "OTP Sent Successfully";
    }

    @PostMapping("/reset-password")
    public String resetPassword(

            @RequestBody
            VerifyOtpRequest request
    ) {

        return authService
                .verifyOtpAndResetPassword(
                        request
                );
    }

    @PostMapping(
            "/verify-registration-otp"
    )
    public ResponseEntity<AuthResponse>
    verifyRegistrationOtp(

            @RequestBody

            VerifyRegistrationOtpRequest request

    ) {

        return ResponseEntity.ok(

                authService
                        .verifyRegistrationOtp(
                                request
                        )

        );
    }

}