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

let db;
let debugSQL = {
    operator: []
};

const removeEmptyValues = (
    obj = {}
) => {
    Object.keys(obj).forEach((key) => (obj[key] === undefined || obj[key] === null) && delete obj[key]);
    return obj;
};

const getCryptoHash = (
    method = 'sha1',
    update = crypto.randomBytes(64).toString('hex')
) => {
    return crypto.createHash(method).update(update).digest('hex');
};

const getUid = (req) => {
    let uid = null;

    if (req.hasOwnProperty('subjectUser')) {
        uid = req['subjectUser'] ?? uid;
    }
    return uid;
};

const getCurrentTime = () => {
    return Math.floor(Date.now() / 1000);
}

const generateSessionId = (calldata) => {
    return getCurrentTime() + getCryptoHash('sha1', Object.values(calldata).join('_'));
};

const getAppPrefix = () => {
    return process.env.APP_PREFIX;
};

const getAppId = (req) => {
    let appId = false;

    const hostName = req.headers.host;
    let splitHttpHost = hostName.split('.');

    if (splitHttpHost.length == 4) {
        appId = splitHttpHost[0] ?? false;
    }

    if (!appId) {
        appId = req.headers.appid ? req.headers.appid.trim() : false;
    }

    return appId;
};

const getInstanceUser = (
    appId = ''
) => {
    return appId ? getAppPrefix() + appId : appId;
};

const getInstancePassword = (
    user = ''
) => {
    const salt = process.env.DB_PASS_SALT;

    return getCryptoHash('md5', (user + salt));
};

const getRegionSecret = () => {
    return process.env.REGION_SECRET
};

const getCreatorConnection = async () => {
    const { host, port, user, password } = config['connections']['creator'];

    return await mysql.createConnection({ host, port, user, password });
};

const getSequelizeConnection = (
    req, res
) => {
    const appId = getAppId(req);
    const user = getInstanceUser(appId);
    const password = getInstancePassword(user);

    return new Sequelize(user, user, password, {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",
        benchmark: true,
        logging: (query, time) => {
            debugSQL['operator'].push({
                query: query.replace("Executed (default): ", ""),
                time: `${time}ms`
            });
        }
    });
};

const configureModels = (
    sequelize
) => {
    db = new Object();

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

const configureCurrentInstance = async (
    req, res, callback
) => {
    let sequelize = getSequelizeConnection(req, res);
    configureModels(sequelize);

    if (callback) callback();
};

const migrate = async (
    req, res
) => {
    const appId = getAppId(req);
    const sequelize = getSequelizeConnection(req, res);

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
        console.log('finished running migrations');
    });
}

module.exports = {
    debugSQL,
    getUid,
    migrate,
    getAppId,
    getAppPrefix,
    getCryptoHash,
    getCurrentTime,
    getInstanceUser,
    getRegionSecret,
    generateSessionId,
    removeEmptyValues,
    getInstancePassword,
    getCreatorConnection,
    getSequelizeConnection,
    configureCurrentInstance,
};