const AppMessage = require('../constants/response.c');
const Success = require('../constants/success.c');
const Errors = require('../constants/error.c');

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

exports.getSuccessMessage = (success) => {
    return Success.get(success);
};

exports.getErrorMessage = (error) => {
    return Errors.get(error);
};

exports.send = (response) => {
    if (response.hasOwnProperty('data')) {
        if (response['data'].hasOwnProperty('code')) {
            let processSuccess = this.getSuccessMessage(response['data']);

            response['res'].status(200).json({
                data: {
                    success: true,
                    message: processSuccess['message']
                }
            });
        } else {
            response['res'].status(200).json({
                data: response['data']
            });
        }
    } else if (response.hasOwnProperty('error')) {
        let error = response['error'];
        let processError = this.getErrorMessage(error);
        let responseCode = processError['responseCode'];

        delete processError['responseCode'];

        let errorResponse = {
            code: error['code'],
            message: processError['message']
        }
        if (response['req'].hasOwnProperty('debug') && response['req']['debug'] == 1) {
            let trace = error['trace'];
            errorResponse['trace'] = 'Nothing to trace.';

            if (error.hasOwnProperty('trace')) {
                [ReferenceError, SyntaxError, TypeError, Error].forEach(e => {
                    if (error['trace'] instanceof e) {
                        errorResponse['trace'] = trace['stack'];
                        errorResponse['devMessage'] = trace['message'];
                    }
                });
            }
        }
        response['res'].status(responseCode).json({
            error: errorResponse
        });
    } else {
        let processError = this.getErrorMessage([]);

        response['res'].status(responseCode).json({
            error: {
                code: 'ERR_BAD_ERROR_RESPONSE',
                message: processError['message']
            }
        });
    }
};