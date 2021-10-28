const express = require('express');
const { body, header } = require('express-validator');

const validator = require('../../../../middlewares/validator.mw');
const rateLimiter = require('../../../../middlewares/rateLimiter.mw');
const APIKeyMiddleware = require('../../../../middlewares/checkAPIKey.mw');

const UserController = require('../../../../controllers/user/user.controller');

const FriendRoute = require('../user/friend/friend.route');
const AuthTokenRoute = require('../user/auth_token/auth_token.route');
const BlockedUserRoute = require('../user/blockeduser/blockeduser.route');

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

    app.use('/v1.0/admin/users',
        header('apiKey').not().isEmpty(),
        validator.showError,
        rateLimiter({ timeLimit: 10, allowedHits: 10 }),
        APIKeyMiddleware.checkAPIKey,
        AuthTokenRoute,
        FriendRoute,
        BlockedUserRoute,
        router
    );
}