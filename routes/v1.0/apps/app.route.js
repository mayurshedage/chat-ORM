const express = require('express');
const { header } = require('express-validator');
const validator = require('../../../middlewares/validator.mw');
const AppController = require('../../../controllers/app/app.controller');

const router = express.Router();

module.exports = (app) => {
    router.post('/', AppController.create);

    app.use('/v1.0/apps',
        header('apiKey').not().isEmpty(),
        validator.showError,
        AppController.checkRegionSecret,
        router
    );
}