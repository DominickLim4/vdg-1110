import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { som } from '../../componentes/som'
import { Sprite } from '../../componentes/Sprite'
import type { Variacao } from '../../sprites/sprites'

const DURACAO = 30
const BURACOS = 9
const CORES: (Variacao | undefined)[] = [undefined, 'junimoRoxo', 'junimoAmarelo', 'junimoRosa']

interface Aparicao {
  id: number
  tipo: 'junimo' | 'joja'
  cor?: Variacao
  ate: number
}

// Acerte os Junimos que aparecem nos buracos. Joja Cola tira pontos.
export function Junimos() {
  const [buracos, setBuracos] = useState<(Aparicao | null)[]>(Array(BURACOS).fill(null))
  const [pontos, setPontos] = useState(0)
  const [tempo, setTempo] = useState(DURACAO)
  const [fase, setFase] = useState<'pronto' | 'jogando' | 'fim'>('pronto')
  const [recorde, setRecorde] = useState(0)
  const [efeitos, setEfeitos] = useState<{ id: number; buraco: number; texto: string }[]>([])
  const contador = useRef(0)

  const atual = useRef<(Aparicao | null)[]>(Array(BURACOS).fill(null))

  const publicar = (novos: (Aparicao | null)[]) => {
    atual.current = novos
    setBuracos(novos)
  }

  useEffect(() => {
    if (fase !== 'jogando') return
    const inicio = performance.now()
    let proximo = 0
    const tick = setInterval(() => {
      const agora = performance.now()
      const restante = Math.max(0, DURACAO - (agora - inicio) / 1000)
      setTempo(Math.ceil(restante))
      if (restante <= 0) {
        clearInterval(tick)
        publicar(Array(BURACOS).fill(null))
        setFase('fim')
        return
      }
      const acelera = 1 - (DURACAO - restante) / (DURACAO * 2)
      const novos = atual.current.map((b) => (b && b.ate < agora ? null : b))
      if (agora >= proximo) {
        const livres = novos.map((b, i) => (b ? -1 : i)).filter((i) => i >= 0)
        if (livres.length) {
          const i = livres[Math.floor(Math.random() * livres.length)]
          novos[i] = {
            id: ++contador.current,
            tipo: Math.random() < 0.18 ? 'joja' : 'junimo',
            cor: CORES[Math.floor(Math.random() * CORES.length)],
            ate: agora + (900 + Math.random() * 500) * acelera,
          }
        }
        proximo = agora + (450 + Math.random() * 450) * acelera
      }
      publicar(novos)
    }, 60)
    return () => clearInterval(tick)
  }, [fase])

  useEffect(() => {
    if (fase === 'fim') setRecorde((r) => Math.max(r, pontos))
  }, [fase, pontos])

  const acertar = (i: number) => {
    const b = atual.current[i]
    if (fase !== 'jogando' || !b) return
    const ganho = b.tipo === 'junimo' ? 1 : -2
    ganho > 0 ? som.moeda() : som.erro()
    setPontos((p) => Math.max(0, p + ganho))
    publicar(atual.current.map((x, k) => (k === i ? null : x)))
    const id = performance.now()
    setEfeitos((e) => [...e.slice(-5), { id, buraco: i, texto: ganho > 0 ? '+1' : 'Joja! −2' }])
    setTimeout(() => setEfeitos((e) => e.filter((x) => x.id !== id)), 700)
  }

  const comecar = () => {
    som.toque()
    setPontos(0)
    setTempo(DURACAO)
    publicar(Array(BURACOS).fill(null))
    setFase('jogando')
  }

  return (
    <>
      <div className="mini-placar">
        <span className="placa">⏱ {tempo}s</span>
        <span className="placa">{pontos} pontos</span>
        <span className="placa">Recorde {recorde}</span>
      </div>
      <div className="junimos">
        {buracos.map((b, i) => (
          <button key={i} className="junimos__buraco" onPointerDown={() => acertar(i)} aria-label={b ? (b.tipo === 'junimo' ? 'Junimo' : 'Joja Cola') : 'buraco vazio'}>
            <AnimatePresence>
              {b && (
                <motion.span key={b.id} className="junimos__bicho" initial={{ y: '90%' }} animate={{ y: '0%' }} exit={{ y: '90%', opacity: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 26 }}>
                  {b.tipo === 'junimo' ? <Sprite nome="junimo" variacao={b.cor} escala={4} /> : <Sprite nome="coca" variacao="joja" escala={4} />}
                </motion.span>
              )}
            </AnimatePresence>
            {efeitos
              .filter((e) => e.buraco === i)
              .map((e) => (
                <motion.span key={e.id} className={`junimos__efeito ${e.texto.startsWith('+') ? '' : 'junimos__efeito--ruim'}`} initial={{ y: 0, opacity: 1 }} animate={{ y: -40, opacity: 0 }} transition={{ duration: 0.7 }}>
                  {e.texto}
                </motion.span>
              ))}
          </button>
        ))}
      </div>
      {fase !== 'jogando' && (
        <div className="mini-acoes">
          {fase === 'fim' && <p className="brinquedo__resultado">{pontos >= 25 ? `${pontos} Junimos! O Centro Comunitário agradece.` : `${pontos} pontos. Os Junimos são rápidos, hein?`}</p>}
          <button className="botao botao--verde botao--largo" onClick={comecar}>
            {fase === 'pronto' ? 'Começar (30s)' : 'Jogar de novo'}
          </button>
        </div>
      )}
    </>
  )
}
