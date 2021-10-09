const dbModels = require('../../models');
const FriendModel = dbModels['onDemandDB'].friend;

let GroupUserService = {

    findAll: async (uid, whereAddOn = {}) => {
        const whereClause = { uid: uid };

        return new Promise(function (resolve, reject) {
            FriendModel.findAll({ where: { ...whereClause, ...whereAddOn }, attributes: { exclude: excludeColumns }, raw: true })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    create: async (body) => {
        return new Promise(function (resolve, reject) {
            FriendModel.create(body)
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    delete: async (uid, fuids) => {
        return new Promise(function (resolve, reject) {
            FriendModel.destroy({ where: { uid: uid, fuid: fuids } })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    }
};

module.exports = GroupUserService;