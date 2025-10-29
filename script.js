const timeEl = document.getElementById('time');
let serverTime = null;
let lastSync = null;
const syncInterval = 5000; // každých 5 sekund

async function syncTime() {
    try {
        const response = await fetch('/time'); // nebo absolutní URL, např. 'http://example.com/time'
        const data = await response.json();

        // očekáváme formát např. "09:26:30.1"
        const parts = data.time.split(':');
        const hours = parseInt(parts[0]);
        const minutes = parseInt(parts[1]);
        const secondsParts = parts[2].split('.');
        const seconds = parseInt(secondsParts[0]);
        const tenths = parseInt(secondsParts[1] || 0);

        // vytvoříme Date objekt pro aktuální čas ze serveru
        const now = new Date();
        serverTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(),
                              hours, minutes, seconds, tenths * 100);
        lastSync = now;
    } catch (err) {
        console.error("Chyba při synchronizaci času:", err);
    }
}

// aktualizuje zobrazovaný čas
function updateDisplay() {
    if (!serverTime || !lastSync) return;

    const now = new Date();
    const diff = now - lastSync; // rozdíl od poslední synchronizace
    const current = new Date(serverTime.getTime() + diff);

    const h = String(current.getHours()).padStart(2, '0');
    const m = String(current.getMinutes()).padStart(2, '0');
    const s = String(current.getSeconds()).padStart(2, '0');
    const t = Math.floor(current.getMilliseconds() / 100); // desetiny sekundy

    timeEl.textContent = `${h}:${m}:${s}.${t}`;
}

// hlavní smyčka – lokální běh a pravidelná synchronizace
async function startClock() {
    await syncTime();
    setInterval(syncTime, syncInterval);
    setInterval(updateDisplay, 100); // aktualizace každých 0.1 s
}

startClock();
