const express = require('express');
const { body, header } = require('express-validator');
const validator = require('../../middlewares/request.validate');
const UserController = require('../../controllers/user/user.controller');
const APIKeyController = require('../../controllers/apikey/apikey.controller');
const AuthTokenController = require('../../controllers/auth_token/auth_token.controller');

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

    router.param('uid', AuthTokenController.checkUserExists);

    app.use('/v1.0/users',
        header('apiKey').not().isEmpty(),
        validator.showError,
        APIKeyController.validate,
        router
    );
}