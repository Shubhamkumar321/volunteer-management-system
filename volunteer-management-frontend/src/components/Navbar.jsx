import {
  Link,
  NavLink,
  useNavigate
} from "react-router-dom";

import {
  FaHandsHelping,
  FaBars
} from "react-icons/fa";

import { useState } from "react";

import {
  useAuth
} from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-xxl navbar-custom sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand brand-lockup" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">
            <FaHandsHelping />
          </span>
          <span>Volunteer<span className="brand-accent">Connect</span></span>
        </Link>

        <button
          className="navbar-toggler navbar-menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
        >
          <FaBars aria-hidden="true" />
        </button>

        <div id="primary-navigation" className={`collapse navbar-collapse${menuOpen ? " show" : ""}`}>
          <div className="navbar-nav main-nav-links">
            <NavLink
              to="/events"
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              onClick={closeMenu}
            >
              Explore events
            </NavLink>
            {user && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                onClick={closeMenu}
              >
                Dashboard
              </NavLink>
            )}
          </div>

          <div className="navbar-actions">
            {user ? (
              <>
                <div className="account-links">
                  <NavLink to="/my-events" className="nav-link" onClick={closeMenu}>
                    My events
                  </NavLink>
                  <NavLink to="/my-registrations" className="nav-link" onClick={closeMenu}>
                    Registrations
                  </NavLink>
                  {user.role === "ADMIN" && (
                    <NavLink to="/admin-dashboard" className="nav-link" onClick={closeMenu}>
                      Admin
                    </NavLink>
                  )}
                </div>
                <Link to="/create-event" className="btn btn-create-event" onClick={closeMenu}>
                  Create an event
                </Link>
                <Link to="/profile" className="profile-link" onClick={closeMenu} title="Open profile">
                  {user.name}
                </Link>
                <button type="button" onClick={handleLogout} className="btn btn-logout">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link login-link" onClick={closeMenu}>
                  Log in
                </Link>
                <Link to="/register" className="btn btn-join" onClick={closeMenu}>
                  Join the community
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;