import { useEffect, useState } from "react";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "../../services/notificationPreferencesApi";
import {
  disablePushNotifications,
  enablePushNotifications,
  getCurrentPushSubscription,
  isPushSupported,
} from "../../utils/pushNotifications";

function NotificationSettings() {
  const [enabled, setEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [isPushSaving, setIsPushSaving] = useState(false);
  const [pushMessage, setPushMessage] = useState("");
  const [pushError, setPushError] = useState("");

  const pushSupported = isPushSupported();

  useEffect(() => {
    async function loadPreferences() {
      try {
        setIsLoading(true);
        setError("");

        const data = await getNotificationPreferences();

        setEnabled(data.notifications?.weeklyExpiryEmail?.enabled !== false);
      } catch (err) {
        setError(
          err.message ||
          "Non è stato possibile caricare le preferenze notifiche."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadPreferences();
  }, []);

  useEffect(() => {
    async function checkPushSubscription() {
      if (!pushSupported) {
        return;
      }

      try {
        const subscription = await getCurrentPushSubscription();
        setIsPushEnabled(Boolean(subscription));
      } catch (err) {
        setPushError(
          err.message ||
          "Non è stato possibile verificare lo stato delle notifiche push."
        );
      }
    }

    checkPushSubscription();
  }, [pushSupported]);

  async function handleToggleChange(event) {
    const nextEnabled = event.target.checked;
    const previousEnabled = enabled;

    setEnabled(nextEnabled);
    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const data = await updateNotificationPreferences({
        weeklyExpiryEmail: {
          enabled: nextEnabled,
        },
      });

      setEnabled(data.notifications?.weeklyExpiryEmail?.enabled !== false);
      setMessage("Preferenze email aggiornate.");
    } catch (err) {
      setEnabled(previousEnabled);
      setError(
        err.message ||
        "Non è stato possibile aggiornare le preferenze email."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleEnablePush() {
    setIsPushSaving(true);
    setPushError("");
    setPushMessage("");

    try {
      await enablePushNotifications();
      setIsPushEnabled(true);
      setPushMessage("Push giornaliere attivate su questo dispositivo.");
    } catch (err) {
      setPushError(
        err.message || "Errore durante l'attivazione delle notifiche push."
      );
    } finally {
      setIsPushSaving(false);
    }
  }

  async function handleDisablePush() {
    setIsPushSaving(true);
    setPushError("");
    setPushMessage("");

    try {
      await disablePushNotifications();
      setIsPushEnabled(false);
      setPushMessage("Push giornaliere disattivate su questo dispositivo.");
    } catch (err) {
      setPushError(
        err.message || "Errore durante la disattivazione delle notifiche push."
      );
    } finally {
      setIsPushSaving(false);
    }
  }

  if (isLoading) {
    return (
      <section className="mx-auto my-8 w-[min(920px,calc(100%-2rem))] rounded-3xl border border-slate-200/70 bg-white/95 p-6 text-slate-900 shadow-xl dark:border-white/10 dark:bg-slate-900/95 dark:text-slate-50 max-[760px]:my-3 max-[760px]:w-[calc(100%-1rem)] max-[760px]:rounded-2xl max-[760px]:p-4">
        <h2>Impostazioni notifiche</h2>
        <p>Caricamento preferenze...</p>
      </section>
    );
  }

  return (
    <section className="mx-auto my-8 w-[min(920px,calc(100%-2rem))] rounded-3xl border border-slate-200/70 bg-white/95 p-6 text-slate-900 shadow-xl dark:border-white/10 dark:bg-slate-900/95 dark:text-slate-50 max-[760px]:my-3 max-[760px]:w-[calc(100%-1rem)] max-[760px]:rounded-2xl max-[760px]:p-4">
      <div className="mb-5 max-[760px]:mb-4">
        <span className="mb-2 inline-flex text-xs font-black uppercase tracking-[0.08em] text-blue-600 dark:text-blue-300">
          Avvisi scadenze
        </span>

        <h2 className="m-0 text-[clamp(1.55rem,3vw,2rem)] font-bold leading-tight tracking-[-0.04em] max-[760px]:text-xl">
          Impostazioni notifiche
        </h2>

        <p className="mt-2 max-w-2xl leading-6 text-slate-500 dark:text-slate-300 max-[760px]:text-sm">
          Scegli come ricevere gli avvisi per bollo, assicurazione e revisione
          dei tuoi veicoli.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-[760px]:grid-cols-1">
        <section className="grid content-start gap-4 rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-inner dark:border-white/10 dark:bg-white/5 max-[760px]:gap-3 max-[760px]:rounded-xl max-[760px]:p-3.5">
          <div className="flex items-start justify-between gap-3.5 max-[760px]:flex-col">
            <div>
              <span className="inline-flex w-fit rounded-full bg-blue-600/10 px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-[0.04em] text-blue-600 dark:bg-blue-400/15 dark:text-blue-200">
                Riepilogo settimanale
              </span>
              <h3 className="mt-1.5 text-lg font-bold tracking-tight">
                Email settimanali
              </h3>
            </div>

            <span
              className={
                enabled
                  ? "inline-flex shrink-0 items-center justify-center rounded-full bg-green-500/15 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-green-700 dark:bg-green-500/20 dark:text-green-300"
                  : "inline-flex shrink-0 items-center justify-center rounded-full bg-slate-500/15 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-slate-600 dark:bg-slate-400/15 dark:text-slate-300"
              }
            >
              {enabled ? "Attive" : "Disattivate"}
            </span>
          </div>

          <p className="leading-6 text-slate-500 dark:text-slate-300">
            Ricevi una email riepilogativa una volta a settimana se ci sono
            scadenze già superate o in arrivo entro 30 giorni.
          </p>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-blue-600/15 bg-blue-100/50 p-4 transition hover:-translate-y-px hover:border-blue-600/25 hover:bg-blue-100/70 hover:shadow-md dark:border-blue-300/20 dark:bg-blue-400/10 dark:hover:border-blue-300/30 dark:hover:bg-blue-400/15 max-[760px]:gap-2.5 max-[760px]:rounded-xl max-[760px]:p-3.5">
            <input
              type="checkbox"
              className="mt-1 scale-110 accent-blue-600"
              checked={enabled}
              onChange={handleToggleChange}
              disabled={isSaving}
            />
            <span className="font-extrabold leading-6 text-slate-700 dark:text-slate-200 max-[760px]:text-sm">
              Ricevi il riepilogo email settimanale
            </span>
          </label>

          <p className="text-sm leading-6 text-slate-500 dark:text-slate-300">
            Le email sono pensate come promemoria periodico, non come avviso
            immediato.
          </p>

          {isSaving && (
            <p className="font-extrabold leading-6 text-slate-500 dark:text-slate-300">Salvataggio...</p>
          )}

          {message && (
            <p className="font-extrabold leading-6 text-green-700 dark:text-green-300">
              {message}
            </p>
          )}

          {error && (
            <p className="font-extrabold leading-6 text-red-700 dark:text-red-300">
              {error}
            </p>
          )}
        </section>

        <section className="grid content-start gap-4 rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-inner dark:border-white/10 dark:bg-white/5 max-[760px]:gap-3 max-[760px]:rounded-xl max-[760px]:p-3.5">
          <div className="flex items-start justify-between gap-3.5 max-[760px]:flex-col">
            <div>
              <span className="inline-flex w-fit rounded-full bg-blue-600/10 px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-[0.04em] text-blue-600 dark:bg-blue-400/15 dark:text-blue-200">
                Controllo giornaliero
              </span>
              <h3 className="mt-1.5 text-lg font-bold tracking-tight">
                Push giornaliere
              </h3>
            </div>

            <span
              className={
                isPushEnabled
                  ? "inline-flex shrink-0 items-center justify-center rounded-full bg-green-500/15 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-green-700 dark:bg-green-500/20 dark:text-green-300"
                  : "inline-flex shrink-0 items-center justify-center rounded-full bg-slate-500/15 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-slate-600 dark:bg-slate-400/15 dark:text-slate-300"
              }
            >
              {isPushEnabled ? "Attive" : "Disattivate"}
            </span>
          </div>

          <p className="leading-6 text-slate-500 dark:text-slate-300">
            Ricevi al massimo una notifica push al giorno se ci sono veicoli con
            scadenze scadute o in arrivo.
          </p>

          <div className="grid gap-2 rounded-xl bg-slate-900/5 p-3.5 dark:bg-slate-950/35">
            <p className="text-sm leading-6 text-slate-500 dark:text-slate-300">
              Le push valgono solo per questo browser e dispositivo. Se le
              attivi sul PC, non sono automaticamente attive anche sullo
              smartphone.
            </p>
            <p className="text-sm leading-6 text-slate-500 dark:text-slate-300">
              Su Android puoi attivarle dal browser. Su iPhone potrebbe essere
              necessario aggiungere My Garage alla schermata Home e aprirlo da
              lì.
            </p>
          </div>

          {!pushSupported ? (
            <p className="font-extrabold leading-6 text-red-700 dark:text-red-300">
              Questo browser non supporta le notifiche push.
            </p>
          ) : (
            <button
              type="button"
              className="min-h-11 w-fit rounded-full border-0 bg-blue-600 px-4 py-3 font-extrabold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-px hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 max-[760px]:w-full"
              onClick={isPushEnabled ? handleDisablePush : handleEnablePush}
              disabled={isPushSaving}
            >
              {isPushSaving
                ? "Salvataggio..."
                : isPushEnabled
                  ? "Disattiva push su questo dispositivo"
                  : "Attiva push su questo dispositivo"}
            </button>
          )}

          {pushMessage && (
            <p className="font-extrabold leading-6 text-green-700 dark:text-green-300">{pushMessage}</p>
          )}

          {pushError && (
            <p className="font-extrabold leading-6 text-red-700 dark:text-red-300">{pushError}</p>
          )}
        </section>
      </div>
    </section>
  );
}

export default NotificationSettings;
