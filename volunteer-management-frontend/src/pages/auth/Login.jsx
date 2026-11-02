import { useState } from "react";

import { useNavigate,Link } from "react-router-dom";

import Swal from "sweetalert2";

import { loginUser } from "../../services/authService";

import { useAuth } from "../../context/AuthContext";


const Login = () => {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        const response =
          await loginUser({

            email,
            password

          });

        login(
          response.data
        );

        await Swal.fire({

          icon: "success",

          title: "Login Successful",

          text:
            "Welcome back!"

        });

        navigate(
          "/dashboard"
        );

      }

      catch (error) {

        Swal.fire({

          icon: "error",

          title:
            "Login Failed",

          text:

            error.response
              ?.data
              ?.message

            ||

            "Invalid Credentials"

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
          col-md-5
          "
        >

          <div
            className="
            card
            shadow-lg
            border-0
            p-4
            "

            
            style={{
              borderRadius:
                "20px"
            }}
          >
   

            

            <h2
              className="
              text-center
              mb-4
              fw-bold
              "
            >

              Login

            </h2>

            <form
              onSubmit={
                handleSubmit
              }
            >

              <input

                type="email"

                placeholder="Email"

                className="
                form-control
                mb-3
                "

                value={email}

                onChange={(e) =>

                  setEmail(
                    e.target.value
                  )

                }

                required

              />

              <input

                type="password"

                placeholder="Password"

                className="
                form-control
                mb-3
                "

                value={password}

                onChange={(e) =>

                  setPassword(
                    e.target.value
                  )

                }

                required

              />

              <button

                type="submit"

                className="
                btn
                btn-primary
                w-100
                rounded-pill
                "

              >

                Login

              </button>
              
          

            </form>
                     <Link
  to="/"
  className="
  btn
  btn-outline-secondary
  mb-3
  mt-3
  "
>
  ← Back to Home
</Link>
            
       
          </div>

        </div>

      </div>
      

    </div>

  );

};

export default Login;