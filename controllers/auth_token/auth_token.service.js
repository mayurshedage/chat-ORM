const dbModels = require('../../models');
const AuthTokenModel = dbModels['onDemandDB'].auth_token;
let excludeColumns = ['apiKey', 'updatedAt', 'deletedAt'];

let AuthTokenService = {

    findAll: async () => {
        return new Promise(function (resolve, reject) {
            AuthTokenModel.findAll({ attributes: { exclude: excludeColumns }, raw: true })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    findOne: async (authToken) => {
        return new Promise(function (resolve, reject) {
            AuthTokenModel.findOne({ where: { authToken: authToken }, attributes: { exclude: excludeColumns }, raw: true })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    create: async (body) => {
        return new Promise(function (resolve, reject) {
            AuthTokenModel.create(body)
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    update: async (authToken, body) => {
        return new Promise(function (resolve, reject) {
            AuthTokenModel.update(body, { where: { authToken: authToken } })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    delete: async (authToken) => {
        return new Promise(function (resolve, reject) {
            AuthTokenModel.destroy({ where: { authToken: authToken } })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    }
};

module.exports = AuthTokenService;