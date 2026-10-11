import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'
import { confete } from '../../componentes/confete'
import { som } from '../../componentes/som'
import { Janela } from '../../componentes/Janela'
import { Sprite } from '../../componentes/Sprite'
import { abrirWhatsApp } from '../../conteudo/contato'
import { useProgresso } from '../../estado/progresso'
import { BEBIDAS, FORMATOS, INGREDIENTES, NOMES_SUGERIDOS, PEIXES_SUSHI, type Bebida, type Formato, type PeixeSushi } from './dados'
import { PecaSushi } from './PecaSushi'
import './sushi.css'

type Etapa = 'peixe' | 'corte' | 'montagem' | 'servir' | 'bebida' | 'comanda'

const PASSOS: { id: Etapa; nome: string }[] = [
  { id: 'peixe', nome: 'Peixe' },
  { id: 'corte', nome: 'Corte' },
  { id: 'montagem', nome: 'Montagem' },
  { id: 'servir', nome: 'Servir' },
  { id: 'bebida', nome: 'Bebida' },
]

const CORTES = 5

function Passos({ etapa }: { etapa: Etapa }) {
  const atual = etapa === 'comanda' ? PASSOS.length : PASSOS.findIndex((p) => p.id === etapa)
  return (
    <ol className="passos" aria-label="Etapas">
      {PASSOS.map((p, i) => (
        <li key={p.id} className={i < atual ? 'passo--feito' : i === atual ? 'passo--atual' : ''} aria-current={i === atual ? 'step' : undefined}>
          <span className="passo__bola">{i < atual ? '✓' : i + 1}</span>
          <span className="passo__nome">{p.nome}</span>
        </li>
      ))}
    </ol>
  )
}

/* ---------- Etapa 1: peixe ---------- */
function EscolherPeixe({ aoEscolher }: { aoEscolher: (p: PeixeSushi) => void }) {
  return (
    <section className="etapa">
      <h2 className="etapa__titulo">Qual peixe hoje, chef?</h2>
      <div className="peixes">
        {PEIXES_SUSHI.map((p) => (
          <motion.button
            key={p.id}
            className="peixe-carta moldura moldura--clara"
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              som.moeda()
              aoEscolher(p)
            }}
          >
            <span className="peixe-carta__file" style={{ background: `repeating-linear-gradient(115deg, ${p.cor} 0 9px, ${p.listra} 9px 12px)` }} />
            <strong>{p.nome}</strong>
            <small>{p.nota}</small>
          </motion.button>
        ))}
      </div>
    </section>
  )
}

/* ---------- Etapa 2: corte ---------- */
function Cortar({ peixe, aoTerminar }: { peixe: PeixeSushi; aoTerminar: () => void }) {
  const file = useRef<HTMLDivElement>(null)
  const inicio = useRef<{ x: number; y: number } | null>(null)
  const [rastro, setRastro] = useState<{ x: number; y: number }[]>([])
  const [cortes, setCortes] = useState<number[]>([])
  const [aviso, setAviso] = useState('Deslize o dedo de cima para baixo sobre o peixe, como uma faca.')
  const pronto = cortes.length >= CORTES

  const relativo = (e: React.PointerEvent) => {
    const r = file.current!.getBoundingClientRect()
    return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }
  }

  const cortarEm = (x: number) => {
    if (pronto) return
    const pos = Math.max(0.08, Math.min(0.92, x))
    if (cortes.some((c) => Math.abs(c - pos) < 0.08)) {
      setAviso('Já tem um corte aí. Tenta um pouco mais pro lado.')
      return
    }
    const novos = [...cortes, pos].sort((a, b) => a - b)
    setCortes(novos)
    som.tambor(false)
    if (novos.length >= CORTES) {
      som.vitoria()
      setAviso('Cortes perfeitos. O Gus ficaria orgulhoso.')
    } else setAviso(`${novos.length} de ${CORTES} cortes.`)
  }

  const soltar = (e: React.PointerEvent) => {
    const ini = inicio.current
    inicio.current = null
    setRastro([])
    if (!ini) return
    const fim = relativo(e)
    if (Math.abs(fim.y - ini.y) >= 0.6 && Math.abs(fim.x - ini.x) < 0.3) cortarEm((ini.x + fim.x) / 2)
    else if (!pronto) setAviso('Faca firme: deslize de cima até embaixo do peixe.')
  }

  const proximoCorteAuto = () => {
    const alvos = Array.from({ length: CORTES }, (_, i) => (i + 1) / (CORTES + 1))
    const livre = alvos.find((a) => !cortes.some((c) => Math.abs(c - a) < 0.08))
    if (livre !== undefined) cortarEm(livre)
  }

  const pedacos = [0, ...cortes, 1]

  return (
    <section className="etapa">
      <h2 className="etapa__titulo">Hora de cortar o {peixe.nome.toLowerCase()}</h2>
      <div
        className="tabua"
        onPointerDown={(e) => {
          ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
          inicio.current = relativo(e)
          setRastro([relativo(e)])
        }}
        onPointerMove={(e) => inicio.current && setRastro((r) => [...r.slice(-12), relativo(e)])}
        onPointerUp={soltar}
        onPointerCancel={() => {
          inicio.current = null
          setRastro([])
        }}
      >
        <div ref={file} className="tabua__file">
          {pedacos.slice(0, -1).map((ini, k) => (
            <motion.span
              key={k}
              className="tabua__pedaco"
              style={{
                left: `${ini * 100}%`,
                width: `${(pedacos[k + 1] - ini) * 100}%`,
                background: `repeating-linear-gradient(115deg, ${peixe.cor} 0 9px, ${peixe.listra} 9px 12px)`,
              }}
              animate={pronto ? { x: (k - CORTES / 2) * 6, rotate: (k % 2 ? 1 : -1) * 3 } : { x: 0, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 14, delay: pronto ? k * 0.05 : 0 }}
            />
          ))}
          <svg className="tabua__rastro" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <polyline points={rastro.map((p) => `${p.x * 100},${p.y * 100}`).join(' ')} />
          </svg>
        </div>
      </div>
      <p className="etapa__aviso" role="status">
        {aviso}
      </p>
      {pronto ? (
        <button className="botao botao--verde botao--largo" onClick={aoTerminar}>
          Montar o sushi
        </button>
      ) : (
        <button className="botao botao--largo" onClick={proximoCorteAuto}>
          Cortar com um toque
        </button>
      )}
    </section>
  )
}

/* ---------- Etapa 3: montagem ---------- */
function Montar({
  peixe,
  formato,
  ingredientes,
  setFormato,
  alternar,
  aoTerminar,
}: {
  peixe: PeixeSushi
  formato: Formato
  ingredientes: Set<string>
  setFormato: (f: Formato) => void
  alternar: (id: string) => void
  aoTerminar: () => void
}) {
  const [nao, setNao] = useState(false)
  const grupos = [
    { tipo: 'recheio', nome: 'Recheio' },
    { tipo: 'cobertura', nome: 'Por cima' },
    { tipo: 'acompanhamento', nome: 'Acompanhamentos' },
  ] as const
  return (
    <section className="etapa">
      <h2 className="etapa__titulo">Monte do seu jeito</h2>
      <div className="montagem__palco">
        <motion.div key={formato} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}>
          <PecaSushi formato={formato} peixe={peixe} ingredientes={ingredientes} tamanho={150} />
        </motion.div>
      </div>
      <div className="formatos">
        {FORMATOS.map((f) => (
          <button
            key={f.id}
            className={`frasco ${formato === f.id ? 'frasco--ativo' : ''}`}
            aria-pressed={formato === f.id}
            onClick={() => {
              setFormato(f.id)
              if (f.id === 'nigiri') {
                som.erro()
                setNao(true)
              } else som.toque()
            }}
          >
            {f.nome}
          </button>
        ))}
      </div>
      <p className="etapa__aviso">{FORMATOS.find((f) => f.id === formato)!.descricao}</p>
      {grupos.map((g) => (
        <div key={g.tipo} className="ingredientes">
          <h3>{g.nome}</h3>
          <div className="ingredientes__lista">
            {INGREDIENTES.filter((i) => i.tipo === g.tipo).map((i) => (
              <button
                key={i.id}
                className={`ingrediente ${ingredientes.has(i.id) ? 'ingrediente--ativo' : ''}`}
                aria-pressed={ingredientes.has(i.id)}
                onClick={() => {
                  som.bolha()
                  alternar(i.id)
                }}
              >
                <span className="ingrediente__cor" style={{ background: i.cor }} />
                {i.nome}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button className="botao botao--verde botao--largo" onClick={aoTerminar}>
        Empratar
      </button>

      <Janela aberta={nao} aoFechar={() => setNao(false)} rotulo="Nigiri não" clara>
        <div className="nao-nigiri">
          <motion.div animate={{ rotate: [0, -12, 12, -12, 12, 0], scale: [1, 1.15, 1] }} transition={{ duration: 0.6 }}>
            <Sprite nome="nigiri" escala={6} />
          </motion.div>
          <motion.p className="nao-nigiri__grito" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1, x: [0, -6, 6, -4, 4, 0] }} transition={{ type: 'spring', stiffness: 300, damping: 10, x: { duration: 0.5, delay: 0.2 } }}>
            naoooooooo vida naoooooooooo
          </motion.p>
          <button className="botao botao--bordo botao--largo" onClick={() => setNao(false)}>
            Tá bom, tá bom
          </button>
        </div>
      </Janela>
    </section>
  )
}

/* ---------- Etapa 4: servir ---------- */
function comentarioKimi(ingredientes: Set<string>, formato: Formato) {
  if (ingredientes.has('morango')) return 'Morango no sushi? Ousado. O Kimi lambeu o prato mesmo assim.'
  if (formato === 'hotroll' && ingredientes.has('tare')) return 'Hot roll com tarê. O Kimi está babando no balcão.'
  if (ingredientes.size === 0) return 'Minimalista. Só o peixe e a técnica. Respeito.'
  if (ingredientes.size >= 7) return 'Tem de tudo! O Kimi não sabe por onde começar.'
  return 'Equilibrado e bonito. O Kimi pediu pra repetir.'
}

function Servir({
  peixe,
  formato,
  ingredientes,
  nome,
  setNome,
  aoTerminar,
}: {
  peixe: PeixeSushi
  formato: Formato
  ingredientes: Set<string>
  nome: string
  setNome: (n: string) => void
  aoTerminar: () => void
}) {
  const pecas = formato === 'temaki' ? 2 : formato === 'sashimi' ? 3 : 4
  return (
    <section className="etapa">
      <h2 className="etapa__titulo">Prato servido!</h2>
      <div className="prato">
        <div className="prato__pecas">
          {Array.from({ length: pecas }, (_, k) => (
            <motion.div key={k} initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: k * 0.12, type: 'spring', stiffness: 260, damping: 16 }}>
              <PecaSushi formato={formato} peixe={peixe} ingredientes={ingredientes} tamanho={formato === 'temaki' ? 96 : 72} />
            </motion.div>
          ))}
        </div>
        <div className="prato__lado">
          {ingredientes.has('wasabi') && <span className="prato__wasabi" title="Wasabi" />}
          {ingredientes.has('gengibre') && <span className="prato__gengibre" title="Gengibre" />}
          {ingredientes.has('shoyu') && <span className="prato__shoyu" title="Shoyu" />}
          <span className="prato__hashi" aria-hidden />
        </div>
      </div>
      <div className="critico moldura moldura--clara">
        <Sprite nome="kimi" escala={3} />
        <div>
          <strong>Crítico Kimi: ★★★★★</strong>
          <p>{comentarioKimi(ingredientes, formato)}</p>
        </div>
      </div>
      <label className="nome-prato">
        <span>Nome do prato</span>
        <input className="afundado" value={nome} maxLength={40} onChange={(e) => setNome(e.target.value)} />
      </label>
      <div className="sugestoes">
        {NOMES_SUGERIDOS.map((n) => (
          <button key={n} className="ingrediente" onClick={() => setNome(n)}>
            {n}
          </button>
        ))}
      </div>
      <button className="botao botao--verde botao--largo" onClick={aoTerminar} disabled={!nome.trim()}>
        Escolher a bebida
      </button>
    </section>
  )
}

/* ---------- Etapa 5: bebida (spoiler: Coca Zero) ---------- */
function EscolherBebida({ aoTerminar }: { aoTerminar: (pedida: Bebida) => void }) {
  const [pedida, setPedida] = useState<Bebida | null>(null)
  const [virou, setVirou] = useState(false)

  const pedir = (b: Bebida) => {
    if (pedida) return
    som.toque()
    setPedida(b)
    setTimeout(() => {
      setVirou(true)
      for (let k = 0; k < 6; k++) setTimeout(som.bolha, k * 70)
    }, 900)
  }

  return (
    <section className="etapa">
      <h2 className="etapa__titulo">E pra beber?</h2>
      {!pedida ? (
        <div className="bebidas">
          {BEBIDAS.map((b) => (
            <motion.button key={b.id} className="bebida moldura moldura--clara" whileTap={{ scale: 0.94 }} onClick={() => pedir(b)}>
              <span className="copo">
                <span className="copo__liquido" style={{ background: b.cor }} />
              </span>
              {b.nome}
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="servindo">
          <div className="servindo__copo">
            <span className="copo copo--grande">
              <motion.span className="copo__liquido" initial={{ height: '0%' }} animate={{ height: '82%', background: virou ? '#2B1B12' : pedida.cor }} transition={{ height: { duration: 0.8 }, background: { duration: 0.6 } }} />
              {virou &&
                Array.from({ length: 10 }, (_, k) => (
                  <motion.span key={k} className="copo__bolha" style={{ left: `${10 + ((k * 37) % 80)}%` }} initial={{ y: 0, opacity: 0.9 }} animate={{ y: -90, opacity: 0 }} transition={{ duration: 1.2, delay: k * 0.12, repeat: Infinity }} />
                ))}
            </span>
            <AnimatePresence>
              {virou && (
                <motion.span className="servindo__lata" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 12 }}>
                  <Sprite nome="coca" escala={5} />
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <p className="etapa__aviso" role="status">
            {virou ? pedida.resposta : `Um(a) ${pedida.nome.toLowerCase()}, saindo…`}
          </p>
          {virou && (
            <button className="botao botao--verde botao--largo" onClick={() => aoTerminar(pedida)}>
              Fechar a comanda
            </button>
          )}
        </div>
      )}
    </section>
  )
}

/* ---------- Comanda ---------- */
export function Sushi() {
  const { conquistar } = useProgresso()
  const [etapa, setEtapa] = useState<Etapa>('peixe')
  const [peixe, setPeixe] = useState<PeixeSushi>(PEIXES_SUSHI[0])
  const [formato, setFormato] = useState<Formato>('uramaki')
  const [ingredientes, setIngredientes] = useState<Set<string>>(new Set(['gergelim', 'shoyu']))
  const [nome, setNome] = useState(NOMES_SUGERIDOS[0])
  const [bebidaPedida, setBebidaPedida] = useState<Bebida | null>(null)
  const [pedido, setPedido] = useState(() => Math.floor(Math.random() * 900) + 100)

  const ir = (e: Etapa) => {
    setEtapa(e)
    document.querySelector('.app__conteudo')?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const alternar = (id: string) =>
    setIngredientes((s) => {
      const n = new Set(s)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })

  const listaIngredientes = INGREDIENTES.filter((i) => ingredientes.has(i.id)).map((i) => i.nome)
  const formatoNome = FORMATOS.find((f) => f.id === formato)!.nome

  const recomecar = () => {
    setIngredientes(new Set(['gergelim', 'shoyu']))
    setBebidaPedida(null)
    setPedido(Math.floor(Math.random() * 900) + 100)
    ir('peixe')
  }

  return (
    <div className="tela sushi">
      <header className="cabecalho-tela">
        <Sprite nome="nigiri" escala={4} />
        <h1 className="titulo-jogo">Monte seu Sushi</h1>
        <p>Hoje a sushiwoman é você.</p>
      </header>
      <Passos etapa={etapa} />

      <AnimatePresence mode="wait">
        <motion.div key={etapa} initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }} transition={{ duration: 0.22 }}>
          {etapa === 'peixe' && (
            <EscolherPeixe
              aoEscolher={(p) => {
                setPeixe(p)
                ir('corte')
              }}
            />
          )}
          {etapa === 'corte' && <Cortar peixe={peixe} aoTerminar={() => ir('montagem')} />}
          {etapa === 'montagem' && (
            <Montar peixe={peixe} formato={formato} ingredientes={ingredientes} setFormato={setFormato} alternar={alternar} aoTerminar={() => ir('servir')} />
          )}
          {etapa === 'servir' && <Servir peixe={peixe} formato={formato} ingredientes={ingredientes} nome={nome} setNome={setNome} aoTerminar={() => ir('bebida')} />}
          {etapa === 'bebida' && (
            <EscolherBebida
              aoTerminar={(b) => {
                setBebidaPedida(b)
                conquistar('sushi-chef')
                som.vitoria()
                confete()
                ir('comanda')
              }}
            />
          )}
          {etapa === 'comanda' && bebidaPedida && (
            <section className="etapa">
              <div className="comanda">
                <p className="comanda__topo">Sushi da Geo</p>
                <p className="comanda__mesa">Pedido #{pedido}, mesa 25, cliente Geo</p>
                <hr />
                <dl>
                  <dt>Prato</dt>
                  <dd>{nome.trim()}</dd>
                  <dt>Peixe</dt>
                  <dd>{peixe.nome}</dd>
                  <dt>Formato</dt>
                  <dd>{formatoNome}</dd>
                  <dt>Ingredientes</dt>
                  <dd>{listaIngredientes.length ? listaIngredientes.join(', ') : 'Só o peixe'}</dd>
                  <dt>Bebida pedida</dt>
                  <dd>{bebidaPedida.nome}</dd>
                  <dt>Bebida servida</dt>
                  <dd>Coca Zero</dd>
                </dl>
                <hr />
                <p className="comanda__total">
                  Total: <strong>R$ 0,00</strong>
                </p>
                <p className="comanda__rodape">Pago com carinho. Volte sempre!</p>
              </div>
              <button
                className="botao botao--bordo botao--largo"
                onClick={() =>
                  abrirWhatsApp(
                    `🍣 Pedido do Sushi da Geo:\n${nome.trim()}: ${formatoNome} de ${peixe.nome.toLowerCase()}${listaIngredientes.length ? ` com ${listaIngredientes.join(', ').toLowerCase()}` : ''}.\nBebida: Coca Zero (claro).\nQuero esse de verdade!`,
                  )
                }
              >
                Pedir esse de verdade
              </button>
              <button className="botao botao--verde botao--largo" onClick={recomecar}>
                Montar outro sushi
              </button>
            </section>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
