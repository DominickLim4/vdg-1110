// Perguntas do Quiz do Vale. A resposta certa é sempre a primeira opção
// (o jogo embaralha na hora). Fatos conferidos na Stardew Valley Wiki (stardewvalleywiki.com).

export interface Pergunta {
  pergunta: string
  opcoes: [string, string, string, string]
  explicacao: string
}

export const PERGUNTAS: Pergunta[] = [
  {
    pergunta: 'Qual é o nome verdadeiro do Mago?',
    opcoes: ['Rasmodius', 'Merlindo', 'Morris', 'Gunther'],
    explicacao: 'Rasmodius! Mago de respeito precisa de nome pomposo.',
  },
  {
    pergunta: 'O que o Prefeito Lewis perdeu (e que aparece na casa da Marnie)?',
    opcoes: ['A cueca roxa da sorte', 'A chave da cidade', 'O chapéu de festa', 'O diário secreto'],
    explicacao: 'A cueca roxa da sorte. O romance secreto mais mal escondido do vale.',
  },
  {
    pergunta: 'Onde o Krobus mora?',
    opcoes: ['No esgoto', 'Na torre do Mago', 'Nas minas', 'No deserto'],
    explicacao: 'No esgoto! Sombrio, mas é o melhor amigo que alguém pode ter.',
  },
  {
    pergunta: 'Quem são os espíritos que restauram o Centro Comunitário?',
    opcoes: ['Os Junimos', 'Os Duendes', 'As Fadas', 'Os Slimes'],
    explicacao: 'Os Junimos! Pequenos, fofos e viciados em pacotes.',
  },
  {
    pergunta: 'Em qual dia da semana a loja do Pierre fecha (antes do Centro Comunitário)?',
    opcoes: ['Quarta-feira', 'Domingo', 'Segunda-feira', 'Sexta-feira'],
    explicacao: 'Quarta-feira. Quantas sementes a gente já deixou de comprar por isso…',
  },
  {
    pergunta: 'Quantos dias tem cada estação?',
    opcoes: ['28', '30', '31', '24'],
    explicacao: '28 dias. Igual ciclo de plantão: passa voando.',
  },
  {
    pergunta: 'Quem é o médico da Vila Pelicano?',
    opcoes: ['Harvey', 'Elliott', 'Clint', 'Demetrius'],
    explicacao: 'Harvey! Futuro colega de profissão, Dra. Geo.',
  },
  {
    pergunta: 'Quem trabalha como enfermeira na clínica do Harvey?',
    opcoes: ['Maru', 'Penny', 'Haley', 'Emily'],
    explicacao: 'Maru, às terças e quintas. Cientista e enfermeira, multitarefa raiz.',
  },
  {
    pergunta: 'Qual destes é um presente que a Abigail AMA?',
    opcoes: ['Ametista', 'Argila', 'Azevinho', 'Salada'],
    explicacao: 'Ametista! (Argila e azevinho ela odeia, cuidado.)',
  },
  {
    pergunta: 'Que instrumento o Sam toca na banda com o Sebastian e a Abigail?',
    opcoes: ['Guitarra', 'Bateria', 'Teclado', 'Violino'],
    explicacao: 'Guitarra! O vale também tem seu rockzinho.',
  },
  {
    pergunta: 'Onde e quando se pesca o peixe lendário "Lenda"?',
    opcoes: ['Lago da montanha, na primavera, com chuva', 'Praia, no verão, de noite', 'Rio da cidade, no outono', 'Esgoto, em qualquer estação'],
    explicacao: 'No lago da montanha, na primavera, com chuva. Boa sorte com essa barra.',
  },
  {
    pergunta: 'Qual colheita do OUTONO pode virar uma colheita gigante?',
    opcoes: ['Abóbora', 'Milho', 'Berinjela', 'Amaranto'],
    explicacao: 'Abóbora! (Na primavera é a couve-flor e no verão o melão.)',
  },
  {
    pergunta: 'O que você dá para pedir alguém em CASAMENTO?',
    opcoes: ['Pingente de Sereia', 'Buquê', 'Anel de Diamante', 'Fruta Estelar'],
    explicacao: 'Pingente de Sereia. O buquê é só pra começar a namorar.',
  },
  {
    pergunta: 'Quem vende o Pingente de Sereia?',
    opcoes: ['O Velho Marinheiro', 'O Willy', 'A Robin', 'O Pierre'],
    explicacao: 'O Velho Marinheiro, na praia, em dia de chuva.',
  },
  {
    pergunta: 'Qual animal fareja trufas?',
    opcoes: ['Porco', 'Cabra', 'Coelho', 'Pato'],
    explicacao: 'O porco! Trufa no óleo é dinheiro na conta.',
  },
  {
    pergunta: 'Quem mora numa barraca perto da montanha?',
    opcoes: ['Linus', 'Krobus', 'George', 'Willy'],
    explicacao: 'Linus. Ninguém mexe no lixo do Linus.',
  },
  {
    pergunta: 'Quantos andares tem a Mina (sem contar a Caverna da Caveira)?',
    opcoes: ['120', '100', '150', '80'],
    explicacao: '120 andares de pedra, slime e minério.',
  },
  {
    pergunta: 'Em que dia da Primavera acontece o Festival do Ovo?',
    opcoes: ['13', '24', '1', '28'],
    explicacao: 'Dia 13! (O 24 é a Dança das Flores.)',
  },
  {
    pergunta: 'Qual festival do outono tem um labirinto assombrado?',
    opcoes: ['Véspera dos Espíritos', 'Feira do Vale Stardew', 'Festa da Estrela de Inverno', 'Luau'],
    explicacao: 'A Véspera dos Espíritos, no dia 27 do outono.',
  },
  {
    pergunta: 'Qual o nome do mercado que quer acabar com a loja do Pierre?',
    opcoes: ['JojaMart', 'MegaMart', 'Pelican Shop', 'ValleyMart'],
    explicacao: 'JojaMart. Joja nunca mais.',
  },
]

export const QUANTIDADE_QUIZ = 10
export const ACERTOS_PARA_VENCER = 7
