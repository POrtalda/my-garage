import { useEffect, useState } from "react";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "../../services/notificationPreferencesApi";
import "./NotificationSettings.css";

function NotificationSettings() {
  const [enabled, setEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
          Scegli se ricevere il riepilogo settimanale via email per le scadenze
          dei tuoi veicoli.
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

      {isSaving && <p className="notification-settings__status">Salvataggio...</p>}

      {message && <p className="notification-settings__success">{message}</p>}

      {error && <p className="notification-settings__error">{error}</p>}
    </section>
  );
}

export default NotificationSettings;
