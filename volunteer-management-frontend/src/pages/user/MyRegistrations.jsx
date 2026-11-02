import { useEffect, useState }
from "react";

import Navbar
from "../../components/Navbar";

import {
  getMyRegistrations
}
from "../../services/eventService";

const MyRegistrations = () => {

  const [registrations,
          setRegistrations] =

    useState([]);

  useEffect(() => {

    loadRegistrations();

  }, []);

  const loadRegistrations =
    async () => {

      try {

        const response =
          await getMyRegistrations();

        setRegistrations(
          response.data
        );

      }

      catch (error) {

        console.log(error);

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

        <h2
          className="
          mb-4
          "
        >

          My Registrations

        </h2>

        {

          registrations.length === 0 ?

          (

            <div
              className="
              alert
              alert-info
              "
            >

              No Registrations Found

            </div>

          )

          :

          (

            <div className="row">

              {

                registrations.map(

                  (registration) => (

                    <div

                      key={
                        registration.registrationId
                      }

                      className="
                      col-md-6
                      mb-4
                      "

                    >

                      <div
                        className="
                        card
                        shadow-sm
                        border-0
                        h-100
                        "
                      >

                        <div
                          className="
                          card-body
                          "
                        >

                          <h4>

                            {
                              registration.eventTitle
                            }

                          </h4>

                          <p>

                            <strong>

                              City:

                            </strong>

                            {" "}

                            {
                              registration.city
                            }

                          </p>

                          <p>

                            <strong>

                              Volunteer:

                            </strong>

                            {" "}

                            {
                              registration.volunteerName
                            }

                          </p>

                          <span
                            className="
                            badge
                            bg-success
                            "
                          >

                            {
                              registration.registrationStatus
                            }

                          </span>

                        </div>

                      </div>

                    </div>

                  )

                )

              }

            </div>

          )

        }

      </div>

    </>

  );

};

export default MyRegistrations;