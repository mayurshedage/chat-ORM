const express = require('express');
const { body, header } = require('express-validator');
const validator = require('../../../../middlewares/validator.mw');
const GroupController = require('../../../../controllers/group/group.controller');
const APIKeyController = require('../../../../controllers/apikey/apikey.controller');

const GroupUserRoute = require('./member/member.route');
const GroupBannedUserRoute = require('./member/member.route');

const router = express.Router();

module.exports = (app) => {
    router.get('/', GroupController.findAll);
    router.post('/',
        [
            body('guid').not().isEmpty(),
            body('name').not().isEmpty(),
            body('type').not().isEmpty().custom(value => {
                if (['public', 'private', 'password'].indexOf(value) == -1) throw new Error('Invalid type');
                return true;
            })
        ],
        validator.showError,
        GroupController.create
    );

    router
        .route('/:guid')
        .all(
            GroupController.checkGroupExists
        )
        .get(GroupController.findOne)
        .put(
            [
                body('name').optional().not().isEmpty(),
                body('type').optional().not().isEmpty().custom(value => {
                    if (['public', 'private', 'password'].indexOf(value) == -1) throw new Error('Invalid type');
                    return true;
                })
            ],
            validator.showError,
            GroupController.update
        )
        .delete(GroupController.delete);

    app.use('/v1.0/groups',
        header('apiKey').not().isEmpty(),
        validator.showError,
        APIKeyController.validate,
        GroupUserRoute,
        GroupBannedUserRoute,
        router
    );
}