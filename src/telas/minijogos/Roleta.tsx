import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { confete } from '../../componentes/confete'
import { som } from '../../componentes/som'
import { abrirWhatsApp } from '../../conteudo/contato'

const OPCOES = [
  { curto: 'Sushi', texto: 'Rodízio de sushi', cor: '#F2A6B6' },
  { curto: 'Stardew', texto: 'Maratona de Stardew', cor: '#78B159' },
  { curto: 'Treino', texto: 'Treino juntos', cor: '#5FB3CF' },
  { curto: 'RPG', texto: 'Noite de Jogos', cor: '#B8A6E3' },
  { curto: 'Cinema', texto: 'Cinema', cor: '#F5C242' },
  { curto: 'Pintura', texto: 'Date em Restaurante', cor: '#E07A3A' },
  { curto: 'Kimi', texto: 'Passeio com Kimi', cor: '#F6CF86' },
  { curto: 'Conchinha', texto: 'Dormir de conchinha', cor: '#D97A92' },
]

const FATIA = 360 / OPCOES.length

// Roleta do destino: decide o programa do próximo encontro.
export function Roleta() {
  const [giro, setGiro] = useState(0)
  const [girando, setGirando] = useState(false)
  const [resultado, setResultado] = useState<string | null>(null)

  const girar = () => {
    if (girando) return
    som.toque()
    setResultado(null)
    setGirando(true)
    setGiro((g) => g + 1440 + Math.random() * 360)
  }

  const parou = () => {
    if (!girando) return
    setGirando(false)
    // o ponteiro fica no topo; a fatia k ocupa [k*FATIA, (k+1)*FATIA) no sentido horário
    const angulo = (360 - (giro % 360)) % 360
    const k = Math.floor(angulo / FATIA)
    setResultado(OPCOES[k].texto)
    som.vitoria()
    confete()
  }

  const fundo = `conic-gradient(${OPCOES.map((o, k) => `${o.cor} ${k * FATIA}deg ${(k + 1) * FATIA}deg`).join(', ')})`

  return (
    <div className="roleta">
      <div className="roleta__area">
        <span className="roleta__ponteiro" aria-hidden>
          ▼
        </span>
        <motion.div
          className="roleta__disco"
          style={{ background: fundo }}
          animate={{ rotate: giro }}
          transition={{ duration: 4, ease: [0.15, 0.85, 0.25, 1] }}
          onAnimationComplete={parou}
        >
          {OPCOES.map((o, k) => (
            <span key={o.texto} className="roleta__rotulo" style={{ rotate: `${k * FATIA + FATIA / 2 - 90}deg` }}>
              <span>{o.curto}</span>
            </span>
          ))}
        </motion.div>
        <button className="roleta__centro" onClick={girar} disabled={girando} aria-label="Girar a roleta">
          Girar
        </button>
      </div>
      <AnimatePresence>
        {resultado && (
          <motion.div className="roleta__resultado" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
            <p>
              O destino decidiu: <strong>{resultado}</strong>
            </p>
            <button className="botao botao--verde botao--largo" onClick={() => abrirWhatsApp(`A roleta do destino decidiu: ${resultado}. Bora? 🎲`)}>
              Combinar no WhatsApp
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
