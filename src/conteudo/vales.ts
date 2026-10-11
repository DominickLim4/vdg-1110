import type { Faixa } from '../estado/pesca'
import type { IdVale } from '../estado/progresso'
import type { IdJogo } from '../estado/rota'
import type { NomeSprite } from '../sprites/sprites'

export interface Vale {
  id: IdVale
  nome: string
  sprite: NomeSprite
  jogo: IdJogo
  descricao: string
  termos: string[]
  textoResgate: string
}

export const VALES: Vale[] = [
  {
    id: 'date',
    nome: 'Vale Date',
    sprite: 'nigiri',
    jogo: 'quiz',
    descricao: 'Um date onde você quiser.',
    termos: [
      'Válido em qualquer lugar que você escolher.',
      'Inclui motorista particular (eu).',
      'Coca Zero liberada durante todo o evento.',
    ],
    textoResgate: 'Quero resgatar meu Vale Date 💙',
  },
  {
    id: 'transa',
    nome: 'Vale Transa',
    sprite: 'pimenta',
    jogo: 'termo',
    descricao: 'Uma noite inteira só nossa vida. Vousê escolhe o lugar, a hora e o figurino.',
    termos: [
      'Sem prazo de validade.',
      'Pode ser resgatado a qualquer hora.',
      'Repetir não só é permitido como é incentivado.',
      'Não acumula com "tô com dor de cabeça".',
    ],
    textoResgate: 'Quero resgatar meu Vale Transa 🌶️',
  },
  {
    id: 'abracos',
    nome: 'Sessão de Abraços e Cheiros',
    sprite: 'coracao',
    jogo: 'memoria',
    descricao: 'Uma sessão oficial de abraço apertado, cheirinho no cangote e cafuné até dormir',
    termos: [
      'Duração mínima de 30 minutos.',
      'Cheiro no pescoço incluso.',
      'Ideal depois de plantão, prova ou em dias dificeis.',
    ],
    textoResgate: 'Quero resgatar minha Sessão de Abraços e Cheiros.',
  },
  {
    id: 'kimi',
    nome: 'Passeio com Kimi',
    sprite: 'osso',
    jogo: 'kimi-run',
    descricao: 'Um passeio com Kimi.',
    termos: ['O Kimi decide o trajeto.', 'Fotos obrigatórias.', 'Lambidas não são reembolsáveis.'],
    textoResgate: 'Quero resgatar meu Passeio com Kimi',
  },
]

export const PRESENTE_PESCA: Record<Faixa, { valor: string; descricao: string }> = {
  prata: { valor: 'R$150', descricao: 'Um presente de até R$150, escolhido por você.' },
  ouro: { valor: 'R$250', descricao: 'Um presente de até R$250, escolhido por você.' },
  iridio: { valor: 'R$500', descricao: 'Um presente de até R$500, escolhido por você.' },
}
