const Success = require('../constants/success.c');
const Errors = require('../constants/error.c');
let { debugSQL } = require('./global.helper');

exports.getSuccessMessage = (success) => {
    return Success.get(success);
};

exports.getErrorMessage = (error) => {
    return Errors.get(error);
};

exports.send = (
    response = {}
) => {
    let responseData = {};
    let responseCode = 200;

    if (response.hasOwnProperty('data')) {
        if (
            response['data'].hasOwnProperty('code')
        ) {
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
        responseData['error'] = errorResponse;
    } else {
        let processError = this.getErrorMessage([]);

        responseData['error'] = {
            code: 'ERR_BAD_ERROR_RESPONSE',
            message: processError['message']
        }
    }

    if (
        response['req'].hasOwnProperty('debug') &&
        response['req']['debug'] == 1
    ) {
        let trace = Object.values(response['debugTrace']);
        let traceStack = false;

        [ReferenceError, SyntaxError, TypeError, Error].forEach(e => {
            if (
                trace &&
                trace[0] instanceof e
            ) {
                traceStack = trace[0]['stack']
            }
        });
        responseData['debug'] = {
            sql: debugSQL,
            trace: traceStack ?? response['debugTrace'] ?? {}
        }
    }
    response['res'].status(responseCode).json(responseData);
    debugSQL['operator'] = [];
};