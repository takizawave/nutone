/**
 * Audio energy signal for PixelAudioRibbonBackground.
 * Demo mode: layered sin noise + random impulses.
 * Mic mode: Web Audio API AnalyserNode (optional).
 */

const DEMO_BIN_COUNT = 32;

/** Deterministic hash for reproducible noise (e.g. for ribbon) */
export function hash(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 43758.5453) * 43758.5453;
  return n - Math.floor(n);
}

/**
 * Demo "audio" energy: layered sine waves + occasional random impulses.
 * Returns array of length binCount, values in [0, 1].
 */
export function getDemoEnergy(
  binCount: number,
  t: number,
  seed: number = 0
): Float32Array {
  const out = new Float32Array(binCount);
  const speed = 1.2;
  const freqScale = 0.15;

  for (let i = 0; i < binCount; i++) {
    const phase = i * freqScale + t * speed + seed * 0.1;
    let e =
      0.4 * Math.sin(phase) +
      0.25 * Math.sin(phase * 2.3 + 1) +
      0.2 * Math.sin(phase * 0.7 - 0.5);
    e = (e + 1) / 2;
    const impulse = hash(i, Math.floor(t * 4), seed);
    if (impulse > 0.92) {
      e = Math.min(1, e + 0.4 + impulse * 0.3);
    }
    out[i] = Math.max(0, Math.min(1, e));
  }
  return out;
}

export interface AudioAnalyserResult {
  getEnergy: (binCount: number) => Float32Array;
  dispose: () => void;
}

/**
 * Create analyser from microphone. On permission denied or error, returns null.
 * Caller should fallback to demo mode.
 */
export async function createMicAnalyser(): Promise<AudioAnalyserResult | null> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const ctx = new AudioContext();
    const src = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.6;
    src.connect(analyser);

    const data = new Uint8Array(analyser.frequencyBinCount);

    return {
      getEnergy(binCount: number): Float32Array {
        analyser.getByteFrequencyData(data);
        const out = new Float32Array(binCount);
        const step = data.length / binCount;
        for (let i = 0; i < binCount; i++) {
          const start = Math.floor(i * step);
          const end = Math.floor((i + 1) * step);
          let sum = 0;
          for (let j = start; j < end && j < data.length; j++) sum += data[j];
          out[i] = (sum / (end - start || 1)) / 255;
        }
        return out;
      },
      dispose() {
        ctx.close();
        stream.getTracks().forEach((t) => t.stop());
      },
    };
  } catch {
    return null;
  }
}

export { DEMO_BIN_COUNT };
