import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { BarraJogo } from '../../componentes/BarraJogo'
import { confete } from '../../componentes/confete'
import { Estrela, NOME_FAIXA } from '../../componentes/Estrela'
import { som } from '../../componentes/som'
import { Sprite } from '../../componentes/Sprite'
import { PRESENTE_PESCA, VALES } from '../../conteudo/vales'
import {
  encerrarInterrompida,
  faixaDe,
  finalizarPesca,
  iniciarTentativa,
  LIMITES,
  melhorPontuacao,
  podeJogar,
  pontuacaoParcial,
  registrarResultado,
  TENTATIVAS_MAX,
  type Faixa,
} from '../../estado/pesca'
import { agoraISO, useProgresso } from '../../estado/progresso'
import { irPara } from '../../estado/rota'
import { BARRA, DURACAO, novoMotor, passo, peixeNaBarra, PEIXES, type Evento, type TipoPeixe } from './motor'
import './pesca.css'

type Fase = 'menu' | 'jogando' | 'resultado' | 'revelando'

const VARIACAO: Record<TipoPeixe, 'sardinha' | 'salmao' | 'atum' | 'lendario'> = {
  sardinha: 'sardinha',
  salmao: 'salmao',
  atum: 'atum',
  lendario: 'lendario',
}

const CORES_FAIXA: Record<Faixa, string[]> = {
  prata: ['#D7DEE8', '#FFFFFF', '#9AA7B4'],
  ouro: ['#F5C242', '#FFF3B0', '#E6A52E'],
  iridio: ['#A15BE0', '#E7C9FF', '#5FB3CF', '#F2A6B6'],
}

function TabelaFaixas({ melhor }: { melhor: number }) {
  const atingida = faixaDe(melhor)
  return (
    <ul className="faixas">
      {(['prata', 'ouro', 'iridio'] as Faixa[]).map((f) => (
        <li key={f} className={`faixa ${atingida && LIMITES[f] <= melhor ? 'faixa--atingida' : ''}`}>
          <Estrela faixa={f} escala={3} />
          <span className="faixa__nome">{NOME_FAIXA[f]}</span>
          <span className="faixa__pontos">{LIMITES[f]} pts</span>
        </li>
      ))}
    </ul>
  )
}

function Jogo({ aoTerminar, aoPegar }: { aoTerminar: (pontos: number, perfeitos: number) => void; aoPegar: (pontos: number) => void }) {
  const barra = useRef<HTMLDivElement>(null)
  const peixe = useRef<HTMLDivElement>(null)
  const progresso = useRef<HTMLDivElement>(null)
  const boia = useRef<HTMLDivElement>(null)
  const segurando = useRef(false)
  const [tempo, setTempo] = useState(DURACAO)
  const [pontos, setPontos] = useState(0)
  const [tipo, setTipo] = useState<TipoPeixe>('sardinha')
  const [bandeja, setBandeja] = useState<TipoPeixe[]>([])
  const [aviso, setAviso] = useState<{ id: number; texto: string; bom: boolean } | null>(null)

  useEffect(() => {
    const rng = Math.random
    const s = novoMotor(rng)
    setTipo(s.peixe)
    let perfeitos = 0
    let ultimo = performance.now()
    let raf = 0
    let segundo = DURACAO
    let ativo = true

    const quadro = (agora: number) => {
      if (!ativo) return
      const dt = Math.min(0.05, (agora - ultimo) / 1000)
      ultimo = agora
      const antes = s.peixe
      const ev: Evento | null = passo(s, dt, segurando.current, rng)
      if (ev?.tipo === 'pegou') {
        som.moeda()
        if (ev.perfeito) perfeitos++
        setPontos(s.pontos)
        aoPegar(s.pontos)
        setBandeja((b) => [...b, ev.peixe])
        setAviso({ id: agora, texto: `${PEIXES[ev.peixe].nome}! +${ev.pontos}${ev.perfeito ? ' PERFEITO!' : ''}`, bom: true })
      } else if (ev?.tipo === 'escapou') {
        som.erro()
        setAviso({ id: agora, texto: `O ${PEIXES[ev.peixe].nome.toLowerCase()} escapou…`, bom: false })
      }
      if (s.peixe !== antes || ev) setTipo(s.peixe)

      const naBarra = peixeNaBarra(s)
      barra.current!.style.bottom = `${s.barra * 100}%`
      barra.current!.classList.toggle('medidor__barra--ativa', naBarra && s.pausa <= 0)
      peixe.current!.style.bottom = `${s.peixePos * 100}%`
      peixe.current!.style.opacity = s.pausa > 0 ? '0' : '1'
      const pr = Math.max(0, Math.min(1, s.progresso))
      progresso.current!.style.height = `${pr * 100}%`
      progresso.current!.style.background = pr > 0.66 ? '#78b159' : pr > 0.33 ? '#f5c242' : '#e2556f'
      boia.current!.classList.toggle('boia--puxando', naBarra)
      if (naBarra && s.pausa <= 0 && Math.random() < 0.08) som.peixe()

      const seg = Math.ceil(s.tempo)
      if (seg !== segundo) {
        segundo = seg
        setTempo(seg)
      }
      if (s.tempo <= 0) {
        ativo = false
        aoTerminar(s.pontos, perfeitos)
        return
      }
      raf = requestAnimationFrame(quadro)
    }
    raf = requestAnimationFrame(quadro)

    const tecla = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        segurando.current = e.type === 'keydown'
      }
    }
    window.addEventListener('keydown', tecla)
    window.addEventListener('keyup', tecla)
    return () => {
      ativo = false
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', tecla)
      window.removeEventListener('keyup', tecla)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const segurar = (v: boolean) => (e: React.PointerEvent) => {
    e.preventDefault()
    segurando.current = v
  }

  return (
    <div
      className="pesca-jogo"
      onPointerDown={segurar(true)}
      onPointerUp={segurar(false)}
      onPointerCancel={segurar(false)}
      onPointerLeave={segurar(false)}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="pesca-jogo__hud">
        <span className={`placa ${tempo <= 10 ? 'placa--alerta' : ''}`}>
          {Math.floor(tempo / 60)}:{String(tempo % 60).padStart(2, '0')}
        </span>
        <span className="placa">{pontos} pts</span>
      </div>

      <div className="pesca-jogo__area">
        <div className="lago">
          <div className="lago__pier" />
          <div className="lago__kimi" aria-hidden>
            <Sprite nome="kimiCorre1" escala={3} />
          </div>
          <div className="lago__agua">
            <div ref={boia} className="boia" />
          </div>
          <AnimatePresence>
            {aviso && (
              <motion.p
                key={aviso.id}
                className={`lago__aviso ${aviso.bom ? '' : 'lago__aviso--ruim'}`}
                initial={{ y: 10, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -20, opacity: 0 }}
              >
                {aviso.texto}
              </motion.p>
            )}
          </AnimatePresence>
          <p className="lago__peixe placa">{PEIXES[tipo].nome}</p>
        </div>

        <div className="medidor moldura">
          <div className="medidor__agua afundado">
            <div ref={barra} className="medidor__barra" style={{ height: `${BARRA * 100}%` }} />
            <div ref={peixe} className="medidor__peixe">
              <Sprite nome="peixe" variacao={VARIACAO[tipo]} escala={2} />
            </div>
          </div>
          <div className="medidor__progresso afundado">
            <div ref={progresso} className="medidor__nivel" />
          </div>
        </div>
      </div>

      <p className="pesca-jogo__dica">Segure a tela para a barra subir. Solte para descer. Mantenha o peixe dentro da barra verde.</p>

      <div className="bandeja" aria-label={`${bandeja.length} peixes pescados`}>
        {bandeja.map((_, k) => (
          <motion.span key={k} initial={{ y: -30, scale: 0 }} animate={{ y: 0, scale: 1 }}>
            <Sprite nome="nigiri" escala={2} />
          </motion.span>
        ))}
      </div>
    </div>
  )
}

function Revelacao({ faixa, pontos }: { faixa: Faixa; pontos: number }) {
  const [aberto, setAberto] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => {
      setAberto(true)
      som.bau()
      confete(CORES_FAIXA[faixa], faixa === 'iridio' ? 1.8 : 1.2)
    }, 1600)
    return () => clearTimeout(t)
  }, [faixa])
  return (
    <div className="revelacao">
      <div className="revelacao__palco">
        <AnimatePresence>
          {aberto && (
            <motion.div className={`revelacao__estrela revelacao__estrela--${faixa}`} initial={{ y: 40, scale: 0 }} animate={{ y: -10, scale: 1 }} transition={{ type: 'spring', stiffness: 160, damping: 9 }}>
              <Estrela faixa={faixa} escala={9} />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div animate={aberto ? { scale: [1, 1.2, 1] } : { rotate: [0, -6, 6, -6, 6, 0] }} transition={aberto ? { duration: 0.4 } : { duration: 0.5, repeat: 2, repeatDelay: 0.05 }}>
          <Sprite nome="bau" escala={7} />
        </motion.div>
      </div>
      {aberto ? (
        <motion.div className="revelacao__texto" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <p className="revelacao__rotulo">Com {pontos} pontos, você ganhou:</p>
          <h2 className="revelacao__nome">{NOME_FAIXA[faixa]}</h2>
          <p className="revelacao__valor">até {PRESENTE_PESCA[faixa].valor}</p>
          <p className="revelacao__descricao">{PRESENTE_PESCA[faixa].descricao}</p>
          <button className="botao botao--verde botao--largo" onClick={() => irPara('bau')}>
            Ver no Baú
          </button>
        </motion.div>
      ) : (
        <p className="revelacao__suspense placa">Abrindo o baú…</p>
      )}
    </div>
  )
}

export function Pesca() {
  const { p, atualizar, conquistar, gastarEnergia } = useProgresso()
  const [fase, setFase] = useState<Fase>(p.pesca.finalizado ? 'revelando' : 'menu')
  const [ultima, setUltima] = useState<number | null>(null)
  const [confirmar, setConfirmar] = useState(false)
  const liberada = VALES.every((v) => p.vales[v.id])

  // Tentativa interrompida (recarregou no meio): fecha com os pontos parciais.
  useEffect(() => {
    if (p.pesca.emAndamento && fase !== 'jogando') atualizar((s) => ({ ...s, pesca: encerrarInterrompida(s.pesca) }))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const s = p.pesca
  const melhor = melhorPontuacao(s)
  const restantes = TENTATIVAS_MAX - s.tentativas.length

  if (!liberada) {
    return (
      <div className="pesca">
        <BarraJogo titulo="Pesca do Sushi" />
        <div className="tela">
          <div className="vazio moldura">
            <Sprite nome="cadeado" escala={5} />
            <p>A Pesca do Sushi é o grande final. Ela abre quando os outros 4 presentes estiverem no Baú.</p>
          </div>
        </div>
      </div>
    )
  }

  const comecar = () => {
    som.toque()
    gastarEnergia(8)
    atualizar((x) => ({ ...x, pesca: iniciarTentativa(x.pesca) }))
    setFase('jogando')
  }

  const terminar = (pontos: number, perfeitos: number) => {
    som.vitoria()
    if (perfeitos > 0) conquistar('pesca-perfeita')
    atualizar((x) => ({ ...x, pesca: registrarResultado(x.pesca, pontos) }))
    setUltima(pontos)
    setFase('resultado')
  }

  const finalizar = () => {
    setConfirmar(false)
    atualizar((x) => ({ ...x, pesca: finalizarPesca(x.pesca, agoraISO()) }))
    setFase('revelando')
  }

  if (fase === 'jogando') {
    return (
      <div className="pesca">
        <Jogo aoTerminar={terminar} aoPegar={(pts) => atualizar((x) => ({ ...x, pesca: pontuacaoParcial(x.pesca, pts) }))} />
      </div>
    )
  }

  if (fase === 'revelando' && s.finalizado) {
    return (
      <div className="pesca">
        <BarraJogo titulo="Pesca do Sushi" />
        <Revelacao faixa={s.finalizado.faixa} pontos={s.finalizado.pontos} />
      </div>
    )
  }

  const faixaMelhor = faixaDe(melhor)

  return (
    <div className="pesca">
      <BarraJogo titulo="Pesca do Sushi" />
      <div className="tela">
        {fase === 'resultado' && ultima !== null && (
          <motion.div className="resultado moldura moldura--clara sombra-pixel" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <p className="resultado__rotulo">Pontos desta tentativa</p>
            <p className="resultado__pontos">{ultima}</p>
            {ultima < melhor && <p className="resultado__nota">Sua melhor continua valendo: {melhor} pontos.</p>}
          </motion.div>
        )}

        {fase === 'menu' && (
          <div className="pesca__intro moldura">
            <h2>Como funciona</h2>
            <p>
              Você tem {TENTATIVAS_MAX} tentativas de {DURACAO} segundos. Pesque o máximo que conseguir: cada peixe vale pontos e peixe pego sem
              escapar da barra vale 50% a mais.
            </p>
            <p>Vale a sua melhor tentativa. Quando quiser, finalize e aceite o presente. O que tem dentro de cada um é surpresa.</p>
          </div>
        )}

        <TabelaFaixas melhor={melhor} />

        <div className="pesca__status moldura">
          <div>
            <span className="pesca__status-rotulo">Tentativas</span>
            <span className="tentativas" aria-label={`${restantes} restantes`}>
              {Array.from({ length: TENTATIVAS_MAX }, (_, k) => (
                <span key={k} className={`tentativas__bola ${k < s.tentativas.length ? 'tentativas__bola--usada' : ''}`} />
              ))}
            </span>
          </div>
          <div>
            <span className="pesca__status-rotulo">Melhor</span>
            <strong>{melhor} pts</strong>
          </div>
          <div>
            <span className="pesca__status-rotulo">Presente</span>
            {faixaMelhor ? <Estrela faixa={faixaMelhor} escala={2} /> : <span className="pesca__garantia">Prata garantida</span>}
          </div>
        </div>

        <div className="pesca__acoes">
          {podeJogar(s) && (
            <button className="botao botao--verde botao--largo" onClick={comecar}>
              {s.tentativas.length === 0 ? 'Começar a pescar' : `Tentar de novo (${restantes} ${restantes === 1 ? 'restante' : 'restantes'})`}
            </button>
          )}
          {s.tentativas.length > 0 && (
            <button className="botao botao--bordo botao--largo" onClick={() => setConfirmar(true)}>
              Finalizar e aceitar presente
            </button>
          )}
        </div>

        <AnimatePresence>
          {confirmar && (
            <motion.div className="confirmar moldura moldura--clara sombra-pixel" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>
              <p>
                Finalizar com <strong>{melhor} pontos</strong>
                {faixaMelhor ? ` (${NOME_FAIXA[faixaMelhor]})` : ' (Presente de Prata garantido)'}? Depois disso a pesca fecha de vez.
              </p>
              <div className="confirmar__acoes">
                <button className="botao" onClick={() => setConfirmar(false)}>
                  Ainda não
                </button>
                <button className="botao botao--verde" onClick={finalizar}>
                  Aceitar presente
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
