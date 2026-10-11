import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { som } from '../componentes/som'
import { Sprite } from '../componentes/Sprite'
import { useProgresso } from '../estado/progresso'
import { FOTOS_NOS } from '../fotos'
import './abertura.css'

const CARREGANDO = [
  'Gelando a Coca Zero…',
  'Afinando a guitarra…',
  'Escondendo passagens secretas…',
  'Penteando o Kimi…',
  'Enrolando o sushi…',
  'Rolando iniciativa…',
]

type Etapa = 'menu' | 'save' | 'carregando'

export function Abertura() {
  const { atualizar } = useProgresso()
  const [etapa, setEtapa] = useState<Etapa>('menu')
  const [aviso, setAviso] = useState('')
  const [passo, setPasso] = useState(0)

  useEffect(() => {
    if (etapa !== 'carregando') return
    if (passo >= CARREGANDO.length) {
      const t = setTimeout(() => atualizar((s) => ({ ...s, aberturaVista: true })), 350)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setPasso((n) => n + 1), 480)
    return () => clearTimeout(t)
  }, [etapa, passo, atualizar])

  const retrato = FOTOS_NOS[0]?.mini

  return (
    <motion.div className="abertura" exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
      <motion.h1
        className="abertura__titulo titulo-jogo"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 160, damping: 12 }}
      >
        Vale
        <br />
        da Geo
      </motion.h1>
      <p className="abertura__sub placa">Edição de 25 anos</p>

      <AnimatePresence mode="wait">
        {etapa === 'menu' && (
          <motion.div key="menu" className="abertura__menu" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
            <button className="abertura__opcao moldura sombra-pixel" onClick={() => setAviso('Esse vale só tem um save. E ele é seu.')}>
              Novo
            </button>
            <button
              className="abertura__opcao abertura__opcao--principal moldura sombra-pixel"
              onClick={() => {
                som.moeda()
                setEtapa('save')
              }}
            >
              Carregar
            </button>
            <button className="abertura__opcao moldura sombra-pixel" onClick={() => setAviso('Sair? No seu aniversário? Nem pensar.')}>
              Sair
            </button>
            <p className="abertura__aviso" role="status">
              {aviso}
            </p>
          </motion.div>
        )}

        {etapa !== 'menu' && (
          <motion.div key="save" className="abertura__saves" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <button
              className="save moldura sombra-pixel"
              disabled={etapa === 'carregando'}
              onClick={() => {
                som.bau()
                setEtapa('carregando')
              }}
            >
              <div className="save__retrato afundado">
                {retrato ? <img src={retrato} alt="" /> : <Sprite nome="coracao" escala={5} />}
              </div>
              <div className="save__info">
                <strong className="save__nome">Geo Froes</strong>
                <span>Fazenda Coração</span>
                <span>Outono 11, Ano 25</span>
                <span className="save__tempo">Tempo de jogo: 25 anos</span>
              </div>
            </button>
            {etapa === 'save' && <p className="abertura__toque">Toque no save para carregar</p>}
            {etapa === 'carregando' && (
              <div className="carregando" role="status">
                <div className="carregando__barra afundado">
                  <div className="carregando__nivel" style={{ width: `${(passo / CARREGANDO.length) * 100}%` }} />
                </div>
                <p>{CARREGANDO[Math.min(passo, CARREGANDO.length - 1)]}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
