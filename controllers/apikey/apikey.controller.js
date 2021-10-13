"use strict";

const crypto = require('crypto');
const APIKeyService = require('./apikey.service');
const Helper = require('../../helpers/response.helper');

let APIKeyController = {

    findAll: async (req, res) => {
        let response = new Object({
            req: req,
            res: res
        });
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';

        try {
            let apikeys = await APIKeyService.findAll();

            if (apikeys.length == 0) {
                response['data'] = apikeys;
            } else {
                let filteredKeys = [];

                apikeys.forEach(row => {
                    filteredKeys.push(Helper.removeEmptyValues(row));
                });
                response['data'] = filteredKeys;
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
        let req_apikey = req.params.apiKey;

        try {
            let apikey = await APIKeyService.findOne(req_apikey);

            if (apikey) {
                response['data'] = Helper.removeEmptyValues(apikey);
            } else {
                response['error'] = {
                    code: 'AUTH_ERR_APIKEY_NOT_FOUND',
                    params: {
                        apikey: req_apikey
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
        let keyToCreate = req.body;

        keyToCreate.apiKey = crypto.createHash('sha1').update(crypto.randomBytes(64).toString('hex')).digest('hex');
        keyToCreate.createdBy = req['requestOwner'];
        keyToCreate.createdAt = Math.floor(+new Date() / 1000);

        try {
            let apikey = await APIKeyService.create(keyToCreate);

            if (apikey) response['data'] = Helper.removeEmptyValues(apikey);
        } catch (error) {
            response['error'] = {
                code: errorCode,
                trace: error
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
        let req_apikey = req.params.apiKey;
        let keyToUpdate = req.body;

        keyToUpdate.updatedAt = Math.floor(+new Date() / 1000);

        try {
            let result = await APIKeyService.update(req_apikey, keyToUpdate);

            if (result && result[0] == 1) {
                let apikey = await APIKeyService.findOne(req_apikey);

                response['data'] = Helper.removeEmptyValues(apikey);
            } else {
                response['error'] = {
                    code: 'AUTH_ERR_APIKEY_NOT_FOUND',
                    params: {
                        apikey: req_apikey
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
        let req_apikey = req.params.apiKey;

        try {
            let result = await APIKeyService.delete(req_apikey);

            if (result) {
                response['data'] = {
                    code: 'OK_API_KEY_DELETED',
                    params: {
                        apikey: req_apikey
                    }
                };
            } else {
                response['error'] = {
                    code: 'AUTH_ERR_APIKEY_NOT_FOUND',
                    params: {
                        apikey: req_apikey
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

    validate: async (req, res, next) => {
        let response = new Object({
            req: req,
            res: res
        });
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';
        let req_apikey = req.headers.apikey;

        try {
            let apikey = await APIKeyService.findOne(req_apikey);

            if (!apikey) {
                response['error'] = {
                    code: 'AUTH_ERR_APIKEY_NOT_FOUND',
                    params: {
                        apikey: req_apikey
                    }
                }
            } else {
                if (apikey.hasOwnProperty('scope') && apikey['scope'] === 'fullAccess') {
                    next(); return;
                } else {
                    response['error'] = {
                        code: 'AUTH_ERR_NO_ACCESS',
                        params: {
                            apikey: req_apikey
                        }
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

module.exports = APIKeyController;
