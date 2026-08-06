let audioCtx = null;
let humOsc = null;
let humGain = null;
let humFilter = null;
let isMuted = false;

let weatherVol = 0.5;
let rainNoise = null;
let rainGain = null;
let rainFilter = null;
let snowNoise = null;
let snowGain = null;
let snowFilter = null;
let snowLfo = null;

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
    },

    setWeatherVolume(vol) {
        weatherVol = vol;
        if (rainGain) {
            try {
                const ctx = getAudioContext();
                rainGain.gain.setValueAtTime(0.06 * weatherVol, ctx.currentTime);
            } catch (e) {}
        }
        if (snowGain) {
            try {
                const ctx = getAudioContext();
                snowGain.gain.setValueAtTime(0.04 * weatherVol, ctx.currentTime);
            } catch (e) {}
        }
    },

    startRainAudio() {
        if (isMuted) return;
        try {
            if (rainNoise) return; // Already playing

            const ctx = getAudioContext();
            const now = ctx.currentTime;

            // Generate 2 seconds of pinkish noise
            const bufferSize = ctx.sampleRate * 2;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const output = buffer.getChannelData(0);
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                output[i] *= 0.11;
                b6 = white * 0.115926;
            }

            rainNoise = ctx.createBufferSource();
            rainNoise.buffer = buffer;
            rainNoise.loop = true;

            rainFilter = ctx.createBiquadFilter();
            rainFilter.type = "lowpass";
            rainFilter.frequency.setValueAtTime(1100, now);

            rainGain = ctx.createGain();
            rainGain.gain.setValueAtTime(0, now);
            rainGain.gain.linearRampToValueAtTime(0.06 * weatherVol, now + 1.0);

            rainNoise.connect(rainFilter);
            rainFilter.connect(rainGain);
            rainGain.connect(ctx.destination);

            rainNoise.start(now);
        } catch (e) {
            console.error("Rain audio error", e);
        }
    },

    stopRainAudio() {
        try {
            if (rainNoise && rainGain) {
                const ctx = getAudioContext();
                const now = ctx.currentTime;
                rainGain.gain.cancelScheduledValues(now);
                rainGain.gain.setValueAtTime(rainGain.gain.value, now);
                rainGain.gain.linearRampToValueAtTime(0.0001, now + 0.5);

                const sourceToStop = rainNoise;
                setTimeout(() => {
                    try { sourceToStop.stop(); } catch (err) {}
                }, 550);

                rainNoise = null;
                rainGain = null;
                rainFilter = null;
            }
        } catch (e) {}
    },

    triggerThunder() {
        if (isMuted) return;
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            // 1. Sub-bass rumble oscillator
            const subOsc = ctx.createOscillator();
            const subGain = ctx.createGain();
            subOsc.type = "triangle";
            subOsc.frequency.setValueAtTime(85, now);
            subOsc.frequency.exponentialRampToValueAtTime(26, now + 1.8);

            subGain.gain.setValueAtTime(0.22 * weatherVol, now);
            subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

            subOsc.connect(subGain);
            subGain.connect(ctx.destination);
            subOsc.start(now);
            subOsc.stop(now + 2.3);

            // 2. Highpass noise burst for initial thunderclap
            const bufferSize = ctx.sampleRate * 0.3; // 300ms burst
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const noiseFilter = ctx.createBiquadFilter();
            noiseFilter.type = "bandpass";
            noiseFilter.frequency.setValueAtTime(450, now);
            noiseFilter.Q.setValueAtTime(1.5, now);

            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.35 * weatherVol, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(ctx.destination);

            noise.start(now);
            noise.stop(now + 0.32);

            // 3. Delayed sub echo (reverb tail)
            setTimeout(() => {
                if (isMuted) return;
                try {
                    const echoNow = ctx.currentTime;
                    const echoOsc = ctx.createOscillator();
                    const echoGain = ctx.createGain();
                    echoOsc.type = "sine";
                    echoOsc.frequency.setValueAtTime(45, echoNow);
                    echoOsc.frequency.linearRampToValueAtTime(22, echoNow + 1.2);

                    echoGain.gain.setValueAtTime(0.12 * weatherVol, echoNow);
                    echoGain.gain.exponentialRampToValueAtTime(0.001, echoNow + 1.4);

                    echoOsc.connect(echoGain);
                    echoGain.connect(ctx.destination);
                    echoOsc.start(echoNow);
                    echoOsc.stop(echoNow + 1.5);
                } catch (err) {}
            }, 250);

        } catch (e) {
            console.error("Thunder audio error", e);
        }
    },

    startSnowAudio() {
        if (isMuted) return;
        try {
            if (snowNoise) return;

            const ctx = getAudioContext();
            const now = ctx.currentTime;

            const bufferSize = ctx.sampleRate * 3;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            snowNoise = ctx.createBufferSource();
            snowNoise.buffer = buffer;
            snowNoise.loop = true;

            snowFilter = ctx.createBiquadFilter();
            snowFilter.type = "bandpass";
            snowFilter.frequency.setValueAtTime(400, now);
            snowFilter.Q.setValueAtTime(2.0, now);

            // Slow wind oscillation LFO
            snowLfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();
            snowLfo.type = "sine";
            snowLfo.frequency.setValueAtTime(0.15, now);
            lfoGain.gain.setValueAtTime(250, now);

            snowLfo.connect(lfoGain);
            lfoGain.connect(snowFilter.frequency);

            snowGain = ctx.createGain();
            snowGain.gain.setValueAtTime(0, now);
            snowGain.gain.linearRampToValueAtTime(0.04 * weatherVol, now + 1.2);

            snowNoise.connect(snowFilter);
            snowFilter.connect(snowGain);
            snowGain.connect(ctx.destination);

            snowLfo.start(now);
            snowNoise.start(now);
        } catch (e) {
            console.error("Snow audio error", e);
        }
    },

    stopSnowAudio() {
        try {
            if (snowNoise && snowGain) {
                const ctx = getAudioContext();
                const now = ctx.currentTime;

                snowGain.gain.cancelScheduledValues(now);
                snowGain.gain.setValueAtTime(snowGain.gain.value, now);
                snowGain.gain.linearRampToValueAtTime(0.0001, now + 0.6);

                const noiseToStop = snowNoise;
                const lfoToStop = snowLfo;

                setTimeout(() => {
                    try {
                        noiseToStop.stop();
                        if (lfoToStop) lfoToStop.stop();
                    } catch (err) {}
                }, 650);

                snowNoise = null;
                snowGain = null;
                snowFilter = null;
                snowLfo = null;
            }
        } catch (e) {}
    },

    playMechKeyClick(switchType = "blue") {
        if (isMuted) return;
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            if (switchType === "blue") {
                // High clicky snappy click
                osc.type = "square";
                osc.frequency.setValueAtTime(2200 + Math.random() * 400, now);
                osc.frequency.exponentialRampToValueAtTime(400, now + 0.025);

                filter.type = "highpass";
                filter.frequency.setValueAtTime(1200, now);

                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
            } else if (switchType === "brown") {
                // Tactile bump thock
                osc.type = "triangle";
                osc.frequency.setValueAtTime(650 + Math.random() * 150, now);
                osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);

                filter.type = "lowpass";
                filter.frequency.setValueAtTime(900, now);

                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
            } else {
                // Linear smooth soft thock
                osc.type = "sine";
                osc.frequency.setValueAtTime(450 + Math.random() * 100, now);
                osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);

                filter.type = "lowpass";
                filter.frequency.setValueAtTime(600, now);

                gain.gain.setValueAtTime(0.09, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            }

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.05);
        } catch (e) {}
    },

    playCoffeeClink() {
        if (isMuted) return;
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            // Ceramic ding
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(1760, now); // A6 ceramic chime
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.2);
        } catch (e) {}
    },

    playUsbPlug() {
        if (isMuted) return;
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            // Futuristic hardware mount two-tone chime
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();

            osc1.type = "triangle";
            osc1.frequency.setValueAtTime(523.25, now); // C5
            osc1.frequency.setValueAtTime(783.99, now + 0.06); // G5

            osc2.type = "sine";
            osc2.frequency.setValueAtTime(1046.50, now + 0.06); // C6

            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);

            osc1.start(now);
            osc2.start(now + 0.06);
            osc1.stop(now + 0.26);
            osc2.stop(now + 0.26);
        } catch (e) {}
    },

    playPageFlip() {
        if (isMuted) return;
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            const bufferSize = ctx.sampleRate * 0.08;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = ctx.createBiquadFilter();
            filter.type = "bandpass";
            filter.frequency.setValueAtTime(1500, now);
            filter.Q.setValueAtTime(1.8, now);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            noise.start(now);
            noise.stop(now + 0.09);
        } catch (e) {}
    },

    playPenScribble() {
        if (isMuted) return;
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(800 + Math.random() * 400, now);

            gain.gain.setValueAtTime(0.03, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.045);
        } catch (e) {}
    },

    playStickyPeel() {
        if (isMuted) return;
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.07);

            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.085);
        } catch (e) {}
    },

    playMonitorPower() {
        if (isMuted) return;
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

            gain.gain.setValueAtTime(0.09, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.16);
        } catch (e) {}
    },

    playMouseClick() {
        if (isMuted) return;
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "square";
            osc.frequency.setValueAtTime(1600, now);
            osc.frequency.exponentialRampToValueAtTime(200, now + 0.015);

            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.025);
        } catch (e) {}
    },

    playDroneBleep() {
        if (isMuted) return;
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(1200 + Math.random() * 800, now);
            osc.frequency.exponentialRampToValueAtTime(600 + Math.random() * 400, now + 0.04);

            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.055);
        } catch (e) {}
    },

    playDroneRepair() {
        if (isMuted) return;
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(3000 + Math.random() * 1500, now);
            osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);

            filter.type = "highpass";
            filter.frequency.setValueAtTime(2000, now);

            gain.gain.setValueAtTime(0.07, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.13);
        } catch (e) {}
    },

    playHoloProject() {
        if (isMuted) return;
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();

            osc1.type = "sine";
            osc1.frequency.setValueAtTime(1760, now);
            osc1.frequency.exponentialRampToValueAtTime(3520, now + 0.15);

            osc2.type = "triangle";
            osc2.frequency.setValueAtTime(880, now);
            osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.15);

            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);

            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 0.22);
            osc2.stop(now + 0.22);
        } catch (e) {}
    }
};


