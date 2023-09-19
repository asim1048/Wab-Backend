const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

const URL = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster1.l8bckzn.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

async function Connection() {
    return new Promise((resolve, reject) => {
        mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true });
        const dbConnection = mongoose.connection;

        dbConnection.once('open', () => {
            console.log('Connected to MongoDB');
            resolve();
        });

        dbConnection.on('error', (error) => {
            console.error('Error while connecting to MongoDB:', error);
            reject(error);
        });
    });
}

module.exports = Connection;
