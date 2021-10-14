"use strict";

const FriendService = require('./friend.service');
const UserService = require('../user/user.service');
const Helper = require('../../helpers/response.helper');

let FriendController = {

    findAll: async (req, res, whereClause = {}) => {
        let response = new Object({
            req: req,
            res: res
        });
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';
        let req_uid = req.params.uid;

        try {
            let friends = await FriendService.findAll(req_uid, whereClause);

            if (friends.length == 0) {
                response['data'] = friends;
            } else {
                let filteredFriends = [];

                friends.forEach(row => {
                    filteredFriends.push(
                        Helper.removeEmptyValues(
                            JSON.parse(JSON.stringify(row.user))
                        )
                    );
                });
                response['data'] = filteredFriends;
            }
        } catch (error) {
            response['error'] = {
                code: errorCode,
                trace: error
            }
        }
        Helper.send(response);
    },

    create: async (req, res) => {
        let response = new Object({
            req: req,
            res: res
        });
        let friendsObj = {};

        (async () => {
            for (let i = 0; i < Object.keys(req.body).length; i++) {
                let status = Object.keys(req.body)[i];
                friendsObj[status] = await friendsManager(req.body[status], status, req, res);
            };
        })().then(_ => {
            response['data'] = friendsObj;
            Helper.send(response);
        })
    },

    delete: async (req, res) => {
        let response = new Object({
            req: req,
            res: res
        });
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';
        let req_uid = req.params.uid;
        let fuids = req.body['friends'];

        try {
            let result = await FriendService.delete(req_uid, fuids);

            response['data'] = {
                code: 'OK_DELETED_FRIEND_RELATIONS'
            }
        } catch (error) {
            response['error'] = {
                code: errorCode,
                trace: error
            }
        }
        Helper.send(response);
    }
};

const friendsManager = async (friendsToAdd, status, req) => {
    let response = new Object();

    let users = await UserService.bulkFind(friendsToAdd);

    return (async () => {
        for (let i = 0; i < friendsToAdd.length; i++) {
            let uid = friendsToAdd[i];

            if (users[i] && users[i].hasOwnProperty('uid')) {
                if (uid == req.params.uid) {
                    response[uid] = {
                        "success": false,
                        "message": Helper.getErrorMessage({
                            code: 'ERR_CANNOT_FORM_SELF_RELATION'
                        })['message']
                    }
                } else {
                    try {
                        await FriendService.create({ uid: req.params.uid, fuid: uid, status: status, createdAt: Math.floor(+new Date() / 1000) });

                        response[uid] = {
                            "success": true,
                            "message": Helper.getSuccessMessage({
                                code: 'OK_CREATED_RELATIONSHIP_STATUS',
                                params: {
                                    status: status
                                }
                            })['message']
                        }
                    } catch (error) {
                        if (error.hasOwnProperty('name') && error.name == 'SequelizeUniqueConstraintError') {
                            await FriendService.update(req.params.uid, uid, {
                                status: status,
                                updatedAt: Math.floor(+new Date() / 1000)
                            });

                            response[uid] = {
                                "success": true,
                                "message": Helper.getSuccessMessage({
                                    code: 'OK_UPDATED_RELATIONSHIP_STATUS',
                                    params: {
                                        status: status
                                    }
                                })['message']
                            }
                        }
                    }
                }
            } else {
                response[uid] = {
                    "success": false,
                    "message": Helper.getErrorMessage({
                        code: 'ERR_UID_NOT_FOUND',
                        params: {
                            uid: uid
                        }
                    })['message']
                }
            }
        }
    })().then(_ => { return response });
};

module.exports = FriendController;