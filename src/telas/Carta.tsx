import { AnimatePresence, motion, type PanInfo } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { confete } from '../componentes/confete'
import { som } from '../componentes/som'
import { Sprite } from '../componentes/Sprite'
import textoCarta from '../conteudo/carta.md?raw'
import { useProgresso } from '../estado/progresso'
import './carta.css'

const VELAS = 25

function lerCarta() {
  const semComentarios = textoCarta.replace(/<!--[\s\S]*?-->/g, '').trim()
  const rascunho = /^RASCUNHO\s*$/m.test(semComentarios)
  const blocos = semComentarios
    .replace(/^RASCUNHO\s*$/m, '')
    .split(/\n\s*\n/)
    .map((b) => b.trim().replace(/\n/g, ' '))
    .filter(Boolean)
  return { rascunho, saudacao: blocos[0] ?? '', corpo: blocos.slice(1, -1), assinatura: blocos.length > 1 ? blocos[blocos.length - 1] : '' }
}

const CARTA = lerCarta()

type Etapa = 'envelope' | 'abrindo' | 'lendo'

function Envelope({ aoAbrir }: { aoAbrir: () => void }) {
  const [rompido, setRompido] = useState(false)
  const soltar = (_: unknown, info: PanInfo) => {
    if (Math.hypot(info.offset.x, info.offset.y) > 70) {
      setRompido(true)
      som.bau()
      setTimeout(aoAbrir, 700)
    }
  }
  return (
    <div className="envelope-area">
      <div className={`envelope ${rompido ? 'envelope--aberto' : ''}`}>
        <div className="envelope__corpo" />
        <div className="envelope__aba" />
        <div className="envelope__para">
          <span>Para:</span> Geo Froes
        </div>
        <AnimatePresence>
          {!rompido && (
            <motion.div
              className="lacre"
              drag
              dragSnapToOrigin
              dragElastic={0.5}
              onDragEnd={soltar}
              onClick={() => {
                setRompido(true)
                som.bau()
                setTimeout(aoAbrir, 700)
              }}
              whileDrag={{ scale: 1.1, rotate: -10 }}
              exit={{ scale: 1.6, opacity: 0, rotate: 40 }}
              role="button"
              aria-label="Romper o lacre"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && (e.currentTarget as HTMLElement).click()}
            >
              <span>G</span>
            </motion.div>
          )}
        </AnimatePresence>
        {rompido &&
          Array.from({ length: 10 }, (_, i) => (
            <motion.span
              key={i}
              className="lacre__caco"
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{ x: Math.cos(i * 0.63) * 120, y: Math.sin(i * 0.63) * 120 + 60, opacity: 0, rotate: i * 40 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          ))}
      </div>
      <p className="envelope__instrucao placa">{rompido ? 'Abrindo…' : 'Arraste o lacre para abrir'}</p>
    </div>
  )
}

function Bolo() {
  const { conquistar } = useProgresso()
  const [apagadas, setApagadas] = useState<Set<number>>(new Set())
  const [microfone, setMicrofone] = useState<'desligado' | 'ouvindo' | 'negado'>('desligado')
  const fluxo = useRef<MediaStream | null>(null)
  const acabou = apagadas.size >= VELAS

  const apagar = useCallback((quantas: number, especifica?: number) => {
    setApagadas((s) => {
      if (s.size >= VELAS) return s
      const n = new Set(s)
      if (especifica !== undefined) n.add(especifica)
      else {
        const acesas = Array.from({ length: VELAS }, (_, i) => i).filter((i) => !n.has(i))
        for (let k = 0; k < quantas && acesas.length; k++) n.add(acesas.splice(Math.floor(Math.random() * acesas.length), 1)[0])
      }
      if (n.size > s.size) som.bolha()
      return n
    })
  }, [])

  useEffect(() => {
    if (!acabou) return
    fluxo.current?.getTracks().forEach((t) => t.stop())
    som.vitoria()
    confete()
    setTimeout(() => confete(['#F5C242', '#F2A6B6', '#B8A6E3'], 1.5), 700)
    conquistar('velas')
  }, [acabou]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => fluxo.current?.getTracks().forEach((t) => t.stop()), [])

  const ouvir = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      fluxo.current = stream
      setMicrofone('ouvindo')
      const ctx = new AudioContext()
      const analisador = ctx.createAnalyser()
      analisador.fftSize = 512
      ctx.createMediaStreamSource(stream).connect(analisador)
      const dados = new Uint8Array(analisador.fftSize)
      const medir = () => {
        if (!fluxo.current?.active) return void ctx.close()
        analisador.getByteTimeDomainData(dados)
        let soma = 0
        for (const v of dados) soma += ((v - 128) / 128) ** 2
        const volume = Math.sqrt(soma / dados.length)
        if (volume > 0.12) apagar(volume > 0.25 ? 2 : 1)
        requestAnimationFrame(medir)
      }
      medir()
    } catch {
      setMicrofone('negado')
    }
  }

  const passarDedo = (e: React.PointerEvent) => {
    const alvo = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
    const i = alvo?.closest<HTMLElement>('[data-vela]')?.dataset.vela
    if (i !== undefined) apagar(1, Number(i))
  }

  return (
    <section className="bolo-area" aria-label="Bolo de aniversário">
      <AnimatePresence mode="wait">
        {acabou ? (
          <motion.h2 key="feliz" className="bolo__parabens titulo-jogo" initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 10 }}>
            Feliz 25, Geo!
          </motion.h2>
        ) : (
          <motion.p key="instr" className="bolo__instrucao" exit={{ opacity: 0 }}>
            Faça um pedido e apague as {VELAS} velas: sopre no microfone ou passe o dedo por cima delas.
          </motion.p>
        )}
      </AnimatePresence>

      <div className="bolo" onPointerDown={passarDedo} onPointerMove={(e) => e.buttons > 0 || e.pointerType === 'touch' ? passarDedo(e) : undefined}>
        <div className="bolo__velas">
          {Array.from({ length: VELAS }, (_, i) => (
            <span key={i} className={`vela ${apagadas.has(i) ? 'vela--apagada' : ''}`} data-vela={i}>
              <span className="vela__chama" />
              <span className="vela__fumaca" />
            </span>
          ))}
        </div>
        <div className="bolo__andar bolo__andar--topo" />
        <div className="bolo__andar bolo__andar--meio" />
        <div className="bolo__andar bolo__andar--base" />
        <div className="bolo__prato" />
      </div>

      {!acabou && (
        <div className="bolo__acoes">
          {microfone === 'desligado' && (
            <button className="botao botao--verde botao--largo" onClick={ouvir}>
              Soprar pelo microfone
            </button>
          )}
          {microfone === 'ouvindo' && <p className="placa">Ouvindo… sopra forte!</p>}
          {microfone === 'negado' && <p className="bolo__aviso">Sem microfone, tudo bem: passe o dedo sobre as velas.</p>}
          <span className="bolo__contagem">
            {VELAS - apagadas.size} {VELAS - apagadas.size === 1 ? 'vela acesa' : 'velas acesas'}
          </span>
        </div>
      )}
      {acabou && (
        <button className="botao botao--largo" onClick={() => setApagadas(new Set())}>
          Acender de novo
        </button>
      )}
    </section>
  )
}

export function Carta() {
  const { p, conquistar } = useProgresso()
  const [etapa, setEtapa] = useState<Etapa>(p.conquistas.carta ? 'lendo' : 'envelope')

  const abrir = () => {
    conquistar('carta')
    setEtapa('abrindo')
    setTimeout(() => setEtapa('lendo'), 900)
  }

  if (etapa === 'envelope') {
    return (
      <div className="tela carta-tela">
        <Envelope aoAbrir={abrir} />
      </div>
    )
  }

  return (
    <div className="tela carta-tela">
      <motion.article
        className="carta"
        initial={{ y: 200, scaleY: 0.2, opacity: 0 }}
        animate={{ y: 0, scaleY: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        style={{ transformOrigin: '50% 0%' }}
      >
        {CARTA.rascunho && <p className="carta__rascunho">Rascunho: o texto final ainda vai ser escrito.</p>}
        <div className="carta__ornamento" aria-hidden>
          <Sprite nome="girassol" escala={3} />
          <Sprite nome="coracao" escala={3} />
          <Sprite nome="girassol" escala={3} />
        </div>
        <h1 className="carta__saudacao">{CARTA.saudacao}</h1>
        {CARTA.corpo.map((par, i) => (
          <motion.p
            key={i}
            className="carta__paragrafo"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {par}
          </motion.p>
        ))}
        {CARTA.assinatura && (
          <motion.p className="carta__assinatura" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }}>
            {CARTA.assinatura}
          </motion.p>
        )}
        <div className="carta__margem" aria-hidden>
          <Sprite nome="kimi" escala={3} />
          <Sprite nome="nigiri" escala={3} />
        </div>
      </motion.article>

      <Bolo />
    </div>
  )
}
