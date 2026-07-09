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
import "./NotificationSettings.css";

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
      <section className="notification-settings">
        <h2>Impostazioni notifiche</h2>
        <p>Caricamento preferenze...</p>
      </section>
    );
  }

  return (
    <section className="notification-settings">
      <div className="notification-settings__header">
        <span className="notification-settings__eyebrow">Avvisi scadenze</span>
        <h2>Impostazioni notifiche</h2>
        <p>
          Scegli come ricevere gli avvisi per bollo, assicurazione e revisione
          dei tuoi veicoli.
        </p>
      </div>

      <div className="notification-settings__grid">
        <section className="notification-settings__card">
          <div className="notification-settings__card-header">
            <div>
              <span className="notification-settings__badge">
                Riepilogo settimanale
              </span>
              <h3>Email settimanali</h3>
            </div>

            <span
              className={
                enabled
                  ? "notification-settings__state notification-settings__state--on"
                  : "notification-settings__state notification-settings__state--off"
              }
            >
              {enabled ? "Attive" : "Disattivate"}
            </span>
          </div>

          <p>
            Ricevi una email riepilogativa una volta a settimana se ci sono
            scadenze già superate o in arrivo entro 30 giorni.
          </p>

          <label className="notification-settings__option">
            <input
              type="checkbox"
              checked={enabled}
              onChange={handleToggleChange}
              disabled={isSaving}
            />
            <span>Ricevi il riepilogo email settimanale</span>
          </label>

          <p className="notification-settings__hint">
            Le email sono pensate come promemoria periodico, non come avviso
            immediato.
          </p>

          {isSaving && (
            <p className="notification-settings__status">Salvataggio...</p>
          )}

          {message && (
            <p className="notification-settings__success">{message}</p>
          )}

          {error && <p className="notification-settings__error">{error}</p>}
        </section>

        <section className="notification-settings__card">
          <div className="notification-settings__card-header">
            <div>
              <span className="notification-settings__badge">
                Controllo giornaliero
              </span>
              <h3>Push giornaliere</h3>
            </div>

            <span
              className={
                isPushEnabled
                  ? "notification-settings__state notification-settings__state--on"
                  : "notification-settings__state notification-settings__state--off"
              }
            >
              {isPushEnabled ? "Attive" : "Disattivate"}
            </span>
          </div>

          <p>
            Ricevi al massimo una notifica push al giorno se ci sono veicoli con
            scadenze scadute o in arrivo.
          </p>

          <div className="notification-settings__info">
            <p>
              Le push valgono solo per questo browser e dispositivo. Se le
              attivi sul PC, non sono automaticamente attive anche sullo
              smartphone.
            </p>
            <p>
              Su Android puoi attivarle dal browser. Su iPhone potrebbe essere
              necessario aggiungere My Garage alla schermata Home e aprirlo da
              lì.
            </p>
          </div>

          {!pushSupported ? (
            <p className="notification-settings__error">
              Questo browser non supporta le notifiche push.
            </p>
          ) : (
            <button
              type="button"
              className="notification-settings__button"
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
            <p className="notification-settings__success">{pushMessage}</p>
          )}

          {pushError && (
            <p className="notification-settings__error">{pushError}</p>
          )}
        </section>
      </div>
    </section>
  );
}

export default NotificationSettings;
