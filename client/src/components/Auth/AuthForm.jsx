import { useState } from "react";
import "./AuthForm.css";

function AuthForm({
  title,
  description,
  submitLabel,
  isRegister = false,
  onSubmit,
  switchText,
  switchActionLabel,
  onSwitch,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isRegister && !formData.name.trim()) {
      setFormError("Inserisci il nome.");
      return;
    }

    if (!formData.email.trim()) {
      setFormError("Inserisci l'email.");
      return;
    }

    if (!formData.password.trim()) {
      setFormError("Inserisci la password.");
      return;
    }

    if (formData.password.length < 6) {
      setFormError("La password deve contenere almeno 6 caratteri.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      setFormError(error.message || "Operazione non riuscita. Riprova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">🚗</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <label>
              Nome
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Il tuo nome"
                disabled={isSubmitting}
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              disabled={isSubmitting}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Almeno 6 caratteri"
              disabled={isSubmitting}
            />
          </label>

          {formError && <p className="auth-error">{formError}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Attendere..." : submitLabel}
          </button>
        </form>

        <p className="auth-switch">
          {switchText}{" "}
          <button type="button" onClick={onSwitch}>
            {switchActionLabel}
          </button>
        </p>
      </div>
    </section>
  );
}

export default AuthForm;