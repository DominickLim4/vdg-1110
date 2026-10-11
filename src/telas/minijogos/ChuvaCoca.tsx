import { useEffect, useRef, useState } from 'react'
import { som } from '../../componentes/som'
import { urlSprite } from '../../sprites/sprites'

const L = 300
const A = 380
const VIDAS = 3

type Tipo = 'zero' | 'normal' | 'nigiri'

interface Item {
  tipo: Tipo
  x: number
  y: number
  v: number
}

// Pegue as Coca Zero que caem. Coca normal tira uma vida; nigiri vale 3.
export function ChuvaCoca() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const alvoX = useRef(L / 2)
  const [fase, setFase] = useState<'pronto' | 'jogando' | 'fim'>('pronto')
  const [pontos, setPontos] = useState(0)
  const [vidas, setVidas] = useState(VIDAS)
  const [recorde, setRecorde] = useState(0)

  useEffect(() => {
    const ctx = canvas.current!.getContext('2d')!
    ctx.imageSmoothingEnabled = false
    const zero = urlSprite('coca').canvas
    const normal = urlSprite('coca', 'cocaNormal').canvas
    const nigiri = urlSprite('nigiri').canvas
    const kimi = urlSprite('kimi').canvas

    const cenario = () => {
      const g = ctx.createLinearGradient(0, 0, 0, A)
      g.addColorStop(0, '#9ad8ec')
      g.addColorStop(1, '#e6f6ee')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, L, A)
      ctx.fillStyle = '#78b159'
      ctx.fillRect(0, A - 24, L, 24)
      ctx.fillStyle = '#5b9441'
      ctx.fillRect(0, A - 24, L, 3)
    }

    const cesta = (x: number) => {
      // geladeirinha (cooler) com o Kimi espiando
      ctx.drawImage(kimi, x - 16, A - 74, 32, 26)
      ctx.fillStyle = '#3A2214'
      ctx.fillRect(x - 30, A - 52, 60, 30)
      ctx.fillStyle = '#5FB3CF'
      ctx.fillRect(x - 27, A - 49, 54, 24)
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(x - 27, A - 49, 54, 5)
      ctx.fillStyle = '#3F8FB0'
      ctx.fillRect(x - 6, A - 40, 12, 4)
    }

    if (fase !== 'jogando') {
      cenario()
      cesta(alvoX.current)
      return
    }

    let itens: Item[] = []
    let x = alvoX.current
    let proximo = 0.4
    let tempo = 0
    let pts = 0
    let vds = VIDAS
    let ultimo = performance.now()
    let raf = 0

    const quadro = (agora: number) => {
      const dt = Math.min(0.033, (agora - ultimo) / 1000)
      ultimo = agora
      tempo += dt
      proximo -= dt
      const nivel = Math.min(2.2, 1 + tempo / 30)
      if (proximo <= 0) {
        const r = Math.random()
        const tipo: Tipo = r < 0.62 ? 'zero' : r < 0.92 ? 'normal' : 'nigiri'
        itens.push({ tipo, x: 20 + Math.random() * (L - 40), y: -40, v: (90 + Math.random() * 60) * nivel })
        proximo = (0.75 + Math.random() * 0.5) / nivel
      }
      x += (alvoX.current - x) * Math.min(1, dt * 14)

      for (const it of itens) it.y += it.v * dt
      const restantes: Item[] = []
      for (const it of itens) {
        const pegou = it.y > A - 70 && it.y < A - 30 && Math.abs(it.x - x) < 38
        if (pegou) {
          if (it.tipo === 'normal') {
            vds--
            som.erro()
            setVidas(vds)
          } else {
            pts += it.tipo === 'nigiri' ? 3 : 1
            som.moeda()
            setPontos(pts)
          }
          continue
        }
        if (it.y < A + 40) restantes.push(it)
      }
      itens = restantes

      cenario()
      for (const it of itens) {
        const img = it.tipo === 'zero' ? zero : it.tipo === 'normal' ? normal : nigiri
        const w = it.tipo === 'nigiri' ? 36 : 25
        const h = it.tipo === 'nigiri' ? 24 : 33
        ctx.drawImage(img, Math.round(it.x - w / 2), Math.round(it.y - h / 2), w, h)
      }
      cesta(x)

      if (vds <= 0) {
        setFase('fim')
        setRecorde((r) => Math.max(r, pts))
        return
      }
      raf = requestAnimationFrame(quadro)
    }
    raf = requestAnimationFrame(quadro)
    return () => cancelAnimationFrame(raf)
  }, [fase])

  const mover = (e: React.PointerEvent) => {
    const r = canvas.current!.getBoundingClientRect()
    alvoX.current = Math.max(30, Math.min(L - 30, ((e.clientX - r.left) / r.width) * L))
  }

  const comecar = () => {
    som.toque()
    setPontos(0)
    setVidas(VIDAS)
    setFase('jogando')
  }

  return (
    <>
      <div className="mini-placar">
        <span className="placa">{'♥'.repeat(Math.max(0, vidas))}{'♡'.repeat(Math.max(0, VIDAS - vidas))}</span>
        <span className="placa">{pontos} pontos</span>
        <span className="placa">Recorde {recorde}</span>
      </div>
      <div className="chuva" onPointerDown={mover} onPointerMove={mover}>
        <canvas ref={canvas} width={L} height={A} className="chuva__canvas pixel" aria-label="Chuva de Coca Zero" />
        {fase !== 'jogando' && (
          <div className="chuva__sobre">
            <p className="moldura moldura--clara">
              {fase === 'pronto'
                ? 'Arraste o dedo para mover a geladeira. Pegue as Coca Zero, fuja da Coca normal!'
                : `Fim! ${pontos} pontos. A Coca normal venceu dessa vez.`}
            </p>
            <button className="botao botao--verde" onClick={comecar}>
              {fase === 'pronto' ? 'Começar' : 'Jogar de novo'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
