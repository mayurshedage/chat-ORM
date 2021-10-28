"use strict";

const APIKeyService = require('../controllers/apikey/apikey.service');
const AppResponse = require('../helpers/response.helper');

let APIKeyMiddleware = {

    checkAPIKey: async (req, res, next) => {
        let response = new Object({
            req: req,
            res: res
        });
        let debug = new Object();
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
                if (
                    apikey.hasOwnProperty('scope') &&
                    apikey['scope'] === 'fullAccess'
                ) {
                    return next();
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
                params: []
            }
            debug['mw:apikey:validate:error'] = error;
        }
        response['debugTrace'] = debug;

        AppResponse.send(response);
    }
}

module.exports = APIKeyMiddleware;
