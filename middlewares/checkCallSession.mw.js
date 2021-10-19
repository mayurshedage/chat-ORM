"use strict";

const CallService = require('../controllers/call/call.service');
const AppResponse = require('../helpers/response.helper');

let CallMiddleware = {

    checkCallSession: async (req, res, next) => {
        let response = new Object({
            req: req,
            res: res
        });
        let debug = new Object();
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';
        let sessionid = req.params.sessionid;

        try {
            let user = await CallService.findOne(sessionid);

            if (user) {
                return next();
            } else {
                response['error'] = {
                    code: 'ERR_CALL_SESSION_NOT_FOUND',
                    params: {
                        sessionid: sessionid
                    }
                }
            }
        } catch (error) {
            response['error'] = {
                code: errorCode,
                params: []
            }
            debug['mw:user:checkCallSession:error'] = error.message;
        }
        response['debugTrace'] = debug;

        AppResponse.send(response);
    }
}

module.exports = CallMiddleware;