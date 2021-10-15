"use strict";

const RoleService = require('./role.service');
const Helper = require('../../helpers/response.helper');

let RoleController = {

    findAll: async (req, res) => {
        let response = new Object({
            req: req,
            res: res
        });
        let debug = new Object();
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';

        try {
            let roles = await RoleService.findAll();

            if (roles.length == 0) {
                response['data'] = roles;
            } else {
                let filterRoles = [];

                roles.forEach(row => {
                    filterRoles.push(Helper.removeEmptyValues(row));
                });
                response['data'] = filterRoles;
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
        let req_role = req.params.role;

        try {
            let role = await RoleService.findOne(req_role);

            if (role) {
                response['data'] = Helper.removeEmptyValues(role);
            } else {
                response['error'] = {
                    code: 'ERR_ROLE_NOT_FOUND',
                    params: {
                        role: req_role
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
        let roleToCreate = req.body;

        roleToCreate.createdBy = req['requestOwner'];
        roleToCreate.createdAt = Math.floor(+new Date() / 1000);

        try {
            let role = await RoleService.create(roleToCreate);

            if (role) response['data'] = Helper.removeEmptyValues(role);
        } catch (error) {
            if (error.hasOwnProperty('name') && error.name == 'SequelizeUniqueConstraintError') {
                response['error'] = {
                    code: 'ERR_ROLE_ALREADY_EXISTS',
                    params: {
                        role: roleToCreate['role']
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
        let req_role = req.params.role;
        let roleToUpdate = req.body;

        roleToUpdate.updatedAt = Math.floor(+new Date() / 1000);

        try {
            let result = await RoleService.update(req_role, roleToUpdate);

            if (result && result[0] == 1) {
                let role = await RoleService.findOne(req_role);

                response['data'] = Helper.removeEmptyValues(role);
            } else {
                response['error'] = {
                    code: 'ERR_ROLE_NOT_FOUND',
                    params: {
                        role: req_role
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
        let req_role = req.params.role;

        try {
            let result = await RoleService.delete(req_role);

            if (result) {
                response['data'] = {
                    code: 'OK_DELETED_ROLE',
                    params: {
                        role: req_role
                    }
                };
            } else {
                response['error'] = {
                    code: 'ERR_ROLE_NOT_FOUND',
                    params: {
                        role: req_role
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
    }
};

module.exports = RoleController;
