import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { BarraJogo } from '../../componentes/BarraJogo'
import { Recompensa } from '../../componentes/Recompensa'
import { som } from '../../componentes/som'
import { Sprite } from '../../componentes/Sprite'
import { ACERTOS_PARA_VENCER, PERGUNTAS, QUANTIDADE_QUIZ } from '../../conteudo/perguntas'
import { useProgresso } from '../../estado/progresso'
import { embaralhar } from '../embaralhar'
import './quiz.css'

type Fase = 'lendo' | 'escolhendo' | 'resposta' | 'fim'

interface Rodada {
  pergunta: string
  opcoes: string[]
  certa: string
  explicacao: string
}

function novaPartida(): Rodada[] {
  return embaralhar(PERGUNTAS)
    .slice(0, QUANTIDADE_QUIZ)
    .map((q) => ({ pergunta: q.pergunta, opcoes: embaralhar(q.opcoes), certa: q.opcoes[0], explicacao: q.explicacao }))
}

function useDatilografia(texto: string, ativo: boolean) {
  const [n, setN] = useState(0)
  useEffect(() => setN(0), [texto])
  useEffect(() => {
    if (!ativo || n >= texto.length) return
    const t = setTimeout(() => setN((x) => Math.min(texto.length, x + 2)), 24)
    return () => clearTimeout(t)
  }, [n, texto, ativo])
  return { visivel: texto.slice(0, n), completo: n >= texto.length, pular: () => setN(texto.length) }
}

export function Quiz() {
  const { p, desbloquearVale, conquistar } = useProgresso()
  const [rodadas, setRodadas] = useState(novaPartida)
  const [i, setI] = useState(0)
  const [acertos, setAcertos] = useState<boolean[]>([])
  const [fase, setFase] = useState<Fase>('lendo')
  const [escolha, setEscolha] = useState<string | null>(null)
  const [premio, setPremio] = useState(false)

  const r = rodadas[i]
  const venceu = acertos.filter(Boolean).length >= ACERTOS_PARA_VENCER

  const fala = useMemo(() => {
    if (fase === 'fim') {
      const n = acertos.filter(Boolean).length
      if (n === QUANTIDADE_QUIZ) return `${n} de ${n}! Gabaritou. Você é a maior fazendeira desse vale.`
      if (venceu) return `${n} de ${QUANTIDADE_QUIZ}! Passou com folga. Esse vale é seu.`
      return `${n} de ${QUANTIDADE_QUIZ}… precisava de ${ACERTOS_PARA_VENCER}. Bora de novo? Eu acredito em você!`
    }
    if (fase === 'resposta') return escolha === r.certa ? `Isso! ${r.explicacao}` : `Hmm, não… ${r.explicacao}`
    return r.pergunta
  }, [fase, escolha, r, acertos, venceu])

  const { visivel, completo, pular } = useDatilografia(fala, true)

  useEffect(() => {
    if (fase === 'lendo' && completo) setFase('escolhendo')
  }, [fase, completo])

  const responder = (op: string) => {
    if (fase !== 'escolhendo') return
    const certo = op === r.certa
    certo ? som.moeda() : som.erro()
    setEscolha(op)
    setAcertos((a) => [...a, certo])
    setFase('resposta')
  }

  const avancar = () => {
    if (!completo) return pular()
    if (fase === 'resposta') {
      if (i + 1 >= rodadas.length) {
        setFase('fim')
        const n = acertos.filter(Boolean).length
        if (n >= ACERTOS_PARA_VENCER) {
          som.vitoria()
          if (n === QUANTIDADE_QUIZ) conquistar('quiz-perfeito')
          if (!p.vales.date) {
            desbloquearVale('date')
            setTimeout(() => setPremio(true), 900)
          }
        }
        return
      }
      setI(i + 1)
      setEscolha(null)
      setFase('lendo')
    }
  }

  const recomecar = () => {
    setRodadas(novaPartida())
    setI(0)
    setAcertos([])
    setEscolha(null)
    setFase('lendo')
  }

  const emote = fase === 'resposta' ? (escolha === r.certa ? 'coracao' : 'reticencias') : fase === 'fim' && venceu ? 'coracao' : null

  return (
    <div className="quiz">
      <BarraJogo titulo="Quiz do Vale" />

      <div className="quiz__cena" aria-hidden>
        <div className="quiz__amizade moldura">
          {Array.from({ length: QUANTIDADE_QUIZ }, (_, k) => (
            <span key={k} className={`quiz__coracao ${acertos[k] === true ? 'quiz__coracao--cheio' : acertos[k] === false ? 'quiz__coracao--vazio' : ''}`}>
              <Sprite nome="coracao" escala={2} />
            </span>
          ))}
        </div>
        <div className="quiz__casinha">
          <span className="quiz__telhado" />
          <span className="quiz__parede">
            <span className="quiz__porta" />
            <span className="quiz__janela" />
          </span>
        </div>
        <div className="quiz__cerca" />
        <motion.div className="quiz__kimi" animate={fase === 'resposta' && escolha === r.certa ? { y: [0, -18, 0] } : { y: [0, -3, 0] }} transition={{ duration: fase === 'resposta' ? 0.5 : 1.2, repeat: fase === 'resposta' ? 0 : Infinity }}>
          <AnimatePresence>
            {emote && (
              <motion.div key={emote + i} className="quiz__emote moldura moldura--clara" initial={{ scale: 0, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0 }}>
                {emote === 'coracao' ? <Sprite nome="coracao" escala={3} /> : <span className="quiz__reticencias">…</span>}
              </motion.div>
            )}
          </AnimatePresence>
          <Sprite nome="kimiCorre1" escala={4} />
        </motion.div>
        <span className="quiz__contador placa">
          {Math.min(i + 1, QUANTIDADE_QUIZ)}/{QUANTIDADE_QUIZ}
        </span>
      </div>

      <div className="quiz__dialogo">
        <div className="quiz__caixa moldura sombra-pixel" onClick={avancar} role="button" tabIndex={0} aria-live="polite" onKeyDown={(e) => e.key === 'Enter' && avancar()}>
          <p className="quiz__texto">
            {visivel}
            {completo && fase !== 'escolhendo' && fase !== 'fim' && <span className="quiz__seta" aria-hidden>▼</span>}
          </p>
        </div>
        <div className="quiz__retrato moldura sombra-pixel">
          <div className="quiz__retrato-img afundado">
            <Sprite nome="kimi" escala={5} alt="Kimi" />
          </div>
          <span className="quiz__nome">Kimi</span>
        </div>
      </div>

      <AnimatePresence>
        {fase === 'escolhendo' && (
          <motion.ul key="opcoes" className="quiz__opcoes moldura sombra-pixel" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>
            {r.opcoes.map((op) => (
              <li key={op}>
                <button className="quiz__opcao" onClick={() => responder(op)}>
                  {op}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
        {fase === 'resposta' && completo && (
          <motion.div key="proxima" className="quiz__rodape" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button className="botao botao--largo" onClick={avancar}>
              {i + 1 >= rodadas.length ? 'Ver resultado' : 'Próxima pergunta'}
            </button>
          </motion.div>
        )}
        {fase === 'fim' && completo && (
          <motion.div key="fim" className="quiz__rodape" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {venceu ? (
              <button className="botao botao--verde botao--largo" onClick={() => (p.vales.date ? recomecar() : setPremio(true))}>
                {p.vales.date && !premio ? 'Jogar de novo' : 'Pegar presente'}
              </button>
            ) : (
              <button className="botao botao--verde botao--largo" onClick={recomecar}>
                Tentar de novo
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Recompensa vale="date" aberta={premio} aoFechar={() => setPremio(false)} />
    </div>
  )
}
