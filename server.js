require('dotenv').config();

const cors = require('cors');
const express = require('express');
const Helper = require('./helpers/dbconnector.helper');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({
    limit: '50mb',
    extended: true
}));

app.use(async (req, res, next) => {
    try {
        const url = req.url;
        const hostName = req.headers.host;

        const regx = new RegExp(/^([a-zA-Z0-9]+)\.(api)\-([a-z]+)\.([a-z]+)\.([a-z])/gm);
        const checkHost = regx.test(hostName); // appid100.api-client.cometondemand.com - success

        if (!checkHost) throw new Error('Request URL not found' + hostName);

        const appInfo = hostName.split(".");
        const appId = appInfo[0];
        const apiType = appInfo[1].split("-")[1];

        if (![process.env.US_REGION, process.env.CLIENT_REGION].includes(apiType)) throw new Error('Request URL not found' + apiType);

        const routePath = url.split("?").shift();

        await Helper.configureDBConnection(appId, apiType, req, res, () => {
            require('./routes/' + routePath.split('/')[1] + '/' + routePath.split('/')[2].slice(0, -1) + '.route')(app, apiType);
            next();
        });
    } catch (error) {
        console.log(error);
        res.status(404).send('Request URL not found');
    }
});

app.get('/', (req, res) => {
    res.status(200).send('ok');
});

app.listen(process.env.PORT || 4000);