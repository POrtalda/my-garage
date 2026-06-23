import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Toast from "../components/Toast/Toast";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = ({ type = "info", title, message = "" }) => {
    setToast({
      id: Date.now(),
      type,
      title,
      message,
    });
  };

  const hideToast = () => {
    setToast(null);
  };

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toast]);

  const value = useMemo(
    () => ({
      showToast,
      hideToast,
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast toast={toast} onClose={hideToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}