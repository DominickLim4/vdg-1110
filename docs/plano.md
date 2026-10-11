# Vale da Geo: plano completo

> Site-presente de aniversário (25 anos, 11/10) para a Geo Froes.
> Status: **proposta**. Os itens marcados com ❓ estão na seção 12 e dependem de você.

---

## 0. Conceito em uma frase

**"Vale da Geo": um jogo aconchegante no estilo Stardew Valley em que cada fase desbloqueia um *vale* (Vale Date, Vale Transa…).**

O trocadilho é a espinha do projeto: *Valley* de Stardew + *vale* de presente. A Geo não "navega num site": ela **carrega um save**, anda por uma casa ilustrada com cômodos e passagens secretas, joga, ganha vales com estrelas de qualidade (prata, ouro, irídio) e guarda tudo num **Baú**.

Pra parecer app e não site:
- abertura de jogo (tela de save), sem cabeçalho nem rodapé de site;
- **hotbar** no rodapé, igual ao inventário do Stardew, como navegação principal;
- HUD no topo com data ("Outono 11 · Ano 25"), estrelas acumuladas e uma barra de energia em forma de **lata de Coca Zero**;
- instalável na tela inicial (PWA), abrindo em tela cheia sem a barra do navegador.

---

## 1. Requisitos e decisões técnicas

| Requisito | Decisão |
|---|---|
| Rodar no GitHub Pages | Site estático. Build com **Vite** e deploy por **GitHub Actions** (`actions/deploy-pages`). |
| Mobile em primeiro lugar | Layout pensado para 360–430px. Desktop mostra o "celular" centralizado sobre o fundo animado. |
| Cara de app, animações fluidas | **React + TypeScript + Motion (Framer Motion)** para transições entre telas, gestos de arrastar/deslizar e animações de layout. Jogos em `<canvas>` com loop próprio. |
| "Coloco as fotos numa pasta e elas aparecem" | `import.meta.glob` do Vite lista a pasta **na hora do build**, então não precisa de manifesto manual. Um script otimiza as fotos antes. |
| Sem servidor | Progresso salvo em `localStorage`. O resgate de vales usa o compartilhamento nativo do celular (WhatsApp etc.). |

Por que não HTML puro: as galerias dependem de listar pastas automaticamente e são 7 telas com estado compartilhado (vales, tentativas, conquistas). O Vite resolve as duas coisas sem servidor e continua gerando arquivos estáticos para o Pages.

**Dependências (mínimas):** `react`, `react-dom`, `motion`, `canvas-confetti`, fontes via `@fontsource/*` (servidas pelo próprio site, sem depender do Google). Dev: `vite`, `typescript`, `vitest`, `sharp` (script de fotos), `@playwright/test`.

**Sem roteador:** as abas são estado + `location.hash` (`#/kimi`). Assim, recarregar a página nunca dá 404 no Pages.

---

## 2. Direção visual (tirada do mood-board)

### O que o mood-board mostra
- **Futura casa:** azulejo português cobalto, banheiro verde-garrafa, latão/dourado, madeira quente, creme, plantas, arcos, mosaico de piscina em ondas.
- **Pintura:** guache chapado, flores rosa e lilás com folhas verde-escuras, margaridas brancas sobre azul cobalto, girassóis, pôr do sol laranja e rosa.
- **Vision board / estudo:** journal, marca-texto, "hot girls study hard" em bordô, academia, rosa suave.
- **Bichinhos:** lontras, filhotes, golden.
- **Pastas:** Rpg, mine (Minecraft), Psicanálise, Humor, Tattoos (girassol), "Coca Cola Girl".

### Linguagem: "pintura guache + azulejo + pixel"
1. **Formas pintadas** (manchas orgânicas, flores chapadas, ondas) dão a calma e a cor.
2. **Padrão de azulejo** (SVG) como textura da hotbar, das molduras e da carta. É a assinatura visual.
3. **Detalhes em pixel** só na camada de jogo: estrelas de qualidade, HUD, pontuação, caixas de diálogo do quiz.

Isso deixa o resultado com cara de produto caro: duas linguagens bem definidas (editorial pintado + jogo pixel) e nada de "site genérico colorido".

### Paleta (calma, colorida e harmônica)

| Token | Hex | Papel |
|---|---|---|
| `--papel` | `#FBF6EC` | Fundo principal (creme) |
| `--tinta` | `#1E2A4A` | Texto principal (≈13:1 sobre papel) |
| `--azulejo` | `#2C4A9E` | Cor primária, botões, hotbar (≈7,5:1 sobre papel) |
| `--lagoa` | `#86C2D0` | Ondas, bolhas, fundos de cartão |
| `--salvia` | `#9CC5A1` | Natureza, sucesso suave |
| `--esmeralda` | `#2F6B5A` | Texto de sucesso, folhas (≈6:1) |
| `--rosa` | `#F3B6C2` | Flores, carinho, fundos |
| `--lilas` | `#B8A6E3` | Magia, irídio claro |
| `--girassol` | `#F2C65A` | Destaque, estrela de ouro |
| `--bordo` | `#7A2335` | Acento forte (lacre da carta, Vale Transa), ≈9:1 |
| Estrelas | prata `#C9D3DE` · ouro `#E6B33A` · irídio `#A35BD6` | Qualidade dos presentes |

Vermelho Coca e rubro-negro do Flamengo aparecem **só** em momentos pontuais (lata, confete do Mengão), para não brigar com a paleta calma.

### Tipografia (3 famílias, todas com licença OFL)
- **Fraunces**: títulos e a carta (serifa macia, com personalidade, editorial).
- **Nunito**: interface e textos (arredondada, amigável, muito legível no celular).
- **Pixelify Sans**: HUD, pontuação e estrelas (o toque Stardew).

### Movimento
- Fundo vivo: 3 camadas de **ondas SVG** se movendo devagar, mais **bolhas** subindo (as bolhas da Coca Zero).
- Troca de aba: a "porta" do cômodo abre (escala e máscara circular a partir do slot tocado na hotbar).
- Microinterações com mola em todo toque (botões "afundam" e voltam).
- Paralaxe leve com a inclinação do celular (opcional; no iOS precisa de permissão, que é pedida dentro do Parquinho).
- `prefers-reduced-motion`: ondas param, transições viram fade e os jogos continuam funcionando.
- Sons sintetizados (Web Audio, sem arquivos): "plim" de moeda, abrir baú, estourar bolha. Botão de mudo no HUD; começa sem som até o primeiro toque.

---

## 3. Estrutura de telas e navegação

```
[Abertura: tela de save] ──► [Casa (início)]
                                 │
Hotbar (fixa no rodapé, 7 slots):
 🏠 Casa │ 🕹️ Fliperama │ 🎁 Baú │ 🐶 Kimi │ 📸 Nós │ 💊 Receita │ 💌 Carta
                                 │
 Parquinho (diversão) = cômodo da Casa + atalho no HUD (ícone de dado)
```

A hotbar tem 7 slots (como os 12 do Stardew, só que menos). O slot ativo ganha a moldura vermelha clássica do inventário do jogo. "Coisas divertidas" é o 8º destino, acessado pela Casa e por um botão de dado no HUD, para a hotbar não ficar apertada em telas de 360px.

---

## 4. Telas em detalhe

### 4.1 Abertura: "Carregar jogo"
1. Tela escura com ondas. Logo **"Vale da Geo"** pintado se forma.
2. Card de save no estilo Stardew: retrato (foto dela, ou ilustração), `Geo Froes · Fazenda Coração · Outono 11, Ano 25 · Tempo de jogo: 25 anos`.
3. Botão **"Carregar"**: barra de loading com textos de zoeira ("Gelando Coca Zero…", "Afinando a guitarra…", "Escondendo passagens secretas…").
4. Transição para a Casa. Nas próximas visitas a abertura é pulada (com botão "ver de novo").

❓ Opcional: se aberto antes de 11/10 00:00, mostra contagem regressiva.

### 4.2 Casa (início)
Um corte lateral ilustrado de uma casa (tipo casa de bonecas), feito em SVG com a paleta. Cada cômodo é um botão:
- **Sala de jogos**: abre o Fliperama
- **Quarto do Kimi**: abre a galeria do Kimi
- **Parede de fotos**: abre Nós
- **Consultório da Dra. Geo**: abre a Receita do dia
- **Escrivaninha com envelope lacrado**: abre a Carta (o envelope pulsa até ser aberto)
- **Playground no quintal**: abre o Parquinho
- **Estante de livros**: segure por 2s e ela desliza, revelando a **Sala Secreta** (ela ama passagem secreta)

**Objetos gigantes** espalhados pela casa (uma lata de Coca Zero do tamanho da porta, um d20 gigante, um nigiri enorme no sofá) reagem ao toque. Uma bonequinha da Geo andando pela casa dá a escala; a piada do "baixinha" é visual e carinhosa.

HUD fixo: data · ⭐ estrelas · 🥤 energia (a lata esvazia conforme ela joga e enche quando ela "bebe" a Coca no Parquinho; é só piada, não bloqueia nada).

### 4.3 Fliperama: minijogos que desbloqueiam presentes

Uma parede de **máquinas de fliperama**, cada uma com o vale que libera. Vales não conquistados aparecem como cartão-silhueta com cadeado. Os 4 primeiros jogos ficam liberados em qualquer ordem. **A Pesca (dinheiro) só abre depois dos outros 4.** É o "chefão final", o que cria um clímax.

Regra geral: nos jogos 1 a 4 **não existe derrota definitiva**. Perdeu, tenta de novo com uma mensagem engraçada. Os presentes são dela de qualquer jeito; o jogo é o ritual de desbloqueio.

| # | Jogo | Inspiração | Mecânica no celular | Condição | Presente |
|---|---|---|---|---|---|
| 1 | **Quiz do Vale** | Quiz Stardew (obrigatório) | 10 perguntas em caixa de diálogo do Stardew com retrato do NPC, 4 alternativas grandes | ≥ 7 acertos | 💙 **Vale Date** (em qualquer lugar) |
| 2 | **Termo Proibido** | Termo/Wordle PT-BR | Palavra de 5 letras, 6 chances, teclado na tela com Ç e acentos ignorados | Acertar a palavra (1ª palavra: **MOTEL**; se errar: BEIJO, NOITE, CORPO) | ❤️‍🔥 **Vale Transa** |
| 3 | **Memória do Cheirinho** | Jogo da memória | 16 cartas (8 pares): sushi, Coca Zero, d20, guitarra, haltere, estetoscópio, golden, girassol. Verso com padrão de azulejo | Formar todos os pares | 🤗 **Sessão de Abraços e Cheiros** |
| 4 | **Kimi Run** | Dino do Chrome | Toque para pular, toque duplo para pulo duplo. Kimi corre pegando petiscos e desviando de banheira, aspirador e gato | Pegar 20 petiscos | 🐾 **Passeio com Kimi** |
| 5 | **Pesca do Sushi** | Minijogo de pesca do Stardew | Ver 4.3.1 | Pontuação + 3 tentativas | ⭐ Presente de **Prata / Ouro / Irídio** |

**Quiz:** banco de ~20 perguntas, 10 sorteadas por partida. Exemplos: "Qual o nome verdadeiro do Mago?" (Rasmodius); "O que o Prefeito Lewis perdeu?" (cueca roxa da sorte); "Onde mora o Krobus?" (esgoto); "Quem cuida do Centro Comunitário?" (Junimos). **Toda resposta será conferida na Stardew Valley Wiki oficial antes de entrar no jogo**, porque ela vai saber se tiver erro. Acertou: "plim" e coração subindo. Errou: o NPC faz cara feia e explica a resposta certa.

#### 4.3.1 Pesca do Sushi: o jogo dos presentes em dinheiro

**Mecânica** (fiel ao Stardew, adaptada para um dedo):
- Medidor vertical à direita. Um peixe sobe e desce de forma errática.
- **Segurar a tela** faz a barra verde subir; soltar faz ela cair (com gravidade e quique).
- Com o peixe dentro da barra, o progresso enche; fora dela, esvazia.
- Progresso cheio = peixe pego. Ele vira um **nigiri** que voa para a bandeja (piada do sushi).

**Uma tentativa = 60 segundos** pescando quantos peixes conseguir.

| Peixe | Dificuldade | Pontos |
|---|---|---|
| Sardinha | fácil | 50 |
| Salmão | média | 100 |
| Atum | difícil | 150 |
| **Peixe Lendário** (raro, ~10%) | muito difícil | 300 |
| Bônus "PERFEITO!" (peixe nunca saiu da barra) | – | ×1,5 |

**Faixas** (calibradas em playtest; números iniciais):

| Pontos | Presente (oculto até o final) |
|---|---|
| ≥ 400 | ⭐ **Presente de Prata** (estrela prateada) |
| ≥ 800 | ⭐ **Presente de Ouro** (estrela dourada) |
| ≥ 1300 | ⭐ **Presente de Irídio** (estrela roxa brilhante) |

Antes de jogar ela vê a tabela de pontos com **só as estrelas e os nomes**, sem valor.

**Fluxo das 3 tentativas** (máquina de estados testada):
```
PRONTA ─► JOGANDO (60s) ─► RESULTADO
                             ├─ [Finalizar e aceitar este presente] ─► REVELAÇÃO ─► TRANCADO
                             └─ [Tentar de novo] (se restar tentativa) ─► JOGANDO
3ª tentativa terminou ─► só "Finalizar" ─► REVELAÇÃO ─► TRANCADO
```
- Na tela de resultado: pontuação, estrela conquistada (ou "nenhuma estrela ainda"), tentativas restantes ●●○.
- **Tentar de novo descarta o resultado atual** (tensão de "Topa ou Não Topa"). ❓ alternativa: vale a melhor das 3.
- **Revelação:** baú do Stardew abre, a estrela brilha e aí aparece o valor: *"Presente de Ouro: um presente de até R$250 escolhido por você"*.
- Depois de finalizado, o jogo fica trancado (salvo em `localStorage`; recarregar não reseta).
- ❓ Piso: se ela finalizar abaixo de 400, recomendo que a 3ª tentativa garanta pelo menos Prata, para não terminar o aniversário sem presente.

### 4.4 Baú (inventário de vales)
- Grade estilo inventário Stardew. Cada vale vira um **item** com ícone pintado, estrelas de qualidade e um tooltip com descrição divertida (ex.: *Vale Date: "Válido em qualquer lugar do mundo. Inclui motorista particular e paciência infinita na escolha do restaurante."*).
- Tocar abre o **cartão do vale** em tela cheia: frente pintada, verso com "termos e condições" engraçados e um número de série.
- Botão **"Resgatar"**: compartilhamento nativo do celular com texto pronto (*"Quero resgatar meu Vale Passeio com Kimi 🐾"*); sem compartilhamento nativo, abre `wa.me/?text=…`. O vale fica marcado como "resgatado" (carimbo), mas continua no baú.
- Conquistas extras ficam numa aba do Baú: "Abriu a carta", "Achou a Sala Secreta", "Viu todas as fotos do Kimi", "PERFEITO na pesca".

### 4.5 Kimi
- **Kimidex**: grade em mosaico das fotos. Tocar abre tela cheia com deslizar entre fotos, pinça para zoom e duplo toque para "❤️".
- Cada foto ganha uma "ficha" brincalhona gerada de forma determinística (mesma foto, mesma ficha): `Fofura 99 · Caos 87 · Fome ∞`.
- Botão **"Kimi aleatório"** sorteia uma foto com animação de cartinha virando.
- Estado vazio (antes das fotos): "O Kimi está se arrumando pras fotos 🐶".

### 4.6 Nós
Estética de **journal / scrapbook** (ela tem uma pasta "journal" com 215 pins):
- Páginas de caderno com fotos tipo polaroid, fita adesiva, adesivos (girassol, d20, sushi) e legendas manuscritas.
- Deslizar vira a página com efeito de dobra.
- Modo "pilha": arrastar a polaroid de cima para o lado e jogar fora, revelando a próxima.
- Legendas opcionais em `fotos/nos/legendas.json` (`{"IMG_1234.jpg": "aquele dia do sushi"}`).

### 4.7 Receita do dia (frases de motivação)
Gancho: ela faz medicina e ama psiquiatria. A tela é um **receituário**:
```
Dra. Geovanna Froes · Psiquiatria do Coração · CRM 25-ANOS
Uso contínuo.
Prescrevo: "Você não está atrasada. Você está carregando um mundo, e mesmo assim tá indo."
Posologia: 1 dose ao acordar, com Coca Zero gelada.
```
- **Dose do dia** fixa pela data (todo dia uma diferente, se ela voltar ao site).
- Botão **"Nova dose"**: a folha é arrancada do bloco e a próxima aparece.
- Categorias em abas de remédio: 🩺 Estudo/Med · 🏋️ Academia · 💪 Autoestima · 😂 Zoeira · 🎲 RPG ("Você tem vantagem em todos os testes hoje").
- ~60 frases em `src/conteudo/frases.ts`. Eu escrevo uma primeira versão e você revisa.

### 4.8 Carta de aniversário (a tela mais caprichada)
1. **Envelope** creme com borda de azulejo e **lacre de cera bordô** com "G". Instrução: *"Arraste para romper o lacre"*. O lacre racha com partículas.
2. A carta **desliza para fora e se desdobra** (3 dobras em 3D).
3. O texto aparece **parágrafo a parágrafo** conforme ela rola, em Fraunces, com ilustrações pintadas nas margens (girassol, golden, nigiri).
4. Assinatura manuscrita no fim (você pode me mandar foto da sua assinatura).
5. Depois da assinatura: **bolo com 25 velas**. Ela **sopra no microfone** para apagar (permissão pedida só aqui). Sem permissão, apaga deslizando o dedo sobre as velas. Ao apagar a última: confete, "FELIZ 25, GEO" gigante e o botão "ler de novo".
6. ❓ Música opcional: você coloca um `.mp3` (um rock que ela ama) em `public/audio/` e ele toca baixinho na carta, com botão de pausa.

O texto fica em `src/conteudo/carta.md`. **Você escreve.** Até lá, a tela mostra um texto marcado claramente como rascunho.

### 4.9 Parquinho (coisas divertidas)
Uma grade de "brinquedos", cada um uma interação curta. Tudo funciona com toque; sensores são bônus.

| Brinquedo | Interação |
|---|---|
| 🥤 **Coca Zero** | Toque segurando (ou chacoalhe o celular, se permitir o sensor) para agitar. A tampa estoura e bolhas tomam a tela. Enche a energia do HUD. |
| 🫧 **Plástico-bolha infinito** | Estourar bolhas, com som e contador. |
| 🐕 **Golden pra fazer carinho** | Esfregar o dedo: o rabo abana, corações sobem e a barra de amizade do Stardew enche. |
| 🎲 **D20 do Destino** | Arremessar o dado (deslizar). Crítico 20: confete e "SUCESSO CRÍTICO". 1: "falha crítica, tome uma Coca e tente de novo". Cada número tem uma frase. |
| 🎨 **Ateliê** | Pintura com o dedo usando a paleta das pinturas dela. Botão "salvar desenho" (baixa PNG). |
| 🎸 **Air guitar** | 4 pads de acordes de rock (Web Audio) + bateria. |
| 🔴⚫ **Mengão** | Tocar solta confete rubro-negro e um "MENGÃÃÃO" com tremida de tela. Contador de "gols". Sem escudo oficial, só as cores. |
| 🔍 **Modo Baixinha** | Liga e todos os objetos da Casa ficam gigantes. |

P0 = os 5 primeiros; P1 = os demais.

### 4.10 Sala Secreta (easter egg)
Revelada pela estante da Casa. Um cômodo escondido com luz quente e um bilhete secreto seu (❓ texto seu) e a conquista "Achou a passagem secreta". Também dá pra esconder pistas: um livro na estante com a palavra do Termo de cabeça para baixo.

---

## 5. Estado, progresso e persistência

Um único objeto em `localStorage`, versionado:
```ts
// chave: "vale-da-geo:v1"
{
  aberturaVista: boolean,
  vales: { date, transa, abracos, kimi: { desbloqueadoEm?: string, resgatadoEm?: string } },
  pesca: { tentativasUsadas: 0|1|2|3, resultadoAtual?: number, finalizado?: { pontos, faixa: "prata"|"ouro"|"iridio", em } },
  conquistas: string[],
  estrelas: number,
  somAtivo: boolean
}
```
- Leitura e escrita com `try/catch`. Se o armazenamento falhar (aba anônima), o site funciona e só não guarda progresso.
- **Limitação honesta:** o progresso é por aparelho/navegador. Se ela jogar no celular e abrir no notebook, começa do zero. Para presente de um dia, aceitável.
- **Modo admin** para você testar: `?dev=1` mostra botão para resetar tudo e desbloquear jogos. Antes de mandar o link para ela, você limpa o seu progresso.

---

## 6. Estrutura do projeto

```
geofroes-niver/
├── index.html
├── vite.config.ts            # base: '/<nome-do-repo>/'
├── package.json
├── .github/workflows/deploy.yml
├── public/
│   ├── manifest.webmanifest  # PWA: nome, ícone, cores, display standalone
│   ├── icons/
│   ├── robots.txt            # Disallow: /
│   └── audio/                # (opcional) música da carta
├── fotos/                    # ← VOCÊ COLOCA AS FOTOS ORIGINAIS AQUI (não vão pro GitHub)
│   ├── kimi/
│   └── nos/  (+ legendas.json opcional)
├── scripts/
│   └── preparar-fotos.mjs    # converte HEIC, redimensiona, gera WebP, remove EXIF/GPS
├── src/
│   ├── main.tsx, App.tsx
│   ├── estilo/               # tokens.css (paleta, tipografia, espaçamentos), globais
│   ├── componentes/          # Hotbar, HUD, Estrela, CartaoVale, Botao, Ondas, Bolhas, Lightbox
│   ├── telas/                # Abertura, Casa, Fliperama, Bau, Kimi, Nos, Receita, Carta, Parquinho, SalaSecreta
│   ├── jogos/
│   │   ├── quiz/  termo/  memoria/  kimi-run/  pesca/
│   │   └── comum/            # loop de canvas, input de toque, sons
│   ├── estado/               # store + persistência + máquina de estados da pesca
│   ├── conteudo/             # carta.md, frases.ts, perguntas-stardew.ts, vales.ts
│   └── fotos-otimizadas/     # gerado pelo script (kimi/, nos/), é o que vai pro site
└── mood-board/               # referência; fica fora do git (tem dados do Pinterest dela)
```

---

## 7. Como adicionar fotos (seu fluxo)

1. Arraste as fotos para `fotos/kimi/` e `fotos/nos/` (JPG, PNG ou **HEIC do iPhone**, tudo serve). **As pastas já estão criadas.**
2. Rode `npm run fotos`. O script:
   - converte HEIC para JPEG com o `sips` nativo do macOS;
   - redimensiona (1600px para tela cheia, 480px para miniatura) e gera WebP;
   - **remove metadados**, inclusive a **localização GPS** (importante num site público);
   - salva em `src/fotos-otimizadas/`.
3. Faça commit e push. O GitHub Actions publica e as fotos aparecem sozinhas.

---

## 8. Privacidade (leia isto)

GitHub Pages é **público**: qualquer pessoa com o link vê as fotos e os vales, inclusive o Vale Transa. Com plano grátis, nem com repositório privado o site fica privado. Mitigações:
- Nome de repositório e URL discretos (ex.: `usuario.github.io/vdg-1110/`), nada de "geo-froes" na URL.
- `<meta name="robots" content="noindex">` + `robots.txt` para não aparecer no Google.
- ❓ **Portão de entrada**: uma pergunta que só ela sabe responder ("Qual o nome do primeiro boss que a gente matou?"). **Aviso honesto:** é verificação no navegador e esconde o conteúdo de curiosos, mas não é segurança de verdade (quem souber programação consegue ler os arquivos).
- EXIF/GPS removido das fotos (seção 7).
- `mood-board/` e `fotos/` (originais) no `.gitignore`.

---

## 9. Deploy no GitHub Pages

1. Criar repositório e fazer push.
2. Em *Settings → Pages → Source*, escolher **GitHub Actions**.
3. O workflow `deploy.yml` faz `npm ci → npm run build → upload-pages-artifact → deploy-pages` a cada push na `main`.
4. `vite.config.ts` com `base: '/<nome-do-repo>/'` para os caminhos funcionarem.
5. Teste no seu celular pela URL final antes de mandar para ela.

---

## 10. Qualidade

**Mobile e iOS Safari:**
- `100dvh` e `env(safe-area-inset-*)` (notch e barra inferior do iPhone);
- `touch-action: manipulation` (sem zoom de duplo toque) e `overscroll-behavior: none` nos jogos (sem "puxar para recarregar" no meio da pesca);
- áreas de toque ≥ 44px; nada depende de hover;
- `navigator.vibrate` não existe no iOS, então vibração só no Android e como bônus;
- áudio só depois do primeiro toque (regra do iOS);
- sensores (giroscópio, microfone) sempre opcionais, pedidos no momento do uso e com alternativa por toque.

**Desempenho:** animar só `transform` e `opacity`; pouco `backdrop-filter` (pesa em Android barato); imagens com `loading="lazy"` e miniaturas; jogos em canvas com `requestAnimationFrame` e pausa quando a aba some. Meta: 60fps num iPhone de 3 anos e boot < 2s em 4G.

**Acessibilidade:** contraste AA nos textos (pares da paleta acima), foco visível, botões com rótulo, `prefers-reduced-motion` respeitado, nenhum jogo depende só de cor.

**Testes:**
- **Vitest (lógica de risco):** pontuação e faixas da pesca, máquina de estados das 3 tentativas (não resetar ao recarregar, finalizar tranca, piso da 3ª), avaliação do Termo (letras repetidas, acentos), contagem do quiz, persistência com storage quebrado.
- **Playwright em viewport de iPhone (390×844) e Android (360×800):** abertura → Casa → cada aba; desbloquear um vale; fluxo completo da pesca com recarga no meio; screenshots de cada tela.
- **Celular de verdade:** `npm run dev -- --host` e abrir pelo Wi-Fi no seu celular. Calibrar a dificuldade da pesca jogando de verdade.

---

## 11. Cronograma até amanhã (11/10)

| Fase | Entrega | Prioridade |
|---|---|---|
| **1. Base** | Projeto Vite, tokens, fontes, fundo de ondas e bolhas, HUD, hotbar, transições, estado e persistência, **deploy funcionando já com uma tela** (para descobrir problema de Pages cedo) | P0 |
| **2. Presentes** | Fliperama, os 5 jogos, Baú com resgate. A Pesca primeiro (é a mais complexa e a mais importante) | P0 |
| **3. Conteúdo** | Carta (envelope, texto, bolo), Kimi, Nós, Receita, script de fotos | P0 |
| **4. Casa e diversão** | Ilustração da Casa com cômodos, Parquinho (5 brinquedos), abertura de save | P0 |
| **5. Polimento** | Sala Secreta, conquistas, sons, PWA, brinquedos extras, Modo Baixinha | P1 |
| **6. QA final** | Testes, revisão no celular real, calibrar a pesca, resetar o progresso, deploy final | P0 |

**Se o tempo apertar, corta nesta ordem:** brinquedos extras → Modo Baixinha → paralaxe por giroscópio → conquistas → Sala Secreta. **Nunca cortar:** os 5 jogos, o Baú, a Carta, as galerias e a qualidade no celular.

### O que preciso de você
1. **Fotos** em `fotos/kimi/` e `fotos/nos/` (as pastas já existem).
2. **A carta** (texto livre; eu diagramo).
3. **Como o Kimi é** (raça, cor, orelha em pé ou caída), para o personagem do Kimi Run e as ilustrações.
4. As respostas da seção 12.
5. (Opcional) foto da sua assinatura, uma música, legendas das fotos de vocês, o texto da Sala Secreta.

---

## 12. Decisões em aberto (com minha recomendação)

1. **Pesca, "Tentar de novo":** descarta o resultado anterior (recomendado, dá emoção) **ou** vale a melhor das 3?
2. **Piso da pesca:** garantir pelo menos Prata na 3ª tentativa? (recomendado: sim)
3. **Revelação do valor:** mostrar "até R$250" na revelação final (recomendado) ou manter só "Presente de Ouro" e você conta pessoalmente?
4. **Portão com pergunta secreta:** quer? Se sim, qual pergunta e resposta? (recomendado: sim)
5. **Ordem dos jogos:** 4 livres + Pesca liberada por último (recomendado) ou todos livres?
6. **Contagem regressiva** antes de 00:00 do dia 11: sim ou não?
7. **Kimi:** como ele é?
8. **Termo:** posso usar **MOTEL** como palavra do Vale Transa?
