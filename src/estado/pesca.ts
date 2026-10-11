// Regras do presente em dinheiro (Pesca do Sushi).
// Invariantes: no máximo 3 tentativas; uma tentativa conta assim que começa;
// vale a melhor pontuação; ao finalizar, a faixa mínima é prata; finalizado é definitivo.

export type Faixa = 'prata' | 'ouro' | 'iridio'

export const TENTATIVAS_MAX = 3

export const LIMITES: Record<Faixa, number> = { prata: 400, ouro: 800, iridio: 1300 }

export interface EstadoPesca {
  tentativas: number[]
  emAndamento: boolean
  finalizado?: { pontos: number; faixa: Faixa; em: string }
}

export const estadoPescaInicial: EstadoPesca = { tentativas: [], emAndamento: false }

export function faixaDe(pontos: number): Faixa | null {
  if (pontos >= LIMITES.iridio) return 'iridio'
  if (pontos >= LIMITES.ouro) return 'ouro'
  if (pontos >= LIMITES.prata) return 'prata'
  return null
}

export function podeJogar(s: EstadoPesca): boolean {
  return !s.finalizado && s.tentativas.length < TENTATIVAS_MAX
}

export function melhorPontuacao(s: EstadoPesca): number {
  return s.tentativas.length ? Math.max(...s.tentativas) : 0
}

export function iniciarTentativa(s: EstadoPesca): EstadoPesca {
  if (!podeJogar(s)) throw new Error('Sem tentativas disponíveis')
  return { ...s, tentativas: [...s.tentativas, 0], emAndamento: true }
}

export function registrarResultado(s: EstadoPesca, pontos: number): EstadoPesca {
  if (!s.emAndamento) return s
  const tentativas = [...s.tentativas]
  tentativas[tentativas.length - 1] = Math.max(0, Math.round(pontos))
  return { ...s, tentativas, emAndamento: false }
}

// Guarda os pontos da tentativa em andamento (a cada peixe), para não perder nada se a página recarregar.
export function pontuacaoParcial(s: EstadoPesca, pontos: number): EstadoPesca {
  if (!s.emAndamento) return s
  const tentativas = [...s.tentativas]
  tentativas[tentativas.length - 1] = Math.max(0, Math.round(pontos))
  return { ...s, tentativas }
}

// Tentativa interrompida (recarregou ou saiu no meio): fecha com o que já tinha sido pescado.
export function encerrarInterrompida(s: EstadoPesca): EstadoPesca {
  return s.emAndamento ? { ...s, emAndamento: false } : s
}

export function finalizarPesca(s: EstadoPesca, em: string): EstadoPesca {
  if (s.finalizado) return s
  if (s.tentativas.length === 0) throw new Error('Jogue pelo menos uma vez antes de finalizar')
  const pontos = melhorPontuacao(s)
  return { ...s, emAndamento: false, finalizado: { pontos, faixa: faixaDe(pontos) ?? 'prata', em } }
}
