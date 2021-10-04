const fs = require('fs');
const path = require('path');
const Redis = require('redis');
const { exec } = require("child_process");
const { Sequelize, Model } = require('sequelize');
const dbModels = require('../models');
const modelsDir = path.join(__dirname, '../models');
const Helper = require('../helpers/response.handler');

require('dotenv').config();

exports.openConnection = async (req, res, next) => {
    const ON_DEMAND_DB = req.headers['app_id'];

    const db = {};
    let sequelize;

    sequelize = new Sequelize(ON_DEMAND_DB, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: "mysql",
        logging: console.log,
        pool: {
            max: 25,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });

    fs
        .readdirSync(modelsDir)
        .filter(file => {
            return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
        })
        .forEach(file => {
            const model = require(path.join(modelsDir, file))(sequelize, Sequelize.DataTypes, Model);
            db[model.name] = model;
        });

    Object.keys(db).forEach(modelName => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    dbModels[ON_DEMAND_DB] = db;

    _syncDBWithModel(ON_DEMAND_DB, sequelize, req, res, next);
};

const _syncDBWithModel = async (db, sequelize, req, res, next) => {
    let throwErrorOnce = true;
    const redisClient = Redis.createClient();

    redisClient.on('error', (error) => {
        if (error) {
            if (throwErrorOnce) {
                throwErrorOnce = false;
                Helper.sendError({
                    key: 'APP',
                    code: 'ER_ECONNREFUSED',
                    responder: res,
                    trace: error
                }, req.query.debug);
            }
        }
    }).on('connect', async () => {
        redisClient.hget('migrations', db, async (error, data) => {
            if (data != null) { next(); return; };

            try {
                await sequelize.sync({ alter: true });
                try {
                    const queryInterface = sequelize.getQueryInterface();
                    await queryInterface.createTable('mysql_migrations_347ertt3e', {
                        timestamp: {
                            type: Sequelize.STRING,
                            allowNull: false,
                            unique: true
                        }
                    });
                    exec("node migration.js up " + db, (error, stdout, stderr) => {
                        console.log("1313");
                        redisClient.hset('migrations', db, 1);
                        next();
                    });
                } catch (error) {
                    Helper.sendError({
                        key: 'APP',
                        code: 'ER_APP_NOT_FOUND',
                        input: db,
                        responder: res,
                        statusCode: 404,
                        trace: error
                    }, req.query.debug);
                }
            } catch (error) {
                Helper.sendError({
                    key: 'APP',
                    code: 'ER_APP_NOT_FOUND',
                    input: db,
                    responder: res,
                    statusCode: 404,
                    trace: error
                }, req.query.debug);
            }
        });
    });
}