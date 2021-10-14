exports.get = (success) => {
    const successMessages = (params) => {
        return {
            'OK_DEFAULT': {
                message: 'Operation is successful.'
            },
            'OK_DELETED_USER': {
                message: `User ${params['uid']} has been deleted successfully.`
            },
            'OK_CREATED_RELATIONSHIP_STATUS': {
                message: `Created relationship with status ${params['status']}.`
            },
            'OK_UPDATED_RELATIONSHIP_STATUS': {
                message: `Updated relationship with status ${params['status']}.`
            },
            'OK_DELETED_FRIEND_RELATIONS': {
                message: `Deleted the friend relations successfully.`
            },
            'OK_DELETED_ROLE': {
                message: `Role ${params['role']} has been deleted successfully.`
            },
            'OK_API_KEY_DELETED': {
                message: `The Api Key ${params['apikey']} has been deleted successfully.`
            },
            'OK_DELETED_AUTH_TOKEN': {
                message: `The Auth Token ${params['auth_token']} has been deleted successfully.`
            },
            'OK_UNBLOCKED': {
                message: `The user with UID ${params['uid']} has unblocked user with UID ${params['blockedUid']} successfully.`
            },
            'OK_BLOCKED': {
                message: `The user with UID ${params['uid']} has blocked user with UID ${params['blockedUid']} successfully.`
            },
            'OK_ALREADY_BLOCKED': {
                message: `The user with UID ${params['uid']} has already blocked user with UID ${params['blockedUid']}.`
            },
            'OK_ALREADY_UNBLOCKED': {
                message: `The user with UID ${params['uid']} has not blocked the user with UID ${params['blockedUid']}.`
            },
            'OK_DELETED_GROUP': {
                message: `Group ${params['guid']} has been deleted successfully.`
            },
            'OK_GROUP_LEFT': {
                message: `The user with ${params['uid']} has left the group with guid ${params['guid']}.`
            },
            'OK_BANNED_USER_FROM_GROUP': {
                message: `The user with uid ${params['uid']} has been banned from the Group with ${params['guid']}.`
            },
            'OK_UNBANNED_USER_FROM_GROUP': {
                message: `The user with uid ${params['uid']} has been unbanned from the Group ${params['guid']}.`
            },
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