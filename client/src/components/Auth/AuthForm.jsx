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
    "w-full rounded-2xl border border-slate-300/80 bg-white px-4 py-3 text-slate-900 outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-blue-300 dark:focus:ring-blue-300/10";

  return (
    <section className="grid min-h-[calc(100vh-80px)] place-items-center px-4 py-8">
      <div className="w-[min(100%,460px)] overflow-hidden rounded-[28px] border border-slate-300/20 bg-white/92 shadow-[0_24px_60px_rgba(15,23,42,0.14)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/90 dark:shadow-[0_28px_70px_rgba(0,0,0,0.42)] max-[520px]:rounded-[22px]">
        <div className="border-b border-slate-300/20 bg-[linear-gradient(135deg,rgba(219,234,254,0.8),rgba(255,255,255,0.9))] px-8 py-7 text-center dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(30,64,175,0.18),rgba(15,23,42,0.9))] max-[520px]:px-5 max-[520px]:py-6">
          <span
            className="mb-4 inline-grid size-14 place-items-center rounded-[20px] bg-blue-600 text-[1.8rem] text-white shadow-[0_14px_28px_rgba(37,99,235,0.26)]"
            aria-hidden="true"
          >
            {"\u{1F697}"}
          </span>

          <span className="block text-[0.72rem] font-black uppercase tracking-[0.1em] text-blue-600 dark:text-blue-300">
            My Garage
          </span>

          <h1 className="mt-1 mb-0 text-[clamp(1.65rem,4vw,2.15rem)] font-black leading-tight tracking-[-0.045em] text-slate-900 dark:text-white">
            {title}
          </h1>

          <p className="mx-auto mt-3 mb-0 max-w-sm leading-6 text-slate-600 dark:text-slate-300">
            {description}
          </p>
        </div>

        <div className="p-8 max-[520px]:p-5">
          {demoInfo && (
            <div className="mb-6 grid gap-3 rounded-[20px] border border-blue-500/15 bg-blue-50/80 p-4 text-blue-950 dark:border-blue-300/15 dark:bg-blue-300/8 dark:text-blue-100">
              <div>
                <span className="text-[0.68rem] font-black uppercase tracking-[0.08em] text-blue-600 dark:text-blue-300">
                  Accesso rapido
                </span>
                <h2 className="mt-1 mb-0 text-[1.05rem] font-black">
                  Prova la demo
                </h2>
              </div>

              <p className="m-0 text-sm leading-6 text-blue-900/75 dark:text-blue-100/80">
                Puoi entrare direttamente con l’account dimostrativo.
              </p>

              <div className="grid gap-1 rounded-2xl bg-white/75 p-3 text-sm dark:bg-slate-950/45">
                <span>
                  Email: <strong>{demoInfo.email}</strong>
                </span>
                <span>
                  Password: <strong>{demoInfo.password}</strong>
                </span>
              </div>

              <button
                type="button"
                className="min-h-11 rounded-full bg-blue-600 px-4 py-3 font-extrabold text-white shadow-[0_10px_22px_rgba(37,99,235,0.22)] transition hover:-translate-y-px hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 motion-reduce:transition-none"
                onClick={handleDemoLogin}
                disabled={isSubmitting}
              >
                {isSubmitting ? "\u23F3 Accesso demo..." : "Entra come demo"}
              </button>
            </div>
          )}

          <form className="grid gap-4" onSubmit={handleSubmit}>
            {isRegister && (
              <label className="grid gap-2 text-sm font-extrabold text-slate-700 dark:text-slate-200">
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

            <label className="grid gap-2 text-sm font-extrabold text-slate-700 dark:text-slate-200">
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

            <label className="grid gap-2 text-sm font-extrabold text-slate-700 dark:text-slate-200">
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
                className="m-0 rounded-2xl border border-red-500/15 bg-red-50 px-4 py-3 text-sm font-bold text-red-800 dark:border-red-300/15 dark:bg-red-300/10 dark:text-red-200"
                role="alert"
              >
                {formError}
              </p>
            )}

            <button
              type="submit"
              className="mt-1 min-h-12 rounded-full bg-blue-600 px-5 py-3 font-extrabold text-white shadow-[0_12px_26px_rgba(37,99,235,0.24)] transition hover:-translate-y-px hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 motion-reduce:transition-none"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Attendere..." : submitLabel}
            </button>
          </form>

          <p className="mt-5 mb-0 text-center text-sm text-slate-500 dark:text-slate-300">
            {switchText}{" "}
            <button
              type="button"
              className="bg-transparent p-0 font-extrabold text-blue-600 shadow-none hover:bg-transparent hover:text-blue-700 hover:shadow-none dark:bg-transparent dark:text-blue-300 dark:hover:bg-transparent dark:hover:text-blue-200"
              onClick={onSwitch}
            >
              {switchActionLabel}
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}

export default AuthForm;
