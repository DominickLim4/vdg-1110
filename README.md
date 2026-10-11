# Vale da Geo

Site-presente de aniversário da Geo, no tema Stardew Valley, feito para celular.

## Rodar no computador
```bash
npm install
npm run dev            # abre em http://localhost:5173
npm run dev -- --host  # para abrir no celular pelo Wi-Fi (use o IP que aparecer)
```

## Colocar as fotos
1. Arraste as fotos para `fotos/kimi/` e `fotos/nos/`. Pode ser JPG, PNG ou HEIC do iPhone.
2. (Opcional) Legendas para as fotos de vocês: crie `fotos/nos/legendas.json`:
   ```json
   { "IMG_1234.HEIC": "nosso primeiro sushi", "IMG_5678.jpg": "aquele show" }
   ```
3. Rode `npm run fotos`. O script reduz o tamanho das fotos, converte para WebP e **remove a localização GPS**.
4. Faça commit da pasta `src/fotos-otimizadas`. As originais em `fotos/` não vão para o GitHub.

## Escrever os textos
- Carta: `src/conteudo/carta.md` (apague a linha `RASCUNHO` quando terminar).
- Bilhete da passagem secreta: `src/conteudo/sala-secreta.ts`.
- Frases da Receita do dia: `src/conteudo/frases.ts`.
- Número de WhatsApp que recebe os resgates: `src/conteudo/contato.ts`.
- Ingredientes, peixes e bebidas do sushi: `src/telas/sushi/dados.ts`.
- Riffs do "Me surpreenda": `src/conteudo/riffs.ts`.

## Publicar no GitHub Pages (grátis)
1. Crie um repositório e faça push na branch `main`.
2. No GitHub: *Settings → Pages → Build and deployment → Source: GitHub Actions*.
3. Cada push na `main` publica sozinho (`.github/workflows/deploy.yml`).

O site é público para quem tiver o link. A pergunta de entrada esconde de curiosos, mas não é uma senha de verdade.

## Antes de mandar o link para ela
Abra o site com `?dev=1` no final da URL (ex.: `https://…/vale-da-geo/?dev=1`), toque em **dev → Zerar TUDO** e feche. Isso apaga o progresso dos seus testes nesse aparelho.

## Verificação
- `npm test`: regras da pesca, Termo e simulação de calibragem.
- `npm run build`: build de produção.
- `node scripts/fluxos.mjs http://localhost:5173/` e `node scripts/fluxos-novos.mjs http://localhost:5173/`: jogam os fluxos num iPhone simulado (com `npm run dev` rodando).
