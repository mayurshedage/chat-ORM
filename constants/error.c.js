const HttpResponse = require('./httpcode.c');

exports.get = (error) => {
    const errorMessages = (params = []) => {
        return {
            'ERR_BAD_ERROR_RESPONSE': {
                message: `This is a server side error. Please check with the developer@support.`,
                responseCode: HttpResponse.HTTP_EXPECTATION_FAILED
            },
            'ERR_UID_NOT_FOUND': {
                message: `The uid ${params['uid']} not found. Make sure you have created a user with uid ${params['uid']}`,
                responseCode: HttpResponse.HTTP_NOT_FOUND
            },
            'ERR_UID_ALREADY_EXISTS': {
                message: `The uid ${params['uid']} already exists. Please use another uid or try after permanently deleting the user.`,
                responseCode: HttpResponse.HTTP_BAD_REQUEST
            },
            'ERR_CANNOT_FORM_SELF_RELATION': {
                message: `Self friend relationship cannot be formed.`,
                responseCode: HttpResponse.HTTP_FORBIDDEN
            },
            'ERR_ROLE_NOT_FOUND': {
                message: `The role ${params['role']} does not exist. Please use correct role or use create role API.`,
                responseCode: HttpResponse.HTTP_NOT_FOUND
            },
            'ERR_ROLE_ALREADY_EXISTS': {
                message: `The role ${params['role']} already exists. Please use another role or try after permanently deleting the role.`,
                responseCode: HttpResponse.HTTP_BAD_REQUEST
            },
        }
    }
    if (error.hasOwnProperty('code')) {
        if (!error.hasOwnProperty('params')) {
            error.params = [];
        }
        return errorMessages(error.params)[error.code];
    }
    return errorMessages()['ERR_BAD_ERROR_RESPONSE'];
}