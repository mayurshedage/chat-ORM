const express = require('express');
const { body, header } = require('express-validator');
const validator = require('../../../middlewares/validator.mw');
const GroupController = require('../../../controllers/group/group.controller');
const APIKeyController = require('../../../controllers/apikey/apikey.controller');
const GroupUserController = require('../../../controllers/group_user/group_user.controller');

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

    router
        .route('/:guid/members')
        .get(GroupUserController.findAll)
        .post(
            [
                body('uid').not().isEmpty(),
                body('scope').not().isEmpty().custom(value => {
                    if (['admin', 'participant', 'moderator'].indexOf(value) == -1) throw new Error('Invalid scope');
                    return true;
                })
            ],
            validator.showError,
            GroupUserController.create
        )

    router
        .route('/:guid/members/:uid')
        .get(GroupUserController.findOne)
        .put(
            [
                body('scope').not().isEmpty().custom(value => {
                    if (['admin', 'participant', 'moderator'].indexOf(value) == -1) throw new Error('Invalid scope');
                    return true;
                })
            ],
            validator.showError,
            GroupUserController.update
        )
        .delete(GroupUserController.delete)

    router
        .route('/:guid/bannedusers')
        .get((req, res, next) => {
            GroupUserController.findAll(req, res, { isBanned: 1 })
        })

    router
        .route('/:guid/bannedusers/:uid')
        .post(GroupUserController.ban)
        .delete(GroupUserController.unban)

    router.param('guid', GroupUserController.checkGroupExists);

    app.use('/v1.0/groups',
        header('apiKey').not().isEmpty(),
        validator.showError,
        APIKeyController.validate,
        router
    );
}