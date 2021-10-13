const dbModels = require('../../models');
const Op = dbModels['onDemandDB'].Sequelize.Op;
const UserModel = dbModels['onDemandDB'].user;
const FriendModel = dbModels['onDemandDB'].friend;

let excludeColumns = ['uid', 'fuid', 'status', 'createdAt', 'updatedAt'];
let excludeColumnsUser = ['lastActiveAt', 'statusMessage', 'credits', 'createdBy', 'updatedBy', 'deletedBy', 'updatedAt', 'deletedAt'];

let GroupUserService = {

    findAll: async (uid, whereAddOn = {}) => {
        const whereClauseUser = { [Op.or]: [{ fuid: uid }, { uid: uid }] };

        return new Promise(function (resolve, reject) {
            FriendModel.findAll({
                where: whereClauseUser,
                include: {
                    model: UserModel,
                    attributes: { exclude: excludeColumnsUser }
                },
                attributes: { exclude: excludeColumns }
            })
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

    update: async (uid, fuid, body) => {
        return new Promise(function (resolve, reject) {
            FriendModel.update(body, { where: { uid: uid, fuid: fuid } })
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