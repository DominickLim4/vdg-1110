import { useState } from 'react'
import { estadoPescaInicial } from '../estado/pesca'
import { agoraISO, useProgresso } from '../estado/progresso'

// Só aparece com ?dev=1 na URL. Serve para você testar e depois zerar tudo antes de mandar o link.
export function PainelDev() {
  const { atualizar, resetar } = useProgresso()
  const [aberto, setAberto] = useState(false)
  if (!new URLSearchParams(location.search).has('dev')) return null
  const agora = agoraISO()
  return (
    <div style={{ position: 'fixed', left: 8, bottom: 120, zIndex: 99, fontSize: 14 }}>
      <button className="botao botao--bordo" onClick={() => setAberto(!aberto)}>
        dev
      </button>
      {aberto && (
        <div className="moldura" style={{ marginTop: 6, display: 'grid', gap: 6, width: 220 }}>
          <button
            className="botao"
            onClick={() =>
              atualizar((s) => ({
                ...s,
                vales: { date: { desbloqueadoEm: agora }, transa: { desbloqueadoEm: agora }, abracos: { desbloqueadoEm: agora }, kimi: { desbloqueadoEm: agora } },
              }))
            }
          >
            Desbloquear 4 vales
          </button>
          <button className="botao" onClick={() => atualizar((s) => ({ ...s, pesca: estadoPescaInicial, pescaResgatadaEm: undefined }))}>
            Zerar pesca
          </button>
          <button className="botao" onClick={() => atualizar((s) => ({ ...s, aberturaVista: false }))}>
            Ver abertura
          </button>
          <button
            className="botao botao--bordo"
            onClick={() => {
              resetar()
              atualizar((s) => ({ ...s, portaoAberto: false }))
            }}
          >
            Zerar TUDO
          </button>
        </div>
      )}
    </div>
  )
}
