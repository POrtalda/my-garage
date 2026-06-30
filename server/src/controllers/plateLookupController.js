const normalizePlate = (plate) => {
return String(plate || "")
.trim()
.replace(/\s+/g, "")
.toUpperCase();
};

const isValidItalianPlate = (plate) => {
return /^[A-Z0-9]{5,10}$/.test(plate);
};

const lookupVehicleByPlate = async (req, res) => {
const plate = normalizePlate(req.body.plate);

if (!plate) {
return res.status(400).json({
message: "Targa obbligatoria.",
});
}

if (!isValidItalianPlate(plate)) {
return res.status(400).json({
message: "Formato targa non valido.",
});
}

res.json({
plate,
source: "manual-assist",
message:
"Ricerca automatica non ancora collegata a un provider dati. Usa i servizi ufficiali per verificare i dati e completa manualmente le scadenze.",
insurance: {
status: "unknown",
label: "Assicurazione",
message:
"Verifica se il veicolo risulta assicurato tramite il servizio ufficiale del Portale dell'Automobilista.",
officialUrl:
"https://www.ilportaledellautomobilista.it/web/portale-automobilista/cittadino-verifica-copertura-rc",
},
inspection: {
status: "unknown",
label: "Revisione",
message:
"Verifica l'ultima revisione tramite la pagina ufficiale del Portale dell'Automobilista. Se il servizio diretto dà problemi con il captcha, apri la pagina e usa il pulsante di verifica disponibile sul sito.",
officialUrl:
"https://www.ilportaledellautomobilista.it/web/portale-automobilista/verifica-revisioni-effettuate-ms",
},
tax: {
status: "manual_required",
label: "Bollo",
message:
"La scadenza del bollo va inserita manualmente o verificata tramite il servizio online ACI.",
officialUrl: "https://online.aci.it/acinet/calcolobollo/",
},
});
};

module.exports = {
lookupVehicleByPlate,
};
