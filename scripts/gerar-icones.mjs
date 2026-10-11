// Gera os ícones do app (PWA / tela inicial) a partir de um SVG em pixel art do Kimi.
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const linhas = [
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
]
const cores = { o: '#5A3214', d: '#C9822F', g: '#E8A94B', G: '#F6CF86', e: '#2B1B12', w: '#FFFFFF', n: '#2B1B12', t: '#E86A7F' }
const pixels = linhas
  .flatMap((l, y) => [...l].map((c, x) => (cores[c] ? `<rect x="${x + 4}" y="${y + 5.5}" width="1" height="1" fill="${cores[c]}"/>` : '')))
  .join('')
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
<rect width="24" height="24" fill="#8fd0e6"/><rect y="18" width="24" height="6" fill="#78b159"/>${pixels}</svg>`

mkdirSync('public/icons', { recursive: true })
for (const tam of [180, 192, 512]) {
  await sharp(Buffer.from(svg), { density: 2000 }).resize(tam, tam, { kernel: 'nearest' }).png().toFile(`public/icons/icone-${tam}.png`)
}
console.log('ícones gerados em public/icons')
