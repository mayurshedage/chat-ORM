"use strict";

const AppResponse = require('../helpers/response.helper');
const { getRegionSecret } = require('../helpers/global.helper');

let RegionSecretMiddleware = {

    checkRegionSecret: async (req, res, next) => {
        let response = new Object({
            req: req,
            res: res
        });
        let debug = new Object();
        let regionSecret = req.headers['apikey'];

        let errorCode = 'ERR_BAD_REGION_SECRET';
        let errorParams = {
            secret: regionSecret
        };

        if (
            regionSecret &&
            regionSecret == getRegionSecret()
        ) {
            return next();
        }
        response['error'] = {
            code: errorCode,
            params: errorParams
        }
        AppResponse.send(response);
    }
}

module.exports = RegionSecretMiddleware;