import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { tocarAcorde, tocarBateria, tocarEfeito, tocarRiff, type Efeito, type PecaBateria } from '../../componentes/guitarra-som'
import { RIFFS, type Riff, type Timbre } from '../../conteudo/riffs'
import { useProgresso } from '../../estado/progresso'

const TIMBRES: { id: Timbre; nome: string }[] = [
  { id: 'distorcido', nome: 'Distorcida' },
  { id: 'limpo', nome: 'Limpa' },
  { id: '8bit', nome: '8-bit' },
  { id: 'violao', nome: 'Violão' },
]

const ACORDES: { nome: string; raiz: string; menor?: boolean }[] = [
  { nome: 'E5', raiz: 'E2' },
  { nome: 'G5', raiz: 'G2' },
  { nome: 'A5', raiz: 'A2' },
  { nome: 'B5', raiz: 'B2' },
  { nome: 'C5', raiz: 'C3' },
  { nome: 'D5', raiz: 'D3' },
  { nome: 'F#5', raiz: 'F#2' },
  { nome: 'Em', raiz: 'E3', menor: true },
]

const PECAS: { id: PecaBateria; nome: string }[] = [
  { id: 'bumbo', nome: 'Bumbo' },
  { id: 'caixa', nome: 'Caixa' },
  { id: 'chimbal', nome: 'Chimbal' },
  { id: 'prato', nome: 'Prato' },
  { id: 'tom', nome: 'Tom' },
]

const EFEITOS: { id: Efeito; nome: string }[] = [
  { id: 'alavanca', nome: 'Alavanca' },
  { id: 'microfonia', nome: 'Microfonia' },
  { id: 'chug', nome: 'Chug' },
]

export function Guitarra() {
  const { p } = useProgresso()
  const [timbre, setTimbre] = useState<Timbre>('distorcido')
  const [ativo, setAtivo] = useState<string | null>(null)
  const [tocando, setTocando] = useState<Riff | null>(null)
  const [repertorio, setRepertorio] = useState(false)
  const parar = useRef<(() => void) | null>(null)
  const ultimo = useRef(-1)

  useEffect(() => () => parar.current?.(), [])

  const piscar = (id: string) => {
    setAtivo(id)
    setTimeout(() => setAtivo((a) => (a === id ? null : a)), 150)
  }

  const tocar = (riff: Riff) => {
    parar.current?.()
    setTocando(riff)
    parar.current = tocarRiff(riff, () => setTocando((r) => (r === riff ? null : r)))
  }

  const surpreender = () => {
    let i = Math.floor(Math.random() * RIFFS.length)
    if (i === ultimo.current) i = (i + 1) % RIFFS.length
    ultimo.current = i
    tocar(RIFFS[i])
  }

  const pararTudo = () => {
    parar.current?.()
    parar.current = null
    setTocando(null)
  }

  return (
    <>
      <p className="brinquedo__dica">Escolha o timbre, toque os acordes e a bateria, ou deixe a guitarra tocar um clássico.</p>

      <div className="guitarra__acoes">
        <button className="botao botao--bordo guitarra__surpresa" onClick={surpreender}>
          Me surpreenda
        </button>
        <button className="botao" onClick={() => setRepertorio((r) => !r)} aria-expanded={repertorio}>
          {repertorio ? 'Fechar lista' : `Repertório (${RIFFS.length})`}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {repertorio && (
          <motion.ul className="repertorio" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            {RIFFS.map((r) => (
              <li key={r.musica}>
                <button className={`repertorio__musica ${tocando === r ? 'repertorio__musica--ativa' : ''}`} onClick={() => tocar(r)}>
                  <strong>{r.musica}</strong>
                  <span>{r.banda}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {tocando && (
          <motion.div key={tocando.musica} className="guitarra__tocando" initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>
            <span className="guitarra__nota" aria-hidden>
              ♪
            </span>
            <p>
              <strong>{tocando.musica}</strong> <span>({tocando.banda})</span>
            </p>
            <button className="guitarra__parar" onClick={pararTudo} aria-label="Parar música">
              ■
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {!p.som && <p className="brinquedo__dica">O som está desligado. Ligue no botão ♪ lá em cima.</p>}

      <h3 className="guitarra__secao">Timbre</h3>
      <div className="guitarra__timbres" role="radiogroup" aria-label="Timbre">
        {TIMBRES.map((t) => (
          <button
            key={t.id}
            role="radio"
            aria-checked={timbre === t.id}
            className={`frasco ${timbre === t.id ? 'frasco--ativo' : ''}`}
            onClick={() => {
              setTimbre(t.id)
              tocarAcorde('E2', t.id)
            }}
          >
            {t.nome}
          </button>
        ))}
      </div>

      <h3 className="guitarra__secao">Acordes</h3>
      <div className="guitarra guitarra--acordes">
        {ACORDES.map((a) => (
          <button
            key={a.nome}
            className={`guitarra__pad guitarra__pad--${timbre} ${ativo === a.nome ? 'guitarra__pad--ativo' : ''}`}
            onPointerDown={() => {
              tocarAcorde(a.raiz, timbre, a.menor)
              piscar(a.nome)
            }}
          >
            {a.nome}
          </button>
        ))}
      </div>

      <h3 className="guitarra__secao">Bateria</h3>
      <div className="guitarra guitarra--bateria">
        {PECAS.map((b) => (
          <button
            key={b.id}
            className={`guitarra__pad guitarra__pad--bateria ${ativo === b.id ? 'guitarra__pad--ativo' : ''}`}
            onPointerDown={() => {
              tocarBateria(b.id)
              piscar(b.id)
            }}
          >
            {b.nome}
          </button>
        ))}
      </div>

      <h3 className="guitarra__secao">Efeitos</h3>
      <div className="guitarra guitarra--efeitos">
        {EFEITOS.map((e) => (
          <button
            key={e.id}
            className={`guitarra__pad guitarra__pad--efeito ${ativo === e.id ? 'guitarra__pad--ativo' : ''}`}
            onPointerDown={() => {
              tocarEfeito(e.id)
              piscar(e.id)
            }}
          >
            {e.nome}
          </button>
        ))}
      </div>
    </>
  )
}
