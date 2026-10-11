import { useEffect, useState } from 'react'

export type IdTela = 'casa' | 'fliperama' | 'bau' | 'kimi' | 'nos' | 'receita' | 'carta' | 'parquinho' | 'sala-secreta' | 'sushi'
export type IdJogo = 'quiz' | 'termo' | 'memoria' | 'kimi-run' | 'pesca'

export type Rota = { tela: IdTela; jogo?: undefined } | { tela: 'jogo'; jogo: IdJogo }

const TELAS: IdTela[] = ['casa', 'fliperama', 'bau', 'kimi', 'nos', 'receita', 'carta', 'parquinho', 'sala-secreta', 'sushi']
const JOGOS: IdJogo[] = ['quiz', 'termo', 'memoria', 'kimi-run', 'pesca']

function ler(): Rota {
  const [a, b] = location.hash.replace(/^#\/?/, '').split('/')
  if (a === 'jogo' && JOGOS.includes(b as IdJogo)) return { tela: 'jogo', jogo: b as IdJogo }
  if (TELAS.includes(a as IdTela)) return { tela: a as IdTela }
  return { tela: 'casa' }
}

export function irPara(destino: IdTela | `jogo/${IdJogo}`) {
  location.hash = `/${destino}`
}

export function chaveRota(r: Rota) {
  return r.tela === 'jogo' ? `jogo/${r.jogo}` : r.tela
}

export function useRota() {
  const [rota, setRota] = useState(ler)
  useEffect(() => {
    const aoMudar = () => setRota(ler())
    window.addEventListener('hashchange', aoMudar)
    return () => window.removeEventListener('hashchange', aoMudar)
  }, [])
  return rota
}
