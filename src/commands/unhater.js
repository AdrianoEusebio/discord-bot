const { SlashCommandBuilder } = require('discord.js');
const db = require('../database');
const config = require('../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unhater')
        .setDescription('Remove um usuário da lista de alvos da IA')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('O usuário que será removido')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.user.id !== config.adminId) {
            return interaction.reply({ content: 'Apenas o Mestre pode dar ordens.', ephemeral: true });
        }

        const user = interaction.options.getUser('usuario');
        await db.removeHater(user.id);
        
        await interaction.reply({ content: `${user.username} foi perdoado... por enquanto.`, ephemeral: true });
    },
};