import { motion } from 'motion/react'
import { Sprite } from '../componentes/Sprite'
import { BILHETE_SECRETO } from '../conteudo/sala-secreta'
import { irPara } from '../estado/rota'
import './sala-secreta.css'

export function SalaSecreta() {
  return (
    <div className="tela sala-secreta">
      <motion.div className="sala-secreta__luz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }} aria-hidden />
      <header className="cabecalho-tela">
        <h1 className="titulo-jogo">Sala Secreta</h1>
      </header>
      <motion.div className="sala-secreta__bilhete" initial={{ y: 40, rotate: -8, opacity: 0 }} animate={{ y: 0, rotate: -2, opacity: 1 }} transition={{ delay: 0.5, type: 'spring', stiffness: 120 }}>
        {BILHETE_SECRETO.rascunho && <p className="carta__rascunho">Rascunho: texto ainda vai ser escrito.</p>}
        <h2>{BILHETE_SECRETO.titulo}</h2>
        <p>{BILHETE_SECRETO.texto}</p>
        <div className="sala-secreta__itens" aria-hidden>
          <Sprite nome="estrela" variacao="iridio" escala={3} />
          <Sprite nome="coracao" escala={3} />
          <Sprite nome="estrela" variacao="iridio" escala={3} />
        </div>
      </motion.div>
      <button className="botao botao--largo" onClick={() => irPara('casa')}>
        Voltar pela passagem
      </button>
    </div>
  )
}
