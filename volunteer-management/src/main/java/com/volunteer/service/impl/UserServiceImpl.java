package com.volunteer.service.impl;

import com.volunteer.dto.*;
import com.volunteer.entity.User;
import com.volunteer.exception.BadRequestException;
import com.volunteer.repository.UserRepository;
import com.volunteer.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl
        implements UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public UserProfileResponse getProfile(
            String email
    ) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new BadRequestException(
                                        "User Not Found"
                                ));

        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .city(user.getCity())
                .role(user.getRole().name())
                .build();
    }

    @Override
    public UserProfileResponse updateProfile(
            String email,
            UpdateProfileRequest request
    ) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new BadRequestException(
                                        "User Not Found"
                                ));

        user.setName(request.getName());
        user.setMobile(request.getMobile());
        user.setCity(request.getCity());

        userRepository.save(user);

        return getProfile(email);
    }

    @Override
    public String changePassword(
            String email,
            ChangePasswordRequest request
    ) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new BadRequestException(
                                        "User Not Found"
                                ));

        if(!passwordEncoder.matches(
                request.getOldPassword(),
                user.getPassword()
        )) {

            throw new BadRequestException(
                    "Old Password Incorrect"
            );
        }

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);

        return "Password Changed Successfully";
    }
}