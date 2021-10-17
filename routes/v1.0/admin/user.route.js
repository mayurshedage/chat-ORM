const express = require('express');
const { body, header } = require('express-validator');
const validator = require('../../../middlewares/validator.mw');
const UserController = require('../../../controllers/user/user.controller');
const FriendController = require('../../../controllers/friend/friend.controller');
const APIKeyController = require('../../../controllers/apikey/apikey.controller');
const AuthTokenController = require('../../../controllers/auth_token/auth_token.controller');
const BlockedUserController = require('../../../controllers/blocked_user/blocked_user.controller');

const router = express.Router();

module.exports = (app) => {
    router.get('/', UserController.findAll);
    router.post('/',
        [
            body('uid').not().isEmpty(),
            body('name').not().isEmpty()
        ],
        validator.showError,
        UserController.create
    );

    router
        .route('/:uid')
        .all(UserController.checkUserExists)
        .get(UserController.findOne)
        .put(
            body('name').optional().not().isEmpty(),
            validator.showError,
            UserController.update
        )
        .delete(UserController.delete);

    router
        .route('/:uid/auth_tokens')
        .get(AuthTokenController.findAll)
        .post(AuthTokenController.create)

    router
        .route('/:uid/auth_tokens/:auth_token')
        .get(AuthTokenController.findOne)
        .put(AuthTokenController.update)
        .delete(AuthTokenController.delete)


    router
        .route('/:uid/friends')
        .all(UserController.checkUserExists)
        .get(FriendController.findAll)
        .post(
            [
                body().not().isEmpty().custom(body => {
                    let validStatus = 0;
                    if (Object.keys(body).length == 0) return false;

                    Object.keys(body).forEach(key => {
                        if (['accepted', 'pending', 'blocked'].indexOf(key) !== -1) validStatus++;
                    });

                    if (!validStatus) throw new Error('Atleast one of the valid body param needs to be present.');

                    return true;
                }),
                body('accepted').optional().not().isEmpty(),
                body('pending').optional().not().isEmpty(),
                body('blocked').optional().not().isEmpty()
            ],
            validator.showError,
            FriendController.create
        )
        .delete(
            [
                body('friends').not().isEmpty()
            ],
            validator.showError,
            FriendController.delete
        )

    router
        .route('/:uid/blockedusers')
        .all(UserController.checkUserExists)
        .get(BlockedUserController.findAll)
        .post(
            [
                body('blockedUids').not().isEmpty()
            ],
            validator.showError,
            BlockedUserController.block
        )
        .delete(
            [
                body('blockedUids').not().isEmpty()
            ],
            validator.showError,
            BlockedUserController.unblock
        )

    app.use('/v1.0/users',
        header('apiKey').not().isEmpty(),
        validator.showError,
        APIKeyController.validate,
        router
    );
}