import { createRoot } from "react-dom/client";
import "./index.css";
import { ToastProvider } from "./context/ToastContext.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

createRoot(document.getElementById("root")).render(
  <ToastProvider>
    <AppRoutes />
  </ToastProvider>
);