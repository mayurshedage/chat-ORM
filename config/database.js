require('dotenv').config();

module.exports = {
    connections: {
        creator: {
            port: 3306,
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        }
    }
}