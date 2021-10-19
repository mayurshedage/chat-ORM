const dbModels = require('../../models');
const Op = dbModels['onDemandDB'].Sequelize.Op;
const CallSchema = dbModels['onDemandDB'].call;
let excludeColumns = [];

let UserService = {

    findAll: async () => {
        return new Promise(function (resolve, reject) {
            CallSchema.findAll({ attributes: { exclude: excludeColumns }, raw: true })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    findOne: async (sessionid) => {
        return new Promise(function (resolve, reject) {
            CallSchema.findOne({ where: { sessionid: sessionid }, attributes: { exclude: excludeColumns }, raw: true })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    create: async (body) => {
        return new Promise(function (resolve, reject) {
            CallSchema.create(body)
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    update: async (sessionid, body) => {
        return new Promise(function (resolve, reject) {
            CallSchema.update(body, { where: { sessionid: sessionid } })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    delete: async (sessionid) => {
        return new Promise(function (resolve, reject) {
            CallSchema.destroy({ where: { sessionid: sessionid } })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    }
};

module.exports = UserService;