const { Events } = require('discord.js');
const aiService = require('../services/aiService');
const db = require('../database');
const config = require('../config');
const prompts = require('../config/prompts');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;

        // Salva toda mensagem no banco de dados para contexto futuro
        db.saveMessage(message.author.id, message.author.username, message.content, message.channel.id);

        const isMentioned = message.mentions.has(message.client.user);
        const isHaterTarget = await db.isHater(message.author.id);
        const isAdmin = message.author.id === config.adminId;
        
        // Regra de probabilidade para responder mensagens aleatórias
        const shouldRespondRandomly = !isMentioned && !isHaterTarget && Math.random() < config.aiConfig.respondChance;

        if (isHaterTarget || isMentioned || shouldRespondRandomly) {
            try {
                await message.channel.sendTyping();
                
                // Busca histórico do banco de dados
                const history = await db.getLastMessages(message.channel.id, config.aiConfig.maxHistory);
                const context = aiService.formatHistory(history);

                let systemPrompt = "";
                
                if (isHaterTarget) {
                    systemPrompt = prompts.system.hater;
                } else if (isAdmin) {
                    systemPrompt = "Você é um assistente leal e prestativo ao seu Mestre. O Mestre é a pessoa que está falando com você agora. Seja respeitoso e eficiente.";
                } else if (shouldRespondRandomly) {
                    systemPrompt = prompts.system.caotica;
                } else {
                    systemPrompt = prompts.system.seca;
                }

                const response = await aiService.getResponse(systemPrompt, context);
                
                const MAX_LENGTH = 2000;
                if (response.length > MAX_LENGTH) {
                    const chunks = response.match(new RegExp(`.{1,${MAX_LENGTH}}`, 'g'));
                    for (const chunk of chunks) {
                        await message.reply(chunk);
                    }
                } else {
                    await message.reply(response);
                }
            } catch (error) {
                console.error("Erro na lógica de resposta:", error);
            }
        }
    },
};