"use strict";

const UserService = require('./user.service');
const Helper = require('../../helpers/response.helper');

let UserController = {

    findAll: async (req, res) => {
        let response = new Object({
            req: req,
            res: res
        });
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';

        try {
            let users = await UserService.findAll();

            if (users.length == 0) {
                response['data'] = users;
            } else {
                let filteredUsers = [];

                users.forEach(row => {
                    filteredUsers.push(Helper.removeEmptyValues(row));
                });
                response['data'] = filteredUsers;
            }
        } catch (error) {
            response['error'] = {
                code: errorCode,
                trace: error
            }
        }
        Helper.send(response);
    },

    findOne: async (req, res) => {
        let response = new Object({
            req: req,
            res: res
        });
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';
        let uid = req.params.uid;

        try {
            let user = await UserService.findOne(uid);

            if (user) {
                response['data'] = Helper.removeEmptyValues(user);
            } else {
                response['error'] = {
                    code: 'ERR_UID_NOT_FOUND',
                    params: {
                        uid: uid
                    }
                }
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
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';
        let userToCreate = req.body;

        userToCreate.createdAt = Math.floor(+new Date() / 1000);

        try {
            let user = await UserService.create(userToCreate);

            if (user) response['data'] = Helper.removeEmptyValues(user);
        } catch (error) {
            if (error.hasOwnProperty('name') && error.name == 'SequelizeUniqueConstraintError') {
                response['error'] = {
                    code: 'ERR_UID_ALREADY_EXISTS',
                    params: {
                        uid: userToCreate['uid']
                    }
                }
            } else {
                response['error'] = {
                    code: errorCode,
                    trace: error
                }
            }
        }
        Helper.send(response);
    },

    update: async (req, res) => {
        let response = new Object({
            req: req,
            res: res
        });
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';
        let uid = req.params.uid;
        let userToUpdate = req.body;

        userToUpdate.updatedAt = Math.floor(+new Date() / 1000);

        try {
            let result = await UserService.update(uid, userToUpdate);

            if (result && result[0] == 1) {
                let user = await UserService.findOne(uid);

                response['data'] = Helper.removeEmptyValues(user);
            } else {
                response['error'] = {
                    code: 'ERR_UID_NOT_FOUND',
                    params: {
                        uid: uid
                    }
                }
            }
        } catch (error) {
            response['error'] = {
                code: errorCode,
                trace: error
            }
        }
        Helper.send(response);
    },

    delete: async (req, res) => {
        let response = new Object({
            req: req,
            res: res
        });
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';
        let uid = req.params.uid;

        try {
            let result = await UserService.delete(uid);

            if (result) {
                response['data'] = {
                    code: 'OK_DELETED_USER',
                    params: {
                        uid: uid
                    }
                };
            } else {
                response['error'] = {
                    code: 'ERR_UID_NOT_FOUND',
                    params: {
                        uid: uid
                    }
                }
            }
        } catch (error) {
            response['error'] = {
                code: errorCode,
                trace: error
            }
        }
        Helper.send(response);
    },

    checkUserExists: async (req, res, next) => {
        let response = new Object({
            req: req,
            res: res
        });
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';
        let uid = req.params.uid;

        try {
            let user = await UserService.findOne(uid);

            if (user) {
                next(); return;
            } else {
                response['error'] = {
                    code: 'ERR_UID_NOT_FOUND',
                    params: {
                        uid: uid
                    }
                }
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

module.exports = UserController;
