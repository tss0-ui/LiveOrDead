// backend/db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('fraud_audit.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      payment_method_id TEXT,
      result TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

function insertLog(name, methodId, result) {
  db.run(
    `INSERT INTO logs (name, payment_method_id, result) VALUES (?, ?, ?)`,
    [name, methodId, result]
  );
}

function getAllLogs() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM logs ORDER BY timestamp DESC`, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

module.exports = { insertLog, getAllLogs };
