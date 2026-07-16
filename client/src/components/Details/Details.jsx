import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import ThemeContext from "../../context/ThemeContext";
import DeleteConfirmationModal from "../DeleteConfirmationModal/DeleteConfirmationModal";
import { formatDateForInput } from "../../utils/vehicleDates";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const statusStyles = {
  expired: {
    box: "bg-[var(--color-danger-soft)] dark:bg-red-500/15",
    dot:
      "bg-[var(--color-danger)] shadow-[0_0_0_5px_rgba(220,38,38,0.16)]",
  },
  expiring: {
    box: "bg-[var(--color-warning-soft)] dark:bg-amber-500/15",
    dot:
      "bg-[var(--color-warning)] shadow-[0_0_0_5px_rgba(245,158,11,0.16)]",
  },
  ok: {
    box: "bg-[var(--color-success-soft)] dark:bg-green-500/15",
    dot:
      "bg-[var(--color-success)] shadow-[0_0_0_5px_rgba(22,163,74,0.14)]",
  },
};

const deadlineStyles = {
  expired:
    "border-red-600/20 bg-red-100/70 dark:border-red-400/30 dark:bg-red-500/15",
  expiring:
    "border-amber-500/25 bg-amber-100/80 dark:border-amber-300/30 dark:bg-amber-500/15",
  ok:
    "border-green-600/20 bg-green-100/70 dark:border-green-300/25 dark:bg-green-500/10",
};

const deadlineBadgeStyles = {
  expired:
    "bg-[var(--color-danger-soft)] text-[var(--color-danger-text)] dark:bg-red-500/20 dark:text-red-200",
  expiring:
    "bg-[var(--color-warning-soft)] text-[var(--color-warning-text)] dark:bg-amber-500/20 dark:text-amber-200",
  ok:
    "bg-[var(--color-success-soft)] text-[var(--color-success-text)] dark:bg-green-500/20 dark:text-green-200",
};

const surfaceClasses =
  "rounded-[var(--radius-xl)] border border-slate-400/20 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(248,250,252,0.94)),var(--color-surface)] shadow-[var(--shadow-md),inset_0_1px_0_rgba(255,255,255,0.78)] dark:border-slate-400/15 dark:bg-[linear-gradient(145deg,rgba(30,41,59,0.98),rgba(15,23,42,0.96)),#0f172a] dark:shadow-[0_18px_38px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.06)] max-[600px]:rounded-[18px]";

const inputClasses =
  "w-full rounded-[var(--radius-md)] border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-blue-600 focus:outline-2 focus:outline-blue-300 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-50";

function validateDetailsForm({ revision, bollo, insurance }) {
  const newErrors = {};

  if (!revision) {
    newErrors.revision = "Inserisci la scadenza della revisione.";
  }

  if (!bollo) {
    newErrors.bollo = "Inserisci la scadenza del bollo.";
  }

  if (!insurance) {
    newErrors.insurance = "Inserisci la scadenza dell'assicurazione.";
  }

  return newErrors;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Errore durante la lettura del file."));
    reader.readAsDataURL(file);
  });
}

function getVehicleStatus(vehicle) {
  if (
    vehicle.expired_car_tax ||
    vehicle.expired_insurance ||
    vehicle.expired_revision
  ) {
    return {
      label: "Scadenze da gestire",
      tone: "expired",
      description: "Almeno una scadenza risulta superata.",
    };
  }

  if (
    vehicle.expiring_car_tax ||
    vehicle.expiring_insurance ||
    vehicle.expiring_revision
  ) {
    return {
      label: "In scadenza",
      tone: "expiring",
      description: "Almeno una scadenza è vicina.",
    };
  }

  return {
    label: "Tutto ok",
    tone: "ok",
    description: "Le scadenze principali sono sotto controllo.",
  };
}

function getDeadlineStatus(vehicle, type) {
  const statusMap = {
    revision: {
      expired: vehicle.expired_revision,
      expiring: vehicle.expiring_revision,
    },
    bollo: {
      expired: vehicle.expired_car_tax,
      expiring: vehicle.expiring_car_tax,
    },
    insurance: {
      expired: vehicle.expired_insurance,
      expiring: vehicle.expiring_insurance,
    },
  };

  if (statusMap[type].expired) {
    return {
      label: "Scaduta",
      tone: "expired",
    };
  }

  if (statusMap[type].expiring) {
    return {
      label: "In scadenza",
      tone: "expiring",
    };
  }

  return {
    label: "Ok",
    tone: "ok",
  };
}

export default function Details({ vehicle, onUpdate, onDelete }) {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [revision, setRevision] = useState(vehicle.scadenza_revisione || "");
  const [bollo, setBollo] = useState(vehicle.scadenza_bollo || "");
  const [insurance, setInsurance] = useState(
    vehicle.scadenza_assicurazione || ""
  );
  const [imagePreview, setImagePreview] = useState(vehicle.img_url || "");
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const vehicleStatus = getVehicleStatus(vehicle);

  const deadlines = [
    {
      id: "revision",
      title: "Revisione",
      value: revision,
      error: errors.revision,
      onChange: (value) => handleFieldChange("revision", value),
      status: getDeadlineStatus(vehicle, "revision"),
    },
    {
      id: "bollo",
      title: "Bollo",
      value: bollo,
      error: errors.bollo,
      onChange: (value) => handleFieldChange("bollo", value),
      status: getDeadlineStatus(vehicle, "bollo"),
    },
    {
      id: "insurance",
      title: "Assicurazione",
      value: insurance,
      error: errors.insurance,
      onChange: (value) => handleFieldChange("insurance", value),
      status: getDeadlineStatus(vehicle, "insurance"),
    },
  ];

  useEffect(() => {
    setRevision(vehicle.scadenza_revisione || "");
    setBollo(vehicle.scadenza_bollo || "");
    setInsurance(vehicle.scadenza_assicurazione || "");
    setImagePreview(vehicle.img_url || "");
    setErrors({});
    setImageError("");
    setSuccessMessage("");
    setShowDeleteModal(false);
    setIsSaving(false);
  }, [vehicle]);

  const handleFieldChange = (fieldName, value) => {
    setSuccessMessage("");

    if (fieldName === "revision") {
      setRevision(value);
    }

    if (fieldName === "bollo") {
      setBollo(value);
    }

    if (fieldName === "insurance") {
      setInsurance(value);
    }

    if (errors[fieldName]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: "",
      }));
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    setSuccessMessage("");
    setImageError("");

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setImageError("Seleziona un file immagine valido.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setImageError("L'immagine non può superare i 5 MB.");
      event.target.value = "";
      return;
    }

    try {
      const imageDataUrl = await readFileAsDataUrl(file);
      setImagePreview(imageDataUrl);
    } catch {
      setImageError("Non è stato possibile caricare l'immagine.");
      event.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setImageError("");
    setSuccessMessage("");
  };

  const handleRenew = async () => {
    const validationErrors = validateDetailsForm({
      revision,
      bollo,
      insurance,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccessMessage("");
      return;
    }

    if (imageError) {
      setSuccessMessage("");
      return;
    }

    const updatedVehicle = {
      ...vehicle,
      img_url: imagePreview,
      scadenza_revisione: revision,
      scadenza_bollo: bollo,
      scadenza_assicurazione: insurance,
    };

    setIsSaving(true);
    setErrors((prevErrors) => ({ ...prevErrors, submit: "" }));

    try {
      await onUpdate(updatedVehicle);
      navigate("/", { replace: true });
    } catch {
      setErrors((prevErrors) => ({
        ...prevErrors,
        submit:
          "Non è stato possibile salvare le modifiche. Controlla la connessione e riprova.",
      }));
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    setErrors((prevErrors) => ({ ...prevErrors, submit: "" }));

    try {
      await onDelete(vehicle.id || vehicle._id);
      navigate("/");
    } catch {
      setErrors((prevErrors) => ({
        ...prevErrors,
        submit:
          "Non è stato possibile eliminare il veicolo. Controlla la connessione e riprova.",
      }));
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <main className="mx-auto w-[min(100%,1120px)] px-4 pt-6 pb-10 text-[var(--color-text)] motion-safe:animate-[details-fade-up_0.35s_ease_both] dark:text-slate-50 motion-reduce:animate-none max-[600px]:px-[0.6rem] max-[600px]:pt-[0.8rem] max-[600px]:pb-7 max-[380px]:px-[0.45rem]">
        <section className="mb-4 grid grid-cols-[minmax(0,1fr)_minmax(280px,420px)] items-stretch gap-4 max-[960px]:grid-cols-1 max-[600px]:mb-3 max-[600px]:gap-3">
          <div
            className={`${surfaceClasses} relative isolate flex min-h-[280px] flex-col justify-center overflow-hidden p-[clamp(1.25rem,3vw,2rem)] before:absolute before:-right-[12%] before:-top-[45%] before:-z-10 before:h-[260px] before:w-[260px] before:rounded-full before:bg-blue-600/10 before:content-[''] dark:before:bg-blue-400/10 max-[960px]:min-h-0 max-[600px]:p-[0.9rem] max-[380px]:p-[0.8rem]`}
          >
            <span className="mb-3 w-fit rounded-full bg-[var(--color-primary-soft)] px-[0.65rem] py-[0.35rem] text-[0.75rem] font-black tracking-[0.08em] text-[var(--color-primary-soft-text)] uppercase dark:bg-blue-400/20 dark:text-blue-100 max-[600px]:mb-[0.55rem] max-[600px]:px-[0.55rem] max-[600px]:py-[0.28rem] max-[600px]:text-[0.68rem]">
              Dettaglio veicolo
            </span>

            <h1 className="m-0 text-[clamp(2rem,5vw,3.4rem)] leading-[0.95] font-bold tracking-[-0.06em] text-inherit max-[600px]:text-[clamp(1.65rem,10vw,2.15rem)] max-[600px]:leading-none">
              {vehicle.brand} {vehicle.model}
            </h1>

            <div
              className={`mt-5 flex w-fit max-w-full items-center gap-3 rounded-[var(--radius-lg)] px-[0.95rem] py-[0.8rem] max-[600px]:mt-[0.9rem] max-[600px]:w-full max-[600px]:items-start max-[600px]:gap-[0.6rem] max-[600px]:rounded-[15px] max-[600px]:px-[0.8rem] max-[600px]:py-[0.7rem] ${statusStyles[vehicleStatus.tone].box}`}
            >
              <span
                className={`h-[13px] w-[13px] shrink-0 rounded-full ${statusStyles[vehicleStatus.tone].dot}`}
                aria-hidden="true"
              />

              <div>
                <strong className="block text-[0.95rem] leading-[1.2] text-inherit">
                  {vehicleStatus.label}
                </strong>

                <p className="mt-[0.15rem] mb-0 text-[0.86rem] leading-[1.35] text-[var(--color-text-muted)] dark:text-slate-300">
                  {vehicleStatus.description}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`${surfaceClasses} flex min-h-[280px] items-center justify-center overflow-hidden p-4 max-[960px]:min-h-0 max-[600px]:p-[0.6rem]`}
          >
            {imagePreview ? (
              <img
                className="h-full max-h-80 w-full rounded-[var(--radius-lg)] border border-slate-400/20 object-cover shadow-[0_12px_26px_rgba(15,23,42,0.14)] dark:border-white/10 dark:shadow-[0_14px_30px_rgba(0,0,0,0.36)] max-[960px]:max-h-[360px] max-[600px]:max-h-[210px] max-[600px]:rounded-2xl max-[380px]:max-h-[185px]"
                src={imagePreview}
                alt={`${vehicle.brand} ${vehicle.model}`}
              />
            ) : (
              <div className="flex min-h-60 w-full flex-col items-center justify-center gap-[0.45rem] rounded-[var(--radius-lg)] border border-dashed border-slate-500/40 bg-[linear-gradient(145deg,rgba(248,250,252,0.92),rgba(241,245,249,0.76))] text-center text-[var(--color-text-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] dark:border-white/15 dark:bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] dark:text-slate-300 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] max-[600px]:min-h-[170px] max-[600px]:rounded-2xl max-[380px]:min-h-[150px]">
                <span
                  className="text-5xl drop-shadow-[0_6px_10px_rgba(15,23,42,0.12)]"
                  aria-hidden="true"
                >
                  {"\u{1F697}"}
                </span>

                <p className="m-0 text-[0.95rem] font-extrabold">
                  Nessuna foto disponibile
                </p>
              </div>
            )}
          </div>
        </section>

        {successMessage && (
          <p className="mb-4 rounded-[var(--radius-md)] bg-[var(--color-success-soft)] px-4 py-[0.85rem] font-extrabold text-[var(--color-success-text)] max-[600px]:mb-[0.85rem] max-[600px]:text-[0.95rem]">
            {successMessage}
          </p>
        )}

        {errors.submit && (
          <p
            className="mb-4 block rounded-[var(--radius-md)] bg-red-50 px-4 py-[0.85rem] text-[0.84rem] leading-[1.4] font-bold text-[var(--color-danger)] dark:bg-red-500/10 dark:text-red-300"
            role="alert"
          >
            {errors.submit}
          </p>
        )}

        <section className="mb-4 grid grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] gap-4 max-[960px]:grid-cols-1 max-[600px]:mb-3 max-[600px]:gap-3">
          <div className={`${surfaceClasses} p-[1.1rem] max-[600px]:p-[0.9rem] max-[380px]:p-[0.8rem]`}>
            <div className="mb-4 flex items-start gap-[0.8rem] max-[600px]:mb-[0.8rem] max-[600px]:gap-[0.65rem]">
              <span
                className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-[var(--radius-lg)] bg-[var(--color-primary-soft)] text-xl text-[var(--color-primary-soft-text)] dark:bg-blue-400/15 dark:text-blue-100 max-[600px]:h-[34px] max-[600px]:w-[34px] max-[600px]:rounded-xl max-[600px]:text-base"
                aria-hidden="true"
              >
                {"\u{1F4C5}"}
              </span>

              <div>
                <h2 className="m-0 text-xl leading-[1.15] font-bold tracking-[-0.03em] text-inherit max-[600px]:text-[1.12rem]">
                  Scadenze
                </h2>

                <p className="mt-1 mb-0 text-[0.9rem] leading-[1.4] text-[var(--color-text-muted)] dark:text-slate-300 max-[600px]:text-[0.86rem]">
                  Aggiorna le date principali del veicolo.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-[0.8rem] max-[960px]:grid-cols-1">
              {deadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className={`flex min-w-0 flex-col gap-[0.55rem] rounded-[20px] border p-[0.9rem] max-[600px]:gap-[0.45rem] max-[600px]:rounded-2xl max-[600px]:p-3 max-[380px]:p-[0.8rem] ${deadlineStyles[deadline.status.tone]}`}
                >
                  <div className="flex items-start justify-between gap-[0.65rem]">
                    <div>
                      <h3 className="mt-0 mb-[0.35rem] text-base leading-[1.2] font-bold text-inherit max-[600px]:text-[0.95rem]">
                        {deadline.title}
                      </h3>

                      <span
                        className={`inline-flex w-fit rounded-full px-[0.55rem] py-1 text-[0.68rem] font-black tracking-[0.06em] uppercase ${deadlineBadgeStyles[deadline.status.tone]}`}
                      >
                        {deadline.status.label}
                      </span>
                    </div>
                  </div>

                  <label
                    className="text-[0.82rem] font-black text-[var(--color-text-soft)] dark:text-slate-200"
                    htmlFor={`deadline-${deadline.id}`}
                  >
                    Data scadenza
                  </label>

                  <input
                    id={`deadline-${deadline.id}`}
                    type="date"
                    value={formatDateForInput(deadline.value)}
                    onChange={(event) => deadline.onChange(event.target.value)}
                    className={`${inputClasses} ${
                      deadline.error
                        ? "border-[var(--color-danger)] outline-[var(--color-danger)]"
                        : ""
                    }`}
                  />

                  {deadline.error && (
                    <span className="mt-[0.35rem] block text-[0.84rem] leading-[1.4] font-bold text-[var(--color-danger)] dark:text-red-300">
                      {deadline.error}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <aside className={`${surfaceClasses} p-[1.1rem] max-[600px]:p-[0.9rem] max-[380px]:p-[0.8rem]`}>
            <div className="mb-4 flex items-start gap-[0.8rem] max-[600px]:mb-[0.8rem] max-[600px]:gap-[0.65rem]">
              <span
                className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-[var(--radius-lg)] bg-[var(--color-primary-soft)] text-xl text-[var(--color-primary-soft-text)] dark:bg-blue-400/15 dark:text-blue-100 max-[600px]:h-[34px] max-[600px]:w-[34px] max-[600px]:rounded-xl max-[600px]:text-base"
                aria-hidden="true"
              >
                {"\u{1F5BC}\u{FE0F}"}
              </span>

              <div>
                <h2 className="m-0 text-xl leading-[1.15] font-bold tracking-[-0.03em] text-inherit max-[600px]:text-[1.12rem]">
                  Foto veicolo
                </h2>

                <p className="mt-1 mb-0 text-[0.9rem] leading-[1.4] text-[var(--color-text-muted)] dark:text-slate-300 max-[600px]:text-[0.86rem]">
                  Carica o sostituisci l’immagine del veicolo.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-[0.65rem]">
              <label
                className="text-[0.82rem] font-black text-[var(--color-text-soft)] dark:text-slate-200"
                htmlFor="vehicle-image"
              >
                Seleziona immagine
              </label>

              <input
                className="w-full rounded-[var(--radius-md)] border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-50"
                id="vehicle-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              <small className="text-[0.82rem] leading-[1.4] text-[var(--color-text-muted)] dark:text-slate-300">
                Dimensione massima: 5 MB.
              </small>

              {imagePreview && (
                <button
                  type="button"
                  className="w-full cursor-pointer rounded-[var(--radius-md)] border border-red-600/30 bg-red-100/80 px-[0.85rem] py-[0.7rem] font-black text-[var(--color-danger-text)] transition-[transform,box-shadow,background-color] duration-[var(--transition-fast)] hover:-translate-y-px hover:bg-red-200/90 hover:shadow-[0_8px_18px_rgba(239,68,68,0.12)] dark:border-red-400/35 dark:bg-red-500/15 dark:text-red-200 dark:hover:bg-red-500/20 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  onClick={handleRemoveImage}
                >
                  Rimuovi foto
                </button>
              )}

              {imageError && (
                <span className="mt-[0.35rem] block text-[0.84rem] leading-[1.4] font-bold text-[var(--color-danger)] dark:text-red-300">
                  {imageError}
                </span>
              )}
            </div>
          </aside>
        </section>

        <section className={`${surfaceClasses} flex items-center justify-between gap-4 p-4 max-[960px]:flex-col max-[960px]:items-stretch max-[600px]:p-[0.9rem] max-[380px]:p-[0.8rem]`}>
          <div>
            <h2 className="m-0 text-xl leading-[1.15] font-bold tracking-[-0.03em] text-inherit max-[600px]:text-[1.12rem]">
              Azioni
            </h2>

            <p className="mt-1 mb-0 text-[0.9rem] leading-[1.4] text-[var(--color-text-muted)] dark:text-slate-300 max-[600px]:text-[0.86rem]">
              Salva le modifiche o elimina il veicolo dal garage.
            </p>
          </div>

          <div className="flex shrink-0 gap-3 max-[960px]:w-full max-[600px]:flex-col">
            <button
              type="button"
              className="cursor-pointer rounded-[var(--radius-md)] border-0 bg-[var(--color-primary)] px-4 py-3 font-black text-white shadow-[0_8px_18px_rgba(37,99,235,0.2)] transition-[transform,box-shadow,background-color] duration-[var(--transition-fast)] hover:-translate-y-0.5 hover:bg-[var(--color-primary-hover)] hover:shadow-[0_12px_24px_rgba(37,99,235,0.26)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 dark:bg-blue-600 dark:text-slate-50 dark:hover:bg-blue-700 motion-reduce:transition-none motion-reduce:hover:translate-y-0 max-[960px]:flex-1 max-[600px]:min-h-11 max-[600px]:w-full max-[600px]:text-base"
              onClick={handleRenew}
              disabled={isSaving}
            >
              {isSaving ? "Salvataggio..." : "\u{1F4BE} Salva modifiche"}
            </button>

            <button
              type="button"
              className="cursor-pointer rounded-[var(--radius-md)] border-0 bg-[var(--color-danger)] px-4 py-3 font-black text-white shadow-[0_8px_18px_rgba(239,68,68,0.22)] transition-[transform,box-shadow,background-color] duration-[var(--transition-fast)] hover:-translate-y-0.5 hover:bg-[var(--color-danger-hover)] hover:shadow-[0_12px_24px_rgba(239,68,68,0.28)] dark:bg-red-700 dark:hover:bg-red-800 motion-reduce:transition-none motion-reduce:hover:translate-y-0 max-[960px]:flex-1 max-[600px]:min-h-11 max-[600px]:w-full max-[600px]:text-base"
              onClick={openDeleteModal}
            >
              {"\u{1F5D1}\u{FE0F} Elimina"}
            </button>
          </div>
        </section>
      </main>

      {showDeleteModal && (
        <DeleteConfirmationModal
          isDarkMode={isDarkMode}
          vehicleName={`${vehicle.brand} ${vehicle.model}`}
          onCancel={closeDeleteModal}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}
