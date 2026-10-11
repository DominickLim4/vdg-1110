import { motion } from 'motion/react'
import { useRef, useState } from 'react'
import { som } from '../componentes/som'
import { Sprite } from '../componentes/Sprite'
import { useProgresso } from '../estado/progresso'
import { irPara, type IdTela } from '../estado/rota'
import type { NomeSprite } from '../sprites/sprites'
import './casa.css'

interface Comodo {
  tela: IdTela
  nome: string
  sprite: NomeSprite
  papel: string
  gigante?: NomeSprite
}

const COMODOS: Comodo[] = [
  { tela: 'kimi', nome: 'Quarto do Kimi', sprite: 'kimi', papel: 'papel--grama', gigante: 'osso' },
  { tela: 'nos', nome: 'Parede de fotos', sprite: 'camera', papel: 'papel--rosa' },
  { tela: 'receita', nome: 'Consultório', sprite: 'cerebro', papel: 'papel--lilas', gigante: 'pilula' },
  { tela: 'carta', nome: 'Escrivaninha', sprite: 'envelope', papel: 'papel--creme' },
  { tela: 'bau', nome: 'Depósito do Baú', sprite: 'bau', papel: 'papel--madeira' },
]

function Estante() {
  const [progresso, setProgresso] = useState(0)
  const [aberta, setAberta] = useState(false)
  const timer = useRef<number | null>(null)
  const { conquistar } = useProgresso()

  const parar = () => {
    if (timer.current) cancelAnimationFrame(timer.current)
    timer.current = null
    if (!aberta) setProgresso(0)
  }

  const comecar = () => {
    const inicio = performance.now()
    const passo = (t: number) => {
      const p = Math.min(1, (t - inicio) / 1400)
      setProgresso(p)
      if (p >= 1) {
        setAberta(true)
        som.bau()
        conquistar('sala-secreta')
        setTimeout(() => irPara('sala-secreta'), 900)
        return
      }
      timer.current = requestAnimationFrame(passo)
    }
    timer.current = requestAnimationFrame(passo)
  }

  return (
    <div className="comodo comodo--estante papel--azulejo">
      <div className="passagem" aria-hidden>
        <span>?</span>
      </div>
      <motion.button
        className="estante"
        aria-label="Estante de livros. Segure para empurrar."
        onPointerDown={comecar}
        onPointerUp={parar}
        onPointerLeave={parar}
        onPointerCancel={parar}
        onContextMenu={(e) => e.preventDefault()}
        animate={aberta ? { x: '78%' } : { x: progresso > 0 ? [0, -2, 2, 0] : 0 }}
        transition={aberta ? { type: 'spring', stiffness: 120, damping: 14 } : { duration: 0.2, repeat: progresso > 0 ? Infinity : 0 }}
      >
        {Array.from({ length: 3 }, (_, i) => (
          <span key={i} className="estante__prateleira">
            {Array.from({ length: 6 }, (_, j) => (
              <span key={j} className={`livro livro--${(i * 6 + j) % 5}`} />
            ))}
          </span>
        ))}
      </motion.button>
      <span className="comodo__placa placa">{progresso > 0 && !aberta ? 'Empurrando…' : 'Estante'}</span>
    </div>
  )
}

export function Casa() {
  const { p } = useProgresso()
  const presentes = Object.keys(p.vales).length + (p.pesca.finalizado ? 1 : 0)
  const [cutucado, setCutucado] = useState<string | null>(null)

  const entrar = (tela: IdTela) => {
    som.toque()
    irPara(tela)
  }

  return (
    <div className="tela casa">
      <div className="casa__telhado" aria-hidden>
        <span className="casa__chamine" />
      </div>
      <h1 className="casa__nome placa">Casa da Geo</h1>

      <div className="casa__corpo">
        <button className="comodo comodo--largo papel--noite" onClick={() => entrar('fliperama')}>
          <span className="comodo__fliper">
            <Sprite nome="fliperama" escala={4} />
            <Sprite nome="presente" escala={3} />
            <Sprite nome="fliperama" escala={4} />
          </span>
          <span className="comodo__placa placa">Sala de jogos</span>
          <span className="comodo__selo afundado">{presentes}/5 presentes</span>
        </button>

        {COMODOS.map((c) => (
          <button
            key={c.tela}
            className={`comodo ${c.papel} ${c.tela === 'carta' && !p.conquistas.carta ? 'comodo--brilho' : ''}`}
            onClick={() => entrar(c.tela)}
          >
            <Sprite nome={c.sprite} escala={4} />
            <span className="comodo__placa placa">{c.nome}</span>
          </button>
        ))}

        <Estante />

        <button className="comodo comodo--largo comodo--cozinha papel--azulejo-verde" onClick={() => entrar('sushi')}>
          <span className="comodo__fliper">
            <Sprite nome="peixe" variacao="salmao" escala={4} />
            <Sprite nome="nigiri" escala={5} />
            <Sprite nome="coca" escala={4} />
          </span>
          <span className="comodo__placa placa">Cozinha: monte seu sushi</span>
        </button>
      </div>

      <div className="casa__quintal">
        <motion.button
          className="gigante"
          aria-label="Lata gigante de Coca Zero"
          whileTap={{ scale: 0.9, rotate: -6 }}
          onClick={() => {
            som.bolha()
            setCutucado('A lata é gigante. A sede também.')
          }}
        >
          <Sprite nome="coca" escala={7} />
        </motion.button>
        <button className="comodo comodo--parquinho" onClick={() => entrar('parquinho')}>
          <Sprite nome="d20" escala={4} />
          <span className="comodo__placa placa">Parquinho</span>
        </button>
        <motion.button
          className="gigante"
          aria-label="Nigiri gigante"
          whileTap={{ scale: 0.9, rotate: 6 }}
          onClick={() => {
            som.bolha()
            setCutucado('Um nigiri do tamanho de uma porta. Sonho realizado.')
          }}
        >
          <Sprite nome="nigiri" escala={6} />
        </motion.button>
      </div>
      <p className="casa__fala" role="status">
        {cutucado ?? 'Toque num cômodo para entrar. Dizem que a estante esconde alguma coisa…'}
      </p>
    </div>
  )
}
