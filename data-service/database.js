const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const dbPath = path.join(dataDir, 'places.sqlite');
const db = new Database(dbPath, { verbose: console.log });

// Initialize schema
function initDB() {
    console.log('📦 Đang khởi tạo Database SQLite (better-sqlite3)...');
    
    db.exec(`
        CREATE TABLE IF NOT EXISTS places_raw (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL UNIQUE,
            source_url TEXT NOT NULL,
            extracted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            is_processed INTEGER DEFAULT 0
        )
    `);

    console.log('✅ Bảng places_raw đã sẵn sàng.');
}

// Function to insert unique places
function insertPlaces(places) {
    const insert = db.prepare(`
        INSERT OR IGNORE INTO places_raw (title, source_url) 
        VALUES (@title, @sourceUrl)
    `);
    
    let insertedCount = 0;
    
    const insertMany = db.transaction((placesArray) => {
        for (const place of placesArray) {
            const result = insert.run(place);
            if (result.changes > 0) {
                insertedCount++;
            }
        }
    });

    insertMany(places);
    return insertedCount;
}

// Function to view debug stats
function getStats() {
    const row = db.prepare('SELECT COUNT(*) as total FROM places_raw').get();
    return row.total;
}

module.exports = {
    initDB,
    insertPlaces,
    getStats
};
