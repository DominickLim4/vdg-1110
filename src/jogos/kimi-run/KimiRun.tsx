import { useEffect, useRef, useState } from 'react'
import { BarraJogo } from '../../componentes/BarraJogo'
import { Recompensa } from '../../componentes/Recompensa'
import { som } from '../../componentes/som'
import { Sprite } from '../../componentes/Sprite'
import { useProgresso } from '../../estado/progresso'
import { urlSprite, type NomeSprite } from '../../sprites/sprites'
import './kimi-run.css'

const L = 320 // largura lógica
const A = 220 // altura lógica
const CHAO = 186
const META = 15
const GRAVIDADE = 1500
const PULO = -470

type Fase = 'pronto' | 'correndo' | 'fim' | 'venceu'

interface Coisa {
  tipo: 'obstaculo' | 'petisco'
  sprite: NomeSprite
  x: number
  y: number
  w: number
  h: number
  pego?: boolean
}

const OBSTACULOS: { sprite: NomeSprite; escala: number; frase: string }[] = [
  { sprite: 'banheira', escala: 2, frase: 'A banheira pegou o Kimi. Hora do banho!' },
  { sprite: 'aspirador', escala: 2, frase: 'O aspirador venceu dessa vez.' },
  { sprite: 'gato', escala: 2, frase: 'O gato deu um tapa no Kimi. Respeita o gato.' },
]

export function KimiRun() {
  const { p, desbloquearVale, gastarEnergia } = useProgresso()
  const canvas = useRef<HTMLCanvasElement>(null)
  const [fase, setFase] = useState<Fase>('pronto')
  const [petiscos, setPetiscos] = useState(0)
  const [recorde, setRecorde] = useState(0)
  const [frase, setFrase] = useState('Toque na tela para pular. Toque de novo no ar para o pulo duplo.')
  const [premio, setPremio] = useState(false)
  const pular = useRef<() => void>(() => {})

  useEffect(() => {
    if (fase !== 'correndo') return
    const ctx = canvas.current!.getContext('2d')!
    ctx.imageSmoothingEnabled = false
    const s1 = urlSprite('kimiCorre1').canvas
    const s2 = urlSprite('kimiCorre2').canvas
    const kimi = { x: 30, y: CHAO - 29, vy: 0, w: 44, h: 29, pulos: 0 }
    let coisas: Coisa[] = []
    let vel = 150
    let dist = 0
    let proximo = 1.2
    let pegos = 0
    let ultimo = performance.now()
    let raf = 0
    let vivo = true

    pular.current = () => {
      if (kimi.pulos >= 2) return
      kimi.vy = kimi.pulos === 0 ? PULO : PULO * 0.85
      kimi.pulos++
      som.pulo()
    }

    const gerar = () => {
      if (Math.random() < 0.62) {
        const o = OBSTACULOS[Math.floor(Math.random() * OBSTACULOS.length)]
        const sp = urlSprite(o.sprite)
        coisas.push({ tipo: 'obstaculo', sprite: o.sprite, x: L + 10, y: CHAO - sp.h * o.escala, w: sp.w * o.escala, h: sp.h * o.escala })
        if (Math.random() < 0.6) coisas.push({ tipo: 'petisco', sprite: 'osso', x: L + 10 + (sp.w * o.escala) / 2 - 9, y: CHAO - sp.h * o.escala - 42, w: 18, h: 8 })
      } else {
        const alto = Math.random() < 0.5
        for (let k = 0; k < 3; k++) coisas.push({ tipo: 'petisco', sprite: 'osso', x: L + 10 + k * 26, y: alto ? CHAO - 80 : CHAO - 26, w: 18, h: 8 })
      }
    }

    const colide = (a: { x: number; y: number; w: number; h: number }, b: Coisa, folga: number) =>
      a.x + folga < b.x + b.w && a.x + a.w - folga > b.x && a.y + folga < b.y + b.h && a.y + a.h - folga > b.y

    const desenharCenario = () => {
      const ceu = ctx.createLinearGradient(0, 0, 0, A)
      ceu.addColorStop(0, '#9ad8ec')
      ceu.addColorStop(1, '#e6f6ee')
      ctx.fillStyle = ceu
      ctx.fillRect(0, 0, L, A)
      ctx.fillStyle = '#ffffff'
      for (let k = 0; k < 3; k++) {
        const x = ((k * 140 - dist * 0.1) % 420 + 420) % 420 - 60
        ctx.fillRect(x, 24 + k * 14, 40, 8)
        ctx.fillRect(x + 8, 18 + k * 14, 22, 6)
      }
      ctx.fillStyle = '#9fd08a'
      for (let k = 0; k < 4; k++) {
        const x = ((k * 120 - dist * 0.3) % 480 + 480) % 480 - 80
        ctx.beginPath()
        ctx.ellipse(x + 60, CHAO, 80, 46, 0, Math.PI, 0)
        ctx.fill()
      }
      ctx.fillStyle = '#78b159'
      ctx.fillRect(0, CHAO, L, A - CHAO)
      ctx.fillStyle = '#5b9441'
      ctx.fillRect(0, CHAO, L, 3)
      ctx.fillStyle = '#6da54f'
      for (let x = -((dist | 0) % 16); x < L; x += 16) ctx.fillRect(x, CHAO + 10, 8, 4)
      ctx.fillStyle = '#c9822f'
      for (let x = -((dist | 0) % 24); x < L; x += 24) ctx.fillRect(x, CHAO + 20, 12, 3)
    }

    const quadro = (agora: number) => {
      if (!vivo) return
      const dt = Math.min(0.033, (agora - ultimo) / 1000)
      ultimo = agora
      vel = Math.min(320, vel + dt * 6)
      dist += vel * dt
      proximo -= dt
      if (proximo <= 0) {
        gerar()
        proximo = 0.9 + Math.random() * 1.1 - Math.min(0.4, (vel - 150) / 500)
      }

      kimi.vy += GRAVIDADE * dt
      kimi.y += kimi.vy * dt
      if (kimi.y >= CHAO - kimi.h) {
        kimi.y = CHAO - kimi.h
        kimi.vy = 0
        kimi.pulos = 0
      }

      coisas.forEach((c) => (c.x -= vel * dt))
      coisas = coisas.filter((c) => c.x + c.w > -10 && !c.pego)

      for (const c of coisas) {
        if (c.tipo === 'petisco' && colide(kimi, c, 0)) {
          c.pego = true
          pegos++
          som.moeda()
          setPetiscos(pegos)
          if (pegos >= META) {
            vivo = false
            setFase('venceu')
            return
          }
        } else if (c.tipo === 'obstaculo' && colide(kimi, c, 6)) {
          vivo = false
          som.erro()
          const o = OBSTACULOS.find((x) => x.sprite === c.sprite)!
          setFrase(o.frase)
          setRecorde((r) => Math.max(r, pegos))
          setFase('fim')
          return
        }
      }

      desenharCenario()
      for (const c of coisas) {
        const sp = urlSprite(c.sprite)
        ctx.drawImage(sp.canvas, Math.round(c.x), Math.round(c.y), c.w, c.h)
      }
      const quadroKimi = kimi.y < CHAO - kimi.h - 1 ? s2 : Math.floor(dist / 18) % 2 ? s1 : s2
      ctx.drawImage(quadroKimi, Math.round(kimi.x), Math.round(kimi.y), kimi.w, kimi.h)

      raf = requestAnimationFrame(quadro)
    }
    raf = requestAnimationFrame(quadro)
    return () => {
      vivo = false
      cancelAnimationFrame(raf)
    }
  }, [fase])

  useEffect(() => {
    if (fase !== 'venceu') return
    som.vitoria()
    gastarEnergia(10)
    setRecorde((r) => Math.max(r, META))
    setFrase('15 petiscos! O Kimi está orgulhoso e cheio de energia para o passeio.')
    if (!p.vales.kimi) {
      desbloquearVale('kimi')
      const t = setTimeout(() => setPremio(true), 600)
      return () => clearTimeout(t)
    }
  }, [fase]) // eslint-disable-line react-hooks/exhaustive-deps

  // Desenha a tela parada (antes de começar)
  useEffect(() => {
    if (fase !== 'pronto') return
    const ctx = canvas.current!.getContext('2d')!
    ctx.imageSmoothingEnabled = false
    ctx.fillStyle = '#c9ecf5'
    ctx.fillRect(0, 0, L, A)
    ctx.fillStyle = '#78b159'
    ctx.fillRect(0, CHAO, L, A - CHAO)
    ctx.drawImage(urlSprite('kimiCorre1').canvas, 30, CHAO - 29, 44, 29)
  }, [fase])

  const tocar = (e: React.PointerEvent) => {
    e.preventDefault()
    if (fase === 'correndo') pular.current()
    else if (fase === 'pronto' || fase === 'fim') comecar()
  }

  const comecar = () => {
    setPetiscos(0)
    setFase('correndo')
    gastarEnergia(3)
  }

  return (
    <div className="kimirun">
      <BarraJogo titulo="Kimi Run" />
      <div className="kimirun__placar">
        <span className="placa">
          <Sprite nome="osso" escala={2} /> {petiscos}/{META}
        </span>
        <span className="placa">Recorde: {recorde}</span>
      </div>
      <div className="kimirun__palco moldura" onPointerDown={tocar}>
        <canvas ref={canvas} width={L} height={A} className="kimirun__canvas pixel" aria-label="Kimi Run" />
        {fase !== 'correndo' && (
          <div className="kimirun__sobre">
            <p className="moldura moldura--clara">{frase}</p>
            {fase !== 'venceu' && <span className="botao botao--verde">{fase === 'pronto' ? 'Toque para correr' : 'Toque para tentar de novo'}</span>}
          </div>
        )}
      </div>
      {fase === 'venceu' && (
        <button className="botao botao--largo" onClick={comecar}>
          Correr de novo
        </button>
      )}
      <p className="kimirun__dica">Pegue {META} petiscos numa corrida só. Desvie da banheira, do aspirador e do gato.</p>
      <Recompensa vale="kimi" aberta={premio} aoFechar={() => setPremio(false)} />
    </div>
  )
}
