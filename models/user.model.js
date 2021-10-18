'use strict';

module.exports = (
    sequelize, DataTypes
) => {
    const User = sequelize.define('user', {
        uid: {
            type: DataTypes.STRING(100),
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        avatar: {
            type: DataTypes.STRING(3000)
        },
        link: {
            type: DataTypes.STRING(255)
        },
        role: {
            type: DataTypes.STRING(50)
        },
        status: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ['available', 'busy', 'away', 'offline', 'invisible'],
            defaultValue: 'offline'
        },
        lastActiveAt: {
            type: DataTypes.INTEGER(11)
        },
        statusMessage: {
            type: DataTypes.TEXT
        },
        metadata: {
            type: DataTypes.JSON
        },
        credits: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            defaultValue: 0,
        },
        createdBy: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: 'API'
        },
        updatedBy: {
            type: DataTypes.STRING(100)
        },
        deletedBy: {
            type: DataTypes.STRING(100)
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
                name: 'users_name_index',
                fields: ['name']
            },
            {
                name: 'users_role_index',
                fields: ['role']
            },
            {
                name: 'users_status_index',
                fields: ['status']
            },
            {
                name: 'users_credits_index',
                fields: ['credits']
            },
            {
                name: 'users_lastactiveat_index',
                fields: ['lastActiveAt']
            },
            {
                name: 'users_createdat_index',
                fields: ['createdAt']
            },
            {
                name: 'users_createdby_index',
                fields: ['createdBy']
            },
            {
                name: 'users_status_name_uid_updatedat_index',
                fields: ['status', 'name', 'uid', 'updatedAt']
            },
            {
                type: 'FULLTEXT',
                name: 'users_name_ft_idx',
                fields: ['name']
            }
        ]
    });
    User.associate = function (models) {
        User.hasMany(models.friend, { foreignKey: 'uid' })
    };
    return User;
};