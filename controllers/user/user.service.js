const dbModels = require('../../models');
let excludeColumns = ['lastActiveAt', 'statusMessage', 'credits', 'createdBy', 'updatedBy', 'deletedBy', 'updatedAt', 'deletedAt'];

let UserService = {

    findAll: async () => {
        const UserSchema = dbModels['onDemandDB'].user;

        return new Promise(function (resolve, reject) {
            UserSchema.findAll({ attributes: { exclude: excludeColumns }, raw: true })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    findOne: async (uid) => {
        const UserSchema = dbModels['onDemandDB'].user;

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
        const UserSchema = dbModels['onDemandDB'].user;

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
        const UserSchema = dbModels['onDemandDB'].user;

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
        const UserSchema = dbModels['onDemandDB'].user;

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