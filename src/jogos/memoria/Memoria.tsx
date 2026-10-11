import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { BarraJogo } from '../../componentes/BarraJogo'
import { Recompensa } from '../../componentes/Recompensa'
import { som } from '../../componentes/som'
import { Sprite } from '../../componentes/Sprite'
import { useProgresso } from '../../estado/progresso'
import type { NomeSprite } from '../../sprites/sprites'
import { embaralhar } from '../embaralhar'
import './memoria.css'

const FIGURAS: NomeSprite[] = ['nigiri', 'coca', 'd20', 'guitarra', 'haltere', 'cerebro', 'girassol', 'kimi']

interface Carta {
  id: number
  figura: NomeSprite
}

const novoBaralho = (): Carta[] => embaralhar([...FIGURAS, ...FIGURAS]).map((figura, id) => ({ id, figura }))

export function Memoria() {
  const { p, desbloquearVale } = useProgresso()
  const [cartas, setCartas] = useState(novoBaralho)
  const [viradas, setViradas] = useState<number[]>([])
  const [achadas, setAchadas] = useState<Set<NomeSprite>>(new Set())
  const [jogadas, setJogadas] = useState(0)
  const [premio, setPremio] = useState(false)
  const venceu = achadas.size === FIGURAS.length

  useEffect(() => {
    if (viradas.length !== 2) return
    const [a, b] = viradas.map((id) => cartas[id])
    if (a.figura === b.figura) {
      som.moeda()
      setAchadas((s) => new Set(s).add(a.figura))
      setViradas([])
      return
    }
    const t = setTimeout(() => setViradas([]), 750)
    return () => clearTimeout(t)
  }, [viradas, cartas])

  useEffect(() => {
    if (!venceu) return
    som.vitoria()
    if (!p.vales.abracos) {
      desbloquearVale('abracos')
      const t = setTimeout(() => setPremio(true), 700)
      return () => clearTimeout(t)
    }
  }, [venceu]) // eslint-disable-line react-hooks/exhaustive-deps

  const virar = (c: Carta) => {
    if (viradas.length === 2 || viradas.includes(c.id) || achadas.has(c.figura)) return
    som.toque()
    setViradas((v) => [...v, c.id])
    if (viradas.length === 1) setJogadas((j) => j + 1)
  }

  const recomecar = () => {
    setCartas(novoBaralho())
    setViradas([])
    setAchadas(new Set())
    setJogadas(0)
  }

  return (
    <div className="memoria">
      <BarraJogo titulo="Memória" />
      <div className="memoria__placar">
        <span className="placa">Jogadas: {jogadas}</span>
        <span className="placa">Pares: {achadas.size}/8</span>
      </div>

      <div className="memoria__mesa">
        {cartas.map((c) => {
          const aberta = viradas.includes(c.id) || achadas.has(c.figura)
          return (
            <button key={c.id} className="carta-mem" onClick={() => virar(c)} aria-label={aberta ? c.figura : 'carta virada'}>
              <motion.span className="carta-mem__giro" animate={{ rotateY: aberta ? 180 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
                <span className="carta-mem__verso" />
                <span className={`carta-mem__frente ${achadas.has(c.figura) ? 'carta-mem__frente--achada' : ''}`}>
                  <Sprite nome={c.figura} escala={3} />
                </span>
              </motion.span>
            </button>
          )
        })}
      </div>

      {venceu && (
        <div className="memoria__fim">
          <p className="moldura moldura--clara">Todos os pares em {jogadas} jogadas! Agora vem o abraço de verdade.</p>
          <button className="botao botao--verde botao--largo" onClick={recomecar}>
            Jogar de novo
          </button>
        </div>
      )}

      <Recompensa vale="abracos" aberta={premio} aoFechar={() => setPremio(false)} />
    </div>
  )
}
