// Receita do dia. Edite à vontade: cada frase pertence a uma categoria.

export type Categoria = 'med' | 'treino' | 'autoestima' | 'zoeira' | 'rpg'

export const CATEGORIAS: { id: Categoria; nome: string }[] = [
  { id: 'med', nome: 'Estudo & Med' },
  { id: 'treino', nome: 'Treino' },
  { id: 'autoestima', nome: 'Autoestima' },
  { id: 'zoeira', nome: 'Zoeira' },
  { id: 'rpg', nome: 'RPG' },
]

export const FRASES: { categoria: Categoria; texto: string; posologia: string }[] = [
  { categoria: 'med', texto: 'Você não está atrasada. Você está carregando um mundo nas costas e mesmo assim está indo.', posologia: '1 dose ao acordar, com Coca Zero gelada.' },
  { categoria: 'med', texto: 'Um dia alguém vai sair do seu consultório se sentindo ouvido pela primeira vez. Estuda por essa pessoa.', posologia: 'Tomar antes de abrir o resumo.' },
  { categoria: 'med', texto: 'O DSM tem quase mil páginas e você vai dominar. Uma página de cada vez.', posologia: '1 capítulo a cada 8 horas.' },
  { categoria: 'med', texto: 'Cansaço de prova passa. Diploma de médica fica.', posologia: 'Uso contínuo até a formatura.' },
  { categoria: 'med', texto: 'Hot girls study hard. E você é as duas coisas.', posologia: 'Aplicar no espelho, generosamente.' },
  { categoria: 'med', texto: 'Errou a questão? Ótimo. Agora você nunca mais erra essa.', posologia: 'Repetir após cada simulado.' },
  { categoria: 'med', texto: 'Freud explica muita coisa. Você, ele não explica: você é um caso único.', posologia: 'Sessão livre, sem hora marcada.' },
  { categoria: 'med', texto: 'Pausa não é preguiça. Até neurônio precisa de intervalo pra fazer sinapse.', posologia: '15 minutos a cada 50 de estudo.' },
  { categoria: 'med', texto: 'Você escolheu cuidar da mente das pessoas. Lembra de incluir a sua na lista de pacientes.', posologia: 'Diariamente, sem pular dose.' },
  { categoria: 'med', texto: 'Dra. Geovanna Froes, psiquiatra. Vai lendo em voz alta até virar verdade.', posologia: '3x ao dia.' },
  { categoria: 'med', texto: 'Uma página lida hoje é uma noite a menos de desespero na véspera.', posologia: 'Antes das 22h, de preferência.' },
  { categoria: 'med', texto: 'Plantão difícil não é sinal de que você não serve. É sinal de que você está aprendendo o que poucos aguentam.', posologia: 'Após cada plantão, com abraço.' },

  { categoria: 'treino', texto: 'Treino de perna hoje. Amanhã você reclama, depois de amanhã você agradece.', posologia: '4 séries de 12, sem desculpa.' },
  { categoria: 'treino', texto: 'Ninguém se arrepende de um treino feito. Já de um pulado…', posologia: 'Tomar antes da preguiça bater.' },
  { categoria: 'treino', texto: 'Baixinha, sim. Fraca, jamais.', posologia: 'Repetir a cada PR batido.' },
  { categoria: 'treino', texto: 'O halter não sabe que você dormiu mal. Vai lá e mostra pra ele.', posologia: 'Pré-treino emocional.' },
  { categoria: 'treino', texto: 'Constância vence intensidade. Aparece, mesmo nos dias meia-boca.', posologia: '5x por semana.' },
  { categoria: 'treino', texto: 'Glúteo é construído na fila do agachamento, não no feed do Instagram.', posologia: 'Com caneleira, de preferência.' },
  { categoria: 'treino', texto: 'Sua barra de energia está baixa? Coca Zero não conta como pré-treino. (Conta um pouquinho.)', posologia: '1 lata, gelada.' },
  { categoria: 'treino', texto: 'Hoje o objetivo é só um: terminar o treino. O resto é bônus.', posologia: 'Uma vez, sem negociação.' },

  { categoria: 'autoestima', texto: 'Já que sou, o jeito é ser.', posologia: 'Uso contínuo, recomendado pela Clarice.' },
  { categoria: 'autoestima', texto: 'Você é a pessoa mais engraçada de qualquer sala em que entra. Isso não é pouca coisa.', posologia: 'Lembrar sempre que bater insegurança.' },
  { categoria: 'autoestima', texto: 'Time to put yourself first. Sem culpa nenhuma.', posologia: 'Dose dupla aos domingos.' },
  { categoria: 'autoestima', texto: 'Suas mãos fazem desenho, pintura e um dia vão salvar gente. Respeita essas mãos.', posologia: 'Aplicar com hidratante.' },
  { categoria: 'autoestima', texto: 'Personalidade forte não é defeito. É o motivo de todo mundo lembrar de você.', posologia: 'Tomar sem diluir.' },
  { categoria: 'autoestima', texto: 'Você não precisa ser perfeita. Você já é muito.', posologia: 'Sempre que precisar.' },
  { categoria: 'autoestima', texto: 'O mundo fica mais colorido quando você pinta. Literal e figurativamente.', posologia: 'Com pincel e guache.' },
  { categoria: 'autoestima', texto: 'Tem gente que passa a vida procurando a coragem que você tem de sobra.', posologia: 'Ao enfrentar qualquer chefão.' },
  { categoria: 'autoestima', texto: '25 anos e já é tudo isso. Imagina aos 30.', posologia: 'Hoje, especialmente.' },
  { categoria: 'autoestima', texto: 'Seu riso é contagioso. A OMS deveria ser notificada.', posologia: 'Gargalhar livremente.' },

  { categoria: 'zoeira', texto: 'Hoje você pode ter tudo: sushi, Coca Zero e razão em todas as discussões.', posologia: 'Só hoje. Amanhã a gente discute.' },
  { categoria: 'zoeira', texto: 'Coca normal é veneno. Você está certa. Sempre esteve.', posologia: 'Zero açúcar, cem por cento atitude.' },
  { categoria: 'zoeira', texto: 'Se o dia estiver ruim, lembra: existe filhote de golden no mundo. E um deles é seu.', posologia: 'Observar um golden por 5 minutos.' },
  { categoria: 'zoeira', texto: 'Diagnóstico: fofura crônica. Prognóstico: sem cura.', posologia: 'Não há tratamento disponível.' },
  { categoria: 'zoeira', texto: 'Mengão ganhou? Ótimo dia. Mengão perdeu? Era o juiz.', posologia: 'Domingo, às 16h.' },
  { categoria: 'zoeira', texto: 'Rodízio de sushi não é refeição. É compromisso de honra.', posologia: 'Até o último temaki.' },
  { categoria: 'zoeira', texto: 'Baixinha é só a versão compacta e mais potente.', posologia: 'Ler em voz alta pra quem zoar sua altura.' },
  { categoria: 'zoeira', texto: 'Ninguém mexe no lixo do Linus. E ninguém mexe com você.', posologia: 'Proteção vitalícia.' },
  { categoria: 'zoeira', texto: 'Aumenta o volume. Não importa a pergunta, a resposta é rock.', posologia: 'Volume 11.' },
  { categoria: 'zoeira', texto: 'Você é a Junimo que restaura qualquer centro comunitário emocional.', posologia: 'Entregar pacotes de carinho.' },

  { categoria: 'rpg', texto: 'Você tem vantagem em todos os testes hoje. Rola dois d20 e pega o maior.', posologia: 'Válido até meia-noite.' },
  { categoria: 'rpg', texto: 'Falha crítica faz parte da campanha. Personagem bom é o que levanta depois.', posologia: 'Após rolar 1 natural.' },
  { categoria: 'rpg', texto: 'Seu carisma é 20. Usa isso sem dó.', posologia: 'Em qualquer teste de persuasão.' },
  { categoria: 'rpg', texto: 'Descanso longo também é estratégia. Recupera os pontos de vida.', posologia: '8 horas de sono, pelo menos.' },
  { categoria: 'rpg', texto: 'Subiu de nível: 25. Novas habilidades desbloqueadas. Escolhe bem os talentos.', posologia: 'Hoje, ficha nova.' },
  { categoria: 'rpg', texto: 'Toda grande aventureira começa na taverna, com fome. Come primeiro, salva o mundo depois.', posologia: 'Antes de cada missão.' },
  { categoria: 'rpg', texto: 'O mestre colocou um chefão difícil na sua frente porque sabe que a sua build aguenta.', posologia: 'Encarar sem medo.' },
  { categoria: 'rpg', texto: 'Inspiração concedida. Use quando precisar.', posologia: '1 uso por sessão. Renovável.' },
]
