"use strict";

const UserService = require('../user/user.service');
const GroupUserService = require('./group_user.service');
const GroupBannedUserService = require('./bannedusers.service');
const Helper = require('../../helpers/response.helper');

let GroupBannedUserController = {

    findAll: async (req, res) => {
        let req_guid = req.params.guid;

        try {
            let group_users = await GroupBannedUserService.findAll(req_guid);
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

    update: async (req, res) => {
        let req_uid = req.params.uid;
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
            let result = await GroupUserService.update(req_guid, req_uid, { isBanned: 1 });
            if (result) {
                Helper.sendResponse({
                    key: 'GROUP_USER',
                    input: req_uid,
                    responder: res,
                    statusCode: 200,
                    code: 'MSG_GROUP_USER_BANNED',
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

    delete: async (req, res) => {
        let req_uid = req.params.uid;
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
            const group_user = await GroupBannedUserService.findOne(req_guid, req_uid);
            if (!group_user) return Helper.sendError({
                key: 'GROUP_USER',
                input: req_uid,
                responder: res,
                statusCode: 404,
                code: 'ER_GROUP_USER_NOT_FOUND',
            });
        }

        try {
            let result = await GroupBannedUserService.update(req_guid, req_uid, { isBanned: 0 });
            if (result) {
                Helper.sendResponse({
                    key: 'GROUP_USER',
                    input: req_uid,
                    responder: res,
                    statusCode: 200,
                    code: 'MSG_GROUP_USER_UNBANNED',
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
    }
};

module.exports = GroupBannedUserController;