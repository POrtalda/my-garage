import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import AuthForm from "./AuthForm";

function Register() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async ({ name, email, password }) => {
    await register({ name, email, password });

    showToast({
      type: "success",
      title: "Registrazione completata",
      message: "Il tuo account My Garage è stato creato.",
    });

    navigate("/", { replace: true });
  };

  return (
    <AuthForm
      title="Crea account"
      description="Crea il tuo profilo per iniziare a gestire i veicoli in modo personale."
      submitLabel="Registrati"
      isRegister
      onSubmit={handleRegister}
      switchText="Hai già un account?"
      switchActionLabel="Accedi"
      onSwitch={() => navigate("/login")}
    />
  );
}

export default Register;