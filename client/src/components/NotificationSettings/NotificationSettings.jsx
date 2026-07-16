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
      if (!pushSupported) return;

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
        weeklyExpiryEmail: { enabled: nextEnabled },
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
        err.message ||
          "Errore durante la disattivazione delle notifiche push."
      );
    } finally {
      setIsPushSaving(false);
    }
  }

  const panelClass =
    "grid content-start gap-4 rounded-[22px] border border-slate-300/20 bg-white/78 p-5 shadow-[0_12px_28px_rgba(15,23,42,0.07)] dark:border-white/10 dark:bg-white/5 dark:shadow-[0_14px_30px_rgba(0,0,0,0.24)] max-[760px]:p-4";

  const statusClass = (active) =>
    active
      ? "inline-flex shrink-0 items-center rounded-full bg-green-500/12 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-green-700 dark:bg-green-400/12 dark:text-green-200"
      : "inline-flex shrink-0 items-center rounded-full bg-slate-500/12 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-slate-600 dark:bg-white/8 dark:text-slate-300";

  if (isLoading) {
    return (
      <section className="mx-auto my-8 w-[min(100%-2rem,980px)] rounded-[28px] border border-slate-300/20 bg-white/90 p-6 text-slate-900 shadow-[0_20px_50px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-slate-900/88 dark:text-slate-50">
        <span className="text-xs font-black uppercase tracking-[0.09em] text-blue-600 dark:text-blue-300">
          Avvisi scadenze
        </span>
        <h2 className="mt-2 mb-1">Impostazioni notifiche</h2>
        <p className="m-0 text-slate-500 dark:text-slate-300">
          Caricamento preferenze...
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto my-8 w-[min(100%-2rem,980px)] rounded-[28px] border border-slate-300/20 bg-white/90 p-6 text-slate-900 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/88 dark:text-slate-50 dark:shadow-[0_24px_58px_rgba(0,0,0,0.38)] max-[760px]:my-4 max-[760px]:w-[min(100%-1.5rem,600px)] max-[760px]:rounded-[22px] max-[760px]:p-4">
      <div className="mb-6">
        <span className="inline-flex text-xs font-black uppercase tracking-[0.09em] text-blue-600 dark:text-blue-300">
          Avvisi scadenze
        </span>
        <h2 className="mt-2 mb-0 text-[clamp(1.6rem,3vw,2.15rem)] font-black tracking-[-0.045em]">
          Impostazioni notifiche
        </h2>
        <p className="mt-2 mb-0 max-w-2xl leading-6 text-slate-500 dark:text-slate-300">
          Scegli come ricevere gli avvisi per bollo, assicurazione e revisione.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-[760px]:grid-cols-1">
        <section className={panelClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-flex rounded-full bg-blue-500/10 px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-[0.05em] text-blue-700 dark:bg-blue-300/10 dark:text-blue-200">
                Riepilogo settimanale
              </span>
              <h3 className="mt-2 mb-0 text-lg font-black">Email settimanali</h3>
            </div>
            <span className={statusClass(enabled)}>
              {enabled ? "Attive" : "Disattivate"}
            </span>
          </div>

          <p className="m-0 leading-6 text-slate-500 dark:text-slate-300">
            Ricevi una email riepilogativa se ci sono scadenze già superate o
            in arrivo entro 30 giorni.
          </p>

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-blue-500/15 bg-blue-50/75 p-4 transition hover:-translate-y-px hover:border-blue-500/25 dark:border-blue-300/15 dark:bg-blue-300/8 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
            <input
              type="checkbox"
              className="mt-1 size-4 accent-blue-600"
              checked={enabled}
              onChange={handleToggleChange}
              disabled={isSaving}
            />
            <span className="font-extrabold leading-6 text-slate-700 dark:text-slate-200">
              Ricevi il riepilogo email settimanale
            </span>
          </label>

          <p className="m-0 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Le email sono un promemoria periodico, non un avviso immediato.
          </p>

          {isSaving && <p className="m-0 font-bold text-slate-500">Salvataggio...</p>}
          {message && <p className="m-0 font-bold text-green-700 dark:text-green-300">{message}</p>}
          {error && <p className="m-0 font-bold text-red-700 dark:text-red-300">{error}</p>}
        </section>

        <section className={panelClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-flex rounded-full bg-blue-500/10 px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-[0.05em] text-blue-700 dark:bg-blue-300/10 dark:text-blue-200">
                Controllo giornaliero
              </span>
              <h3 className="mt-2 mb-0 text-lg font-black">Push giornaliere</h3>
            </div>
            <span className={statusClass(isPushEnabled)}>
              {isPushEnabled ? "Attive" : "Disattivate"}
            </span>
          </div>

          <p className="m-0 leading-6 text-slate-500 dark:text-slate-300">
            Ricevi al massimo una notifica push al giorno in presenza di
            scadenze importanti.
          </p>

          <div className="grid gap-2 rounded-2xl bg-slate-900/5 p-4 dark:bg-slate-950/35">
            <p className="m-0 text-sm leading-6 text-slate-500 dark:text-slate-300">
              Le push valgono solo per questo browser e dispositivo.
            </p>
            <p className="m-0 text-sm leading-6 text-slate-500 dark:text-slate-300">
              Su iPhone potrebbe essere necessario aggiungere My Garage alla
              schermata Home.
            </p>
          </div>

          {!pushSupported ? (
            <p className="m-0 font-bold text-red-700 dark:text-red-300">
              Questo browser non supporta le notifiche push.
            </p>
          ) : (
            <button
              type="button"
              className="min-h-11 w-fit rounded-full bg-blue-600 px-4 py-3 font-extrabold text-white shadow-[0_10px_22px_rgba(37,99,235,0.22)] transition hover:-translate-y-px hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 motion-reduce:transition-none max-[760px]:w-full"
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

          {pushMessage && <p className="m-0 font-bold text-green-700 dark:text-green-300">{pushMessage}</p>}
          {pushError && <p className="m-0 font-bold text-red-700 dark:text-red-300">{pushError}</p>}
        </section>
      </div>
    </section>
  );
}

export default NotificationSettings;
