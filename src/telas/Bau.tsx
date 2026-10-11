import { motion } from 'motion/react'
import { useState } from 'react'
import { Estrela, NOME_FAIXA } from '../componentes/Estrela'
import { Janela } from '../componentes/Janela'
import { som } from '../componentes/som'
import { Sprite } from '../componentes/Sprite'
import { CONQUISTAS } from '../conteudo/conquistas'
import { abrirWhatsApp } from '../conteudo/contato'
import { PRESENTE_PESCA, VALES } from '../conteudo/vales'
import type { Faixa } from '../estado/pesca'
import { agoraISO, useProgresso, type IdVale } from '../estado/progresso'
import './bau.css'

type Item = { tipo: 'vale'; id: IdVale } | { tipo: 'pesca'; faixa: Faixa }

const SLOTS_TOTAIS = 12

function numeroSerie(id: string, data: string) {
  const n = [...(id + data)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 1_000_000, 7)
  return `VDG-${String(n).padStart(6, '0')}`
}

export function Bau() {
  const { p, atualizar } = useProgresso()
  const [aberto, setAberto] = useState<Item | null>(null)

  const itens: Item[] = [
    ...VALES.filter((v) => p.vales[v.id]).map((v) => ({ tipo: 'vale' as const, id: v.id })),
    ...(p.pesca.finalizado ? [{ tipo: 'pesca' as const, faixa: p.pesca.finalizado.faixa }] : []),
  ]

  const resgatar = (item: Item) => {
    const texto =
      item.tipo === 'vale'
        ? VALES.find((v) => v.id === item.id)!.textoResgate
        : `Quero resgatar meu ${NOME_FAIXA[item.faixa]} ⭐ (${PRESENTE_PESCA[item.faixa].valor}). Já sei o que eu quero…`
    abrirWhatsApp(texto)
    som.moeda()
    const em = agoraISO()
    atualizar((s) =>
      item.tipo === 'vale'
        ? { ...s, vales: { ...s.vales, [item.id]: { ...s.vales[item.id]!, resgatadoEm: s.vales[item.id]?.resgatadoEm ?? em } } }
        : { ...s, pescaResgatadaEm: s.pescaResgatadaEm ?? em },
    )
  }

  return (
    <div className="tela">
      <header className="cabecalho-tela">
        <Sprite nome="bau" escala={4} />
        <h1 className="titulo-jogo">Baú</h1>
        <p>{itens.length ? 'Toque num item para ver e resgatar.' : 'Vazio por enquanto. Vença os jogos do Fliperama para enchê-lo.'}</p>
      </header>

      <div className="inventario moldura">
        {Array.from({ length: SLOTS_TOTAIS }, (_, i) => {
          const item = itens[i]
          if (!item) return <div key={i} className="inventario__slot afundado" />
          const resgatado = item.tipo === 'vale' ? !!p.vales[item.id]?.resgatadoEm : !!p.pescaResgatadaEm
          return (
            <motion.button
              key={i}
              className="inventario__slot inventario__slot--item afundado"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: i * 0.05 }}
              onClick={() => {
                som.toque()
                setAberto(item)
              }}
              aria-label={item.tipo === 'vale' ? VALES.find((v) => v.id === item.id)!.nome : NOME_FAIXA[item.faixa]}
            >
              {item.tipo === 'vale' ? (
                <Sprite nome={VALES.find((v) => v.id === item.id)!.sprite} escala={3} />
              ) : (
                <Sprite nome="presente" escala={3} />
              )}
              {item.tipo === 'pesca' && (
                <span className="inventario__estrela">
                  <Estrela faixa={item.faixa} escala={1.5} />
                </span>
              )}
              {resgatado && <span className="inventario__check">✓</span>}
            </motion.button>
          )
        })}
      </div>

      <section className="conquistas moldura">
        <h2 className="conquistas__titulo">Conquistas</h2>
        <ul>
          {CONQUISTAS.map((c) => {
            const feita = !!p.conquistas[c.id]
            return (
              <li key={c.id} className={feita ? 'conquista--feita' : ''}>
                <Sprite nome="estrela" variacao={feita ? 'ouro' : 'prata'} escala={2} />
                <span>
                  <strong>{feita ? c.nome : '???'}</strong>
                  <small>{c.dica}</small>
                </span>
              </li>
            )
          })}
        </ul>
      </section>

      <Janela aberta={!!aberto} aoFechar={() => setAberto(null)} rotulo="Vale" clara>
        {aberto && <CartaoVale item={aberto} aoResgatar={() => resgatar(aberto)} aoFechar={() => setAberto(null)} />}
      </Janela>
    </div>
  )
}

function CartaoVale({ item, aoResgatar, aoFechar }: { item: Item; aoResgatar: () => void; aoFechar: () => void }) {
  const { p } = useProgresso()
  const vale = item.tipo === 'vale' ? VALES.find((v) => v.id === item.id)! : null
  const nome = vale ? vale.nome : NOME_FAIXA[(item as { faixa: Faixa }).faixa]
  const descricao = vale ? vale.descricao : PRESENTE_PESCA[(item as { faixa: Faixa }).faixa].descricao
  const termos = vale ? vale.termos : ['Válido para um presente à sua escolha, dentro do valor.', 'Escolha sem culpa.']
  const data = vale ? p.vales[vale.id]!.desbloqueadoEm : p.pesca.finalizado!.em
  const resgatado = vale ? p.vales[vale.id]?.resgatadoEm : p.pescaResgatadaEm

  return (
    <div className="cartao">
      <div className="cartao__topo">
        {vale ? <Sprite nome={vale.sprite} escala={5} /> : <Estrela faixa={(item as { faixa: Faixa }).faixa} escala={6} />}
        <h2 className="cartao__nome">{nome}</h2>
      </div>
      <p className="cartao__descricao">{descricao}</p>
      <ul className="cartao__termos">
        {termos.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <p className="cartao__serie">Série {numeroSerie(nome, data)}</p>
      {resgatado && <div className="cartao__carimbo">Resgatado</div>}
      <div className="cartao__acoes">
        <button className="botao" onClick={aoFechar}>
          Fechar
        </button>
        <button className="botao botao--verde" onClick={aoResgatar}>
          {resgatado ? 'Resgatar de novo' : 'Resgatar no WhatsApp'}
        </button>
      </div>
    </div>
  )
}
