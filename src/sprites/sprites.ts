// Pixel art desenhada como texto: cada caractere é um pixel, '.' é transparente.
// A paleta de cada sprite mapeia caractere → cor.

export interface DefSprite {
  linhas: string[]
  paleta: Record<string, string>
}

const O = '#3A2214' // contorno marrom (o mesmo tom do texto)

const kimiPaleta = {
  o: '#5A3214',
  d: '#C9822F',
  g: '#E8A94B',
  G: '#F6CF86',
  e: '#2B1B12',
  w: '#FFFFFF',
  n: '#2B1B12',
  t: '#E86A7F',
}

export const SPRITES = {
  kimi: {
    paleta: kimiPaleta,
    linhas: [
      '....oooooooo....',
      '..oogGGGGGGgoo..',
      '.oddgGGGGGGgddo.',
      'odddggggggggdddo',
      'odddgweggwegdddo',
      'odddgeeggeegdddo',
      'odddggGGGGggdddo',
      '.oddgGGnnGGgddo.',
      '..odgGGnnGGgdo..',
      '...ogGGGGGGgo...',
      '....ogGttGgo....',
      '.....oGttGo.....',
      '......oooo......',
    ],
  },
  kimiCorre1: {
    paleta: kimiPaleta,
    linhas: [
      '............oooo..',
      '...........oGGGGo.',
      'o..........oGGeGGo',
      'do........odGGGGGn',
      'ddo.oooooodGGGGtoo',
      '.ddogggggggddGGGo.',
      '..doggggggggddGo..',
      '..ogGGGGGGGGgdo...',
      '..oggggggggggo....',
      '..odo.odo.odo.odo.',
      '..odo.odo.odo.odo.',
      '..oo..oo..oo..oo..',
    ],
  },
  kimiCorre2: {
    paleta: kimiPaleta,
    linhas: [
      '............oooo..',
      '...........oGGGGo.',
      '.o.........oGGeGGo',
      'odo.......odGGGGGn',
      '.do.oooooodGGGGtoo',
      '.ddogggggggddGGGo.',
      '..doggggggggddGo..',
      '..ogGGGGGGGGgdo...',
      '..oggggggggggo....',
      '.odo..odo.odo.odo.',
      'odo...odo..odo.odo',
      'oo....oo....oo..oo',
    ],
  },
  estrela: {
    paleta: { o: O, y: '#F5C242', h: '#FFF3B0' },
    linhas: [
      '.....o.....',
      '....oyo....',
      '....oho....',
      '.oooyhyooo.',
      'oyyyhhyyyyo',
      '.oyyyyyyyo.',
      '..oyyyyyo..',
      '..oyyoyyo..',
      '.oyyo.oyyo.',
      '.oyo...oyo.',
      '.oo.....oo.',
    ],
  },
  coracao: {
    paleta: { o: O, r: '#E2556F', h: '#FFB3C1' },
    linhas: [
      '.oo...oo.',
      'orro.orro',
      'orhrorrro',
      'orrrrrrro',
      '.orrrrro.',
      '..orrro..',
      '...oro...',
      '....o....',
    ],
  },
  peixe: {
    paleta: { o: O, l: '#C9E4F2', b: '#6FA3C7', d: '#4A7AA0', e: '#1A1A1A' },
    linhas: [
      '....oooo......',
      '..oollllo...oo',
      '.obbebbbbo.obo',
      'obbbbbbbbboobo',
      'obbbbbbbbbbbo.',
      '.oddddddddo.ob',
      '..oodddddoo.oo',
      '....ooooo.....',
    ],
  },
  nigiri: {
    paleta: { o: O, S: '#F07B4F', s: '#FFC1A1', w: '#FFFDF5' },
    linhas: [
      '..oooooooo..',
      '.oSsSsSsSSo.',
      'oSsSsSsSsSSo',
      'oooooooooooo',
      'owwwwwwwwwwo',
      'owwwwwwwwwwo',
      '.owwwwwwwwo.',
      '..oooooooo..',
    ],
  },
  coca: {
    paleta: { o: O, s: '#C9CED6', K: '#222222', w: '#FFFFFF', R: '#D7263D' },
    linhas: [
      '..oooooo..',
      '.osssssso.',
      '.oKKKKKKo.',
      '.oKwKKKKo.',
      '.oRRRRRRo.',
      '.oRwwwwRo.',
      '.oRRRRRRo.',
      '.oKKKKKKo.',
      '.oKwKKKKo.',
      '.oKKKKKKo.',
      '.oKKKKKKo.',
      '.osssssso.',
      '..oooooo..',
    ],
  },
  d20: {
    paleta: { o: O, L: '#D9CCF5', M: '#B8A6E3', D: '#8A73C9', w: '#FFFFFF' },
    linhas: [
      '......oo......',
      '....oLLLLo....',
      '..ooLLLLLLoo..',
      '.oMLLLLLLLLMo.',
      'oMMMLLLLLLMMMo',
      'oMMLwwwLwwwMMo',
      'oMMLLLwLwLwMMo',
      'oMLLwwwLwLwLMo',
      'oMLLwLLLwLwLMo',
      'oMMMwwwLwwwMMo',
      '.oDDDDDDDDDDo.',
      '..ooDDDDDDoo..',
      '....oDDDDo....',
      '......oo......',
    ],
  },
  guitarra: {
    paleta: { o: O, k: '#3A3A3A', n: '#B07A45', R: '#C0392B', w: '#EDEDED' },
    linhas: [
      '...oo...',
      '...oko..',
      '...oko..',
      '...ono..',
      '...ono..',
      '...ono..',
      '...ono..',
      '..oonoo.',
      '.oRRnRRo',
      'oRRRnRRo',
      'oRRwwwRo',
      '.oRRRRRo',
      'oRRRRRRo',
      'oRRRRRRo',
      '.oRRRRo.',
      '..oooo..',
    ],
  },
  haltere: {
    paleta: { o: O, G: '#5B6B7A', s: '#B9C2CC' },
    linhas: [
      '.oo..........oo.',
      'oGGo........oGGo',
      'oGGoo......ooGGo',
      'oGGGossssssoGGGo',
      'oGGGossssssoGGGo',
      'oGGoo......ooGGo',
      'oGGo........oGGo',
      '.oo..........oo.',
    ],
  },
  cerebro: {
    paleta: { o: O, P: '#F2A6B6', p: '#D97A92' },
    linhas: [
      '...oooo.ooo...',
      '.ooPPPPoPPPoo.',
      'oPPpPPPoPPpPPo',
      'oPpPPpPoPpPPPo',
      'oPPPpPPoPPPpPo',
      'oPpPPPpoPpPPPo',
      '.oPPpPPoPPpPo.',
      '..ooPPPoPPoo..',
      '....oooPPo....',
      '......oPo.....',
      '......oo......',
    ],
  },
  girassol: {
    paleta: { o: O, Y: '#F5C242', B: '#8A5A2B', b: '#5A3A1A' },
    linhas: [
      '.....oYYo.....',
      '..oo.oYYo.oo..',
      '.oYYooYYooYYo.',
      '.oYYYoBBoYYYo.',
      '..ooBBBBBBoo..',
      'ooYoBBbBbBoYoo',
      'oYYoBbBBBBoYYo',
      'ooYoBBBbBBoYoo',
      '..ooBBBBBBoo..',
      '.oYYYoBBoYYYo.',
      '.oYYooYYooYYo.',
      '..oo.oYYo.oo..',
      '.....oYYo.....',
      '......oo......',
    ],
  },
  bau: {
    paleta: { o: O, W: '#B5652E', w: '#8A4A20', Y: '#F5C242', k: '#3A2214' },
    linhas: [
      '..oooooooooooo..',
      '.oWWWWWWWWWWWWo.',
      'oWWwWWWWWWWWwWWo',
      'oYYYYYYYYYYYYYYo',
      'oWWwWWWWWWWWwWWo',
      'oooooooYYooooooo',
      'oWWwWWoYYoWWwWWo',
      'oWWwWWokkoWWwWWo',
      'oWWwWWWooWWWwWWo',
      'oYYYYYYYYYYYYYYo',
      'oWWwWWWWWWWWwWWo',
      'oWWwWWWWWWWWwWWo',
      'oooooooooooooooo',
    ],
  },
  casa: {
    paleta: { o: O, R: '#B5452E', C: '#F3DDB0', b: '#5FB3CF', d: '#8A4A20' },
    linhas: [
      '......oo......',
      '.....oRRo.....',
      '....oRRRRo....',
      '...oRRRRRRo...',
      '..oRRRRRRRRo..',
      '.oRRRRRRRRRRo.',
      'oooooooooooooo',
      '.oCCCCCCCCCCo.',
      '.oCbbCCCCbbCo.',
      '.oCbbCCCCbbCo.',
      '.oCCCCdddCCCo.',
      '.oCCCCdddCCCo.',
      '.oooooooooooo.',
    ],
  },
  fliperama: {
    paleta: { o: O, R: '#E2556F', w: '#FFFFFF', k: '#3A3A3A', B: '#5FB3CF', Y: '#F5C242' },
    linhas: [
      '....oooo......',
      '...oRRRRo.....',
      '...oRwRRo.....',
      '...oRRRRo.....',
      '....oooo......',
      '.....oko......',
      '.....oko......',
      '.....oko......',
      '.oooooooooooo.',
      'oBBBBBBBBBBBBo',
      'oBBBBBBBYYBRRo',
      'oBBBBBBBBBBBBo',
      '.oooooooooooo.',
    ],
  },
  camera: {
    paleta: { o: O, K: '#3A3A3A', G: '#F2A6B6', L: '#5FB3CF', w: '#FFFFFF', R: '#E2556F' },
    linhas: [
      '...oooo.......',
      '..oKKKKo......',
      'oooooooooooooo',
      'oGGGGooooGGGRo',
      'oGGGoLLLLoGGGo',
      'oGGoLLwLLLoGGo',
      'oGGoLLLLLLoGGo',
      'oGGGoLLLLoGGGo',
      'oGGGGooooGGGGo',
      'oooooooooooooo',
    ],
  },
  pilula: {
    paleta: { o: O, R: '#8C2B3A', w: '#FFFFFF', W: '#FFF1D2' },
    linhas: [
      '..oooooooooo..',
      '.oRRRRRoWWWWo.',
      'oRwRRRRoWWWWWo',
      'oRRRRRRoWWWWWo',
      'oRRRRRRoWWWWWo',
      '.oRRRRRoWWWWo.',
      '..oooooooooo..',
    ],
  },
  envelope: {
    paleta: { o: O, P: '#FFF1D2', R: '#8C2B3A' },
    linhas: [
      'oooooooooooooo',
      'oPoPPPPPPPPoPo',
      'oPPoPPPPPPoPPo',
      'oPPPoPPPPoPPPo',
      'oPPPPoRRoPPPPo',
      'oPPPPRRRRPPPPo',
      'oPPPPPRRPPPPPo',
      'oPPPPPPPPPPPPo',
      'oooooooooooooo',
    ],
  },
  osso: {
    paleta: { o: O, W: '#FFF6E0' },
    linhas: ['.oo......oo.', 'oWWooooooWWo', '.oWWWWWWWWo.', 'oWWooooooWWo', '.oo......oo.'],
  },
  banheira: {
    paleta: { o: O, S: '#B9C2CC', W: '#FFFFFF', w: '#DDE6EE', b: '#BFE7F2' },
    linhas: [
      '..ooo...........',
      '..oSo..bb.b.....',
      '..oSo.b..bbb.b..',
      'oooooooooooooooo',
      'oWWWWWWWWWWWWWWo',
      'oWwWWWWWWWWWWWWo',
      '.oWWWWWWWWWWWWo.',
      '..oooooooooooo..',
      '..oo........oo..',
    ],
  },
  aspirador: {
    paleta: { o: O, G: '#9AA7B4', R: '#E2556F', K: '#3A3A3A' },
    linhas: [
      '....oooooo....',
      '..ooGGGGGGoo..',
      '.oGGGGRRGGGGo.',
      'oGGGGGRRGGGGGo',
      'oGGGGGGGGGGGGo',
      'oKKKKKKKKKKKKo',
      '.oKKKKKKKKKKo.',
      '..oooooooooo..',
    ],
  },
  gato: {
    paleta: { o: O, C: '#8E8E9A', e: '#F5C242', n: '#E2556F' },
    linhas: [
      '.oo....oo.....',
      '.oCo..oCo.....',
      '.oCCooCCo.....',
      'oCCCCCCCCo....',
      'oCeCCCeCCo....',
      'oCCCnCCCCo....',
      '.oCCCCCCo..oo.',
      '.oCCCCCCCo.oCo',
      'oCCCCCCCCCooCo',
      'oCCCCCCCCCCCo.',
      'oCCoCCCoCCCo..',
      '.oo.ooo.ooo...',
    ],
  },
  presente: {
    paleta: { o: O, R: '#E2556F', P: '#B8A6E3' },
    linhas: [
      '...oo..oo...',
      '..oRRooRRo..',
      '...ooRRoo...',
      'oooooRRooooo',
      'oPPPPRRPPPPo',
      'oooooRRooooo',
      'oPPPPRRPPPPo',
      'oPPPPRRPPPPo',
      'oPPPPRRPPPPo',
      'oPPPPRRPPPPo',
      'oooooooooooo',
    ],
  },
  cadeado: {
    paleta: { o: O, S: '#B9C2CC', Y: '#F5C242', k: '#3A2214' },
    linhas: [
      '...oooo...',
      '..oSSSSo..',
      '.oSo..oSo.',
      '.oSo..oSo.',
      'oooooooooo',
      'oYYYYYYYYo',
      'oYYYkkYYYo',
      'oYYYkkYYYo',
      'oYYYYkYYYo',
      'oYYYYYYYYo',
      'oooooooooo',
    ],
  },
  folha: {
    paleta: { o: O, O: '#E07A3A', y: '#F5C242' },
    linhas: [
      '......ooo.',
      '....ooOOo.',
      '...oOOyOo.',
      '..oOOyOOo.',
      '.oOOyOOo..',
      '.oOyOOo...',
      '.oyooo....',
      'oo........',
    ],
  },
  pimenta: {
    paleta: { o: O, R: '#D7263D', w: '#FF8A8A', G: '#4F8A3C' },
    linhas: [
      '.......oo...',
      '......oGGo..',
      '.....oGGo...',
      '....ooooo...',
      '...oRRRRRo..',
      '..oRwRRRRo..',
      '.oRRwRRRo...',
      '.oRRRRRRo...',
      'oRRRRRRo....',
      'oRRRRRo.....',
      'oRRRo.......',
      '.oo.........',
    ],
  },
  junimo: {
    paleta: { o: O, G: '#4F8A3C', J: '#7CC46A', w: '#FFFFFF', e: '#2B1B12' },
    linhas: [
      '.....oo.....',
      '....oGGo....',
      '.....oo.....',
      '...oooooo...',
      '..oJJJJJJo..',
      '.oJJJJJJJJo.',
      '.oJweJJweJo.',
      '.oJeeJJeeJo.',
      'oJJJJJJJJJJo',
      'oJJJJJJJJJJo',
      '.oJJooooJJo.',
      '..oo....oo..',
    ],
  },
  bola: {
    paleta: { o: O, Y: '#D7E85A', w: '#FFFFFF' },
    linhas: ['..oooo..', '.oYYYYo.', 'oYwYYYYo', 'oYYwwYYo', 'oYYYYwYo', 'oYYYYYwo', '.oYYYYo.', '..oooo..'],
  },
} satisfies Record<string, DefSprite>

export type NomeSprite = keyof typeof SPRITES

// Variações de cor (peixes da pesca, estrelas de qualidade)
export const VARIACOES = {
  sardinha: { b: '#8FB3C9', d: '#5F86A0', l: '#DCEAF2' },
  salmao: { b: '#F08A6B', d: '#C9604A', l: '#FFD1C1' },
  atum: { b: '#4A6FA5', d: '#2F4E80', l: '#A9C3E8' },
  lendario: { b: '#B884F0', d: '#8A55D0', l: '#F5C242' },
  prata: { y: '#D7DEE8', h: '#FFFFFF' },
  ouro: { y: '#F5C242', h: '#FFF3B0' },
  iridio: { y: '#A15BE0', h: '#E7C9FF' },
  cocaNormal: { K: '#D7263D', R: '#FFFFFF', w: '#D7263D' },
  joja: { K: '#2F5DA8', R: '#E2E8F0', w: '#2F5DA8' },
  junimoRoxo: { J: '#B8A6E3' },
  junimoAmarelo: { J: '#F5C242' },
  junimoRosa: { J: '#F2A6B6' },
} satisfies Record<string, Record<string, string>>

export type Variacao = keyof typeof VARIACOES

const cache = new Map<string, { url: string; w: number; h: number; canvas: HTMLCanvasElement }>()

export function urlSprite(nome: NomeSprite, variacao?: Variacao) {
  const chave = `${nome}:${variacao ?? ''}`
  const pronto = cache.get(chave)
  if (pronto) return pronto
  const def: DefSprite = SPRITES[nome]
  const paleta: Record<string, string> = { ...def.paleta, ...(variacao ? VARIACOES[variacao] : {}) }
  const h = def.linhas.length
  const w = Math.max(...def.linhas.map((l) => l.length))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  def.linhas.forEach((linha, y) => {
    for (let x = 0; x < linha.length; x++) {
      const cor = paleta[linha[x]]
      if (!cor) continue
      ctx.fillStyle = cor
      ctx.fillRect(x, y, 1, 1)
    }
  })
  const r = { url: canvas.toDataURL(), w, h, canvas }
  cache.set(chave, r)
  return r
}
