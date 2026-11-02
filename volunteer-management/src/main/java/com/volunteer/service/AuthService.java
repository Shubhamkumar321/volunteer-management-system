package com.volunteer.service;

import com.volunteer.dto.*;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);


    void forgotPassword(
            String email
    );

    String verifyOtpAndResetPassword(
            VerifyOtpRequest request
    );

    AuthResponse
    verifyRegistrationOtp(

            VerifyRegistrationOtpRequest request

    );

}

