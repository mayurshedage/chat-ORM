"use strict";

const UserService = require('./user.service');
const AppResponse = require('../../helpers/response.helper');
const { removeEmptyValues } = require('../../helpers/global.helper');

let UserController = {

    findAll: async (req, res) => {
        let response = new Object({
            req: req,
            res: res
        });
        let debug = new Object();
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';

        try {
            let users = await UserService.findAll();

            if (users.length == 0) {
                response['data'] = users;
            } else {
                let filteredUsers = [];

                users.forEach(row => {
                    filteredUsers.push(removeEmptyValues(row));
                });
                response['data'] = filteredUsers;
            }
        } catch (error) {
            response['error'] = {
                code: errorCode,
                params: []
            }
            debug['user:findAll:error'] = error;
        }
        response['debugTrace'] = debug;

        AppResponse.send(response);
    },

    findOne: async (req, res) => {
        let response = new Object({
            req: req,
            res: res
        });
        let debug = new Object();
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';
        let uid = req.params.uid;

        try {
            let user = await UserService.findOne(uid);

            if (user) {
                response['data'] = removeEmptyValues(user);
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
                params: []
            }
            debug['user:find:error'] = error;
        }
        response['debugTrace'] = debug;

        AppResponse.send(response);
    },

    create: async (req, res) => {
        let response = new Object({
            req: req,
            res: res
        });
        let debug = new Object();
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';
        let userToCreate = req.body;

        userToCreate.createdAt = Math.floor(+new Date() / 1000);

        try {
            let user = await UserService.create(userToCreate);

            if (user) response['data'] = removeEmptyValues(user);
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
                    params: []
                }
                debug['user:create:error'] = error;
            }
        }
        response['debugTrace'] = debug;

        AppResponse.send(response);
    },

    update: async (req, res) => {
        let response = new Object({
            req: req,
            res: res
        });
        let debug = new Object();
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';
        let uid = req.params.uid;
        let userToUpdate = req.body;

        userToUpdate.updatedAt = Math.floor(+new Date() / 1000);

        try {
            let result = await UserService.update(uid, userToUpdate);

            if (result && result[0] == 1) {
                let user = await UserService.findOne(uid);

                response['data'] = removeEmptyValues(user);
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
                params: []
            }
            debug['user:update:error'] = error;
        }
        response['debugTrace'] = debug;

        AppResponse.send(response);
    },

    delete: async (req, res) => {
        let response = new Object({
            req: req,
            res: res
        });
        let debug = new Object();
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
                params: []
            }
            debug['user:delete:error'] = error;
        }
        response['debugTrace'] = debug;

        AppResponse.send(response);
    },

    checkUserExists: async (req, res, next) => {
        let response = new Object({
            req: req,
            res: res
        });
        let debug = new Object();
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';
        let uid = req.params.uid;

        try {
            let user = await UserService.findOne(uid);

            if (user) {
                return next();
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
                params: []
            }
            debug['mw:user:checkUserExists:error'] = error.message;
        }
        response['debugTrace'] = debug;

        AppResponse.send(response);
    }
};

module.exports = UserController;
