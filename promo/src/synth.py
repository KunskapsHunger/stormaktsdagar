"""Synthesizes the music bed for the short (pads, hits, ticks, riser) -> music.wav (48 kHz stereo)."""
import numpy as np
import wave

SR = 48000
DUR = 34.3
N = int(SR * DUR)
rng = np.random.default_rng(7)

# scene cuts (seconds) — must match scenes.cjs durations
CUTS = [0.0, 3.0, 10.0, 13.3, 18.3, 22.8, 27.0, 30.3]
TL_TICKS = [3.0 + 0.25 + i * (6.3 / 22) for i in range(1, 22)]


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


D2, F2, G2, A2, Bb2, C3, D3, E3, F3, Fs3, G3, A3, Bb3, C4, D4, E4, F4, Fs4, A4 = (
    38, 41, 43, 45, 46, 48, 50, 52, 53, 54, 55, 57, 58, 60, 62, 64, 65, 66, 69)
Dm = [D2, A2, D3, F3, A3]
Bb = [Bb2 - 12 + 12, F3, Bb3, D4]
F_ = [F2, C3, F3, A3, C4]
C_ = [C3 - 12, G3 - 12, C3, E3, G3]
Gm = [G2, D3, G3, Bb3]
DM = [D2, A2, D3, Fs3, A3, D4]

# (start, end, chord, gain)
CHORDS = [
    (0.0, 3.0, Dm, 0.8),
    (3.0, 4.75, Dm, 0.9), (4.75, 6.5, Bb, 0.9), (6.5, 8.25, F_, 0.9), (8.25, 10.0, C_, 0.95),
    (10.0, 13.3, Bb, 0.85),
    (13.3, 18.3, Gm, 0.75),
    (18.3, 22.8, Dm, 0.9),
    (22.8, 25.0, F_, 0.9), (25.0, 27.0, C_, 0.9),
    (27.0, 30.3, Bb, 0.85),
    (30.3, 34.3, DM, 1.0),
]

t = np.arange(N) / SR
L = np.zeros(N)
R = np.zeros(N)


def env(n, a, r):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, na)
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def pad_note(f, n):
    tt = np.arange(n) / SR
    out = np.zeros(n)
    for det in (-0.0018, 0.0, 0.0021):
        ph = rng.uniform(0, 2 * np.pi)
        for h in range(1, 9):
            out += np.sin(2 * np.pi * f * (1 + det) * h * tt + ph * h) / (h ** 1.35)
    return out


def lowpass(x, fc):
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x)
    acc = 0.0
    # vectorised one-pole via lfilter-like recursion in chunks would need scipy; loop is fine here
    for i in range(len(x)):
        acc = (1 - a) * x[i] + a * acc
        y[i] = acc
    return y


# --- pads ---
pad = np.zeros(N)
for s, e, chord, g in CHORDS:
    i0, i1 = int(s * SR), min(N, int((e + 0.35) * SR))
    n = i1 - i0
    seg = sum(pad_note(hz(m), n) for m in chord) / len(chord)
    last = e >= DUR - 0.01
    seg *= env(n, 0.25 if s > 0 else 1.2, 2.2 if last else 0.4) * g
    pad[i0:i1] += seg
# slow swell/tremolo
pad *= 0.85 + 0.15 * np.sin(2 * np.pi * 0.25 * t)
pad = lowpass(pad, 1400.0)

# --- string pulse (eighths) under the time-lapse and the campaign ---
pulse = np.zeros(N)
def pulse_run(s, e, bpm, roots):
    step = 60 / bpm / 2
    k = 0
    tt = s
    while tt < e - 0.05:
        root = roots(tt)
        n = int(0.22 * SR)
        i0 = int(tt * SR)
        seg = pad_note(hz(root), n) + 0.5 * pad_note(hz(root + 12), n)
        seg *= np.exp(-np.arange(n) / SR * 11) * (1.0 if k % 2 == 0 else 0.7)
        pulse[i0:i0 + n] += seg[: max(0, min(n, N - i0))]
        tt += step
        k += 1

def root_at(tt):
    for s, e, chord, _ in CHORDS:
        if s <= tt < e:
            return chord[0] if chord[0] >= 40 else chord[0] + 12
    return D2 + 12

pulse_run(3.0, 10.0, 132, root_at)
pulse_run(18.3, 22.8, 132, root_at)
pulse = lowpass(pulse, 2200.0) * 0.55

# --- hits on cuts ---
hits = np.zeros(N)
def boom(at, g=1.0):
    n = int(1.6 * SR)
    tt = np.arange(n) / SR
    f = 42 + 58 * np.exp(-tt * 9)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-tt * 3.2)
    noise = rng.standard_normal(n) * np.exp(-tt * 28) * 0.35
    x = (body + noise) * g
    i0 = int(at * SR)
    m = min(n, N - i0)
    hits[i0:i0 + m] += x[:m]

for c in CUTS:
    boom(c, 1.25 if c in (0.0, 30.3) else 0.95)

# --- ticks during the time-lapse ---
ticks = np.zeros(N)
for at in TL_TICKS:
    n = int(0.05 * SR)
    tt = np.arange(n) / SR
    x = (np.sin(2 * np.pi * 2100 * tt) * 0.6 + rng.standard_normal(n) * 0.4) * np.exp(-tt * 140)
    i0 = int(at * SR)
    ticks[i0:i0 + n] += x * 0.28

# --- riser into the end card ---
riser = np.zeros(N)
rs, re_ = 28.4, 30.3
n = int((re_ - rs) * SR)
tt = np.arange(n) / SR
u = tt / (re_ - rs)
nz = rng.standard_normal(n)
# brighten over time by mixing progressively less-smoothed noise
smooth = np.convolve(nz, np.ones(24) / 24, mode="same")
x = (smooth * (1 - u) + nz * u) * (u ** 2.2) * 0.5
x += np.sin(2 * np.pi * (220 + 440 * u ** 2) * tt) * (u ** 3) * 0.08
riser[int(rs * SR):int(rs * SR) + n] = x

dry = pad * 0.55 + pulse + hits * 0.9 + ticks + riser

# --- simple stereo reverb: exponentially decaying noise IR ---
def reverb(x, seconds, seed):
    r = np.random.default_rng(seed)
    n = int(seconds * SR)
    ir = r.standard_normal(n) * np.exp(-np.arange(n) / SR * (6.9 / seconds))
    ir[: int(0.012 * SR)] = 0
    ir /= np.sqrt(np.sum(ir ** 2))
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    y = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return y

wetL = reverb(dry, 2.2, 1)
wetR = reverb(dry, 2.2, 2)
L = dry * 0.8 + wetL * 0.35
R = dry * 0.8 + wetR * 0.35

# --- duck under the narration (the mix step places the clips at these times) ---
duck = np.ones(N)
for s, e in [(13.65, 17.35), (22.95, 26.6)]:
    a, b = int(s * SR), int(e * SR)
    fade = int(0.25 * SR)
    duck[a:b] = 0.32
    duck[a - fade:a] = np.linspace(1, 0.32, fade)
    duck[b:b + fade] = np.linspace(0.32, 1, fade)
L *= duck
R *= duck

# final fade and normalise
fo = int(1.2 * SR)
L[-fo:] *= np.linspace(1, 0, fo)
R[-fo:] *= np.linspace(1, 0, fo)
peak = max(np.abs(L).max(), np.abs(R).max())
L, R = L / peak * 0.89, R / peak * 0.89

data = (np.stack([L, R], axis=1) * 32767).astype("<i2")
with wave.open("music.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(data.tobytes())
print("wrote music.wav", DUR, "s")
