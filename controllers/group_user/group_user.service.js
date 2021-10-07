const dbModels = require('../../models');
let excludeColumns = ['deletedAt'];

let GroupUserService = {

    findAll: async (guid) => {
        const GroupUserModel = dbModels['onDemandDB'].group_user;

        return new Promise(function (resolve, reject) {
            GroupUserModel.findAll({ where: { guid: guid }, attributes: { exclude: excludeColumns }, raw: true })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    findOne: async (guid, uid) => {
        const GroupUserModel = dbModels['onDemandDB'].group_user;

        return new Promise(function (resolve, reject) {
            GroupUserModel.findOne({ where: { guid: guid, uid: uid }, attributes: { exclude: excludeColumns }, raw: true })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    create: async (body) => {
        const GroupUserModel = dbModels['onDemandDB'].group_user;

        return new Promise(function (resolve, reject) {
            GroupUserModel.create(body)
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    update: async (guid, uid, body) => {
        const GroupUserModel = dbModels['onDemandDB'].group_user;

        return new Promise(function (resolve, reject) {
            GroupUserModel.update(body, { where: { guid: guid, uid: uid } })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    delete: async (guid, uid) => {
        const GroupUserModel = dbModels['onDemandDB'].group_user;

        return new Promise(function (resolve, reject) {
            GroupUserModel.destroy({ where: { guid: guid, uid: uid } })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    }
};

module.exports = GroupUserService;