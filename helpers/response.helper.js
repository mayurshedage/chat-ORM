const Success = require('../constants/success.c');
const Errors = require('../constants/error.c');

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
    let responseData = {};
    let responseCode = 200;

    if (response.hasOwnProperty('data')) {
        if (response['data'].hasOwnProperty('code')) {
            let processSuccess = this.getSuccessMessage(response['data']);

            responseData['data'] = {
                success: true,
                message: processSuccess['message']
            }
        } else {
            responseData['data'] = response['data']
        }
    } else if (response.hasOwnProperty('error')) {
        let error = response['error'];
        let processError = this.getErrorMessage(error);
        responseCode = processError['responseCode'];

        delete processError['responseCode'];

        let errorResponse = {
            code: error['code'],
            message: processError['message']
        }
        if (error.hasOwnProperty('trace')) {
            let trace = error['trace'];

            [ReferenceError, SyntaxError, TypeError, Error].forEach(e => {
                if (trace instanceof e) {
                    errorResponse['debug'] = {
                        trace: trace['stack']
                    };
                    errorResponse['devMessage'] = trace['message'];
                }
            });
        }
        responseData['error'] = errorResponse;
    } else {
        let processError = this.getErrorMessage([]);

        responseData['error'] = {
            code: 'ERR_BAD_ERROR_RESPONSE',
            message: processError['message']
        }
    }
    if (response['req'].hasOwnProperty('debug') && response['req']['debug'] == 1) {
        responseData['debug'] = {
            sql: response['res']['debugSQL'],
            trace: response['debugTrace'] ?? {}
        }
    }
    response['res'].status(responseCode).json(responseData);
};