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