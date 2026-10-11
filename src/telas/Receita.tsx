import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { som } from '../componentes/som'
import { Sprite } from '../componentes/Sprite'
import { CATEGORIAS, FRASES, type Categoria } from '../conteudo/frases'
import './receita.css'

function doseDoDia() {
  const hoje = new Date()
  const dia = Math.floor((hoje.getTime() - new Date(hoje.getFullYear(), 0, 0).getTime()) / 86_400_000)
  return (dia * 7) % FRASES.length
}

export function Receita() {
  const [filtro, setFiltro] = useState<Categoria | 'dia'>('dia')
  const [indice, setIndice] = useState(doseDoDia)
  const [folha, setFolha] = useState(0)

  const lista = useMemo(() => (filtro === 'dia' ? FRASES : FRASES.filter((f) => f.categoria === filtro)), [filtro])
  const frase = filtro === 'dia' ? FRASES[indice % FRASES.length] : lista[indice % lista.length]

  const novaDose = () => {
    som.toque()
    setIndice((i) => {
      let n = i
      while (lista.length > 1 && n % lista.length === i % lista.length) n = Math.floor(Math.random() * lista.length * 10)
      return n
    })
    setFolha((f) => f + 1)
  }

  const escolher = (c: Categoria | 'dia') => {
    som.toque()
    setFiltro(c)
    setIndice(c === 'dia' ? doseDoDia() : Math.floor(Math.random() * 100))
    setFolha((f) => f + 1)
  }

  return (
    <div className="tela">
      <header className="cabecalho-tela">
        <Sprite nome="pilula" escala={4} />
        <h1 className="titulo-jogo">Receita do dia</h1>
        <p>Uma dose de motivação, prescrita com carinho.</p>
      </header>

      <div className="frascos" role="tablist" aria-label="Categorias">
        {[{ id: 'dia' as const, nome: 'Dose do dia' }, ...CATEGORIAS].map((c) => (
          <button key={c.id} role="tab" aria-selected={filtro === c.id} className={`frasco ${filtro === c.id ? 'frasco--ativo' : ''}`} onClick={() => escolher(c.id)}>
            {c.nome}
          </button>
        ))}
      </div>

      <div className="bloco">
        <div className="bloco__fundo" aria-hidden />
        <div className="bloco__fundo bloco__fundo--2" aria-hidden />
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.article
            key={folha}
            className="receituario"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -260, x: 80, rotate: 18, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          >
            <header className="receituario__topo">
              <strong>Dra. Geovanna Froes</strong>
              <span>Psiquiatria do Coração · CRM 25-ANOS</span>
            </header>
            <p className="receituario__paciente">
              Paciente: <em>Geo Froes</em>
            </p>
            <p className="receituario__uso">Uso contínuo</p>
            <div className="receituario__corpo">
              <span className="receituario__rx" aria-hidden>
                Rx
              </span>
              <p className="receituario__frase">{frase.texto}</p>
            </div>
            <p className="receituario__posologia">
              <strong>Posologia:</strong> {frase.posologia}
            </p>
            <footer className="receituario__assinatura">
              <span className="receituario__pata" aria-hidden>
                <Sprite nome="kimi" escala={2} />
              </span>
              <span>Dr. Kimi, assistente (assinado com a pata)</span>
            </footer>
          </motion.article>
        </AnimatePresence>
      </div>

      <button className="botao botao--verde botao--largo" onClick={novaDose}>
        Nova dose
      </button>
    </div>
  )
}
