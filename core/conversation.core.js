const getConversationId = (message) => {
    let conversationId;

    let sender = message['sender'].toLowerCase();
    let receiver = message['receiver'].toLowerCase();

    if (message['receiverType'] == 'group') {
        conversationId = 'group_' + sender;
    } else {
        if (sender > receiver) {
            conversationId = receiver + '_user_' + sender;
        } else {
            conversationId = sender + '_user_' + receiver;
        }
    }
    return conversationId;
};

module.exports = {
    getConversationId
};