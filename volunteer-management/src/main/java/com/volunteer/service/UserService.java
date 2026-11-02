package com.volunteer.service;

import com.volunteer.dto.*;

public interface UserService {

    UserProfileResponse getProfile(
            String email
    );

    UserProfileResponse updateProfile(
            String email,
            UpdateProfileRequest request
    );

    String changePassword(
            String email,
            ChangePasswordRequest request
    );
}