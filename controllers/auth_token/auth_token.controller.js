"use strict";

const AppResponse = require('../../helpers/response.helper');
const AuthTokenService = require('./auth_token.service');
const {
    getCryptoHash,
    removeEmptyValues
} = require('../../helpers/global.helper');

let AuthTokenController = {

    findAll: async (req, res) => {
        let response = new Object({
            req: req,
            res: res
        });
        let debug = new Object();
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';

        try {
            let auth_tokens = await AuthTokenService.findAll();

            if (auth_tokens.length == 0) {
                response['data'] = auth_tokens;
            } else {
                let filteredAuthTokens = [];

                auth_tokens.forEach(row => {
                    filteredAuthTokens.push(removeEmptyValues(row));
                });
                response['data'] = filteredAuthTokens;
            }
        } catch (error) {
            response['error'] = {
                code: errorCode,
                params: []
            }
            debug['auth:findAll:error'] = error;
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
        let req_auth_token = req.params.auth_token;

        try {
            let auth_token = await AuthTokenService.findOne(req_auth_token);

            if (auth_token) {
                response['data'] = removeEmptyValues(auth_token);
            } else {
                response['error'] = {
                    code: 'AUTH_ERR_AUTH_TOKEN_NOT_FOUND',
                    params: {
                        auth_token: req_auth_token
                    }
                }
            }
        } catch (error) {
            response['error'] = {
                code: errorCode,
                params: []
            }
            debug['auth:find:error'] = error;
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
        let tokenToCreate = req.body;
        let uid = req.params.uid;

        tokenToCreate.uid = uid;
        tokenToCreate.apiKey = req.headers.apikey;
        tokenToCreate.authToken = uid + '_' + getCryptoHash();
        tokenToCreate.createdAt = Math.floor(+new Date() / 1000);

        try {
            let auth_token = await AuthTokenService.create(tokenToCreate);

            if (auth_token) response['data'] = removeEmptyValues(auth_token);
        } catch (error) {
            response['error'] = {
                code: errorCode,
                params: []
            }
            debug['auth:create:error'] = error;
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
        let req_auth_token = req.params.auth_token;
        let tokenToUpdate = req.body;

        tokenToUpdate.updatedAt = Math.floor(+new Date() / 1000);

        try {
            let result = await AuthTokenService.update(req_auth_token, tokenToUpdate);

            if (
                result &&
                result[0] == 1
            ) {
                let auth_token = await AuthTokenService.findOne(req_auth_token);

                response['data'] = removeEmptyValues(auth_token);
            } else {
                response['error'] = {
                    code: 'AUTH_ERR_AUTH_TOKEN_NOT_FOUND',
                    params: {
                        auth_token: req_auth_token
                    }
                }
            }
        } catch (error) {
            response['error'] = {
                code: errorCode,
                params: []
            }
            debug['auth:update:error'] = error;
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
        let req_auth_token = req.params.auth_token;

        try {
            let result = await AuthTokenService.delete(req_auth_token);

            if (result) {
                response['data'] = {
                    code: 'OK_DELETED_AUTH_TOKEN',
                    params: {
                        auth_token: req_auth_token
                    }
                };
            } else {
                response['error'] = {
                    code: 'AUTH_ERR_AUTH_TOKEN_NOT_FOUND',
                    params: {
                        auth_token: req_auth_token
                    }
                }
            }
        } catch (error) {
            response['error'] = {
                code: errorCode,
                params: []
            }
            debug['auth:delete:error'] = error;
        }
        response['debugTrace'] = debug;

        AppResponse.send(response);
    },

    validate: async (req, res, next) => {
        let response = new Object({
            req: req,
            res: res
        });
        let debug = new Object();
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';
        let authToken = req.headers['authtoken'];

        try {
            let auth_token = await AuthTokenService.findOne(authToken);

            if (auth_token) {
                return next();
            } else {
                response['error'] = {
                    code: 'AUTH_ERR_AUTH_TOKEN_NOT_FOUND',
                    params: {
                        auth_token: req_auth_token
                    }
                }
            }
        } catch (error) {
            response['error'] = {
                code: errorCode,
                params: []
            }
            debug['auth:validate:error'] = error;
        }
        response['debugTrace'] = debug;

        AppResponse.send(response);
    }
};

module.exports = AuthTokenController;
