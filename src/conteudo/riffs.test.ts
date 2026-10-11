import { describe, expect, it } from 'vitest'
import { frequencia, RIFFS } from './riffs'

describe('riffs', () => {
  it('converte notas em frequências', () => {
    expect(frequencia('A4')).toBeCloseTo(440)
    expect(frequencia('E2')).toBeCloseTo(82.41, 1)
    expect(frequencia('C4')).toBeCloseTo(261.63, 1)
  })

  it('não repete música no repertório', () => {
    const nomes = RIFFS.map((r) => r.musica)
    expect(new Set(nomes).size).toBe(nomes.length)
  })

  it('todas as notas dos riffs são válidas', () => {
    for (const r of RIFFS) {
      for (const [n] of r.notas) {
        if (['pausa', 'bumbo', 'caixa', 'chimbal', 'prato', 'tom'].includes(n)) continue
        expect(() => frequencia(n), `${r.musica}: ${n}`).not.toThrow()
      }
    }
  })
})
