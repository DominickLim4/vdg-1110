export type Marca = 'certa' | 'presente' | 'ausente'

export const TAMANHO = 5
export const CHANCES = 6

// A primeira é a palavra oficial; as outras entram se ela errar e tentar de novo.
export const PALAVRAS = ['MOTEL', 'TESAO', 'BEIJO', 'NOITE', 'CORPO', 'PELES', 'COLAR']

export function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z]/g, '').toUpperCase()
}

export function avaliarPalpite(palpite: string, resposta: string): Marca[] {
  const marcas: Marca[] = Array(resposta.length).fill('ausente')
  const sobra = new Map<string, number>()
  for (let i = 0; i < resposta.length; i++) {
    if (palpite[i] === resposta[i]) marcas[i] = 'certa'
    else sobra.set(resposta[i], (sobra.get(resposta[i]) ?? 0) + 1)
  }
  for (let i = 0; i < resposta.length; i++) {
    if (marcas[i] === 'certa') continue
    const n = sobra.get(palpite[i]) ?? 0
    if (n > 0) {
      marcas[i] = 'presente'
      sobra.set(palpite[i], n - 1)
    }
  }
  return marcas
}
