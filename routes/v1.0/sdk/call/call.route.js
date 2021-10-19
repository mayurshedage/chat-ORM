const express = require('express');
const { body, header } = require('express-validator');

const validator = require('../../../../middlewares/validator.mw');
const CallMiddleware = require('../../../../middlewares/checkCallSession.mw');
const AuthTokenMiddleware = require('../../../../middlewares/checkAuthToken.mw');

const CallController = require('../../../../controllers/call/call.controller');

const router = express.Router();

module.exports = (app) => {
    router.get('/', CallController.findAll);
    router.post('/',
        [
            body('receiver').not().isEmpty(),
            body('receiverType').not().isEmpty(),
            body('type').not().isEmpty(),
            body('status').not().isEmpty().custom(status => {
                if (
                    status != 'initiated'
                ) {
                    throw new Error('Status must be initiated.')
                } else {
                    return true;
                }
            })
        ],
        validator.showError,
        CallController.create
    );

    router
        .route('/:sessionid')
        .all(CallMiddleware.checkCallSession)
        .get(CallController.findOne)
        .put(
            [
                body('status').not().isEmpty(),
                body('joinedAt').optional().not().isEmpty(),
                body('metadata').optional().not().isEmpty()
            ],
            validator.showError,
            CallController.update
        )
        .delete(CallController.delete);

    app.use('/v1.0/calls',
        header('apiKey').not().isEmpty(),
        validator.showError,
        AuthTokenMiddleware.checkAuthToken,
        router
    );
}