const dbModels = require('../../models');
const Op = dbModels['onDemandDB'].Sequelize.Op;
const GroupModel = dbModels['onDemandDB'].group;
const GroupTagModel = dbModels['onDemandDB'].group_tag;

let excludeColumns = ['password', 'updatedBy', 'updatedAt'];
let excludeColumnsGroupTag = ['guid', 'tag', 'addedAt'];

let GroupService = {

    findAll: async (req) => {
        let tags = [];
        let tagsFilter = false;
        let whereClauseGroup = {};
        let whereClauseGroupTag = {};

        if (req.query.type) {
            whereClauseGroup = { type: req.query.type }
        }
        if (req.query.tags && req.query.tags.length) {
            if (typeof req.query.tags == 'string') {
                whereClauseGroupTag[Op.or] = [{ tag: req.query.tags }];
            } else {
                req.query.tags.map(tag => {
                    return tags.push({ tag: tag });
                });
                whereClauseGroupTag[Op.or] = tags;
            }
            tagsFilter = true;
        }

        return new Promise(function (resolve, reject) {
            let condition = {
                where: whereClauseGroup,
                attributes: { exclude: excludeColumns },
                raw: true
            };
            if (tagsFilter) {
                condition['include'] = {
                    model: GroupTagModel,
                    where: whereClauseGroupTag,
                    attributes: { exclude: excludeColumnsGroupTag }
                }
            }
            GroupModel.findAll(condition)
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    console.log(err);
                    reject(err);
                });
        });
    },

    findOne: async (guid) => {

        return new Promise(function (resolve, reject) {
            GroupModel.findOne({ where: { guid: guid }, attributes: { exclude: excludeColumns }, raw: true })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    create: async (body) => {

        return new Promise(function (resolve, reject) {
            GroupModel.create(body)
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    update: async (guid, body) => {

        return new Promise(function (resolve, reject) {
            GroupModel.update(body, { where: { guid: guid } })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    },

    delete: async (guid) => {

        return new Promise(function (resolve, reject) {
            GroupModel.destroy({ where: { guid: guid } })
                .then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
        });
    }
};

module.exports = GroupService;