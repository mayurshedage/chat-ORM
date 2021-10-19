const express = require('express');
const { body } = require('express-validator');
const validator = require('../../../../../middlewares/validator.mw');
const UserController = require('../../../../../controllers/user/user.controller');
const BlockedUserController = require('../../../../../controllers/blocked_user/blocked_user.controller');

const router = express.Router();

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

module.exports = router;