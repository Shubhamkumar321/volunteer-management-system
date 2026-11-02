import {

  useState

} from "react";

import Swal from "sweetalert2";

import {

  registerUser

} from "../../services/authService";

const Register = () => {

  const [formData, setFormData] =
    useState({

      name: "",

      email: "",

      password: "",

      mobile: "",

      city: ""

    });

  const handleChange = (

    e

  ) => {

    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value

    });

  };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        await registerUser(
          formData
        );

        Swal.fire({

          icon: "success",

          title:
          "Registration Successful"

        });

      } catch (error) {

        Swal.fire({

          icon: "error",

          title:
          "Registration Failed"

        });

      }

    };

  return (

    <div
      className="
      container
      py-5
      "
    >

      <div
        className="
        row
        justify-content-center
        "
      >

        <div
          className="
          col-md-6
          "
        >

          <div
            className="
            card
            shadow-lg
            p-4
            "
          >

            <h2
              className="
              text-center
              mb-4
              "
            >

              Register

            </h2>

            <form
              onSubmit={
                handleSubmit
              }
            >

              <input

                name="name"

                placeholder="Name"

                className="
                form-control
                mb-3
                "

                onChange={
                  handleChange
                }

              />

              <input

                name="email"

                placeholder="Email"

                className="
                form-control
                mb-3
                "

                onChange={
                  handleChange
                }

              />

              <input

                type="password"

                name="password"

                placeholder="Password"

                className="
                form-control
                mb-3
                "

                onChange={
                  handleChange
                }

              />

              <input

                name="mobile"

                placeholder="Mobile"

                className="
                form-control
                mb-3
                "

                onChange={
                  handleChange
                }

              />

              <input

                name="city"

                placeholder="City"

                className="
                form-control
                mb-3
                "

                onChange={
                  handleChange
                }

              />

              <button
                className="
                btn
                btn-primary
                w-100
                "
              >

                Register

              </button>

            </form>

          </div>

        </div>

      </div>

    </div>

  );

};

export default Register;