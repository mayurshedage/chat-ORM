"use strict";

const GroupService = require('./group.service');
const UserService = require('../user/user.service');
const GroupTagService = require('../group_tag/group_tag.service');
const Helper = require('../../helpers/response.helper');

let GroupController = {

    findAll: async (req, res) => {
        let response = new Object({
            req: req,
            res: res
        });
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';

        try {
            let groups = await GroupService.findAll(req);

            if (groups.length == 0) {
                response['data'] = groups;
            } else {
                let filteredGroups = [];

                groups.forEach(row => {
                    filteredGroups.push(Helper.removeEmptyValues(row));
                });
                response['data'] = filteredGroups;
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
        let req_guid = req.params.guid;

        try {
            let group = await GroupService.findOne(req_group);

            if (group) {
                response['data'] = Helper.removeEmptyValues(group);
            } else {
                response['error'] = {
                    code: 'ERR_GUID_NOT_FOUND',
                    params: {
                        guid: req_guid
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
        let tags = [];
        let proceed = true;
        let groupToCreate = req.body;

        if (req.body['owner']) {
            const user = await UserService.findOne(req.body['owner']);

            if (!user) {
                proceed = false;

                response['error'] = {
                    code: 'ERR_UID_NOT_FOUND',
                    params: {
                        uid: uid
                    }
                }
            }
        }

        if (proceed) {
            groupToCreate.createdAt = Math.floor(+new Date() / 1000);
            let addedAt = Math.floor(+new Date() / 1000);

            try {
                let group = await GroupService.create(groupToCreate);

                if (group) {
                    response['data'] = Helper.removeEmptyValues(group);
                }
                if (req.body.tags && req.body.tags.length) {
                    req.body.tags.map(tag => {
                        return tags.push({ guid: group.guid, tag: tag, addedAt: addedAt });
                    });
                    if (tags.length) await GroupTagService.bulkCreate(tags);
                }
            } catch (error) {
                if (error.hasOwnProperty('name') && error.name == 'SequelizeUniqueConstraintError') {
                    response['error'] = {
                        code: 'ERR_GUID_ALREADY_EXISTS',
                        params: {
                            guid: groupToCreate['guid']
                        }
                    }
                } else {
                    response['error'] = {
                        code: errorCode,
                        trace: error
                    }
                }
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
        let tags = [];
        let proceed = true;
        let guid = req.params.guid;
        let groupToUpdate = req.body;

        if (req.body['owner']) {
            const user = await UserService.findOne(req.body['owner']);

            if (!user) {
                proceed = false;

                response['error'] = {
                    code: 'ERR_UID_NOT_FOUND',
                    params: {
                        guid: guid
                    }
                }
            }
        }
        if (proceed) {
            groupToUpdate.updatedAt = Math.floor(+new Date() / 1000);
            let addedAt = Math.floor(+new Date() / 1000);

            try {
                let result = await GroupService.update(guid, groupToUpdate);

                if (result) {
                    let group = await GroupService.findOne(guid);

                    response['data'] = Helper.removeEmptyValues(group);

                    if (req.body.tags && req.body.tags.length) {
                        req.body.tags.map(tag => {
                            return tags.push({ guid: group.guid, tag: tag, addedAt: addedAt });
                        });
                        if (tags.length) {
                            await GroupTagService.delete(guid);
                            await GroupTagService.bulkCreate(tags);
                        }
                    }
                } else {
                    response['error'] = {
                        code: 'ERR_GUID_NOT_FOUND',
                        params: {
                            guid: req_guid
                        }
                    }
                }
            } catch (error) {
                response['error'] = {
                    code: errorCode,
                    trace: error
                }
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
        let guid = req.params.guid;

        try {
            let result = await GroupService.delete(guid);

            if (result) {
                response['data'] = {
                    code: 'OK_DELETED_GROUP',
                    params: {
                        guid: guid
                    }
                };
            } else {
                response['error'] = {
                    code: 'ERR_GUID_NOT_FOUND',
                    params: {
                        guid: guid
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

    checkGroupExists: async (req, res, next) => {
        let response = new Object({
            req: req,
            res: res
        });
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';
        let guid = req.params.guid;

        try {
            let group = await GroupService.findOne(guid);

            if (group) {
                next(); return;
            } else {
                response['error'] = {
                    code: 'ERR_GUID_NOT_FOUND',
                    params: {
                        guid: guid
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

module.exports = GroupController;
