import { NavLink, useNavigate } from "react-router";
import DarkLight from "../DarkLight/DarkLight";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import NewVehicle from "../NewVehicle/NewVehicle";

export default function Menu({ onAddVehicle }) {
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const menuLinkClassName = ({ isActive }) =>
    [
      "inline-flex min-h-9 items-center justify-center rounded-xl border px-3 py-2 no-underline transition",
      "hover:-translate-y-px hover:border-blue-600/20 hover:bg-blue-600/10 hover:text-blue-700",
      "dark:hover:border-blue-300/25 dark:hover:bg-blue-400/10 dark:hover:text-blue-200",
      "max-[720px]:min-h-8 max-[720px]:rounded-lg max-[720px]:px-2.5 max-[720px]:py-1.5",
      "max-[420px]:px-2 max-[420px]:text-xs",
      isActive
        ? "border-blue-600/20 bg-blue-600/10 text-blue-700 shadow-md shadow-blue-600/10 dark:border-blue-300/25 dark:bg-blue-400/15 dark:text-blue-100 dark:shadow-black/20"
        : "border-transparent text-slate-700 dark:text-slate-300",
    ].join(" ");

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
          className="sticky top-0 z-[1000] m-0 flex w-full items-center justify-between gap-4 border-b border-slate-300/30 bg-white/85 px-5 py-3 font-bold text-slate-900 shadow-lg shadow-slate-900/5 backdrop-blur-xl dark:border-slate-400/15 dark:bg-slate-900/85 dark:text-slate-50 dark:shadow-black/30 max-[720px]:flex-col max-[720px]:items-stretch max-[720px]:gap-2 max-[720px]:px-3 max-[720px]:py-2.5 max-[420px]:px-2"
          aria-label="Navigazione principale"
        >
          <NavLink
            to="/"
            className={menuLinkClassName}
            aria-label="Vai alla Home di My Garage"
            onClick={closeModalOnly}
            end
          >
            <span
              className="inline-flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-green-500 text-xs font-black tracking-tight text-white shadow-lg shadow-blue-600/25 max-[720px]:size-7.5 max-[720px]:rounded-lg max-[420px]:size-7"
              aria-hidden="true"
            >
              MG
            </span>
            <span className="text-[1.35rem] max-[720px]:text-xl max-[420px]:text-lg">
              My Garage
            </span>
          </NavLink>

          <ul className="m-0 flex list-none items-center justify-center gap-1 p-0 max-[720px]:flex-wrap max-[720px]:gap-1 max-[720px]:text-sm">
            <li>
              <NavLink to="/"
                className={menuLinkClassName}
                onClick={closeModalOnly} end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/expired"
                className={menuLinkClassName}
                onClick={closeModalOnly}>
                Scaduti
              </NavLink>
            </li>
            <li>
              <NavLink to="/expiring"
                className={menuLinkClassName}
                onClick={closeModalOnly}>
                In Scadenza
              </NavLink>
            </li>
            <li>
              <NavLink to="/impostazioni"
                className={menuLinkClassName}
                onClick={closeModalOnly}>
                Impostazioni
              </NavLink>
            </li>
          </ul>
        </nav>
      )}

      <div
        className={
          isAuthenticated
            ? "mt-6 mb-3.5 flex items-center justify-center gap-3 px-4 max-[720px]:mt-3 max-[720px]:mb-1 max-[720px]:flex-wrap max-[720px]:gap-2 max-[720px]:px-0 max-[420px]:mt-2 max-[420px]:gap-1.5"
            : "mt-3 flex w-full items-center justify-center gap-3 px-4 max-[720px]:flex-wrap max-[720px]:gap-2 max-[720px]:px-0"
        }
      >
        {isAuthenticated && (
          <div className="flex min-w-32 flex-col justify-center rounded-2xl border border-blue-600/15 bg-blue-100/70 px-3.5 py-2 leading-tight text-blue-900 shadow-sm dark:border-blue-300/30 dark:bg-slate-900/70 dark:text-slate-50 dark:shadow-lg dark:shadow-black/25 max-[720px]:w-full max-[720px]:min-w-0 max-[720px]:items-center max-[720px]:rounded-xl max-[720px]:px-3 max-[720px]:py-2 max-[720px]:text-center">
            <span className="text-[0.68rem] uppercase tracking-[0.06em] opacity-70 dark:text-slate-300 dark:opacity-100 max-[720px]:text-[0.62rem]">
              Utente
            </span>

            <strong className="break-words text-sm dark:text-white max-[720px]:text-[0.84rem]">
              {user?.name || user?.email}
            </strong>
          </div>
        )}

        <DarkLight />

        {isAuthenticated && (
          <>
            <button
              type="button"
              className="min-h-11 rounded-full bg-blue-600 px-4 py-3 font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-px hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 disabled:cursor-not-allowed disabled:opacity-70 max-[420px]:px-3 max-[420px]:py-2.5"
              onClick={handleOpenModal}
            >
              Nuovo ➕
            </button>

            <button
              type="button"
              className="min-h-11 rounded-full bg-gradient-to-br from-red-500 to-orange-500 px-4 py-3 font-extrabold text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-px hover:from-red-600 hover:to-red-600 hover:shadow-xl hover:shadow-red-600/25 max-[420px]:px-3 max-[420px]:py-2.5"
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
