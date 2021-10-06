"use strict";

const RoleService = require('./role.service');
const Helper = require('../../helpers/response.helper');

let RoleController = {

    findAll: async (req, res) => {
        try {
            let roles = await RoleService.findAll();
            if (roles.length == 0) return res.status(200).json({ data: roles });

            let filterRows = [];
            roles.forEach(row => {
                filterRows.push(Helper.removeEmptyValues(row));
            });
            res.status(200).json({ data: Helper.removeEmptyValues(filterRows) });
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    },

    findOne: async (req, res) => {
        let req_role = req.params.role;

        try {
            let role = await RoleService.findOne(req_role);
            if (role) return res.status(200).json({ data: Helper.removeEmptyValues(role) });

            Helper.sendError({
                key: 'ROLE',
                input: req_role,
                responder: res,
                statusCode: 404,
                code: 'ER_ROLE_NOT_FOUND',
            });
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    },

    create: async (req, res) => {
        let roleToCreate = req.body;

        roleToCreate.createdBy = req['requestOwner'];
        roleToCreate.createdAt = Math.floor(+new Date() / 1000);

        try {
            let role = await RoleService.create(roleToCreate);

            if (role) return res.status(201).json({ data: Helper.removeEmptyValues(role) });
        } catch (error) {
            if (error.hasOwnProperty('name') && error.name == 'SequelizeUniqueConstraintError') {
                return Helper.sendError({
                    key: 'ROLE',
                    input: roleToCreate.role,
                    responder: res,
                    statusCode: 409,
                    code: 'ER_DUP_ENTRY',
                });
            }
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    },

    update: async (req, res) => {
        let req_role = req.params.role;
        let roleToUpdate = req.body;

        roleToUpdate.updatedAt = Math.floor(+new Date() / 1000);

        try {
            let result = await RoleService.update(req_role, roleToUpdate);

            if (result) {
                let role = await RoleService.findOne(req_role);
                res.status(200).json({ data: Helper.removeEmptyValues(role) });
            } else {
                Helper.sendError({
                    key: 'ROLE',
                    input: req_role,
                    responder: res,
                    statusCode: 404,
                    code: 'ER_ROLE_NOT_FOUND',
                });
            }
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    },

    delete: async (req, res) => {
        let req_role = req.params.role;

        try {
            let result = await RoleService.delete(req_role);
            if (result) {
                Helper.sendResponse({
                    key: 'ROLE',
                    input: req_role,
                    responder: res,
                    statusCode: 200,
                    code: 'MSG_ROLE_DELETED',
                });
            } else {
                Helper.sendError({
                    key: 'ROLE',
                    input: req_role,
                    responder: res,
                    statusCode: 404,
                    code: 'ER_ROLE_NOT_FOUND',
                });
            }
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    }
};

module.exports = RoleController;
