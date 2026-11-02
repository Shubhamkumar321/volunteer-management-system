import api from "./api";

export const getProfile =
() => {

  return api.get(
    "/api/user/profile"
  );

};

export const updateProfile =
(profileData) => {

  return api.put(

    "/api/user/profile",

    profileData

  );

};