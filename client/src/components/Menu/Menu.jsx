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

  return (
    <>
      {isAuthenticated && (
        <ul className={isDarkMode ? "menu menu_dark" : "menu menulight"}>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/expired">Scaduti</NavLink>
          </li>
          <li>
            <NavLink to="/expiring">In Scadenza</NavLink>
          </li>
          <li>
            <NavLink to="/impostazioni">Impostazioni</NavLink>
          </li>
        </ul>
      )}

      <h1>{title}</h1>

      <div className="menu-actions">
        {isAuthenticated && (
          <div className="menu-user">
            <span className="menu-user-label">Utente</span>
            <strong>{user?.name || user?.email}</strong>
          </div>
        )}

        <DarkLight />

        {isAuthenticated && (
          <>
            <button type="button" onClick={() => setShowModal(true)}>
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
        <NewVehicle
          onAdd={onAddVehicle}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
