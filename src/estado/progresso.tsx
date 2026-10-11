import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { estadoPescaInicial, type EstadoPesca } from './pesca'

export type IdVale = 'date' | 'transa' | 'abracos' | 'kimi'
export type IdConquista =
  | 'portao'
  | 'carta'
  | 'velas'
  | 'sala-secreta'
  | 'kimi-todas'
  | 'pesca-perfeita'
  | 'quiz-perfeito'
  | 'coca'
  | 'd20-critico'
  | 'sushi-chef'

export interface Progresso {
  versao: 1
  portaoAberto: boolean
  aberturaVista: boolean
  vales: Partial<Record<IdVale, { desbloqueadoEm: string; resgatadoEm?: string }>>
  pescaResgatadaEm?: string
  pesca: EstadoPesca
  conquistas: Partial<Record<IdConquista, string>>
  energia: number // 0–100, só de brincadeira (lata de Coca Zero do HUD)
  som: boolean
}

const CHAVE = 'vale-da-geo:v1'

const inicial: Progresso = {
  versao: 1,
  portaoAberto: false,
  aberturaVista: false,
  vales: {},
  pesca: estadoPescaInicial,
  conquistas: {},
  energia: 100,
  som: true,
}

function carregar(): Progresso {
  try {
    const bruto = localStorage.getItem(CHAVE)
    if (!bruto) return inicial
    const salvo = JSON.parse(bruto) as Partial<Progresso>
    if (salvo.versao !== 1) return inicial
    return { ...inicial, ...salvo, pesca: { ...estadoPescaInicial, ...salvo.pesca } }
  } catch {
    return inicial
  }
}

function salvar(p: Progresso) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(p))
  } catch {
    // aba anônima ou armazenamento cheio: o site segue funcionando, só não lembra o progresso
  }
}

export function agoraISO() {
  return new Date().toISOString()
}

interface Api {
  p: Progresso
  atualizar: (f: (p: Progresso) => Progresso) => void
  desbloquearVale: (id: IdVale) => void
  conquistar: (id: IdConquista) => boolean
  gastarEnergia: (n: number) => void
  resetar: () => void
}

const Ctx = createContext<Api | null>(null)

export function ProvedorProgresso({ children }: { children: ReactNode }) {
  const [p, setP] = useState<Progresso>(carregar)

  useEffect(() => salvar(p), [p])

  const atualizar = useCallback((f: (p: Progresso) => Progresso) => setP(f), [])

  const desbloquearVale = useCallback(
    (id: IdVale) =>
      setP((s) => (s.vales[id] ? s : { ...s, vales: { ...s.vales, [id]: { desbloqueadoEm: agoraISO() } } })),
    [],
  )

  const conquistar = useCallback(
    (id: IdConquista) => {
      if (p.conquistas[id]) return false
      setP((s) => (s.conquistas[id] ? s : { ...s, conquistas: { ...s.conquistas, [id]: agoraISO() } }))
      return true
    },
    [p.conquistas],
  )

  const gastarEnergia = useCallback(
    (n: number) => setP((s) => ({ ...s, energia: Math.max(5, Math.min(100, s.energia - n)) })),
    [],
  )

  const resetar = useCallback(() => setP({ ...inicial, portaoAberto: true }), [])

  const api = useMemo(
    () => ({ p, atualizar, desbloquearVale, conquistar, gastarEnergia, resetar }),
    [p, atualizar, desbloquearVale, conquistar, gastarEnergia, resetar],
  )
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useProgresso() {
  const api = useContext(Ctx)
  if (!api) throw new Error('useProgresso fora do ProvedorProgresso')
  return api
}
