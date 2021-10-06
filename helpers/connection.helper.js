const fs = require('fs');
const path = require('path');
const Redis = require('redis');
const dbModels = require('../models');
const { exec } = require("child_process");
const Helper = require('./response.helper');
const { Sequelize, Model } = require('sequelize');
const modelsDir = path.join(__dirname, '../models');

require('dotenv').config();

exports.configureDBConnection = async (appId, apiType, req, res, callback) => {
    const ON_DEMAND_DB = appId;

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
    db.apiType = apiType;

    dbModels['onDemandDB'] = db;

    _syncSchemaWithModel(ON_DEMAND_DB, sequelize, req, res, callback);
};

/**
 * Summary: Run migration files
 *
 * Description: Function will execute the migration files when new migration files gets added in migrations folder present in rootDir
 *
 * @since      x.x.x
 *
 * @param {type}   db            Holding name of the current db instance
 * @param {type}   sequelize     Sequelize connection object
 * @param {type}   req           Express HTTP Request object
 * @param {Object} res           Express HTTP Reponse object
 * @param {type}   next          Call the next middleware function in the stack
 *
 *
 * @return
 */
const _syncSchemaWithModel = async (db, sequelize, req, res, callback) => {
    let throwErrorOnce = true;
    // Initalize redis connection
    const redisClient = Redis.createClient();

    redisClient.on('error', (error) => {
        if (error && throwErrorOnce) {
            Helper.sendError({
                key: 'APP',
                code: 'ER_ECONNREFUSED',
                responder: res,
                trace: error
            }, req.query.debug);

            throwErrorOnce = false;
        }
    }).on('connect', async () => {
        // Get migrations hash from redis for current database
        redisClient.hget('migrations', db, async (error, data) => {
            if (data != null) { callback(); return; };

            try {
                // Sync existing model with database
                await sequelize.sync({ alter: true });

                // Create table if not exists in current database
                const queryInterface = sequelize.getQueryInterface();
                await queryInterface.createTable('mysql_migrations_347ertt3e', {
                    timestamp: {
                        type: Sequelize.STRING,
                        allowNull: false,
                        unique: true
                    }
                });

                // Execute new migration files
                exec("node migration.js up " + db, (error, stdout, stderr) => {
                    // Set migrations hash from redis for current database
                    redisClient.hset('migrations', db, 1);
                    callback();
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
        });
    });
}