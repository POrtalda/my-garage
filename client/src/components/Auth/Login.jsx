import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import AuthForm from "./AuthForm";

const isDemoMode = import.meta.env.VITE_DEMO_MODE === "true";

const demoCredentials = {
  email: "demo@mygarage.dev",
  password: "Demo123!",
};

function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async ({ email, password }) => {
    await login({ email, password });

    showToast({
      type: "success",
      title: "Accesso effettuato",
      message: "Bentornato in My Garage.",
    });

    navigate("/", { replace: true });
  };

  return (
    <AuthForm
      title={isDemoMode ? "Accedi alla demo" : "Accedi"}
      description={
        isDemoMode
          ? "Prova My Garage Demo con dati fittizi e funzioni limitate."
          : "Entra nel tuo garage personale e gestisci le scadenze dei veicoli."
      }
      submitLabel="Accedi"
      onSubmit={handleLogin}
      switchText="Non hai ancora un account?"
      switchActionLabel="Registrati"
      onSwitch={() => navigate("/register")}
      demoInfo={
        isDemoMode
          ? {
              email: demoCredentials.email,
              password: demoCredentials.password,
            }
          : null
      }
    />
  );
}

export default Login;