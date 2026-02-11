require('dotenv').config();

module.exports = {
    token: process.env.TOKEN,
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID,
    groqKey: process.env.GROQ_API_KEY,
    adminId: '674082128526573580', // meu ID
    aiConfig: {
        respondChance: 0.2,
        maxHistory: 15,
    }
};