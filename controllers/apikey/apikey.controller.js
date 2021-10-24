"use strict";

const APIKeyService = require('./apikey.service');
const AppResponse = require('../../helpers/response.helper');
const { getCryptoHash, removeEmptyValues } = require('../../helpers/global.helper');

let APIKeyController = {

    findAll: async (req, res) => {
        let response = new Object({
            req: req,
            res: res
        });
        let debug = new Object();
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';

        try {
            let apikeys = await APIKeyService.findAll();

            if (apikeys.length == 0) {
                response['data'] = apikeys;
            } else {
                let filteredKeys = [];

                apikeys.forEach(row => {
                    filteredKeys.push(removeEmptyValues(row));
                });
                response['data'] = filteredKeys;
            }
        } catch (error) {
            response['error'] = {
                code: errorCode,
                params: []
            }
            debug['apikey:findAll:error'] = error;
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
        let req_apikey = req.params.apiKey;

        try {
            let apikey = await APIKeyService.findOne(req_apikey);

            if (apikey) {
                response['data'] = removeEmptyValues(apikey);
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
                params: []
            }
            debug['apikey:find:error'] = error;
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
        let keyToCreate = req.body;

        keyToCreate.apiKey = getCryptoHash();
        keyToCreate.createdBy = req['requestOwner'];
        keyToCreate.createdAt = Math.floor(+new Date() / 1000);

        try {
            let apikey = await APIKeyService.create(keyToCreate);

            if (apikey) response['data'] = removeEmptyValues(apikey);
        } catch (error) {
            response['error'] = {
                code: errorCode,
                params: []
            }
            debug['apikey:create:error'] = error;
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
        let req_apikey = req.params.apiKey;
        let keyToUpdate = req.body;

        keyToUpdate.updatedAt = Math.floor(+new Date() / 1000);

        try {
            let result = await APIKeyService.update(req_apikey, keyToUpdate);

            if (result && result[0] == 1) {
                let apikey = await APIKeyService.findOne(req_apikey);

                response['data'] = removeEmptyValues(apikey);
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
                params: []
            }
            debug['apikey:update:error'] = error;
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
                params: []
            }
            debug['apikey:delete:error'] = error;
        }
        response['debugTrace'] = debug;

        AppResponse.send(response);
    }
};

module.exports = APIKeyController;
