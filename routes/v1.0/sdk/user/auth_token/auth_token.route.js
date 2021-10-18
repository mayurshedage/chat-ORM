const express = require('express');
const AuthTokenController = require('../../../../../controllers/auth_token/auth_token.controller');

const router = express.Router();

router
    .route('/:uid/auth_tokens')
    .get(AuthTokenController.findAll)
    .post(AuthTokenController.create)

router
    .route('/:uid/auth_tokens/:auth_token')
    .get(AuthTokenController.findOne)
    .put(AuthTokenController.update)
    .delete(AuthTokenController.delete)

module.exports = router;