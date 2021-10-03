const { exec } = require("child_process");
const Redis = require('redis');
const database = require('../middlewares/db.connector');
const Helper = require('../helpers/response.handler');

exports.execute = async (req, res, next) => {
    const ON_DEMAND_DB = req.headers['app_id'];
    const redisClient = Redis.createClient();

    redisClient.on('error', (error) => {
        if (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    }).on('connect', async () => {
        redisClient.hget('migrations', ON_DEMAND_DB, async (error, data) => {

            if (data != null) { next(); return; };
            try {
                exec("node migration.js up " + ON_DEMAND_DB, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);

                    redisClient.hset('migrations', ON_DEMAND_DB, 1);
                    next();
                });
            } catch (error) {
                Helper.sendError({ responder: res, trace: error }, req.query.debug);
            }
        });
    });
}