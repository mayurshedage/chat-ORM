'use strict';

module.exports = (sequelize, DataTypes) => {
    const ConversationUser = sequelize.define('conversation_user', {
        conversationId: {
            type: DataTypes.STRING(100),
            allowNull: false,
            primaryKey: true
        },
        uid: {
            type: DataTypes.STRING(100),
            allowNull: false,
            primaryKey: true
        },
        conversationType: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        conversationWith: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        messageId: {
            type: DataTypes.BIGINT
        },
        unreadMessageCount: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: '0'
        },
        lastReadMessageId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: '0'
        },
        createdAt: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.INTEGER(11)
        },
        isHidden: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: '0'
        },
        resettedAt: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: '0'
        },
    }, {
        timestamps: false,
        indexes: [
            {
                name: 'conversation_user_conversationid_index',
                fields: ['conversationId']
            },
            {
                name: 'conversation_user_uid_index',
                fields: ['uid']
            },
            {
                name: 'conversation_user_messageid_index',
                fields: ['messageId']
            },
            {
                name: 'conversation_user_conversationtype_index',
                fields: ['conversationType']
            },
            {
                name: 'conversation_user_conversationwith_index',
                fields: ['conversationWith']
            },
            {
                name: 'conversation_user_unreadmessagecount_index',
                fields: ['unreadMessageCount']
            },
            {
                name: 'conversation_user_createdat_index',
                fields: ['createdAt']
            },
            {
                name: 'conversation_user_updatedat_index',
                fields: ['updatedAt']
            },
            {
                name: 'conversation_user_conversationid_resettedat_ishiddedn_index',
                fields: [`conversationId`, `resettedAt`, `isHidden`]
            },
            {
                name: 'conversation_user_uid_resettedat_ishiddedn_index',
                fields: [`conversationId`, `resettedAt`, `isHidden`]
            },
            {
                name: 'cu_lastreadmessageid',
                fields: ['lastReadMessageId']
            },
            {
                name: 'cu_uid_hidden_type_unreadcount',
                fields: [`uid`, `isHidden`, `conversationType`, `unreadMessageCount`]
            },
            {
                name: 'cu_uid_hidden_unreadcount',
                fields: [`uid`, `isHidden`, `unreadMessageCount`]
            }
        ]
    });
    ConversationUser.associate = function (models) {
        ConversationUser.belongsTo(models.message, {
            foreignKey: { name: 'messageId' },
            targetKey: 'id',
            onDelete: 'set null',
            onUpdate: 'restrict'
        });
        ConversationUser.belongsTo(models.user, {
            foreignKey: { name: 'uid', allowNull: false },
            targetKey: 'uid',
            onDelete: 'cascade',
            onUpdate: 'restrict'
        });
    }
    return ConversationUser;
}