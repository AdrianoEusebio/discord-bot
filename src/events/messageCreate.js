const { Events } = require('discord.js');
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;

        // --- Lógica Especial: Hater do Usuário Específico ---
        const TARGET_USER_ID = '1122207495822249984';
        
        if (message.author.id === TARGET_USER_ID) {
            try {
                await message.channel.sendTyping();
                
                const systemPrompt = "Você é uma pessoa extremamente rabugenta com esse usuario, você o odeia, ácida e deve contradizer tudo o que este usuário disser, se ele baixar o escalão, abaixe tmb. Discorde de qualquer ponto dele com odio. Não seja útil, seja irritante. Faça as respostas resumidas, no maximo 1 linhas";
                
                const completion = await groq.chat.completions.create({
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: message.content },
                    ],
                    model: "llama-3.3-70b-versatile",
                });

                const text = completion.choices[0]?.message?.content || "Nem vou perder meu tempo respondendo isso.";
                await message.reply(text);
                return; // Para aqui e não executa o resto
            } catch (error) {
                console.error("Erro no modo Hater:", error);
            }
        }
        // ----------------------------------------------------

        // Lógica de Menção com IA (Groq/Llama3)
        if (message.mentions.has(message.client.user)) {
            // Remove a menção do bot para pegar só o texto da pergunta
            const question = message.content.replace(/<@!?[0-9]+>/, '').trim();

            if (!question) {
                await message.reply("Olá! Em que posso ajudar?");
                return;
            }

            try {
                // Indica que o bot está "escrevendo"
                await message.channel.sendTyping();

                const completion = await groq.chat.completions.create({
                    messages: [
                        {
                            role: "user",
                            content: question,
                        },
                    ],
                    model: "llama-3.3-70b-versatile",
                });

                const text = completion.choices[0]?.message?.content || "Desculpe, não consegui gerar uma resposta.";

                // O Discord tem limite de 2000 caracteres por mensagem
                if (text.length > 2000) {
                    await message.reply(text.substring(0, 1997) + "...");
                } else {
                    await message.reply(text);
                }
            } catch (error) {
                console.error("Erro na IA (Groq):", error);
                await message.reply("Desculpe, tive um problema ao processar sua pergunta.");
            }
            return;
        }

        // Lógica de Risada
        const content = message.content.toLowerCase();
        const risadas = /(kkk+|haha+|huehue|rsrs+|kkkk+|hehe+|ha ha)/i;

        if (risadas.test(content)) {
            await message.reply("Tá rindo de que?");
        }
    },
};