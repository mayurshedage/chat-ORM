"use strict";

const GroupService = require('./group.service');
const UserService = require('../user/user.service');
const GroupTagService = require('../group_tag/group_tag.service');
const Helper = require('../../helpers/response.helper');

let GroupController = {

    findAll: async (req, res) => {
        try {
            let groups = await GroupService.findAll(req);
            if (groups.length == 0) return res.status(200).json({ data: groups });

            let filterRows = [];
            groups.forEach(row => {
                filterRows.push(Helper.removeEmptyValues(row));
            });
            res.status(200).json({ data: Helper.removeEmptyValues(filterRows) });
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    },

    findOne: async (req, res) => {
        let req_group = req.params.guid;

        try {
            let group = await GroupService.findOne(req_group);
            if (group) return res.status(200).json({ data: Helper.removeEmptyValues(group) });

            Helper.sendError({
                key: 'GROUP',
                input: req_group,
                responder: res,
                statusCode: 404,
                code: 'ER_GROUP_NOT_FOUND',
            });
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    },

    create: async (req, res) => {
        let tags = [];
        let groupToCreate = req.body;

        if (req.body['owner']) {
            const user = await UserService.findOne(req.body['owner']);
            if (!user) return Helper.sendError({
                key: 'USER',
                input: req.body['owner'],
                responder: res,
                statusCode: 404,
                code: 'ER_USER_NOT_FOUND',
            });
        }
        groupToCreate.createdAt = Math.floor(+new Date() / 1000);
        let addedAt = Math.floor(+new Date() / 1000);

        try {
            let group = await GroupService.create(groupToCreate);

            if (group) res.status(201).json({ data: Helper.removeEmptyValues(group) });

            if (req.body.tags && req.body.tags.length) {
                if (typeof req.body.tags == 'string') {
                    tags.push({ guid: group.guid, tag: req.body.tags, addedAt: addedAt })
                } else if (typeof req.body.tags == 'object') {
                    req.body.tags.map(tag => {
                        return tags.push({ guid: group.guid, tag: tag, addedAt: addedAt });
                    });
                }
                if (tags.length) return await GroupTagService.bulkCreate(tags);
            }
            if (tags.length) await GroupTagService.bulkCreate({ tag: tags });
        } catch (error) {
            console.log(error);
            if (error.hasOwnProperty('name') && error.name == 'SequelizeUniqueConstraintError') {
                return Helper.sendError({
                    key: 'GROUP',
                    input: groupToCreate.guid,
                    responder: res,
                    statusCode: 409,
                    code: 'ER_DUP_ENTRY',
                });
            }
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    },

    update: async (req, res) => {
        let tags = [];
        let guid = req.params.guid;
        let groupToUpdate = req.body;

        if (req.body['owner']) {
            const user = await UserService.findOne(req.body['owner']);
            if (!user) return Helper.sendError({
                key: 'USER',
                input: req.body['owner'],
                responder: res,
                statusCode: 404,
                code: 'ER_USER_NOT_FOUND',
            });
        }
        groupToUpdate.updatedAt = Math.floor(+new Date() / 1000);
        let addedAt = Math.floor(+new Date() / 1000);

        try {
            let result = await GroupService.update(guid, groupToUpdate);
            if (result) {
                let group = await GroupService.findOne(guid);
                res.status(200).json({ data: Helper.removeEmptyValues(group) });

                if (req.body.tags && req.body.tags.length) {
                    if (typeof req.body.tags == 'string') {
                        tags.push({ guid: group.guid, tag: req.body.tags, addedAt: addedAt })
                    } else if (typeof req.body.tags == 'object') {
                        req.body.tags.map(tag => {
                            return tags.push({ guid: group.guid, tag: tag, addedAt: addedAt });
                        });
                    }
                    if (tags.length) {
                        await GroupTagService.delete(guid);
                        await GroupTagService.bulkCreate(tags);
                    }
                }
            } else {
                Helper.sendError({
                    key: 'GROUP',
                    input: guid,
                    responder: res,
                    statusCode: 404,
                    code: 'ER_GROUP_NOT_FOUND',
                });
            }
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    },

    delete: async (req, res) => {
        let guid = req.params.guid;

        try {
            let result = await GroupService.delete(guid);
            if (result) {
                Helper.sendResponse({
                    key: 'GROUP',
                    input: guid,
                    responder: res,
                    statusCode: 200,
                    code: 'MSG_GROUP_DELETED',
                });
            } else {
                Helper.sendError({
                    key: 'GROUP',
                    input: guid,
                    responder: res,
                    statusCode: 404,
                    code: 'ER_GROUP_NOT_FOUND',
                });
            }
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    }
};

module.exports = GroupController;
