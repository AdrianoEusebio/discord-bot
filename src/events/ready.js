const { Events, REST, Routes } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Bot online como ${client.user.tag}`);

        const commandsJSON = client.commands.map(cmd => cmd.data.toJSON());
        const TOKEN = process.env.TOKEN;
        const CLIENT_ID = process.env.CLIENT_ID;
        const GUILD_ID = process.env.GUILD_ID;

        const rest = new REST({ version: '10' }).setToken(TOKEN);

        try {
            console.log(`Iniciando atualização de ${commandsJSON.length} comandos de aplicação (/).`);

            if (GUILD_ID) {
                console.log(`Registrando comandos para o servidor específico: ${GUILD_ID} (Atualização Instantânea)`);
                await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
                    body: commandsJSON
                });
            } else {
                console.log('Registrando comandos globalmente (Pode levar até 1 hora para aparecer)');
                await rest.put(Routes.applicationCommands(CLIENT_ID), {
                    body: commandsJSON
                });
            }

            console.log('Comandos de aplicação (/) recarregados com sucesso.');
        } catch (error) {
            console.error('Erro ao registrar comandos:', error);
        }
    },
};