const express = require('express');
const { body, header } = require('express-validator');
const validator = require('../../../middlewares/validator.mw');
const UserController = require('../../../controllers/user/user.controller');
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

    router
        .route('/:guid/members')
        .all(
            GroupController.checkGroupExists
        )
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
        .all(
            GroupController.checkGroupExists,
            UserController.checkUserExists
        )
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
        .all(
            GroupController.checkGroupExists
        )
        .get((req, res, next) => {
            GroupUserController.findAll(req, res, { isBanned: 1 })
        })

    router
        .route('/:guid/bannedusers/:uid')
        .all(
            GroupController.checkGroupExists,
            UserController.checkUserExists
        )
        .post((req, res) => {
            GroupUserController.banUnban('ban', req, res)
        })
        .delete((req, res) => {
            GroupUserController.banUnban('unban', req, res)
        })

    app.use('/v1.0/groups',
        header('apiKey').not().isEmpty(),
        validator.showError,
        APIKeyController.validate,
        router
    );
}