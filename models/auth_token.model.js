'use strict';

module.exports = (sequelize, DataTypes) => {
    const AuthToken = sequelize.define('auth_token', {
        authToken: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true
        },
        uid: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        deviceId: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        apiKey: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        platform: {
            type: DataTypes.STRING(255)
        },
        userAgent: {
            type: DataTypes.STRING(255)
        },
        appInfo: {
            type: DataTypes.JSON
        },
        createdAt: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.INTEGER(11)
        },
        deletedAt: {
            type: DataTypes.INTEGER(11)
        },
    }, {
        timestamps: false,
        indexes: [
            {
                name: 'auth_tokens_uid_foreign',
                fields: ['uid']
            },
            {
                name: 'auth_tokens_apikey_index',
                fields: ['apiKey']
            },
            {
                name: 'auth_tokens_platform_index',
                fields: ['platform']
            },
            {
                name: 'auth_tokens_useragent_index',
                fields: ['userAgent']
            },
            {
                name: 'auth_tokens_deviceid_index',
                fields: ['deviceId']
            },
            {
                name: 'auth_tokens_deviceid_uid_deletedat_index',
                fields: ['deviceId', 'uid', 'deletedAt']
            },
            {
                name: 'auth_tokens_createdat_index',
                fields: ['createdAt']
            }
        ]
    });
    AuthToken.associate = function (models) {
        AuthToken.belongsTo(models.user, {
            foreignKey: { name: 'uid', allowNull: false },
            targetKey: 'uid',
            onDelete: 'cascade',
            onUpdate: 'restrict'
        });
    };
    return AuthToken;
};