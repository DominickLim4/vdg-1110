# Design: Vale da Geo

Status: direção aprovada em 2026-10-10 (ver docs/plano.md).

## Produto e público
- Site-presente de aniversário (25 anos, 11/10/2026) para a Geo Froes. Uma única usuária, no celular.
- Ela: estudante de medicina (psiquiatria), gamer, ama Stardew Valley, Coca Zero, sushi, rock, Flamengo, golden retrievers, desenha, RPG, academia. Humor forte, pouca frescura.
- Ação principal: jogar minijogos, desbloquear vales, guardar no Baú, ler a carta.

## Evidência
- `mood-board/` (fora do git): azulejo cobalto, banheiro verde-garrafa, latão, madeira quente; pinturas guache com flores rosa e lilás e margaridas sobre azul; journal; bichinhos.
- Pedido explícito: tema principal Stardew Valley; quiz "como se ela estivesse dentro do jogo"; paleta calma e harmônica, sem cores gritantes.

## Direção visual
**A interface do Stardew Valley, tranquila.** Molduras de madeira com pergaminho, fonte pixel e itens com estrelas de qualidade, sobre um vale calmo (céu claro, lagoa com ondas, bolhas subindo).
- A ousadia fica num lugar só: as **molduras de madeira em pixel** (caixas de diálogo, hotbar, cartões). O resto é quieto.
- Ilustrações em pixel art (sprites desenhados em código, `src/sprites`), nunca emoji.
- A carta e as frases usam serifa (Fraunces) sobre papel: o momento "humano" contrasta com a camada de jogo.

## Tokens (src/estilo/tokens.css)
| Token | Valor | Papel |
|---|---|---|
| `--madeira-escura` | #4A2511 | contorno externo das molduras |
| `--madeira` | #8A4A20 | moldura |
| `--madeira-clara` | #C47A3A | brilho da moldura |
| `--pergaminho` | #F9DDA4 | fundo de caixas |
| `--pergaminho-claro` | #FFF1D2 | fundo de conteúdo / papel |
| `--tinta` | #3A2214 | texto (≈12:1 sobre pergaminho) |
| `--ceu` | #BFE7F2 | céu |
| `--lagoa` | #5FB3CF | água / ondas |
| `--grama` | #78B159 | natureza |
| `--rosa` | #F2A6B6 | carinho |
| `--lilas` | #B8A6E3 | magia |
| `--girassol` | #F5C242 | ouro / destaque |
| `--bordo` | #8C2B3A | lacre, Vale Transa, erro |
| estrelas | prata #D7DEE8 · ouro #F5C242 · irídio #A15BE0 | qualidade |

Tipografia: **Jersey 15** (interface, jogos, HUD; peso único, `font-synthesis: none`) e **Fraunces** (carta, frases). Escala em tokens `--t-14…--t-40` (≈17/21/26/32/45px).
- 2026-10-10: Pixelify Sans descartada após render: G parecia B, C parecia O e 5 parecia S. Jersey 15 venceu na comparação lado a lado.

Layout: tela cheia de app (`100dvh`). HUD no topo, conteúdo rolável no meio, hotbar fixa embaixo com safe-area. Largura máxima de 480px; no desktop, a coluna fica centralizada sobre o vale.

Movimento: ondas e bolhas lentas de fundo; transição de tela com mola; resposta física a toque. `prefers-reduced-motion` desliga ondas e bolhas e reduz as transições a fade.

## Comportamento e validação
- Larguras-alvo: 360, 390 e 430px. Toque mínimo de 44px. Nada depende de hover.
- Sensores (microfone, movimento) são opcionais e sempre têm alternativa por toque.
- Registro de renders verificados: ver docs/handoff-codex.md.
