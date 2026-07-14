import { useContext } from "react";
import ThemeContext from "../../context/ThemeContext";

export default function DarkLight() {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button
      type="button"
      className="min-h-11 rounded-xl border-0 bg-gradient-to-br from-teal-300 to-teal-500 px-5 py-2.5 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg dark:from-teal-700 dark:to-teal-900 dark:text-slate-100 max-[420px]:px-3 max-[420px]:py-2.5"
      onClick={handleToggleTheme}
      aria-label={
        isDarkMode ? "Attiva il tema chiaro" : "Attiva il tema scuro"
      }
    >
      {isDarkMode ? "Light 🔆" : "Dark 🌙"}
    </button>
  );
}
