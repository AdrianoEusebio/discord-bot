const Groq = require("groq-sdk");
const config = require("../config");

const groq = new Groq({ apiKey: config.groqKey });

class AIService {
    async getResponse(systemPrompt, history) {
        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    ...history
                ],
                model: "llama-3.3-70b-versatile",
            });

            return completion.choices[0]?.message?.content || "Hm.";
        } catch (error) {
            console.error("Erro na Groq API:", error);
            return "Deu erro aqui, me deixa.";
        }
    }

    formatHistory(messages) {
        return messages.map(msg => ({
            role: "user",
            content: `${msg.username}: ${msg.content}`
        }));
    }
}

module.exports = new AIService();