"use strict";

const AuthTokenService = require('../controllers/auth_token/auth_token.service');
const AppResponse = require('../helpers/response.helper');

let AuthTokenMiddleware = {

    checkAuthToken: async (req, res, next) => {
        let response = new Object({
            req: req,
            res: res
        });
        let debug = new Object();
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';
        let req_auth_token = req.headers['apikey'];

        try {
            let auth_token = await AuthTokenService.findOne(req_auth_token);

            if (auth_token) {
                req['subjectUser'] = auth_token['uid'];

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
}

module.exports = AuthTokenMiddleware;