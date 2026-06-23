import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import AuthForm from "./AuthForm";

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
      title="Accedi"
      description="Entra nel tuo garage personale e gestisci le scadenze dei veicoli."
      submitLabel="Accedi"
      onSubmit={handleLogin}
      switchText="Non hai ancora un account?"
      switchActionLabel="Registrati"
      onSwitch={() => navigate("/register")}
    />
  );
}

export default Login;