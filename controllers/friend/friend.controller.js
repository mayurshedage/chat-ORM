"use strict";

const FriendService = require('./friend.service');
const UserService = require('../user/user.service');
const Helper = require('../../helpers/response.helper');

let FriendController = {

    findAll: async (req, res, whereClause = {}) => {
        let req_uid = req.params.uid;

        try {
            let friends = await FriendService.findAll(req_uid, whereClause);
            if (friends.length == 0) return res.status(200).json({ data: friends });

            let filterRows = [];
            friends.forEach(row => {
                filterRows.push(Helper.removeEmptyValues(row));
            });
            res.status(200).json({ data: Helper.removeEmptyValues(filterRows) });
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    },

    create: async (req, res) => {
        let friendsObj = {};

        (async () => {
            for (let i = 0; i < Object.keys(req.body).length; i++) {
                let status = Object.keys(req.body)[i];
                friendsObj[status] = await friendsManager(req.body[status], status, req, res);
            };
        })().then(_ => res.json({ data: friendsObj }))
    },

    delete: async (req, res) => {
        let req_uid = req.params.uid;
        let req_guid = req.params.guid;

        try {
            let result = await FriendService.delete(req_guid, req_uid);
            if (result) {
                Helper.sendResponse({
                    key: 'GROUP_USER',
                    input: req_uid,
                    responder: res,
                    statusCode: 200,
                    code: 'MSG_GROUP_USER_KICKED',
                });
                let groups = await FriendService.findAll(req_guid);
                await GroupService.update(req_guid, { membersCount: groups.length });
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

const friendsManager = async (friendsToAdd, status, req, res) => {
    let response = {};
    let users = await UserService.bulkFind(friendsToAdd);

    return (async () => {
        for (let i = 0; i < friendsToAdd.length; i++) {
            let uid = friendsToAdd[i];

            if (users[i] && users[i].hasOwnProperty('uid')) {
                if (uid == req.params.uid) {
                    response[uid] = {
                        "success": false,
                        "message": `Self friend relationship cannot be formed.`
                    }
                } else {
                    try {
                        await FriendService.create({ uid: req.params.uid, fuid: uid, status: status, createdAt: Math.floor(+new Date() / 1000) });

                        response[uid] = {
                            "success": true,
                            "message": `Created relationship with status ${status}.`
                        }
                    } catch (error) {
                        if (error.hasOwnProperty('name') && error.name == 'SequelizeUniqueConstraintError') {
                            await FriendService.update(req.params.uid, uid, {
                                status: status,
                                updatedAt: Math.floor(+new Date() / 1000)
                            });

                            response[uid] = {
                                "success": true,
                                "message": `Updated relationship with status ${status}.`
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

module.exports = FriendController;