const fs = require('fs');
const path = require('path');
const { QueryTypes, Sequelize } = require('sequelize');
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
            const model = require(path.join(modelsDir, file))(sequelize, Sequelize.DataTypes);
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

    try {
        await sequelize.query("SELECT uid FROM `users` limit 1", { type: QueryTypes.SELECT });
        next();
    } catch (error) {
        Helper.sendError({
            key: 'APP',
            code: 'ER_APP_NOT_FOUND',
            input: ON_DEMAND_DB,
            responder: res,
            statusCode: 404,
            trace: error
        }, req.query.debug);
    }
};