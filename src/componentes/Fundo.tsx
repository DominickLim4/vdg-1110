import { useMemo } from 'react'
import './fundo.css'

// Céu do vale com nuvens em pixel, lagoa com ondas e bolhas subindo (as bolhas da Coca Zero).
function Nuvem({ className }: { className: string }) {
  return (
    <svg className={`nuvem ${className}`} viewBox="0 0 32 12" shapeRendering="crispEdges" aria-hidden>
      <path fill="#fff" d="M6 4h4V2h6V0h6v2h4v2h2v2h4v4h-2v2H2v-2H0V6h6z" />
      <path fill="#dff3fa" d="M2 10h28v2H2z" />
    </svg>
  )
}

function Onda({ className, d }: { className: string; d: string }) {
  return (
    <svg className={`onda ${className}`} viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden>
      <path d={d} />
    </svg>
  )
}

const ONDA_A = 'M0 60 Q 150 20 300 60 T 600 60 T 900 60 T 1200 60 V120 H0Z'
const ONDA_B = 'M0 70 Q 150 40 300 70 T 600 70 T 900 70 T 1200 70 V120 H0Z'

export function Fundo() {
  const bolhas = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        tam: 6 + Math.random() * 16,
        dur: 9 + Math.random() * 12,
        atraso: -Math.random() * 20,
      })),
    [],
  )
  return (
    <div className="fundo" aria-hidden>
      <div className="fundo__sol" />
      <Nuvem className="nuvem--1" />
      <Nuvem className="nuvem--2" />
      <Nuvem className="nuvem--3" />
      <div className="fundo__colinas" />
      <div className="fundo__lagoa">
        <Onda className="onda--tras" d={ONDA_B} />
        <Onda className="onda--meio" d={ONDA_A} />
        <Onda className="onda--frente" d={ONDA_B} />
      </div>
      {bolhas.map((b) => (
        <span
          key={b.id}
          className="bolha"
          style={{ left: `${b.x}%`, width: b.tam, height: b.tam, animationDuration: `${b.dur}s`, animationDelay: `${b.atraso}s` }}
        />
      ))}
    </div>
  )
}
