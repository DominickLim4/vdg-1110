import { AnimatePresence, motion, type PanInfo } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { Foto } from '../fotos'
import { som } from './som'
import { Sprite } from './Sprite'
import './lightbox.css'

interface Props {
  fotos: Foto[]
  indice: number | null
  aoMudar: (i: number | null) => void
  rodape?: (f: Foto) => ReactNode
}

// Visualizador em tela cheia: deslizar troca de foto, toque duplo dá coração, arrastar para baixo fecha.
export function Lightbox({ fotos, indice, aoMudar, rodape }: Props) {
  const [direcao, setDirecao] = useState(0)
  const [coracao, setCoracao] = useState(0)
  const ultimoToque = useRef(0)

  const ir = (d: number) => {
    if (indice === null) return
    const n = (indice + d + fotos.length) % fotos.length
    setDirecao(d)
    aoMudar(n)
  }

  useEffect(() => {
    if (indice === null) return
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') aoMudar(null)
      if (e.key === 'ArrowRight') ir(1)
      if (e.key === 'ArrowLeft') ir(-1)
    }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  })

  const soltar = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 120 && Math.abs(info.offset.x) < 80) return aoMudar(null)
    if (info.offset.x < -60 || info.velocity.x < -400) ir(1)
    else if (info.offset.x > 60 || info.velocity.x > 400) ir(-1)
  }

  const tocar = () => {
    const agora = Date.now()
    if (agora - ultimoToque.current < 300) {
      setCoracao(agora)
      som.moeda()
    }
    ultimoToque.current = agora
  }

  const foto = indice !== null ? fotos[indice] : null

  return createPortal(
    <AnimatePresence>
      {foto && (
        <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Foto">
          <div className="lightbox__topo">
            <span className="placa">
              {indice! + 1}/{fotos.length}
            </span>
            <button className="botao" onClick={() => aoMudar(null)}>
              Fechar
            </button>
          </div>
          <div className="lightbox__palco">
            <AnimatePresence initial={false} custom={direcao} mode="popLayout">
              <motion.img
                key={foto.id}
                src={foto.grande}
                alt={foto.legenda ?? ''}
                className="lightbox__img"
                custom={direcao}
                initial={{ x: direcao >= 0 ? 300 : -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direcao >= 0 ? -300 : 300, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                drag
                dragSnapToOrigin
                dragElastic={0.6}
                onDragEnd={soltar}
                onClick={tocar}
                draggable={false}
              />
            </AnimatePresence>
            <AnimatePresence>
              {coracao > 0 && (
                <motion.div
                  key={coracao}
                  className="lightbox__coracao"
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: [0, 1.4, 1], opacity: [1, 1, 0] }}
                  transition={{ duration: 0.9 }}
                  onAnimationComplete={() => setCoracao(0)}
                >
                  <Sprite nome="coracao" escala={10} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="lightbox__rodape">
            {rodape?.(foto)}
            <div className="lightbox__setas">
              <button className="botao" onClick={() => ir(-1)} aria-label="Foto anterior">
                ‹
              </button>
              <button className="botao" onClick={() => ir(1)} aria-label="Próxima foto">
                ›
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
