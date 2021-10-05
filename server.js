require('dotenv').config();

const cors = require('cors');
const express = require('express');
const database = require('./middlewares/dbconnector.mw');
const { header, query } = require('express-validator');
const validator = require('./middlewares/validator.mw');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({
    limit: '50mb',
    extended: true
}));

app.use(
    [
        header(['app_id']).not().isEmpty(),
        query(['debug']).optional().not().isEmpty().custom((value, { req }) => {
            if (req.query.debugCode !== process.env.DEBUG_HASH) {
                throw new Error('OOps! incorrect `debugCode`. Please verify the `debugCode` in query params.');
            } else {
                return true;
            }
        })
    ],
    validator.showError,
    database.openConnection
);

app.use((req, res, next) => {
    try {
        const url = req.url;
        const routePath = url.split("?").shift();
        require('./routes/' + routePath.split('/')[1] + '/' + routePath.split('/')[2].slice(0, -1) + '.route')(app);
        next();
    } catch (error) {
        console.log(error);
        res.status(404).send('Request URL not found');
    }
});

app.get('/', (req, res) => {
    res.status(200).send('ok');
});

app.listen(process.env.PORT || 4000);