"use strict";

const UserService = require('./user.service');
const Helper = require('../../helpers/response.handler');

let UserController = {

    findAll: async (req, res, next) => {
        let ON_DEMAND_DB = req.headers['app_id'];
        try {
            let users = await UserService.findAll(ON_DEMAND_DB);
            res.status(201).json(users);
        } catch (error) {
            console.log(error);
        }
    },

    findOne: async (req, res, next) => {
        let ON_DEMAND_DB = req.headers['app_id'];
        let uid = req.params.uid;

        try {
            let user = await UserService.findOne(ON_DEMAND_DB, uid);
            if (user) return res.status(200).json({ data: Helper.removeEmptyValues(user) });

            Helper.sendError({
                key: 'USER',
                input: uid,
                responder: res,
                statusCode: 404,
                code: 'ER_USER_NOT_FOUND',
            });
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    },

    create: async (req, res, next) => {
        let ON_DEMAND_DB = req.headers['app_id'];
        let userToCreate = req.body;
        userToCreate.createdAt = Math.floor(+new Date() / 1000);

        try {
            let user = await UserService.create(ON_DEMAND_DB, userToCreate);

            if (user) return res.status(201).json({ data: Helper.removeEmptyValues(user) });
        } catch (error) {
            if (error.hasOwnProperty('name') && error.name == 'SequelizeUniqueConstraintError') {
                return Helper.sendError({
                    key: 'USER',
                    input: userToCreate.uid,
                    responder: res,
                    statusCode: 409,
                    code: 'ER_DUP_ENTRY',
                });
            }
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    },

    update: async (req, res, next) => {
        let ON_DEMAND_DB = req.headers['app_id'];
        let uid = req.params.uid;
        let userToUpdate = req.body;
        userToUpdate.updatedAt = Math.floor(+new Date() / 1000);

        try {
            let result = await UserService.update(ON_DEMAND_DB, uid, userToUpdate);
            if (result) {
                let user = await UserService.findOne(ON_DEMAND_DB, uid);
                res.status(200).json({ data: Helper.removeEmptyValues(user) });
            } else {
                Helper.sendError({
                    key: 'USER',
                    input: uid,
                    responder: res,
                    statusCode: 404,
                    code: 'ER_USER_NOT_FOUND',
                });
            }
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    },

    delete: async (req, res, next) => {
        let ON_DEMAND_DB = req.headers['app_id'];
        let uid = req.params.uid;

        try {
            let result = await UserService.delete(ON_DEMAND_DB, uid);
            console.log('result', result);
            if (result) {
                Helper.sendResponse({
                    key: 'USER',
                    input: uid,
                    responder: res,
                    statusCode: 200,
                    code: 'MSG_USER_DELETED',
                });
            } else {
                Helper.sendError({
                    key: 'USER',
                    input: uid,
                    responder: res,
                    statusCode: 404,
                    code: 'ER_USER_NOT_FOUND',
                });
            }
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    }

};

module.exports = UserController;
