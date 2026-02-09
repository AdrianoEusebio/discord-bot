const { Client, GatewayIntentBits, Partials, REST, Routes, SlashCommandBuilder, Events } = require("discord.js");
require("dotenv").config();

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID; // Opcional: Para registro instantâneo em desenvolvimento

if (!TOKEN || !CLIENT_ID) {
  console.error("ERRO: Variáveis TOKEN e CLIENT_ID são obrigatórias no arquivo .env");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

const pingCommand = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Responde com Pong");

async function registerCommands() {
  try {
    const rest = new REST({ version: "10" }).setToken(TOKEN);
    console.log('Iniciando atualização dos comandos de aplicação (/).');

    if (GUILD_ID) {
      console.log(`Registrando comandos para o servidor específico: ${GUILD_ID} (Atualização Instantânea)`);
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
        body: [pingCommand.toJSON()]
      });
    } else {
      console.log('Registrando comandos globalmente (Pode levar até 1 hora para aparecer)');
      await rest.put(Routes.applicationCommands(CLIENT_ID), {
        body: [pingCommand.toJSON()]
      });
    }

    console.log('Comandos de aplicação (/) recarregados com sucesso.');
  } catch (error) {
    console.error('Erro ao registrar comandos:', error);
  }
}

client.once(Events.ClientReady, async () => {
  await registerCommands();
  console.log(`Bot online como ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === "ping") {
    await interaction.reply("Pong! 🏓");
  }
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  if (message.mentions.has(client.user)) {
    await message.reply("Opa, estou online!");
    return;
  }

  const content = message.content.toLowerCase();
  const risadas = /(kkk+|haha+|huehue|rsrs+|kkkk+|hehe+|ha ha)/i;

  if (risadas.test(content)) {
    await message.reply("Tá rindo de que?");
  }
});

client.login(TOKEN);
