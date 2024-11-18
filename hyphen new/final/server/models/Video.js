const promisePool = require('../config/db');

// Create the videos table if it does not exist
const createTable = async () => {
    try {
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS videos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                filename VARCHAR(255) NOT NULL,
                path TEXT NOT NULL,
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    } catch (error) {
        console.error('Error creating table:', error);
    }
};

createTable();
