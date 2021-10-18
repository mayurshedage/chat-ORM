const express = require('express');
const UserController = require('../../../../../controllers/user/user.controller');
const GroupController = require('../../../../../controllers/group/group.controller');
const GroupUserController = require('../../../../../controllers/group_user/group_user.controller');

const router = express.Router();

router
    .route('/:guid/bannedusers')
    .all(GroupController.checkGroupExists)
    .get((req, res) => {
        GroupUserController.findAll(req, res, { isBanned: 1 })
    })

router
    .route('/:guid/bannedusers/:uid')
    .all(
        GroupController.checkGroupExists,
        UserController.checkUserExists
    )
    .post((req, res) => {
        GroupUserController.banUnban('ban', req, res)
    })
    .delete((req, res) => {
        GroupUserController.banUnban('unban', req, res)
    })

module.exports = router;