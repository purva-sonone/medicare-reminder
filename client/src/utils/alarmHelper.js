// =============================================
//   MediCare Alarm Helper — Web Audio API
//   5 Premium Realistic Ringtones
// =============================================

let audioCtx = null;
let alarmInterval = null;

const VOLUME_KEY = 'medicare_alarm_volume';
export const getSavedVolume = () => parseFloat(localStorage.getItem(VOLUME_KEY) ?? '0.7');
export const saveVolume = (v) => localStorage.setItem(VOLUME_KEY, String(v));

const getCtx = () => {
    if (!audioCtx || audioCtx.state === 'closed') {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
};

// ==============================================
//  Core: Realistic Bell using additive synthesis
//  A real bell = fundamental + inharmonic partials
//  Each partial fades at different speeds
// ==============================================
const bellStrike = (ctx, freq, startAt, vol = 0.5) => {
    const masterVol = getSavedVolume();
    // Bell partials: [multiplier, relative volume, decay time]
    const partials = [
        [1.000, 1.00, 2.0],   // fundamental
        [2.756, 0.50, 1.5],   // minor third above octave
        [5.404, 0.25, 1.0],   // major third 2 octaves up
        [8.930, 0.12, 0.6],   // seventh partial
    ];
    partials.forEach(([mult, relVol, decay]) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * mult, ctx.currentTime + startAt);
        gain.gain.setValueAtTime(0, ctx.currentTime + startAt);
        gain.gain.linearRampToValueAtTime(masterVol * vol * relVol, ctx.currentTime + startAt + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startAt + decay);
        osc.start(ctx.currentTime + startAt);
        osc.stop(ctx.currentTime + startAt + decay + 0.05);
    });
};

// Simple clean sine beep
const beep = (ctx, freq, startAt, dur, vol = 0.5) => {
    const masterVol = getSavedVolume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startAt);
    gain.gain.setValueAtTime(0, ctx.currentTime + startAt);
    gain.gain.linearRampToValueAtTime(masterVol * vol, ctx.currentTime + startAt + 0.005);
    gain.gain.setValueAtTime(masterVol * vol, ctx.currentTime + startAt + dur - 0.02);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + startAt + dur);
    osc.start(ctx.currentTime + startAt);
    osc.stop(ctx.currentTime + startAt + dur + 0.01);
};

// Nature bird chirp effect
const chirp = (ctx, startAt, vol = 0.3) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime + startAt);
    osc.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + startAt + 0.12);
    gain.gain.setValueAtTime(0, ctx.currentTime + startAt);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + startAt + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startAt + 0.12);
    osc.start(ctx.currentTime + startAt);
    osc.stop(ctx.currentTime + startAt + 0.13);
};

// Heartbeat thump effect
const heartbeatThump = (ctx, startAt, vol = 0.5) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, ctx.currentTime + startAt);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + startAt + 0.15);
    gain.gain.setValueAtTime(0, ctx.currentTime + startAt);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + startAt + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startAt + 0.20);
    osc.start(ctx.currentTime + startAt);
    osc.stop(ctx.currentTime + startAt + 0.22);
};

// Note frequencies
const hz = {
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00,
    B5: 987.77, C6: 1046.5, D6: 1174.7, E6: 1318.5,
};

// =============================================
//   Premium Ringtones List
// =============================================

export const RINGTONES = [

    // ─── 1. SOFT BELL ⭐⭐⭐⭐⭐ ───────────────────
    {
        id: 'soft_bell',
        name: 'Soft Bell',
        emoji: '🔔',
        rating: '⭐⭐⭐⭐⭐',
        recommended: true,
        description: 'Gentle bell • Elderly users ke liye bhi acchi • Calm aur noticeable',
        examples: ['soft-bell.mp3', 'meditation-bell.mp3'],
        play: () => {
            const ctx = getCtx();
            // Three gentle bell strikes — C5, E5, G5 (major chord)
            bellStrike(ctx, hz.C5, 0.00, 0.35);
            bellStrike(ctx, hz.E5, 0.55, 0.28);
            bellStrike(ctx, hz.G5, 1.00, 0.22);
        },
        interval: 3500,
    },

    // ─── 2. DIGITAL REMINDER ⭐⭐⭐⭐⭐ ─────────────
    {
        id: 'digital_reminder',
        name: 'Digital Reminder',
        emoji: '📳',
        rating: '⭐⭐⭐⭐⭐',
        recommended: false,
        description: 'Mobile reminder jaisi • Professional feel',
        examples: ['reminder-tone.mp3', 'notification-chime.mp3'],
        play: () => {
            const ctx = getCtx();
            // Two-tone rising chime (D5 → A5) — like a modern notification
            beep(ctx, hz.D5, 0.00, 0.12, 0.4);
            beep(ctx, hz.A5, 0.15, 0.22, 0.45);
            // brief pause then repeat softer
            beep(ctx, hz.D5, 0.55, 0.10, 0.30);
            beep(ctx, hz.A5, 0.68, 0.18, 0.35);
        },
        interval: 2000,
    },

    // ─── 3. HOSPITAL MONITOR BEEP ⭐⭐⭐⭐☆ ─────────
    {
        id: 'hospital_beep',
        name: 'Hospital Monitor Beep',
        emoji: '🏥',
        rating: '⭐⭐⭐⭐☆',
        recommended: false,
        description: 'Healthcare theme • Short "beep beep" • Use sirf 1–2 seconds ka',
        examples: [],
        play: () => {
            const ctx = getCtx();
            // Clean 1000 Hz medical monitor beep — beep...beep (short)
            beep(ctx, 1000, 0.00, 0.10, 0.55);
            beep(ctx, 1000, 0.55, 0.10, 0.55);
        },
        interval: 1800,
    },

    // ─── 4. WIND CHIME ⭐⭐⭐⭐☆ ────────────────────
    {
        id: 'wind_chime',
        name: 'Wind Chime',
        emoji: '🎐',
        rating: '⭐⭐⭐⭐☆',
        recommended: false,
        description: 'Soft aur peaceful • Morning medicines ke liye accha',
        examples: [],
        play: () => {
            const ctx = getCtx();
            // Overlapping high pentatonic bells with long sustain
            // Random-ish timing like real wind chimes
            const chimes = [
                [hz.E6, 0.00, 0.30],
                [hz.C6, 0.18, 0.28],
                [hz.G5, 0.35, 0.32],
                [hz.D6, 0.50, 0.26],
                [hz.B5, 0.68, 0.30],
                [hz.E6, 0.90, 0.22],
                [hz.C6, 1.10, 0.25],
            ];
            chimes.forEach(([freq, start, vol]) => bellStrike(ctx, freq, start, vol * 0.9));
        },
        interval: 3800,
    },

    // ─── 5. ALARM BELL ⭐⭐⭐⭐☆ ────────────────────
    {
        id: 'alarm_bell',
        name: 'Alarm Bell',
        emoji: '⏰',
        rating: '⭐⭐⭐⭐☆',
        recommended: false,
        description: 'Agar medicine miss ho rahi ho • Thoda loud but annoying na ho',
        examples: [],
        play: () => {
            const ctx = getCtx();
            // Classic double-strike alarm bell pattern × 3
            const pattern = [0.00, 0.18, 0.50, 0.68, 1.00, 1.18];
            pattern.forEach((t) => bellStrike(ctx, hz.A5, t, 0.55));
        },
        interval: 1800,
    },

    // ─── 6. SERENE HARP ⭐⭐⭐⭐⭐ ───────────────────
    {
        id: 'serene_harp',
        name: 'Serene Harp',
        emoji: '🧘‍♂️',
        rating: '⭐⭐⭐⭐⭐',
        recommended: false,
        description: 'Bohat hi shanti dene wali harp dhun • Dophar ki medicines ke liye best',
        examples: ['zen-harp.mp3', 'serene-melody.mp3'],
        play: () => {
            const ctx = getCtx();
            // Harmonic ascending harp plucks
            bellStrike(ctx, hz.A4, 0.00, 0.40);
            bellStrike(ctx, hz.C5, 0.20, 0.35);
            bellStrike(ctx, hz.E5, 0.40, 0.30);
            bellStrike(ctx, hz.A5, 0.60, 0.25);
        },
        interval: 3000,
    },

    // ─── 7. MODERN ECHO PLUCK ⭐⭐⭐⭐⭐ ─────────────
    {
        id: 'echo_pluck',
        name: 'Modern Echo Pluck',
        emoji: '💬',
        rating: '⭐⭐⭐⭐⭐',
        recommended: false,
        description: 'Modern aur fast sound • Jo jaldi sunai de bina annoy kiye',
        examples: ['modern-echo.mp3', 'smart-chime.mp3'],
        play: () => {
            const ctx = getCtx();
            // Modern echo effect using delay offsets on beeps
            beep(ctx, hz.G5, 0.00, 0.08, 0.40);
            beep(ctx, hz.G5, 0.15, 0.08, 0.20);
            beep(ctx, hz.G5, 0.30, 0.08, 0.10);

            beep(ctx, hz.C6, 0.40, 0.08, 0.40);
            beep(ctx, hz.C6, 0.55, 0.08, 0.20);
            beep(ctx, hz.C6, 0.70, 0.08, 0.10);
        },
        interval: 2500,
    },

    // ─── 8. MORNING BIRDS ⭐⭐⭐⭐⭐ ──────────────────
    {
        id: 'morning_birds',
        name: 'Morning Birds',
        emoji: '🐦',
        rating: '⭐⭐⭐⭐⭐',
        recommended: false,
        description: 'Chidiya ki chehchahat jaisa • Subah ke alarm ke liye refreshing feel',
        examples: ['morning-chirp.mp3', 'nature-remind.mp3'],
        play: () => {
            const ctx = getCtx();
            // Soothing birds chirping sound effects
            chirp(ctx, 0.00, 0.35);
            chirp(ctx, 0.15, 0.35);
            chirp(ctx, 0.45, 0.30);
            chirp(ctx, 0.60, 0.30);
        },
        interval: 3200,
    },

    // ─── 9. HEARTBEAT PULSAR ⭐⭐⭐⭐☆ ───────────────
    {
        id: 'heartbeat_pulsar',
        name: 'Heartbeat Pulsar',
        emoji: '💓',
        rating: '⭐⭐⭐⭐☆',
        recommended: false,
        description: 'Heartbeat aur soft chime ka mix • Health-focused aur unique',
        examples: ['heartbeat-pulse.mp3'],
        play: () => {
            const ctx = getCtx();
            // Double natural low heartbeat thumps + crystal bells
            heartbeatThump(ctx, 0.00, 0.50);
            heartbeatThump(ctx, 0.25, 0.50);
            bellStrike(ctx, hz.E6, 0.50, 0.15);

            heartbeatThump(ctx, 1.00, 0.50);
            heartbeatThump(ctx, 1.25, 0.50);
            bellStrike(ctx, hz.B5, 1.50, 0.12);
        },
        interval: 3000,
    },
];

// =============================================
//   Preference Helpers (localStorage)
// =============================================

const STORAGE_KEY = 'medicare_alarm_ringtone';

export const getSavedRingtoneId = () => {
    return localStorage.getItem(STORAGE_KEY) || 'soft_bell';
};

export const saveRingtoneId = (id) => {
    localStorage.setItem(STORAGE_KEY, id);
};

export const getRingtoneById = (id) => {
    return RINGTONES.find((r) => r.id === id) || RINGTONES[0];
};

// =============================================
//   Alarm Control
// =============================================

export const startAlarm = () => {
    stopAlarm();
    const ringtone = getRingtoneById(getSavedRingtoneId());
    try {
        ringtone.play();
        alarmInterval = setInterval(() => {
            try { ringtone.play(); } catch (e) { /* ignore */ }
        }, ringtone.interval);
    } catch (e) {
        console.warn('Alarm play failed:', e);
    }
};

export const stopAlarm = () => {
    if (alarmInterval) {
        clearInterval(alarmInterval);
        alarmInterval = null;
    }
    if (audioCtx) {
        try {
            audioCtx.close();
        } catch (e) {
            // ignore
        }
        audioCtx = null;
    }
};

export const previewRingtone = (id) => {
    const ringtone = getRingtoneById(id);
    try {
        ringtone.play();
    } catch (e) {
        console.warn('Preview failed:', e);
    }
};
