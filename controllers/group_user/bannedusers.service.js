const dbModels = require('../../models');
let excludeColumns = ['deletedAt'];

let GroupBannedUserService = {

    findAll: async (guid) => {
        const GroupUserModel = dbModels['onDemandDB'].group_user;

        return new Promise(function (resolve, reject) {
            GroupUserModel.findAll({ where: { guid: guid, isBanned: 1 }, attributes: { exclude: excludeColumns }, raw: true })
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
    }
};

module.exports = GroupBannedUserService;