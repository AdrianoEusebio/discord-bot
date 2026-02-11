const { SlashCommandBuilder } = require('discord.js');
const db = require('../database');
const config = require('../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('haters')
        .setDescription('Adiciona múltiplos usuários à lista de alvos da IA')
        .addStringOption(option => 
            option.setName('usuarios')
                .setDescription('IDs ou menções separados por vírgula')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.user.id !== config.adminId) {
            return interaction.reply({ content: 'Apenas o Mestre pode dar ordens.', ephemeral: true });
        }

        const input = interaction.options.getString('usuarios');
        const userIds = input.split(',').map(id => id.trim().replace(/[<@!>]/g, ''));
        
        let count = 0;
        for (const id of userIds) {
            if (id.length >= 17 && id.length <= 19) { // Tamanho padrão de ID do Discord
                await db.addHater(id);
                count++;
            }
        }
        
        await interaction.reply({ content: `${count} alvos foram adicionados à lista de sacrifício.`, ephemeral: true });
    },
};