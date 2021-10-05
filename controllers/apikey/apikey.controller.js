"use strict";

const crypto = require('crypto');
const APIKeyService = require('./apikey.service');
const Helper = require('../../helpers/response.handler');

let APIKeyController = {

    findAll: async (req, res) => {
        let ON_DEMAND_DB = req.headers['app_id'];

        try {
            let apikeys = await APIKeyService.findAll(ON_DEMAND_DB);
            if (apikeys.length == 0) return res.status(200).json({ data: apikeys });

            let filterRows = [];
            apikeys.forEach(row => {
                filterRows.push(Helper.removeEmptyValues(row));
            });
            res.status(200).json({ data: Helper.removeEmptyValues(filterRows) });
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    },

    findOne: async (req, res) => {
        let ON_DEMAND_DB = req.headers['app_id'];
        let req_apikey = req.params.apiKey;

        try {
            let apikey = await APIKeyService.findOne(ON_DEMAND_DB, req_apikey);
            if (apikey) return res.status(200).json({ data: Helper.removeEmptyValues(apikey) });

            Helper.sendError({
                key: 'API_KEY',
                input: req_apikey,
                responder: res,
                statusCode: 404,
                code: 'ER_API_KEY_NOT_FOUND',
            });
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    },

    create: async (req, res) => {
        let ON_DEMAND_DB = req.headers['app_id'];
        let keyToCreate = req.body;

        keyToCreate.apiKey = crypto.createHash('sha1').update(crypto.randomBytes(64).toString('hex')).digest('hex');
        keyToCreate.createdAt = Math.floor(+new Date() / 1000);

        try {
            let apikey = await APIKeyService.create(ON_DEMAND_DB, keyToCreate);

            if (apikey) return res.status(201).json({ data: Helper.removeEmptyValues(apikey) });
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    },

    update: async (req, res) => {
        let ON_DEMAND_DB = req.headers['app_id'];
        let req_apikey = req.params.apiKey;
        let keyToUpdate = req.body;

        keyToUpdate.updatedAt = Math.floor(+new Date() / 1000);

        try {
            let result = await APIKeyService.update(ON_DEMAND_DB, req_apikey, keyToUpdate);

            if (result) {
                let apikey = await APIKeyService.findOne(ON_DEMAND_DB, req_apikey);
                res.status(200).json({ data: Helper.removeEmptyValues(apikey) });
            } else {
                Helper.sendError({
                    key: 'API_KEY',
                    input: req_apikey,
                    responder: res,
                    statusCode: 404,
                    code: 'ER_API_KEY_NOT_FOUND',
                });
            }
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    },

    delete: async (req, res) => {
        let ON_DEMAND_DB = req.headers['app_id'];
        let req_apikey = req.params.apiKey;

        try {
            let result = await APIKeyService.delete(ON_DEMAND_DB, req_apikey);
            if (result) {
                Helper.sendResponse({
                    key: 'API_KEY',
                    input: req_apikey,
                    responder: res,
                    statusCode: 200,
                    code: 'MSG_API_KEY_DELETED',
                });
            } else {
                Helper.sendError({
                    key: 'API_KEY',
                    input: req_apikey,
                    responder: res,
                    statusCode: 404,
                    code: 'ER_API_KEY_NOT_FOUND',
                });
            }
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    },

    validate: async (req, res, next) => {
        let ON_DEMAND_DB = req.headers['app_id'];
        let apiKey = req.headers.apikey;

        try {
            let apikey = await APIKeyService.findOne(ON_DEMAND_DB, apiKey);
            if (!apikey) return Helper.sendError({
                key: 'API_KEY',
                input: apiKey,
                responder: res,
                statusCode: 404,
                code: 'ER_API_KEY_NOT_FOUND',
            });

            if (apikey.hasOwnProperty('scope') && apikey['scope'] === 'fullAccess') {
                next();
            } else {
                Helper.sendError({
                    key: 'API_KEY',
                    input: apiKey,
                    responder: res,
                    statusCode: 403,
                    code: 'ER_AUTH_NO_ACCESS',
                });
            }
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    }
};

module.exports = APIKeyController;
