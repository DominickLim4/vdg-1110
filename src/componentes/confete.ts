import confetti from 'canvas-confetti'

const reduzido = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const CORES_VALE = ['#F5C242', '#F2A6B6', '#B8A6E3', '#78B159', '#5FB3CF', '#FFF1D2']

export function confete(cores = CORES_VALE, intensidade = 1) {
  if (reduzido()) return
  const base = { colors: cores, shapes: ['square' as const], scalar: 1.1, ticks: 220 }
  confetti({ ...base, particleCount: Math.round(80 * intensidade), spread: 75, origin: { y: 0.65 } })
  setTimeout(() => confetti({ ...base, particleCount: Math.round(50 * intensidade), angle: 60, spread: 60, origin: { x: 0, y: 0.7 } }), 150)
  setTimeout(() => confetti({ ...base, particleCount: Math.round(50 * intensidade), angle: 120, spread: 60, origin: { x: 1, y: 0.7 } }), 300)
}

export function confeteMengao() {
  confete(['#C8102E', '#111111', '#FFFFFF'], 1.4)
}
