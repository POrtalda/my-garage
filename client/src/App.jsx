import { useContext } from "react";
import "./App.css";
import Vehicle from "./components/Vehicle/Vehicle";
import DashboardSummary from "./components/DashboardSummary/DashboardSummary";
import ThemeContext from "./context/ThemeContext";

function App({ vehicles, showDashboard = false }) {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className={isDarkMode ? "app dark" : "app light"}>
      {showDashboard && <DashboardSummary vehicles={vehicles} />}

      {vehicles !== null ? (
        vehicles.map((v) => <Vehicle key={v.id} vehicle={v} />)
      ) : (
        <p>Loading vehicles...</p>
      )}
    </div>
  );
}

export default App;