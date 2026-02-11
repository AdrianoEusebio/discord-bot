const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '../../data');
const dbPath = path.join(dataDir, 'bot_memory.sqlite');

// Garante que o diretório data existe
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Erro ao abrir banco de dados:', err.message);
    else console.log('Conectado ao banco de dados SQLite.');
});

// Inicialização das tabelas
db.serialize(() => {
    // Tabela de Mensagens
    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        username TEXT,
        content TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        channel_id TEXT
    )`);

    // Tabela de Usuários
    db.run(`CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        username TEXT,
        last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
        total_messages INTEGER DEFAULT 1
    )`);

    // Tabela de Haters (Nova)
    db.run(`CREATE TABLE IF NOT EXISTS hater_list (
        user_id TEXT PRIMARY KEY,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

module.exports = {
    saveMessage: (userId, username, content, channelId) => {
        db.run(`INSERT INTO messages (user_id, username, content, channel_id) VALUES (?, ?, ?, ?)`, 
            [userId, username, content, channelId]);
        
        db.run(`INSERT INTO users (user_id, username) VALUES (?, ?) 
                ON CONFLICT(user_id) DO UPDATE SET 
                total_messages = total_messages + 1, 
                last_seen = CURRENT_TIMESTAMP`, [userId, username]);
    },

    getLastMessages: (channelId, limit = 10) => {
        return new Promise((resolve, reject) => {
            db.all(`SELECT username, content FROM messages 
                    WHERE channel_id = ? ORDER BY timestamp DESC LIMIT ?`, 
                    [channelId, limit], (err, rows) => {
                if (err) reject(err);
                else resolve(rows.reverse());
            });
        });
    },

    // Lógica de Haters
    addHater: (userId) => {
        return new Promise((resolve, reject) => {
            db.run(`INSERT OR IGNORE INTO hater_list (user_id) VALUES (?)`, [userId], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    },

    removeHater: (userId) => {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM hater_list WHERE user_id = ?`, [userId], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    },

    isHater: (userId) => {
        return new Promise((resolve, reject) => {
            db.get(`SELECT user_id FROM hater_list WHERE user_id = ?`, [userId], (err, row) => {
                if (err) reject(err);
                else resolve(!!row);
            });
        });
    },

    getAllHaters: () => {
        return new Promise((resolve, reject) => {
            // Faz um JOIN com a tabela de users para pegar o nome mais recente conhecido
            db.all(`SELECT h.user_id, u.username 
                    FROM hater_list h 
                    LEFT JOIN users u ON h.user_id = u.user_id`, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
};