const dbModels = require('../../models');
const Op = dbModels['onDemandDB'].Sequelize.Op;
const UserSchema = dbModels['onDemandDB'].user;
let excludeColumns = ['lastActiveAt', 'statusMessage', 'credits', 'createdBy', 'updatedBy', 'deletedBy', 'updatedAt', 'deletedAt'];

let UserService = {

    findAll: async () => {
        return new Promise(function (resolve, reject) {
            UserSchema.findAll({ attributes: { exclude: excludeColumns }, raw: true })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    bulkFind: async (users = []) => {
        return new Promise(function (resolve, reject) {
            UserSchema.findAll({ where: { uid: { [Op.in]: [users] } }, attributes: { exclude: excludeColumns }, raw: true })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    console.log('error', err)
                    // reject(err);
                });
        });
    },

    findOne: async (uid) => {
        return new Promise(function (resolve, reject) {
            UserSchema.findOne({ where: { uid: uid }, attributes: { exclude: excludeColumns }, raw: true })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    create: async (body) => {
        return new Promise(function (resolve, reject) {
            UserSchema.create(body)
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    update: async (uid, body) => {
        return new Promise(function (resolve, reject) {
            UserSchema.update(body, { where: { uid: uid } })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    delete: async (uid) => {
        return new Promise(function (resolve, reject) {
            UserSchema.destroy({ where: { uid: uid } })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    }
};

module.exports = UserService;