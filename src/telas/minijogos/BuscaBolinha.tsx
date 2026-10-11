import { AnimatePresence, motion, useAnimationControls } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { som } from '../../componentes/som'
import { Sprite } from '../../componentes/Sprite'

const CASA = { x: 24, y: 150 } // onde o Kimi espera (px dentro do campo)
const VELOCIDADE = 260 // px/s correndo

const FALAS = [
  'Buscou! Mais uma?',
  'O Kimi trouxe de volta, todo babado.',
  'Golden é golden: busca até amanhã.',
  'Ele quer mais. Ele sempre quer mais.',
]

// Toque no campo para jogar a bolinha; o Kimi corre, busca e traz de volta.
export function BuscaBolinha() {
  const campo = useRef<HTMLDivElement>(null)
  const kimi = useAnimationControls()
  const bola = useAnimationControls()
  const [ocupado, setOcupado] = useState(false)
  const [virado, setVirado] = useState(false)
  const [correndo, setCorrendo] = useState(false)
  const [quadro, setQuadro] = useState(0)
  const [buscas, setBuscas] = useState(0)
  const [fala, setFala] = useState('Toque em qualquer lugar do campo para jogar a bolinha.')
  const [coracao, setCoracao] = useState(0)
  const [naBoca, setNaBoca] = useState(false)

  useEffect(() => {
    if (!correndo) return
    const t = setInterval(() => setQuadro((q) => 1 - q), 120)
    return () => clearInterval(t)
  }, [correndo])

  useEffect(() => {
    void kimi.set({ x: CASA.x, y: CASA.y })
    void bola.set({ x: CASA.x + 44, y: CASA.y + 4, opacity: 0 })
  }, [kimi, bola])

  const jogar = async (e: React.PointerEvent) => {
    if (ocupado || !campo.current) return
    const r = campo.current.getBoundingClientRect()
    const alvo = { x: Math.max(60, Math.min(r.width - 40, e.clientX - r.left)), y: Math.max(40, Math.min(r.height - 40, e.clientY - r.top)) }
    setOcupado(true)
    setFala('Lá vai!')
    som.pulo()

    // a bolinha voa em arco
    const meio = { x: (CASA.x + 44 + alvo.x) / 2, y: Math.min(CASA.y, alvo.y) - 70 }
    await bola.start({ x: [CASA.x + 44, meio.x, alvo.x], y: [CASA.y + 4, meio.y, alvo.y], opacity: 1, transition: { duration: 0.7, ease: 'easeOut' } })
    som.bolha()

    // o Kimi corre até ela
    const ida = Math.hypot(alvo.x - CASA.x, alvo.y - CASA.y)
    setVirado(false)
    setCorrendo(true)
    await kimi.start({ x: alvo.x - 40, y: alvo.y - 20, transition: { duration: ida / VELOCIDADE, ease: 'linear' } })
    setNaBoca(true)
    void bola.set({ opacity: 0 })

    const fujao = Math.random() < 0.15
    if (fujao) {
      setFala('O Kimi decidiu que a bolinha é dele agora…')
      setVirado(true)
      await kimi.start({ x: [alvo.x - 40, alvo.x - 90, alvo.x - 10, alvo.x - 60], transition: { duration: 1.4 } })
      setVirado(false)
    }

    // e volta
    setVirado(true)
    await kimi.start({ x: CASA.x, y: CASA.y, transition: { duration: Math.hypot(alvo.x - 40 - CASA.x, alvo.y - 20 - CASA.y) / VELOCIDADE, ease: 'linear' } })
    setCorrendo(false)
    setVirado(false)
    setNaBoca(false)
    void bola.set({ x: CASA.x + 44, y: CASA.y + 4, opacity: 1 })
    som.moeda()
    setBuscas((b) => b + 1)
    setCoracao(performance.now())
    setFala(fujao ? 'Depois de muita negociação, ele devolveu.' : FALAS[Math.floor(Math.random() * FALAS.length)])
    setOcupado(false)
  }

  return (
    <>
      <div className="mini-placar">
        <span className="placa">{buscas} buscas</span>
      </div>
      <div ref={campo} className="busca" onPointerDown={jogar} aria-label="Campo: toque para jogar a bolinha">
        <motion.div className="busca__kimi" animate={kimi} style={{ scaleX: virado ? -1 : 1 }}>
          <Sprite nome={quadro && correndo ? 'kimiCorre2' : 'kimiCorre1'} escala={3} />
          {naBoca && (
            <span className="busca__bola-boca">
              <Sprite nome="bola" escala={2} />
            </span>
          )}
          <AnimatePresence>
            {coracao > 0 && (
              <motion.span key={coracao} className="busca__coracao" initial={{ y: 0, opacity: 1 }} animate={{ y: -40, opacity: 0 }} transition={{ duration: 1 }}>
                <Sprite nome="coracao" escala={3} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
        <motion.div className="busca__bola" animate={bola}>
          <Sprite nome="bola" escala={3} />
        </motion.div>
      </div>
      <p className="brinquedo__resultado" role="status">
        {fala}
      </p>
    </>
  )
}
