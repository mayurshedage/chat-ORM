const dbModels = require('../../models');
let excludeColumns = ['password', 'updatedBy', 'updatedAt'];

let GroupService = {

    findAll: async (whereClauseAddOn = {}) => {
        const GroupModel = dbModels['onDemandDB'].group;
        const whereClause = {};

        return new Promise(function (resolve, reject) {
            GroupModel.findAll({ where: { ...whereClause, ...whereClauseAddOn }, attributes: { exclude: excludeColumns }, raw: true })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    findOne: async (guid) => {
        const GroupModel = dbModels['onDemandDB'].group;

        return new Promise(function (resolve, reject) {
            GroupModel.findOne({ where: { guid: guid }, attributes: { exclude: excludeColumns }, raw: true })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    create: async (body) => {
        const GroupModel = dbModels['onDemandDB'].group;

        return new Promise(function (resolve, reject) {
            GroupModel.create(body)
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    update: async (guid, body) => {
        const GroupModel = dbModels['onDemandDB'].group;

        return new Promise(function (resolve, reject) {
            GroupModel.update(body, { where: { guid: guid } })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    delete: async (guid) => {
        const GroupModel = dbModels['onDemandDB'].group;

        return new Promise(function (resolve, reject) {
            GroupModel.destroy({ where: { guid: guid } })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    }
};

module.exports = GroupService;