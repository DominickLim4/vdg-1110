import type { CSSProperties } from 'react'
import { INGREDIENTES, type Formato, type PeixeSushi } from './dados'

interface Props {
  formato: Formato
  peixe: PeixeSushi
  ingredientes: ReadonlySet<string>
  tamanho?: number
}

// posições estáveis (não mudam a cada render) para os salpicos de cobertura
function salpicos(semente: string, n: number) {
  let h = [...semente].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)
  return Array.from({ length: n }, () => {
    h = (h * 1103515245 + 12345) >>> 0
    const x = (h % 1000) / 1000
    h = (h * 1103515245 + 12345) >>> 0
    const y = (h % 1000) / 1000
    return { x, y }
  })
}

function Coberturas({ ingredientes, area }: { ingredientes: ReadonlySet<string>; area: CSSProperties }) {
  const lista = INGREDIENTES.filter((i) => i.tipo === 'cobertura' && ingredientes.has(i.id))
  return (
    <div className="peca__coberturas" style={area}>
      {lista.map((ing) => {
        if (ing.id === 'tare')
          return (
            <svg key={ing.id} className="peca__tare" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden>
              <path d="M2 10 L18 4 L34 14 L50 5 L66 15 L82 6 L98 12" />
            </svg>
          )
        if (ing.id === 'morango') return <span key={ing.id} className="peca__morango" />
        const qtd = ing.id === 'ovas' ? 9 : ing.id === 'cebolinha' ? 7 : 10
        return salpicos(ing.id, qtd).map((p, k) => (
          <span
            key={ing.id + k}
            className={`peca__salpico peca__salpico--${ing.id}`}
            style={{ left: `${8 + p.x * 84}%`, top: `${10 + p.y * 70}%`, background: ing.cor }}
          />
        ))
      })}
    </div>
  )
}

function Recheios({ ingredientes }: { ingredientes: ReadonlySet<string> }) {
  const lista = INGREDIENTES.filter((i) => i.tipo === 'recheio' && ingredientes.has(i.id))
  return (
    <>
      {lista.map((ing) => (
        <span key={ing.id} className="peca__recheio" style={{ background: ing.cor }} />
      ))}
    </>
  )
}

export function PecaSushi({ formato, peixe, ingredientes, tamanho = 160 }: Props) {
  const fatia: CSSProperties = {
    background: `repeating-linear-gradient(115deg, ${peixe.cor} 0 9px, ${peixe.listra} 9px 12px)`,
  }

  if (formato === 'nigiri') {
    return (
      <div className="peca peca--nigiri" style={{ width: tamanho, height: tamanho * 0.72 }}>
        <div className="peca__arroz-bolo" />
        <div className="peca__fatia" style={fatia} />
        <Coberturas ingredientes={ingredientes} area={{ left: '6%', right: '6%', top: '6%', height: '34%' }} />
      </div>
    )
  }

  if (formato === 'sashimi') {
    return (
      <div className="peca peca--sashimi" style={{ width: tamanho, height: tamanho * 0.72 }}>
        {[-14, 0, 14].map((r, k) => (
          <div key={k} className="peca__fatia peca__fatia--sashimi" style={{ ...fatia, rotate: `${r}deg`, left: `${10 + k * 18}%` }} />
        ))}
        <Coberturas ingredientes={ingredientes} area={{ left: '14%', right: '14%', top: '20%', height: '50%' }} />
      </div>
    )
  }

  if (formato === 'temaki') {
    return (
      <div className="peca peca--temaki" style={{ width: tamanho, height: tamanho }}>
        <div className="peca__temaki-recheio">
          <div className="peca__fatia peca__fatia--temaki" style={fatia} />
          <div className="peca__temaki-cores">
            <Recheios ingredientes={ingredientes} />
          </div>
        </div>
        <div className="peca__cone" />
        <Coberturas ingredientes={ingredientes} area={{ left: '20%', right: '20%', top: '6%', height: '26%' }} />
      </div>
    )
  }

  // rolinhos: uramaki, hossomaki, hot roll (corte transversal)
  return (
    <div className={`peca peca--rolo peca--${formato}`} style={{ width: tamanho, height: tamanho }}>
      <div className="peca__anel-externo">
        {formato === 'uramaki' && ingredientes.has('gergelim') && (
          <div className="peca__gergelim-anel">
            {Array.from({ length: 26 }, (_, k) => (
              <span key={k} style={{ rotate: `${k * 14}deg` }} />
            ))}
          </div>
        )}
        <div className="peca__anel-interno">
          <div className="peca__miolo">
            <div className="peca__miolo-peixe" style={fatia} />
            <Recheios ingredientes={ingredientes} />
          </div>
        </div>
      </div>
      <Coberturas ingredientes={new Set([...ingredientes].filter((i) => i !== 'gergelim' || formato !== 'uramaki'))} area={{ left: '18%', right: '18%', top: '4%', height: '30%' }} />
    </div>
  )
}
