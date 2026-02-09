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