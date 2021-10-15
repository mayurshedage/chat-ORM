require('dotenv').config();

const cors = require('cors');
const express = require('express');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({
    limit: '50mb',
    extended: true
}));

app.use(async (req, res, next) => {
    try {
        require('./routes/index')(app, req, res);
        next();
    } catch (error) {
        console.log('error', error);
        res.status(404).send('Request URL not found');
    }
});

app.get('/', (req, res) => {
    res.status(200).send('ok');
});

app.listen(process.env.PORT || 4000);