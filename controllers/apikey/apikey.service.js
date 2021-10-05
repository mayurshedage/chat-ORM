const dbModels = require('../../models');
let excludeColumns = ['createdBy', 'updatedAt', 'deletedAt'];

let APIKeyService = {

    findAll: async (database) => {
        const APIKeyModel = dbModels[database].apikey;

        return new Promise(function (resolve, reject) {
            APIKeyModel.findAll({ attributes: { exclude: excludeColumns }, raw: true })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    findOne: async (database, apiKey) => {
        const APIKeyModel = dbModels[database].apikey;

        return new Promise(function (resolve, reject) {
            APIKeyModel.findOne({ where: { apiKey: apiKey }, attributes: { exclude: excludeColumns }, raw: true })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    create: async (database, body) => {
        const APIKeyModel = dbModels[database].apikey;

        return new Promise(function (resolve, reject) {
            APIKeyModel.create(body)
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    update: async (database, apiKey, body) => {
        const APIKeyModel = dbModels[database].apikey;
        console.log(body);
        console.log(apiKey);
        return new Promise(function (resolve, reject) {
            APIKeyModel.update(body, { where: { apiKey: apiKey } })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    delete: async (database, apiKey) => {
        const APIKeyModel = dbModels[database].apikey;

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