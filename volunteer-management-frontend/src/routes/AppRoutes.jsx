import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from "../pages/Home";

import Login from "../pages/auth/Login";

import Register from "../pages/auth/Register";

import Dashboard from "../pages/user/Dashboard";

import Profile from "../pages/user/Profile";

import CreateEvent from "../pages/user/CreateEvent";

import MyEvents from "../pages/user/MyEvents";

import MyRegistrations from "../pages/user/MyRegistrations";

import PublicEvents from "../pages/PublicEvents";

import AdminDashboard from "../pages/admin/AdminDashboard";

import ProtectedRoute from "../components/ProtectedRoute";

import AdminRoute from "../components/AdminRoute";

const AppRoutes = () => {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/events"
          element={<PublicEvents />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-event"
          element={
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-events"
          element={
            <ProtectedRoute>
              <MyEvents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-registrations"
          element={
            <ProtectedRoute>
              <MyRegistrations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );

};

export default AppRoutes;