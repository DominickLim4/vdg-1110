// Simula jogadores de níveis diferentes para calibrar as faixas de pontos da pesca.
// Rodar: npx vitest run scripts/calibrar-pesca.test.ts
import { it } from 'vitest'
import { BARRA, novoMotor, passo, rngSemente } from '../src/jogos/pesca/motor'

function simular(reacao: number, ruido: number, semente: number) {
  const rng = rngSemente(semente)
  const rngBot = rngSemente(semente * 7 + 1)
  const s = novoMotor(rng)
  const dt = 1 / 60
  const historico: number[] = []
  const atraso = Math.round(reacao / dt)
  while (s.tempo > 0) {
    historico.push(s.peixePos)
    const visto = historico[Math.max(0, historico.length - 1 - atraso)]
    const erro = visto - (s.barra + BARRA / 2)
    let segura = erro - 0.18 * s.barraVel > 0
    if (rngBot() < ruido) segura = !segura
    passo(s, dt, segura, rng)
  }
  return s.pontos
}

it('distribuição de pontos por nível', () => {
  for (const [nome, reacao, ruido] of [
    ['expert', 0.12, 0.02],
    ['bom', 0.2, 0.08],
    ['médio', 0.3, 0.15],
    ['iniciante', 0.45, 0.3],
  ] as const) {
    const r = Array.from({ length: 300 }, (_, k) => simular(reacao, ruido, k + 1)).sort((a, b) => a - b)
    const q = (f: number) => r[Math.floor(f * (r.length - 1))]
    console.log(`${nome.padEnd(10)} p10=${q(0.1)} p50=${q(0.5)} p90=${q(0.9)} max=${q(1)}`)
  }
})
