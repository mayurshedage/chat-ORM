const AppMessage = require('../constants/response.c');

exports.sendResponse = (params = {}) => {
    let msgType = params['key'];
    let code = params['code'];
    let param = params['input'] || '';
    let statusCode = params['statusCode'] || 200;
    let AppResponse = params['responder'];

    AppResponse.status(statusCode).json({
        data: {
            success: true,
            message: AppMessage.get(param)[msgType][code]
        }
    });
};

exports.sendError = (errorBody = {}, debug = false) => {
    let errorContainer = {};
    const errors = [ReferenceError, SyntaxError, TypeError];

    let msgType = errorBody['key'] || 'GLOBAL';
    let code = errorBody['code'] || 'INTERNAL_SERVER_ERROR';
    let param = errorBody['input'] || '';
    let trace = errorBody['trace'];
    let AppResponse = errorBody['responder'];
    let statusCode = errorBody['statusCode'] || 500;

    let ErrorMessage = AppMessage.get(param)[msgType][code];

    errors.forEach(e => {
        if (trace instanceof e) {
            code = trace.name;
            message = trace.message;
            trace = trace.stack;
        }
    });

    errorContainer = {
        error: {
            code: code,
            message: ErrorMessage
        }
    }
    if (debug) errorContainer['error']['trace'] = trace;

    return AppResponse.status(statusCode).json(errorContainer);
};

exports.removeEmptyValues = (obj) => {
    Object.keys(obj).forEach((key) => (obj[key] === undefined || obj[key] === null) && delete obj[key]);
    return obj;
};