const { SlashCommandBuilder } = require('discord.js');
const names = require('../data/names.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ex')
        .setDescription('Retorna um nome aleatório'),
    async execute(interaction) {
        const randomName = names[Math.floor(Math.random() * names.length)];
        await interaction.reply(`O nome sorteado foi: **${randomName}**`);
    },
};