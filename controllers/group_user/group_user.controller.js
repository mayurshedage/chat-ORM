"use strict";

const UserService = require('../user/user.service');
const GroupService = require('../group/group.service');
const GroupUserService = require('./group_user.service');
const Helper = require('../../helpers/response.helper');

let GroupUserController = {

    findAll: async (req, res, whereClause = {}) => {
        let response = new Object({
            req: req,
            res: res
        });
        let debug = new Object();
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';
        let req_guid = req.params.guid;

        try {
            let group_users = await GroupUserService.findAll(req_guid, whereClause);

            if (group_users.length == 0) {
                response['data'] = group_users;
            } else {
                let filteredGroupUsers = [];

                group_users.forEach(row => {
                    filteredGroupUsers.push(Helper.removeEmptyValues(row));
                });
                response['data'] = filteredGroupUsers;
            }
        } catch (error) {
            response['error'] = {
                code: errorCode,
                params: []
            }
            debug['group:findAll:error'] = error;
        }
        response['debugTrace'] = debug;

        Helper.send(response);
    },

    findOne: async (req, res) => {
        let response = new Object({
            req: req,
            res: res
        });
        let debug = new Object();
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';
        let req_uid = req.params.uid;
        let req_guid = req.params.guid;

        try {
            let group_user = await GroupUserService.findOne(req_guid, req_uid);

            if (group_user) {
                response['data'] = group_user;
            } else {
                response['error'] = {
                    code: 'ERR_NOT_A_MEMBER',
                    params: {
                        uid: req_uid,
                        guid: req_guid
                    }
                }
            }
        } catch (error) {
            response['error'] = {
                code: errorCode,
                params: []
            }
            debug['group:find:error'] = error;
        }
        response['debugTrace'] = debug;

        Helper.send(response);
    },

    create: async (req, res) => {
        let response = new Object({
            req: req,
            res: res
        });
        let debug = new Object();
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';
        let req_uid = req.body.uid;
        let req_guid = req.params.guid;
        let addUserToGroup = req.body;

        addUserToGroup.uid = req_uid;
        addUserToGroup.guid = req_guid;
        addUserToGroup.joinedAt = Math.floor(+new Date() / 1000);

        try {
            let group_user = await GroupUserService.create(addUserToGroup);

            if (group_user) {
                response['data'] = Helper.removeEmptyValues(group_user);

                let groups = await GroupUserService.findAll(req_guid);
                await GroupService.update(req_guid, { membersCount: groups.length });
            }
        } catch (error) {
            if (error.hasOwnProperty('name') && error.name == 'SequelizeUniqueConstraintError') {
                response['error'] = {
                    code: 'ERR_ALREADY_JOINED',
                    params: {
                        uid: req_uid,
                        guid: req_guid
                    }
                }
            } else {
                response['error'] = {
                    code: errorCode,
                    params: []
                }
                debug['group:create:error'] = error;
            }
        }
        response['debugTrace'] = debug;

        Helper.send(response);
    },

    update: async (req, res) => {
        let response = new Object({
            req: req,
            res: res
        });
        let debug = new Object();
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';
        let req_uid = req.params.uid;
        let req_guid = req.params.guid;
        let groupUserToUpdate = req.body;

        try {
            let result = await GroupUserService.update(req_guid, req_uid, groupUserToUpdate);

            if (result && result[0] == 1) {
                let group_user = await GroupUserService.findOne(req_guid, req_uid);

                response['data'] = Helper.removeEmptyValues(group_user);
            } else {
                response['error'] = {
                    code: 'ERR_NOT_A_MEMBER',
                    params: {
                        uid: req_uid,
                        guid: req_guid
                    }
                }
            }
        } catch (error) {
            response['error'] = {
                code: errorCode,
                params: []
            }
            debug['group:update:error'] = error;
        }
        response['debugTrace'] = debug;

        Helper.send(response);
    },

    delete: async (req, res) => {
        let response = new Object({
            req: req,
            res: res
        });
        let debug = new Object();
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';
        let req_uid = req.params.uid;
        let req_guid = req.params.guid;

        try {
            let result = await GroupUserService.delete(req_guid, req_uid);

            if (result) {
                response['data'] = {
                    code: 'OK_GROUP_LEFT',
                    params: {
                        uid: req_uid,
                        guid: req_guid
                    }
                }
                let groups = await GroupUserService.findAll(req_guid);
                await GroupService.update(req_guid, { membersCount: groups.length });
            } else {
                response['error'] = {
                    code: 'ERR_NOT_A_MEMBER',
                    params: {
                        uid: req_uid,
                        guid: req_guid
                    }
                }
            }
        } catch (error) {
            response['error'] = {
                code: errorCode,
                params: []
            }
            debug['group:delete:error'] = error;
        }
        response['debugTrace'] = debug;

        Helper.send(response);
    },

    banUnban: async (key, req, res) => {
        let req_uid = req.params.uid;
        let req_guid = req.params.guid;

        let code = 'OK_UNBANNED_USER_FROM_GROUP';
        let whereClause = { isBanned: 0 };

        if (key === 'ban') {
            code = 'OK_BANNED_USER_FROM_GROUP'; whereClause = { isBanned: 1 };
        }

        try {
            let result = await GroupUserService.update(req_guid, req_uid, whereClause);

            if (result) {
                response['data'] = {
                    code: code,
                    params: {
                        uid: req_uid,
                        guid: req_guid
                    }
                }
            } else {
                response['error'] = {
                    code: 'ERR_NOT_A_MEMBER',
                    params: {
                        uid: req_uid,
                        guid: req_guid
                    }
                }
            }
        } catch (error) {
            response['error'] = {
                code: errorCode,
                params: []
            }
            debug['group:banUnban:error'] = error;
        }
        response['debugTrace'] = debug;

        Helper.send(response);
    }
};

module.exports = GroupUserController;