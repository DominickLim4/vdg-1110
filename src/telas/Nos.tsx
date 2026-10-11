import { motion } from 'motion/react'
import { useState } from 'react'
import { Lightbox } from '../componentes/Lightbox'
import { Sprite } from '../componentes/Sprite'
import { FOTOS_NOS } from '../fotos'
import type { NomeSprite } from '../sprites/sprites'
import './galerias.css'

const ADESIVOS: NomeSprite[] = ['coracao', 'girassol', 'nigiri', 'd20', 'coca', 'estrela', 'guitarra', 'kimi']

function giro(i: number) {
  return ((i * 37) % 9) - 4
}

export function Nos() {
  const [indice, setIndice] = useState<number | null>(null)

  return (
    <div className="tela">
      <header className="cabecalho-tela">
        <Sprite nome="camera" escala={4} />
        <h1 className="titulo-jogo">Nós</h1>
        <p>Nosso diário de fotos.</p>
      </header>

      {FOTOS_NOS.length === 0 ? (
        <div className="vazio moldura">
          <Sprite nome="coracao" escala={5} />
          <p>As fotos estão sendo reveladas. Volte daqui a pouco.</p>
        </div>
      ) : (
        <div className="diario">
          {FOTOS_NOS.map((f, i) => (
            <motion.button
              key={f.id}
              className="polaroid"
              style={{ rotate: giro(i) }}
              initial={{ opacity: 0, y: 30, rotate: giro(i) * 3 }}
              whileInView={{ opacity: 1, y: 0, rotate: giro(i) }}
              viewport={{ once: true, margin: '60px' }}
              whileTap={{ scale: 0.96, rotate: 0 }}
              onClick={() => setIndice(i)}
            >
              <span className="polaroid__fita" aria-hidden />
              <img src={f.mini} alt={f.legenda ?? `Nós, foto ${i + 1}`} loading="lazy" />
              {f.legenda && <span className="polaroid__legenda">{f.legenda}</span>}
              {i % 4 === 0 && (
                <span className="polaroid__adesivo" aria-hidden>
                  <Sprite nome={ADESIVOS[(i / 4) % ADESIVOS.length]} escala={3} variacao={ADESIVOS[(i / 4) % ADESIVOS.length] === 'estrela' ? 'ouro' : undefined} />
                </span>
              )}
            </motion.button>
          ))}
        </div>
      )}

      <Lightbox
        fotos={FOTOS_NOS}
        indice={indice}
        aoMudar={setIndice}
        rodape={(f) => (f.legenda ? <p className="lightbox-legenda moldura moldura--clara">{f.legenda}</p> : null)}
      />
    </div>
  )
}
