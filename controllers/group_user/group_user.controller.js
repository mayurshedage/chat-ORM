"use strict";

const UserService = require('../user/user.service');
const GroupService = require('../group/group.service');
const GroupUserService = require('./group_user.service');
const Helper = require('../../helpers/response.helper');

let GroupUserController = {

    findAll: async (req, res) => {
        try {
            let group_users = await GroupUserService.findAll();
            if (group_users.length == 0) return res.status(200).json({ data: group_users });

            let filterRows = [];
            group_users.forEach(row => {
                filterRows.push(Helper.removeEmptyValues(row));
            });
            res.status(200).json({ data: Helper.removeEmptyValues(filterRows) });
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    },

    findOne: async (req, res) => {
        let req_uid = req.params.uid;
        let req_guid = req.params.guid;

        try {
            let group_user = await GroupUserService.findOne(req_guid, req_uid);
            if (group_user) return res.status(200).json({ data: Helper.removeEmptyValues(group_user) });

            Helper.sendError({
                key: 'GROUP_USER',
                input: req_uid,
                responder: res,
                statusCode: 404,
                code: 'ER_GROUP_USER_NOT_FOUND',
            });
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    },

    create: async (req, res) => {
        let addUserToGroup = {};
        let req_uid = req.body.uid;
        let req_guid = req.params.guid;

        if (req_uid) {
            const user = await UserService.findOne(req_uid);
            if (!user) return Helper.sendError({
                key: 'USER',
                input: req_uid,
                responder: res,
                statusCode: 404,
                code: 'ER_USER_NOT_FOUND',
            });
        }

        addUserToGroup.guid = req_guid;
        addUserToGroup.uid = req_uid;
        addUserToGroup.scope = req.body['scope'] || 'participant';
        addUserToGroup.joinedAt = Math.floor(+new Date() / 1000);

        try {
            let group_user = await GroupUserService.create(addUserToGroup);

            if (group_user) return res.status(201).json({ data: Helper.removeEmptyValues(group_user) });
        } catch (error) {
            if (error.hasOwnProperty('name') && error.name == 'SequelizeUniqueConstraintError') {
                return Helper.sendError({
                    key: 'GROUP_USER',
                    input: addUserToGroup.uid,
                    responder: res,
                    statusCode: 409,
                    code: 'ER_DUP_ENTRY',
                });
            }
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    },

    update: async (req, res) => {
        let req_uid = req.params.uid;
        let req_guid = req.params.guid;
        let groupUserToUpdate = req.body;

        if (req_uid) {
            const user = await UserService.findOne(req_uid);
            if (!user) return Helper.sendError({
                key: 'USER',
                input: req_uid,
                responder: res,
                statusCode: 404,
                code: 'ER_USER_NOT_FOUND',
            });
            const group_user = await GroupUserService.findOne(req_guid, req_uid);
            if (!group_user) return Helper.sendError({
                key: 'GROUP_USER',
                input: req_uid,
                responder: res,
                statusCode: 404,
                code: 'ER_GROUP_USER_NOT_FOUND',
            });
        }

        try {
            let result = await GroupUserService.update(req_guid, req_uid, groupUserToUpdate);
            if (result) {
                let group_user = await GroupUserService.findOne(req_guid, req_uid);
                res.status(200).json({ data: Helper.removeEmptyValues(group_user) });
            } else {
                Helper.sendError({
                    key: 'GROUP_USER',
                    input: req_uid,
                    responder: res,
                    statusCode: 404,
                    code: 'ER_GROUP_USER_NOT_FOUND',
                });
            }
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    },

    delete: async (req, res) => {
        let req_uid = req.params.uid;
        let req_guid = req.params.guid;

        try {
            let result = await GroupUserService.delete(req_guid, req_uid);
            if (result) {
                Helper.sendResponse({
                    key: 'GROUP_USER',
                    input: req_uid,
                    responder: res,
                    statusCode: 200,
                    code: 'MSG_GROUP_USER_KICKED',
                });
            } else {
                Helper.sendError({
                    key: 'GROUP_USER',
                    input: req_uid,
                    responder: res,
                    statusCode: 404,
                    code: 'ER_GROUP_USER_NOT_FOUND',
                });
            }
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    },

    checkGroupExists: async (req, res, next) => {
        let guid = req.params.guid;

        try {
            let group = await GroupService.findOne(guid);
            if (!group) return Helper.sendError({
                key: 'GROUP',
                input: guid,
                responder: res,
                statusCode: 404,
                code: 'ER_GROUP_NOT_FOUND',
            });
            next();
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    }
};

module.exports = GroupUserController;