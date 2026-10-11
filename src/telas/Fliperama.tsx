import { motion } from 'motion/react'
import { Estrela } from '../componentes/Estrela'
import { som } from '../componentes/som'
import { Sprite } from '../componentes/Sprite'
import { VALES } from '../conteudo/vales'
import { TENTATIVAS_MAX } from '../estado/pesca'
import { useProgresso } from '../estado/progresso'
import { irPara, type IdJogo } from '../estado/rota'
import type { NomeSprite } from '../sprites/sprites'
import './fliperama.css'

const JOGOS: Record<IdJogo, { nome: string; como: string; sprite: NomeSprite }> = {
  quiz: { nome: 'Quiz do Vale', como: 'Acerte 7 de 10 perguntas de Stardew.', sprite: 'estrela' },
  termo: { nome: 'Termo Proibido', como: 'Descubra a palavra de 5 letras em 6 chances.', sprite: 'pimenta' },
  memoria: { nome: 'Memória do Cheirinho', como: 'Ache todos os pares de cartas.', sprite: 'cerebro' },
  'kimi-run': { nome: 'Kimi Run', como: 'Pule os obstáculos e pegue 15 petiscos.', sprite: 'kimi' },
  pesca: { nome: 'Pesca do Sushi', como: '3 tentativas. Quanto mais peixe, melhor o presente.', sprite: 'peixe' },
}

export function Fliperama() {
  const { p } = useProgresso()
  const desbloqueados = VALES.filter((v) => p.vales[v.id]).length
  const pescaLiberada = desbloqueados === VALES.length

  return (
    <div className="tela">
      <header className="cabecalho-tela">
        <h1 className="titulo-jogo">Fliperama</h1>
        <p>Cada jogo vencido libera um presente no Baú.</p>
      </header>

      <ul className="maquinas">
        {VALES.map((v, i) => {
          const ganho = !!p.vales[v.id]
          const j = JOGOS[v.jogo]
          return (
            <motion.li key={v.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}>
              <button
                className="maquina moldura sombra-pixel"
                onClick={() => {
                  som.toque()
                  irPara(`jogo/${v.jogo}`)
                }}
              >
                <span className="maquina__tela">
                  <Sprite nome={j.sprite} escala={3} variacao={j.sprite === 'estrela' ? 'ouro' : undefined} />
                </span>
                <span className="maquina__info">
                  <strong>{j.nome}</strong>
                  <span className="maquina__como">{j.como}</span>
                  <span className={`maquina__premio ${ganho ? 'maquina__premio--ganho' : ''}`}>
                    {ganho ? (
                      <>
                        <Sprite nome={v.sprite} escala={2} /> {v.nome} no Baú
                      </>
                    ) : (
                      <>
                        <Sprite nome="presente" escala={2} /> Presente misterioso
                      </>
                    )}
                  </span>
                </span>
              </button>
            </motion.li>
          )
        })}

        <li>
          <button
            className={`maquina maquina--chefao moldura sombra-pixel ${pescaLiberada ? '' : 'maquina--trancada'}`}
            onClick={() => {
              if (!pescaLiberada) return som.erro()
              som.toque()
              irPara('jogo/pesca')
            }}
            aria-disabled={!pescaLiberada}
          >
            <span className="maquina__tela maquina__tela--lagoa">
              <Sprite nome={pescaLiberada ? 'peixe' : 'cadeado'} escala={3} variacao={pescaLiberada ? 'lendario' : undefined} />
            </span>
            <span className="maquina__info">
              <strong>{JOGOS.pesca.nome}</strong>
              {pescaLiberada ? (
                <span className="maquina__como">
                  {p.pesca.finalizado
                    ? 'Presente escolhido. Veja no Baú.'
                    : `${TENTATIVAS_MAX - p.pesca.tentativas.length} de ${TENTATIVAS_MAX} tentativas restantes.`}
                </span>
              ) : (
                <span className="maquina__como">
                  Grande final. Abre quando os outros 4 presentes estiverem no Baú ({desbloqueados}/4).
                </span>
              )}
              <span className="maquina__estrelas">
                <Estrela faixa="prata" escala={2} />
                <Estrela faixa="ouro" escala={2} />
                <Estrela faixa="iridio" escala={2} />
              </span>
            </span>
          </button>
        </li>
      </ul>

      <button
        className="maquina maquina--parquinho moldura sombra-pixel"
        onClick={() => {
          som.toque()
          irPara('parquinho')
        }}
      >
        <span className="maquina__tela maquina__tela--parquinho">
          <Sprite nome="junimo" escala={3} />
        </span>
        <span className="maquina__info">
          <strong>Parquinho</strong>
          <span className="maquina__como">Minijogos e brinquedos só por diversão: Junimos, Chuva de Coca, Kimi busca, roleta, guitarra e mais.</span>
        </span>
      </button>
    </div>
  )
}
