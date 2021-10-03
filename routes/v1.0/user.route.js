const express = require('express');
const UserController = require('../../controllers/user/user.controller');

const router = express.Router();

module.exports = (app) => {
    router.get('/', UserController.findAll);
    router.post('/', UserController.create);

    router
        .route('/:uid')
        .get(UserController.findOne)
        .put(UserController.update)
        .delete(UserController.delete);

    app.use('/v1.0/users', router);
}