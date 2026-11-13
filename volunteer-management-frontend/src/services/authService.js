import api from "./api";

export const registerUser = (

  userData

) => {

  return api.post(

    "/api/auth/register",

    userData

  );

};

export const loginUser = (

  loginData

) => {

  return api.post(

    "/api/auth/login",

    loginData

  );

};

export const verifyRegistrationOtp = (verificationData) => {
  return api.post(
    "/api/auth/verify-registration-otp",
    verificationData
  );
};

export const requestPasswordResetOtp = (email) => {
  return api.post(
    "/api/auth/forgot-password",
    { email }
  );
};

export const resetPassword = (resetData) => {
  return api.post(
    "/api/auth/reset-password",
    resetData
  );
};