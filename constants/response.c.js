exports.get = (params) => {
    return {
        APP: {
            'ER_APP_NOT_FOUND': `APP_ID ${params} is invalid.`,
            'BAD_REQUEST': 'APP_ID field is required.',
            'ER_ECONNREFUSED': `Unable to connect to caching server.`
        },
        USER: {
            'ER_DUP_ENTRY': `User with uid ${params} already exists.`,
            'ER_CREATING_USER': `Error occured while creating user.`,
            'ER_USER_NOT_FOUND': `User with uid ${params} doesn't exists.`,
            'MSG_USER_DELETED': `User ${params} has been deleted successfully.`,
        },
        GROUP: {
            'ER_DUP_ENTRY': `Group with guid ${params} already exists.`,
            'ER_GROUP_NOT_FOUND': `Group with guid ${params} doesn't exists.`,
            'MSG_GROUP_DELETED': `Group ${params} has been deleted successfully.`,
        },
        GROUP_USER: {
            'ER_DUP_ENTRY': `Group user with uid ${params} is already part of this group.`,
            'ER_GROUP_USER_NOT_FOUND': `Group user with uid ${params} doesn't seems to be a part of this group.`,
            'MSG_GROUP_USER_KICKED': `Group user ${params} has been kicked successfully from this group.`,
            'MSG_GROUP_USER_BANNED': `Group user ${params} is banned from a group.`,
            'MSG_GROUP_USER_UNBANNED': `Group user ${params} is unbanned from a group.`,
        },
        ROLE: {
            'ER_DUP_ENTRY': `Role ${params} already exists.`,
            'ER_ROLE_NOT_FOUND': `Role ${params} doesn't exists.`,
            'MSG_ROLE_DELETED': `Role ${params} has been deleted successfully.`,
        },
        API_KEY: {
            'ER_AUTH_NO_ACCESS': `The Key ${params} cannot be used to perform this operation. Please use API key with a correct scope to perform the operation.`,
            'ER_API_KEY_NOT_FOUND': `The Key ${params} doesn't exists.`,
            'ER_CREATING_API_KEY': `Error occured while creating Api Key.`,
            'MSG_API_KEY_DELETED': `The Key ${params} has been deleted successfully.`,
        },
        AUTH_TOKEN: {
            'ER_TOKEN_NOT_FOUND': `Auth token ${params} doesn't exists.`,
            'ER_INVALID_AUTH_TOKEN': `Auth token ${params} is not valid. Please create the new token.`,
            'ER_CREATING_TOKEN': `Error occured while creating Auth Token.`,
            'MSG_TOKEN_DELETED': `Auth token ${params} has been deleted successfully.`,
        },
        GLOBAL: {
            'SERVER_ERROR': `Internal server error.`,
            'ER_MISSING_FIELD': `${params} field is required and can't be empty.`,
            'ER_EMPTY_FIELD': `${params} field can't be empty.`,
            'ER_EMPTY_CONTENT': `Content body can't be empty`,
            'INTERNAL_SERVER_ERROR': `Something went wrong!!! Please try again later.`
        }
    }
}