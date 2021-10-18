const express = require('express');
const { body } = require('express-validator');
const validator = require('../../../../../middlewares/validator.mw');
const UserController = require('../../../../../controllers/user/user.controller');
const FriendController = require('../../../../../controllers/friend/friend.controller');

const router = express.Router();

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

module.exports = router;