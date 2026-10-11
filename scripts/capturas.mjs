// Percorre o site num celular simulado (390x844) e salva capturas de tela.
// Uso: com `npm run dev -- --port 5199` rodando, execute `node scripts/capturas.mjs [url] [pasta]`.
// CHROMIUM=/caminho/do/chrome define um executável específico, se precisar.
import { chromium, devices } from 'playwright'
import { mkdirSync } from 'node:fs'

const URL = process.argv[2] ?? 'http://localhost:5199/'
const SAIDA = process.argv[3] ?? 'test-results/capturas'
mkdirSync(SAIDA, { recursive: true })

const navegador = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined })
const aparelho = process.env.APARELHO ?? 'iPhone 13'
const ctx = await navegador.newContext({ ...devices[aparelho], locale: 'pt-BR' })
const pagina = await ctx.newPage()
const erros = []
pagina.on('console', (m) => m.type() === 'error' && erros.push(m.text()))
pagina.on('pageerror', (e) => erros.push(e.message))

const foto = (nome) => pagina.screenshot({ path: `${SAIDA}/${nome}.png` })
const esperar = (ms) => pagina.waitForTimeout(ms)

await pagina.goto(URL)
await esperar(900)
await foto('01-portao')
await pagina.fill('#senha', 'flamengo')
await pagina.click('button[type=submit]')
await esperar(500)
await pagina.click('text=Dica')
await foto('02-portao-erro')
await pagina.fill('#senha', 'Kiminhoca')
await pagina.click('button[type=submit]')
await esperar(1800)
await foto('03-abertura')
await pagina.click('text=Carregar')
await esperar(700)
await foto('04-save')
await pagina.click('.save')
await esperar(4200)
await foto('05-casa')
await pagina.evaluate(() => document.querySelector('.app__conteudo')?.scrollTo({ top: 9999 }))
await esperar(400)
await foto('06-casa-baixo')

for (const tela of ['fliperama', 'bau', 'kimi', 'nos', 'receita', 'parquinho', 'carta']) {
  await pagina.evaluate((t) => (location.hash = `/${t}`), tela)
  await esperar(900)
  await foto(`10-${tela}`)
}

for (const jogo of ['quiz', 'termo', 'memoria', 'kimi-run', 'pesca']) {
  await pagina.evaluate((j) => (location.hash = `/jogo/${j}`), jogo)
  await esperar(2200)
  await foto(`20-jogo-${jogo}`)
}

console.log(erros.length ? `ERROS NO CONSOLE:\n${erros.join('\n')}` : 'Sem erros no console.')
await navegador.close()
