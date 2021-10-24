const express = require('express');
const { body, header } = require('express-validator');

const validator = require('../../../../middlewares/validator.mw');
const APIKeyMiddleware = require('../../../../middlewares/checkAPIKey.mw');

const APIKeyController = require('../../../../controllers/apikey/apikey.controller');

const router = express.Router();

module.exports = (app) => {
    router.get('/', APIKeyController.findAll);
    router.post('/',
        [
            body('name').not().isEmpty(),
            body('scope').not().isEmpty()
        ],
        validator.showError,
        APIKeyController.create
    );

    router
        .route('/:apiKey')
        .get(APIKeyController.findOne)
        .put(
            [
                body('name').optional().not().isEmpty(),
                body('scope').optional().not().isEmpty()
            ],
            validator.showError,
            APIKeyController.update
        )
        .delete(APIKeyController.delete);

    app.use('/v1.0/admin/apikeys',
        header('apiKey').not().isEmpty(),
        validator.showError,
        APIKeyMiddleware.checkAPIKey,
        router
    );
}