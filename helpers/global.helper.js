require('dotenv').config();

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { exec } = require("child_process");

const mysql = require('mysql2/promise');
const config = require('../config/database');
const { Sequelize, Model } = require('sequelize');

const dbModels = require('../models');
const modelsDir = path.join(__dirname, '../models');

module.exports = db = {};

const getAppPrefix = () => {
    return process.env.APP_PREFIX;
};

const getAppId = (req) => {
    let appId = false;

    const hostName = req.headers.host;
    let splitHttpHost = hostName.split('.');

    if (splitHttpHost.length == 4) {
        appId = splitHttpHost[0];
    }

    if (!appId) {
        appId = req.headers.appId.trim();
    }

    return appId;
};

const getInstanceUser = (appId) => {
    return getAppPrefix() + appId;
};

const getInstancePassword = (user) => {
    const salt = process.env.DB_PASS_SALT;
    return crypto.createHash('md5').update(user + salt).digest('hex');
};

const getRegionSecret = () => {
    return process.env.REGION_SECRET
};

const getCreatorConnection = async () => {
    const { host, port, user, password } = config['connections']['creator'];

    return await mysql.createConnection({ host, port, user, password });
};

const getSequelizeConnection = (req) => {
    const appId = getAppId(req);
    const user = getInstanceUser(appId);
    const password = getInstancePassword(user);

    return new Sequelize(user, user, password, {
        host: process.env.DB_HOST,
        dialect: "mysql",
        logging: console.log
    });
};

const configureModels = (sequelize) => {
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

    dbModels['onDemandDB'] = db;
}

const configureCurrentInstance = async (req, callback) => {
    let sequelize = getSequelizeConnection(req);
    configureModels(sequelize);

    if (callback) callback();
};

const migrate = async (req) => {
    const appId = getAppId(req);
    const sequelize = getSequelizeConnection(req);
    configureModels(sequelize);

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
    exec("node migration.js up " + appId, (error, stdout, stderr) => {
        console.log(stdout);
    });
}

module.exports = {
    configureCurrentInstance, getCreatorConnection, getInstancePassword, getInstanceUser, getRegionSecret, getSequelizeConnection, migrate, getAppId, getAppPrefix
};