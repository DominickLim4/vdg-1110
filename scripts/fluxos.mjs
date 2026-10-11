// Joga os fluxos principais num iPhone simulado e verifica os resultados.
// Uso: com o dev server em 5199, `node scripts/fluxos.mjs [url] [pasta]` (CHROMIUM=... se precisar).
import { chromium, devices } from 'playwright'
import { mkdirSync, readFileSync } from 'node:fs'

const URL = process.argv[2] ?? 'http://localhost:5199/'
const SAIDA = process.argv[3] ?? 'test-results/fluxos'
mkdirSync(SAIDA, { recursive: true })

// respostas certas = primeira opção de cada pergunta em perguntas.ts
const fonte = readFileSync('src/conteudo/perguntas.ts', 'utf8')
const RESPOSTAS = new Map(
  [...fonte.matchAll(/pergunta: '([^']+)',\s*opcoes: \['([^']+)'/g)].map((m) => [m[1], m[2]]),
)

const navegador = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined })
const ctx = await navegador.newContext({ ...devices['iPhone 13'], locale: 'pt-BR' })
const pg = await ctx.newPage()
const erros = []
pg.on('console', (m) => m.type() === 'error' && erros.push(m.text()))
pg.on('pageerror', (e) => erros.push(e.message))
const foto = (n) => pg.screenshot({ path: `${SAIDA}/${n}.png` })
const esperar = (ms) => pg.waitForTimeout(ms)
const estado = () => pg.evaluate(() => JSON.parse(localStorage.getItem('vale-da-geo:v1')))
const falhas = []
const conferir = (ok, msg) => {
  console.log(`${ok ? '✓' : '✗'} ${msg}`)
  if (!ok) falhas.push(msg)
}

await pg.goto(URL)
await pg.evaluate(() => {
  localStorage.clear()
  localStorage.setItem('vale-da-geo:v1', JSON.stringify({ versao: 1, portaoAberto: true, aberturaVista: true, vales: {}, pesca: { tentativas: [], emAndamento: false }, conquistas: {}, energia: 100, som: false }))
})

// ---------- Quiz ----------
await pg.goto(URL + '#/jogo/quiz')
await pg.reload()
for (let i = 0; i < 10; i++) {
  await pg.locator('.quiz__caixa').click() // pula a datilografia
  await pg.waitForSelector('.quiz__opcao')
  const texto = (await pg.locator('.quiz__texto').innerText()).replace('▼', '').trim()
  const certa = RESPOSTAS.get(texto)
  if (i === 0) await foto('quiz-pergunta')
  await pg.locator('.quiz__opcao', { hasText: certa }).first().click()
  await esperar(150)
  await pg.locator('.quiz__caixa').click()
  await pg.locator('.quiz__rodape .botao').click()
}
await pg.locator('.quiz__caixa').click()
await esperar(1400)
await foto('quiz-recompensa')
conferir(await pg.locator('.recompensa__nome', { hasText: 'Vale Date' }).isVisible(), 'quiz com 10/10 libera o Vale Date')
conferir(!!(await estado()).conquistas['quiz-perfeito'], 'gabarito gera a conquista quiz-perfeito')

// ---------- Termo ----------
await pg.goto(URL + '#/jogo/termo')
await esperar(500)
for (const l of 'MOTEX') await pg.locator('.tecla', { hasText: new RegExp(`^${l}$`) }).click()
await pg.locator('.tecla', { hasText: 'Enviar' }).click()
await esperar(600)
for (const l of 'MOTEL') await pg.locator('.tecla', { hasText: new RegExp(`^${l}$`) }).click()
await pg.locator('.tecla', { hasText: 'Enviar' }).click()
await esperar(2200)
await foto('termo-recompensa')
conferir(!!(await estado()).vales.transa, 'MOTEL libera o Vale Transa')

// ---------- Memória ----------
await pg.goto(URL + '#/jogo/memoria')
await esperar(500)
const cartas = pg.locator('.carta-mem')
const vistos = new Map()
for (let i = 0; i < 16; i += 2) {
  await cartas.nth(i).click()
  await cartas.nth(i + 1).click()
  vistos.set(i, await cartas.nth(i).getAttribute('aria-label'))
  vistos.set(i + 1, await cartas.nth(i + 1).getAttribute('aria-label'))
  await esperar(900)
}
const porFigura = {}
for (const [i, f] of vistos) (porFigura[f] ??= []).push(i)
for (const [a, b] of Object.values(porFigura)) {
  if ((await cartas.nth(a).getAttribute('aria-label')) === 'carta virada') {
    await cartas.nth(a).click()
    await cartas.nth(b).click()
    await esperar(300)
  }
}
await esperar(1200)
await foto('memoria-recompensa')
conferir(!!(await estado()).vales.abracos, 'memória completa libera Abraços e Cheiros')

// ---------- Kimi Run (só abre e começa; o vale vem pelo estado) ----------
await pg.goto(URL + '#/jogo/kimi-run')
await esperar(400)
await pg.locator('.kimirun__palco').click()
await esperar(1500)
await foto('kimirun-correndo')
await pg.waitForSelector('.kimirun__sobre', { timeout: 20_000 })
const frase = await pg.locator('.kimirun__sobre p').innerText()
conferir(/banheira|aspirador|gato/.test(frase), `Kimi Run termina ao bater num obstáculo ("${frase}")`)
await foto('kimirun-bateu')
await pg.evaluate(() => {
  const s = JSON.parse(localStorage.getItem('vale-da-geo:v1'))
  s.vales.kimi = { desbloqueadoEm: new Date().toISOString() }
  localStorage.setItem('vale-da-geo:v1', JSON.stringify(s))
})

// ---------- Pesca ----------
await pg.goto(URL + '#/jogo/pesca')
await pg.reload()
await esperar(600)
await foto('pesca-menu')
await pg.locator('.botao', { hasText: 'Começar a pescar' }).click()
await esperar(300)
const area = await pg.locator('.pesca-jogo').boundingBox()
const x = area.x + area.width / 2
const y = area.y + area.height / 2
const fim = Date.now() + 61_500
let segurando = false
let fotoMeio = false
while (Date.now() < fim) {
  // segue o peixe: segura se o peixe está acima do centro da barra
  const pos = await pg.evaluate(() => {
    const p = document.querySelector('.medidor__peixe')
    const b = document.querySelector('.medidor__barra')
    if (!p || !b) return null
    const pr = p.getBoundingClientRect()
    const br = b.getBoundingClientRect()
    return { peixe: pr.top + pr.height / 2, barra: br.top + br.height / 2 }
  })
  if (!pos) break
  const quer = pos.peixe < pos.barra
  if (quer !== segurando) {
    await pg.mouse.move(x, y)
    quer ? await pg.mouse.down() : await pg.mouse.up()
    segurando = quer
  }
  if (!fotoMeio && Date.now() > fim - 40_000) {
    await foto('pesca-jogando')
    fotoMeio = true
  }
  await esperar(40)
}
await pg.mouse.up()
await esperar(800)
await foto('pesca-resultado')
let s = await estado()
conferir(s.pesca.tentativas.length === 1 && !s.pesca.emAndamento, `1ª tentativa registrada (${s.pesca.tentativas[0]} pts)`)

// recarregar no meio da 2ª tentativa não pode devolver a chance
await pg.locator('.botao', { hasText: 'Tentar de novo' }).click()
await esperar(3000)
await pg.reload()
await esperar(800)
s = await estado()
conferir(s.pesca.tentativas.length === 2 && !s.pesca.emAndamento, 'recarregar no meio conta a tentativa e encerra com os pontos parciais')
const melhor = Math.max(...s.pesca.tentativas)
await pg.locator('.botao', { hasText: 'Finalizar e aceitar presente' }).click()
await esperar(300)
await foto('pesca-confirmar')
await pg.locator('.confirmar .botao--verde').click()
await esperar(3200)
await foto('pesca-revelacao')
s = await estado()
const esperado = melhor >= 1300 ? 'iridio' : melhor >= 800 ? 'ouro' : 'prata'
conferir(s.pesca.finalizado?.faixa === esperado && s.pesca.finalizado.pontos === melhor, `finaliza com a melhor (${melhor} pts → ${esperado})`)

// ---------- Baú ----------
await pg.goto(URL + '#/bau')
await esperar(800)
await foto('bau-cheio')
await pg.locator('.inventario__slot--item').first().click()
await esperar(500)
await foto('bau-cartao')
await pg.keyboard.press('Escape')

// ---------- Carta ----------
await pg.goto(URL + '#/carta')
await esperar(700)
const lacre = await pg.locator('.lacre').boundingBox()
await pg.mouse.move(lacre.x + lacre.width / 2, lacre.y + lacre.height / 2)
await pg.mouse.down()
await pg.mouse.move(lacre.x + 160, lacre.y + 120, { steps: 8 })
await pg.mouse.up()
await esperar(2200)
await foto('carta-aberta')
await pg.locator('.bolo').scrollIntoViewIfNeeded()
await esperar(400)
const bolo = await pg.locator('.bolo__velas').boundingBox()
for (let linha = 0; linha < 4; linha++) {
  const yy = bolo.y + (bolo.height * (linha + 0.5)) / 4
  await pg.mouse.move(bolo.x, yy)
  await pg.mouse.down()
  await pg.mouse.move(bolo.x + bolo.width, yy, { steps: 30 })
  await pg.mouse.up()
}
await esperar(1500)
await foto('carta-velas')
s = await estado()
conferir(!!s.conquistas.velas, 'passar o dedo apaga as 25 velas')

console.log(erros.length ? `\nERROS NO CONSOLE:\n${erros.join('\n')}` : '\nSem erros no console.')
console.log(falhas.length ? `\n${falhas.length} FALHA(S)` : 'Todos os fluxos passaram.')
await navegador.close()
process.exit(falhas.length ? 1 : 0)
