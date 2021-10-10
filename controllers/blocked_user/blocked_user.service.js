const dbModels = require('../../models');
const Op = dbModels['onDemandDB'].Sequelize.Op;
const UserModel = dbModels['onDemandDB'].user;
const BlockedUserModel = dbModels['onDemandDB'].blocked_user;

let excludeColumns = ['uid', 'blockedUid', 'blockedAt'];
let excludeColumnsUser = ['lastActiveAt', 'statusMessage', 'credits', 'createdBy', 'updatedBy', 'deletedBy', 'updatedAt', 'deletedAt'];

let BlockedUserService = {

    findAll: async (uid, find = {}) => {
        const whereClauseUser = { [Op.or]: [{ blockedUid: uid }, { uid: uid }] };
        let filter = {
            where: whereClauseUser,
            include: {
                model: UserModel,
                attributes: { exclude: excludeColumnsUser }
            },
            attributes: { exclude: excludeColumns }
        }
        if (find) filter = find;
        return new Promise(function (resolve, reject) {
            BlockedUserModel.findAll(filter)
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    create: async (body) => {
        return new Promise(function (resolve, reject) {
            BlockedUserModel.create(body)
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    delete: async (uid, blockedUids) => {
        return new Promise(function (resolve, reject) {
            BlockedUserModel.destroy({ where: { uid: uid, blockedUid: blockedUids } })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    }
};

module.exports = BlockedUserService;