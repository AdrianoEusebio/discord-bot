const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database');
const config = require('../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hater-status')
        .setDescription('Mostra quem está atualmente na lista de alvos da IA'),
    async execute(interaction) {
        const haters = await db.getAllHaters();

        if (haters.length === 0) {
            return interaction.reply({ content: 'A lista está vazia. O bot está em paz (por enquanto).', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0x000000)
            .setTitle('🎯 Lista de Alvos Atuais (Haters)')
            .setDescription('Estes são os usuários que a IA está destruindo no momento:')
            .addFields(
                haters.map(h => ({
                    name: h.username || 'Usuário Desconhecido',
                    value: `ID: ${h.user_id}`,
                    inline: false
                }))
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};