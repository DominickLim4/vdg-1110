import { describe, expect, it } from 'vitest'
import { avaliarPalpite, normalizar } from './regras'

describe('normalizar', () => {
  it('remove acentos e põe em maiúsculas', () => {
    expect(normalizar('tesão')).toBe('TESAO')
    expect(normalizar(' Beijo ')).toBe('BEIJO')
  })
})

describe('avaliarPalpite', () => {
  it('marca certas, presentes e ausentes', () => {
    expect(avaliarPalpite('METAL', 'MOTEL')).toEqual(['certa', 'presente', 'certa', 'ausente', 'certa'])
  })

  it('não conta a mesma letra duas vezes', () => {
    // MOTEL tem um O só: o primeiro O já está certo, o segundo é ausente
    expect(avaliarPalpite('MOOOO', 'MOTEL')).toEqual(['certa', 'certa', 'ausente', 'ausente', 'ausente'])
    // letra repetida no palpite, só uma presente na resposta
    expect(avaliarPalpite('LLAAA', 'MOTEL')).toEqual(['presente', 'ausente', 'ausente', 'ausente', 'ausente'])
  })

  it('prioriza a posição certa antes de marcar presente', () => {
    expect(avaliarPalpite('EEEEL', 'MOTEL')).toEqual(['ausente', 'ausente', 'ausente', 'certa', 'certa'])
  })
})
