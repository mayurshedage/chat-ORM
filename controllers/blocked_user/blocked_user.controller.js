"use strict";

const UserService = require('../user/user.service');
const BlockedUserService = require('./blocked_user.service');
const Helper = require('../../helpers/response.helper');

let BlockedUserController = {

    findAll: async (req, res) => {
        let req_uid = req.params.uid;

        try {
            let blocked_users = await BlockedUserService.findAll(req_uid);
            if (blocked_users.length == 0) return res.status(200).json({ data: blocked_users });

            let filterRows = [];
            blocked_users.forEach(row => {
                filterRows.push(Helper.removeEmptyValues(JSON.parse(JSON.stringify(row.user))));
            });
            res.status(200).json({ data: Helper.removeEmptyValues(filterRows) });
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    },

    block: async (req, res) => {
        try {
            const data = await blockedUserManager(req.body['blockedUids'], req);
            res.json({ data: data });
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    },

    unblock: async (req, res) => {
        let response = {};
        let usersToUnblock = [];
        let req_uid = req.params.uid;
        let blockedUids = req.body['blockedUids'];

        try {
            let blocked_users = await BlockedUserService.findAll(req_uid, {
                where: {
                    uid: req_uid
                },
                raw: true
            });
            (async () => {
                for (let i = 0; i < blockedUids.length; i++) {
                    let uid = blockedUids[i];

                    if (blocked_users[i] && blocked_users[i].hasOwnProperty('blockedUid')) {
                        // unblock
                        response[blocked_users[i]['blockedUid']] = {
                            "success": true,
                            "message": `The user with UID ${req_uid} has unblocked user with UID ${blocked_users[i]['blockedUid']} successfully.`
                        }
                        usersToUnblock.push(blocked_users[i]['blockedUid']);
                    } else {
                        response[uid] = {
                            "success": true,
                            "message": `The user with UID ${req_uid} has not blocked the user with UID ${uid}.`
                        }
                    }
                }
                await BlockedUserService.delete(req_uid, usersToUnblock);
            })().then(_ => res.json({ data: response }));
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    }
};

const blockedUserManager = async (blockedUids, req) => {
    let response = {};
    let users = await UserService.bulkFind(blockedUids);

    return (async () => {
        for (let i = 0; i < blockedUids.length; i++) {
            let uid = blockedUids[i];

            if (users[i] && users[i].hasOwnProperty('uid')) {
                if (uid == req.params.uid) {
                    response[uid] = {
                        "success": false,
                        "message": `The UID ${req.params.uid} cannot block UID ${uid}.`
                    }
                } else {
                    try {
                        await BlockedUserService.create({ uid: req.params.uid, blockedUid: uid, blockedAt: Math.floor(+new Date() / 1000) });

                        response[uid] = {
                            "success": true,
                            "message": `The user with UID ${req.params.uid} has blocked user with UID ${uid} successfully.`
                        }
                    } catch (error) {
                        if (error.hasOwnProperty('name') && error.name == 'SequelizeUniqueConstraintError') {
                            response[uid] = {
                                "success": true,
                                "message": `The user with UID ${req.params.uid} has already blocked user with UID ${uid}.`
                            }
                        }
                    }
                }
            } else {
                response[uid] = {
                    "success": false,
                    "message": `The uid ${uid} does not exist, please make sure you have created a uid with uid ${uid}.`
                }
            }
        }
    })().then(_ => { return response });
};

module.exports = BlockedUserController;