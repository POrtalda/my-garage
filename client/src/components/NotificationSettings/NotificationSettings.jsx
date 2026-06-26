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
      if (!isPushSupported()) {
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
  }, []);

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
      setMessage("Preferenze notifiche aggiornate.");
    } catch (err) {
      setEnabled(previousEnabled);
      setError(
        err.message ||
          "Non è stato possibile aggiornare le preferenze notifiche."
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
      setPushMessage("Notifiche push attivate su questo dispositivo.");
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
      setPushMessage("Notifiche push disattivate su questo dispositivo.");
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
        <h2>Impostazioni notifiche</h2>
        <p>
          Scegli come ricevere gli avvisi per le scadenze dei tuoi veicoli.
        </p>
      </div>

      <section className="notification-settings__card">
        <div>
          <h3>Email settimanali</h3>
          <p>
            Ricevi il riepilogo settimanale via email per scadenze già scadute o
            in arrivo entro 30 giorni.
          </p>
        </div>

        <label className="notification-settings__option">
          <input
            type="checkbox"
            checked={enabled}
            onChange={handleToggleChange}
            disabled={isSaving}
          />
          <span>
            Ricevi email settimanali per scadenze scadute o in arrivo entro 30
            giorni
          </span>
        </label>

        {isSaving && (
          <p className="notification-settings__status">Salvataggio...</p>
        )}

        {message && (
          <p className="notification-settings__success">{message}</p>
        )}

        {error && <p className="notification-settings__error">{error}</p>}
      </section>

      <section className="notification-settings__card">
        <div>
          <h3>Notifiche su questo dispositivo</h3>
          <p>
            Ricevi notifiche browser su PC o smartphone quando ci sono scadenze
            importanti da controllare.
          </p>
        </div>

        {!isPushSupported() ? (
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
                ? "Disattiva notifiche su questo dispositivo"
                : "Attiva notifiche su questo dispositivo"}
          </button>
        )}

        {pushMessage && (
          <p className="notification-settings__success">{pushMessage}</p>
        )}

        {pushError && (
          <p className="notification-settings__error">{pushError}</p>
        )}
      </section>
    </section>
  );
}

export default NotificationSettings;
