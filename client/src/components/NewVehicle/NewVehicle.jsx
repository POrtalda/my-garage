import { useState } from "react";
import { lookupVehicleByPlate } from "../../services/plateLookupApi";

const initialFormData = {
  brand: "",
  model: "",
  plate: "",
  img_url: "",
  scadenza_bollo: "",
  scadenza_assicurazione: "",
  scadenza_revisione: "",
};

const maxImageSizeInBytes = 5 * 1024 * 1024;

function validateVehicleForm(formData) {
  const newErrors = {};

  if (!formData.brand.trim()) {
    newErrors.brand = "Inserisci la marca del veicolo.";
  }

  if (!formData.model.trim()) {
    newErrors.model = "Inserisci il modello del veicolo.";
  }

  if (!formData.scadenza_bollo) {
    newErrors.scadenza_bollo = "Inserisci la scadenza del bollo.";
  }

  if (!formData.scadenza_assicurazione) {
    newErrors.scadenza_assicurazione =
      "Inserisci la scadenza dell'assicurazione.";
  }

  if (!formData.scadenza_revisione) {
    newErrors.scadenza_revisione = "Inserisci la scadenza della revisione.";
  }

  return newErrors;
}

export default function NewVehicle({ onAdd, onClose }) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [plateLookupData, setPlateLookupData] = useState(null);
  const [isPlateLookupLoading, setIsPlateLookupLoading] = useState(false);
  const [plateLookupError, setPlateLookupError] = useState("");

  const [assistedDeadlines, setAssistedDeadlines] = useState({
    scadenza_bollo: "",
    scadenza_assicurazione: "",
    scadenza_revisione: "",
  });

  const [assistedDeadlinesApplied, setAssistedDeadlinesApplied] =
    useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
    setSubmitError("");

    if (name === "plate") {
      setPlateLookupError("");
      setPlateLookupData(null);
      setAssistedDeadlines({
        scadenza_bollo: "",
        scadenza_assicurazione: "",
        scadenza_revisione: "",
      });
      setAssistedDeadlinesApplied(false);
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  }

  function handleImageFileChange(e) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors({
        ...errors,
        img_url: "Seleziona un file immagine valido.",
      });
      return;
    }

    if (file.size > maxImageSizeInBytes) {
      setErrors({
        ...errors,
        img_url: "L'immagine è troppo grande. Usa un file massimo di 5 MB.",
      });
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const imageDataUrl = reader.result;

      setFormData((prev) => ({
        ...prev,
        img_url: imageDataUrl,
      }));

      setImagePreview(imageDataUrl);

      if (errors.img_url) {
        setErrors((prev) => ({ ...prev, img_url: "" }));
      }
    };

    reader.readAsDataURL(file);
  }

  async function handlePlateLookup() {
    const plate = formData.plate.trim();

    if (!plate) {
      setPlateLookupData(null);
      setPlateLookupError("Inserisci una targa prima di cercare i dati.");
      setErrors((prev) => ({
        ...prev,
        plate: "Inserisci una targa prima di cercare i dati.",
      }));
      return;
    }

    setIsPlateLookupLoading(true);
    setPlateLookupError("");
    setPlateLookupData(null);
    setSubmitError("");
    setAssistedDeadlines({
      scadenza_bollo: "",
      scadenza_assicurazione: "",
      scadenza_revisione: "",
    });
    setAssistedDeadlinesApplied(false);

    try {
      const data = await lookupVehicleByPlate(plate);

      setFormData((prev) => ({
        ...prev,
        plate: data.plate || prev.plate,
      }));

      setPlateLookupData(data);

      if (errors.plate) {
        setErrors((prev) => ({ ...prev, plate: "" }));
      }
    } catch (err) {
      setPlateLookupError(
        err.message || "Non è stato possibile cercare i dati dalla targa."
      );
    } finally {
      setIsPlateLookupLoading(false);
    }
  }

  function handleAssistedDeadlineChange(field, value) {
    setAssistedDeadlines((prevDeadlines) => ({
      ...prevDeadlines,
      [field]: value,
    }));

    setAssistedDeadlinesApplied(false);
  }

  function handleApplyAssistedDeadlines() {
    setFormData((prevFormData) => ({
      ...prevFormData,
      scadenza_bollo:
        assistedDeadlines.scadenza_bollo || prevFormData.scadenza_bollo,
      scadenza_assicurazione:
        assistedDeadlines.scadenza_assicurazione ||
        prevFormData.scadenza_assicurazione,
      scadenza_revisione:
        assistedDeadlines.scadenza_revisione ||
        prevFormData.scadenza_revisione,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      scadenza_bollo: assistedDeadlines.scadenza_bollo
        ? ""
        : prevErrors.scadenza_bollo,
      scadenza_assicurazione: assistedDeadlines.scadenza_assicurazione
        ? ""
        : prevErrors.scadenza_assicurazione,
      scadenza_revisione: assistedDeadlines.scadenza_revisione
        ? ""
        : prevErrors.scadenza_revisione,
    }));

    setAssistedDeadlinesApplied(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateVehicleForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitError("");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await onAdd({
        ...formData,
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        plate: formData.plate.trim().toUpperCase(),
        img_url: formData.img_url.trim(),
        id: Date.now(),
      });

      onClose();
    } catch (error) {
      setSubmitError(
        error.message ||
          "Non è stato possibile aggiungere il veicolo. Controlla la connessione e riprova."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const hasAssistedDeadlines =
    assistedDeadlines.scadenza_bollo ||
    assistedDeadlines.scadenza_assicurazione ||
    assistedDeadlines.scadenza_revisione;

  const labelClass =
    "flex flex-col gap-[0.45rem] font-bold text-[var(--color-text)]";
  const inputClass =
    "box-border min-h-[46px] w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-[0.9rem] py-[0.78rem] text-base text-[var(--color-text)] transition-[border-color,box-shadow,transform] duration-200 placeholder:text-slate-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-4 focus:ring-blue-600/15 max-[760px]:min-h-11 max-[760px]:px-3 max-[760px]:py-[0.7rem] motion-reduce:transition-none";
  const errorInputClass =
    "!border-[var(--color-danger)] shadow-[0_0_0_4px_rgba(220,38,38,0.12)]";
  const fieldErrorClass =
    "block text-[0.85rem] font-bold leading-[1.4] text-[var(--color-danger)]";
  const formErrorClass =
    "m-0 rounded-[var(--radius-md)] border border-red-600/20 bg-[var(--color-danger-soft)] px-4 py-[0.85rem] text-[0.92rem] font-bold leading-[1.45] text-[var(--color-danger-text)]";
  const primaryButtonClass =
    "min-h-[46px] cursor-pointer rounded-full border-0 bg-[var(--color-primary)] px-[1.1rem] py-3 font-extrabold text-white shadow-[0_8px_18px_rgba(37,99,235,0.2)] transition-[transform,opacity,box-shadow,background-color] duration-200 hover:-translate-y-px hover:bg-[var(--color-primary-hover)] hover:shadow-[0_12px_24px_rgba(37,99,235,0.26)] disabled:cursor-not-allowed disabled:opacity-65 disabled:hover:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0";
  const sectionClass =
    "rounded-[var(--radius-lg)] border border-slate-400/20 bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] max-[760px]:rounded-2xl max-[760px]:p-[0.9rem] max-[380px]:p-3";
  const sectionHeaderClass =
    "mb-4 flex items-start gap-[0.85rem] max-[760px]:mb-[0.8rem] max-[760px]:gap-[0.65rem]";
  const sectionIconClass =
    "inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] font-extrabold text-white shadow-[0_8px_18px_rgba(37,99,235,0.2)] max-[760px]:size-7";
  const sectionTitleClass =
    "m-0 text-[1.1rem] font-bold text-[var(--color-text)] max-[760px]:text-base";
  const sectionDescriptionClass =
    "mt-1 mb-0 text-[0.92rem] leading-6 text-[var(--color-text-muted)] max-[760px]:text-[0.84rem]";

  return (
    <div className="w-full p-5 max-[760px]:p-[0.8rem] max-[380px]:p-[0.65rem]">
      <div className="mb-4 rounded-[var(--radius-xl)] border border-slate-400/20 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.12),transparent_42%),linear-gradient(145deg,rgba(255,255,255,0.98),rgba(248,250,252,0.94))] p-6 shadow-[var(--shadow-md)] dark:bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_42%),linear-gradient(145deg,rgba(30,41,59,0.98),rgba(15,23,42,0.94))] max-[760px]:mb-3 max-[760px]:rounded-2xl max-[760px]:p-[0.9rem] max-[380px]:p-3">
        <span className="mb-[0.6rem] inline-flex w-fit rounded-full bg-[var(--color-primary-soft)] px-[0.7rem] py-[0.35rem] text-[0.78rem] font-extrabold tracking-[0.04em] text-[var(--color-primary-soft-text)] uppercase">
          Nuovo veicolo
        </span>
        <h2 className="m-0 text-left text-[clamp(1.7rem,4vw,2.35rem)] leading-[1.1] font-bold text-[var(--color-text)] max-[760px]:text-[clamp(1.45rem,8vw,1.9rem)]">
          Aggiungi un veicolo
        </h2>
        <p className="mt-[0.65rem] mb-0 max-w-[640px] leading-[1.6] text-[var(--color-text-muted)] max-[760px]:mt-2 max-[760px]:text-[0.9rem]">
          Inserisci i dati principali, aggiungi le scadenze e carica una foto
          per completare la scheda.
        </p>
      </div>

      <form
        className="grid gap-4 max-[760px]:gap-3"
        onSubmit={handleSubmit}
        noValidate
      >
        <section className={sectionClass}>
          <div className={sectionHeaderClass}>
            <span className={sectionIconClass}>1</span>
            <div>
              <h3 className={sectionTitleClass}>Dati veicolo</h3>
              <p className={sectionDescriptionClass}>
                Informazioni principali per riconoscere subito il mezzo.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 max-[760px]:grid-cols-1">
            <label className={labelClass}>
              Marca
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Es. Fiat"
                className={`${inputClass} ${
                  errors.brand ? errorInputClass : ""
                }`}
              />
              {errors.brand && (
                <span className={fieldErrorClass}>{errors.brand}</span>
              )}
            </label>

            <label className={labelClass}>
              Modello
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Es. Panda"
                className={`${inputClass} ${
                  errors.model ? errorInputClass : ""
                }`}
              />
              {errors.model && (
                <span className={fieldErrorClass}>{errors.model}</span>
              )}
            </label>
          </div>

          <div className="mt-4 grid gap-[0.85rem] max-[760px]:mt-[0.8rem]">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-[0.85rem] max-[760px]:grid-cols-1">
              <label className={labelClass}>
                Targa
                <input
                  type="text"
                  name="plate"
                  value={formData.plate}
                  onChange={handleChange}
                  placeholder="Es. AB123CD"
                  className={`${inputClass} ${
                    errors.plate ? errorInputClass : ""
                  }`}
                />
                {errors.plate && (
                  <span className={fieldErrorClass}>{errors.plate}</span>
                )}
              </label>

              <button
                type="button"
                className={`${primaryButtonClass} max-[760px]:w-full`}
                onClick={handlePlateLookup}
                disabled={isPlateLookupLoading || isSubmitting}
              >
                {isPlateLookupLoading ? "Ricerca..." : "Cerca dati"}
              </button>
            </div>

            {plateLookupError && (
              <p className={formErrorClass} role="alert">
                {plateLookupError}
              </p>
            )}

            {plateLookupData && (
              <div className="grid gap-4 rounded-[var(--radius-lg)] border border-blue-600/15 bg-blue-100/50 p-4 dark:bg-blue-950/25 max-[760px]:rounded-[15px] max-[760px]:p-[0.85rem]">
                <div>
                  <h3 className="m-0 font-bold text-[var(--color-text)]">
                    Assistente scadenze da targa
                  </h3>
                  <p className="mt-[0.35rem] mb-0 leading-6 text-[var(--color-text-muted)]">
                    {plateLookupData.message}
                  </p>
                </div>

                <p className="m-0 leading-6 text-[var(--color-text-muted)]">
                  <strong>Targa verificata:</strong> {plateLookupData.plate}
                </p>

                <div className="grid gap-[0.85rem]">
                  <div className="grid gap-3 rounded-[var(--radius-md)] border border-slate-400/20 bg-[var(--color-surface)] p-4 max-[760px]:rounded-[14px] max-[760px]:p-[0.85rem]">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] font-extrabold text-[var(--color-primary-soft-text)]">
                        1
                      </span>
                      <div>
                        <h4 className="m-0 font-bold text-[var(--color-text)]">
                          {plateLookupData.tax.label}
                        </h4>
                        <p className="m-0 text-[0.9rem] leading-[1.45] text-[var(--color-text-muted)]">
                          {plateLookupData.tax.message}
                        </p>
                      </div>
                    </div>

                    {plateLookupData.tax.officialUrl && (
                      <a
                        href={plateLookupData.tax.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-fit font-extrabold text-[var(--color-primary)] underline-offset-4 hover:underline"
                      >
                        Apri servizio ACI
                      </a>
                    )}

                    <label className={labelClass}>
                      Scadenza bollo trovata
                      <input
                        type="date"
                        value={assistedDeadlines.scadenza_bollo}
                        onChange={(event) =>
                          handleAssistedDeadlineChange(
                            "scadenza_bollo",
                            event.target.value
                          )
                        }
                        className={inputClass}
                      />
                    </label>
                  </div>

                  <div className="grid gap-3 rounded-[var(--radius-md)] border border-slate-400/20 bg-[var(--color-surface)] p-4 max-[760px]:rounded-[14px] max-[760px]:p-[0.85rem]">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] font-extrabold text-[var(--color-primary-soft-text)]">
                        2
                      </span>
                      <div>
                        <h4 className="m-0 font-bold text-[var(--color-text)]">
                          {plateLookupData.insurance.label}
                        </h4>
                        <p className="m-0 text-[0.9rem] leading-[1.45] text-[var(--color-text-muted)]">
                          {plateLookupData.insurance.message}
                        </p>
                      </div>
                    </div>

                    {plateLookupData.insurance.officialUrl && (
                      <a
                        href={plateLookupData.insurance.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-fit font-extrabold text-[var(--color-primary)] underline-offset-4 hover:underline"
                      >
                        Apri verifica RCA
                      </a>
                    )}

                    <label className={labelClass}>
                      Scadenza assicurazione trovata
                      <input
                        type="date"
                        value={assistedDeadlines.scadenza_assicurazione}
                        onChange={(event) =>
                          handleAssistedDeadlineChange(
                            "scadenza_assicurazione",
                            event.target.value
                          )
                        }
                        className={inputClass}
                      />
                    </label>
                  </div>

                  <div className="grid gap-3 rounded-[var(--radius-md)] border border-slate-400/20 bg-[var(--color-surface)] p-4 max-[760px]:rounded-[14px] max-[760px]:p-[0.85rem]">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] font-extrabold text-[var(--color-primary-soft-text)]">
                        3
                      </span>
                      <div>
                        <h4 className="m-0 font-bold text-[var(--color-text)]">
                          {plateLookupData.inspection.label}
                        </h4>
                        <p className="m-0 text-[0.9rem] leading-[1.45] text-[var(--color-text-muted)]">
                          {plateLookupData.inspection.message}
                        </p>
                      </div>
                    </div>

                    {plateLookupData.inspection.officialUrl && (
                      <a
                        href={plateLookupData.inspection.officialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-fit font-extrabold text-[var(--color-primary)] underline-offset-4 hover:underline"
                      >
                        Apri verifica revisione
                      </a>
                    )}

                    <label className={labelClass}>
                      Scadenza revisione trovata
                      <input
                        type="date"
                        value={assistedDeadlines.scadenza_revisione}
                        onChange={(event) =>
                          handleAssistedDeadlineChange(
                            "scadenza_revisione",
                            event.target.value
                          )
                        }
                        className={inputClass}
                      />
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  className={`${primaryButtonClass} w-fit max-[760px]:w-full`}
                  onClick={handleApplyAssistedDeadlines}
                  disabled={!hasAssistedDeadlines || isSubmitting}
                >
                  Applica scadenze al form
                </button>

                {assistedDeadlinesApplied && (
                  <p className="m-0 font-bold text-[var(--color-success-text)]">
                    Scadenze applicate al form. Ora puoi salvare il veicolo e
                    My Garage ti avviserà prima delle prossime scadenze.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        <section className={sectionClass}>
          <div className={sectionHeaderClass}>
            <span className={sectionIconClass}>2</span>
            <div>
              <h3 className={sectionTitleClass}>Scadenze</h3>
              <p className={sectionDescriptionClass}>
                Inserisci le date principali da monitorare.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 max-[760px]:grid-cols-1">
            <label className={labelClass}>
              Revisione
              <input
                type="date"
                name="scadenza_revisione"
                value={formData.scadenza_revisione}
                onChange={handleChange}
                className={`${inputClass} ${
                  errors.scadenza_revisione ? errorInputClass : ""
                }`}
              />
              {errors.scadenza_revisione && (
                <span className={fieldErrorClass}>
                  {errors.scadenza_revisione}
                </span>
              )}
            </label>

            <label className={labelClass}>
              Bollo
              <input
                type="date"
                name="scadenza_bollo"
                value={formData.scadenza_bollo}
                onChange={handleChange}
                className={`${inputClass} ${
                  errors.scadenza_bollo ? errorInputClass : ""
                }`}
              />
              {errors.scadenza_bollo && (
                <span className={fieldErrorClass}>
                  {errors.scadenza_bollo}
                </span>
              )}
            </label>

            <label className={labelClass}>
              Assicurazione
              <input
                type="date"
                name="scadenza_assicurazione"
                value={formData.scadenza_assicurazione}
                onChange={handleChange}
                className={`${inputClass} ${
                  errors.scadenza_assicurazione ? errorInputClass : ""
                }`}
              />
              {errors.scadenza_assicurazione && (
                <span className={fieldErrorClass}>
                  {errors.scadenza_assicurazione}
                </span>
              )}
            </label>
          </div>
        </section>

        <section className={sectionClass}>
          <div className={sectionHeaderClass}>
            <span className={sectionIconClass}>3</span>
            <div>
              <h3 className={sectionTitleClass}>Foto veicolo</h3>
              <p className={sectionDescriptionClass}>
                Carica un’immagine dal dispositivo. Dimensione massima 5 MB.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_280px] items-stretch gap-4 max-[760px]:grid-cols-1">
            <label className={`${labelClass} min-h-full rounded-[var(--radius-lg)] border border-dashed border-slate-500/40 bg-gradient-to-br from-slate-50/90 to-slate-100/75 p-4 dark:from-slate-900/80 dark:to-slate-800/70`}>
              <span>Upload immagine</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className={`${inputClass} min-h-0 cursor-pointer p-[0.9rem]`}
              />
              {errors.img_url && (
                <span className={fieldErrorClass}>{errors.img_url}</span>
              )}
            </label>

            <div className="flex min-h-[180px] overflow-hidden rounded-[var(--radius-lg)] border border-slate-400/20 bg-slate-950/5 max-[760px]:min-h-[150px] max-[380px]:min-h-[135px]">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Anteprima veicolo"
                  className="block min-h-[180px] w-full object-cover max-[760px]:min-h-[150px] max-[380px]:min-h-[135px]"
                />
              ) : (
                <div className="grid min-h-[180px] w-full place-content-center text-center text-[var(--color-text-muted)] max-[760px]:min-h-[150px] max-[380px]:min-h-[135px]">
                  <span className="font-extrabold">Foto veicolo</span>
                  <small className="mt-1">Anteprima immagine</small>
                </div>
              )}
            </div>
          </div>
        </section>

        {submitError && (
          <p className={formErrorClass} role="alert">
            {submitError}
          </p>
        )}

        <div className="flex justify-end gap-[0.85rem] pt-4 max-[760px]:flex-col max-[760px]:gap-[0.65rem] max-[760px]:pt-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${primaryButtonClass} px-5 py-[0.8rem] max-[760px]:min-h-11 max-[760px]:w-full`}
          >
            {isSubmitting ? "Salvataggio..." : "Salva veicolo"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="min-h-[46px] cursor-pointer rounded-full border-0 bg-slate-500/10 px-5 py-[0.8rem] font-extrabold text-[var(--color-text)] transition-[transform,opacity,background-color] duration-200 hover:-translate-y-px hover:bg-slate-500/20 disabled:cursor-not-allowed disabled:opacity-65 max-[760px]:min-h-11 max-[760px]:w-full motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            Annulla
          </button>
        </div>
      </form>
    </div>
  );
}
