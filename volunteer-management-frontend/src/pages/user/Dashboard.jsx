import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {

  const { user } = useAuth();

  return (
    <>
      <Navbar />

      <div className="container py-5">

        <div className="card shadow-sm border-0 p-4">

          <h2 className="fw-bold">
            Welcome, {user?.name}
          </h2>

          <hr />

          <p>
            <strong>Email:</strong> {user?.email}
          </p>

          <p>
            <strong>Role:</strong> {user?.role}
          </p>

          <p>
            <strong>Status:</strong> Logged In ✅
          </p>

        </div>

      </div>

    </>
  );
};

export default Dashboard;