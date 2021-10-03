const { validationResult } = require('express-validator');

exports.showError = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: {
                code: 'ER_BAD_REQUEST',
                message: 'Oops! invalid request. Please check the trace for more details.',
                trace: errors.mapped()
            }
        });
    }
    next();
};