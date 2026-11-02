import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  FaHandsHelping
} from "react-icons/fa";

import {
  useAuth
} from "../context/AuthContext";

const Navbar = () => {

  const navigate =
    useNavigate();

  const {
    user,
    logout
  } = useAuth();

  const handleLogout =
  () => {

    logout();

    navigate("/login");
  };

  return (

    <nav
      className="
      navbar
      navbar-expand-lg
      bg-white
      shadow-sm
      sticky-top
      py-3
      "
    >

      <div className="container">

        <Link
          to="/"
          className="
          navbar-brand
          fw-bold
          text-primary
          fs-2
          d-flex
          align-items-center
          "
        >

          <FaHandsHelping
            className="me-2"
          />

          VolunteerConnect

        </Link>

        {

          user ?

          (

            <div
              className="
              d-flex
              gap-3
              align-items-center
              "
            >

              <Link
                to="/dashboard"
                className="
                btn
                btn-outline-primary
                rounded-pill
                px-4
                "
              >

                Dashboard

              </Link>


              <Link

  to="/my-events"

  className="
  btn
  btn-outline-secondary
  rounded-pill
  px-4
  "

>

  My Events

</Link>

<Link

  to="/my-registrations"

  className="
  btn
  btn-outline-dark
  rounded-pill
  px-4
  "

>

  My Registrations

</Link>



              <Link

  to="/create-event"

  className="
  btn
  btn-outline-warning
  rounded-pill
  px-4
  "

>

  Create Event

</Link>

{
  user?.role === "ADMIN" && (

    <Link
      to="/admin-dashboard"
      className="
      btn
      btn-dark
      rounded-pill
      "
    >

      Admin

    </Link>

  )
}



              <Link

  to="/profile"

  className="
  btn
  btn-outline-success
  rounded-pill
  px-4
  "

>

  Profile

</Link>



              <span
                className="
                fw-bold
                "
              >

                {user.name}

              </span>

              <button

                onClick={
                  handleLogout
                }

                className="
                btn
                btn-danger
                rounded-pill
                px-4
                "

              >

                

                Logout

              </button>

            </div>

          )

          :

          (

            <div
              className="
              d-flex
              gap-3
              "
            >

              <Link
                to="/login"
                className="
                btn
                btn-outline-primary
                rounded-pill
                px-4
                "
              >

                Login

              </Link>




              <Link
                to="/register"
                className="
                btn
                btn-primary
                rounded-pill
                px-4
                "
              >

                Register

              </Link>

            </div>

          )

        }

      </div>

    </nav>

  );

};

export default Navbar;