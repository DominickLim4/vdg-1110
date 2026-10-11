import { urlSprite, type NomeSprite, type Variacao } from '../sprites/sprites'

interface Props {
  nome: NomeSprite
  variacao?: Variacao
  escala?: number
  alt?: string
  className?: string
  style?: React.CSSProperties
}

export function Sprite({ nome, variacao, escala = 3, alt = '', className = '', style }: Props) {
  const s = urlSprite(nome, variacao)
  return (
    <img
      src={s.url}
      width={s.w * escala}
      height={s.h * escala}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      draggable={false}
      className={`pixel ${className}`}
      style={style}
    />
  )
}
