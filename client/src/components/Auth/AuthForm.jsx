import { useState } from "react";

function AuthForm({
  title,
  description,
  submitLabel,
  isRegister = false,
  onSubmit,
  switchText,
  switchActionLabel,
  onSwitch,
  demoInfo,
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

  const handleDemoLogin = async () => {
    if (!demoInfo) {
      return;
    }

    const demoFormData = {
      name: "",
      email: demoInfo.email,
      password: demoInfo.password,
    };

    setFormError("");
    setFormData(demoFormData);
    setIsSubmitting(true);

    try {
      await onSubmit(demoFormData);
    } catch (error) {
      setFormError(error.message || "Accesso demo non riuscito. Riprova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    "w-full rounded-[14px] border border-slate-300 bg-white px-4 py-[0.85rem] font-[inherit] text-slate-900 outline-none transition focus:border-blue-600 focus:outline-2 focus:outline-blue-300 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-50";

  return (
    <section className="grid min-h-[calc(100vh-80px)] place-items-center px-4 py-8">
      <div className="w-[min(100%,430px)] rounded-3xl border border-slate-400/20 bg-[var(--card-bg,#ffffff)] p-8 shadow-[0_18px_45px_rgba(15,23,42,0.14)] dark:border-slate-700 dark:bg-slate-900 max-[520px]:rounded-[20px] max-[520px]:p-[1.4rem]">
        <div className="mb-6 text-center">
          <span
            className="mb-3 inline-grid h-[52px] w-[52px] place-items-center rounded-[18px] bg-blue-50 text-[1.8rem] dark:bg-blue-900"
            aria-hidden="true"
          >
            {"\u{1F697}"}
          </span>

          <h1 className="m-0 text-[1.8rem] font-bold max-[520px]:text-2xl">
            {title}
          </h1>

          <p className="mt-2 mb-0 leading-6 text-slate-500 dark:text-slate-300">
            {description}
          </p>
        </div>

        {demoInfo && (
          <div className="mb-[1.4rem] grid gap-[0.85rem] rounded-[18px] border border-blue-200 bg-blue-50 p-4 text-blue-900 dark:border-blue-600 dark:bg-blue-950 dark:text-blue-100">
            <h2 className="m-0 text-[1.05rem] font-bold">Accesso demo</h2>

            <p className="m-0 leading-6">
              Puoi provare My Garage senza registrarti. Usa le credenziali demo
              oppure entra direttamente con il pulsante qui sotto.
            </p>

            <div className="grid gap-[0.35rem] rounded-[14px] bg-white/70 p-3 text-[0.95rem] dark:bg-slate-900/70">
              <span>
                Email: <strong>{demoInfo.email}</strong>
              </span>

              <span>
                Password: <strong>{demoInfo.password}</strong>
              </span>
            </div>

            <button
              type="button"
              className="cursor-pointer rounded-full border-0 bg-blue-700 px-4 py-[0.8rem] font-[inherit] font-extrabold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
              onClick={handleDemoLogin}
              disabled={isSubmitting}
            >
              {isSubmitting ? "\u23F3 Accesso demo..." : "Entra come demo"}
            </button>
          </div>
        )}

        <form className="grid gap-4" onSubmit={handleSubmit}>
          {isRegister && (
            <label className="grid gap-[0.4rem] font-bold text-slate-700 dark:text-slate-200">
              Nome
              <input
                className={inputClasses}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Il tuo nome"
                disabled={isSubmitting}
              />
            </label>
          )}

          <label className="grid gap-[0.4rem] font-bold text-slate-700 dark:text-slate-200">
            Email
            <input
              className={inputClasses}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              disabled={isSubmitting}
            />
          </label>

          <label className="grid gap-[0.4rem] font-bold text-slate-700 dark:text-slate-200">
            Password
            <input
              className={inputClasses}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Almeno 6 caratteri"
              disabled={isSubmitting}
            />
          </label>

          {formError && (
            <p
              className="m-0 rounded-[14px] bg-red-50 px-[0.9rem] py-3 font-bold text-red-800"
              role="alert"
            >
              {formError}
            </p>
          )}

          <button
            type="submit"
            className="cursor-pointer rounded-full border-0 bg-blue-600 px-[1.2rem] py-[0.9rem] font-[inherit] font-extrabold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Attendere..." : submitLabel}
          </button>
        </form>

        <p className="mt-[1.2rem] mb-0 text-center text-slate-500 dark:text-slate-300">
          {switchText}{" "}
          <button
            type="button"
            className="cursor-pointer border-0 bg-transparent p-0 font-[inherit] font-extrabold text-blue-600 hover:text-blue-700"
            onClick={onSwitch}
          >
            {switchActionLabel}
          </button>
        </p>
      </div>
    </section>
  );
}

export default AuthForm;
