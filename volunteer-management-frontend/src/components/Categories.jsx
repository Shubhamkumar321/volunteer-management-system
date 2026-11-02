import {
  FaTree,
  FaTint,
  FaBook,
  FaPaw
} from "react-icons/fa";

const Categories = () => {

  const categories = [
    {
      title: "Environment",
      icon: <FaTree />,
      color: "#10b981"
    },
    {
      title: "Blood Donation",
      icon: <FaTint />,
      color: "#ef4444"
    },
    {
      title: "Education",
      icon: <FaBook />,
      color: "#3b82f6"
    },
    {
      title: "Animal Welfare",
      icon: <FaPaw />,
      color: "#f59e0b"
    }
  ];

  return (

    <section
      className="py-5 bg-white"
    >

      <div className="container">

        <h2
          className="
          text-center
          fw-bold
          mb-5
          "
        >
          Volunteer Categories
        </h2>

        <div className="row">

          {
            categories.map(
              (category, index) => (

                <div
                  key={index}
                  className="
                  col-md-3
                  mb-4
                  "
                >

                  <div
                    className="
                    card
                    border-0
                    shadow-sm
                    text-center
                    p-4
                    h-100
                    "
                    style={{
                      borderRadius:
                      "20px"
                    }}
                  >

                    <div
                      style={{
                        fontSize: "50px",
                        color:
                        category.color
                      }}
                    >

                      {category.icon}

                    </div>

                    <h5
                      className="
                      mt-3
                      fw-bold
                      "
                    >

                      {category.title}

                    </h5>

                  </div>

                </div>

              )
            )
          }

        </div>

      </div>

    </section>

  );
};

export default Categories;