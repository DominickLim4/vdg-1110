// Prepara as fotos para o site:
//   fotos/kimi/*  →  src/fotos-otimizadas/kimi/*.webp (+ thumbs/)
//   fotos/nos/*   →  src/fotos-otimizadas/nos/*.webp  (+ thumbs/, legendas.json)
// Converte HEIC (iPhone) com o `sips` do macOS, corrige a rotação, redimensiona,
// gera WebP e REMOVE os metadados (inclusive a localização GPS).
// Uso: npm run fotos
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, parse } from 'node:path'
import sharp from 'sharp'

const PASTAS = ['kimi', 'nos']
const ACEITAS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'])
const temp = mkdtempSync(join(tmpdir(), 'fotos-'))

function slug(nome) {
  return nome
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

let total = 0
let pulados = 0

for (const pasta of PASTAS) {
  const origem = join('fotos', pasta)
  const destino = join('src', 'fotos-otimizadas', pasta)
  const destinoMini = join(destino, 'thumbs')
  mkdirSync(destinoMini, { recursive: true })
  if (!existsSync(origem)) continue

  const arquivos = readdirSync(origem)
    .filter((a) => ACEITAS.has(parse(a).ext.toLowerCase()))
    .sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true }))

  const ids = new Map()
  for (const arquivo of arquivos) {
    const { name, ext } = parse(arquivo)
    let id = slug(name) || 'foto'
    while ([...ids.values()].includes(id)) id += '-2'
    ids.set(arquivo, id)

    const entrada = join(origem, arquivo)
    const saida = join(destino, `${id}.webp`)
    const saidaMini = join(destinoMini, `${id}.webp`)
    if (existsSync(saida) && existsSync(saidaMini) && statSync(saida).mtimeMs > statSync(entrada).mtimeMs) {
      pulados++
      continue
    }

    let fonte = entrada
    if (['.heic', '.heif'].includes(ext.toLowerCase())) {
      fonte = join(temp, `${id}.jpg`)
      execFileSync('sips', ['-s', 'format', 'jpeg', entrada, '--out', fonte], { stdio: 'ignore' })
    }

    // sharp não copia metadados para a saída por padrão: EXIF e GPS ficam para trás.
    await sharp(fonte).rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toFile(saida)
    await sharp(fonte).rotate().resize({ width: 480, height: 480, fit: 'inside', withoutEnlargement: true }).webp({ quality: 72 }).toFile(saidaMini)
    total++
    console.log(`✓ ${pasta}/${arquivo} → ${id}.webp`)
  }

  // remove do site as fotos que você apagou da pasta de origem
  const validos = new Set([...ids.values()].map((id) => `${id}.webp`))
  for (const dir of [destino, destinoMini]) {
    for (const a of readdirSync(dir)) {
      if (a.endsWith('.webp') && !validos.has(a)) {
        rmSync(join(dir, a))
        console.log(`− removida ${pasta}/${a}`)
      }
    }
  }

  // legendas: fotos/nos/legendas.json usa o nome original do arquivo como chave
  const legendasOrigem = join(origem, 'legendas.json')
  if (existsSync(legendasOrigem)) {
    const brutas = JSON.parse(readFileSync(legendasOrigem, 'utf8'))
    const porId = {}
    for (const [arquivo, legenda] of Object.entries(brutas)) {
      const id = ids.get(arquivo)
      if (id) porId[id] = legenda
      else console.warn(`! legenda para "${arquivo}", mas essa foto não existe em ${origem}`)
    }
    writeFileSync(join(destino, 'legendas.json'), JSON.stringify(porId, null, 2))
  } else {
    rmSync(join(destino, 'legendas.json'), { force: true })
  }
}

rmSync(temp, { recursive: true, force: true })
console.log(`\nPronto: ${total} foto(s) processada(s), ${pulados} já estavam prontas.`)
