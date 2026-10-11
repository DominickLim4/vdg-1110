import type { Faixa } from '../estado/pesca'
import { Sprite } from './Sprite'

export const NOME_FAIXA: Record<Faixa, string> = {
  prata: 'Presente de Prata',
  ouro: 'Presente de Ouro',
  iridio: 'Presente de Irídio',
}

export function Estrela({ faixa, escala = 3 }: { faixa: Faixa; escala?: number }) {
  return <Sprite nome="estrela" variacao={faixa} escala={escala} alt={`estrela de ${faixa}`} className={`estrela estrela--${faixa}`} />
}
