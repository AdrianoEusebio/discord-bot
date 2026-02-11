const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tudao')
        .setDescription('Lista todos os comandos disponíveis do bot'),
    async execute(interaction) {
        const commands = interaction.client.commands;
        
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('📜 Lista de Comandos - O Tudão')
            .setDescription('Aqui estão as ordens que você pode dar:')
            .addFields(
                commands.map(cmd => ({
                    name: `/${cmd.data.name}`,
                    value: cmd.data.description || 'Sem descrição.',
                    inline: true
                }))
            )
            .setFooter({ text: 'Use com sabedoria, Mestre.' });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};