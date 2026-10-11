import { irPara } from '../estado/rota'
import { som } from './som'

export function BarraJogo({ titulo, extra }: { titulo: string; extra?: React.ReactNode }) {
  return (
    <div className="barra-jogo">
      <button
        className="botao"
        onClick={() => {
          som.toque()
          irPara('fliperama')
        }}
      >
        ‹ Fliperama
      </button>
      {extra}
      <h1 className="barra-jogo__titulo titulo-jogo">{titulo}</h1>
    </div>
  )
}
