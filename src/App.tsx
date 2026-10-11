import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect } from 'react'
import { Fundo } from './componentes/Fundo'
import { Hotbar } from './componentes/Hotbar'
import { Hud } from './componentes/Hud'
import { PainelDev } from './componentes/PainelDev'
import { definirSom } from './componentes/som'
import { ProvedorProgresso, useProgresso } from './estado/progresso'
import { chaveRota, useRota, type Rota } from './estado/rota'
import { KimiRun } from './jogos/kimi-run/KimiRun'
import { Memoria } from './jogos/memoria/Memoria'
import { Pesca } from './jogos/pesca/Pesca'
import { Quiz } from './jogos/quiz/Quiz'
import { Termo } from './jogos/termo/Termo'
import { Abertura } from './telas/Abertura'
import { Bau } from './telas/Bau'
import { Carta } from './telas/Carta'
import { Casa } from './telas/Casa'
import { Fliperama } from './telas/Fliperama'
import { Kimi } from './telas/Kimi'
import { Nos } from './telas/Nos'
import { Parquinho } from './telas/Parquinho'
import { Portao } from './telas/Portao'
import { Receita } from './telas/Receita'
import { SalaSecreta } from './telas/SalaSecreta'
import { Sushi } from './telas/sushi/Sushi'
import './app.css'

function Conteudo({ rota }: { rota: Rota }) {
  if (rota.tela === 'jogo') {
    switch (rota.jogo) {
      case 'quiz':
        return <Quiz />
      case 'termo':
        return <Termo />
      case 'memoria':
        return <Memoria />
      case 'kimi-run':
        return <KimiRun />
      case 'pesca':
        return <Pesca />
    }
  }
  switch (rota.tela) {
    case 'casa':
      return <Casa />
    case 'fliperama':
      return <Fliperama />
    case 'bau':
      return <Bau />
    case 'kimi':
      return <Kimi />
    case 'nos':
      return <Nos />
    case 'receita':
      return <Receita />
    case 'carta':
      return <Carta />
    case 'parquinho':
      return <Parquinho />
    case 'sala-secreta':
      return <SalaSecreta />
    case 'sushi':
      return <Sushi />
  }
}

function Casco() {
  const rota = useRota()
  const { p } = useProgresso()
  const reduzido = useReducedMotion()
  const emJogo = rota.tela === 'jogo'
  const chave = chaveRota(rota)

  useEffect(() => {
    document.querySelector('.app__conteudo')?.scrollTo({ top: 0 })
  }, [chave])

  return (
    <div className={`app ${emJogo ? 'app--jogo' : ''}`}>
      {!emJogo && <Hud />}
      <main className="app__conteudo">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={chave}
            className="app__tela"
            initial={reduzido ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduzido ? { opacity: 0 } : { opacity: 0, scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32, mass: 0.8 }}
          >
            <Conteudo rota={rota} />
          </motion.div>
        </AnimatePresence>
      </main>
      {!emJogo && <Hotbar rota={rota} cartaNova={!p.conquistas.carta} />}
    </div>
  )
}

function Raiz() {
  const { p } = useProgresso()
  useEffect(() => definirSom(p.som), [p.som])
  return (
    <>
      <Fundo />
      <AnimatePresence mode="wait">
        {!p.portaoAberto ? (
          <Portao key="portao" />
        ) : !p.aberturaVista ? (
          <Abertura key="abertura" />
        ) : (
          <motion.div key="casco" className="raiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Casco />
          </motion.div>
        )}
      </AnimatePresence>
      <PainelDev />
    </>
  )
}

export function App() {
  return (
    <ProvedorProgresso>
      <Raiz />
    </ProvedorProgresso>
  )
}
