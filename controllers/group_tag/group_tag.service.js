const dbModels = require('../../models');
const GroupTagModel = dbModels['onDemandDB'].group_tag;

let GroupTagService = {

    bulkCreate: async (body) => {
        return new Promise(function (resolve, reject) {
            GroupTagModel.bulkCreate(body, { returning: true })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    delete: async (guid) => {
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