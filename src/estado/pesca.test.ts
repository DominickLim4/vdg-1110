import { describe, expect, it } from 'vitest'
import {
  TENTATIVAS_MAX,
  estadoPescaInicial,
  faixaDe,
  finalizarPesca,
  encerrarInterrompida,
  iniciarTentativa,
  pontuacaoParcial,
  melhorPontuacao,
  podeJogar,
  registrarResultado,
} from './pesca'

describe('faixaDe', () => {
  it('classifica pelos limites de pontos', () => {
    expect(faixaDe(0)).toBeNull()
    expect(faixaDe(399)).toBeNull()
    expect(faixaDe(400)).toBe('prata')
    expect(faixaDe(799)).toBe('prata')
    expect(faixaDe(800)).toBe('ouro')
    expect(faixaDe(1299)).toBe('ouro')
    expect(faixaDe(1300)).toBe('iridio')
  })
})

describe('tentativas da pesca', () => {
  it('conta a tentativa já ao iniciar, para recarregar a página não devolver a chance', () => {
    const s = iniciarTentativa(estadoPescaInicial)
    expect(s.tentativas).toEqual([0])
    expect(s.emAndamento).toBe(true)
  })

  it('registrar o resultado substitui só a tentativa em andamento', () => {
    let s = iniciarTentativa(estadoPescaInicial)
    s = registrarResultado(s, 500)
    s = iniciarTentativa(s)
    s = registrarResultado(s, 300)
    expect(s.tentativas).toEqual([500, 300])
    expect(s.emAndamento).toBe(false)
  })

  it('tentar de novo não descarta: vale a melhor pontuação', () => {
    let s = estadoPescaInicial
    for (const p of [900, 200, 450]) s = registrarResultado(iniciarTentativa(s), p)
    expect(melhorPontuacao(s)).toBe(900)
    expect(finalizarPesca(s, '2026-10-11').finalizado).toEqual({ pontos: 900, faixa: 'ouro', em: '2026-10-11' })
  })

  it('bloqueia a 4ª tentativa', () => {
    let s = estadoPescaInicial
    for (let i = 0; i < TENTATIVAS_MAX; i++) s = registrarResultado(iniciarTentativa(s), 100)
    expect(podeJogar(s)).toBe(false)
    expect(() => iniciarTentativa(s)).toThrow()
  })

  it('garante no mínimo prata ao finalizar', () => {
    const s = registrarResultado(iniciarTentativa(estadoPescaInicial), 120)
    expect(finalizarPesca(s, 'x').finalizado?.faixa).toBe('prata')
  })

  it('não deixa jogar nem refinalizar depois de finalizado', () => {
    const s = finalizarPesca(registrarResultado(iniciarTentativa(estadoPescaInicial), 1400), 'x')
    expect(s.finalizado?.faixa).toBe('iridio')
    expect(podeJogar(s)).toBe(false)
    expect(finalizarPesca(s, 'y')).toBe(s)
  })

  it('não finaliza sem nenhuma tentativa jogada', () => {
    expect(() => finalizarPesca(estadoPescaInicial, 'x')).toThrow()
  })
})

describe('tentativa interrompida', () => {
  it('mantém os pontos parciais se a página recarregar no meio', () => {
    let s = iniciarTentativa(estadoPescaInicial)
    s = pontuacaoParcial(s, 350)
    s = encerrarInterrompida(s)
    expect(s.tentativas).toEqual([350])
    expect(s.emAndamento).toBe(false)
    expect(podeJogar(s)).toBe(true)
  })

  it('pontuação parcial não mexe em tentativa já encerrada', () => {
    const s = registrarResultado(iniciarTentativa(estadoPescaInicial), 500)
    expect(pontuacaoParcial(s, 9999)).toBe(s)
  })
})
