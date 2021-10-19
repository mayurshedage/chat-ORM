"use strict";

const CallService = require('./call.service');
const UserService = require('../user/user.service');
const GroupService = require('../group/group.service');
const AppResponse = require('../../helpers/response.helper');
const { getConversationId } = require('../../interiors/conversation.int');
const { getUid, generateSessionId, removeEmptyValues } = require('../../helpers/global.helper');

let CallController = {

    findAll: async (req, res) => {
        let response = new Object({
            req: req,
            res: res
        });
        let debug = new Object();
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';

        try {
            let calls = await CallService.findAll();

            if (calls.length == 0) {
                response['data'] = calls;
            } else {
                let filteredCalls = [];

                calls.forEach(row => {
                    filteredCalls.push(removeEmptyValues(row));
                });
                response['data'] = filteredCalls;
            }
        } catch (error) {
            response['error'] = {
                code: errorCode,
                params: []
            }
            debug['call:findAll:error'] = error;
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
        let sessionid = req.params.sessionid;

        try {
            let call = await CallService.findOne(sessionid);

            if (call) {
                response['data'] = removeEmptyValues(call);
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
            debug['call:find:error'] = error;
        }
        response['debugTrace'] = debug;

        AppResponse.send(response);
    },

    create: async (req, res) => {
        let response = new Object({
            req: req,
            res: res
        });
        let proceed = true;
        let debug = new Object();
        let errorParams = {};
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';
        let callToCreate = req.body;

        callToCreate.initiatedAt = Math.floor(+new Date() / 1000);

        let uid = getUid(req);

        switch (callToCreate['receiverType']) {
            case 'user':
                try {
                    if (uid == callToCreate['receiver']) {
                        errorCode = 'ERR_CALLING_SELF';
                        errorParams = [];
                    } else {
                        let user = await UserService.findOne(callToCreate['receiver']);

                        if (!user) {
                            errorCode = 'ERR_UID_NOT_FOUND';
                            errorParams = {
                                uid: callToCreate['receiver']
                            }
                            proceed = false;
                        }
                    }
                } catch (e) {
                    proceed = false;
                    debug['call:create:findUser:error'] = error;
                }
                break;

            case 'group':
                try {
                    let group = await GroupService.findOne(callToCreate['receiver']);

                    if (!group) {
                        errorCode = 'ERR_GUID_NOT_FOUND';
                        errorParams = {
                            guid: callToCreate['receiver']
                        }
                        proceed = false;
                    }
                } catch (e) {
                    proceed = false;
                    debug['call:create:findGroup:error'] = error;
                }
                break;
        }

        if (proceed) {
            //check block relation

            callToCreate['sender'] = uid;
            callToCreate['conversationId'] = getConversationId(callToCreate);
            callToCreate['sessionid'] = generateSessionId(callToCreate);

            try {
                let call = await CallService.create(callToCreate);

                if (call) response['data'] = removeEmptyValues(call);
            } catch (error) {
                proceed = false;
                debug['call:create:insert:error'] = error;
            }
        }
        if (!response.hasOwnProperty('data')) {
            response['error'] = {
                code: errorCode,
                params: errorParams
            }
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
        let sessionid = req.params.sessionid;
        let callToUpdate = req.body;

        try {
            let result = await CallService.update(sessionid, callToUpdate);

            if (
                result &&
                result[0] == 1
            ) {
                let session = await CallService.findOne(sessionid);

                response['data'] = removeEmptyValues(session);
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
            debug['call:update:error'] = error;
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
        let sessionid = req.params.sessionid;

        try {
            let result = await CallService.delete(sessionid);

            if (result) {
                response['data'] = {
                    code: 'OK_CALL_SESSION_DELETED',
                    params: {
                        sessionid: sessionid
                    }
                };
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
            debug['call:delete:error'] = error;
        }
        response['debugTrace'] = debug;

        AppResponse.send(response);
    }
};

module.exports = CallController;
