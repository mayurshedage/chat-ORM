const dbModels = require('../../models');
let excludeColumns = ['createdBy', 'updatedAt', 'updatedBy'];

let RoleService = {

    findAll: async () => {
        const RoleModel = dbModels['onDemandDB'].role;

        return new Promise(function (resolve, reject) {
            RoleModel.findAll({ attributes: { exclude: excludeColumns }, raw: true })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    findOne: async (role) => {
        const RoleModel = dbModels['onDemandDB'].role;

        return new Promise(function (resolve, reject) {
            RoleModel.findOne({ where: { role: role }, attributes: { exclude: excludeColumns }, raw: true })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    create: async (body) => {
        const RoleModel = dbModels['onDemandDB'].role;

        return new Promise(function (resolve, reject) {
            RoleModel.create(body)
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    update: async (role, body) => {
        const RoleModel = dbModels['onDemandDB'].role;

        return new Promise(function (resolve, reject) {
            RoleModel.update(body, { where: { role: role } })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    delete: async (role) => {
        const RoleModel = dbModels['onDemandDB'].role;

        return new Promise(function (resolve, reject) {
            RoleModel.destroy({ where: { role: role } })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    }
};

module.exports = RoleService;