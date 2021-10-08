const dbModels = require('../../models');
const RoleModel = dbModels['onDemandDB'].role;
let excludeColumns = ['createdBy', 'updatedAt', 'updatedBy'];

let RoleService = {

    findAll: async () => {
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