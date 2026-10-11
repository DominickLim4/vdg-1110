// As fotos vêm de src/fotos-otimizadas (geradas por `npm run fotos` a partir da pasta fotos/).
// O Vite lista as pastas no build, então basta adicionar arquivos e publicar.

export interface Foto {
  id: string
  grande: string
  mini: string
  legenda?: string
}

const kimiGrandes = import.meta.glob<string>('/src/fotos-otimizadas/kimi/*.webp', { eager: true, query: '?url', import: 'default' })
const kimiMinis = import.meta.glob<string>('/src/fotos-otimizadas/kimi/thumbs/*.webp', { eager: true, query: '?url', import: 'default' })
const nosGrandes = import.meta.glob<string>('/src/fotos-otimizadas/nos/*.webp', { eager: true, query: '?url', import: 'default' })
const nosMinis = import.meta.glob<string>('/src/fotos-otimizadas/nos/thumbs/*.webp', { eager: true, query: '?url', import: 'default' })
const legendasArq = import.meta.glob<Record<string, string>>('/src/fotos-otimizadas/nos/legendas.json', { eager: true, import: 'default' })
const legendas: Record<string, string> = Object.values(legendasArq)[0] ?? {}

function montar(grandes: Record<string, string>, minis: Record<string, string>, comLegendas = false): Foto[] {
  return Object.keys(grandes)
    .sort()
    .map((caminho) => {
      const arquivo = caminho.split('/').pop()!
      const id = arquivo.replace(/\.webp$/, '')
      const mini = minis[caminho.replace(/\/([^/]+)$/, '/thumbs/$1')] ?? grandes[caminho]
      return { id, grande: grandes[caminho], mini, legenda: comLegendas ? legendas[id] : undefined }
    })
}

export const FOTOS_KIMI = montar(kimiGrandes, kimiMinis)
export const FOTOS_NOS = montar(nosGrandes, nosMinis, true)
