package com.volunteer.service.impl;

import com.volunteer.dto.*;
import com.volunteer.entity.EmailOtp;
import com.volunteer.entity.PendingRegistration;
import com.volunteer.entity.User;
import com.volunteer.enums.Role;
import com.volunteer.exception.BadRequestException;
import com.volunteer.repository.EmailOtpRepository;
import com.volunteer.repository.PendingRegistrationRepository;
import com.volunteer.repository.UserRepository;
import com.volunteer.security.JwtService;
import com.volunteer.service.AuthService;
import com.volunteer.service.EmailService;
import com.volunteer.util.OtpUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final EmailOtpRepository otpRepository;

    private final EmailService emailService;

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final PendingRegistrationRepository pendingRegistrationRepository;


    @Override
    public AuthResponse register(
            RegisterRequest request
    ) {

        if (
                userRepository.existsByEmail(
                        request.getEmail()
                )
        ) {

            throw new BadRequestException(
                    "Email already exists"
            );

        }

        String otp =
                OtpUtil.generateOtp();

        PendingRegistration pending =

                PendingRegistration.builder()

                        .name(
                                request.getName()
                        )

                        .email(
                                request.getEmail()
                        )

                        .password(

                                passwordEncoder.encode(
                                        request.getPassword()
                                )

                        )

                        .mobile(
                                request.getMobile()
                        )

                        .city(
                                request.getCity()
                        )

                        .otp(
                                otp
                        )

                        .expiresAt(

                                LocalDateTime.now()
                                        .plusMinutes(5)

                        )

                        .lastOtpSentAt(
                                LocalDateTime.now()
                        )

                        .otpRequestCount(1)

                        .build();

        pendingRegistrationRepository
                .save(pending);

        emailService.sendEmail(

                request.getEmail(),

                "VolunteerConnect Registration OTP",

                "Your OTP is: "
                        + otp
                        + "\nValid for 5 minutes."

        );

        return AuthResponse.builder()

                .message(
                        "OTP sent successfully"
                )

                .build();

    }

    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new BadRequestException(
                                "Invalid Email or Password"
                        ));

        boolean matched =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!matched) {
            throw new BadRequestException(
                    "Invalid Email or Password"
            );
        }

        String token =
                jwtService.generateToken(
                        user.getEmail()
                );

        return AuthResponse.builder()
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .token(token)
                .message("Login Successful")
                .build();
    }

    @Override
    public void forgotPassword(
            String email
    ) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new BadRequestException(
                                        "Email Not Registered"
                                ));

        String otp =
                OtpUtil.generateOtp();

        EmailOtp emailOtp =
                EmailOtp.builder()
                        .email(email)
                        .otp(otp)
                        .expiresAt(
                                LocalDateTime.now()
                                        .plusMinutes(5)
                        )
                        .verified(false)
                        .build();

        otpRepository.save(emailOtp);

        emailService.sendEmail(

                email,

                "VolunteerConnect Password Reset OTP",

                "Your OTP is: "
                        + otp
                        + "\nValid for 5 minutes."
        );
    }

    @Override
    public String verifyOtpAndResetPassword(
            VerifyOtpRequest request
    ) {

        EmailOtp savedOtp =
                otpRepository
                        .findTopByEmailOrderByIdDesc(
                                request.getEmail()
                        )
                        .orElseThrow(() ->
                                new BadRequestException(
                                        "OTP Not Found"
                                ));

        if(LocalDateTime.now()
                .isAfter(
                        savedOtp.getExpiresAt()
                )) {

            throw new BadRequestException(
                    "OTP Expired"
            );
        }

        if(!savedOtp.getOtp()
                .equals(
                        request.getOtp()
                )) {

            throw new BadRequestException(
                    "Invalid OTP"
            );
        }

        User user =
                userRepository.findByEmail(
                        request.getEmail()
                ).orElseThrow(() ->
                        new BadRequestException(
                                "User Not Found"
                        ));

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);

        savedOtp.setVerified(true);

        otpRepository.save(savedOtp);

        return "Password Reset Successful";
    }


    public AuthResponse
    verifyRegistrationOtp(

            VerifyRegistrationOtpRequest request

    ) {

        PendingRegistration pending =

                pendingRegistrationRepository

                        .findByEmail(
                                request.getEmail()
                        )

                        .orElseThrow(

                                () ->
                                        new BadRequestException(
                                                "Registration Not Found"
                                        )

                        );

        if (

                LocalDateTime.now()

                        .isAfter(
                                pending.getExpiresAt()
                        )

        ) {

            throw new BadRequestException(
                    "OTP Expired"
            );

        }

        if (

                !pending.getOtp()

                        .equals(
                                request.getOtp()
                        )

        ) {

            throw new BadRequestException(
                    "Invalid OTP"
            );

        }

        User user = new User();

        user.setName(
                pending.getName()
        );

        user.setEmail(
                pending.getEmail()
        );

        user.setPassword(
                pending.getPassword()
        );

        user.setMobile(
                pending.getMobile()
        );

        user.setCity(
                pending.getCity()
        );

        user.setRole(
                Role.USER
        );

        userRepository.save(user);

        pendingRegistrationRepository
                .delete(pending);

        String token =

                jwtService.generateToken(
                        user.getEmail()
                );

        return AuthResponse.builder()

                .userId(
                        user.getId()
                )

                .name(
                        user.getName()
                )

                .email(
                        user.getEmail()
                )

                .role(
                        user.getRole().name()
                )

                .token(
                        token
                )

                .message(
                        "Registration Successful"
                )

                .build();
    }

}