function Footer() {
  return (
    <footer className="mt-auto w-full px-4 pt-8 pb-5">
      <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between gap-4 border-t border-slate-300/20 pt-5 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400 max-[620px]:flex-col max-[620px]:text-center">
        <p className="m-0">
          © 2026 My Garage · Progetto sviluppato da Paolo Ortalda
        </p>

        <span className="font-semibold">Gestione semplice delle tue scadenze</span>
      </div>
    </footer>
  );
}

export default Footer;
