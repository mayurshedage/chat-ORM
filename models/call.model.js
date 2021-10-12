'use strict';

module.exports = (sequelize, DataTypes) => {
    const Call = sequelize.define('call', {
        sessionid: {
            type: DataTypes.STRING(50),
            allowNull: false,
            primaryKey: true
        },
        conversationId: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        sender: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        receiver: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        receiverType: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ['group', 'user'],
            defaultValue: 'user'
        },
        data: {
            type: DataTypes.JSON
        },
        type: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ['video', 'audio', 'broadcast', 'screenshare', 'writeboard', 'whiteboard'],
            defaultValue: 'video'
        },
        status: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ['initiated', 'cancelled', 'unanswered', 'rejected', 'busy', 'ongoing', 'ended'],
            defaultValue: 'initiated'
        },
        initiatedAt: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        startedAt: {
            type: DataTypes.INTEGER(11)
        },
        endedAt: {
            type: DataTypes.INTEGER(11)
        }
    }, {
        timestamps: false,
        indexes: [
            {
                name: 'calls_sender_index',
                fields: ['sender']
            },
            {
                name: 'calls_receiver_receivertype_index',
                fields: [`receiver`, `receiverType`]
            },
            {
                name: 'calls_type_index',
                fields: ['type']
            },
            {
                name: 'calls_status_index',
                fields: ['status']
            },
            {
                name: 'calls_initiatedat_index',
                fields: ['initiatedAt']
            },
            {
                name: 'calls_startedat_index',
                fields: ['startedAt']
            },
            {
                name: 'calls_endedat_index',
                fields: ['endedAt']
            },
            {
                name: 'calls_convoid_index',
                fields: ['conversationId']
            }
        ]
    });
    Call.associate = function (models) {

    };
    return Call;
};