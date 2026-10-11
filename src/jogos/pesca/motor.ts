// Motor da Pesca do Sushi (inspirado na pesca do Stardew).
// Posições normalizadas de 0 (fundo) a 1 (topo). Sem DOM: dá para simular e testar.

export type TipoPeixe = 'sardinha' | 'salmao' | 'atum' | 'lendario'

export interface DefPeixe {
  nome: string
  pontos: number
  velocidade: number // unidades por segundo
  intervalo: number // segundos entre mudanças de direção
  salto: number // distância máxima de cada mudança
  peso: number // chance relativa de aparecer
}

export const PEIXES: Record<TipoPeixe, DefPeixe> = {
  sardinha: { nome: 'Sardinha', pontos: 50, velocidade: 0.32, intervalo: 1.5, salto: 0.42, peso: 0.4 },
  salmao: { nome: 'Salmão', pontos: 100, velocidade: 0.5, intervalo: 1.05, salto: 0.56, peso: 0.32 },
  atum: { nome: 'Atum', pontos: 150, velocidade: 0.72, intervalo: 0.85, salto: 0.74, peso: 0.2 },
  lendario: { nome: 'Peixe Lendário', pontos: 300, velocidade: 1.0, intervalo: 0.6, salto: 0.95, peso: 0.08 },
}

export const DURACAO = 60
export const BARRA = 0.28
export const BONUS_PERFEITO = 1.5
const SUBIDA = 3.4
const GRAVIDADE = 2.6
const VEL_MAX = 1.7
const GANHO = 0.4
const PERDA = 0.28
const PAUSA = 0.75

export type Evento = { tipo: 'pegou'; peixe: TipoPeixe; pontos: number; perfeito: boolean } | { tipo: 'escapou'; peixe: TipoPeixe }

export interface EstadoMotor {
  tempo: number
  peixe: TipoPeixe
  peixePos: number
  alvo: number
  relogioPeixe: number
  barra: number // posição da base da barra
  barraVel: number
  progresso: number
  perfeito: boolean
  pausa: number
  pontos: number
  pegos: number
  oscilacao: number
}

export function sortearPeixe(rng: () => number): TipoPeixe {
  let r = rng()
  for (const [tipo, def] of Object.entries(PEIXES) as [TipoPeixe, DefPeixe][]) {
    if ((r -= def.peso) <= 0) return tipo
  }
  return 'sardinha'
}

export function novoMotor(rng: () => number): EstadoMotor {
  return {
    tempo: DURACAO,
    peixe: sortearPeixe(rng),
    peixePos: 0.5,
    alvo: 0.5,
    relogioPeixe: 0,
    barra: 0.1,
    barraVel: 0,
    progresso: 0.3,
    perfeito: true,
    pausa: 0.6,
    pontos: 0,
    pegos: 0,
    oscilacao: 0,
  }
}

export function peixeNaBarra(s: EstadoMotor) {
  return s.peixePos >= s.barra && s.peixePos <= s.barra + BARRA
}

// Avança a simulação em dt segundos. Muta o estado (roda 60x por segundo) e devolve o evento do passo.
export function passo(s: EstadoMotor, dt: number, segurando: boolean, rng: () => number): Evento | null {
  if (s.tempo <= 0) return null
  s.tempo = Math.max(0, s.tempo - dt)

  // barra: segurar sobe, soltar cai; quica no fundo
  s.barraVel += (segurando ? SUBIDA : -GRAVIDADE) * dt
  s.barraVel = Math.max(-VEL_MAX, Math.min(VEL_MAX, s.barraVel))
  s.barra += s.barraVel * dt
  if (s.barra < 0) {
    s.barra = 0
    s.barraVel = -s.barraVel * 0.35
  }
  if (s.barra > 1 - BARRA) {
    s.barra = 1 - BARRA
    s.barraVel = 0
  }

  if (s.pausa > 0) {
    s.pausa -= dt
    return null
  }

  // peixe: escolhe um alvo de tempos em tempos e nada até ele
  const def = PEIXES[s.peixe]
  s.relogioPeixe -= dt
  if (s.relogioPeixe <= 0) {
    const desloc = (rng() * 2 - 1) * def.salto
    s.alvo = Math.max(0.03, Math.min(0.97, s.peixePos + desloc))
    s.relogioPeixe = def.intervalo * (0.6 + rng() * 0.8)
  }
  const d = s.alvo - s.peixePos
  s.peixePos += Math.sign(d) * Math.min(Math.abs(d), def.velocidade * dt)
  if (s.peixe === 'lendario') {
    s.oscilacao += dt * 9
    s.peixePos = Math.max(0.02, Math.min(0.98, s.peixePos + Math.sin(s.oscilacao) * 0.004))
  }

  if (peixeNaBarra(s)) s.progresso += GANHO * dt
  else {
    s.progresso -= PERDA * dt
    s.perfeito = false
  }

  if (s.progresso >= 1) {
    const pontos = Math.round(def.pontos * (s.perfeito ? BONUS_PERFEITO : 1))
    const ev: Evento = { tipo: 'pegou', peixe: s.peixe, pontos, perfeito: s.perfeito }
    s.pontos += pontos
    s.pegos++
    proximoPeixe(s, rng)
    return ev
  }
  if (s.progresso <= 0) {
    const ev: Evento = { tipo: 'escapou', peixe: s.peixe }
    proximoPeixe(s, rng)
    return ev
  }
  return null
}

function proximoPeixe(s: EstadoMotor, rng: () => number) {
  s.peixe = sortearPeixe(rng)
  s.peixePos = 0.2 + rng() * 0.6
  s.alvo = s.peixePos
  s.relogioPeixe = 0.3
  s.progresso = 0.3
  s.perfeito = true
  s.pausa = PAUSA
}

// Gerador pseudoaleatório com semente (para simulações reproduzíveis)
export function rngSemente(semente: number) {
  let a = semente >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
