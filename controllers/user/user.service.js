const dbModels = require('../../models');
let excludeColumns = ['lastActiveAt', 'statusMessage', 'credits', 'createdBy', 'updatedBy', 'deletedBy', 'updatedAt', 'deletedAt'];

let UserService = {

    findAll: async (database) => {
        const UserSchema = dbModels[database].user;

        return new Promise(function (resolve, reject) {
            UserSchema.findAll({ attributes: { exclude: excludeColumns } })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    findOne: async (database, uid) => {
        const UserSchema = dbModels[database].user;

        return new Promise(function (resolve, reject) {
            UserSchema.findOne({ where: { uid: uid }, attributes: { exclude: excludeColumns } })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    create: async (database, body) => {
        const UserSchema = dbModels[database].user;

        return new Promise(function (resolve, reject) {
            UserSchema.create(body)
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    update: async (database, uid, body) => {
        const UserSchema = dbModels[database].user;
        console.log(body);
        console.log(uid);
        return new Promise(function (resolve, reject) {
            UserSchema.update(body, { where: { uid: uid } })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    delete: async (database, uid) => {
        const UserSchema = dbModels[database].user;

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