import { motion } from 'motion/react'
import { useEffect } from 'react'
import { VALES } from '../conteudo/vales'
import type { IdVale } from '../estado/progresso'
import { irPara } from '../estado/rota'
import { confete } from './confete'
import { Janela } from './Janela'
import { som } from './som'
import { Sprite } from './Sprite'
import './recompensa.css'

export function Recompensa({ vale, aberta, aoFechar }: { vale: IdVale; aberta: boolean; aoFechar: () => void }) {
  const v = VALES.find((x) => x.id === vale)!
  useEffect(() => {
    if (!aberta) return
    som.bau()
    const t = setTimeout(() => confete(), 450)
    return () => clearTimeout(t)
  }, [aberta])

  return (
    <Janela aberta={aberta} rotulo={`Você ganhou ${v.nome}`}>
      <div className="recompensa">
        <div className="recompensa__palco">
          <motion.div className="recompensa__item" initial={{ y: 30, scale: 0.2, opacity: 0 }} animate={{ y: -10, scale: 1, opacity: 1 }} transition={{ delay: 0.35, type: 'spring', stiffness: 200, damping: 10 }}>
            <Sprite nome={v.sprite} escala={6} />
          </motion.div>
          <motion.div initial={{ scale: 0.6 }} animate={{ scale: [0.6, 1.15, 1] }} transition={{ duration: 0.4 }}>
            <Sprite nome="bau" escala={6} />
          </motion.div>
        </div>
        <p className="recompensa__rotulo">Você recebeu:</p>
        <h2 className="recompensa__nome">{v.nome}</h2>
        <p className="recompensa__descricao">{v.descricao}</p>
        <div className="recompensa__acoes">
          <button className="botao" onClick={() => { aoFechar(); irPara('fliperama') }}>
            Fliperama
          </button>
          <button className="botao botao--verde" onClick={() => { aoFechar(); irPara('bau') }}>
            Ver no Baú
          </button>
        </div>
      </div>
    </Janela>
  )
}
