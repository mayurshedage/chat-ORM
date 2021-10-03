const express = require('express');
const { body, header } = require('express-validator');
const validator = require('../../middlewares/request.validate');
const UserController = require('../../controllers/user/user.controller');

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

    app.use('/v1.0/users', router);
}