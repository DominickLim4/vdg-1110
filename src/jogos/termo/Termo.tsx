import { motion, useAnimationControls } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { BarraJogo } from '../../componentes/BarraJogo'
import { Recompensa } from '../../componentes/Recompensa'
import { som } from '../../componentes/som'
import { useProgresso } from '../../estado/progresso'
import { avaliarPalpite, CHANCES, normalizar, PALAVRAS, TAMANHO, type Marca } from './regras'
import './termo.css'

const TECLADO = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']

const PRIORIDADE: Record<Marca, number> = { ausente: 0, presente: 1, certa: 2 }

const PROVOCACOES = [
  'Palavra de 5 letras. Pensa no Vale que você quer ganhar…',
  'Dica: é um lugar. E não é a biblioteca.',
  'Dica: tem quarto, tem espelho no teto e tem cobrança por hora.',
]

export function Termo() {
  const { p, desbloquearVale } = useProgresso()
  const [rodada, setRodada] = useState(0)
  const resposta = PALAVRAS[rodada % PALAVRAS.length]
  const [palpites, setPalpites] = useState<string[]>([])
  const [atual, setAtual] = useState('')
  const [aviso, setAviso] = useState(PROVOCACOES[0])
  const [premio, setPremio] = useState(false)
  const linha = useAnimationControls()

  const venceu = palpites.includes(resposta)
  const perdeu = !venceu && palpites.length >= CHANCES
  const acabou = venceu || perdeu

  const marcasTeclas = new Map<string, Marca>()
  for (const g of palpites) {
    avaliarPalpite(g, resposta).forEach((m, k) => {
      const anterior = marcasTeclas.get(g[k])
      if (!anterior || PRIORIDADE[m] > PRIORIDADE[anterior]) marcasTeclas.set(g[k], m)
    })
  }

  const enviar = useCallback(() => {
    if (acabou) return
    if (atual.length < TAMANHO) {
      som.erro()
      setAviso('Faltam letras. São 5.')
      void linha.start({ x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.35 } })
      return
    }
    const novos = [...palpites, atual]
    setPalpites(novos)
    setAtual('')
    if (atual === resposta) {
      som.vitoria()
      setAviso(resposta === 'MOTEL' ? 'MOTEL! Era isso mesmo. Já sabe onde vai usar esse vale…' : `${resposta}! Acertou.`)
      if (!p.vales.transa) {
        desbloquearVale('transa')
        setTimeout(() => setPremio(true), 1600)
      }
    } else if (novos.length >= CHANCES) {
      som.erro()
      setAviso(`Era ${resposta}. Calma, tem outra palavra esperando.`)
    } else {
      som.toque()
      setAviso(PROVOCACOES[Math.min(novos.length, PROVOCACOES.length - 1)])
    }
  }, [acabou, atual, palpites, resposta, p.vales.transa, desbloquearVale, linha])

  const digitar = useCallback(
    (tecla: string) => {
      if (acabou) return
      if (tecla === 'ENTER') return enviar()
      if (tecla === 'APAGAR') return setAtual((a) => a.slice(0, -1))
      setAtual((a) => (a.length < TAMANHO ? a + tecla : a))
    },
    [acabou, enviar],
  )

  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Enter') digitar('ENTER')
      else if (e.key === 'Backspace') digitar('APAGAR')
      else {
        const l = normalizar(e.key)
        if (l.length === 1) digitar(l)
      }
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [digitar])

  const novaPalavra = () => {
    setRodada((r) => r + 1)
    setPalpites([])
    setAtual('')
    setAviso('Nova palavra! Agora vai.')
  }

  return (
    <div className="termo">
      <BarraJogo titulo="Termo Proibido" />

      <div className="termo__grade" aria-label="Palpites">
        {Array.from({ length: CHANCES }, (_, l) => {
          const palpite = palpites[l]
          const marcas = palpite ? avaliarPalpite(palpite, resposta) : null
          const texto = palpite ?? (l === palpites.length ? atual : '')
          const ehAtual = l === palpites.length
          return (
            <motion.div key={`${rodada}-${l}`} className="termo__linha" animate={ehAtual ? linha : undefined}>
              {Array.from({ length: TAMANHO }, (_, c) => (
                <motion.span
                  key={c}
                  className={`termo__casa ${marcas ? `termo__casa--${marcas[c]}` : texto[c] ? 'termo__casa--cheia' : ''}`}
                  initial={false}
                  animate={marcas ? { rotateX: [90, 0] } : { scale: texto[c] ? [1.12, 1] : 1 }}
                  transition={{ delay: marcas ? c * 0.12 : 0, duration: 0.25 }}
                >
                  {texto[c] ?? ''}
                </motion.span>
              ))}
            </motion.div>
          )
        })}
      </div>

      <p className="termo__aviso moldura moldura--clara" role="status">
        {aviso}
      </p>

      {acabou ? (
        <div className="termo__fim">
          {venceu ? (
            <button className="botao botao--verde botao--largo" onClick={() => (p.vales.transa && !premio ? novaPalavra() : setPremio(true))}>
              {p.vales.transa ? 'Jogar outra palavra' : 'Pegar presente'}
            </button>
          ) : (
            <button className="botao botao--verde botao--largo" onClick={novaPalavra}>
              Tentar outra palavra
            </button>
          )}
        </div>
      ) : (
        <div className="teclado">
          {TECLADO.map((fileira, f) => (
            <div key={f} className="teclado__fileira">
              {f === 2 && (
                <button className="tecla tecla--larga" onClick={() => digitar('ENTER')}>
                  Enviar
                </button>
              )}
              {[...fileira].map((t) => (
                <button key={t} className={`tecla ${marcasTeclas.has(t) ? `tecla--${marcasTeclas.get(t)}` : ''}`} onClick={() => digitar(t)}>
                  {t}
                </button>
              ))}
              {f === 2 && (
                <button className="tecla tecla--larga" onClick={() => digitar('APAGAR')} aria-label="Apagar">
                  ⌫
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <Recompensa vale="transa" aberta={premio} aoFechar={() => setPremio(false)} />
    </div>
  )
}
