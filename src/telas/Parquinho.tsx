import { AnimatePresence, motion, useAnimationControls } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { confete, confeteMengao } from '../componentes/confete'
import { som } from '../componentes/som'
import { Sprite } from '../componentes/Sprite'
import { useProgresso } from '../estado/progresso'
import type { NomeSprite } from '../sprites/sprites'
import { BuscaBolinha } from './minijogos/BuscaBolinha'
import { Guitarra as GuitarraCompleta } from './minijogos/Guitarra'
import { ChuvaCoca as Chuva } from './minijogos/ChuvaCoca'
import { Junimos } from './minijogos/Junimos'
import { Roleta } from './minijogos/Roleta'
import './parquinho.css'
import './minijogos/minijogos.css'

function Brinquedo({ titulo, sprite, children }: { titulo: string; sprite: NomeSprite; children: ReactNode }) {
  return (
    <section className="brinquedo moldura sombra-pixel">
      <h2 className="brinquedo__titulo">
        <Sprite nome={sprite} escala={2} />
        {titulo}
      </h2>
      {children}
    </section>
  )
}

/* ---------- Coca Zero: segure para agitar até estourar ---------- */
function Coca() {
  const { conquistar, atualizar } = useProgresso()
  const [pressao, setPressao] = useState(0)
  const [estouro, setEstouro] = useState(0)
  const segurando = useRef(false)

  const atual = useRef(0)

  useEffect(() => {
    let raf = 0
    let ultimo = performance.now()
    let espera: number | undefined
    const loop = (t: number) => {
      const dt = (t - ultimo) / 1000
      ultimo = t
      const p = atual.current
      if (p < 1) {
        const n = segurando.current ? p + dt * 0.45 : Math.max(0, p - dt * 0.25)
        atual.current = Math.min(1, n)
        if (n !== p) setPressao(atual.current)
        if (n >= 1) {
          setEstouro(t)
          conquistar('coca')
          atualizar((s) => ({ ...s, energia: 100 }))
          for (let k = 0; k < 8; k++) setTimeout(som.bolha, k * 60)
          espera = window.setTimeout(() => {
            atual.current = 0
            setPressao(0)
          }, 1800)
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(espera)
    }
  }, [conquistar, atualizar])

  const segurar = (v: boolean) => () => {
    segurando.current = v
  }

  return (
    <Brinquedo titulo="Coca Zero" sprite="coca">
      <p className="brinquedo__dica">Segure a lata para agitar. Quando a pressão encher… cuidado.</p>
      <div className="coca">
        <motion.button
          className="coca__lata"
          onPointerDown={segurar(true)}
          onPointerUp={segurar(false)}
          onPointerLeave={segurar(false)}
          onPointerCancel={segurar(false)}
          onContextMenu={(e) => e.preventDefault()}
          animate={pressao > 0 && pressao < 1 ? { rotate: [-6 * pressao, 6 * pressao], x: [-3 * pressao, 3 * pressao] } : { rotate: 0, x: 0 }}
          transition={{ duration: 0.08, repeat: Infinity, repeatType: 'mirror' }}
          aria-label="Lata de Coca Zero. Segure para agitar."
        >
          <Sprite nome="coca" escala={8} />
        </motion.button>
        <div className="coca__pressao afundado" aria-label={`Pressão ${Math.round(pressao * 100)}%`}>
          <div style={{ height: `${pressao * 100}%` }} />
        </div>
        <AnimatePresence>
          {estouro > 0 &&
            Array.from({ length: 28 }, (_, i) => (
              <motion.span
                key={`${estouro}-${i}`}
                className="coca__bolha"
                initial={{ x: 0, y: 0, scale: 0.4, opacity: 1 }}
                animate={{ x: (Math.random() - 0.5) * 260, y: -120 - Math.random() * 260, scale: 0.6 + Math.random(), opacity: 0 }}
                transition={{ duration: 1.2 + Math.random() * 0.6, ease: 'easeOut' }}
                onAnimationComplete={() => i === 0 && setEstouro(0)}
              />
            ))}
        </AnimatePresence>
      </div>
      {pressao >= 1 && <p className="brinquedo__resultado">PSSSHHH! Energia no máximo.</p>}
    </Brinquedo>
  )
}

/* ---------- Plástico-bolha ---------- */
const BOLHAS = 30

function PlasticoBolha() {
  const [estouradas, setEstouradas] = useState<Set<number>>(new Set())
  const [total, setTotal] = useState(0)

  const estourar = (i: number) => {
    if (estouradas.has(i)) return
    som.bolha()
    setEstouradas((s) => new Set(s).add(i))
    setTotal((t) => t + 1)
  }

  const passar = (e: React.PointerEvent) => {
    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
    const i = el?.dataset.bolha
    if (i !== undefined) estourar(Number(i))
  }

  return (
    <Brinquedo titulo="Plástico-bolha infinito" sprite="estrela">
      <div className="plastico" onPointerDown={passar} onPointerMove={(e) => (e.buttons > 0 || e.pointerType === 'touch') && passar(e)}>
        {Array.from({ length: BOLHAS }, (_, i) => (
          <span key={i} data-bolha={i} className={`plastico__bolha ${estouradas.has(i) ? 'plastico__bolha--estourada' : ''}`} />
        ))}
      </div>
      <div className="brinquedo__linha">
        <span>{total} estouradas</span>
        <button className="botao" onClick={() => setEstouradas(new Set())} disabled={estouradas.size === 0}>
          Plástico novo
        </button>
      </div>
    </Brinquedo>
  )
}

/* ---------- Carinho no golden ---------- */
function Carinho() {
  const [amizade, setAmizade] = useState(0)
  const [coracoes, setCoracoes] = useState<{ id: number; x: number }[]>([])
  const ultimo = useRef<{ x: number; y: number } | null>(null)
  const acumulado = useRef(0)
  const rabo = useAnimationControls()

  const mover = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.buttons === 0) return
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const p = { x: e.clientX - r.left, y: e.clientY - r.top }
    if (ultimo.current) acumulado.current += Math.hypot(p.x - ultimo.current.x, p.y - ultimo.current.y)
    ultimo.current = p
    if (acumulado.current > 140) {
      acumulado.current = 0
      som.moeda()
      setAmizade((a) => Math.min(10, a + 1))
      setCoracoes((c) => [...c.slice(-6), { id: performance.now(), x: p.x }])
      void rabo.start({ rotate: [0, -8, 8, -8, 8, 0], transition: { duration: 0.5 } })
    }
  }

  return (
    <Brinquedo titulo="Carinho no golden" sprite="kimi">
      <p className="brinquedo__dica">Faça carinho passando o dedo no Kimi.</p>
      <div
        className="carinho"
        onPointerMove={mover}
        onPointerDown={(e) => (ultimo.current = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })}
        onPointerUp={() => (ultimo.current = null)}
      >
        <motion.div animate={rabo}>
          <Sprite nome="kimi" escala={9} alt="Kimi" />
        </motion.div>
        <AnimatePresence>
          {coracoes.map((c) => (
            <motion.span key={c.id} className="carinho__coracao" style={{ left: c.x }} initial={{ y: 0, opacity: 1 }} animate={{ y: -110, opacity: 0 }} transition={{ duration: 1.1 }}>
              <Sprite nome="coracao" escala={3} />
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
      <div className="amizade" aria-label={`Amizade ${amizade} de 10`}>
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className={i < amizade ? '' : 'amizade--vazio'}>
            <Sprite nome="coracao" escala={2} />
          </span>
        ))}
      </div>
      {amizade >= 10 && <p className="brinquedo__resultado">Amizade máxima! O Kimi te ama (ele já amava).</p>}
    </Brinquedo>
  )
}

/* ---------- D20 do destino ---------- */
function resultadoD20(n: number) {
  if (n === 20) return 'SUCESSO CRÍTICO! Hoje tudo dá certo.'
  if (n === 1) return 'Falha crítica. Toma uma Coca Zero e rola de novo.'
  if (n >= 15) return 'Sucesso! O universo está do seu lado.'
  if (n >= 10) return 'Passou no teste. Na raça, mas passou.'
  if (n >= 5) return 'Hmm… rola com vantagem da próxima vez.'
  return 'O mestre está de mau humor. Tenta de novo.'
}

function D20() {
  const { conquistar } = useProgresso()
  const [valor, setValor] = useState<number | null>(null)
  const [rolando, setRolando] = useState(false)

  const rolar = () => {
    if (rolando) return
    setRolando(true)
    let k = 0
    const giro = setInterval(() => {
      setValor(1 + Math.floor(Math.random() * 20))
      som.toque()
      if (++k >= 12) {
        clearInterval(giro)
        const final = 1 + Math.floor(Math.random() * 20)
        setValor(final)
        setRolando(false)
        if (final === 20) {
          som.vitoria()
          confete()
          conquistar('d20-critico')
        } else if (final === 1) som.erro()
      }
    }, 70)
  }

  return (
    <Brinquedo titulo="D20 do destino" sprite="d20">
      <div className="d20">
        <motion.button className="d20__dado" onClick={rolar} animate={rolando ? { rotate: [0, 360] } : { rotate: 0 }} transition={rolando ? { duration: 0.4, repeat: Infinity, ease: 'linear' } : {}} aria-label="Rolar o d20">
          <Sprite nome="d20" escala={7} />
          {valor !== null && <span className={`d20__valor ${valor === 20 ? 'd20__valor--critico' : valor === 1 ? 'd20__valor--falha' : ''}`}>{valor}</span>}
        </motion.button>
        <p className="brinquedo__resultado" role="status">
          {valor === null ? 'Toque no dado para rolar.' : rolando ? 'Rolando…' : resultadoD20(valor)}
        </p>
      </div>
    </Brinquedo>
  )
}

/* ---------- Ateliê ---------- */
const TINTAS = ['#2C4A9E', '#F2A6B6', '#B8A6E3', '#F5C242', '#4F8A3C', '#E07A3A', '#8C2B3A', '#3A2214', '#FFFFFF']

function Atelie() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [cor, setCor] = useState(TINTAS[0])
  const [pincel, setPincel] = useState(8)
  const ultimo = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const c = canvas.current!
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#fffaf0'
    ctx.fillRect(0, 0, c.width, c.height)
  }, [])

  const ponto = (e: React.PointerEvent) => {
    const c = canvas.current!
    const r = c.getBoundingClientRect()
    return { x: ((e.clientX - r.left) / r.width) * c.width, y: ((e.clientY - r.top) / r.height) * c.height }
  }

  const desenhar = (e: React.PointerEvent) => {
    if (!ultimo.current) return
    const ctx = canvas.current!.getContext('2d')!
    const p = ponto(e)
    ctx.strokeStyle = cor
    ctx.lineWidth = pincel * 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(ultimo.current.x, ultimo.current.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    ultimo.current = p
  }

  const limpar = () => {
    const c = canvas.current!
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#fffaf0'
    ctx.fillRect(0, 0, c.width, c.height)
  }

  const salvar = () => {
    const a = document.createElement('a')
    a.href = canvas.current!.toDataURL('image/png')
    a.download = 'desenho-da-geo.png'
    a.click()
  }

  return (
    <Brinquedo titulo="Ateliê" sprite="girassol">
      <canvas
        ref={canvas}
        width={640}
        height={480}
        className="atelie__tela"
        onPointerDown={(e) => {
          ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
          ultimo.current = ponto(e)
          desenhar(e)
        }}
        onPointerMove={desenhar}
        onPointerUp={() => (ultimo.current = null)}
        onPointerCancel={() => (ultimo.current = null)}
        aria-label="Tela de pintura"
      />
      <div className="atelie__tintas">
        {TINTAS.map((t) => (
          <button key={t} className={`atelie__tinta ${cor === t ? 'atelie__tinta--ativa' : ''}`} style={{ background: t }} onClick={() => setCor(t)} aria-label={`Cor ${t}`} />
        ))}
      </div>
      <div className="brinquedo__linha">
        <div className="atelie__pinceis">
          {[4, 8, 16].map((p) => (
            <button key={p} className={`atelie__pincel ${pincel === p ? 'atelie__pincel--ativo' : ''}`} onClick={() => setPincel(p)} aria-label={`Pincel ${p}`}>
              <span style={{ width: p + 4, height: p + 4 }} />
            </button>
          ))}
        </div>
        <button className="botao" onClick={limpar}>
          Limpar
        </button>
        <button className="botao botao--verde" onClick={salvar}>
          Salvar
        </button>
      </div>
    </Brinquedo>
  )
}

/* ---------- Air guitar ---------- */
function Guitarra() {
  return (
    <Brinquedo titulo="Air guitar" sprite="guitarra">
      <GuitarraCompleta />
    </Brinquedo>
  )
}

/* ---------- Mengão ---------- */
function Mengao() {
  const [gritos, setGritos] = useState(0)
  const tela = useAnimationControls()
  const gritar = () => {
    setGritos((g) => g + 1)
    confeteMengao()
    som.vitoria()
    void tela.start({ x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.4 } })
  }
  return (
    <Brinquedo titulo="Mengão" sprite="estrela">
      <motion.button className="mengao" onClick={gritar} animate={tela} whileTap={{ scale: 0.95 }}>
        <span className="mengao__grito">{gritos === 0 ? 'Toque para gritar' : 'MENGÃÃÃO!'}</span>
      </motion.button>
      <p className="brinquedo__resultado">{gritos > 0 ? `${gritos} ${gritos === 1 ? 'grito' : 'gritos'} pela Nação.` : 'Uma vez Flamengo…'}</p>
    </Brinquedo>
  )
}

const ABAS = [
  { id: 'minijogos', nome: 'Minijogos' },
  { id: 'brinquedos', nome: 'Brinquedos' },
] as const

export function Parquinho() {
  const [aba, setAba] = useState<(typeof ABAS)[number]['id']>('minijogos')
  return (
    <div className="tela">
      <header className="cabecalho-tela">
        <Sprite nome="d20" escala={4} />
        <h1 className="titulo-jogo">Parquinho</h1>
        <p>Nada aqui vale presente. É só diversão.</p>
      </header>

      <div className="abas-parquinho" role="tablist">
        {ABAS.map((a) => (
          <button
            key={a.id}
            role="tab"
            aria-selected={aba === a.id}
            className={`frasco ${aba === a.id ? 'frasco--ativo' : ''}`}
            onClick={() => {
              som.toque()
              setAba(a.id)
            }}
          >
            {a.nome}
          </button>
        ))}
      </div>

      {aba === 'minijogos' ? (
        <>
          <Brinquedo titulo="Acerte o Junimo" sprite="junimo">
            <p className="brinquedo__dica">Toque nos Junimos antes que eles se escondam. Joja Cola tira pontos!</p>
            <Junimos />
          </Brinquedo>
          <Brinquedo titulo="Chuva de Coca Zero" sprite="coca">
            <Chuva />
          </Brinquedo>
          <Brinquedo titulo="Kimi, busca!" sprite="bola">
            <BuscaBolinha />
          </Brinquedo>
          <Brinquedo titulo="Roleta do destino" sprite="d20">
            <p className="brinquedo__dica">Sem ideia do que fazer no próximo encontro? Gira.</p>
            <Roleta />
          </Brinquedo>
        </>
      ) : (
        <>
          <Coca />
          <Carinho />
          <D20 />
          <PlasticoBolha />
          <Atelie />
          <Guitarra />
          <Mengao />
        </>
      )}
    </div>
  )
}
