const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const config = require("./config");
const fs = require('node:fs');
const path = require('node:path');

if (!config.token || !config.clientId) {
  console.error("ERRO: Variáveis TOKEN e CLIENT_ID são obrigatórias no arquivo .env");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [Partials.Channel]
});

client.commands = new Collection();

// Função de carregamento modular
const loadModules = (dir, callback) => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) return;
  
  const files = fs.readdirSync(fullPath).filter(file => file.endsWith('.js'));
  for (const file of files) {
    const module = require(path.join(fullPath, file));
    callback(module, file);
  }
};

// Carregar Comandos
loadModules('commands', (command, file) => {
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[AVISO] O comando em ${file} está incompleto.`);
  }
});

// Carregar Eventos
loadModules('events', (event) => {
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
});

client.login(config.token);