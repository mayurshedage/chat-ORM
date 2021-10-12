exports.get = (success) => {
    const successMessages = (params) => {
        return {
            OK_DEFAULT: {
                message: 'Operation is successful.'
            },
            OK_DELETED_USER: {
                message: `User ${params['uid']} has been deleted successfully.`
            },
            OK_GROUP_DELETED: {
                message: `Group ${params} has been deleted successfully.`
            },
            OK_GROUP_USER_KICKED: {
                message: `Group user ${params} has been kicked successfully from this group.`
            },
            OK_GROUP_USER_BANNED: {
                message: `Group user ${params} is banned from a group.`
            },
            OK_GROUP_USER_UNBANNED: {
                message: `Group user ${params} is unbanned from a group.`
            },
            OK_ROLE_DELETED: {
                message: `Role ${params} has been deleted successfully.`
            },
            OK_API_KEY_DELETED: {
                message: `The Key ${params} has been deleted successfully.`
            },
            OK_TOKEN_DELETED: {
                message: `Auth token ${params} has been deleted successfully.`
            }
        }
    }
    if (success.hasOwnProperty('code')) {
        if (!success.hasOwnProperty('params')) {
            success['params'] = [];
        }
        return successMessages(success['params'])[success['code']];
    }
    return successMessages()['OK_DEFAULT'];
}