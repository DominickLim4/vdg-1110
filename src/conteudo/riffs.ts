// Trechos curtinhos de riffs clássicos, sintetizados no navegador (sem arquivos de áudio).
// Cada nota: [nota, duração em tempos]. 'pausa' é silêncio; bateria usa 'bumbo', 'caixa', 'chimbal', 'prato' e 'tom'.

export type Nota = [string, number]

export type Timbre = 'distorcido' | 'limpo' | '8bit' | 'violao'

export interface Riff {
  musica: string
  banda: string
  bpm: number
  timbre: Timbre | 'bateria'
  simples?: boolean // notas soltas em vez de power chords (só faz diferença no distorcido)
  notas: Nota[]
}

export const RIFFS: Riff[] = [
  {
    musica: 'Smoke on the Water',
    banda: 'Deep Purple',
    bpm: 112,
    timbre: 'distorcido',
    notas: [
      ['G3', 1], ['A#3', 1], ['C4', 1.5], ['pausa', 0.5],
      ['G3', 1], ['A#3', 1], ['C#4', 0.5], ['C4', 2], ['pausa', 0.5],
      ['G3', 1], ['A#3', 1], ['C4', 1.5], ['pausa', 0.5],
      ['A#3', 1], ['G3', 2.5],
    ],
  },
  {
    musica: 'Seven Nation Army',
    banda: 'The White Stripes',
    bpm: 120,
    timbre: 'distorcido',
    notas: [['E3', 1.5], ['E3', 0.5], ['G3', 0.75], ['E3', 0.75], ['D3', 0.5], ['C3', 2], ['B2', 2]],
  },
  {
    musica: 'Iron Man',
    banda: 'Black Sabbath',
    bpm: 96,
    timbre: 'distorcido',
    notas: [
      ['B2', 1], ['D3', 1], ['D3', 0.5], ['E3', 0.5], ['E3', 1],
      ['G3', 0.25], ['F#3', 0.25], ['G3', 0.25], ['F#3', 0.25], ['G3', 0.25], ['F#3', 0.25],
      ['D3', 0.5], ['D3', 0.5], ['E3', 0.5], ['E3', 1],
    ],
  },
  {
    musica: "Sweet Child O' Mine",
    banda: "Guns N' Roses",
    bpm: 125,
    timbre: 'limpo',
    notas: [
      ['D4', 0.5], ['D5', 0.5], ['A4', 0.5], ['G4', 0.5], ['G5', 0.5], ['A4', 0.5], ['F#5', 0.5], ['A4', 0.5],
      ['D4', 0.5], ['D5', 0.5], ['A4', 0.5], ['G4', 0.5], ['G5', 0.5], ['A4', 0.5], ['F#5', 0.5], ['A4', 0.5],
    ],
  },
  {
    musica: '(I Can’t Get No) Satisfaction',
    banda: 'The Rolling Stones',
    bpm: 130,
    timbre: 'distorcido',
    notas: [
      ['B3', 0.5], ['B3', 0.5], ['C#4', 0.5], ['D4', 1.5], ['pausa', 0.5],
      ['D4', 0.5], ['D4', 0.5], ['C#4', 0.5], ['C#4', 0.5], ['B3', 1.5],
    ],
  },
  {
    musica: 'Come As You Are',
    banda: 'Nirvana',
    bpm: 120,
    timbre: 'limpo',
    notas: [
      ['E2', 0.5], ['E2', 0.5], ['F2', 0.5], ['F#2', 0.5], ['A2', 0.5], ['F#2', 0.5], ['A2', 0.5], ['F#2', 0.5],
      ['F#2', 0.5], ['F2', 0.5], ['E2', 0.5], ['B2', 0.5], ['E2', 0.5], ['E2', 0.5], ['B2', 0.5], ['E2', 0.5],
    ],
  },
  {
    musica: 'Thunderstruck',
    banda: 'AC/DC',
    bpm: 133,
    timbre: 'distorcido',
    notas: [
      ['B4', 0.25], ['B3', 0.25], ['A4', 0.25], ['B3', 0.25], ['G#4', 0.25], ['B3', 0.25], ['A4', 0.25], ['B3', 0.25],
      ['G#4', 0.25], ['B3', 0.25], ['F#4', 0.25], ['B3', 0.25], ['G#4', 0.25], ['B3', 0.25], ['E4', 0.25], ['B3', 0.25],
      ['B4', 0.25], ['B3', 0.25], ['A4', 0.25], ['B3', 0.25], ['G#4', 0.25], ['B3', 0.25], ['A4', 0.25], ['B3', 0.25],
      ['G#4', 0.25], ['B3', 0.25], ['F#4', 0.25], ['B3', 0.25], ['G#4', 0.25], ['B3', 0.25], ['E4', 0.25], ['B3', 0.25],
    ],
  },
  {
    musica: 'We Will Rock You',
    banda: 'Queen',
    bpm: 82,
    timbre: 'bateria',
    notas: [
      ['bumbo', 0.5], ['bumbo', 0.5], ['caixa', 1],
      ['bumbo', 0.5], ['bumbo', 0.5], ['caixa', 1],
      ['bumbo', 0.5], ['bumbo', 0.5], ['caixa', 1],
      ['bumbo', 0.5], ['bumbo', 0.5], ['caixa', 1],
    ],
  },
  {
    musica: 'Crazy Train',
    banda: 'Ozzy Osbourne',
    bpm: 138,
    timbre: 'distorcido',
    simples: true,
    notas: [
      ['F#3', 0.5], ['F#3', 0.5], ['C#4', 0.5], ['F#3', 0.5], ['D4', 0.5], ['F#3', 0.5], ['C#4', 0.5], ['F#3', 0.5],
      ['B3', 0.5], ['A3', 0.5], ['G#3', 0.5], ['A3', 0.5], ['B3', 0.5], ['A3', 0.5], ['G#3', 0.5], ['E3', 0.5],
    ],
  },
  {
    musica: 'Smells Like Teen Spirit',
    banda: 'Nirvana',
    bpm: 117,
    timbre: 'distorcido',
    notas: [
      ['F3', 0.75], ['F3', 0.25], ['F3', 0.5], ['F3', 0.5],
      ['A#3', 0.75], ['A#3', 0.25], ['A#3', 0.5], ['A#3', 0.5],
      ['G#3', 0.75], ['G#3', 0.25], ['G#3', 0.5], ['G#3', 0.5],
      ['C#4', 0.75], ['C#4', 0.25], ['C#4', 0.5], ['C#4', 0.5],
    ],
  },
  {
    musica: 'Eye of the Tiger',
    banda: 'Survivor',
    bpm: 109,
    timbre: 'distorcido',
    notas: [
      ['C3', 1], ['pausa', 0.5], ['C3', 0.25], ['A#2', 0.25],
      ['C3', 1], ['pausa', 0.5], ['C3', 0.25], ['A#2', 0.25],
      ['C3', 1], ['pausa', 0.5], ['C3', 0.25], ['A#2', 0.25],
      ['G#2', 2],
    ],
  },
  {
    musica: 'Another One Bites the Dust',
    banda: 'Queen',
    bpm: 110,
    timbre: 'limpo',
    notas: [
      ['E2', 0.5], ['E2', 0.5], ['E2', 1], ['pausa', 1],
      ['E2', 0.25], ['E2', 0.25], ['E2', 0.25], ['E2', 0.25], ['G2', 0.5], ['E2', 0.25], ['A2', 1.25],
    ],
  },
  {
    musica: 'Day Tripper',
    banda: 'The Beatles',
    bpm: 138,
    timbre: 'limpo',
    notas: [
      ['E2', 0.5], ['G2', 0.5], ['G#2', 0.5], ['B2', 0.5], ['E3', 0.5], ['D3', 0.5], ['B2', 0.5],
      ['F#2', 0.5], ['B2', 0.5], ['D3', 0.5], ['B2', 1.5],
    ],
  },
  {
    musica: 'Zombie',
    banda: 'The Cranberries',
    bpm: 84,
    timbre: 'distorcido',
    notas: [
      ['E3', 0.5], ['E3', 0.5], ['E3', 0.5], ['E3', 0.5],
      ['C3', 0.5], ['C3', 0.5], ['C3', 0.5], ['C3', 0.5],
      ['G2', 0.5], ['G2', 0.5], ['G2', 0.5], ['G2', 0.5],
      ['D3', 0.5], ['D3', 0.5], ['D3', 0.5], ['D3', 0.5],
    ],
  },
  {
    musica: 'The Final Countdown',
    banda: 'Europe',
    bpm: 118,
    timbre: '8bit',
    notas: [
      ['C#5', 0.25], ['B4', 0.25], ['C#5', 1], ['F#4', 1.5],
      ['D5', 0.25], ['C#5', 0.25], ['D5', 0.5], ['C#5', 0.5], ['B4', 1.5],
      ['D5', 0.25], ['C#5', 0.25], ['D5', 1], ['F#4', 1.5],
      ['B4', 0.25], ['A4', 0.25], ['B4', 0.5], ['A4', 0.5], ['G#4', 0.5], ['B4', 0.5], ['A4', 1.5],
    ],
  },
]

const SEMITOM: Record<string, number> = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 }

export function frequencia(nota: string): number {
  const m = /^([A-G]#?)(\d)$/.exec(nota)
  if (!m) throw new Error(`Nota inválida: ${nota}`)
  const midi = (Number(m[2]) + 1) * 12 + SEMITOM[m[1]]
  return 440 * 2 ** ((midi - 69) / 12)
}
