const HttpResponse = require('./httpcode.c');

exports.get = (error) => {
    const errorMessages = (
        params = []
    ) => {
        return {
            'ERR_BAD_REGION_SECRET': {
                message: `Incorrect region secret.`,
                responseCode: HttpResponse.HTTP_BAD_REQUEST
            },
            'ERR_BAD_ERROR_RESPONSE': {
                message: `This is a server side error. Please check with the developer@support.`,
                responseCode: HttpResponse.HTTP_EXPECTATION_FAILED
            },
            'ERR_FAILED_CACHING_CONNECTION': {
                message: `This is a server side error. Please check with the developer@support.`,
                responseCode: HttpResponse.HTTP_EXPECTATION_FAILED
            },
            'ERR_OPERATION_FAILED': {
                message: `An error occured while performing this operation. 'Please try again.`,
                responseCode: HttpResponse.HTTP_INTERNAL_SERVER_ERROR
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
            'AUTH_ERR_APIKEY_NOT_FOUND': {
                message: `The key ${params['apikey']} does not exist. Please use correct apiKey.`,
                responseCode: HttpResponse.HTTP_NOT_FOUND
            },
            'AUTH_ERR_NO_ACCESS': {
                message: `The key ${params['apikey']} cannot be used to perform this operation. Please use API key with a correct scope to perform the operation.`,
                responseCode: HttpResponse.HTTP_FORBIDDEN
            },
            'AUTH_ERR_AUTH_TOKEN_NOT_FOUND': {
                message: `The auth token ${params['auth_token']} does not exist. Please make sure you are logged in and have a valid auth token or try login again.`,
                responseCode: HttpResponse.HTTP_UNAUTHORIZED
            },
            'ERR_CANNOT_BLOCK_SELF': {
                message: `The UID ${params['uid']} cannot block UID ${params['blockedUid']}.`,
                responseCode: HttpResponse.HTTP_UNAUTHORIZED
            },
            'ERR_GUID_NOT_FOUND': {
                message: `The group with guid ${params['guid']} not exists. Please use correct guid or use create group API.`,
                responseCode: HttpResponse.HTTP_NOT_FOUND
            },
            'ERR_GUID_ALREADY_EXISTS': {
                message: `The guid ${params['guid']} already exists. Please use another guid or try after permanently deleting the group.`,
                responseCode: HttpResponse.HTTP_BAD_REQUEST
            },
            'ERR_NOT_A_MEMBER': {
                message: `The user with uid ${params['uid']} is not a member of group with guid ${params['guid']}.`,
                responseCode: HttpResponse.HTTP_NOT_FOUND
            },
            'ERR_ALREADY_JOINED': {
                message: `The user with uid ${params['uid']}has already joined the group with guid ${params['guid']}.`,
                responseCode: HttpResponse.HTTP_EXPECTATION_FAILED
            },
            'ERR_CALL_SESSION_NOT_FOUND': {
                message: `Call session with sessionid ${params['sessionid']} does not exist.`,
                responseCode: HttpResponse.HTTP_NOT_FOUND
            },
            'ERR_CALLING_SELF': {
                message: `Initiator of a call cannot call himself.`,
                responseCode: HttpResponse.HTTP_BAD_REQUEST
            },
        }
    }
    if (error.hasOwnProperty('code')) {
        if (!error.hasOwnProperty('params')) {
            error['params'] = [];
        }
        return errorMessages(error['params'])[error['code']];
    }
    return errorMessages()['ERR_BAD_ERROR_RESPONSE'];
}