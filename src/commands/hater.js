const { SlashCommandBuilder } = require('discord.js');
const db = require('../database');
const config = require('../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hater')
        .setDescription('Adiciona um usuário à lista de alvos da IA')
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('O usuário que será o alvo')
                .setRequired(true)),
    async execute(interaction) {
        if (interaction.user.id !== config.adminId) {
            return interaction.reply({ content: 'Apenas o Mestre pode dar ordens.', ephemeral: true });
        }

        const user = interaction.options.getUser('usuario');
        await db.addHater(user.id);
        
        await interaction.reply({ content: `O alvo ${user.username} foi adicionado à lista de sacrifício.`, ephemeral: true });
    },
};