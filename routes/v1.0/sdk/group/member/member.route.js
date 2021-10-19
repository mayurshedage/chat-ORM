const express = require('express');
const { body } = require('express-validator');
const validator = require('../../../../../middlewares/validator.mw');
const UserController = require('../../../../../controllers/user/user.controller');
const GroupController = require('../../../../../controllers/group/group.controller');
const GroupUserController = require('../../../../../controllers/group_user/group_user.controller');

const router = express.Router();

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

module.exports = router;