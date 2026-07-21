let audioCtx = null;
let humOsc = null;
let humGain = null;
let humFilter = null;
let isMuted = false;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
    return audioCtx;
}

export const AudioEngine = {
    setMuted(muted) {
        isMuted = muted;
        if (muted) {
            this.stopBulbHum();
        } else {
            // If light is on and we unmuted, start hum
            // (Caller can manage starting/stopping hum based on light state)
        }
    },

    isMuted() {
        return isMuted;
    },

    playChainPull() {
        if (isMuted) return;
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            // Pluck / Click sound
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = "triangle";
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.04);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);

            filter.type = "bandpass";
            filter.frequency.setValueAtTime(800, now);
            filter.Q.setValueAtTime(5, now);

            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.13);

            // Metal snap (noise burst)
            const bufferSize = ctx.sampleRate * 0.05; // 50ms noise
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const noiseFilter = ctx.createBiquadFilter();
            noiseFilter.type = "bandpass";
            noiseFilter.frequency.setValueAtTime(2000, now);
            noiseFilter.Q.setValueAtTime(8, now);

            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.18, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(ctx.destination);

            noise.start(now);
            noise.stop(now + 0.05);

        } catch (e) {
            console.error("AudioEngine error", e);
        }
    },

    playChainRelease() {
        if (isMuted) return;
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            // Metallic springy release click
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = "triangle";
            osc.frequency.setValueAtTime(900, now);
            osc.frequency.exponentialRampToValueAtTime(220, now + 0.06);

            filter.type = "bandpass";
            filter.frequency.setValueAtTime(1000, now);
            filter.Q.setValueAtTime(3, now);

            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.09);

        } catch (e) {
            console.error("AudioEngine error", e);
        }
    },

    playFlicker() {
        if (isMuted) return;
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            // Fast static / electrical pop
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(Math.random() * 80 + 35, now);
            
            const filter = ctx.createBiquadFilter();
            filter.type = "highpass";
            filter.frequency.setValueAtTime(1500, now);

            gain.gain.setValueAtTime(0.04, now);
            gain.gain.linearRampToValueAtTime(0.07, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.06);
        } catch (e) {}
    },

    startBulbHum() {
        if (isMuted) return;
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            if (humOsc) {
                // Already humming
                return;
            }

            // Low electric warm 55Hz hum
            humOsc = ctx.createOscillator();
            const subOsc = ctx.createOscillator();
            humGain = ctx.createGain();
            humFilter = ctx.createBiquadFilter();

            humOsc.type = "sawtooth";
            humOsc.frequency.setValueAtTime(55, now); // A1 hum

            subOsc.type = "sine";
            subOsc.frequency.setValueAtTime(110, now); // Octave harmonic

            humFilter.type = "lowpass";
            humFilter.frequency.setValueAtTime(110, now); // Cutoff harsh frequencies
            humFilter.Q.setValueAtTime(1, now);

            // LFO for slow power wave oscillation (6Hz hum buzz wobble)
            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();
            lfo.type = "sine";
            lfo.frequency.setValueAtTime(6, now);
            lfoGain.gain.setValueAtTime(0.04, now);

            lfo.connect(lfoGain);
            lfoGain.connect(humGain.gain);

            humGain.gain.setValueAtTime(0, now);
            humGain.gain.linearRampToValueAtTime(0.07, now + 1.2); // Smooth warmup hum

            humOsc.connect(humFilter);
            subOsc.connect(humFilter);
            humFilter.connect(humGain);
            humGain.connect(ctx.destination);

            lfo.start(now);
            humOsc.start(now);
            subOsc.start(now);

            // Keep track of secondary osc to clean up
            humOsc._sub = subOsc;
            humOsc._lfo = lfo;
        } catch (e) {
            console.error("AudioEngine hum error", e);
        }
    },

    stopBulbHum() {
        try {
            if (humOsc && humGain) {
                const ctx = getAudioContext();
                const now = ctx.currentTime;

                const currentOsc = humOsc;
                const currentGain = humGain;

                // Fade out hum over 350ms
                currentGain.gain.cancelScheduledValues(now);
                currentGain.gain.setValueAtTime(currentGain.gain.value, now);
                currentGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

                setTimeout(() => {
                    try {
                        currentOsc.stop();
                        if (currentOsc._sub) currentOsc._sub.stop();
                        if (currentOsc._lfo) currentOsc._lfo.stop();
                    } catch (err) {}
                }, 400);

                humOsc = null;
                humGain = null;
                humFilter = null;
            }
        } catch (e) {}
    },

    playDroneScan() {
        if (isMuted) return;
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = "sine";
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(1400, now + 0.4);
            osc.frequency.linearRampToValueAtTime(600, now + 0.8);

            filter.type = "bandpass";
            filter.frequency.setValueAtTime(800, now);
            filter.frequency.exponentialRampToValueAtTime(1800, now + 0.4);
            filter.Q.setValueAtTime(4, now);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.exponentialRampToValueAtTime(0.06, now + 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 1.0);
        } catch (e) {}
    },

    playUIHover() {
        if (isMuted) return;
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(1800, now);

            gain.gain.setValueAtTime(0.015, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.02);
        } catch (e) {}
    },

    playUISelect() {
        if (isMuted) return;
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();

            osc1.type = "sine";
            osc1.frequency.setValueAtTime(587.33, now); // D5
            osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

            osc2.type = "sine";
            osc2.frequency.setValueAtTime(880, now); // A5
            osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.18); // D6

            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);

            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 0.3);
            osc2.stop(now + 0.3);
        } catch (e) {}
    }
};
