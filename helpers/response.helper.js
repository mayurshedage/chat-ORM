const responseMessages = require('../constants/response.c');

exports.sendResponse = (params = {}) => {
    let key = params['key'];
    let code = params['code'];
    let input = params['input'] || '';
    let responder = params['responder'];
    let statusCode = params['statusCode'] || 200;

    let message = responseMessages.Messages(input)[key][code];

    responder.status(statusCode).json({
        data: {
            success: true,
            message: message
        }
    });
};

exports.sendError = (params = {}, debug = false) => {
    let errorObj = {};
    const errors = [ReferenceError, SyntaxError, TypeError];

    let key = params['key'] || 'GLOBAL';
    let code = params['code'] || 'INTERNAL_SERVER_ERROR';
    let input = params['input'] || '';
    let trace = params['trace'];
    let responder = params['responder'];
    let statusCode = params['statusCode'] || 500;

    let message = responseMessages.Messages(input)[key][code];

    errors.forEach(e => {
        if (trace instanceof e) {
            code = trace.name;
            message = message;
            trace = trace.stack;
        }
    });

    errorObj = {
        error: {
            code: code,
            message: message
        }
    }
    if (debug) errorObj['error']['trace'] = trace;

    return responder.status(statusCode).json(errorObj);
};

exports.removeEmptyValues = (obj) => {
    Object.keys(obj).forEach((key) => (obj[key] === undefined || obj[key] === null) && delete obj[key]);
    return obj;
};