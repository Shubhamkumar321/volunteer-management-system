package com.volunteer.controller;

import com.volunteer.dto.*;
import com.volunteer.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public UserProfileResponse profile(
            Authentication authentication
    ) {

        return userService.getProfile(
                authentication.getName()
        );
    }

    @PutMapping("/profile")
    public UserProfileResponse updateProfile(

            Authentication authentication,

            @RequestBody
            UpdateProfileRequest request
    ) {

        return userService.updateProfile(
                authentication.getName(),
                request
        );
    }

    @PutMapping("/change-password")
    public String changePassword(

            Authentication authentication,

            @RequestBody
            ChangePasswordRequest request
    ) {

        return userService.changePassword(
                authentication.getName(),
                request
        );
    }
}