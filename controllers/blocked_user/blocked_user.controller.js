"use strict";

const UserService = require('../user/user.service');
const BlockedUserService = require('./blocked_user.service');
const AppResponse = require('../../helpers/response.helper');
const { removeEmptyValues } = require('../../helpers/global.helper');

let BlockedUserController = {

    findAll: async (req, res) => {
        let response = new Object({
            req: req,
            res: res
        });
        let debug = new Object();
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';
        let req_uid = req.params.uid;

        try {
            let blocked_users = await BlockedUserService.findAll(req_uid);

            if (blocked_users.length == 0) {
                response['data'] = blocked_users;
            } else {
                let filteredBlockUsers = [];

                blocked_users.forEach(row => {
                    filteredBlockUsers.push(
                        removeEmptyValues(
                            JSON.parse(JSON.stringify(row.user))
                        )
                    );
                });
                response['data'] = filteredBlockUsers;
            }
        } catch (error) {
            response['error'] = {
                code: errorCode,
                params: []
            }
            debug['blockUser:validate:error'] = error;
        }
        response['debugTrace'] = debug;

        AppResponse.send(response);
    },

    block: async (req, res) => {
        let response = new Object({
            req: req,
            res: res
        });
        let debug = new Object();
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';

        try {
            const data = await blockedUserManager(req.body['blockedUids'], req);

            response['data'] = data;
        } catch (error) {
            response['error'] = {
                code: errorCode,
                params: []
            }
            debug['blockUser:block:error'] = error;
        }
        response['debugTrace'] = debug;

        AppResponse.send(response);
    },

    unblock: async (req, res) => {
        let response = new Object({
            req: req,
            res: res
        });
        let debug = new Object();
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';

        let responseData = {};
        let validUsers = [];
        let req_uid = req.params.uid;
        let blockedUids = req.body['blockedUids'];

        try {
            let blocked_users = await BlockedUserService.findAll(req_uid, {
                where: {
                    uid: req_uid
                },
                raw: true
            });
            response['data'] = await (async () => {
                for (let i = 0; i < blocked_users.length; i++) {
                    validUsers.push(blocked_users[i]['blockedUid']);
                }
                let usersToUnblock = blockedUids.filter(x => validUsers.includes(x));
                let notFountUsers = blockedUids.filter(x => !usersToUnblock.includes(x));

                for (let index = 0; index < usersToUnblock.length; index++) {
                    let blockedUid = usersToUnblock[index];
                    responseData[blockedUid] = {
                        "success": true,
                        "message": AppResponse.getSuccessMessage({
                            code: 'OK_UNBLOCKED',
                            params: {
                                req_uid: req_uid,
                                blockedUid: blockedUid
                            }
                        })['message']
                    }

                }
                for (let index = 0; index < notFountUsers.length; index++) {
                    let blockedUid = notFountUsers[index];
                    responseData[blockedUid] = {
                        "success": true,
                        "message": AppResponse.getSuccessMessage({
                            code: 'OK_ALREADY_UNBLOCKED',
                            params: {
                                req_uid: req_uid,
                                blockedUid: blockedUid
                            }
                        })['message']
                    }
                }
                await BlockedUserService.delete(req_uid, usersToUnblock);
            })().then(_ => { return responseData });
        } catch (error) {
            response['error'] = {
                code: errorCode,
                params: []
            }
            debug['blockUser:unblock:error'] = error;
        }
        response['debugTrace'] = debug;

        AppResponse.send(response);
    }
};

const blockedUserManager = async (blockedUids, req) => {
    let response = {};
    let users = await UserService.bulkFind(blockedUids);

    return (async () => {
        let req_uid = req.params.uid;

        for (let i = 0; i < blockedUids.length; i++) {
            let blockedUid = blockedUids[i];

            if (users[i] && users[i].hasOwnProperty('uid')) {
                if (blockedUid == req_uid) {
                    response[blockedUid] = {
                        "success": false,
                        "message": AppResponse.getErrorMessage({
                            code: 'ERR_CANNOT_BLOCK_SELF',
                            params: {
                                uid: req_uid,
                                blockedUid: blockedUid
                            }
                        })['message']
                    }
                } else {
                    try {
                        await BlockedUserService.create({ uid: req.params.uid, blockedUid: blockedUid, blockedAt: Math.floor(+new Date() / 1000) });

                        response[blockedUid] = {
                            "success": true,
                            "message": AppResponse.getSuccessMessage({
                                code: 'OK_BLOCKED',
                                params: {
                                    uid: req_uid,
                                    blockedUid: blockedUid
                                }
                            })['message']
                        }
                    } catch (error) {
                        if (error.hasOwnProperty('name') && error.name == 'SequelizeUniqueConstraintError') {
                            response[blockedUid] = {
                                "success": true,
                                "message": AppResponse.getSuccessMessage({
                                    code: 'OK_ALREADY_BLOCKED',
                                    params: {
                                        uid: req_uid,
                                        blockedUid: blockedUid
                                    }
                                })['message']
                            }
                        }
                    }
                }
            } else {
                response[blockedUid] = {
                    "success": false,
                    "message": AppResponse.getErrorMessage({
                        code: 'ERR_UID_NOT_FOUND',
                        params: {
                            uid: blockedUid
                        }
                    })['message']
                }
            }
        }
    })().then(_ => { return response });
};

module.exports = BlockedUserController;