# geofroes-niver

## Project context
Purpose: site-presente de aniversário (25 anos, 11/10/2026) para a Geo Froes, no tema Stardew Valley, com minijogos que desbloqueiam vales-presente.
Audience: uma pessoa, no celular. Textos em português do Brasil.
Observed stack: Vite 7 + React 19 + TypeScript + motion; estático no GitHub Pages via Actions. Plano em docs/plano.md; contexto de continuação em docs/handoff-codex.md.

Read the existing README and implementation before filling gaps. This scaffold records unknowns rather than inventing requirements.

## Local sources of truth
- Read DESIGN.md before UI work. The visual identity belongs to this project.
- Read docs/architecture.md for significant boundary, API or data changes.
- Preserve more specific instructions in subdirectories and existing team conventions.
- Keep this file focused on project facts. Shared personal quality defaults load globally; do not copy global skills into this repository.

## Observed commands
Verificados em 2026-10-10:
- `npm run dev`: servidor local.
- `npm test`: vitest (regras da pesca, Termo, calibragem).
- `npm run build`: `tsc -b && vite build`.
- `npm run fotos`: processa fotos/ → src/fotos-otimizadas (remove EXIF/GPS).
- `node scripts/fluxos.mjs` e `node scripts/capturas.mjs`: testes de navegador num iPhone simulado (dev server na porta 5199; `CHROMIUM=` aponta o executável se o Playwright não tiver o seu).

## Completion
Verify the requested behavior with relevant checks. Document unresolved dependencies or environment limitations. Update the design or architecture document when a decision actually changes.
