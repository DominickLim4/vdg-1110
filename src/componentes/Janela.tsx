import { AnimatePresence, motion } from 'motion/react'
import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  aberta: boolean
  aoFechar?: () => void
  rotulo: string
  children: ReactNode
  clara?: boolean
}

// Janela modal com moldura de madeira. Fecha tocando fora ou com Esc (se aoFechar existir).
export function Janela({ aberta, aoFechar, rotulo, children, clara }: Props) {
  useEffect(() => {
    if (!aberta || !aoFechar) return
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && aoFechar()
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [aberta, aoFechar])

  return createPortal(
    <AnimatePresence>
      {aberta && (
        <motion.div
          className="janela-fundo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={aoFechar}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={rotulo}
            className={`janela moldura sombra-pixel ${clara ? 'moldura--clara' : ''}`}
            initial={{ scale: 0.7, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
