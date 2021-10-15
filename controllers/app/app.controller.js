"use strict";

const Helper = require('../../helpers/response.helper');
const GlobalHelper = require('../../helpers/global.helper');

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
                debug['createUserWithDB::Exception'] = error['message'];
                response['error'] = {
                    code: 'ERR_OPERATION_FAILED',
                    params: []
                }
                proceed = false;
            }
        }
        if (proceed) {
            try {
                await GlobalHelper.migrate(req);
                debug['migrate'] = true;
            } catch (error) {
                debug['migrate::Exception'] = error['message'];
                response['error'] = {
                    code: 'ERR_OPERATION_FAILED',
                    params: []
                }
                proceed = false;
            }
        }
        if (proceed) {
            response['data'] = {
                code: 'OK_DEFAULT',
                params: []
            }
        }
        response['debugTrace'] = debug;

        Helper.send(response);
    },

    delete: async (req, res) => {
        let response = new Object({
            req: req,
            res: res
        });
        let debug = new Object();
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';
        let appId = GlobalHelper.getAppId(req);

        try {
            await dropUserWithDB(appId);

            response['data'] = {
                success: true,
                message: Helper.getSuccessMessage({
                    code: 'OK_APP_DELETED',
                    params: {
                        appId: appId
                    }
                })['message']
            }
        } catch (error) {
            console.log(error);
            response['error'] = {
                code: 'ERR_OPERATION_FAILED',
                params: []
            }
            debug['__DropDB::Exception'] = error['message'];
        }
        response['debugTrace'] = debug;

        Helper.send(response);
    },

    checkRegionSecret: async (req, res, next) => {
        let response = new Object({
            req: req,
            res: res
        });
        let regionSecret = req.headers.apikey;

        let errorCode = 'ERR_BAD_REGION_SECRET';
        let errorParams = {
            secret: regionSecret
        };

        if (
            regionSecret && regionSecret == GlobalHelper.getRegionSecret()
        ) {
            return next();
        }
        response['error'] = {
            code: errorCode,
            params: errorParams
        }
        Helper.send(response);
    }
};

const createUserWithDB = async (req) => {
    const appId = GlobalHelper.getAppId(req);

    if (appId) {
        const user = GlobalHelper.getInstanceUser(appId);
        const password = GlobalHelper.getInstancePassword(user);
        const connection = await GlobalHelper.getCreatorConnection();

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
    const user = GlobalHelper.getInstanceUser(appId);
    const connection = await GlobalHelper.getCreatorConnection();

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