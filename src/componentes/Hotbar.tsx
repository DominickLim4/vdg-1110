import { AnimatePresence, motion } from 'motion/react'
import { irPara, type IdTela, type Rota } from '../estado/rota'
import type { NomeSprite } from '../sprites/sprites'
import { som } from './som'
import { Sprite } from './Sprite'
import './hotbar.css'

const SLOTS: { tela: IdTela; nome: string; sprite: NomeSprite }[] = [
  { tela: 'casa', nome: 'Casa', sprite: 'casa' },
  { tela: 'fliperama', nome: 'Fliperama', sprite: 'fliperama' },
  { tela: 'bau', nome: 'Baú', sprite: 'bau' },
  { tela: 'kimi', nome: 'Kimi', sprite: 'kimi' },
  { tela: 'nos', nome: 'Nós', sprite: 'camera' },
  { tela: 'sushi', nome: 'Monte seu Sushi', sprite: 'nigiri' },
  { tela: 'receita', nome: 'Receita do dia', sprite: 'pilula' },
  { tela: 'carta', nome: 'Carta', sprite: 'envelope' },
]

export function Hotbar({ rota, cartaNova }: { rota: Rota; cartaNova: boolean }) {
  const ativa = rota.tela === 'jogo' ? 'fliperama' : rota.tela === 'sala-secreta' ? 'casa' : rota.tela
  const atual = SLOTS.find((s) => s.tela === ativa)
  return (
    <nav className="hotbar-area" aria-label="Menu">
      <AnimatePresence mode="wait">
        {atual && (
          <motion.div
            key={atual.tela}
            className="hotbar__rotulo placa"
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {atual.nome}
          </motion.div>
        )}
      </AnimatePresence>
      <ul className="hotbar moldura">
        {SLOTS.map((s) => (
          <li key={s.tela}>
            <button
              className={`hotbar__slot afundado ${ativa === s.tela ? 'hotbar__slot--ativo' : ''}`}
              aria-label={s.nome}
              aria-current={ativa === s.tela ? 'page' : undefined}
              onClick={() => {
                som.toque()
                irPara(s.tela)
              }}
            >
              <Sprite nome={s.sprite} escala={3} />
              {s.tela === 'carta' && cartaNova && <span className="hotbar__aviso" aria-label="nova">!</span>}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
