import { NavLink, useNavigate } from "react-router";
import { useState } from "react";
import DarkLight from "../DarkLight/DarkLight";
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
      "inline-flex min-h-10 items-center justify-center rounded-xl border px-3 py-2 text-sm font-extrabold no-underline transition-[transform,background-color,border-color,color,box-shadow] duration-200",
      "hover:-translate-y-px hover:border-blue-500/20 hover:bg-blue-500/10 hover:text-blue-700",
      "dark:hover:border-blue-300/20 dark:hover:bg-blue-300/10 dark:hover:text-blue-100",
      "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
      "max-[720px]:min-h-9 max-[720px]:px-2.5 max-[420px]:text-xs",
      isActive
        ? "border-blue-500/20 bg-blue-500/10 text-blue-700 shadow-[0_8px_18px_rgba(37,99,235,0.1)] dark:border-blue-300/20 dark:bg-blue-300/10 dark:text-blue-100"
        : "border-transparent text-slate-600 dark:text-slate-300",
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
          className="sticky top-0 z-[1000] w-full border-b border-slate-300/25 bg-white/82 px-4 py-3 text-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/82 dark:text-slate-50 dark:shadow-[0_12px_34px_rgba(0,0,0,0.34)]"
          aria-label="Navigazione principale"
        >
          <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between gap-4 max-[820px]:flex-col max-[820px]:items-stretch max-[820px]:gap-3">
            <NavLink
              to="/"
              className="inline-flex items-center gap-2.5 text-slate-900 no-underline dark:text-slate-50 max-[820px]:justify-center"
              aria-label="Vai alla Home di My Garage"
              onClick={closeModalOnly}
              end
            >
              <span
                className="inline-flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-xs font-black tracking-tight text-white shadow-[0_10px_22px_rgba(37,99,235,0.24)]"
                aria-hidden="true"
              >
                MG
              </span>

              <span className="text-[1.28rem] font-black tracking-[-0.035em]">
                My Garage
              </span>
            </NavLink>

            <ul className="m-0 flex list-none items-center justify-center gap-1 p-0 max-[820px]:flex-wrap">
              <li>
                <NavLink
                  to="/"
                  className={menuLinkClassName}
                  onClick={closeModalOnly}
                  end
                >
                  Home
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/expired"
                  className={menuLinkClassName}
                  onClick={closeModalOnly}
                >
                  Scaduti
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/expiring"
                  className={menuLinkClassName}
                  onClick={closeModalOnly}
                >
                  In scadenza
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/impostazioni"
                  className={menuLinkClassName}
                  onClick={closeModalOnly}
                >
                  Impostazioni
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      )}

      <div
        className={
          isAuthenticated
            ? "mx-auto mt-5 mb-4 flex w-[min(100%-2rem,1120px)] items-center justify-between gap-3 rounded-[22px] border border-slate-300/20 bg-white/70 px-4 py-3 shadow-[0_12px_28px_rgba(15,23,42,0.07)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/65 dark:shadow-[0_14px_30px_rgba(0,0,0,0.28)] max-[760px]:w-[min(100%-1.5rem,600px)] max-[760px]:flex-wrap max-[520px]:justify-center"
            : "mt-3 flex w-full items-center justify-center gap-3 px-4"
        }
      >
        {isAuthenticated && (
          <div className="min-w-0 flex-1 max-[520px]:w-full max-[520px]:flex-none max-[520px]:text-center">
            <span className="block text-[0.68rem] font-black uppercase tracking-[0.08em] text-slate-400">
              Account
            </span>

            <strong className="block overflow-hidden text-ellipsis whitespace-nowrap text-sm text-slate-800 dark:text-slate-100">
              {user?.name || user?.email}
            </strong>
          </div>
        )}

        <div className="flex items-center gap-2 max-[520px]:flex-wrap max-[520px]:justify-center">
          <DarkLight />

          {isAuthenticated && (
            <>
              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-blue-600 px-4 py-2.5 font-extrabold text-white shadow-[0_10px_22px_rgba(37,99,235,0.22)] transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-px hover:bg-blue-700 hover:shadow-[0_14px_28px_rgba(37,99,235,0.28)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 max-[420px]:px-3"
                onClick={handleOpenModal}
              >
                Nuovo +
              </button>

              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-red-500/15 bg-red-500/10 px-4 py-2.5 font-extrabold text-red-700 shadow-none transition-[transform,background-color,border-color,color] duration-200 hover:-translate-y-px hover:border-red-500/25 hover:bg-red-500/15 dark:border-red-300/15 dark:bg-red-300/10 dark:text-red-200 dark:hover:border-red-300/25 dark:hover:bg-red-300/15 motion-reduce:transition-none motion-reduce:hover:translate-y-0 max-[420px]:px-3"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {showModal && (
        <NewVehicle onAdd={onAddVehicle} onClose={handleCloseModal} />
      )}
    </>
  );
}
