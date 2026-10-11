# Handoff: Vale da Geo

Contexto para quem continuar o trabalho (você ou um assistente de código). Atualizado em 2026-10-10.

## O que é
Site-presente de aniversário (25 anos, 11/10/2026) para a Geo Froes, no tema Stardew Valley, pensado para celular e publicado no GitHub Pages. O plano completo está em `docs/plano.md` e a direção visual em `DESIGN.md`.

## Decisões do dono (não mudar sem perguntar)
- Senha do portão: pergunta "Quem é o amor da sua vida?", resposta **kiminhoca** (sem diferenciar maiúsculas e acentos), dica "termina com nhoca". Arquivo: `src/telas/Portao.tsx`.
- Pesca (presente em dinheiro): 3 tentativas; **tentar de novo NÃO descarta**, vale a **melhor** pontuação; **Prata garantida** ao finalizar. Faixas: Prata ≥400 (até R$150), Ouro ≥800 (até R$250), Irídio ≥1300 (até R$500). O valor só aparece na revelação. Regras e testes: `src/estado/pesca.ts`.
- A Pesca só libera depois dos outros 4 vales.
- Termo do Vale Transa: palavra MOTEL (depois TESAO, BEIJO…). Conteúdo picante está liberado pelo dono.
- Kimi: golden retriever, 5 meses, dourado.
- Resgates (vales, roleta, sushi) abrem direto o WhatsApp do dono: `5598984230759` (`src/conteudo/contato.ts`). O número fica visível no código público, e o dono pediu assim.
- Pesca deixada "um pouco mais fácil" a pedido (2026-10-10): faixas mantidas (400/800/1300), física aliviada em `src/jogos/pesca/motor.ts`.
- Aba "Monte seu Sushi": todas as bebidas viram Coca Zero (piada pedida pelo dono).

## Stack e comandos (verificados)
- Vite 7 + React 19 + TypeScript + motion + canvas-confetti. Fontes self-hosted: Jersey 15 (jogo) e Fraunces (papel).
- `npm run dev`: servidor local (use `-- --host` para abrir no celular pelo Wi-Fi).
- `npm test`: vitest (regras da pesca, avaliação do Termo e a simulação de calibragem da pesca).
- `npm run build`: `tsc -b` + `vite build` → `dist/`.
- `npm run fotos`: processa `fotos/kimi` e `fotos/nos` → `src/fotos-otimizadas` (HEIC via `sips`, WebP, sem EXIF/GPS).
- `npm run icones`: gera os ícones do PWA em `public/icons`.
- `node scripts/fluxos.mjs [url] [pasta]` e `node scripts/fluxos-novos.mjs [url] [pasta]`: jogam os fluxos num iPhone simulado e conferem o resultado.
- `node scripts/capturas.mjs [url] [pasta]`: percorre o site num iPhone simulado e salva screenshots. Nesta máquina o Chromium do Playwright 1.64 não está instalado. Use o executável em cache: `CHROMIUM="$HOME/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"`.
- Deploy: `.github/workflows/deploy.yml` (push na `main` → Pages). `base: './'` no Vite, então funciona em qualquer subcaminho.

## Estrutura
- `src/App.tsx`: portão → abertura → casco (HUD + tela + hotbar). Rotas por hash (`#/casa`, `#/jogo/pesca`).
- `src/estado/progresso.tsx`: estado único salvo em `localStorage` (`vale-da-geo:v1`).
- `src/telas/*`: Casa, Fliperama, Baú, Kimi, Nós, Receita, Carta, Parquinho, Sala Secreta, Portão, Abertura.
- `src/telas/sushi/*`: Monte seu Sushi (peixe → corte por gesto → montagem com prévia em CSS → servir → bebida → comanda). Dados em `dados.ts`.
- `src/telas/minijogos/*`: Acerte o Junimo, Chuva de Coca Zero, Kimi busca!, Roleta do destino (aba Minijogos do Parquinho).
- `src/conteudo/riffs.ts` + `tocarRiff` em `src/componentes/som.ts`: botão "Me surpreenda" da guitarra (8 riffs sintetizados).
- `src/jogos/*`: quiz, termo, memoria, kimi-run (canvas), pesca (motor puro em `motor.ts`).
- `src/sprites/sprites.ts`: toda a pixel art, desenhada como texto.
- `src/conteudo/*`: textos editáveis (carta.md, frases, perguntas do quiz, vales, conquistas, bilhete da sala secreta).
- `?dev=1` na URL mostra um painel para desbloquear vales e zerar a pesca ou o progresso.

## Pendências do dono
1. **Carta**: escrever em `src/conteudo/carta.md` e apagar a linha `RASCUNHO`.
2. **Bilhete da Sala Secreta**: `src/conteudo/sala-secreta.ts` (trocar o texto e pôr `rascunho: false`).
3. **Fotos**: colocar em `fotos/kimi/` e `fotos/nos/`, rodar `npm run fotos` e fazer commit de `src/fotos-otimizadas`.
4. Revisar as frases em `src/conteudo/frases.ts` (escritas pelo assistente).
5. Criar o repositório, ativar Pages (Settings → Pages → Source: GitHub Actions) e fazer push.
6. Antes de mandar o link: abrir com `?dev=1` e usar "Zerar TUDO" no aparelho em que você testou.

## Estado da verificação (2026-10-10)
- `npm test`: 15 testes passando (regras da pesca, Termo, calibragem).
- `npm run build`: ok (~141 kB de JS gzip).
- `scripts/fluxos.mjs` (iPhone 13 simulado): 9/9 fluxos passando, sem erros no console. Cobre quiz 10/10 → Vale Date, MOTEL → Vale Transa, memória → Abraços, colisão no Kimi Run, pesca de 60 s, recarga no meio da 2ª tentativa, finalização com a melhor pontuação e apagar as 25 velas.
- Layout medido em 320, 360, 390 e 430px: hotbar cabe, sem rolagem horizontal, teclado do Termo visível inteiro.
- Script de fotos validado com JPEG com GPS e HEIC: saída sem EXIF, 1600px + miniaturas de 480px, legendas mapeadas. As fotos de teste já foram removidas.
- **Não verificado:** a vitória do Kimi Run (15 petiscos) não foi jogada por automação, só a colisão; o microfone das velas não foi testado (sem microfone no ambiente; o modo com o dedo passou); não houve teste em aparelho físico.

## Log de trabalho
- 2026-10-10: base, design system Stardew, 5 jogos, Baú, galerias, Receita, Carta com bolo/microfone, Parquinho, Sala Secreta, script de fotos, workflow de deploy.
- 2026-10-10: fonte trocada de Pixelify Sans para Jersey 15 (legibilidade); corrigidos layout do Termo e do Kimi Run, sprite do d20, keys do AnimatePresence no quiz (o rodapé não aparecia) e largura da hotbar em 360px.
- 2026-10-10 (rodada 2): resgate direto no WhatsApp do dono; pesca mais fácil (simulação p50: iniciante 425→650, médio 900→1250, bom 1300→1775); "Me surpreenda" na guitarra; 4 minijogos no Parquinho (abas Minijogos/Brinquedos); aba Monte seu Sushi (8º slot da hotbar + cômodo Cozinha na Casa); conquista Sushiwoman. Corrigido bug do Junimo (sorteio dentro de updater do setState não spawnava no StrictMode).
- Verificação da rodada 2: 17 testes, build ok, `fluxos.mjs` 9/9 e `fluxos-novos.mjs` 12/12 sem erros no console; hotbar de 8 slots cabe em 320px (slot 34px) e 360px (39px).
- 2026-10-10 (rodada 3): 146 fotos do Kimi processadas (442 MB → 22 MB, sem EXIF); Kimidex virou grade quadrada em ordem; Parquinho ficou mais fácil de achar (rótulo "Parquinho" sob o d20 do HUD, que balança, e atalho no fim do Fliperama). O dono não tinha encontrado o Parquinho.
- 2026-10-10 (rodada 4): guitarra ampliada em `src/telas/minijogos/Guitarra.tsx` + `src/componentes/guitarra-som.ts`: 4 timbres (distorcida, limpa, 8-bit, violão), 8 acordes, bateria com 5 peças, 3 efeitos (alavanca, microfonia, chug), repertório de 15 riffs com botão de parar. Riffs novos: Crazy Train, Smells Like Teen Spirit, Eye of the Tiger, Another One Bites the Dust, Day Tripper, Zombie, The Final Countdown. Verificado por contagem de osciladores agendados (sem áudio real no ambiente).
- 2026-10-10 (rodada 5): 33 fotos de Nós processadas (77 MB → 3,8 MB, sem EXIF); polaroids enquadradas mais para cima (`object-position: 50% 28%`) e ritmo do diário 1 grande + 2 pequenas (`3n+1`), sem buracos. O retrato do save é a 1ª foto de `fotos/nos` em ordem alfabética.
- 2026-10-10 (rodada 6): easter egg pedido pelo dono: escolher "Nigiri" na montagem do sushi abre o pop-up "naoooooooo vida naoooooooooo" (texto exato) com som de erro; o nigiri continua escolhido. Formato inicial passou a ser Uramaki para que o nigiri seja escolha ativa. Coberto em `fluxos-novos.mjs`.
- 2026-10-11 (pré-publicação): bilhete da Sala Secreta finalizado (`rascunho: false`); carta escrita pelo dono. Cópia limpa do repositório (466 arquivos, 27 MB, sem fotos originais nem mood-board): `npm ci` + 18 testes + build ok. Build servido em subcaminho `/vdg-1110/`: `fluxos.mjs` 9/9 e `fluxos-novos.mjs` 14/14 sem erros. Persistência verificada: progresso fica salvo por aparelho/navegador (reabrir não reseta); outro aparelho começa do zero; `?dev=1` → Zerar TUDO volta ao portão.
- Ainda não existe repositório git nem deploy; aguardando o dono autorizar a criação do repositório público.
