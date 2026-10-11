// Sons sintetizados com Web Audio (sem arquivos). Só tocam depois de um toque (regra do iOS).
let ctx: AudioContext | null = null
let ligado = true

export function definirSom(ativo: boolean) {
  ligado = ativo
}

export function audio() {
  if (!ligado) return null
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function nota(freq: number, inicio: number, dur: number, tipo: OscillatorType = 'square', volume = 0.06) {
  const a = audio()
  if (!a) return
  const t = a.currentTime + inicio
  const osc = a.createOscillator()
  const g = a.createGain()
  osc.type = tipo
  osc.frequency.setValueAtTime(freq, t)
  g.gain.setValueAtTime(volume, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(g).connect(a.destination)
  osc.start(t)
  osc.stop(t + dur + 0.02)
}

export const som = {
  toque: () => nota(660, 0, 0.06, 'square', 0.04),
  moeda: () => {
    nota(988, 0, 0.08)
    nota(1319, 0.07, 0.18)
  },
  erro: () => {
    nota(220, 0, 0.12, 'sawtooth', 0.05)
    nota(165, 0.1, 0.18, 'sawtooth', 0.05)
  },
  vitoria: () => [523, 659, 784, 1047].forEach((f, i) => nota(f, i * 0.11, 0.22, 'square', 0.05)),
  bau: () => [392, 523, 659, 784, 1047, 1319].forEach((f, i) => nota(f, i * 0.07, 0.25, 'triangle', 0.07)),
  bolha: () => nota(500 + Math.random() * 500, 0, 0.05, 'sine', 0.08),
  pulo: () => nota(440, 0, 0.1, 'square', 0.04),
  peixe: () => nota(330 + Math.random() * 60, 0, 0.04, 'triangle', 0.03),
  acorde: (freqs: number[]) => freqs.forEach((f) => nota(f, 0, 0.9, 'sawtooth', 0.035)),
  tambor: (grave: boolean) => nota(grave ? 70 : 180, 0, grave ? 0.25 : 0.08, grave ? 'sine' : 'square', grave ? 0.3 : 0.05),
}
