const dbModels = require('../../models');
const APIKeyModel = dbModels['onDemandDB'].apikey;
let excludeColumns = ['createdBy', 'updatedAt', 'deletedAt'];

let APIKeyService = {

    findAll: async () => {
        return new Promise(function (resolve, reject) {
            APIKeyModel.findAll({ attributes: { exclude: excludeColumns }, raw: true })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    findOne: async (apiKey) => {
        return new Promise(function (resolve, reject) {
            APIKeyModel.findOne({ where: { apiKey: apiKey }, attributes: { exclude: excludeColumns }, raw: true })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    create: async (body) => {
        return new Promise(function (resolve, reject) {
            APIKeyModel.create(body)
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    update: async (apiKey, body) => {
        return new Promise(function (resolve, reject) {
            APIKeyModel.update(body, { where: { apiKey: apiKey } })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    delete: async (apiKey) => {
        return new Promise(function (resolve, reject) {
            APIKeyModel.destroy({ where: { apiKey: apiKey } })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    }
};

module.exports = APIKeyService;