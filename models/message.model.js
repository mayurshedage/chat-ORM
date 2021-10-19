'use strict';

module.exports = (
    sequelize, DataTypes
) => {
    const Message = sequelize.define('message', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        muid: {
            type: DataTypes.STRING(100)
        },
        conversationId: {
            type: DataTypes.STRING(255)
        },
        sender: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        receiverType: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ['group', 'user'],
            defaultValue: 'user'
        },
        receiver: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        category: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ['message', 'action', 'call', 'event', 'custom'],
            defaultValue: 'message'
        },
        type: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'text'
        },
        data: {
            type: DataTypes.JSON,
            defaultValue: false
        },
        senderOnly: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: '0'
        },
        sentAt: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.INTEGER(11)
        },
        editedBy: {
            type: DataTypes.STRING(100)
        },
        editedAt: {
            type: DataTypes.INTEGER(11)
        },
        deletedBy: {
            type: DataTypes.STRING(100)
        },
        deletedAt: {
            type: DataTypes.INTEGER(11)
        },
        deliveredAt: {
            type: DataTypes.INTEGER(11)
        },
        readAt: {
            type: DataTypes.INTEGER(11)
        }
    }, {
        timestamps: false,
        indexes: [
            {
                name: 'messages_sender_index',
                fields: ['sender']
            },
            {
                name: 'messages_receiver_index',
                fields: ['receiver']
            },
            {
                name: 'messages_receivertype_index',
                fields: ['receiverType']
            },
            {
                name: 'messages_sentat_index',
                fields: ['sentAt']
            },
            {
                name: 'messages_deliveredat_index',
                fields: ['deliveredAt']
            },
            {
                name: 'messages_readat_index',
                fields: ['readAt']
            },
            {
                name: 'messages_editedat_index',
                fields: ['editedAt']
            },
            {
                name: 'messages_deletedat_index',
                fields: ['deletedAt']
            },
            {
                name: 'messages_updatedat_index',
                fields: ['updatedAt']
            },
            {
                name: 'msg_convoid',
                fields: ['conversationId']
            },
            {
                name: 'msg_receivertype_receiver',
                fields: [`receiverType`, `receiver`]
            },
            {
                name: 'msg_category_type',
                fields: [`category`, `type`]
            },
            {
                name: 'msg_type',
                fields: [`type`]
            },
            {
                name: 'msg_convoid_sender_senderonly',
                fields: [`conversationId`, `sender`, `senderOnly`]
            },
            {
                name: 'msg_convoid_receivertype_receiver',
                fields: [`conversationId`, `receiverType`, `receiver`]
            },
            {
                name: 'msg_convoid_type',
                fields: [`conversationId`, `type`]
            },
            {
                name: 'msg_convoid_sentat_id',
                fields: [`conversationId`, `sentAt`, `id`]
            }
        ]
    });
    Message.associate = function (models) {

    }
    return Message;
}