const dbModels = require('../../models');
let excludeColumns = [];

let GroupTagService = {

    findAll: async (whereClauseAddOn = {}) => {
        const GroupTagModel = dbModels['onDemandDB'].group_tag;
        const whereClause = {};

        return new Promise(function (resolve, reject) {
            GroupTagModel.findAll({ where: { ...whereClause, ...whereClauseAddOn }, attributes: { exclude: excludeColumns }, raw: true })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    create: async (body) => {
        const GroupTagModel = dbModels['onDemandDB'].group_tag;

        return new Promise(function (resolve, reject) {
            GroupTagModel.create(body)
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    delete: async (guid) => {
        const GroupTagModel = dbModels['onDemandDB'].group_tag;

        return new Promise(function (resolve, reject) {
            GroupTagModel.destroy({ where: { guid: guid } })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    }
};

module.exports = GroupTagService;