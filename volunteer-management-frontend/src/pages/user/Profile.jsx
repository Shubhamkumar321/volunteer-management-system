import {
  useEffect,
  useState
} from "react";

import Swal
from "sweetalert2";

import Navbar
from "../../components/Navbar";

import {

  getProfile,
  updateProfile

}

from "../../services/profileService";

const Profile = () => {

  const [profile,
          setProfile] =

    useState({

      name: "",
      mobile: "",
      city: "",
      email: "",
      role: ""

    });

  useEffect(() => {

    loadProfile();

  }, []);

  const loadProfile =
    async () => {

      try {

        const response =
          await getProfile();

        setProfile(
          response.data
        );

      }

      catch (error) {

        console.log(error);

      }

    };

  const handleChange =
  (e) => {

    setProfile({

      ...profile,

      [e.target.name]:
      e.target.value

    });

  };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        await updateProfile({

          name:
          profile.name,

          mobile:
          profile.mobile,

          city:
          profile.city

        });

        Swal.fire({

          icon:
          "success",

          title:
          "Profile Updated"

        });

      }

      catch (error) {

        Swal.fire({

          icon:
          "error",

          title:
          "Update Failed"

        });

      }

    };

  return (

    <>

      <Navbar />

      <div
        className="
        container
        py-5
        "
      >

        <div
          className="
          card
          shadow-sm
          border-0
          p-4
          "
        >

          <h2
            className="
            mb-4
            "
          >

            My Profile

          </h2>

          <form
            onSubmit={
              handleSubmit
            }
          >

            <div
              className="
              mb-3
              "
            >

              <label>

                Name

              </label>

              <input

                type="text"

                name="name"

                value={
                  profile.name
                }

                onChange={
                  handleChange
                }

                className="
                form-control
                "

              />

            </div>

            <div
              className="
              mb-3
              "
            >

              <label>

                Email

              </label>

              <input

                value={
                  profile.email
                }

                readOnly

                className="
                form-control
                "

              />

            </div>

            <div
              className="
              mb-3
              "
            >

              <label>

                Mobile

              </label>

              <input

                type="text"

                name="mobile"

                value={
                  profile.mobile
                }

                onChange={
                  handleChange
                }

                className="
                form-control
                "

              />

            </div>

            <div
              className="
              mb-3
              "
            >

              <label>

                City

              </label>

              <input

                type="text"

                name="city"

                value={
                  profile.city
                }

                onChange={
                  handleChange
                }

                className="
                form-control
                "

              />

            </div>

            <div
              className="
              mb-3
              "
            >

              <label>

                Role

                </label>

              <input

                value={
                  profile.role
                }

                readOnly

                className="
                form-control
                "

              />

            </div>

            <button

              className="
              btn
              btn-primary
              "

            >

              Save Changes

            </button>

          </form>

        </div>

      </div>

    </>

  );

};

export default Profile;