"use strict";

const crypto = require('crypto');
const Helper = require('../../helpers/response.helper');
const AuthTokenService = require('./auth_token.service');

let AuthTokenController = {

    findAll: async (req, res) => {
        try {
            let auth_tokens = await AuthTokenService.findAll();
            if (auth_tokens.length == 0) return res.status(200).json({ data: auth_tokens });

            let filterRows = [];
            auth_tokens.forEach(row => {
                filterRows.push(Helper.removeEmptyValues(row));
            });
            res.status(200).json({ data: Helper.removeEmptyValues(filterRows) });
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    },

    findOne: async (req, res) => {
        let req_auth_token = req.params.auth_token;

        try {
            let auth_token = await AuthTokenService.findOne(req_auth_token);
            if (auth_token) return res.status(200).json({ data: Helper.removeEmptyValues(auth_token) });

            Helper.sendError({
                key: 'AUTH_TOKEN',
                input: req_auth_token,
                responder: res,
                statusCode: 404,
                code: 'ER_TOKEN_NOT_FOUND',
            });
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    },

    create: async (req, res) => {
        let tokenToCreate = req.body;

        tokenToCreate.uid = req.params.uid;
        tokenToCreate.apiKey = req.headers.apikey;
        tokenToCreate.authToken = crypto.createHash('sha1').update(crypto.randomBytes(64).toString('hex')).digest('hex');
        tokenToCreate.createdAt = Math.floor(+new Date() / 1000);

        try {
            let auth_token = await AuthTokenService.create(tokenToCreate);

            if (auth_token) return res.status(201).json({ data: Helper.removeEmptyValues(auth_token) });
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    },

    update: async (req, res) => {
        let req_auth_token = req.params.auth_token;
        let tokenToUpdate = req.body;

        tokenToUpdate.updatedAt = Math.floor(+new Date() / 1000);

        try {
            let result = await AuthTokenService.update(req_auth_token, tokenToUpdate);

            if (result) {
                let auth_token = await AuthTokenService.findOne(req_auth_token);
                res.status(200).json({ data: Helper.removeEmptyValues(auth_token) });
            } else {
                Helper.sendError({
                    key: 'AUTH_TOKEN',
                    input: req_auth_token,
                    responder: res,
                    statusCode: 404,
                    code: 'ER_TOKEN_NOT_FOUND',
                });
            }
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    },

    delete: async (req, res) => {
        let req_auth_token = req.params.auth_token;

        try {
            let result = await AuthTokenService.delete(req_auth_token);
            if (result) {
                Helper.sendResponse({
                    key: 'AUTH_TOKEN',
                    input: req_auth_token,
                    responder: res,
                    statusCode: 200,
                    code: 'MSG_TOKEN_DELETED',
                });
            } else {
                Helper.sendError({
                    key: 'AUTH_TOKEN',
                    input: req_auth_token,
                    responder: res,
                    statusCode: 404,
                    code: 'ER_TOKEN_NOT_FOUND',
                });
            }
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    },

    validate: async (req, res, next) => {
        let authToken = req.headers['authtoken'];

        try {
            let auth_token = await AuthTokenService.findOne(authToken);
            if (!auth_token) return Helper.sendError({
                key: 'AUTH_TOKEN',
                input: authToken,
                responder: res,
                statusCode: 404,
                code: 'ER_TOKEN_NOT_FOUND',
            });
            next();
        } catch (error) {
            Helper.sendError({ responder: res, trace: error }, req.query.debug);
        }
    }
};

module.exports = AuthTokenController;
