// Motor da guitarra do Parquinho: timbres, bateria, efeitos e riffs. Tudo sintetizado (Web Audio).
import { frequencia, type Riff, type Timbre } from '../conteudo/riffs'
import { audio } from './som'

export type PecaBateria = 'bumbo' | 'caixa' | 'chimbal' | 'prato' | 'tom'

export const BATERIA: PecaBateria[] = ['bumbo', 'caixa', 'chimbal', 'prato', 'tom']

function curvaDistorcao(intensidade: number) {
  const n = 1024
  const curva = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1
    curva[i] = ((1 + intensidade) * x) / (1 + intensidade * Math.abs(x))
  }
  return curva
}

// Monta a cadeia de efeitos de um timbre e devolve o nó de entrada.
function cadeia(a: AudioContext, timbre: Timbre, destino: AudioNode): AudioNode {
  if (timbre === 'distorcido') {
    const dist = a.createWaveShaper()
    dist.curve = curvaDistorcao(40)
    const filtro = a.createBiquadFilter()
    filtro.type = 'lowpass'
    filtro.frequency.value = 2600
    dist.connect(filtro).connect(destino)
    return dist
  }
  const filtro = a.createBiquadFilter()
  filtro.type = 'lowpass'
  filtro.frequency.value = timbre === '8bit' ? 6000 : timbre === 'violao' ? 2400 : 3200
  filtro.connect(destino)
  return filtro
}

function ruido(a: AudioContext, segundos: number) {
  const buffer = a.createBuffer(1, Math.max(1, Math.floor(a.sampleRate * segundos)), a.sampleRate)
  const dados = buffer.getChannelData(0)
  for (let i = 0; i < dados.length; i++) dados[i] = (Math.random() * 2 - 1) * (1 - i / dados.length)
  const fonte = a.createBufferSource()
  fonte.buffer = buffer
  return fonte
}

function agendarNota(a: AudioContext, entrada: AudioNode, t: number, freq: number, segundos: number, timbre: Timbre, acorde = timbre === 'distorcido') {
  const vozes = acorde ? [freq, freq * 1.5, freq * 2] : [freq]
  const tipo: OscillatorType = timbre === 'distorcido' ? 'sawtooth' : timbre === '8bit' ? 'square' : 'triangle'
  const volume = (timbre === 'distorcido' ? 0.05 : timbre === '8bit' ? 0.05 : 0.16) / Math.sqrt(vozes.length)
  for (const [k, fv] of vozes.entries()) {
    const osc = a.createOscillator()
    const g = a.createGain()
    osc.type = tipo
    // violão: cordas levemente defasadas, como uma palhetada
    const inicio = t + (timbre === 'violao' ? k * 0.018 : 0)
    osc.frequency.setValueAtTime(fv, inicio)
    if (timbre === 'violao') osc.detune.setValueAtTime(k % 2 ? 4 : -4, inicio)
    g.gain.setValueAtTime(0.0001, inicio)
    g.gain.exponentialRampToValueAtTime(volume, inicio + 0.008)
    if (timbre === 'violao') g.gain.exponentialRampToValueAtTime(0.0001, inicio + Math.max(0.3, segundos * 1.4))
    else {
      g.gain.setValueAtTime(volume, inicio + Math.max(0.02, segundos * 0.85))
      g.gain.exponentialRampToValueAtTime(0.0001, inicio + segundos * 0.98)
    }
    osc.connect(g).connect(entrada)
    osc.start(inicio)
    osc.stop(inicio + Math.max(segundos, timbre === 'violao' ? segundos * 1.5 : 0) + 0.05)
  }
}

function agendarBateria(a: AudioContext, destino: AudioNode, t: number, peca: PecaBateria) {
  if (peca === 'bumbo' || peca === 'tom') {
    const osc = a.createOscillator()
    const g = a.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(peca === 'bumbo' ? 110 : 220, t)
    osc.frequency.exponentialRampToValueAtTime(peca === 'bumbo' ? 45 : 110, t + 0.18)
    g.gain.setValueAtTime(peca === 'bumbo' ? 0.7 : 0.45, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + (peca === 'bumbo' ? 0.32 : 0.4))
    osc.connect(g).connect(destino)
    osc.start(t)
    osc.stop(t + 0.45)
    return
  }
  const dur = peca === 'prato' ? 1.2 : peca === 'chimbal' ? 0.06 : 0.16
  const fonte = ruido(a, dur)
  const filtro = a.createBiquadFilter()
  filtro.type = peca === 'caixa' ? 'bandpass' : 'highpass'
  filtro.frequency.value = peca === 'caixa' ? 1800 : peca === 'chimbal' ? 7000 : 5000
  const g = a.createGain()
  g.gain.setValueAtTime(peca === 'prato' ? 0.35 : peca === 'chimbal' ? 0.25 : 0.4, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  fonte.connect(filtro).connect(g).connect(destino)
  fonte.start(t)
  if (peca === 'caixa') {
    const osc = a.createOscillator()
    const go = a.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(190, t)
    go.gain.setValueAtTime(0.18, t)
    go.gain.exponentialRampToValueAtTime(0.0001, t + 0.1)
    osc.connect(go).connect(destino)
    osc.start(t)
    osc.stop(t + 0.12)
  }
}

function saida(a: AudioContext) {
  const mestre = a.createGain()
  mestre.gain.value = 0.9
  mestre.connect(a.destination)
  return mestre
}

/* ---------- Pads ---------- */

export function tocarAcorde(raiz: string, timbre: Timbre, menor = false) {
  const a = audio()
  if (!a) return
  const mestre = saida(a)
  const entrada = cadeia(a, timbre, mestre)
  const f = frequencia(raiz)
  const t = a.currentTime + 0.01
  if (menor) {
    // acorde aberto: tônica, quinta, oitava e terça menor
    for (const [k, fv] of [f, f * 1.5, f * 2, f * 2.378].entries()) agendarNota(a, entrada, t + (timbre === 'violao' ? k * 0.02 : 0), fv, 1.2, timbre, false)
  } else agendarNota(a, entrada, t, f, 1.1, timbre, true)
  setTimeout(() => mestre.disconnect(), 2000)
}

export function tocarBateria(peca: PecaBateria) {
  const a = audio()
  if (!a) return
  const mestre = saida(a)
  agendarBateria(a, mestre, a.currentTime + 0.005, peca)
  setTimeout(() => mestre.disconnect(), 1500)
}

/* ---------- Efeitos ---------- */

export type Efeito = 'alavanca' | 'microfonia' | 'chug'

export function tocarEfeito(efeito: Efeito) {
  const a = audio()
  if (!a) return
  const mestre = saida(a)
  const entrada = cadeia(a, 'distorcido', mestre)
  const t = a.currentTime + 0.01
  if (efeito === 'alavanca') {
    // dive bomb: o acorde mergulha até o grave
    const f = frequencia('E3')
    for (const fv of [f, f * 1.5, f * 2]) {
      const osc = a.createOscillator()
      const g = a.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(fv, t)
      osc.frequency.setValueAtTime(fv, t + 0.25)
      osc.frequency.exponentialRampToValueAtTime(fv / 6, t + 1.6)
      g.gain.setValueAtTime(0.04, t)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.7)
      osc.connect(g).connect(entrada)
      osc.start(t)
      osc.stop(t + 1.75)
    }
  } else if (efeito === 'microfonia') {
    // microfonia: nota aguda que cresce e vibra
    const osc = a.createOscillator()
    const lfo = a.createOscillator()
    const lfoG = a.createGain()
    const g = a.createGain()
    osc.type = 'sine'
    osc.frequency.value = frequencia('B5')
    lfo.frequency.value = 6
    lfoG.gain.value = 14
    lfo.connect(lfoG).connect(osc.frequency)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(0.09, t + 1.2)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2)
    osc.connect(g).connect(entrada)
    osc.start(t)
    lfo.start(t)
    osc.stop(t + 2.05)
    lfo.stop(t + 2.05)
  } else {
    // chug: palhetada abafada em Mi, bem metal
    const filtro = a.createBiquadFilter()
    filtro.type = 'lowpass'
    filtro.frequency.value = 700
    const dist = a.createWaveShaper()
    dist.curve = curvaDistorcao(60)
    dist.connect(filtro).connect(mestre)
    for (let k = 0; k < 4; k++) agendarNota(a, dist, t + k * 0.13, frequencia('E2'), 0.09, 'distorcido', true)
  }
  setTimeout(() => mestre.disconnect(), 2600)
}

/* ---------- Riffs ---------- */

// Toca um riff e devolve uma função que interrompe a execução.
export function tocarRiff(riff: Riff, aoTerminar?: () => void): () => void {
  const a = audio()
  if (!a) {
    aoTerminar?.()
    return () => {}
  }
  const mestre = saida(a)
  const entrada = riff.timbre === 'bateria' ? mestre : cadeia(a, riff.timbre, mestre)
  const tempo = 60 / riff.bpm
  let t = a.currentTime + 0.05
  for (const [nota, dur] of riff.notas) {
    const segundos = dur * tempo
    if ((BATERIA as string[]).includes(nota)) agendarBateria(a, mestre, t, nota as PecaBateria)
    else if (nota !== 'pausa') {
      const timbre = riff.timbre === 'bateria' ? 'limpo' : riff.timbre
      agendarNota(a, entrada, t, frequencia(nota), segundos, timbre, timbre === 'distorcido' && !riff.simples)
    }
    t += segundos
  }
  const fim = setTimeout(() => {
    mestre.disconnect()
    aoTerminar?.()
  }, (t - a.currentTime) * 1000 + 300)
  return () => {
    clearTimeout(fim)
    mestre.gain.cancelScheduledValues(a.currentTime)
    mestre.gain.setValueAtTime(0, a.currentTime)
    mestre.disconnect()
  }
}
