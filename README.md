### 🧠 Cérebro (IA)
- Integração com Groq (Llama 3.3): O bot usa um dos modelos mais avançados e rápidos do mercado.
- Chat Inteligente: Ao mencionar o bot ( @Bot ), ele responde como um assistente útil e amigável.
- Modo "Hater" Secreto: Se o usuário de ID 1384507259920322725 mandar qualquer mensagem, o bot responde automaticamente sendo ácido, rabugento e discordando de tudo (sem precisar ser mencionado).
### 🛠️ Estrutura Técnica
- Event Handler: Os eventos ( ready , messageCreate , interactionCreate ) estão separados na pasta /events .
- Command Handler: Os comandos ( / ) são carregados dinamicamente da pasta /commands .
### ⚡ Comandos Ativos (/)
1. /ping: Responde "Pong! 🏓" (teste de latência).
2. /ex: Sorteia um nome aleatório de uma lista JSON.
### 🎭 Interações de Chat (Sem Comandos)
1. Detector de Risadas: Se alguém digitar "kkkk", "haha", "rsrs", o bot responde "Tá rindo de que?".
2. Menção Simples: Se mencionar o bot, ele ativa a IA (a menos que seja o usuário do modo Hater).
O projeto está modular, fácil de expandir e já com IA integrada de graça! 🚀


Novas Funcionalidades

- Comando /tudao : Criado para listar todos os comandos administrativos disponíveis no bot, facilitando a consulta rápida.
- Comando /hater-status : Adicionado para exibir a lista de usuários que estão marcados como "haters".
- Persistência de Haters : Implementamos tabelas no banco de dados SQLite para salvar permanentemente quem são os haters, garantindo que a lista não se perca ao reiniciar o bot.
- Auto-criação de Pastas : O bot agora cria automaticamente a pasta data/ se ela não existir, evitando erros de inicialização do banco de dados.
Funcionalidades Removidas / Restrições Alteradas

- Remoção de Restrição Admin : Os comandos /tudao e /hater-status foram alterados de "apenas admin" para públicos . Agora qualquer usuário do servidor pode utilizá-los.
- Redução de Interação : Diminuímos a respondChance (chance de resposta aleatória) de 30% para 20% , tornando o bot um pouco mais discreto nas conversas.
O que Permanece Igual (Segurança)

- Gerenciamento de Haters : Os comandos para adicionar ou remover usuários da lista de haters ( /hater , /haters , /unhater ) continuam sendo exclusivos para administradores . Apenas você (ou quem tiver o ID configurado como admin) pode alterar essa lista.
Status Atual do Projeto

1. Configuração : Ajustada para 20% de resposta em src/config/index.js .
2. Comandos : Todos criados e configurados com as permissões corretas em src/commands/ .
3. Banco de Dados : Corrigido para evitar erros de permissão de escrita.