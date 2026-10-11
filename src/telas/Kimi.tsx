import { motion } from 'motion/react'
import { useState } from 'react'
import { Lightbox } from '../componentes/Lightbox'
import { som } from '../componentes/som'
import { Sprite } from '../componentes/Sprite'
import { useProgresso } from '../estado/progresso'
import { FOTOS_KIMI, type Foto } from '../fotos'
import './galerias.css'

const vistas = new Set<string>()

function hash(texto: string) {
  return [...texto].reduce((a, c) => (a * 33 + c.charCodeAt(0)) >>> 0, 5381)
}

// Ficha brincalhona: mesma foto, mesmos números
function ficha(f: Foto) {
  const h = hash(f.id)
  return [
    { nome: 'Fofura', valor: 90 + (h % 10) },
    { nome: 'Caos', valor: 40 + ((h >> 4) % 60) },
    { nome: 'Fome', valor: 'MÁX' },
    { nome: 'Lambidas', valor: 50 + ((h >> 8) % 50) },
  ]
}

export function Kimi() {
  const { conquistar } = useProgresso()
  const [indice, setIndice] = useState<number | null>(null)

  const abrir = (i: number | null) => {
    setIndice(i)
    if (i === null) return
    vistas.add(FOTOS_KIMI[i].id)
    if (vistas.size >= FOTOS_KIMI.length && FOTOS_KIMI.length > 0) conquistar('kimi-todas')
  }

  return (
    <div className="tela">
      <header className="cabecalho-tela">
        <Sprite nome="kimi" escala={4} />
        <h1 className="titulo-jogo">Kimidex</h1>
        <p>{FOTOS_KIMI.length ? `${FOTOS_KIMI.length} registros do golden mais lindo do vale.` : 'Golden retriever, 5 meses, dourado.'}</p>
      </header>

      {FOTOS_KIMI.length === 0 ? (
        <div className="vazio moldura">
          <Sprite nome="kimiCorre1" escala={4} />
          <p>O Kimi está se arrumando para as fotos. Volte daqui a pouco.</p>
        </div>
      ) : (
        <>
          <button
            className="botao botao--verde botao--largo"
            onClick={() => {
              som.moeda()
              abrir(Math.floor(Math.random() * FOTOS_KIMI.length))
            }}
          >
            Kimi aleatório
          </button>
          <div className="mosaico">
            {FOTOS_KIMI.map((f, i) => (
              <motion.button
                key={f.id}
                className="mosaico__item"
                onClick={() => abrir(i)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '40px' }}
                whileTap={{ scale: 0.96 }}
              >
                <img src={f.mini} alt={`Kimi, foto ${i + 1}`} loading="lazy" />
                <span className="mosaico__numero">#{String(i + 1).padStart(3, '0')}</span>
              </motion.button>
            ))}
          </div>
        </>
      )}

      <Lightbox
        fotos={FOTOS_KIMI}
        indice={indice}
        aoMudar={abrir}
        rodape={(f) => (
          <div className="ficha moldura">
            {ficha(f).map((s) => (
              <span key={s.nome} className="ficha__stat">
                <small>{s.nome}</small>
                <strong>{s.valor}</strong>
              </span>
            ))}
          </div>
        )}
      />
    </div>
  )
}
