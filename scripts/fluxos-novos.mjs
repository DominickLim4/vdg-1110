// Fluxos das novidades: sushi, resgate no WhatsApp, riffs, minijogos do Parquinho e hotbar com 8 slots.
// Uso: com o dev server rodando, `node scripts/fluxos-novos.mjs [url] [pasta]` (CHROMIUM=... se precisar).
import { chromium, devices } from 'playwright'
import { mkdirSync } from 'node:fs'

const URL = process.argv[2] ?? 'http://localhost:5173/'
const SAIDA = process.argv[3] ?? 'test-results/fluxos-novos'
mkdirSync(SAIDA, { recursive: true })

const navegador = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined })
const ctx = await navegador.newContext({ ...devices['iPhone 13'], locale: 'pt-BR' })
await ctx.addInitScript(() => {
  window.__abertos = []
  window.open = (url) => {
    window.__abertos.push(String(url))
    return {}
  }
})
const pg = await ctx.newPage()
const erros = []
pg.on('console', (m) => m.type() === 'error' && erros.push(m.text()))
pg.on('pageerror', (e) => erros.push(e.message))
const foto = (n) => pg.screenshot({ path: `${SAIDA}/${n}.png` })
const esperar = (ms) => pg.waitForTimeout(ms)
const estado = () => pg.evaluate(() => JSON.parse(localStorage.getItem('vale-da-geo:v1')))
const abertos = () => pg.evaluate(() => window.__abertos)
const falhas = []
const conferir = (ok, msg) => {
  console.log(`${ok ? '✓' : '✗'} ${msg}`)
  if (!ok) falhas.push(msg)
}

await pg.goto(URL)
await pg.evaluate(() => {
  localStorage.clear()
  const agora = new Date().toISOString()
  localStorage.setItem(
    'vale-da-geo:v1',
    JSON.stringify({ versao: 1, portaoAberto: true, aberturaVista: true, vales: { date: { desbloqueadoEm: agora } }, pesca: { tentativas: [], emAndamento: false }, conquistas: {}, energia: 100, som: true }),
  )
})

// ---------- Hotbar com 8 slots ----------
for (const d of ['iPhone SE', 'Galaxy S8']) {
  const p2 = await (await navegador.newContext({ ...devices[d] })).newPage()
  await p2.goto(URL)
  await p2.evaluate(() => localStorage.setItem('vale-da-geo:v1', JSON.stringify({ versao: 1, portaoAberto: true, aberturaVista: true, vales: {}, pesca: { tentativas: [], emAndamento: false }, conquistas: {}, energia: 100, som: false })))
  await p2.reload()
  await p2.waitForTimeout(700)
  const m = await p2.evaluate(() => ({
    vw: innerWidth,
    dir: document.querySelector('.hotbar').getBoundingClientRect().right,
    slots: document.querySelectorAll('.hotbar__slot').length,
    slot: document.querySelector('.hotbar__slot').getBoundingClientRect().width,
    rolagem: document.documentElement.scrollWidth > innerWidth,
  }))
  conferir(m.slots === 8 && m.dir <= m.vw && !m.rolagem, `${d}: hotbar com 8 slots cabe (slot ${Math.round(m.slot)}px, tela ${m.vw}px)`)
  await p2.close()
}

// ---------- Resgate no WhatsApp ----------
await pg.goto(URL + '#/bau')
await pg.reload()
await esperar(700)
await pg.locator('.inventario__slot--item').first().click()
await esperar(400)
await pg.locator('.cartao__acoes .botao--verde').click()
await esperar(300)
const links = await abertos()
conferir(links.some((l) => l.startsWith('https://wa.me/5598984230759?text=') && decodeURIComponent(l).includes('Vale Date')), `Resgatar abre wa.me/5598984230759 com a mensagem (${links[0]?.slice(0, 48)}…)`)
await pg.keyboard.press('Escape')

// ---------- Sushi ----------
await pg.goto(URL + '#/sushi')
await esperar(700)
await foto('sushi-1-peixe')
await pg.locator('.peixe-carta', { hasText: 'Atum' }).click()
await esperar(600)
const file = await pg.locator('.tabua__file').boundingBox()
for (const fx of [0.18, 0.34, 0.5, 0.66, 0.82]) {
  const x = file.x + file.width * fx
  await pg.mouse.move(x, file.y - 20)
  await pg.mouse.down()
  await pg.mouse.move(x + 4, file.y + file.height + 20, { steps: 10 })
  await pg.mouse.up()
  await esperar(120)
}
await esperar(500)
await foto('sushi-2-corte')
conferir(await pg.locator('.botao', { hasText: 'Montar o sushi' }).isVisible(), '5 cortes deslizando o dedo liberam a montagem')
await pg.locator('.botao', { hasText: 'Montar o sushi' }).click()
await esperar(500)
for (const ing of ['Cream cheese', 'Cebolinha', 'Ovas', 'Tarê', 'Wasabi', 'Gengibre']) await pg.locator('.ingrediente', { hasText: ing }).click()
for (const f of ['Nigiri', 'Sashimi', 'Uramaki', 'Hossomaki', 'Temaki', 'Hot roll']) {
  await pg.locator('.formatos .frasco', { hasText: f }).click()
  await esperar(450)
  if (f === 'Nigiri') {
    await foto('sushi-nao-nigiri')
    conferir((await pg.locator('.nao-nigiri__grito').innerText()) === 'naoooooooo vida naoooooooooo', 'escolher Nigiri abre o pop-up "naoooooooo vida naoooooooooo"')
    await pg.locator('.nao-nigiri .botao').click()
    await pg.locator('.nao-nigiri').waitFor({ state: 'detached', timeout: 3000 })
    const escolhido = await pg.locator('.formatos .frasco', { hasText: 'Nigiri' }).getAttribute('aria-pressed')
    conferir(escolhido === 'true', 'o pop-up fecha e o nigiri continua escolhido')
  }
  await pg.locator('.montagem__palco').screenshot({ path: `${SAIDA}/sushi-formato-${f.replace(' ', '-').toLowerCase()}.png` })
}
await pg.locator('.formatos .frasco', { hasText: 'Uramaki' }).click()
await esperar(300)
await foto('sushi-3-montagem')
await pg.locator('.botao', { hasText: 'Empratar' }).click()
await esperar(900)
await foto('sushi-4-servir')
await pg.locator('.sugestoes .ingrediente', { hasText: 'Combo Rubro-Negro' }).click()
await pg.locator('.botao', { hasText: 'Escolher a bebida' }).click()
await esperar(500)
await foto('sushi-5-bebidas')
await pg.locator('.bebida', { hasText: 'Vinho' }).click()
await esperar(1800)
await foto('sushi-6-coca')
conferir((await pg.locator('.servindo .etapa__aviso').innerText()).includes('Coca Zero'), 'pedir vinho serve Coca Zero')
await pg.locator('.botao', { hasText: 'Fechar a comanda' }).click()
await esperar(700)
await foto('sushi-7-comanda')
const comanda = await pg.locator('.comanda').innerText()
conferir(comanda.includes('Combo Rubro-Negro') && comanda.includes('Atum') && comanda.includes('Uramaki') && /Vinho[\s\S]*Coca Zero/.test(comanda), 'comanda mostra prato, peixe, formato e Vinho → Coca Zero')
conferir(!!(await estado()).conquistas['sushi-chef'], 'conquista Sushiwoman registrada')
await pg.locator('.botao', { hasText: 'Pedir esse de verdade' }).click()
await esperar(200)
const l2 = await abertos()
conferir(decodeURIComponent(l2[l2.length - 1]).includes('Combo Rubro-Negro'), 'pedir de verdade manda o pedido no WhatsApp')

// ---------- Parquinho ----------
await pg.goto(URL + '#/parquinho')
await esperar(700)
await foto('parq-1-minijogos')
const junimo = pg.locator('.brinquedo', { hasText: 'Acerte o Junimo' })
await junimo.locator('.botao', { hasText: 'Começar' }).click()
let acertos = 0
const fimJ = Date.now() + 8000
while (Date.now() < fimJ) {
  const alvo = junimo.locator('.junimos__buraco[aria-label="Junimo"]').first()
  if (await alvo.count()) {
    await alvo.click({ force: true, timeout: 500 }).catch(() => {})
    acertos++
  }
  await esperar(120)
}
await junimo.screenshot({ path: `${SAIDA}/parq-junimo.png` })
const placarJ = await junimo.locator('.mini-placar').innerText()
conferir(acertos > 0 && /[1-9]\d* pontos/.test(placarJ), `Junimos aparecem e pontuam (${placarJ.replace(/\n/g, ' ')})`)

const chuva = pg.locator('.brinquedo', { hasText: 'Chuva de Coca Zero' })
await chuva.scrollIntoViewIfNeeded()
await chuva.locator('.botao', { hasText: 'Começar' }).click()
await esperar(2500)
await chuva.screenshot({ path: `${SAIDA}/parq-chuva.png` })

const busca = pg.locator('.brinquedo', { hasText: 'Kimi, busca!' })
await busca.scrollIntoViewIfNeeded()
const campo = await busca.locator('.busca').boundingBox()
await pg.mouse.click(campo.x + campo.width * 0.75, campo.y + campo.height * 0.4)
await esperar(1400)
await busca.screenshot({ path: `${SAIDA}/parq-busca-meio.png` })
await esperar(4500)
const buscas = await busca.locator('.mini-placar').innerText()
conferir(/[1-9] buscas?/.test(buscas), `Kimi busca e volta com a bolinha (${buscas})`)

const roleta = pg.locator('.brinquedo', { hasText: 'Roleta do destino' })
await roleta.scrollIntoViewIfNeeded()
await roleta.locator('.roleta__centro').click()
await esperar(4800)
await roleta.screenshot({ path: `${SAIDA}/parq-roleta.png` })
conferir(await roleta.locator('.roleta__resultado').isVisible(), 'roleta para e mostra o resultado')

await pg.locator('.abas-parquinho .frasco', { hasText: 'Brinquedos' }).click()
await esperar(500)
const guitarra = pg.locator('.brinquedo', { hasText: 'Air guitar' })
await guitarra.scrollIntoViewIfNeeded()
await guitarra.locator('.botao', { hasText: 'Me surpreenda' }).click()
await esperar(400)
await guitarra.screenshot({ path: `${SAIDA}/parq-guitarra.png` })
conferir(await guitarra.locator('.guitarra__tocando').isVisible(), `"Me surpreenda" toca um riff (${(await guitarra.locator('.guitarra__tocando').innerText()).replace(/\n/g, ' ')})`)

console.log(erros.length ? `\nERROS NO CONSOLE:\n${erros.join('\n')}` : '\nSem erros no console.')
console.log(falhas.length ? `\n${falhas.length} FALHA(S)` : 'Todos os fluxos passaram.')
await navegador.close()
process.exit(falhas.length ? 1 : 0)
