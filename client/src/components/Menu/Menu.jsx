import { NavLink, useNavigate } from "react-router";
import "./Menu.css";
import DarkLight from "../DarkLight/DarkLight";
import { useContext, useState } from "react";
import ThemeContext from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import NewVehicle from "../NewVehicle/NewVehicle";

export default function Menu({ title, onAddVehicle }) {
  const { isDarkMode } = useContext(ThemeContext);
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    logout();

    showToast({
      type: "success",
      title: "Logout effettuato",
      message: "Sei uscito dal tuo account.",
    });

    navigate("/login", { replace: true });
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/", { replace: false });
  };

  const closeModalOnly = () => {
    setShowModal(false);
  };

  return (
    <>
      {isAuthenticated && (
        <nav
          className={isDarkMode ? "menu menu_dark" : "menu menu_light"}
          aria-label="Navigazione principale"
        >
          {title && (
            <NavLink
              to="/"
              className="menu-brand"
              onClick={closeModalOnly}
              end
            >
              {title}
            </NavLink>
          )}

          <ul className="menu-links">
            <li>
              <NavLink to="/" onClick={closeModalOnly} end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/expired" onClick={closeModalOnly}>
                Scaduti
              </NavLink>
            </li>
            <li>
              <NavLink to="/expiring" onClick={closeModalOnly}>
                In Scadenza
              </NavLink>
            </li>
            <li>
              <NavLink to="/impostazioni" onClick={closeModalOnly}>
                Impostazioni
              </NavLink>
            </li>
          </ul>
        </nav>
      )}

      {!isAuthenticated && title && <h1 className="guest-title">{title}</h1>}

      <div
        className={
          isAuthenticated ? "menu-actions" : "menu-actions guest-actions"
        }
      >
        {isAuthenticated && (
          <div className="menu-user">
            <span className="menu-user-label">Utente</span>
            <strong>{user?.name || user?.email}</strong>
          </div>
        )}

        <DarkLight />

        {isAuthenticated && (
          <>
            <button type="button" onClick={handleOpenModal}>
              Nuovo ➕
            </button>

            <button
              type="button"
              className="menu-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>

      {showModal && (
        <NewVehicle onAdd={onAddVehicle} onClose={handleCloseModal} />
      )}
    </>
  );
}
