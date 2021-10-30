require('dotenv').config();

const cors = require('cors');
const helmet = require("helmet");
const express = require('express');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({
    limit: '50mb',
    extended: true
}));

app.use(async (req, res, next) => {
    try {
        require('./routes/index')(app);
        next();
    } catch (error) {
        res.status(404).send('Request URL not found');
    }
});

app.get('/', (req, res) => {
    res.status(200).send('ok');
});

process.on('uncaughtException', function (err) {
    console.log('uncaught Exception', err);
});

module.exports = app;