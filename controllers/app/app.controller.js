"use strict";

const AppResponse = require('../../helpers/response.helper');
const Helper = require('../../helpers/global.helper');

let AppController = {

    create: async (req, res) => {
        let response = new Object({
            req: req,
            res: res
        });
        let debug = new Object();
        let proceed = true;
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';

        if (proceed) {
            try {
                await createUserWithDB(req);

                debug['createUserWithDB'] = true;
            } catch (error) {
                response['error'] = {
                    code: 'ERR_OPERATION_FAILED',
                    params: []
                }
                proceed = false;
                debug['createUserWithDB::Exception'] = error['message'];
            }
        }
        if (proceed) {
            try {
                await Helper.migrate(req, res);
                debug['migrate'] = true;
            } catch (error) {
                response['error'] = {
                    code: 'ERR_OPERATION_FAILED',
                    params: []
                }
                proceed = false;
                debug['migrate::Exception'] = error['message'];
            }
        }
        if (proceed) {
            response['data'] = {
                code: 'OK_DEFAULT',
                params: []
            }
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
        let appId = Helper.getAppId(req);

        try {
            await dropUserWithDB(appId);

            response['data'] = {
                success: true,
                message: AppResponse.getSuccessMessage({
                    code: 'OK_APP_DELETED',
                    params: {
                        appId: appId
                    }
                })['message']
            }
        } catch (error) {
            response['error'] = {
                code: 'ERR_OPERATION_FAILED',
                params: []
            }
            debug['__DropDB::Exception'] = error['message'];
        }
        response['debugTrace'] = debug;

        AppResponse.send(response);
    },

    checkRegionSecret: async (req, res, next) => {
        let response = new Object({
            req: req,
            res: res
        });
        let debug = new Object();
        let regionSecret = req.headers.apikey;

        let errorCode = 'ERR_BAD_REGION_SECRET';
        let errorParams = {
            secret: regionSecret
        };

        if (
            regionSecret && regionSecret == Helper.getRegionSecret()
        ) {
            return next();
        }
        response['error'] = {
            code: errorCode,
            params: errorParams
        }
        AppResponse.send(response);
    }
};

const createUserWithDB = async (req) => {
    const appId = Helper.getAppId(req);

    if (appId) {
        const user = Helper.getInstanceUser(appId);
        const password = Helper.getInstancePassword(user);
        const connection = await Helper.getCreatorConnection();

        await connection.query(
            `CREATE USER IF NOT EXISTS '${user}'@'%'
                IDENTIFIED WITH mysql_native_password
                BY '${password}'`
        );
        await connection.query(
            `CREATE DATABASE IF NOT EXISTS ${user}`
        );
        await connection.query(
            `GRANT ALL ON ${user}.*
            TO '${user}'@'%'`
        );
        await connection.query(
            `GRANT TRIGGER, CREATE ROUTINE ON ${user}.*
            TO '${user}'@'%'`
        );
        connection.end();
    }
};

const dropUserWithDB = async (appId) => {
    const user = Helper.getInstanceUser(appId);
    const connection = await Helper.getCreatorConnection();

    if (appId) {
        await connection.query(
            `DROP USER IF EXISTS '${user}'@'%'`
        );
        await connection.query(
            `DROP DATABASE IF EXISTS ${user}`
        );
        connection.end();
    }
};

module.exports = AppController;